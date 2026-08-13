import { useDispatch } from 'react-redux';
import { increaseQuantity, decreaseQuantity, removeFromCart } from '../features/cart/cartSlice';
import { showNotification } from '../features/notification/notificationSlice';
import { formatPrice } from '../utils/formatPrice';

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
        <article className="cart-item">
            <div className="cart-item-image">
                <img src={item.image} alt={item.name} />
            </div>

            <div className="cart-item-info">
                <h3>{item.name}</h3>
                <p className="cart-item-unit-price">Price: {formatPrice(item.price)}</p>
                <p className="cart-item-total">{formatPrice(item.price * item.quantity)}</p>
            </div>

            <div className="cart-item-actions">
                <div className="quantity-controls">
                    <button onClick={()=>dispatch(decreaseQuantity(item.id))} aria-label={`Decrease quantity of ${item.name}`}>−</button>
                    <span>{item.quantity}</span>
                    <button onClick={()=>dispatch(increaseQuantity(item.id))} aria-label={`Increase quantity of ${item.name}`}>+</button>
                </div>
                <button
                    className="remove-btn"
                    onClick={handleRemoveFromCart}
                >
                    Remove
                </button>
            </div>
        </article>
    );
}

export default CartItem;
