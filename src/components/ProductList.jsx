import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../features/products/productSlice";
import ProductCard from "./ProductCard";

function ProductList() {

    const dispatch = useDispatch();

    // This reads product state from Redux:
    const {products, isLoading, error } = useSelector((state) => state.products);

    // searchText stores what user types in search box.
    const [searchText, setSearchText] = useState("");
    // selectedCategory stores selected category.
    const [selectedCategory, setSelectedCategory] = useState("All");
    // This stores the selected sorting option.
    const [sortOrder, setSortOrder] = useState("default");

    // This code runs when ProductList loads: For initial page load.
    useEffect(() => {
        dispatch(fetchProducts());
    },[dispatch]);

    //For manual refersh.
    const handleRefreshProducts = () => {
        dispatch(fetchProducts());
    }
    const categories = ["All",
        ...new Set(products.map((product) => product.category).filter(Boolean)),
    ];

    const getFilteredProducts = () => {
        // This creates a copy of the products array. Now we are sorting the copied array, not the original array.
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
    return <h2>Loading Products....</h2>;
   }

   if(error && products.length === 0){
    return (
        <div className="api-error">
            <h2>Failed to Load Products</h2>
            <p>{error}</p>
            {/* If API fails and no products are available, show retry button.*/}
            <button onClick={handleRefreshProducts}>Retry</button>
        </div>
    );
   }

    return(
        <div>
            <h2>Products</h2>
            <div className="filters">
                <input
                    type="text"
                    placeholder="Search products"
                    value={searchText}
                    onChange={(event)=> setSearchText(event.target.value)}
                />
                <select
                    value={selectedCategory}
                    onChange={(event)=> setSelectedCategory(event.target.value)}
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
                >
                    <option value="default">Default</option>
                    <option value="low-to-high">Price: Low to High</option>
                    <option value="high-to-low">Price: High to Low</option>
                </select>
                <button 
                    className="refersh-btn" 
                    onClick={handleRefreshProducts} 
                    disabled={isLoading}
                >
                    {isLoading ? "Refreshing...." : "Refersh Products"}
                </button>

                {error && <p className="error-text">Could not refersh: {error}</p>}
            </div>

            {filteredProducts.length === 0 ? (
                <p>No Products Found..</p>
            ):(
                <div className="product-grid">
                {/* We are looping over all products: */}

                {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
            )}
            
        </div>
    );
}
export default ProductList;