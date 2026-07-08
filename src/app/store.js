import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '../features/cart/cartSlice';

// This function gets cart data from localStorage:
const loadCartFromLocalStorage = () => {
    try{
        // If cart data exists, it loads it.
        const savedCart = localStorage.getItem('cart');
        
        // If cart data does not exist, Redux will use the default state from cartSlice.js.
        if(savedCart === null){
            return undefined;
        }
        
        return JSON.parse(savedCart);
    }
    catch(error){
        console.log("Error loading cart from localStorage:", error);
        return undefined;
    }
}

const saveCartToLocalSTorage = (cartState) => {
    try{
        const cartStateString = JSON.stringify(cartState);
        localStorage.setItem('cart', cartStateString);
    }
    catch(error){
        console.log("Could not save cart to localStorage:", error);
    }
}


// The store is the central place where Redux keeps data
export const store = configureStore({
    reducer: {
        cart: cartReducer, //means Redux will keep cart data under:
    },
    // This part gives Redux the saved cart data when app starts:
    //preloadedState means : Initial Redux state loaded from outside source.
    // Here the outside source is localStorage.
    preloadedState: {
        cart: loadCartFromLocalStorage(),
    },
});

// This part watches every Redux state change:
// Whenever Redux state changes, save latest cart data to localStorage.
// So when you add, remove, increase, decrease, or clear cart, localStorage also gets updated.
store.subscribe(() => {
    saveCartToLocalSTorage(store.getState().cart);
});


//So later we can access cart data like this:
// state.cart.cartItems
// state.cart.totalQuantity
// state.cart.totalAmount