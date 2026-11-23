// Everything that describes the Ecommerce Practice API lives here, so the
// rest of the app never has to know the API's raw field names.

export const API_BASE_URL = "https://ecommerce-products-api-986c.onrender.com/api";

export const PAGE_SIZE = 20;

const unsplash = (id) =>
    `https://images.unsplash.com/${id}?auto=format&fit=crop&w=480&h=320&q=75`;

// The API's /categories endpoint does not filter by audience, so the
// department -> category mapping is kept here.
export const DEPARTMENTS = [
    {
        key: "",
        label: "All products",
        image: unsplash("photo-1483985988355-763728e1935b"),
        categories: [],
    },
    {
        key: "men",
        label: "Men",
        image: unsplash("photo-1489987707025-afc232f7ea0f"),
        categories: ["tops", "long sleeves", "formals", "casuals", "sports wear", "trousers"],
    },
    {
        key: "women",
        label: "Women",
        image: unsplash("photo-1610189012906-4c0aa9b9781e"),
        categories: [
            "tops", "kurties", "festive kurta sets", "organza sarees", "wedding sarees",
            "party wear dresses", "summer dresses", "sports wear", "bottoms",
        ],
    },
    {
        key: "kids",
        label: "Kids",
        image: unsplash("photo-1760287363879-6012adab292c"),
        categories: [
            "tops", "shirts", "dresses", "party wear", "festive season",
            "kurta with dhoti pants", "boys clothing set", "jeans", "pants",
        ],
    },
    {
        key: "home",
        label: "Home",
        image: unsplash("photo-1618221195710-dd6b41faaea6"),
        categories: ["living room", "bedroom", "kitchen", "bathroom", "garden"],
    },
];

export const getDepartment = (key) =>
    DEPARTMENTS.find((department) => department.key === key) ?? DEPARTMENTS[0];

export const SORT_OPTIONS = [
    { value: "", label: "Featured" },
    { value: "price-asc", label: "Price: Low to high" },
    { value: "price-desc", label: "Price: High to low" },
    { value: "rating-desc", label: "Top rated" },
    { value: "name-asc", label: "Name: A to Z" },
];

export const toTitleCase = (text = "") =>
    text.replace(/\b\w/g, (char, index) =>
        index > 0 && text[index - 1] === "'" ? char : char.toUpperCase()
    );

// API product -> the shape the app (and the saved cart) uses.
export const normalizeProduct = (product) => ({
    id: product.id,
    name: product.itemName,
    brand: product.companyName,
    category: product.category,
    audience: product.audience,
    price: product.currentPrice,
    originalPrice: product.originalPrice,
    discount: product.discount,
    currency: product.currency,
    inStock: product.inStock,
    rating: product.rating,
    ratingCount: product.ratingCount,
    image: product.image,
});

export const buildProductsUrl = ({ audience, category, q, sort, page = 1, limit = PAGE_SIZE }) => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (audience) params.set("audience", audience);
    if (category) params.set("category", category);
    if (q?.trim()) params.set("q", q.trim());
    if (sort) params.set("sort", sort);
    return `${API_BASE_URL}/products?${params}`;
};
