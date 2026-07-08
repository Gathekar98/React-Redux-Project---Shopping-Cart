import { useDispatch } from 'react-redux';
import { increaseQuantity, decreaseQuantity, removeFromCart } from '../features/cart/cartSlice';

function CartItem({ item }) {
    const dispatch = useDispatch();
    
    return(
        <div className="cart-item">
            <img src={item.image} alt={item.name} />

            <div className="cart-item-info">
                <h3>{item.name}</h3>
                <p>Price: Rs.{item.price}</p>
                <p>Total: Rs.{item.price * item.quantity}</p>
            </div>

            <div className="quantity-controls">
                <button onClick={()=>dispatch(decreaseQuantity(item.id))}>-</button>
                <span>{item.quantity}</span>
                <button onClick={()=>dispatch(increaseQuantity(item.id))}>+</button>
            </div>
            <button
                className="remove-btn"
                onClick={() => dispatch(removeFromCart(item.id))}
            >
                Remove
            </button>
        </div>
    );
}

export default CartItem;