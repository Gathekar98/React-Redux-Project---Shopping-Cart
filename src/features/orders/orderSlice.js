import { createSlice } from "@reduxjs/toolkit";

const initialState ={
    // This slice stores all placed orders:
    orders : [],
};

const orderSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        addOrder: (state, action) => {
            state.orders.push(action.payload);
        },
        clearOrder: (state) => {
            state.orders = [];
        },
    },
});

export const {addOrder, clearOrder} = orderSlice.actions;

export default orderSlice.reducer;