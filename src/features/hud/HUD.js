import { motion } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import useWindowDimensions from "../../utils/resize"
import { PingPong } from "../PingPong/PingPong"
import { MatchThreeGame } from "../Squares/MatchThreeGame"
import { GAME_MATCH_THREE, GAME_PING_PONG } from "./HUD.constants"
import buttonSettingsImg from "../../assets/controls/button_settings.png"
import buttonSettingsPressedImg from "../../assets/controls/button_settings_pressed.png"
import { Settings } from "../Settings/Settings"
import { useDispatch } from "react-redux"
import { currentPageChanged } from "../MainController/mainControllerSlice"
import { MAIN_MENU } from "../MainController/MainController.constants"

export const HUD = (props) => {
    const dispatch = useDispatch()
    const gameAreaToWindowHeightRatio = 0.6
    const mainAreaRef = useRef()
    const ref = useRef()
    const { height: screenHeight, width: screenWidth } = useWindowDimensions()
    const [gameAreaWidth, setGameAreaWidth] = useState(0)
    const [showSettings, setShowSettings] = useState(false)

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
            exit={{ opacity: 0 }}
        >
            {showSettings ? (
                <Settings
                    onMouseUpExit={() => dispatch(currentPageChanged(MAIN_MENU))}
                    onMouseUpBack={() => setShowSettings(false)}
                />
            ) : null}
            <div className="view-area">
                <img 
                    className="settings-button" 
                    onMouseDown={(e) => {
                        e.target.src = buttonSettingsPressedImg
                    }}
                    onMouseUp={(e) => {
                        e.target.src = buttonSettingsImg
                        setShowSettings(true)
                    }}
                    src={buttonSettingsImg} 
                />
                Character/Enemy/Story View
            </div>
            <div 
                className="game-area" 
                ref={ref}
                style={{
                    width: gameAreaWidth
                }}>
                {/* Game Area */}
                {props.currentGame === GAME_MATCH_THREE ? (
                    <MatchThreeGame parentRef={ref} />
                ) : null}
                {props.currentGame === GAME_PING_PONG ? (
                    <PingPong 
                        gameAreaWidth={gameAreaWidth} 
                        mainAreaRef={mainAreaRef} 
                    />
                ) : null}
            </div>
        </motion.div>
    )
}