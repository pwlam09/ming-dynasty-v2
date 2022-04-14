import { motion } from "framer-motion"

export const GameList = (props) => {
    return (
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
                onPointerDown={() => props.onGameListPointerDown('PingPong')}
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
                onPointerDown={() => props.onGameListPointerDown('MatchThree')}
            >
                2. Match Three
            </motion.div>
        </motion.div>
    )
}