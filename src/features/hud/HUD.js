import { useEffect, useRef, useState } from "react"
import useWindowDimensions from "../../utils/resize"
import { PingPong } from "../pingpong/PingPong"
import { MatchThreeGame } from "../squares/MatchThreeGame"

export const HUD = () => {
    const gameAreaToWindowHeightRatio = 0.6
    const mainAreaRef = useRef()
    const ref = useRef()
    const { height: screenHeight, width: screenWidth } = useWindowDimensions()
    const [gameAreaWidth, setGameAreaWidth] = useState(0)

    useEffect(() => {
        const minGameAreaWidth = screenHeight < screenWidth ? screenHeight * gameAreaToWindowHeightRatio : screenWidth
        setGameAreaWidth(minGameAreaWidth)
    })

    return (
        <div ref={mainAreaRef} className="main-area">
            <div className="view-area">
                Character/Enemy/Story View
            </div>
            <div 
                className="game-area" 
                ref={ref}
                style={{
                    width: gameAreaWidth
                }}>
                {/* Game Area */}
                {/* <MatchThreeGame parentRef={ref} /> */}
                <PingPong 
                    gameAreaWidth={gameAreaWidth} 
                    mainAreaRef={mainAreaRef} 
                />
            </div>
        </div>
    )
}