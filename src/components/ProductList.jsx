import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../features/products/productSlice";
import ProductCard from "./ProductCard";

function ProductList() {

    const dispatch = useDispatch();
    const {products, isLoading, error } = useSelector((state) => state.products);

    const [searchText, setSearchText] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [sortOrder, setSortOrder] = useState("default");

    useEffect(() => {
        dispatch(fetchProducts());
    },[dispatch]);

    const handleRefreshProducts = () => {
        dispatch(fetchProducts());
    }

    const categories = ["All",
        ...new Set(products.map((product) => product.category).filter(Boolean)),
    ];

    const getFilteredProducts = () => {
        let updatedProducts = [...products];

        if(searchText.trim() !== ""){
            updatedProducts = updatedProducts.filter((product) => 
                product.name.toLowerCase().includes(searchText.toLowerCase())
            );
        }
        
        if(selectedCategory !== "All"){
            updatedProducts = updatedProducts.filter((product) => product.category === selectedCategory);
        }

        if(sortOrder === "low-to-high"){
            updatedProducts.sort((a, b) => a.price - b.price);
        }

        if(sortOrder === "high-to-low"){
            updatedProducts.sort((a, b) => b.price - a.price);
        }
        return updatedProducts;
    }

    const filteredProducts = getFilteredProducts();

    if(isLoading && products.length === 0){
        return (
            <div className="loading-state">
                <div className="loading-dot"></div>
                <h2>Loading Products....</h2>
            </div>
        );
    }

    if(error && products.length === 0){
        return (
            <div className="api-error">
                <p className="eyebrow">Something went wrong</p>
                <h2>Failed to Load Products</h2>
                <p>{error}</p>
                <button onClick={handleRefreshProducts}>Retry</button>
            </div>
        );
    }

    return(
        <main className="products-page">
            <section className="shop-hero">
                <div>
                    <p className="eyebrow">Curated essentials</p>
                    <h2>Fresh finds for everyday living.</h2>
                    <p className="hero-copy">Explore a clean, curated collection and add exactly what you need to your cart.</p>
                </div>
                <div className="products-summary">
                    <span>{filteredProducts.length}</span>
                    <small>items available</small>
                </div>
            </section>

            <section className="filters" aria-label="Product filters">
                <div className="search-field">
                    <span aria-hidden="true">⌕</span>
                    <input
                        type="text"
                        placeholder="Search products"
                        value={searchText}
                        onChange={(event)=> setSearchText(event.target.value)}
                    />
                </div>

                <select
                    value={selectedCategory}
                    onChange={(event)=> setSelectedCategory(event.target.value)}
                    aria-label="Filter by category"
                >
                    {categories.map((category)=>(
                        <option key={category} value={category}>
                            {category}
                        </option>
                    ))}
                </select>

                <select
                    value={sortOrder}
                    onChange={(event) => setSortOrder(event.target.value)}
                    aria-label="Sort products"
                >
                    <option value="default">Default</option>
                    <option value="low-to-high">Price: Low to High</option>
                    <option value="high-to-low">Price: High to Low</option>
                </select>

                <button 
                    className="refresh-btn" 
                    onClick={handleRefreshProducts} 
                    disabled={isLoading}
                >
                    {isLoading ? "Refreshing..." : "Refresh Products"}
                </button>

                {error && <p className="error-text filter-error">Could not refresh: {error}</p>}
            </section>

            {filteredProducts.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon">⌕</div>
                    <h3>No products found</h3>
                    <p>No products found for your search.</p>
                </div>
            ):(
                <section className="product-grid">
                    {filteredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </section>
            )}
        </main>
    );
}
export default ProductList;
