import { configureStore } from '@reduxjs/toolkit'
import pingPongReducer from '../features/pingpong/pingPongSlice'
import squaresReducer from '../features/squares/squaresSlice'

export default configureStore({
  reducer: {
    squares: squaresReducer,
    pingPong: pingPongReducer
  },
})