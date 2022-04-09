import { closestCenter, DndContext, DragOverlay } from "@dnd-kit/core"
import { restrictToParentElement } from "@dnd-kit/modifiers"
import { arraySwap, rectSwappingStrategy, SortableContext } from "@dnd-kit/sortable"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { SquareElm } from "./SquareElm"
import { selectAllSquares, squaresUpdated } from "./squaresSlice"

export const Board = (props) => {
    const { sensors, squareImgs, squareWidth, squareHeight } = props
    const squares = useSelector(selectAllSquares)
    const dispatch = useDispatch()
    const [activeId, setActiveId] = useState(null)
    const [activeIndex, setActiveIndex] = useState(null)


    const handleDragStart = (event) => {
        setActiveId(event.active.id)
        const newIndex = squares.findIndex((square) => square.id === event.active.id)
        setActiveIndex(newIndex)
    }

    const handleDragOver = (event) => {
        const { active, over } = event;

        if (over != null && active.id !== over.id) {
            const oldIndex = squares.findIndex((square) => square.id === active.id)
            const newIndex = squares.findIndex((square) => square.id === over.id)
            dispatch(squaresUpdated(arraySwap(squares, oldIndex, newIndex)))
            setActiveIndex(newIndex)
            
            props.onDragOver()
        }
    }

    const handleDragEnd = (event) => {
        setActiveId(null)
        setActiveIndex(null)
        
        props.onDragEnd()
    }

    const handleOnAnimationComplete = () => {
        props.onAnimationComplete()
    }

    return (
        <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragEnd}
            collisionDetection={closestCenter}
        >
            <SortableContext items={squares} strategy={rectSwappingStrategy}>
                {squares.map((square) =>
                    <SquareElm
                        style={{
                            width: squareWidth,
                            height: squareHeight,
                            visibility: square.id === activeId ? 'hidden' : 'inherit'
                        }}
                        key={square.id}
                        id={square.id}
                        img={squareImgs[square.img]}
                        value={square.id}
                        onAnimationComplete={handleOnAnimationComplete}
                    />
                )}

                <DragOverlay modifiers={[restrictToParentElement]}>
                    {activeId ? (
                        <SquareElm
                            style={{
                                width: squareWidth,
                                height: squareHeight
                            }}
                            key={activeId}
                            id={activeId}
                            img={squareImgs[squares[activeIndex].img]}
                            value={activeId}
                        />
                    ) : null}
                </DragOverlay>
            </SortableContext>
        </DndContext>
    )
}