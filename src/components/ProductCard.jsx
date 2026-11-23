import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router";
import { addToCart } from "../features/cart/cartSlice";
import { showNotification } from "../features/notification/notificationSlice";
import { toTitleCase } from "../features/products/catalog";
import { markImageBroken } from "../features/products/productSlice";
import { formatPrice } from "../utils/formatPrice";
import Icon from "./Icon";

function ProductCard({ product }) {
    const dispatch = useDispatch();
    const [isWishlisted, setIsWishlisted] = useState(false);
    const handleAddToCart = () => {
        dispatch(addToCart({ ...product, quantity: 1 }));
        dispatch(showNotification({ message: `${product.name} added to cart.`, type: "success" }));
    };
    const toggleWishlist = () => {
        setIsWishlisted(!isWishlisted);
        dispatch(showNotification({ message: isWishlisted ? "Removed from wishlist." : "Saved to your wishlist.", type: "success" }));
    };
    const productUrl = `/products/${product.id}`;
    return (
        <article className={`product-card ${product.inStock ? "" : "is-sold-out"}`}>
            <div className={`product-image-wrap audience-${product.audience}`}>
                <Link to={productUrl} aria-label={`View ${product.name}`}><img src={product.image} alt={product.name} loading="lazy" onError={() => dispatch(markImageBroken(product.id))} /></Link>
                {product.discount > 0 && <span className="discount-badge">{product.discount}% off</span>}
                {!product.inStock && <span className="sold-out-badge">Out of stock</span>}
                <button className={`wishlist-btn ${isWishlisted ? "active" : ""}`} onClick={toggleWishlist} aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}><Icon name="heart" size={18} filled={isWishlisted}/></button>
                <Link className="quick-view" to={productUrl}>Quick view</Link>
            </div>
            <div className="product-card-body">
                <div>
                    <p className="product-category-text">{product.brand} · {toTitleCase(product.category)}</p>
                    <Link className="product-title" to={productUrl}>{product.name}</Link>
                    <div className="product-meta">
                        <span className="rating-pill"><Icon name="star" size={11} filled/>{product.rating}</span>
                        <span>({product.ratingCount.toLocaleString("en-IN")})</span>
                    </div>
                </div>
                <div className="product-card-footer">
                    <div className="price-block">
                        <p className="product-price">{formatPrice(product.price)}</p>
                        {product.originalPrice > product.price && <s className="original-price">{formatPrice(product.originalPrice)}</s>}
                    </div>
                    <button className="addToCartBtn" onClick={handleAddToCart} disabled={!product.inStock} aria-label={product.inStock ? `Add ${product.name} to cart` : `${product.name} is out of stock`}><Icon name="cart" size={18}/><span>{product.inStock ? "Add" : "Sold out"}</span></button>
                </div>
            </div>
        </article>
    );
}
export default ProductCard;
