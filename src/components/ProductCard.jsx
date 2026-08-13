import { useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../features/cart/cartSlice";
import { showNotification } from "../features/notification/notificationSlice";
import { formatPrice } from "../utils/formatPrice";

function ProductCard({ product }) {

    const dispatch = useDispatch();
    const [selectedQuantity, setSelectedQuantity] = useState(1);

    const increaseSelectedQuantity = () => {
        setSelectedQuantity(selectedQuantity + 1);
    };

    const decreaseSelectedQuantity = () => {
        if(selectedQuantity > 1){
            setSelectedQuantity(selectedQuantity - 1);
        }
    };

    const handleAddToCart = () => {
        dispatch(addToCart({
                ...product,
                quantity : selectedQuantity,
            })
        );
        
        dispatch(showNotification({
                message: `${product.name} added to cart.`,
                type: "success",
            })
        );

        setSelectedQuantity(1);
    };

    return(
        <article className="product-card">
            <div className="product-image-wrap">
                <img src={product.image} alt={product.name} onError={(event) => {event.target.src = "https://via.placeholder.com/200x150?text=No+Image";}}/>
                <span className="product-category">{product.category}</span>
            </div>

            <div className="product-card-body">
                <div className="product-card-copy">
                    <h3>{product.name}</h3>
                    <p className="product-price">{formatPrice(product.price)}</p>
                </div>

                <div className="product-buy-row">
                    <div className="product-quantity" aria-label={`Select quantity for ${product.name}`}>
                        <button onClick={decreaseSelectedQuantity} aria-label="Decrease quantity">−</button>
                        <span>{selectedQuantity}</span>
                        <button onClick={increaseSelectedQuantity} aria-label="Increase quantity">+</button>
                    </div>
                    <button className="addToCartBtn" onClick={handleAddToCart}>Add to Cart</button>
                </div>
            </div>
        </article>
    );
}

export default ProductCard;
