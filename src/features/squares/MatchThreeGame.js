import { useDispatch, useSelector } from "react-redux"
import { selectAllSquares, sqauresGetNewImg, squaresToggled, squaresUpdated } from "./squaresSlice"
import { PointerSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core"
import { arraySwap } from "@dnd-kit/sortable"
import { isMobile } from "react-device-detect"
import useWindowDimensions from "../../utils/resize"
// Square images
import ppImg from '../../assets/pp.png'
import horseImg from '../../assets/horse.png'
import fishPng from '../../assets/fish.png'
import bigBroPng from '../../assets/bigbro.png'
import { useEffect, useReducer, useRef, useState } from "react"
import { Board } from "./Board"
import { CircularProgressbarWithChildren } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import { motion } from "framer-motion"

const initTimerProgressReducer = (initialTimerProgress) => initialTimerProgress

const timerProgressReducer = (state, action) => {
    switch (action.type) {
        case "countDown":
            return state - 1
        case 'reset':
            return initTimerProgressReducer(action.payload)
        default:
            return state
    }
}

export const MatchThreeGame = ({ parentRef }) => {
    const [gameSize, setGameSize] = useState({ width: 0, height: 0 })

    const dispatch = useDispatch()
    const squareImgs = [ppImg, horseImg, fishPng, bigBroPng]
    const squares = useSelector(selectAllSquares)
    const numOfSquaresPerRow = Math.sqrt(squares.length)
    const numOfRow = Math.sqrt(squares.length)
    const boardMargin = 0.1
    const { height: screenHeight, width: screenWidth } = useWindowDimensions()
    const initialTimerProgress = 4
    const boardRef = useRef()

    const minScreenSize = screenHeight < screenWidth ? gameSize.height : screenWidth
    const squareWidth = minScreenSize * (1-boardMargin*2) / numOfSquaresPerRow
    const squareHeight = minScreenSize * (1-boardMargin*2) / numOfSquaresPerRow

    const desktopSensors = useSensors(useSensor(PointerSensor))
    const mobileSensors = useSensors(useSensor(TouchSensor))

    // Squares refill/animations
    const [shouldRefill, setShouldRefill] = useState(false)
    const [animationStarted, setAnimationStarted] = useState(false)

    // Drag timer
    const [dragTimer, setDragTimer] = useState({
        show: false,
        x: 0, 
        y: 0
    })
    const [dragTimerIntervalId, setDragTimerIntervalId] = useState(null)
    const [stateTimerProgress, dispatchTimerProgress] = useReducer(timerProgressReducer, initialTimerProgress, initTimerProgressReducer)

    useEffect(() => {
        if (shouldRefill) {
            // refillSquares()
            setShouldRefill(false)
            dispatch(sqauresGetNewImg(squares.filter((square) => !square.show)))
            dispatch(squaresToggled(squares.filter((square) => !square.show)))
        }
    }, [shouldRefill])

    useEffect(() => {
        if (stateTimerProgress < 0) {
            handleOnDragEnd()
        }
    }, [stateTimerProgress])

    useEffect(() => {
        if (parentRef != null) {
            const parentDiv = parentRef.current
            const width = parentDiv ? parentDiv.offsetWidth : 0
            const height = parentDiv ? parentDiv.offsetHeight : 0
            setGameSize({ width, height })
        }
    }, [parentRef])

    const calculateSquaresChanged = () => {
        const checkComboInRow = (row) => {
            const combos = []
            let neighbouringSquares = []
            for (let i = 0; i < row.length - 1; i++) {
                if (row[i].img === row[i+1].img) {
                    if (neighbouringSquares.length === 0) {
                        neighbouringSquares.push(row[i])
                    }
                    neighbouringSquares.push(row[i+1])
                } else {
                    if (neighbouringSquares.length > 2) {
                        combos.push([...neighbouringSquares])
                    }
                    neighbouringSquares = []
                }
            }
            if (neighbouringSquares.length > 2) {
                combos.push([...neighbouringSquares])
            }
            return combos
        }

        const checkComboInColumn = (column) => {
            const combos = []
            let neighbouringSquares = []
            for (let i = 0; i < column.length - 1; i++) {
                if (column[i].img === column[i+1].img) {
                    if (neighbouringSquares.length === 0) {
                        neighbouringSquares.push(column[i])
                    }
                    neighbouringSquares.push(column[i+1])
                } else {
                    if (neighbouringSquares.length > 2) {
                        combos.push([...neighbouringSquares])
                    }
                    neighbouringSquares = []
                }
            }
            if (neighbouringSquares.length > 2) {
                combos.push([...neighbouringSquares])
            }
            return combos
        }

        const getRow = (index) => {
            const startIndex = index * numOfSquaresPerRow
            return squares.slice(startIndex, startIndex + numOfSquaresPerRow)
        }

        const getColumn = (index) => {
            const column = []
            for (let i = 0; i < numOfRow; i++) {
                column.push(squares[i * numOfSquaresPerRow + index])
            }
            return column
        }

        const rowCombos = []
        const columnCombos = []
        let intersectedCombos = [] // Special combo with row and column intersect
        for (let i = 0; i < numOfRow; i++) {
            const row = getRow(i)
            const column = getColumn(i)
            rowCombos.push(...checkComboInRow(row))
            columnCombos.push(...checkComboInColumn(column))
        }

        const intersections = []
        let i = 0
        while (rowCombos.length > 0 && columnCombos.length > 0 && i < rowCombos.length) {
            for (let j = 0; j < columnCombos.length; j++) {
                // Check if current row combo has intersected squares with any column combos
                rowCombos[i].filter((square) => columnCombos[j].includes(square)).forEach((square) => {
                    intersections.push(square)
                })
            }
            // Search next row combo
            i = i + 1
        }

        let rowCount = 0
        while (rowCount < rowCombos.length) {
            const combo = rowCombos[rowCount]
            if (combo.some((square) => intersections.includes(square))) {
                intersectedCombos.push(...rowCombos.splice(rowCount, 1))
            } else {
                rowCount = rowCount + 1
            }
        }
        let columnCount = 0
        while (columnCount < columnCombos.length) {
            const combo = columnCombos[columnCount]
            if (combo.some((square) => intersections.includes(square))) {
                intersectedCombos.push(...columnCombos.splice(columnCount, 1))
            } else {
                columnCount = columnCount + 1
            }
        }
        
        let hasMatchedCombo = true
        while (intersectedCombos.length > 0 && hasMatchedCombo) {
            intersectedCombos = intersectedCombos.reduce((prevCombos, currentCombo) => {
                hasMatchedCombo = false
                const newPrevCombos = prevCombos.map((combo) => {
                    if (combo.some(square => currentCombo.includes(square))) {
                        hasMatchedCombo = true
                        return [...new Set([...combo, ...currentCombo])]
                    } else {
                        return [...combo]
                    }
                })
                if (hasMatchedCombo) {
                    return newPrevCombos
                } else {
                    return [...newPrevCombos, [...currentCombo]]
                }
            }, [])
        }

        const result = {
            rowCombos,
            columnCombos,
            intersectedCombos
        }

        console.log('calculateSquaresChanged result', result)

        return result
    }

    const handleOnMouseMove = (e) => {
        const relativeCoordinates = getRelativeCoordinates(e, boardRef.current)
        setDragTimer({
            ...dragTimer,
            x: relativeCoordinates.x, 
            y: relativeCoordinates.y
        })
    }

    const handleOnDragOver = () => {
        if (dragTimerIntervalId == null) {
            dispatchTimerProgress({ type: 'reset', payload: initialTimerProgress })
            setDragTimer({
                ...dragTimer,
                show: true
            })
            setDragTimerIntervalId(
                setInterval(() => {
                    dispatchTimerProgress({ type: 'countDown' })
                }, 1000)
            )
        }
    }

    const handleOnDragEnd = () => {
        setDragTimer({
            ...dragTimer,
            show: false
        })
        if (dragTimerIntervalId != null) {
            clearInterval(dragTimerIntervalId)
            setDragTimerIntervalId(null)
        }

        const result = calculateSquaresChanged()
        
        const comboSqaures = result.rowCombos.concat(result.columnCombos).concat(result.intersectedCombos).flat()
        if (comboSqaures.length > 0) {
            setAnimationStarted(true)
            dispatch(squaresToggled(comboSqaures))
        }
    }

    const refillSquares = () => {
        let tempSquares = squares.slice()
        for (let i = 0; i < numOfSquaresPerRow; i++) {
            const squareIndexes = []
            const index = i
            for (let j = 0; j < numOfSquaresPerRow; j++) {
                squareIndexes.push(j * numOfSquaresPerRow + index)
            }
            for (let j = 0; j < squareIndexes.length; j++) {
                for (let k = 0; k < squareIndexes.length - j - 1; k++) {
                    if (tempSquares[squareIndexes[k]].show && !tempSquares[squareIndexes[k+1]].show) {
                        tempSquares = arraySwap(tempSquares, squareIndexes[k], squareIndexes[k+1])
                    }
                }
            }
        }
        dispatch(squaresUpdated(tempSquares))
    }

    const handleOnAnimationComplete = () => {
        if (animationStarted) {
            setAnimationStarted(false)
            setShouldRefill(true)
        }
    }

    const getRelativeCoordinates = (event, referenceElement) => {
        const position = {
            x: event.pageX,
            y: event.pageY
        }

        const offset = {
            left: referenceElement.offsetLeft,
            top: referenceElement.offsetTop,
            width: referenceElement.clientWidth,
            height: referenceElement.clientHeight
        }

        let reference = referenceElement.offsetParent;

        while (reference) {
            offset.left += reference.offsetLeft;
            offset.top += reference.offsetTop;
            reference = reference.offsetParent;
        }

        return {
            x: position.x - offset.left,
            y: position.y - offset.top,
            width: offset.width,
            height: offset.height,
            centerX: (position.x - offset.left - offset.width / 2) / (offset.width / 2),
            centerY: (position.y - offset.top - offset.height / 2) / (offset.height / 2)
        }
    }

    return (
        <div 
            className="board-wrapper" 
            style={{ width: minScreenSize }} 
            onMouseMove={!isMobile ? handleOnMouseMove : null}
            onPointerMove={isMobile ? handleOnMouseMove : null}
        >
            <motion.div className="drag-timer"
                style={{
                    width: squareWidth * 2/3,
                    visibility: dragTimer.show ? 'inherit' : 'hidden'
                }}
                animate={{
                    x: dragTimer.x - squareWidth * 2/3,
                    y: dragTimer.y - squareHeight * 2/3,
                    opacity: dragTimer.show ? 1 : 0
                }}
            >
                <CircularProgressbarWithChildren
                    counterClockwise 
                    value={stateTimerProgress / initialTimerProgress * 100}
                    strokeWidth={20}
                    style={{
                        opacity: dragTimer.show ? 1 : 0
                    }}
                >
                </CircularProgressbarWithChildren>
            </motion.div>
            <div 
                className="board" 
                ref={boardRef}
                style={{margin: boardMargin * 100 + '%'}}
            >
                <Board 
                    sensors={isMobile ? mobileSensors : desktopSensors}
                    squares={squares}
                    squareWidth={squareWidth}
                    squareHeight={squareHeight}
                    squareImgs={squareImgs}
                    onDragOver={handleOnDragOver}
                    onDragEnd={handleOnDragEnd}
                    onAnimationComplete={handleOnAnimationComplete}
                />
            </div>
        </div>
    )
}