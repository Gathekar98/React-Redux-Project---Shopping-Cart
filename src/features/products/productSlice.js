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

const IMAGE_CHECK_TIMEOUT_MS = 15000;

// Resolves false only when the image definitely fails to load.
// A slow image counts as available, so nothing is hidden by mistake.
const imageLoads = (src) =>
  new Promise((resolve) => {
    const image = new Image();
    const timer = setTimeout(() => resolve(true), IMAGE_CHECK_TIMEOUT_MS);
    image.onload = () => { clearTimeout(timer); resolve(true); };
    image.onerror = () => { clearTimeout(timer); resolve(false); };
    image.src = src;
  });

export const getCategoryKey = (audience, category) => `${audience}/${category}`;

// For each category in a department, check that it has products and that
// its images actually load. Categories that fail are hidden from the shop.
export const checkDepartmentCategories = createAsyncThunk(
  "products/checkDepartmentCategories",
  async (audience, { getState }) => {
    const known = getState().products.categoryStatus;
    const department = DEPARTMENTS.find((item) => item.key === audience);
    const toCheck = (department?.categories ?? []).filter((category) => !known[getCategoryKey(audience, category)]);
    const entries = await Promise.all(
      toCheck.map(async (category) => {
        const key = getCategoryKey(audience, category);
        try {
          const json = await getJson(buildProductsUrl({ audience, category, limit: 1 }));
          const first = json.data[0];
          const available = Boolean(first?.image) && await imageLoads(first.image);
          return [key, { available, total: json.meta.total }];
        } catch {
          return [key, { available: true, total: 0 }]; // unknown: keep showing it
        }
      })
    );
    return Object.fromEntries(entries);
  },
  {
    condition: (audience, { getState }) => Boolean(audience) && !getState().products.checkingDepartments[audience],
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

  brokenImageIds: {}, // product ids whose image failed to load in a card
  categoryStatus: {}, // "women/tops" -> { available, total }
  checkingDepartments: {},
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
    markImageBroken: (state, action) => {
      state.brokenImageIds[action.payload] = true;
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
      })

      .addCase(checkDepartmentCategories.pending, (state, action) => {
        state.checkingDepartments[action.meta.arg] = true;
      })
      .addCase(checkDepartmentCategories.fulfilled, (state, action) => {
        Object.assign(state.categoryStatus, action.payload);
      });
  },
});

export const { setFilters, resetFilters, markImageBroken } = productSlice.actions;

// --- Selectors: what the shop should actually show -------------------------

// These take the products slice: useSelector((state) => state.products).

export const isCategoryHidden = ({ categoryStatus }, audience, category) =>
  categoryStatus[getCategoryKey(audience, category)]?.available === false;

export const isProductVisible = (products, product) =>
  !products.brokenImageIds[product.id] && !isCategoryHidden(products, product.audience, product.category);

// Total products of the hidden categories that match the given filters.
export const getHiddenTotal = ({ categoryStatus }, { audience = "", category = "" } = {}) =>
  Object.entries(categoryStatus).reduce((sum, [key, status]) => {
    if (status.available) return sum;
    const [statusAudience, statusCategory] = key.split("/");
    if (audience && audience !== statusAudience) return sum;
    if (category && category !== statusCategory) return sum;
    return sum + status.total;
  }, 0);
export default productSlice.reducer;
