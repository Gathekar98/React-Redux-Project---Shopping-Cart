import {createSlice} from '@reduxjs/toolkit';

//Redux will use this initialState when localStorage is empty.
const initialState = {
    cartItems: [], // This will store products added to cart.
    totalQuantity: 0,  //This will store products added to cart.
    totalAmount: 0, //This will store total price.
};

const calculateTotals = (state) =>{
    let totalQuantity = 0;
    let totalAmount = 0;

    state.cartItems.forEach((item) =>{
        totalQuantity += item.quantity;
        totalAmount += item.price * item.quantity;
    });
    state.totalQuantity = totalQuantity;
    state.totalAmount = totalAmount;
}

const cartSlice = createSlice({
    name: 'cart', //cartReducer pass in store.js
    initialState,
    reducers: {
        addToCart: (state, action)=> {
            // console.log("Action received:", action);
            // console.log("Product payload:", action.type);
            // console.log("Product payload:", action.payload);
            const product = action.payload; //This action receives a product

            //Then we check whether the product is already inside the cart:-
            const existingItem = state.cartItems.find(
                (item) => item.id === product.id
            );

            // If product already exists
            if(existingItem) {
                existingItem.quantity += 1; //we increase quantity:
            }
            // If product does not exist
            else{
                // we push a new item into cart:-
                state.cartItems.push({
                    id : product.id,
                    name : product.name,
                    price : product.price,
                    image : product.image,
                    quantity : 1,
                });
            }
            // Then we update total cart values:
            calculateTotals(state);
        },
        increaseQuantity: (state, action) => {
            const id = action.payload;
            const existingItem = state.cartItems.find((item) => item.id === id);

            if(existingItem) {
                existingItem.quantity += 1;
            }
            calculateTotals(state);
        },
        decreaseQuantity: (state, action) => {
            const id = action.payload;
            const existingItem = state.cartItems.find((item) => item.id === id);

            if(existingItem) {
                if(existingItem.quantity === 1) {
                    state.cartItems = state.cartItems.filter((item) => item.id !== id);
                }
                else{
                    existingItem.quantity -= 1;
                }
            }
            calculateTotals(state);
        },
        removeFromCart: (state, action) => {
            const id = action.payload;
            state.cartItems = state.cartItems.filter((item) => item.id !== id);

            calculateTotals(state);
        },

        clearCart: (state) => {
            state.cartItems = [];
            state.totalQuantity = 0;
            state.totalAmount = 0;
        }
    },
});

export const {addToCart, increaseQuantity, decreaseQuantity, removeFromCart, clearCart} = cartSlice.actions;
export default cartSlice.reducer;

// In Redux, payload means:
// The data we are sending to the reducer.
// Example:
// dispatch(addToCart(product));