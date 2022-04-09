import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { selectSquareById } from "./squaresSlice";

export const SquareElm = (props) => {
    const square = useSelector(state => selectSquareById(state, props.value))
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition
    } = useSortable({ id: props.value });

    const style = {
        ...props.style,
        transform: CSS.Transform.toString(transform),
        transition
    }

    return (
        <motion.div 
            animate={{
                x: square.x,
                y: square.y
            }}
            className={`square square-${props.value}`} 
            ref={setNodeRef} 
            {...listeners} 
            {...attributes} 
            style={style}
        >
            {/* {props.value} */}
            <motion.img 
                animate={{
                    opacity: square.show ? 1 : 0
                }}
                onAnimationComplete={props.onAnimationComplete}
                className="square-img" 
                src={props.img} 
            />
        </motion.div>
    )
}