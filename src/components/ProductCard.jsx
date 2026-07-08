import { useDispatch } from "react-redux";
import { addToCart } from "../features/cart/cartSlice";

function ProductCard({ product }) {

    const dispatch = useDispatch(); //This line gives us access to Redux dispatch: Send an instruction to Redux

    const handleAddToCart = () => {
        dispatch(addToCart(product)); //This line sends the selected product to Redux:
    };

    return(
        <div className="product-card">
            <img src={product.image} alt={product.name} />
            <h3>{product.name}</h3>
            <p className="product-category">{product}</p>
            <p>Rs.{product.price}</p>
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