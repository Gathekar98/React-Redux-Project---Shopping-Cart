import { useState } from "react";
import { products } from "../data/products";
import ProductCard from "./ProductCard";

function ProductList() {

    // searchText stores what user types in search box.
    const [searchText, setSearchText] = useState("");
    // selectedCategory stores selected category.
    const [selectedCategory, setSelectedCategory] = useState("All");

    const categories = ["All", "Electronics", "Acessories", "Fashion"];

    const filteredProducts = products.filter((product) => {
        // Convert product name and search text to lowercase, then check whether product name includes the search text.
        const matchesSearch = product.name
        .toLowerCase()
        .includes(searchText.toLowerCase());

        // This part checks category: If selected category is All, show all products. Otherwise, show only products matching selected category.
        const matchesCategories = selectedCategory === "All" || product.category === selectedCategory;

        // Product should match search text and selected category both.
        return matchesCategories && matchesSearch;

    })

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