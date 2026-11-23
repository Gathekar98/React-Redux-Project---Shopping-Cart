import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async () => {
    const response = await fetch(
      "https://fakestoreapi.com/products"
    );

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    const data = await response.json();

    const toTitleCase = (text = "") =>
      text.replace(/\b\w/g, (char, index) =>
        index > 0 && text[index - 1] === "'" ? char : char.toUpperCase()
      );

    return data.map((product) => ({
      id: product.id,
      name: product.title,
      price: product.price,
      category: toTitleCase(product.category),
      image: product.image,
      images: product.image ? [product.image] : [],
      description: product.description,
    }));
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
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload;
      })

      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export default productSlice.reducer;
