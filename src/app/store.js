import { configureStore } from '@reduxjs/toolkit'
import squaresReducer from '../features/squares/squaresSlice'

export default configureStore({
  reducer: {
    squares: squaresReducer
  },
})