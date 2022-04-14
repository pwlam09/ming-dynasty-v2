import { faCircleArrowLeft, faCircleArrowRight } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { motion, useAnimation } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import tntImg from "../../assets/pixel-TNT.png"
import doorLeafCloseImg from "../../assets/doors_leaf_closed.png"
import doorLeafOpenImg from "../../assets/doors_leaf_open.png"
import doorFrameTopImg from "../../assets/doors_frame_top.png"
import doorFrameLeftImg from "../../assets/doors_frame_left.png"
import doorFrameRightImg from "../../assets/doors_frame_righ.png"

export const PingPong = ({ gameAreaWidth }) => {
    const gameBoundingRectRef = useRef()
    const targetRef = useRef()
    const playerSlideRef = useRef()
    const KEY_LEFT = 37
    const KEY_RIGHT = 39
    const DISPLACEMENT = gameAreaWidth * 0.075
    const DIRECTION_LEFT = 'left'
    const DIRECTION_RIGHT = 'right'
    const [arrowLeftClicked, setArrowLeftClicked] = useState(false)
    const [arrowRightClicked, setArrowRightClicked] = useState(false)
    const [gameStart, setGameStart] = useState(false)
    const [playerPosition, setPlayerPosition] = useState(0)
    const [targetAnimations, setTargetAnimations] = useState([])
    const [currTargetAnimation, setCurrTargetAnimation] = useState([{ x: 0, y: 0 }])
    const targetAnimationControls = useAnimation()
    const targetCollisionRef = useRef()

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
            await targetAnimationControls.start({ opacity: 0 })
            
            setTargetAnimations([])
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

    const spawnTarget = async () => {
        if (targetRef && targetRef.current && gameBoundingRectRef && gameBoundingRectRef.current) {
            const targetRect = targetRef.current.getBoundingClientRect()
            const wallRect = gameBoundingRectRef.current.getBoundingClientRect()
            let animations = []
            const defaultX = wallRect.width / 2
            while (animations.length == 0 || animations[animations.length-1].y < wallRect.height) {
                if (animations.length > 0) {
                    const lastToLeft = animations[animations.length-1].x < 0 ? true : false
                    const x = defaultX * (lastToLeft ? 1 : -1) + (lastToLeft ? -targetRect.width / 2 : targetRect.width / 2)
                    const y = animations[animations.length-1].y + animations[0].y * 2
                    animations.push({ x, y })
                } else {
                    let x = defaultX * (Math.round(Math.random()) * 2 - 1)
                    const toLeft = x < 0 ? true : false
                    if (toLeft) {
                        x = x + targetRect.width / 2
                    } else {
                        x = x - targetRect.width / 2
                    }
                    const y = Math.random() * (wallRect.height * 0.75)
                    animations.push({ x, y })
                }
            }
            animations = [{ x: 0, y: 0 }, ...animations]
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
            <div>
                <img className="door door-top" src={doorFrameTopImg} />
            </div>
            <div>
                <img className="door" src={doorFrameLeftImg} />
                {!(currTargetAnimation && targetAnimations.length > 0 && currTargetAnimation.y === targetAnimations[0].y) ? (
                    <img className="door door-main" src={doorLeafCloseImg} />
                ) : null} 
                {(currTargetAnimation && targetAnimations.length > 0 && currTargetAnimation.y === targetAnimations[0].y) ? (
                    <img className="door door-main" src={doorLeafOpenImg} />
                ) : null} 
                <img className="door" src={doorFrameRightImg} />
            </div>
            {/* Opponent */}
        </div>
    )

    const targetObject = (
        gameStart ? (
            <motion.div 
                ref={targetRef}
                className="tnt"
                style={{
                    visibility: gameStart ? 'inherit' : 'hidden'
                }}
                animate={targetAnimationControls}
                transition={{ ease: "easeOut", duration: 1 }}
                onAnimationComplete={() => {
                    if (targetAnimations && targetAnimations.length > 0) {
                        const nextIndex = (targetAnimations.findIndex((a) => a.y === currTargetAnimation.y) + 1) % targetAnimations.length
                        console.log(nextIndex, targetAnimations)
                        setCurrTargetAnimation(targetAnimations[nextIndex])
                        targetAnimationControls.start(targetAnimations[nextIndex])
                    }
                }}
            >
                <img src={tntImg} />
            </motion.div>
        ) : null
    )

    const playerSlide = (
        <motion.div 
            ref={playerSlideRef}
            className="player-slide"
            onClick={() => {
                setGameStart(true)
                setTimeout(() => spawnTarget(), 0)
            }}
            animate={{
                x: playerPosition
            }}
            transition={{ bounce: 0 }}
        />
    )

    return (
        <div className="ping-pong-wrapper">
            <div ref={gameBoundingRectRef} className="ping-pong">
                {opponent}
                {targetObject}
                {playerSlide}
                <FontAwesomeIcon
                    style={{
                        opacity: arrowLeftClicked ? 0.75 : 0.25
                    }}
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
                    icon={faCircleArrowLeft} 
                />
                <FontAwesomeIcon 
                    style={{
                        opacity: arrowRightClicked ? 0.75 : 0.25
                    }}
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
                    icon={faCircleArrowRight} 
                />
            </div>
        </div>
    )
}