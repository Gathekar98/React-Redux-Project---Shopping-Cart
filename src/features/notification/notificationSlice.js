import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    message: "",
    type: "", //e.g. success / error / warning
    isVisible: false,
};

const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers:{
        showNotification: (state , action) => {
            state.message = action.payload.message;
            state.type = action.payload.type;
            state.isVisible = true;
        },

        hideNotification: (state) => {
            state.message = "";
            state.type = "";
            state.isVisible = false;
        },
    },
});

export const { showNotification , hideNotification } = notificationSlice.actions;

export default notificationSlice.reducer;