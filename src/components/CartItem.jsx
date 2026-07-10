import { useDispatch } from 'react-redux';
import { increaseQuantity, decreaseQuantity, removeFromCart } from '../features/cart/cartSlice';
import { showNotification } from '../features/notification/notificationSlice';

function CartItem({ item }) {
    const dispatch = useDispatch();

    const handleRemoveFromCart = () => {
        dispatch(removeFromCart(item.id)); 

        dispatch(showNotification({
                message: `${item.name} removed from cart`,
                type: "success",
            })
        )
    }
    
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
                onClick={handleRemoveFromCart}
            >
                Remove
            </button>
        </div>
    );
}

export default CartItem;