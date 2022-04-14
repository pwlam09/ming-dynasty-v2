import ppImg from '../../assets/pp.png'
import horseImg from '../../assets/horse.png'
import fishPng from '../../assets/fish.png'
import bigBroPng from '../../assets/bigbro.png'
import { IdleBigBro } from '../Characters/idle/IdleBigBro'
import { IdlePP } from '../Characters/idle/IdlePP'
import { IdleHorse } from '../Characters/idle/IdleHorse'
import { IdleFish } from '../Characters/idle/IdleFish'
import bigBroCharImg from "../../assets/sprites/bigbro/idle/lizard_m_idle_anim_f0.png"
import ppCharImg from "../../assets/sprites/pp/idle/knight_f_idle_anim_f0.png"
import horseCharImg from "../../assets/sprites/horse/idle/wizzard_f_idle_anim_f0.png"
import fishCharImg from "../../assets/sprites/fish/idle/elf_f_idle_anim_f0.png"
import { AnimatePresence, motion, useCycle } from 'framer-motion'
import { useEffect, useState } from 'react'
import { HUD } from '../HUD/HUD'
import { GameList } from '../GameList/GameList'

export const MainMenu = () => {
    const GAME_PING_PONG = "PingPong"
    const GAME_MATCH_THREE = "MatchThree"
    const characterMappings = [
        { img: ppImg, sprite: <IdlePP />, charImg: ppCharImg }, 
        { img: horseImg, sprite: <IdleHorse />, charImg: horseCharImg }, 
        { img: fishPng, sprite: <IdleFish />, charImg: fishCharImg }, 
        { img: bigBroPng, sprite: <IdleBigBro />, charImg: bigBroCharImg }
    ]
    const [flashingState, cycleFlashingState] = useCycle(1, 0)
    const [gameStarted, setGameStarted] = useState(false)
    const [showGameList, setShowGameList] = useState(false)
    const [showHUD, setShowHUD] = useState(false)
    const [currentGame, setCurrentGame] = useState()

    useEffect(() => {
        cycleFlashingState()
    }, [])

    const handleGameListOnPointerDown = (gameName) => {
        switch (gameName) {
            case GAME_PING_PONG:
                setCurrentGame(GAME_PING_PONG)
                break
            case GAME_MATCH_THREE:
                setCurrentGame(GAME_MATCH_THREE)
                break
        }
        setShowGameList(false)
    }

    return (
        <div className="menu-controls-wrapper">
            <AnimatePresence
                onExitComplete={() => {
                    setShowGameList(true)
                }}
            >
            {!gameStarted && ( 
                <motion.div 
                    className="menu"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <div className="game-title">Ming Dynasty</div>
                    <div className="character-img-group-wrapper">
                        {
                            characterMappings.map((mapping, index) => (
                                <div className="character-img-group">
                                    <div className="character-symbol-wrapper">
                                        <img key={index} className="character-symbol" src={mapping.img} />
                                    </div>
                                    <div className="character-img-wrapper">
                                        <img key={index} className="character-img" src={mapping.charImg} />
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                    <motion.div 
                        onClick={() => setGameStarted(true)}
                        className="click-to-start"
                        animate={{
                            opacity: flashingState
                        }}
                        transition={{ duration: 0.5 }}
                        onAnimationComplete={() => cycleFlashingState()}
                    >
                        Click to Start
                    </motion.div>
                </motion.div>
            )}
            </AnimatePresence>
            
            <AnimatePresence
                onExitComplete={() => {
                    setShowHUD(true)
                }}
            >
                {showGameList ? (
                    <GameList 
                        onGameListPointerDown={(gameName) => handleGameListOnPointerDown(gameName)}
                    />
                ) : null}
            </AnimatePresence>
            
            <AnimatePresence
                onExitComplete={() => {
                    setShowGameList(true)
                }}
            >
                {showHUD ? (
                    <HUD currentGame={currentGame} />
                ) : null}
            </AnimatePresence>
        </div>
    )
}