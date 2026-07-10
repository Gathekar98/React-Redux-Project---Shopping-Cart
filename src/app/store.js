import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '../features/cart/cartSlice';
import notificationReducer from '../features/notification/notificationSlice';
import ordersReducer from '../features/orders/orderSlice';

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
};

const loadOrdersFromLocalStorage = () => {
    try{
        const savedOrders = localStorage.getItem("orders");

        if(savedOrders == null){
            return undefined;
        }

        return JSON.parse(savedOrders);
    }
    catch(error){
        console.log("Could not load orders from local storage", error);
        return undefined;
    }
};

const saveCartToLocalSTorage = (cartState) => {
    try{
        const cartStateString = JSON.stringify(cartState);
        localStorage.setItem('cart', cartStateString);
    }
    catch(error){
        console.log("Could not save cart to localStorage:", error);
    }
};

const saveOrdersToLocalStorage = (ordersState) =>{
    try{
        const ordersStateString = JSON.stringify(ordersState);
        localStorage.setItem('orders', ordersStateString);
    }
    catch(error){
        console.log("Could not save orders to local storage", error);
        return undefined;
    }
};

// The store is the central place where Redux keeps data
export const store = configureStore({
    reducer: {
        cart: cartReducer, //means Redux will keep cart data under:
        notification: notificationReducer, //redux will keep notification data under: notification state 
        orders: ordersReducer, //redux will keep orders data under: orders state
    },
    // This part gives Redux the saved cart data when app starts:
    //preloadedState means : Initial Redux state loaded from outside source.
    // Here the outside source is localStorage.
    preloadedState: {
        cart: loadCartFromLocalStorage(),
        orders: loadOrdersFromLocalStorage(),
    },
});

// This part watches every Redux state change:
// Whenever Redux state changes, save latest cart data to localStorage.
// So when you add, remove, increase, decrease, or clear cart, localStorage also gets updated.
store.subscribe(() => {
    saveCartToLocalSTorage(store.getState().cart);
    saveOrdersToLocalStorage(store.getState().orders);
});


//So later we can access cart data like this:
// state.cart.cartItems
// state.cart.totalQuantity
// state.cart.totalAmount

//So later we can access notification data like this:
// state.notification.message
// state.notification.type
// state.notification.isVisible

//So later we can access orders data like this:
// state.orders.orders

