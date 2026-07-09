1. lets start with the shopping cart app redux, instruct me from basics now how to start the project how to build it in vs code we are using vs code 
Thought for 21s

Great. We will build the Shopping Cart Redux App from zero in VS Code.

We will use:

React + Vite
Redux Toolkit
React Redux
JavaScript, not TypeScript, because we are learning from basics

Vite is the modern way to quickly create a React project, and its official guide uses npm create vite@latest. Current Vite docs also mention Node.js 20.19+ or 22.12+ as the recommended requirement. Redux Toolkit is the official recommended way to write Redux logic, and React Redux gives us Provider, useSelector, and useDispatch.

What we are going to build

Project name: shopping-cart-redux

Features:

Show product list
Add product to cart
Show cart count in navbar
Increase product quantity
Decrease product quantity
Remove product from cart
Show total cart amount
Step 1: Create React project in VS Code

Open VS Code.

Then open terminal:

Ctrl + `

or go to:

Terminal > New Terminal

Now check Node and npm:

node -v
npm -v

Then create the React project:

npm create vite@latest shopping-cart-redux -- --template react

Now go inside the project folder:

cd shopping-cart-redux

Install packages:

npm install

Run project:

npm run dev

Now you will see something like:

Local: http://localhost:5173/

Open that URL in browser.

At this stage, you should see the default Vite React page.

Step 2: Install Redux

Stop the server first:

Ctrl + C

Now install Redux Toolkit and React Redux:

npm install @reduxjs/toolkit react-redux

Redux Toolkit gives us configureStore and createSlice. createSlice creates reducer logic and action creators automatically. React Redux gives us hooks like useSelector to read Redux state and useDispatch to send actions.

Step 3: Clean default project files

Inside src, keep these files:

src/
  App.jsx
  main.jsx
  index.css

You can delete:

src/App.css
src/assets/react.svg

Also remove unwanted default code from App.jsx.

Step 4: Create Redux folder structure

Inside src, create these folders and files:

src/
  app/
    store.js

  features/
    cart/
      cartSlice.js

Your project should look like this:

src/
  app/
    store.js
  features/
    cart/
      cartSlice.js
  App.jsx
  main.jsx
  index.css
Step 5: Create the cart slice

Open:

src/features/cart/cartSlice.js

Paste this:

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: [],
  totalQuantity: 0,
  totalAmount: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
});

export default cartSlice.reducer;
Beginner explanation

This is our first Redux state:

cartItems: []

This will store products added to cart.

totalQuantity: 0

This will store total number of items in cart.

totalAmount: 0

This will store total price.

Right now we have no actions. We will add actions like:

addToCart
removeFromCart
increaseQuantity
decreaseQuantity

later.

Step 6: Create Redux store

Open:

src/app/store.js

Paste this:

import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../features/cart/cartSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
});
Beginner explanation

The store is the central place where Redux keeps data.

In our app:

cart: cartReducer

means Redux will keep cart data under:

state.cart

So later we can access cart data like this:

state.cart.cartItems
state.cart.totalQuantity
state.cart.totalAmount
Step 7: Connect Redux with React

Open:

src/main.jsx

Replace full code with this:

import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
Beginner explanation

This part is very important:

<Provider store={store}>
  <App />
</Provider>

It means:

Give Redux store access to the complete React app.

Without Provider, React components cannot use Redux data.

Step 8: Test Redux connection

Open:

src/App.jsx

Replace full code with this:

import { useSelector } from "react-redux";

function App() {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);
  const totalAmount = useSelector((state) => state.cart.totalAmount);

  return (
    <div>
      <h1>Shopping Cart Redux App</h1>

      <h2>Redux Cart State</h2>

      <p>Total Items: {totalQuantity}</p>
      <p>Total Amount: Rs. {totalAmount}</p>
      <p>Cart Products: {cartItems.length}</p>
    </div>
  );
}

export default App;

Now run the project again:

npm run dev

You should see:

Shopping Cart Redux App
Total Items: 0
Total Amount: Rs. 0
Cart Products: 0

If you see this, Redux is successfully connected.

What you learned in this first step

Today we learned:

How to create a React project using Vite
How to install Redux Toolkit and React Redux
What is a Redux store
What is a slice
How to connect Redux with React using Provider
How to read Redux data using useSelector

The flow is:

cartSlice.js
      ↓
store.js
      ↓
Provider in main.jsx
      ↓
useSelector in App.jsx

This is the basic Redux connection.

Next, we will create a product list and add our first Redux action: Add to Cart.

ok lets continue

Now we will add the first real feature: a product list and an Add to Cart Redux action. After this step, clicking a button will update Redux state.

Thought for 14s

Perfect. Now we will build Step 2: Product List + Add to Cart.

In this step, you will learn:

How to create static product data
How to create reusable React components
How to create your first Redux action: addToCart
How to use useDispatch() to update Redux state
How to use useSelector() to read updated cart count

Redux Toolkit’s createSlice lets us write reducers inside a slice, and it safely supports “mutating-looking” code because it uses Immer internally. React Redux gives us hooks like useSelector and useDispatch to read from Redux and dispatch actions from components.

Step 1: Create product data file

Inside src, create a new folder:

src/data

Inside that folder, create this file:

src/data/products.js

Paste this code:

export const products = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: 2499,
    image: "https://via.placeholder.com/200x150?text=Headphones",
  },
  {
    id: 2,
    name: "Smart Watch",
    price: 3999,
    image: "https://via.placeholder.com/200x150?text=Smart+Watch",
  },
  {
    id: 3,
    name: "Bluetooth Speaker",
    price: 1999,
    image: "https://via.placeholder.com/200x150?text=Speaker",
  },
  {
    id: 4,
    name: "Laptop Bag",
    price: 999,
    image: "https://via.placeholder.com/200x150?text=Laptop+Bag",
  },
];

This is our temporary product database. Later, we can replace this with API data.

Step 2: Add addToCart action in Redux

Open this file:

src/features/cart/cartSlice.js

Replace the full code with this:

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: [],
  totalQuantity: 0,
  totalAmount: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;

      const existingItem = state.cartItems.find(
        (item) => item.id === product.id
      );

      if (existingItem) {
        existingItem.quantity += 1;
        existingItem.totalPrice += product.price;
      } else {
        state.cartItems.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: 1,
          totalPrice: product.price,
        });
      }

      state.totalQuantity += 1;
      state.totalAmount += product.price;
    },
  },
});

export const { addToCart } = cartSlice.actions;

export default cartSlice.reducer;
Understand this slowly

This action receives a product:

const product = action.payload;

In Redux, payload means:

The data we are sending to the reducer.

Example:

dispatch(addToCart(product));

Here, product becomes:

action.payload

Then we check whether the product is already inside the cart:

const existingItem = state.cartItems.find(
  (item) => item.id === product.id
);

If product already exists, we only increase quantity:

existingItem.quantity += 1;
existingItem.totalPrice += product.price;

If product does not exist, we push a new item into cart:

state.cartItems.push({
  id: product.id,
  name: product.name,
  price: product.price,
  image: product.image,
  quantity: 1,
  totalPrice: product.price,
});

Then we update total cart values:

state.totalQuantity += 1;
state.totalAmount += product.price;
Step 3: Create ProductCard component

Inside src, create this folder:

src/components

Inside components, create this file:

src/components/ProductCard.jsx

Paste this code:

import { useDispatch } from "react-redux";
import { addToCart } from "../features/cart/cartSlice";

function ProductCard({ product }) {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addToCart(product));
  };

  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />

      <h3>{product.name}</h3>

      <p>Rs. {product.price}</p>

      <button onClick={handleAddToCart}>Add to Cart</button>
    </div>
  );
}

export default ProductCard;
Understand this

This line gives us access to Redux dispatch:

const dispatch = useDispatch();

dispatch means:

Send an instruction to Redux.

This line sends the selected product to Redux:

dispatch(addToCart(product));

So when user clicks Add to Cart, this flow happens:

Button click
   ↓
handleAddToCart()
   ↓
dispatch(addToCart(product))
   ↓
cartSlice reducer runs
   ↓
Redux state updates
   ↓
UI updates automatically
Step 4: Create ProductList component

Create this file:

src/components/ProductList.jsx

Paste this code:

import { products } from "../data/products";
import ProductCard from "./ProductCard";

function ProductList() {
  return (
    <div>
      <h2>Products</h2>

      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default ProductList;
Understand this

We are looping over all products:

products.map((product) => ...)

For every product, we show one ProductCard.

This is reusable component logic.

Step 5: Update App.jsx

Open:

src/App.jsx

Replace full code with this:

import { useSelector } from "react-redux";
import ProductList from "./components/ProductList";

function App() {
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);
  const totalAmount = useSelector((state) => state.cart.totalAmount);

  return (
    <div className="app">
      <nav className="navbar">
        <h1>Shopping Cart Redux App</h1>

        <div className="cart-summary">
          <span>Cart Items: {totalQuantity}</span>
          <span>Total: Rs. {totalAmount}</span>
        </div>
      </nav>

      <ProductList />
    </div>
  );
}

export default App;

Here we are reading Redux data:

const totalQuantity = useSelector((state) => state.cart.totalQuantity);

This means:

Go to Redux store, then go to cart, then get totalQuantity.

Step 6: Add simple CSS

Open:

src/index.css

Replace full CSS with this:

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: Arial, sans-serif;
  background-color: #f5f5f5;
}

.app {
  padding: 20px;
}

.navbar {
  background-color: #222;
  color: white;
  padding: 16px 24px;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.navbar h1 {
  margin: 0;
  font-size: 24px;
}

.cart-summary {
  display: flex;
  gap: 20px;
  font-weight: bold;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.product-card {
  background-color: white;
  border-radius: 8px;
  padding: 16px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.product-card img {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.product-card h3 {
  margin: 12px 0 8px;
}

.product-card p {
  font-weight: bold;
  margin-bottom: 12px;
}

.product-card button {
  background-color: #222;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 6px;
  cursor: pointer;
}

.product-card button:hover {
  background-color: #444;
}
Step 7: Run the project

In terminal:

npm run dev

Now open:

http://localhost:5173/

Click Add to Cart.

You should see:

Cart Items: 1
Total: Rs. 2499

Click same product again.

You should see:

Cart Items: 2
Total: Rs. 4998

That means Redux is working.

Current file structure

Your project should now look like this:

src/
  app/
    store.js

  components/
    ProductCard.jsx
    ProductList.jsx

  data/
    products.js

  features/
    cart/
      cartSlice.js

  App.jsx
  index.css
  main.jsx
What you learned now

You learned the most important Redux flow:

Component
   ↓
dispatch(action)
   ↓
Redux reducer
   ↓
Redux state update
   ↓
useSelector reads updated state
   ↓
UI re-renders

In simple words:

ProductCard sends product to Redux.
Redux stores the product in cart.
App reads cart count and total amount.
UI updates automatically.

Complete this step in VS Code. Once your Add to Cart button updates cart count and total amount, send me done, and then we will build the actual Cart Page with increase, decrease, and remove buttons.

Great. Now we will build the Cart Section.

In this step, you will learn:

How to show cart products from Redux
How to increase quantity
How to decrease quantity
How to remove product from cart
How to update total amount correctly
Step 1: Update cartSlice.js

Open:

src/features/cart/cartSlice.js

Replace full code with this:

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: [],
  totalQuantity: 0,
  totalAmount: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;

      const existingItem = state.cartItems.find(
        (item) => item.id === product.id
      );

      if (existingItem) {
        existingItem.quantity += 1;
        existingItem.totalPrice += product.price;
      } else {
        state.cartItems.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: 1,
          totalPrice: product.price,
        });
      }

      state.totalQuantity += 1;
      state.totalAmount += product.price;
    },

    increaseQuantity: (state, action) => {
      const id = action.payload;

      const existingItem = state.cartItems.find((item) => item.id === id);

      if (existingItem) {
        existingItem.quantity += 1;
        existingItem.totalPrice += existingItem.price;

        state.totalQuantity += 1;
        state.totalAmount += existingItem.price;
      }
    },

    decreaseQuantity: (state, action) => {
      const id = action.payload;

      const existingItem = state.cartItems.find((item) => item.id === id);

      if (existingItem) {
        if (existingItem.quantity === 1) {
          state.cartItems = state.cartItems.filter((item) => item.id !== id);
        } else {
          existingItem.quantity -= 1;
          existingItem.totalPrice -= existingItem.price;
        }

        state.totalQuantity -= 1;
        state.totalAmount -= existingItem.price;
      }
    },

    removeFromCart: (state, action) => {
      const id = action.payload;

      const existingItem = state.cartItems.find((item) => item.id === id);

      if (existingItem) {
        state.cartItems = state.cartItems.filter((item) => item.id !== id);

        state.totalQuantity -= existingItem.quantity;
        state.totalAmount -= existingItem.totalPrice;
      }
    },
  },
});

export const {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
} = cartSlice.actions;

export default cartSlice.reducer;
Step 2: Understand the new Redux actions
increaseQuantity
dispatch(increaseQuantity(product.id));

This sends only the product id to Redux.

Redux finds that product inside cartItems and increases quantity by 1.

decreaseQuantity
dispatch(decreaseQuantity(product.id));

This reduces quantity by 1.

But there is one important condition:

if (existingItem.quantity === 1)

Meaning:

If quantity is already 1 and user clicks minus, remove the product from cart.

removeFromCart
dispatch(removeFromCart(product.id));

This removes the full product from cart.

Example:

Headphones quantity = 4
Click remove
All 4 headphones removed from cart
Step 3: Create CartItem.jsx

Inside:

src/components

Create new file:

CartItem.jsx

Paste this code:

import { useDispatch } from "react-redux";
import {
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
} from "../features/cart/cartSlice";

function CartItem({ item }) {
  const dispatch = useDispatch();

  return (
    <div className="cart-item">
      <img src={item.image} alt={item.name} />

      <div className="cart-item-info">
        <h3>{item.name}</h3>
        <p>Price: Rs. {item.price}</p>
        <p>Total: Rs. {item.totalPrice}</p>
      </div>

      <div className="quantity-controls">
        <button onClick={() => dispatch(decreaseQuantity(item.id))}>-</button>

        <span>{item.quantity}</span>

        <button onClick={() => dispatch(increaseQuantity(item.id))}>+</button>
      </div>

      <button
        className="remove-btn"
        onClick={() => dispatch(removeFromCart(item.id))}
      >
        Remove
      </button>
    </div>
  );
}

export default CartItem;
Step 4: Create Cart.jsx

Inside:

src/components

Create new file:

Cart.jsx

Paste this code:

import { useSelector } from "react-redux";
import CartItem from "./CartItem";

function Cart() {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);
  const totalAmount = useSelector((state) => state.cart.totalAmount);

  return (
    <div className="cart">
      <h2>Cart</h2>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>

          <div className="cart-total">
            <h3>Cart Summary</h3>
            <p>Total Quantity: {totalQuantity}</p>
            <p>Total Amount: Rs. {totalAmount}</p>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
Step 5: Update App.jsx

Open:

src/App.jsx

Replace full code with this:

import { useSelector } from "react-redux";
import ProductList from "./components/ProductList";
import Cart from "./components/Cart";

function App() {
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);
  const totalAmount = useSelector((state) => state.cart.totalAmount);

  return (
    <div className="app">
      <nav className="navbar">
        <h1>Shopping Cart Redux App</h1>

        <div className="cart-summary">
          <span>Cart Items: {totalQuantity}</span>
          <span>Total: Rs. {totalAmount}</span>
        </div>
      </nav>

      <div className="main-layout">
        <ProductList />
        <Cart />
      </div>
    </div>
  );
}

export default App;
Step 6: Update CSS

Open:

src/index.css

Add this CSS at the bottom:

.main-layout {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
}

.cart {
  background-color: white;
  padding: 16px;
  border-radius: 8px;
  height: fit-content;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.cart h2 {
  margin-top: 0;
}

.cart-item {
  display: grid;
  grid-template-columns: 70px 1fr;
  gap: 12px;
  border-bottom: 1px solid #ddd;
  padding: 12px 0;
}

.cart-item img {
  width: 70px;
  height: 70px;
  object-fit: cover;
  border-radius: 6px;
}

.cart-item-info h3 {
  margin: 0 0 6px;
  font-size: 16px;
}

.cart-item-info p {
  margin: 4px 0;
  font-size: 14px;
}

.quantity-controls {
  grid-column: 1 / 3;
  display: flex;
  align-items: center;
  gap: 10px;
}

.quantity-controls button {
  width: 28px;
  height: 28px;
  border: none;
  background-color: #222;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}

.quantity-controls span {
  font-weight: bold;
}

.remove-btn {
  grid-column: 1 / 3;
  background-color: crimson;
  color: white;
  border: none;
  padding: 8px;
  border-radius: 6px;
  cursor: pointer;
}

.cart-total {
  margin-top: 16px;
  padding: 12px;
  background-color: #f2f2f2;
  border-radius: 8px;
}

.cart-total h3 {
  margin-top: 0;
}
Step 7: Test the app

Run:

npm run dev

Now test this:

Click Add to Cart
Product should appear in cart
Click +
Quantity should increase
Click -
Quantity should decrease
Click Remove
Product should be removed
Navbar cart count and total amount should update
Important Redux flow you learned

Now your app works like this:

ProductCard
  dispatch(addToCart(product))
        ↓
cartSlice updates Redux state
        ↓
Cart component reads cartItems
        ↓
Navbar reads totalQuantity and totalAmount
        ↓
UI updates automatically

For quantity buttons:

CartItem
  dispatch(increaseQuantity(id))
  dispatch(decreaseQuantity(id))
  dispatch(removeFromCart(id))
        ↓
cartSlice updates state
        ↓
Cart and Navbar update automatically
Why this is important for interviews

In React interviews, they may ask:

Q: What is Redux used for?

You can answer:

Redux is used to manage global state. In our shopping cart app, product list components and cart components need shared data. Instead of passing cart data through multiple props, we store cart data in Redux and access it from any component using useSelector.

Q: What is dispatch?

Dispatch is used to send an action to Redux. For example, when user clicks Add to Cart, we dispatch addToCart(product), and Redux updates the cart state.

Q: What is useSelector?

useSelector is used to read data from the Redux store.

Q: What is useDispatch?

useDispatch is used to send actions to Redux.

Complete this step and then send done. Next, we will improve this project like a real app by adding separate pages: Products Page and Cart Page using React Router.

Great. Now we will improve the Redux logic like a real project.

Currently, we are manually updating:

state.totalQuantity += 1;
state.totalAmount += product.price;

This works, but in bigger apps it can create mistakes.

So now we will create one reusable helper function:

calculateTotals(state)

This function will calculate:

total quantity
total amount

automatically from cartItems.

Step 1: Update cartSlice.js

Open:

src/features/cart/cartSlice.js

Replace the full code with this:

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: [],
  totalQuantity: 0,
  totalAmount: 0,
};

const calculateTotals = (state) => {
  let totalQuantity = 0;
  let totalAmount = 0;

  state.cartItems.forEach((item) => {
    totalQuantity += item.quantity;
    totalAmount += item.price * item.quantity;
  });

  state.totalQuantity = totalQuantity;
  state.totalAmount = totalAmount;
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;

      const existingItem = state.cartItems.find(
        (item) => item.id === product.id
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.cartItems.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: 1,
        });
      }

      calculateTotals(state);
    },

    increaseQuantity: (state, action) => {
      const id = action.payload;

      const existingItem = state.cartItems.find((item) => item.id === id);

      if (existingItem) {
        existingItem.quantity += 1;
      }

      calculateTotals(state);
    },

    decreaseQuantity: (state, action) => {
      const id = action.payload;

      const existingItem = state.cartItems.find((item) => item.id === id);

      if (existingItem) {
        if (existingItem.quantity === 1) {
          state.cartItems = state.cartItems.filter((item) => item.id !== id);
        } else {
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
    },
  },
});

export const {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
Step 2: Understand the improvement

Earlier, every action was manually updating totals.

Example:

state.totalQuantity += 1;
state.totalAmount += product.price;

Now we simply update the cart items first.

Then we call:

calculateTotals(state);

This function recalculates everything from the cart.

So the logic becomes cleaner:

Change cart items
       ↓
Calculate total quantity
       ↓
Calculate total amount
       ↓
Update Redux state

This is better because we avoid repeating calculation logic in every reducer.

Step 3: Update CartItem.jsx

Open:

src/components/CartItem.jsx

Replace this line:

<p>Total: Rs. {item.totalPrice}</p>

with this:

<p>Total: Rs. {item.price * item.quantity}</p>

Full CartItem.jsx should now look like this:

import { useDispatch } from "react-redux";
import {
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
} from "../features/cart/cartSlice";

function CartItem({ item }) {
  const dispatch = useDispatch();

  return (
    <div className="cart-item">
      <img src={item.image} alt={item.name} />

      <div className="cart-item-info">
        <h3>{item.name}</h3>
        <p>Price: Rs. {item.price}</p>
        <p>Total: Rs. {item.price * item.quantity}</p>
      </div>

      <div className="quantity-controls">
        <button onClick={() => dispatch(decreaseQuantity(item.id))}>-</button>

        <span>{item.quantity}</span>

        <button onClick={() => dispatch(increaseQuantity(item.id))}>+</button>
      </div>

      <button
        className="remove-btn"
        onClick={() => dispatch(removeFromCart(item.id))}
      >
        Remove
      </button>
    </div>
  );
}

export default CartItem;

Why we changed this?

Because now we removed totalPrice from cart item object.

Earlier item was like this:

{
  id: 1,
  name: "Wireless Headphones",
  price: 2499,
  quantity: 2,
  totalPrice: 4998
}

Now item is cleaner:

{
  id: 1,
  name: "Wireless Headphones",
  price: 2499,
  quantity: 2
}

Whenever we need total price, we calculate:

item.price * item.quantity
Step 4: Add Clear Cart button in Cart.jsx

Open:

src/components/Cart.jsx

Replace full code with this:

import { useSelector, useDispatch } from "react-redux";
import CartItem from "./CartItem";
import { clearCart } from "../features/cart/cartSlice";

function Cart() {
  const dispatch = useDispatch();

  const cartItems = useSelector((state) => state.cart.cartItems);
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);
  const totalAmount = useSelector((state) => state.cart.totalAmount);

  return (
    <div className="cart">
      <h2>Cart</h2>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>

          <div className="cart-total">
            <h3>Cart Summary</h3>
            <p>Total Quantity: {totalQuantity}</p>
            <p>Total Amount: Rs. {totalAmount}</p>

            <button
              className="clear-cart-btn"
              onClick={() => dispatch(clearCart())}
            >
              Clear Cart
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
Step 5: Add CSS for Clear Cart button

Open:

src/index.css

Add this at the bottom:

.clear-cart-btn {
  width: 100%;
  background-color: #b00020;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 10px;
  font-weight: bold;
}

.clear-cart-btn:hover {
  background-color: #8c001a;
}
Step 6: Test everything

Now test these cases carefully:

Add one product to cart
Add same product again
Quantity should increase
Total amount should update
Go to cart page
Click +
Click -
Click Remove
Add products again
Click Clear Cart
Cart should become empty
Navbar count should become 0
Total amount should become Rs. 0
What you learned now

You learned one important real-world Redux pattern:

Do not repeat calculation logic in every reducer.
Create a helper function and reuse it.

Our improved Redux flow is:

addToCart / increaseQuantity / decreaseQuantity / removeFromCart
        ↓
Update cartItems
        ↓
calculateTotals(state)
        ↓
Update totalQuantity and totalAmount

This makes your Redux code cleaner and easier to maintain.

Interview answer

You can explain it like this:

In my shopping cart app, I used Redux Toolkit to manage cart state globally. I created reducers for adding items, increasing quantity, decreasing quantity, removing items, and clearing the cart. Instead of manually updating total quantity and total amount in every reducer, I created a reusable calculateTotals function that recalculates totals from cartItems. This keeps the Redux logic cleaner and avoids duplicate calculation code.

Complete this step and send done. Next, we will add localStorage, so cart data does not disappear after page refresh.

Great. Now we will add localStorage, so cart data does not disappear after page refresh.

Currently, if you add products to cart and refresh the page, Redux state resets to empty because Redux state is stored in memory.

Now we will save cart data in browser localStorage.

Step 1: Understand the problem

Redux state works while the app is running.

But after refresh:

Redux state resets
Cart becomes empty

So we need this flow:

Add product to cart
      ↓
Redux state updates
      ↓
Save cart state to localStorage
      ↓
Refresh page
      ↓
Load cart state from localStorage
      ↓
Cart data comes back
Step 2: Update store.js

Open:

src/app/store.js

Replace the full code with this:

import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../features/cart/cartSlice";

const loadCartFromLocalStorage = () => {
  try {
    const savedCart = localStorage.getItem("cart");

    if (savedCart === null) {
      return undefined;
    }

    return JSON.parse(savedCart);
  } catch (error) {
    console.log("Could not load cart from localStorage", error);
    return undefined;
  }
};

const saveCartToLocalStorage = (cartState) => {
  try {
    const cartStateString = JSON.stringify(cartState);
    localStorage.setItem("cart", cartStateString);
  } catch (error) {
    console.log("Could not save cart to localStorage", error);
  }
};

export const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
  preloadedState: {
    cart: loadCartFromLocalStorage(),
  },
});

store.subscribe(() => {
  saveCartToLocalStorage(store.getState().cart);
});
Step 3: Understand this code

This function gets cart data from localStorage:

const loadCartFromLocalStorage = () => {
  const savedCart = localStorage.getItem("cart");

  if (savedCart === null) {
    return undefined;
  }

  return JSON.parse(savedCart);
};

If cart data exists, it loads it.

If cart data does not exist, Redux will use the default state from cartSlice.js.

This part gives Redux the saved cart data when app starts:

preloadedState: {
  cart: loadCartFromLocalStorage(),
},

preloadedState means:

Initial Redux state loaded from outside source.

Here the outside source is localStorage.

This part watches every Redux state change:

store.subscribe(() => {
  saveCartToLocalStorage(store.getState().cart);
});

In simple words:

Whenever Redux state changes, save latest cart data to localStorage.

So when you add, remove, increase, decrease, or clear cart, localStorage also gets updated.

Step 4: Check cartSlice.js

No change is needed here.

But your initialState should still be like this:

const initialState = {
  cartItems: [],
  totalQuantity: 0,
  totalAmount: 0,
};

Redux will use this when localStorage is empty.

Step 5: Test localStorage

Run your project:

npm run dev

Now test:

Add 2 or 3 products to cart
Go to cart page
Refresh the browser
Cart items should still remain
Click Clear Cart
Refresh again
Cart should remain empty
Step 6: Check localStorage manually

In browser:

Right click → Inspect → Application tab → Local Storage

Then click your localhost URL.

You should see one key:

cart

Its value will look something like this:

{
  "cartItems": [
    {
      "id": 1,
      "name": "Wireless Headphones",
      "price": 2499,
      "image": "https://via.placeholder.com/200x150?text=Headphones",
      "quantity": 2
    }
  ],
  "totalQuantity": 2,
  "totalAmount": 4998
}
What you learned now

You learned how to persist Redux state.

Earlier:

Redux state only lived until page refresh.

Now:

Redux state is saved in localStorage.
After refresh, Redux loads previous cart data again.

This is very useful in real shopping cart apps.

Interview explanation

You can explain it like this:

I used Redux Toolkit to manage cart state globally. To prevent cart data from disappearing after page refresh, I used browser localStorage. I loaded saved cart data using preloadedState in the Redux store and used store.subscribe() to save the latest cart state to localStorage whenever Redux state changes.

Complete this step and send done. Next, we will add checkout page + form state, where you will learn the difference between local component state and Redux global state.

Great. Now we will add a Checkout Page + Form State.

This step is very important because it teaches one practical interview concept:

When should we use Redux, and when should we use normal React state?

For cart data, we use Redux because cart is needed globally in Navbar, Products page, and Cart page.

For checkout form fields like name, email, and address, we use local component state with useState, because that form data is only needed inside the checkout form. React’s official docs describe useState as the Hook used to add state variables to a component.

Step 1: Create Checkout Page

Inside:

src/pages

Create new file:

CheckoutPage.jsx

Paste this:

import CheckoutForm from "../components/CheckoutForm";

function CheckoutPage() {
  return (
    <div>
      <CheckoutForm />
    </div>
  );
}

export default CheckoutPage;
Step 2: Create Checkout Form component

Inside:

src/components

Create new file:

CheckoutForm.jsx

Paste this code:

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { clearCart } from "../features/cart/cartSlice";

function CheckoutForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItems = useSelector((state) => state.cart.cartItems);
  const totalAmount = useSelector((state) => state.cart.totalAmount);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    address: "",
    city: "",
    pincode: "",
  });

  const [orderSuccess, setOrderSuccess] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (cartItems.length === 0) {
      alert("Your cart is empty. Please add products before checkout.");
      navigate("/");
      return;
    }

    console.log("Order Details:", {
      customer: formData,
      products: cartItems,
      totalAmount: totalAmount,
    });

    dispatch(clearCart());
    setOrderSuccess(true);

    setFormData({
      fullName: "",
      email: "",
      address: "",
      city: "",
      pincode: "",
    });
  };

  if (orderSuccess) {
    return (
      <div className="checkout-success">
        <h2>Order Placed Successfully!</h2>
        <p>Thank you for shopping with us.</p>

        <button onClick={() => navigate("/")}>Continue Shopping</button>
      </div>
    );
  }

  return (
    <div className="checkout">
      <h2>Checkout</h2>

      <div className="checkout-summary">
        <p>Total Products: {cartItems.length}</p>
        <p>Total Amount: Rs. {totalAmount}</p>
      </div>

      <form onSubmit={handleSubmit} className="checkout-form">
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            placeholder="Enter your full name"
            required
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="form-group">
          <label>Address</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="Enter your address"
            required
          ></textarea>
        </div>

        <div className="form-group">
          <label>City</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            placeholder="Enter your city"
            required
          />
        </div>

        <div className="form-group">
          <label>Pincode</label>
          <input
            type="text"
            name="pincode"
            value={formData.pincode}
            onChange={handleInputChange}
            placeholder="Enter pincode"
            required
          />
        </div>

        <button type="submit" className="place-order-btn">
          Place Order
        </button>
      </form>
    </div>
  );
}

export default CheckoutForm;

React Router’s useNavigate gives us a function to navigate programmatically, so we can redirect the user after actions like empty-cart checkout or successful order.

Step 3: Understand local state here

This is local component state:

const [formData, setFormData] = useState({
  fullName: "",
  email: "",
  address: "",
  city: "",
  pincode: "",
});

This data belongs only to the checkout form.

So we do not need Redux for this.

Use Redux when data is shared across multiple components.

Use local state when data is only needed inside one component.

Step 4: Understand this input logic

Every input has a name:

name="fullName"

And value:

value={formData.fullName}

When the user types, this function runs:

onChange={handleInputChange}

This part gets the input name and value:

const { name, value } = event.target;

Then this updates only that field:

setFormData({
  ...formData,
  [name]: value,
});

Example:

name = "email"
value = "test@gmail.com"

Then React updates:

formData.email = "test@gmail.com"
Step 5: Add Checkout route in App.jsx

Open:

src/App.jsx

Replace full code with this:

import { Routes, Route } from "react-router";
import Navbar from "./components/Navbar";
import ProductsPage from "./pages/ProductsPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";

function App() {
  return (
    <div className="app">
      <Navbar />

      <Routes>
        <Route path="/" element={<ProductsPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
      </Routes>
    </div>
  );
}

export default App;
Step 6: Add Checkout link in Navbar

Open:

src/components/Navbar.jsx

Replace full code with this:

import { NavLink } from "react-router";
import { useSelector } from "react-redux";

function Navbar() {
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);
  const totalAmount = useSelector((state) => state.cart.totalAmount);

  return (
    <nav className="navbar">
      <h1>Shopping Cart Redux App</h1>

      <div className="nav-links">
        <NavLink to="/">Products</NavLink>

        <NavLink to="/cart">Cart ({totalQuantity})</NavLink>

        <NavLink to="/checkout">Checkout</NavLink>
      </div>

      <div className="cart-summary">
        <span>Total Items: {totalQuantity}</span>
        <span>Total: Rs. {totalAmount}</span>
      </div>
    </nav>
  );
}

export default Navbar;
Step 7: Add Checkout button in Cart page

Open:

src/components/Cart.jsx

Replace full code with this:

import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import CartItem from "./CartItem";
import { clearCart } from "../features/cart/cartSlice";

function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItems = useSelector((state) => state.cart.cartItems);
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);
  const totalAmount = useSelector((state) => state.cart.totalAmount);

  return (
    <div className="cart">
      <h2>Cart</h2>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>

          <div className="cart-total">
            <h3>Cart Summary</h3>
            <p>Total Quantity: {totalQuantity}</p>
            <p>Total Amount: Rs. {totalAmount}</p>

            <button
              className="checkout-btn"
              onClick={() => navigate("/checkout")}
            >
              Proceed to Checkout
            </button>

            <button
              className="clear-cart-btn"
              onClick={() => dispatch(clearCart())}
            >
              Clear Cart
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
Step 8: Add CSS

Open:

src/index.css

Add this CSS at the bottom:

.checkout {
  max-width: 600px;
  margin: 0 auto;
  background-color: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.checkout h2 {
  margin-top: 0;
}

.checkout-summary {
  background-color: #f2f2f2;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.checkout-summary p {
  margin: 6px 0;
  font-weight: bold;
}

.checkout-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-weight: bold;
}

.form-group input,
.form-group textarea {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-family: Arial, sans-serif;
}

.form-group textarea {
  min-height: 80px;
  resize: vertical;
}

.place-order-btn,
.checkout-btn {
  background-color: #0066cc;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
}

.place-order-btn:hover,
.checkout-btn:hover {
  background-color: #004f9e;
}

.checkout-btn {
  width: 100%;
  margin-bottom: 10px;
}

.checkout-success {
  max-width: 500px;
  margin: 0 auto;
  text-align: center;
  background-color: white;
  padding: 32px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.checkout-success button {
  background-color: #222;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 6px;
  cursor: pointer;
}
Step 9: Test the full flow

Run:

npm run dev

Now test:

Go to Products page
Add products to cart
Go to Cart page
Click Proceed to Checkout
Fill the form
Click Place Order
You should see success message
Cart should become empty
Navbar count should become 0
Click Continue Shopping

Also check browser console. You should see order details printed.

Local state vs Redux state

Remember this clearly:

Data	                                   Use	                          Why
Cart items	                             Redux	                        Needed in Navbar, Cart page, Checkout page
Total amount	                           Redux	                        Needed in multiple places
Checkout form input	                     useState	                      Needed only inside Checkout form
Order success message	                   useState	                      Temporary UI state
Product data	                           Static file for now	          Later we can fetch from 


Interview answer

You can explain it like this:

In this project, I used Redux for cart state because cart data is required globally across Navbar, Cart page, and Checkout page. But for checkout form fields, I used local component state with useState, because form values are only required inside the CheckoutForm component. This avoids unnecessary Redux usage and keeps the code simple.

Complete this step and send done. Next, we will add form validation, which is commonly used in real React apps.


Great. Now we will add form validation to the Checkout page.

Currently, your form only uses basic HTML required. Now we will add our own validation logic in React.

We will validate:

Field	Validation
Full Name	Minimum 3 characters
Email	Must be valid email format
Address	Minimum 10 characters
City	Minimum 2 characters
Pincode	Must be 6 digits
Step 1: Update CheckoutForm.jsx

Open:

src/components/CheckoutForm.jsx

Replace the full code with this:

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { clearCart } from "../features/cart/cartSlice";

function CheckoutForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItems = useSelector((state) => state.cart.cartItems);
  const totalAmount = useSelector((state) => state.cart.totalAmount);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    address: "",
    city: "",
    pincode: "",
  });

  const [errors, setErrors] = useState({});

  const [orderSuccess, setOrderSuccess] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (formData.fullName.trim().length < 3) {
      newErrors.fullName = "Full name must be at least 3 characters.";
    }

    if (!formData.email.includes("@") || !formData.email.includes(".")) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (formData.address.trim().length < 10) {
      newErrors.address = "Address must be at least 10 characters.";
    }

    if (formData.city.trim().length < 2) {
      newErrors.city = "City name must be at least 2 characters.";
    }

    if (!/^[0-9]{6}$/.test(formData.pincode)) {
      newErrors.pincode = "Pincode must be exactly 6 digits.";
    }

    return newErrors;
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (cartItems.length === 0) {
      alert("Your cart is empty. Please add products before checkout.");
      navigate("/");
      return;
    }

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    console.log("Order Details:", {
      customer: formData,
      products: cartItems,
      totalAmount: totalAmount,
    });

    dispatch(clearCart());
    setOrderSuccess(true);

    setFormData({
      fullName: "",
      email: "",
      address: "",
      city: "",
      pincode: "",
    });

    setErrors({});
  };

  if (orderSuccess) {
    return (
      <div className="checkout-success">
        <h2>Order Placed Successfully!</h2>
        <p>Thank you for shopping with us.</p>

        <button onClick={() => navigate("/")}>Continue Shopping</button>
      </div>
    );
  }

  return (
    <div className="checkout">
      <h2>Checkout</h2>

      <div className="checkout-summary">
        <p>Total Products: {cartItems.length}</p>
        <p>Total Amount: Rs. {totalAmount}</p>
      </div>

      <form onSubmit={handleSubmit} className="checkout-form">
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            placeholder="Enter your full name"
          />
          {errors.fullName && <p className="error-text">{errors.fullName}</p>}
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter your email"
          />
          {errors.email && <p className="error-text">{errors.email}</p>}
        </div>

        <div className="form-group">
          <label>Address</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="Enter your address"
          ></textarea>
          {errors.address && <p className="error-text">{errors.address}</p>}
        </div>

        <div className="form-group">
          <label>City</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            placeholder="Enter your city"
          />
          {errors.city && <p className="error-text">{errors.city}</p>}
        </div>

        <div className="form-group">
          <label>Pincode</label>
          <input
            type="text"
            name="pincode"
            value={formData.pincode}
            onChange={handleInputChange}
            placeholder="Enter pincode"
          />
          {errors.pincode && <p className="error-text">{errors.pincode}</p>}
        </div>

        <button type="submit" className="place-order-btn">
          Place Order
        </button>
      </form>
    </div>
  );
}

export default CheckoutForm;
Step 2: Understand the validation logic

We added one new state:

const [errors, setErrors] = useState({});

This stores error messages.

Example:

{
  fullName: "Full name must be at least 3 characters.",
  email: "Please enter a valid email address."
}
Step 3: Understand validateForm

This function checks the form values:

const validateForm = () => {
  const newErrors = {};

  if (formData.fullName.trim().length < 3) {
    newErrors.fullName = "Full name must be at least 3 characters.";
  }

  return newErrors;
};

Simple meaning:

Create empty error object.
Check every field.
If any field is wrong, add error message.
Return all errors.
Step 4: Understand this important line
if (Object.keys(validationErrors).length > 0) {
  setErrors(validationErrors);
  return;
}

Meaning:

If there is even one error,
show errors on screen,
stop form submit.

So the order will not be placed until all fields are valid.

Step 5: Understand error clearing

Inside handleInputChange, we added this:

setErrors({
  ...errors,
  [name]: "",
});

This means:

When user starts typing again in a field, clear the error message for that field.

Example:

If email has error, and user starts typing in email input, email error will disappear.

Step 6: Add CSS for error text

Open:

src/index.css

Add this at the bottom:

.error-text {
  color: #b00020;
  font-size: 13px;
  margin: 4px 0 0;
}
Step 7: Test validation

Now run:

npm run dev

Test these cases:

Add product to cart
Go to Checkout page
Click Place Order without filling fields
Error messages should appear
Enter invalid email like abc
You should see email error
Enter pincode like 123
You should see pincode error
Enter correct details
Click Place Order
Success message should appear
Cart should become empty
What you learned now

You learned how to manage form validation using local state.

Important point:

Form data = local state
Form errors = local state
Cart data = Redux state

Why?

Because form data and errors are only needed inside CheckoutForm.

Cart data is needed across Navbar, Cart page, and Checkout page, so it stays in Redux.

Interview explanation

You can say:

I used local state for checkout form values and validation errors because this data is only required inside the checkout component. I created a validateForm function that checks all form fields and stores error messages in an errors object. If validation fails, I stop form submission and show field-level errors. Redux is used only for global cart state.

Complete this step and send done. Next, we will add Redux DevTools understanding + debugging flow, which is very useful for interviews and real development.

Great. Now we will learn Redux DevTools + debugging flow.

Redux DevTools is useful because it shows:

Which action was dispatched
What data was sent in payload
How Redux state changed after the action
Previous state and next state

Redux’s own docs describe DevTools as a way to trace when, where, why, and how state changed. Redux Toolkit’s configureStore automatically sets up Redux DevTools integration, so we do not need extra store setup for this project.

Step 1: Install Redux DevTools browser extension

In your browser, install:

Redux DevTools

After installing, open your app:

http://localhost:5173/

Then open browser developer tools:

Right click → Inspect

You should see a new tab named:

Redux
Step 2: Open Redux tab

Inside the Redux tab, you will see your Redux store state.

Your current state should look like this:

{
  cart: {
    cartItems: [],
    totalQuantity: 0,
    totalAmount: 0
  }
}

This is because our store.js has this reducer key:

reducer: {
  cart: cartReducer,
}

So Redux state becomes:

state.cart
Step 3: Dispatch your first action and watch it

Now go to Products page and click:

Add to Cart

In Redux DevTools, you should see an action like:

cart/addToCart

Click that action.

You will see something like this:

{
  type: "cart/addToCart",
  payload: {
    id: 1,
    name: "Wireless Headphones",
    price: 2499,
    image: "..."
  }
}
Meaning

This line in ProductCard.jsx:

dispatch(addToCart(product));

created this action:

cart/addToCart

And this product became the payload:

action.payload
Step 4: Check state after action

After clicking cart/addToCart, check the state in DevTools.

It should become:

{
  cart: {
    cartItems: [
      {
        id: 1,
        name: "Wireless Headphones",
        price: 2499,
        image: "...",
        quantity: 1
      }
    ],
    totalQuantity: 1,
    totalAmount: 2499
  }
}

This confirms your reducer worked.

Step 5: Test all actions

Now perform these actions one by one and watch Redux DevTools:

UI Action	Redux Action
Click Add to Cart	cart/addToCart
Click +	cart/increaseQuantity
Click -	cart/decreaseQuantity
Click Remove	cart/removeFromCart
Click Clear Cart	cart/clearCart

This is the most practical way to understand Redux.

You are not just guessing what happened. You are seeing every state change.

Step 6: Add temporary console logs for learning

Open:

src/features/cart/cartSlice.js

Inside addToCart, add this temporarily:

addToCart: (state, action) => {
  console.log("Action received:", action);
  console.log("Product payload:", action.payload);

  const product = action.payload;

  const existingItem = state.cartItems.find(
    (item) => item.id === product.id
  );

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    state.cartItems.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    });
  }

  calculateTotals(state);
},

Now click Add to Cart and open browser Console.

You will see the action object.

After checking, remove these logs because we do not keep unnecessary logs in final code.

Step 7: Understand Redux action naming

In our slice:

name: "cart"

And reducer:

addToCart

Redux Toolkit automatically creates action type:

cart/addToCart

So the pattern is:

sliceName/reducerName

Examples:

cart/addToCart
cart/increaseQuantity
cart/decreaseQuantity
cart/removeFromCart
cart/clearCart
Step 8: Understand previous state and next state

Redux DevTools usually shows different views like:

Action
State
Diff
Trace

Focus mainly on:

Action

Shows what was dispatched.

Example:

{
  type: "cart/addToCart",
  payload: {
    id: 1,
    name: "Wireless Headphones",
    price: 2499
  }
}
State

Shows Redux state after the action.

Diff

Shows exactly what changed.

Example:

totalQuantity: 0 → 1
totalAmount: 0 → 2499
cartItems: [] → [{...}]

This is very helpful for debugging.

Step 9: Debugging example

Suppose cart total is wrong.

You should debug in this order:

1. Check whether button click is working
2. Check whether dispatch is running
3. Check Redux DevTools action
4. Check action payload
5. Check reducer logic
6. Check updated state
7. Check useSelector in component

Example:

If you click Add to Cart but cart does not update:

First check ProductCard.jsx:

dispatch(addToCart(product));

Then check DevTools:

Did cart/addToCart action appear?

If action did not appear, problem is in component or button click.

If action appeared but state did not change, problem is in reducer.

If state changed but UI did not update, problem is in useSelector or component rendering.

Step 10: Very important interview answer

You can say:

I used Redux DevTools to debug Redux state changes. Whenever a user clicks Add to Cart, I can see the dispatched action, payload, previous state, and next state. This helps confirm whether the problem is in the component, action dispatch, reducer logic, or UI selector.

Mini revision

You now know:

useDispatch → sends action to Redux
action.payload → data sent with action
reducer → updates Redux state
useSelector → reads Redux state
Redux DevTools → shows action and state changes

Complete this Redux DevTools checking in your browser and send done.

Next, we will add product search and category filter. This will teach when to use local state vs Redux for filters.

Now we’ll add search and category filtering, but we will not put it in Redux. This is a good practice point: filters are local UI state unless many pages need them.

Thought for 10s

Great. Now we will add Product Search + Category Filter.

In this step, you will learn:

How to use useState for search input
How to filter products using .filter()
Why search/filter state does not always need Redux
How to show filtered products dynamically
Step 1: Update product data

Open:

src/data/products.js

Replace full code with this:

export const products = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: 2499,
    category: "Electronics",
    image: "https://via.placeholder.com/200x150?text=Headphones",
  },
  {
    id: 2,
    name: "Smart Watch",
    price: 3999,
    category: "Electronics",
    image: "https://via.placeholder.com/200x150?text=Smart+Watch",
  },
  {
    id: 3,
    name: "Bluetooth Speaker",
    price: 1999,
    category: "Electronics",
    image: "https://via.placeholder.com/200x150?text=Speaker",
  },
  {
    id: 4,
    name: "Laptop Bag",
    price: 999,
    category: "Accessories",
    image: "https://via.placeholder.com/200x150?text=Laptop+Bag",
  },
  {
    id: 5,
    name: "Running Shoes",
    price: 2999,
    category: "Fashion",
    image: "https://via.placeholder.com/200x150?text=Shoes",
  },
  {
    id: 6,
    name: "Cotton T-Shirt",
    price: 699,
    category: "Fashion",
    image: "https://via.placeholder.com/200x150?text=T-Shirt",
  },
];

We added a new field:

category: "Electronics"

Now we can filter products by category.

Step 2: Update ProductCard.jsx

Open:

src/components/ProductCard.jsx

Replace full code with this:

import { useDispatch } from "react-redux";
import { addToCart } from "../features/cart/cartSlice";

function ProductCard({ product }) {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addToCart(product));
  };

  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />

      <h3>{product.name}</h3>

      <p className="product-category">{product.category}</p>

      <p>Rs. {product.price}</p>

      <button onClick={handleAddToCart}>Add to Cart</button>
    </div>
  );
}

export default ProductCard;

We added this line:

<p className="product-category">{product.category}</p>

So now each product card will show its category.

Step 3: Update ProductList.jsx

Open:

src/components/ProductList.jsx

Replace full code with this:

import { useState } from "react";
import { products } from "../data/products";
import ProductCard from "./ProductCard";

function ProductList() {
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Electronics", "Accessories", "Fashion"];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchText.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      <div className="products-header">
        <h2>Products</h2>

        <div className="filters">
          <input
            type="text"
            placeholder="Search products..."
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
          />

          <select
            value={selectedCategory}
            onChange={(event) => setSelectedCategory(event.target.value)}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductList;
Step 4: Understand the state

We added two local states:

const [searchText, setSearchText] = useState("");
const [selectedCategory, setSelectedCategory] = useState("All");

searchText stores what user types in search box.

Example:

watch

selectedCategory stores selected category.

Example:

Electronics
Step 5: Understand filtering logic

This part checks product name:

const matchesSearch = product.name
  .toLowerCase()
  .includes(searchText.toLowerCase());

Meaning:

Convert product name and search text to lowercase, then check whether product name includes the search text.

Example:

Product name: Smart Watch
Search text: watch
Result: true

This part checks category:

const matchesCategory =
  selectedCategory === "All" || product.category === selectedCategory;

Meaning:

If selected category is All, show all products.
Otherwise, show only products matching selected category.

This line applies both conditions:

return matchesSearch && matchesCategory;

Meaning:

Product should match search text and selected category both.

Step 6: Add CSS

Open:

src/index.css

Add this at the bottom:

.products-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  gap: 20px;
}

.filters {
  display: flex;
  gap: 12px;
}

.filters input,
.filters select {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-family: Arial, sans-serif;
}

.filters input {
  width: 220px;
}

.product-category {
  color: #666;
  font-size: 14px;
  margin: 4px 0;
}
Step 7: Test the feature

Run:

npm run dev

Now test:

Search watch
Only Smart Watch should show
Search speaker
Only Bluetooth Speaker should show
Select Fashion
Only fashion products should show
Select Electronics
Only electronics products should show
Search something wrong like abcxyz
It should show No products found.
Important concept: why not Redux here?

We used Redux for cart because cart data is needed in many places:

Navbar
Cart Page
Checkout Page
Products Page

But search text and selected category are only needed inside the product listing area.

So we used local state:

useState

This is better than putting everything into Redux.

A common beginner mistake is:

Putting every state into Redux.

That is not required.

A better rule:

State	Use
Needed by many components/pages	Redux
Needed only in one component	useState
Temporary UI input/filter	useState
Logged-in user/cart/theme	Redux or Context
API data shared across app	Redux Toolkit / RTK Query
Interview answer

You can explain it like this:

I used local state for product search and category filter because these values are only required inside the product listing component. I did not put them in Redux because they are not global state. Redux is used only for cart state, which is shared between Navbar, Cart page, and Checkout page.

Complete this step and send done. Next, we will add price sorting: Low to High and High to Low, and then we will refactor product filtering into cleaner logic.
Good. Now we’ll add price sorting and clean the product filtering logic, so the component looks more professional and easier to maintain.

Thought for 11s

Now we will add Price Sorting.

We will add three options:

Default
Price: Low to High
Price: High to Low

This will teach you:

How to sort products
How to combine search + category + sorting
Why we should not mutate original arrays directly
How to keep component logic clean
Step 1: Update ProductList.jsx

Open:

src/components/ProductList.jsx

Replace the full code with this:

import { useState } from "react";
import { products } from "../data/products";
import ProductCard from "./ProductCard";

function ProductList() {
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("default");

  const categories = ["All", "Electronics", "Accessories", "Fashion"];

  const getFilteredProducts = () => {
    let updatedProducts = [...products];

    if (searchText.trim() !== "") {
      updatedProducts = updatedProducts.filter((product) =>
        product.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (selectedCategory !== "All") {
      updatedProducts = updatedProducts.filter(
        (product) => product.category === selectedCategory
      );
    }

    if (sortOrder === "low-to-high") {
      updatedProducts.sort((a, b) => a.price - b.price);
    }

    if (sortOrder === "high-to-low") {
      updatedProducts.sort((a, b) => b.price - a.price);
    }

    return updatedProducts;
  };

  const filteredProducts = getFilteredProducts();

  return (
    <div>
      <div className="products-header">
        <h2>Products</h2>

        <div className="filters">
          <input
            type="text"
            placeholder="Search products..."
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
          />

          <select
            value={selectedCategory}
            onChange={(event) => setSelectedCategory(event.target.value)}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <select
            value={sortOrder}
            onChange={(event) => setSortOrder(event.target.value)}
          >
            <option value="default">Default</option>
            <option value="low-to-high">Price: Low to High</option>
            <option value="high-to-low">Price: High to Low</option>
          </select>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductList;
Step 2: Understand new state

We added one more local state:

const [sortOrder, setSortOrder] = useState("default");

This stores the selected sorting option.

Example:

low-to-high

or:

high-to-low

Again, we are using useState, not Redux.

Why?

Because sorting is only needed inside the product list.

Step 3: Understand this important line
let updatedProducts = [...products];

This creates a copy of the products array.

Why do we copy?

Because JavaScript .sort() changes the original array.

This is called mutation.

Bad approach:

products.sort((a, b) => a.price - b.price);

This directly changes the original products array.

Better approach:

let updatedProducts = [...products];
updatedProducts.sort((a, b) => a.price - b.price);

Now we are sorting the copied array, not the original array.

This is a very important React habit.

Step 4: Understand filtering logic

First, we start with all products:

let updatedProducts = [...products];

Then search filter:

if (searchText.trim() !== "") {
  updatedProducts = updatedProducts.filter((product) =>
    product.name.toLowerCase().includes(searchText.toLowerCase())
  );
}

Then category filter:

if (selectedCategory !== "All") {
  updatedProducts = updatedProducts.filter(
    (product) => product.category === selectedCategory
  );
}

Then sorting:

if (sortOrder === "low-to-high") {
  updatedProducts.sort((a, b) => a.price - b.price);
}

and:

if (sortOrder === "high-to-low") {
  updatedProducts.sort((a, b) => b.price - a.price);
}

Finally:

return updatedProducts;

So the flow is:

All products
   ↓
Apply search
   ↓
Apply category
   ↓
Apply sorting
   ↓
Show final products
Step 5: Test it

Run your project:

npm run dev

Now test:

Select Price: Low to High
Products should show cheapest first
Select Price: High to Low
Products should show expensive first
Select Fashion
Sorting should work only inside Fashion products
Search watch
Only Smart Watch should show
Clear search
Products should come back
Step 6: Interview explanation

You can explain it like this:

I added product search, category filter, and price sorting using local state because these are UI-level states required only inside the product listing component. I first copied the products array using the spread operator, then applied search filter, category filter, and sorting. I avoided sorting the original product array directly because .sort() mutates the array.

What you learned

You now understand this important React concept:

Do not mutate original data directly.
Create a copy, then filter or sort.

You also learned:

Global cart state → Redux
Local search/filter/sort state → useState

Complete this step and send done. Next, we will add quantity selection before Add to Cart, which is closer to real e-commerce apps.
Next we’ll add quantity selection on each product card. The selected quantity is temporary UI state, so we’ll keep it inside ProductCard, not Redux.

Thought for 8s

Great. Now we will add quantity selection before Add to Cart.

Currently, when you click Add to Cart, it always adds only 1 quantity.

Now we will allow the user to select quantity first:

Wireless Headphones
Quantity: - 2 +
Add to Cart

Then if the user clicks Add to Cart, quantity 2 will be added to Redux.

Step 1: Update cartSlice.js

Open:

src/features/cart/cartSlice.js

Replace only your addToCart reducer with this updated version:

addToCart: (state, action) => {
  const product = action.payload;

  const quantityToAdd = product.quantity || 1;

  const existingItem = state.cartItems.find(
    (item) => item.id === product.id
  );

  if (existingItem) {
    existingItem.quantity += quantityToAdd;
  } else {
    state.cartItems.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      quantity: quantityToAdd,
    });
  }

  calculateTotals(state);
},

Your full cartSlice.js should look like this:

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: [],
  totalQuantity: 0,
  totalAmount: 0,
};

const calculateTotals = (state) => {
  let totalQuantity = 0;
  let totalAmount = 0;

  state.cartItems.forEach((item) => {
    totalQuantity += item.quantity;
    totalAmount += item.price * item.quantity;
  });

  state.totalQuantity = totalQuantity;
  state.totalAmount = totalAmount;
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;

      const quantityToAdd = product.quantity || 1;

      const existingItem = state.cartItems.find(
        (item) => item.id === product.id
      );

      if (existingItem) {
        existingItem.quantity += quantityToAdd;
      } else {
        state.cartItems.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          category: product.category,
          quantity: quantityToAdd,
        });
      }

      calculateTotals(state);
    },

    increaseQuantity: (state, action) => {
      const id = action.payload;

      const existingItem = state.cartItems.find((item) => item.id === id);

      if (existingItem) {
        existingItem.quantity += 1;
      }

      calculateTotals(state);
    },

    decreaseQuantity: (state, action) => {
      const id = action.payload;

      const existingItem = state.cartItems.find((item) => item.id === id);

      if (existingItem) {
        if (existingItem.quantity === 1) {
          state.cartItems = state.cartItems.filter((item) => item.id !== id);
        } else {
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
    },
  },
});

export const {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
Step 2: Understand the Redux change

Earlier, product object was coming like this:

{
  id: 1,
  name: "Wireless Headphones",
  price: 2499
}

Now we will send product with quantity:

{
  id: 1,
  name: "Wireless Headphones",
  price: 2499,
  quantity: 2
}

So we added this line:

const quantityToAdd = product.quantity || 1;

Meaning:

If product.quantity exists, use that.
Otherwise, use 1.

This keeps our reducer safe.

Step 3: Update ProductCard.jsx

Open:

src/components/ProductCard.jsx

Replace full code with this:

import { useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../features/cart/cartSlice";

function ProductCard({ product }) {
  const dispatch = useDispatch();

  const [selectedQuantity, setSelectedQuantity] = useState(1);

  const increaseSelectedQuantity = () => {
    setSelectedQuantity(selectedQuantity + 1);
  };

  const decreaseSelectedQuantity = () => {
    if (selectedQuantity > 1) {
      setSelectedQuantity(selectedQuantity - 1);
    }
  };

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        ...product,
        quantity: selectedQuantity,
      })
    );

    setSelectedQuantity(1);
  };

  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />

      <h3>{product.name}</h3>

      <p className="product-category">{product.category}</p>

      <p>Rs. {product.price}</p>

      <div className="product-quantity">
        <button onClick={decreaseSelectedQuantity}>-</button>

        <span>{selectedQuantity}</span>

        <button onClick={increaseSelectedQuantity}>+</button>
      </div>

      <button onClick={handleAddToCart}>Add to Cart</button>
    </div>
  );
}

export default ProductCard;
Step 4: Understand selectedQuantity

We added local state:

const [selectedQuantity, setSelectedQuantity] = useState(1);

This quantity is only needed inside one product card.

So we do not use Redux for this.

Why?

Because before adding to cart, this is only temporary UI state.

Redux is needed after the product is added to cart.

Step 5: Understand increase and decrease

This increases selected quantity:

const increaseSelectedQuantity = () => {
  setSelectedQuantity(selectedQuantity + 1);
};

This decreases selected quantity:

const decreaseSelectedQuantity = () => {
  if (selectedQuantity > 1) {
    setSelectedQuantity(selectedQuantity - 1);
  }
};

We added this condition:

if (selectedQuantity > 1)

Because quantity should not become 0 or negative.

Step 6: Understand Add to Cart

This is the most important part:

dispatch(
  addToCart({
    ...product,
    quantity: selectedQuantity,
  })
);

Meaning:

Take all product details.
Add selected quantity also.
Send everything to Redux.

Example:

{
  id: 1,
  name: "Wireless Headphones",
  price: 2499,
  category: "Electronics",
  quantity: 3
}

Then Redux receives this as:

action.payload

After adding, we reset quantity back to 1:

setSelectedQuantity(1);

This gives a better user experience.

Step 7: Add CSS

Open:

src/index.css

Add this at the bottom:

.product-quantity {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin: 12px 0;
}

.product-quantity button {
  width: 28px;
  height: 28px;
  border: none;
  background-color: #222;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}

.product-quantity span {
  font-weight: bold;
}
Step 8: Test it

Run:

npm run dev

Now test:

Go to Products page
Increase quantity of Wireless Headphones to 3
Click Add to Cart
Navbar should show Total Items: 3
Go to Cart page
Wireless Headphones quantity should be 3
Add same product again with quantity 2
Cart quantity should become 5
Total amount should update correctly
Important concept

Now our flow is:

ProductCard local state
      ↓
selectedQuantity
      ↓
dispatch(addToCart({ ...product, quantity }))
      ↓
Redux cart state
      ↓
Navbar and Cart page update

So this is the correct state split:

State	Where we keep it	Reason
Selected quantity before adding	useState	Temporary product-card UI state
Cart quantity after adding	Redux	Needed globally
Cart total amount	Redux	Needed globally
Search/filter/sort	useState	Needed only in product list
Interview answer

You can explain it like this:

I used local state for selected product quantity before adding to cart, because it is temporary UI state inside each product card. Once the user clicks Add to Cart, I dispatch the product with selected quantity to Redux. After that, cart quantity and total amount are managed globally in Redux.

Complete this step and send done. Next, we will add toast notifications, so the user gets feedback like “Product added to cart.”