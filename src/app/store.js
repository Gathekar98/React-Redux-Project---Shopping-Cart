import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '../features/cart/cartSlice';
import notificationReducer from '../features/notification/notificationSlice';
import ordersReducer from '../features/orders/orderSlice';
import productsReducer from '../features/products/productSlice';
import { 
    loadFromLocalStorage,
    saveToLocalStorage,
} from "../utils/localStorage";

// The store is the central place where Redux keeps data
export const store = configureStore({
    reducer: {
        cart: cartReducer, //means Redux will keep cart data under:
        notification: notificationReducer, //redux will keep notification data under: notification state 
        orders: ordersReducer, //redux will keep orders data under: orders state
        products: productsReducer, //redux will keep products data under: products state
    },
    // This part gives Redux the saved cart data when app starts:
    //preloadedState means : Initial Redux state loaded from outside source.
    // Here the outside source is localStorage.
    preloadedState: {
        cart: loadFromLocalStorage("cart"),
        orders: loadFromLocalStorage("orders"),
    },
});

// This part watches every Redux state change:
// Whenever Redux state changes, save latest cart data to localStorage.
// So when you add, remove, increase, decrease, or clear cart, localStorage also gets updated.
store.subscribe(() => {
    saveToLocalStorage(store.getState().cart);
    saveToLocalStorage(store.getState().orders);
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

//So later we can access products data like this:
// state.products.products
// state.products.isLoading
// state.products.error


