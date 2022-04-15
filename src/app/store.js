import { configureStore } from '@reduxjs/toolkit'
import mainControllerReducer from '../features/MainController/mainControllerSlice'
import pingPongReducer from '../features/PingPong/pingPongSlice'
import squaresReducer from '../features/Squares/squaresSlice'

export default configureStore({
  reducer: {
    mainController: mainControllerReducer,
    squares: squaresReducer,
    pingPong: pingPongReducer
  },
})