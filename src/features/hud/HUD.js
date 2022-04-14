import { motion } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import useWindowDimensions from "../../utils/resize"
import { PingPong } from "../PingPong/PingPong"
import { MatchThreeGame } from "../Squares/MatchThreeGame"
import { GAME_MATCH_THREE, GAME_PING_PONG } from "./HUD.constants"

export const HUD = ({ currentGame }) => {
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
        <motion.div 
            ref={mainAreaRef} 
            className="main-area"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
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
                {currentGame === GAME_MATCH_THREE ? (
                    <MatchThreeGame parentRef={ref} />
                ) : null}
                {currentGame === GAME_PING_PONG ? (
                    <PingPong 
                        gameAreaWidth={gameAreaWidth} 
                        mainAreaRef={mainAreaRef} 
                    />
                ) : null}
            </div>
        </motion.div>
    )
}