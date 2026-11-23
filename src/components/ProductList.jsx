import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import { fetchDepartmentCounts, fetchProducts, getFiltersKey, resetFilters, setFilters } from "../features/products/productSlice";
import { DEPARTMENTS, SORT_OPTIONS, getDepartment, toTitleCase } from "../features/products/catalog";
import ProductCard from "./ProductCard";
import Icon from "./Icon";

const SEARCH_DELAY_MS = 400;
const SLOW_SERVER_MS = 4000;

function ProductList() {
    const dispatch = useDispatch();
    const { products, meta, filters, loadedFiltersKey, isLoading, loadingPage, latestRequestId, error, departmentCounts } = useSelector((state) => state.products);
    const [searchText, setSearchText] = useState(filters.q);
    const [mobileFilters, setMobileFilters] = useState(false);
    const [slowRequestId, setSlowRequestId] = useState(null);
    const filtersKey = getFiltersKey(filters);
    const department = getDepartment(filters.audience);
    const totalProducts = departmentCounts[""] ?? meta?.total ?? 0;

    // Fetch page 1 whenever the filters differ from what is already loaded.
    // Coming back from a product page keeps the list as it was.
    useEffect(() => {
        if (filtersKey !== loadedFiltersKey) dispatch(fetchProducts({ page: 1 }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, filtersKey]);

    useEffect(() => {
        if (!Object.keys(departmentCounts).length) dispatch(fetchDepartmentCounts());
    }, [dispatch, departmentCounts]);

    // Links such as "/#catalog" (breadcrumbs, navbar) land on the catalog.
    const { hash, key: locationKey } = useLocation();
    const hasProducts = products.length > 0;
    useEffect(() => {
        if (hash && hasProducts) document.querySelector(hash)?.scrollIntoView();
    }, [hash, locationKey, hasProducts]);

    // Search on the server once the user pauses typing.
    useEffect(() => {
        if (searchText === filters.q) return undefined;
        const timer = setTimeout(() => dispatch(setFilters({ q: searchText })), SEARCH_DELAY_MS);
        return () => clearTimeout(timer);
    }, [dispatch, searchText, filters.q]);

    // The API runs on a free host that sleeps; tell people why the first load is slow.
    useEffect(() => {
        if (!isLoading) return undefined;
        const timer = setTimeout(() => setSlowRequestId(latestRequestId), SLOW_SERVER_MS);
        return () => clearTimeout(timer);
    }, [isLoading, latestRequestId]);
    const isSlow = isLoading && slowRequestId === latestRequestId;

    const chooseDepartment = (key) => {
        dispatch(setFilters({ audience: key }));
        document.querySelector("#catalog")?.scrollIntoView();
    };
    const clearAll = () => { setSearchText(""); dispatch(resetFilters()); };
    const refresh = () => dispatch(fetchProducts({ page: 1 }));
    const loadMore = () => dispatch(fetchProducts({ page: (meta?.page ?? 1) + 1 }));

    if (isLoading && products.length === 0) return <main className="loading-page">{isSlow && <p className="server-wake-note"><Icon name="refresh" size={16}/> Waking up the product server. The first load can take up to a minute.</p>}<div className="skeleton-hero"></div><div className="skeleton-grid">{Array.from({length: 8}).map((_, i) => <div className="skeleton-card" key={i}></div>)}</div></main>;
    if (error && products.length === 0) return <main className="api-error"><span className="state-icon">!</span><p className="eyebrow">We hit a snag</p><h2>We couldn’t load the collection.</h2><p>{error}</p><button className="primary-btn" onClick={refresh}><Icon name="refresh" size={18}/> Try again</button></main>;

    const heading = filters.category ? toTitleCase(filters.category) : filters.audience ? `${department.label}'s collection` : "Trending products";
    const isLoadingMore = isLoading && loadingPage > 1;

    return (
        <main className="products-page">
            <section className="hero-section"><div className="hero-copy-block"><span className="hero-pill">Fresh finds · Everyday value</span><h1>Everything you love, <em>one place.</em></h1><p>Discover a thoughtfully curated collection designed to make every day a little better.</p><div className="hero-actions"><a className="hero-cta" href="#catalog">Shop collection <Icon name="arrow" size={18}/></a><a className="hero-link" href="#categories">Browse departments</a></div><div className="hero-trust"><span><Icon name="truck"/>Easy shopping</span><span><Icon name="shield"/>Secure checkout</span></div></div><div className="hero-visual" aria-hidden="true"><div className="floating-note"><span>✦</span><strong>{totalProducts} finds</strong><small>picked for you</small></div></div></section>
            <section className="service-strip" aria-label="Shopping benefits"><span><Icon name="truck"/><b>Easy shopping</b><small>Browse from anywhere</small></span><span><Icon name="shield"/><b>Secure checkout</b><small>Your details stay protected</small></span><span><Icon name="refresh"/><b>Fresh collection</b><small>Refresh products anytime</small></span></section>

            <section className="category-section" id="categories">
                <div className="section-heading category-heading"><div><p className="eyebrow">Find it faster</p><h2>Shop by department</h2></div><p>Men, women, kids and home, all in one place.</p></div>
                <div className="category-scroller">{DEPARTMENTS.map((item) => (
                    <button key={item.key || "all"} className={`category-card has-photo ${filters.audience === item.key ? "active" : ""}`} onClick={() => chooseDepartment(item.key)}>
                        <span className="category-photo"><img src={item.image} alt="" loading="lazy"/></span>
                        <span className="category-card-copy"><b>{item.label}</b><small>{departmentCounts[item.key] ?? "–"} items</small></span>
                    </button>
                ))}</div>
            </section>

            <section className="catalog-section" id="catalog">
                <div className="section-heading catalog-heading"><div><p className="eyebrow">{filters.audience ? department.label : "Curated for you"}</p><h2>{heading}</h2><p>{filters.q ? `Results for “${filters.q}”` : "Every product currently available in our live collection."}</p></div><span className="result-count">{meta?.total ?? 0} products</span></div>

                <div className="catalog-toolbar">
                    <label className="catalog-search"><Icon name="search" size={19}/><span className="sr-only">Search products</span><input value={searchText} onChange={(e) => setSearchText(e.target.value)} placeholder="Search by name, brand or category"/></label>
                    <button className="filter-toggle" onClick={() => setMobileFilters(!mobileFilters)}><Icon name="filter" size={18}/> Filters</button>
                    <div className={`filter-controls ${mobileFilters ? "is-open" : ""}`}>
                        <label><span>Department</span><select value={filters.audience} onChange={(e) => dispatch(setFilters({ audience: e.target.value }))}>{DEPARTMENTS.map((item) => <option key={item.key || "all"} value={item.key}>{item.label}</option>)}</select></label>
                        <label><span>Sort by</span><select value={filters.sort} onChange={(e) => dispatch(setFilters({ sort: e.target.value }))}>{SORT_OPTIONS.map((option) => <option key={option.value || "featured"} value={option.value}>{option.label}</option>)}</select></label>
                        <button className="refresh-btn" onClick={refresh} disabled={isLoading}><Icon name="refresh" size={17}/>{isLoading ? "Loading" : "Refresh"}</button>
                    </div>
                </div>

                {department.categories.length > 0 && <div className="category-chips" role="group" aria-label={`${department.label} categories`}>
                    <button className={!filters.category ? "active" : ""} onClick={() => dispatch(setFilters({ category: "" }))}>All {department.label}</button>
                    {department.categories.map((category) => <button key={category} className={filters.category === category ? "active" : ""} onClick={() => dispatch(setFilters({ category }))}>{toTitleCase(category)}</button>)}
                </div>}

                {error && <p className="inline-error">Could not load products: {error}</p>}
                {isLoading && !isLoadingMore && isSlow && <p className="server-wake-note"><Icon name="refresh" size={16}/> Waking up the product server…</p>}

                {products.length ? <>
                    <div className={`product-grid ${isLoading && !isLoadingMore ? "is-refreshing" : ""}`}>{products.map((product) => <ProductCard key={product.id} product={product}/>)}</div>
                    <div className="load-more">
                        <p>Showing {products.length} of {meta?.total ?? products.length}</p>
                        {meta?.hasNextPage && <button className="secondary-btn" onClick={loadMore} disabled={isLoading}>{isLoadingMore ? "Loading…" : "Load more products"}</button>}
                    </div>
                </> : !isLoading && <div className="empty-state"><span className="state-icon"><Icon name="search" size={28}/></span><h3>No matching products</h3><p>Try another search or choose a different department.</p><button className="secondary-btn" onClick={clearAll}>Clear filters</button></div>}
            </section>
        </main>
    );
}
export default ProductList;
