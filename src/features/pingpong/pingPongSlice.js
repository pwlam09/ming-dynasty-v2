import { createSlice } from "@reduxjs/toolkit";

const pingPongSlice = createSlice({
    name: 'pingPong',
    initialState: {
        rewards: [],
        score: 0
    },
    reducers: {
    }
})

export const { 
} = pingPongSlice.actions

export default pingPongSlice.reducer