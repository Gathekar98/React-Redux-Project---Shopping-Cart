import { useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../features/cart/cartSlice";
import { showNotification } from "../features/notification/notificationSlice";

function ProductCard({ product }) {

    const dispatch = useDispatch(); //This line gives us access to Redux dispatch: Send an instruction to Redux

    // This quantity is only needed inside one product card.
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
        // Inside one button click, we are dispatching two actions:

        // This updates cart state.
        dispatch(addToCart({
                ...product, //Take all product details.
                quantity : selectedQuantity, //add selected quantity also.
            }) //send everything to redux.
        ); //This line sends the selected product to Redux:
        
        // This updates notification state.
        dispatch(showNotification({
                message: `${product.name} added to cart.`,
                type: "success",
            })
        );

        setSelectedQuantity(1);
    };

    return(
        <div className="product-card">
            <img src={product.image} alt={product.name} />
            <h3>{product.name}</h3>
            <p className="product-category">{product.category}</p>
            <p>Rs.{product.price}</p>
            <div className="product-quantity">
                <button onClick={decreaseSelectedQuantity}>-</button>
                <span>{selectedQuantity}</span>
                <button onClick={increaseSelectedQuantity}>+</button>
            </div>
            <button onClick={handleAddToCart}>Add to Cart</button>
        </div>
    );
}

export default ProductCard;

// So when user clicks Add to Cart, this flow happens:
// Button click
//    ↓
// handleAddToCart()
//    ↓
// dispatch(addToCart(product))
//    ↓
// cartSlice reducer runs
//    ↓
// Redux state updates
//    ↓
// UI updates automatically


// Add to Cart button click
//         ↓
// cart/addToCart
//         ↓
// notification/showNotification