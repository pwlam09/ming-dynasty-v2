import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";

const numOfSquares = 25
const numOfImgs = 4

const squaresAdapter = createEntityAdapter()

const initialState = squaresAdapter.getInitialState()
const squaresXY = []
for (let i = 0; i < numOfSquares; i++) {
    squaresXY.push({id: `${i}`, x: 0, y: 0, img: Math.floor(Math.random() * numOfImgs), show: true })
}
const filledState = squaresAdapter.upsertMany(initialState, squaresXY)

const squaresSlice = createSlice({
    name: 'squares',
    initialState: filledState,
    reducers: {
        initializeSquares(state, action) {
            const squaresXY = []
            for (let i = 0; i < numOfSquares; i++) {
                squaresXY.push({id: `${i}`, x: 0, y: 0, img: Math.floor(Math.random() * numOfImgs)})
            }
            squaresAdapter.upsertMany(initialState, squaresXY)
        },
        squareMoved(state, action) {
            state.entities[action.payload.id].x = action.payload.x
            state.entities[action.payload.id].y = action.payload.y
        },
        squaresUpdated(state, action) {
            squaresAdapter.setAll(state, action.payload)
        },
        squaresToggled(state, action) {
            const squares = action.payload
            for (let i = 0; i < squares.length; i++) {
                state.entities[squares[i].id].show = !state.entities[squares[i].id].show
            }
            // squaresAdapter.updateMany(state, squares)
        },
        sqauresGetNewImg(state, action) {
            const squares = action.payload
            for (let i = 0; i < squares.length; i++) {
                state.entities[squares[i].id].img = Math.floor(Math.random() * numOfImgs)
            }
        }
    }
})

export const { initializeSquares, squareMoved, squaresUpdated, squaresToggled, sqauresGetNewImg } = squaresSlice.actions

export default squaresSlice.reducer

export const {
    selectAll: selectAllSquares,
    selectById: selectSquareById
} = squaresAdapter.getSelectors(state => state.squares)