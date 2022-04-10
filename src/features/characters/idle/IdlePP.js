import { motion, useCycle } from "framer-motion"
import { useEffect } from "react"
import img0 from "../../../assets/sprites/pp/idle/knight_f_idle_anim_f0.png"
import img1 from "../../../assets/sprites/pp/idle/knight_f_idle_anim_f1.png"
import img2 from "../../../assets/sprites/pp/idle/knight_f_idle_anim_f2.png"
import img3 from "../../../assets/sprites/pp/idle/knight_f_idle_anim_f3.png"
import { FRAME_INTERVAL } from "../character.constants"

export const IdlePP = () => {
    const [x, cycleX] = useCycle(img0, img1, img2, img3)

    useEffect(() => {
        const intervalId = setInterval(() => {
            cycleX()
        }, FRAME_INTERVAL)
        return () => {
            clearInterval(intervalId)
        }
    }, [])
    
    return (
        <motion.img className="sprite idle-sprite" key={x} src={x} />
    )
}