import { createSlice } from "@reduxjs/toolkit";
import { MAIN_MENU } from "./MainController.constants";

const mainControllerSlice = createSlice({
    name: "mainController",
    initialState: {
        currentPage: MAIN_MENU
    },
    reducers: {
        currentPageChanged(state, action) {
            state.currentPage = action.payload
        }
    }
})

export const {
    currentPageChanged
} = mainControllerSlice.actions

export default mainControllerSlice.reducer