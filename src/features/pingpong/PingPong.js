import { motion, useAnimation } from "framer-motion"
import { cloneElement, useEffect, useRef, useState } from "react"
import tntImg from "../../assets/pixel-TNT.png"
import doorLeafCloseImg from "../../assets/doors_leaf_closed.png"
import doorLeafOpenImg from "../../assets/doors_leaf_open.png"
import doorFrameTopImg from "../../assets/doors_frame_top.png"
import doorFrameLeftImg from "../../assets/doors_frame_left.png"
import doorFrameRightImg from "../../assets/doors_frame_righ.png"
import buttonLeftImg from "../../assets/controls/button_left.png"
import buttonLeftPressedImg from "../../assets/controls/button_left_pressed.png"
import buttonRightImg from "../../assets/controls/button_right.png"
import buttonRightPressedImg from "../../assets/controls/button_right_pressed.png"
import { BEGINNER, DEFAULT_TARGET_MOVE_DURATION, DIRECTION_LEFT, DIRECTION_RIGHT, KEY_LEFT, KEY_RIGHT } from "./PingPong.constants"
import { Target } from "./Target"

export const PingPong = ({ gameAreaWidth }) => {
    const gameBoundingRectRef = useRef()
    const targetRef = useRef()
    const playerSlideRef = useRef()
    const DISPLACEMENT = gameAreaWidth * 0.075
    const [arrowLeftClicked, setArrowLeftClicked] = useState(false)
    const [arrowRightClicked, setArrowRightClicked] = useState(false)
    const [gameStart, setGameStart] = useState(false)
    const [playerPosition, setPlayerPosition] = useState(0)
    const [targetAnimations, setTargetAnimations] = useState([])
    const [currTargetAnimation, setCurrTargetAnimation] = useState([{ x: 0, y: 0, duration: DEFAULT_TARGET_MOVE_DURATION }])
    const targetAnimationControls = useAnimation()
    const targetCollisionRef = useRef()
    const [difficulty, setDifficulty] = useState(BEGINNER)

    useEffect(() => {
        return () => {
            console.log('clean up!')
            clearInterval(targetCollisionRef.current)
        }
    }, [])

    useEffect(() => {    
        window.addEventListener('keydown', checkKeyPress)

        return () => {
            window.removeEventListener('keydown', checkKeyPress)
        }
    }, [playerPosition, gameAreaWidth])

    const checkTargetState = async () => {
        const isTargetGet = checkTargetGet()
        const isTargetLoss = checkTargetLoss()
        if (isTargetGet || isTargetLoss) {
            if (targetCollisionRef.current) {
                clearInterval(targetCollisionRef.current)
            }
            console.log('isTargetGet', isTargetGet, 'isTargetLoss', isTargetLoss)

            targetAnimationControls.stop()
            await targetAnimationControls.start({ opacity: 0, transition: { duration: 0.5 } })
            
            setTargetAnimations([])
            setCurrTargetAnimation(null)
            setGameStart(false)
        }
    }

    const checkKeyPress = (e) => {
        const { keyCode } = e

        switch (keyCode) {
            case KEY_LEFT:
                movePlayer(DIRECTION_LEFT)
                break
            case KEY_RIGHT:
                movePlayer(DIRECTION_RIGHT)
                break
        }
    }

    const movePlayer = (direction) => {
        let newPlayerPosition = 0
        if (direction === 'left') {
            newPlayerPosition = playerPosition - DISPLACEMENT
        } else {
            newPlayerPosition = playerPosition + DISPLACEMENT
        }
        if (playerSlideRef 
            && playerSlideRef.current 
            && gameBoundingRectRef
            && gameBoundingRectRef.current) {
            const maxDisplacement = gameBoundingRectRef.current.clientWidth / 2 - playerSlideRef.current.clientWidth / 2
            if (Math.abs(newPlayerPosition) > gameBoundingRectRef.current.clientWidth / 2 - playerSlideRef.current.clientWidth / 2) {
                newPlayerPosition = newPlayerPosition / Math.abs(newPlayerPosition) * maxDisplacement
            }
            setPlayerPosition(newPlayerPosition)
        }
    }

    const spawnTargetBeginner = () => {
        if (targetRef && targetRef.current && gameBoundingRectRef && gameBoundingRectRef.current) {
            const targetRect = targetRef.current.getBoundingClientRect()
            const wallRect = gameBoundingRectRef.current.getBoundingClientRect()
            const animations = []
            const defaultX = Math.random() * (wallRect.width - targetRect.width) - (wallRect.width - targetRect.width) / 2
            animations.push({ x: defaultX, y: 0, duration: 0.5 })
            animations.push({ x: defaultX, y: wallRect.height, duration: DEFAULT_TARGET_MOVE_DURATION })
            setTargetAnimations(animations)
            setCurrTargetAnimation(animations[0])

            targetCollisionRef.current = setInterval(() => {
                console.log('start check!')
                checkTargetState()
            }, 100)
    
            targetAnimationControls.start(animations[0])
        }
    }

    const spawnTarget = async () => {
        if (targetRef && targetRef.current && gameBoundingRectRef && gameBoundingRectRef.current) {
            const targetRect = targetRef.current.getBoundingClientRect()
            const wallRect = gameBoundingRectRef.current.getBoundingClientRect()
            const animations = []
            const defaultX = wallRect.width / 2
            while (animations.length == 0 || animations[animations.length-1].y < wallRect.height) {
                if (animations.length > 0) {
                    const lastToLeft = animations[animations.length-1].x < 0 ? true : false
                    const x = defaultX * (lastToLeft ? 1 : -1) + (lastToLeft ? -targetRect.width / 2 : targetRect.width / 2)
                    const y = animations[animations.length-1].y + animations[0].y * 2
                    const prevY = animations[animations.length-1].y
                    animations.push({ x, y, duration: y / (y - prevY) * DEFAULT_TARGET_MOVE_DURATION })
                } else {
                    let x = defaultX * (Math.round(Math.random()) * 2 - 1)
                    const toLeft = x < 0 ? true : false
                    if (toLeft) {
                        x = x + targetRect.width / 2
                    } else {
                        x = x - targetRect.width / 2
                    }
                    const y = Math.random() * (wallRect.height * 0.75 - 100) + 100
                    animations.push({ x, y, duration: DEFAULT_TARGET_MOVE_DURATION })
                }
            }
            setTargetAnimations(animations)
            setCurrTargetAnimation(animations[0])

            targetCollisionRef.current = setInterval(() => {
                console.log('start check!')
                checkTargetState()
            }, 100)
    
            targetAnimationControls.start(animations[0])
        }
    }

    const checkTargetLoss = () => {
        if (targetRef && targetRef.current && gameBoundingRectRef && gameBoundingRectRef.current) {
            const targetRect = targetRef.current.getBoundingClientRect()
            const wallRect = gameBoundingRectRef.current.getBoundingClientRect()
            if (targetRect.y >= wallRect.y + wallRect.height) {
                return true
            }
        }
        return false
    }

    const checkTargetGet = () => {
        if (targetRef && targetRef.current && playerSlideRef && playerSlideRef.current) {
            const targetRect = targetRef.current.getBoundingClientRect()
            const playerSlideRect = playerSlideRef.current.getBoundingClientRect()
            if (targetRect.x + targetRect.width >= playerSlideRect.x 
                && targetRect.x <= playerSlideRect.x + playerSlideRect.width
                && targetRect.y + targetRect.height >= playerSlideRect.y) {
                return true
            }
        }
        return false
    }

    const opponent = (
        <div className="opponent">
            <div className="door-wrapper">
                <img className="door door-top" src={doorFrameTopImg} />
            </div>
            <div className="door-wrapper">
                <img className="door" src={doorFrameLeftImg} />
                {!(currTargetAnimation && targetAnimations.length > 0 && currTargetAnimation.y === targetAnimations[0].y) ? (
                    <img className="door door-main" src={doorLeafCloseImg} />
                ) : null} 
                {(currTargetAnimation && targetAnimations.length > 0 && currTargetAnimation.y === targetAnimations[0].y) ? (
                    <img className="door door-main" src={doorLeafOpenImg} />
                ) : null} 
                <img className="door" src={doorFrameRightImg} />
            </div>
        </div>
    )

    const targetObject = (
        gameStart ? (
            <Target 
                ref={targetRef}
                targetAnimationControls={targetAnimationControls}
                targetImg={tntImg}
                targetAnimations={targetAnimations}
            />
        ) : null
    )

    const playerSlide = (
        <motion.div 
            ref={playerSlideRef}
            className="player-slide"
            animate={{
                x: playerPosition
            }}
            transition={{ bounce: 0 }}
        />
    )

    return (
        <div className="ping-pong-wrapper">
            <div ref={gameBoundingRectRef} className="ping-pong">
                {/* {opponent} */}
                {targetObject}
                {playerSlide}
                {!gameStart ? (
                    <div 
                        className="ping-pong-click-to-start"
                        onClick={() => {
                            setGameStart(true)
                            setTimeout(() => spawnTargetBeginner(), 0)
                        }}
                    >
                        Click to Start
                    </div>
                ) : null}
                <div
                    onMouseDown={() => {
                        movePlayer(DIRECTION_LEFT)
                        setArrowLeftClicked(true) 
                    }}
                    onMouseUp={() => { setArrowLeftClicked(false) }}
                    onTouchStart={() => {
                        movePlayer(DIRECTION_LEFT)
                        setArrowLeftClicked(true)
                    }}
                    onTouchEnd={() => { setArrowLeftClicked(false) }}
                    className="move-icon arrow-left" 
                >
                    <img src={arrowLeftClicked ? buttonLeftPressedImg : buttonLeftImg} />
                </div>
                <div
                    onMouseDown={() => {
                        movePlayer(DIRECTION_RIGHT)
                        setArrowRightClicked(true)
                    }}
                    onMouseUp={() => { setArrowRightClicked(false) }}
                    onTouchStart={() => {
                        movePlayer(DIRECTION_RIGHT)
                        setArrowRightClicked(true)
                    }}
                    onTouchEnd={() => { setArrowRightClicked(false) }}
                    className="move-icon arrow-right" 
                >
                    <img src={arrowRightClicked ? buttonRightPressedImg : buttonRightImg} />
                </div>
            </div>
        </div>
    )
}