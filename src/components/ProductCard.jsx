import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router";
import { addToCart } from "../features/cart/cartSlice";
import { showNotification } from "../features/notification/notificationSlice";
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
    return (
        <article className="product-card">
            <div className="product-image-wrap">
                <Link to={`/products/${product.id}`} aria-label={`View ${product.name}`}><img src={product.image} alt={product.name} loading="lazy" onError={(event) => { event.currentTarget.src = "/favicon.svg"; }} /></Link>
                <span className="product-category">{product.category || "Featured"}</span>
                <button className={`wishlist-btn ${isWishlisted ? "active" : ""}`} onClick={toggleWishlist} aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}><Icon name="heart" size={18} filled={isWishlisted}/></button>
                <Link className="quick-view" to={`/products/${product.id}`}>Quick view</Link>
            </div>
            <div className="product-card-body"><div><p className="product-category-text">{product.category}</p><Link className="product-title" to={`/products/${product.id}`}>{product.name}</Link><div className="product-meta"><span className="stock-dot"></span> Available now</div></div><div className="product-card-footer"><p className="product-price">{formatPrice(product.price)}</p><button className="addToCartBtn" onClick={handleAddToCart} aria-label={`Add ${product.name} to cart`}><Icon name="cart" size={18}/><span>Add</span></button></div></div>
        </article>
    );
}
export default ProductCard;
