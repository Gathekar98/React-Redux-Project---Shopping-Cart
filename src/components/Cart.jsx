import { useSelector , useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import CartItem from './CartItem';
import { clearCart } from '../features/cart/cartSlice';
import { showNotification } from '../features/notification/notificationSlice';

function Cart() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const cartItems = useSelector((state)=>state.cart.cartItems);
    const totalQuantity = useSelector((state)=>state.cart.totalQuantity);
    const totalAmount = useSelector((state)=>state.cart.totalAmount);

    const handleClearCart = () => {
        dispatch(clearCart);

        dispatch(
            showNotification({
                message: `Cart cleared successfully.`,
                type: "success",
            })
        );
    };

    return(
        <div className="cart">
            <h2>Cart</h2>

            {cartItems.length === 0 ? (
                    <p>Your cart is empty.</p>
                ) : (
                    <>
                    <div className="cart-items">
                        {cartItems.map((item)=>(
                            <CartItem key={item.id} item={item} />
                        ))}
                    </div>
                    
                    <div className="cart-total">
                        <h3>Cart Summary</h3>
                        <p>Total Quantity: {totalQuantity}</p>
                        <p>Total Amount: Rs.{totalAmount}</p>
                        <button className="checkout-btn" onClick={() => navigate("/checkout")}>
                            Proceed to Checkout
                        </button>
                        <button className="clear-cart-btn" onClick={handleClearCart}>
                            Clear Cart
                        </button>
                    </div>
                    </>
                )
            }
        </div>
    );
}

export default Cart;