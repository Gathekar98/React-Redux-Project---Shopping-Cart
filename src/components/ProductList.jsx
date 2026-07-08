import { products } from "../data/products";
import ProductCard from "./ProductCard";

function ProductList() {
    return(
        <div>
            <h2>Products</h2>
            <div className="product-grid">
                {/* We are looping over all products: */}
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
}
export default ProductList;