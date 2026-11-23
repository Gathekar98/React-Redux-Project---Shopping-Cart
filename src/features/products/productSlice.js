import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API_BASE_URL, DEPARTMENTS, buildProductsUrl, normalizeProduct } from "./catalog";

const getJson = async (url) => {
  const response = await fetch(url);
  if (response.status === 404) throw new Error("Not found");
  if (!response.ok) throw new Error("Failed to fetch products");
  return response.json();
};

// Loads one page of products for the current filters.
// page 1 replaces the list, later pages are appended ("Load more").
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async ({ page = 1 } = {}, { getState }) => {
    const { filters } = getState().products;
    const json = await getJson(buildProductsUrl({ ...filters, page }));
    return { items: json.data.map(normalizeProduct), meta: json.meta, page };
  }
);

export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (id) => {
    const json = await getJson(`${API_BASE_URL}/products/${encodeURIComponent(id)}`);
    return normalizeProduct(json.data);
  }
);

// Products from the same department and category, without the current one.
export const fetchRelatedProducts = createAsyncThunk(
  "products/fetchRelatedProducts",
  async (product) => {
    const url = buildProductsUrl({ audience: product.audience, category: product.category, limit: 5 });
    const json = await getJson(url);
    return json.data.map(normalizeProduct).filter((item) => item.id !== product.id).slice(0, 4);
  }
);

// Total product count per department, for the department cards.
export const fetchDepartmentCounts = createAsyncThunk(
  "products/fetchDepartmentCounts",
  async () => {
    const entries = await Promise.all(
      DEPARTMENTS.map(async ({ key }) => {
        const json = await getJson(buildProductsUrl({ audience: key, limit: 1 }));
        return [key, json.meta.total];
      })
    );
    return Object.fromEntries(entries);
  }
);

const initialState = {
  filters: { audience: "", category: "", q: "", sort: "" },
  products: [],
  meta: null, // { total, page, totalPages, hasNextPage, ... } from the API
  loadedFiltersKey: null, // which filters the current list belongs to
  isLoading: false,
  loadingPage: 1,
  error: null,
  latestRequestId: null,

  selectedId: null,
  selectedProduct: null,
  selectedStatus: "idle", // idle | loading | succeeded | not-found | failed

  related: [],
  relatedFor: null,
  departmentCounts: {},
};

export const getFiltersKey = (filters) => JSON.stringify(filters);

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    // Changing a filter resets pagination; the list component refetches.
    setFilters: (state, action) => {
      const next = { ...state.filters, ...action.payload };
      // A category only makes sense inside its department.
      if ("audience" in action.payload && action.payload.audience !== state.filters.audience) {
        next.category = action.payload.category ?? "";
      }
      state.filters = next;
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state, action) => {
        state.isLoading = true;
        state.loadingPage = action.meta.arg?.page ?? 1;
        state.error = null;
        state.latestRequestId = action.meta.requestId;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        // Ignore answers to requests that a newer filter change replaced.
        if (action.meta.requestId !== state.latestRequestId) return;
        const { items, meta, page } = action.payload;
        state.isLoading = false;
        state.products = page === 1 ? items : [...state.products, ...items];
        state.meta = meta;
        state.loadedFiltersKey = getFiltersKey(state.filters);
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        if (action.meta.requestId !== state.latestRequestId) return;
        state.isLoading = false;
        state.error = action.error.message;
      })

      .addCase(fetchProductById.pending, (state, action) => {
        state.selectedId = action.meta.arg;
        state.selectedStatus = "loading";
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        if (action.meta.arg !== state.selectedId) return;
        state.selectedStatus = "succeeded";
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        if (action.meta.arg !== state.selectedId) return;
        state.selectedStatus = action.error.message === "Not found" ? "not-found" : "failed";
      })

      .addCase(fetchRelatedProducts.pending, (state, action) => {
        state.related = [];
        state.relatedFor = action.meta.arg.id;
      })
      .addCase(fetchRelatedProducts.fulfilled, (state, action) => {
        if (action.meta.arg.id !== state.relatedFor) return;
        state.related = action.payload;
      })

      .addCase(fetchDepartmentCounts.fulfilled, (state, action) => {
        state.departmentCounts = action.payload;
      });
  },
});

export const { setFilters, resetFilters } = productSlice.actions;
export default productSlice.reducer;
