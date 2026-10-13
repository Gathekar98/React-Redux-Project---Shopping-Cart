import { useMemo, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../features/products/productSlice";
import ProductCard from "./ProductCard";
import Icon from "./Icon";

function ProductList() {
    const dispatch = useDispatch();
    const { products, isLoading, error } = useSelector((state) => state.products);
    const [searchText, setSearchText] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [sortOrder, setSortOrder] = useState("default");
    const [mobileFilters, setMobileFilters] = useState(false);
    useEffect(() => { dispatch(fetchProducts()); }, [dispatch]);
    const categories = useMemo(() => ["All", ...new Set(products.map((product) => product.category).filter(Boolean))], [products]);
    const filteredProducts = useMemo(() => {
        let next = products.filter((product) => product.name.toLowerCase().includes(searchText.trim().toLowerCase()));
        if (selectedCategory !== "All") next = next.filter((product) => product.category === selectedCategory);
        if (sortOrder === "low-to-high") next = [...next].sort((a, b) => a.price - b.price);
        if (sortOrder === "high-to-low") next = [...next].sort((a, b) => b.price - a.price);
        return next;
    }, [products, searchText, selectedCategory, sortOrder]);
    const getCategoryIcon = (category) => {
        const value = category.toLowerCase();
        if (category === "All") return "grid";
        if (value.includes("electronic")) return "electronics";
        if (value.includes("furniture") || value.includes("home")) return "furniture";
        if (value.includes("shoe") || value.includes("footwear")) return "shoes";
        if (value.includes("mobile") || value.includes("phone")) return "mobile";
        if (value.includes("sport") || value.includes("fitness")) return "fitness";
        if (value.includes("cloth") || value.includes("fashion") || value.includes("category name")) return "fashion";
        if (value.includes("misc") || value.includes("new")) return "featured";
        return "package";
    };
    if (isLoading && products.length === 0) return <main className="loading-page"><div className="skeleton-hero"></div><div className="skeleton-grid">{Array.from({length: 8}).map((_, i) => <div className="skeleton-card" key={i}></div>)}</div></main>;
    if (error && products.length === 0) return <main className="api-error"><span className="state-icon">!</span><p className="eyebrow">We hit a snag</p><h2>We couldn’t load the collection.</h2><p>{error}</p><button className="primary-btn" onClick={() => dispatch(fetchProducts())}><Icon name="refresh" size={18}/> Try again</button></main>;
    return (
        <main className="products-page">
            <section className="hero-section"><div className="hero-copy-block"><span className="hero-pill">Fresh finds · Everyday value</span><h1>Everything you love, <em>one place.</em></h1><p>Discover a thoughtfully curated collection designed to make every day a little better.</p><div className="hero-actions"><a className="hero-cta" href="#catalog">Shop collection <Icon name="arrow" size={18}/></a><a className="hero-link" href="#categories">Browse categories</a></div><div className="hero-trust"><span><Icon name="truck"/>Easy shopping</span><span><Icon name="shield"/>Secure checkout</span></div></div><div className="hero-visual" aria-hidden="true"><div className="floating-note"><span>✦</span><strong>{products.length} finds</strong><small>picked for you</small></div></div></section>
            <section className="service-strip" aria-label="Shopping benefits"><span><Icon name="truck"/><b>Easy shopping</b><small>Browse from anywhere</small></span><span><Icon name="shield"/><b>Secure checkout</b><small>Your details stay protected</small></span><span><Icon name="refresh"/><b>Fresh collection</b><small>Refresh products anytime</small></span></section>
            <section className="category-section" id="categories"><div className="section-heading category-heading"><div><p className="eyebrow">Find it faster</p><h2>Shop by category</h2></div><p>Browse the collection by what you need.</p></div><div className="category-scroller">{categories.map((category) => <button key={category} className={`category-card ${selectedCategory === category ? "active" : ""}`} onClick={() => { setSelectedCategory(category); document.querySelector("#catalog")?.scrollIntoView(); }}><span className={`category-vector category-vector-${getCategoryIcon(category)}`}><Icon name={getCategoryIcon(category)} size={29}/></span><span className="category-card-copy"><b>{category === "All" ? "All products" : category}</b><small>{category === "All" ? products.length : products.filter(p => p.category === category).length} items</small></span></button>)}</div></section>
            <section className="catalog-section" id="catalog"><div className="section-heading catalog-heading"><div><p className="eyebrow">Curated for you</p><h2>{selectedCategory === "All" ? "Trending products" : selectedCategory}</h2><p>Every product currently available in our live collection.</p></div><span className="result-count">{filteredProducts.length} products</span></div><div className="catalog-toolbar"><label className="catalog-search"><Icon name="search" size={19}/><span className="sr-only">Search products</span><input value={searchText} onChange={(e) => setSearchText(e.target.value)} placeholder="What are you looking for?"/></label><button className="filter-toggle" onClick={() => setMobileFilters(!mobileFilters)}><Icon name="filter" size={18}/> Filters</button><div className={`filter-controls ${mobileFilters ? "is-open" : ""}`}><label><span>Category</span><select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>{categories.map((category) => <option key={category}>{category}</option>)}</select></label><label><span>Sort by</span><select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}><option value="default">Featured</option><option value="low-to-high">Price: Low to high</option><option value="high-to-low">Price: High to low</option></select></label><button className="refresh-btn" onClick={() => dispatch(fetchProducts())} disabled={isLoading}><Icon name="refresh" size={17}/>{isLoading ? "Refreshing" : "Refresh"}</button></div></div>{error && <p className="inline-error">Could not refresh: {error}</p>}{filteredProducts.length ? <div className="product-grid">{filteredProducts.map((product) => <ProductCard key={product.id} product={product}/>)}</div> : <div className="empty-state"><span className="state-icon"><Icon name="search" size={28}/></span><h3>No matching products</h3><p>Try another search or choose a different category.</p><button className="secondary-btn" onClick={() => { setSearchText(""); setSelectedCategory("All"); }}>Clear filters</button></div>}</section>
        </main>
    );
}
export default ProductList;
