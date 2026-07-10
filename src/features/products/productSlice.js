import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// This part creates the async action: 
export const fetchProducts = createAsyncThunk(
    "products/fetchProducts",
    async () => {
        const response =  await fetch("https://fakestoreapi.com/products"); //Go to API, get products
        // Fake Store API product looks roughly like this:
        // {
        //   id: 1,
        //   title: "Fjallraven Backpack",
        //   price: 109.95,
        //   category: "men's clothing",
        //   image: "..."
        // }
        
        if(!response.ok){
            throw new Error("Failed to fetch products");
        }
         
        const data = await response.json();
        // return the product data.
        return data.map((product) => (
            {
                id: product.id,
                name: product.title, // but our app expects namme instead of title so we changes name:product.title
                price: Math.round(product.price * 80), //we converted dollar-style price to approximate rupees:
                category: product.category,
                image: product.image,
            }
        ));
    }
);

const initialState = {
    products: [],
    isLoading: false,
    error: null,
};

const productSlice = createSlice({
    name: "products",
    initialState,
    reducers : {},
    //createSlice uses extraReducers to respond to these async actions from createAsyncThunk.
    extraReducers: (builder) => { 
        builder
            .addCase(fetchProducts.pending, (state) => { //API call started
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) =>{ //API call successful
                state.isLoading = false;
                state.products = action.payload;
            })
            .addCase(fetchProducts.rejected, (state) => { //API call failed
                state.isLoading = false;
                state.error =  action.error.message;
            });
    },
});

export default productSlice.reducer;