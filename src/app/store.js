import { configureStore } from '@reduxjs/toolkit'
import pingPongReducer from '../features/PingPong/pingPongSlice'
import squaresReducer from '../features/Squares/squaresSlice'

export default configureStore({
  reducer: {
    squares: squaresReducer,
    pingPong: pingPongReducer
  },
})