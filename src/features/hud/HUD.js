import { useRef } from "react"
import { MatchThreeGame } from "../squares/MatchThreeGame"

export const HUD = () => {
    const ref = useRef()

    return (
        <div className="main-area">
            <div className="view-area">
                Character/Enemy/Story View
            </div>
            <div className="game-area" ref={ref}>
                {/* Game Area */}
                <MatchThreeGame parentRef={ref} />
            </div>
        </div>
    )
}