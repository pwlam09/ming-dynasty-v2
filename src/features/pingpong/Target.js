import { motion } from "framer-motion"
import { forwardRef, useEffect, useState } from "react"
import { DEFAULT_TARGET_MOVE_DURATION } from "./PingPong.constants"

export const Target = forwardRef((props, ref) => {
    const [targetAnimations, setTargetAnimations] = useState([])
    const [currTargetAnimation, setCurrTargetAnimation] = useState()

    useEffect(() => {
        if (props.targetAnimations) {
            setTargetAnimations(props.targetAnimations)
            setCurrTargetAnimation(props.targetAnimations[0])
        }
    }, [props])

    return (
        <motion.div 
            ref={ref}
            className="tnt"
            initial={{ x: 0, y: 0 }}
            custom={props.custom}
            animate={props.targetAnimationControls}
            transition={{ ease: "easeOut", duration: currTargetAnimation ? currTargetAnimation.duration : DEFAULT_TARGET_MOVE_DURATION }}
            onAnimationComplete={() => {
                if (targetAnimations && targetAnimations.length > 0 && currTargetAnimation && currTargetAnimation != targetAnimations[targetAnimations.length - 1]) {
                    const nextIndex = (targetAnimations.findIndex((a) => a.y === currTargetAnimation.y) + 1) % targetAnimations.length
                    setCurrTargetAnimation(targetAnimations[nextIndex])
                    props.targetAnimationControls.start(targetAnimations[nextIndex])
                }
            }}
        >
            <img src={props.targetImg} />
        </motion.div>
    )
})