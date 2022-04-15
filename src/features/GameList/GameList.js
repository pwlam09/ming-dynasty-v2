import { AnimatePresence, motion } from "framer-motion"
import { useDispatch } from "react-redux"
import { GAME_MATCH_THREE, GAME_PING_PONG } from "../HUD/HUD.constants"
import { currentPageChanged } from "../MainController/mainControllerSlice"

export const GameList = () => {
    const dispatch = useDispatch()

    return (
        <AnimatePresence>
            <motion.div    
                className="game-list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <motion.div 
                    className="game-name"
                    onMouseOver={(e) => {
                        e.target.style.opacity = 0.25
                    }}
                    onMouseOut={(e) => {
                        e.target.style.opacity = 1
                    }}
                    onPointerDown={() => dispatch(currentPageChanged(GAME_PING_PONG))}
                >
                    1. Ping Pong
                </motion.div>
                <motion.div 
                    className="game-name"
                    onMouseOver={(e) => {
                        e.target.style.opacity = 0.25
                    }}
                    onMouseOut={(e) => {
                        e.target.style.opacity = 1
                    }}
                    onPointerDown={() => dispatch(currentPageChanged(GAME_MATCH_THREE))}
                >
                    2. Match Three
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}