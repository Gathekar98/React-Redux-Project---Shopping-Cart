import { useSelector , useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import CartItem from './CartItem';
import { clearCart } from '../features/cart/cartSlice';
import { showNotification } from '../features/notification/notificationSlice';
import { formatPrice } from '../utils/formatPrice';

function Cart() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const cartItems = useSelector((state)=>state.cart.cartItems);
    const totalQuantity = useSelector((state)=>state.cart.totalQuantity);
    const totalAmount = useSelector((state)=>state.cart.totalAmount);

    const handleClearCart = () => {
        dispatch(clearCart());

        dispatch(
            showNotification({
                message: `Cart cleared successfully.`,
                type: "success",
            })
        );
    };

    return(
        <main className="cart">
            <section className="page-intro cart-intro">
                <div>
                    <p className="eyebrow">Your selection</p>
                    <h2>Shopping Cart</h2>
                    <p>Review quantities, remove items, and continue when everything looks right.</p>
                </div>
                {cartItems.length > 0 && (
                    <div className="cart-count-badge">{totalQuantity} item{totalQuantity !== 1 ? 's' : ''}</div>
                )}
            </section>

            {cartItems.length === 0 ? (
                <section className="empty-state cart-empty-state">
                    <div className="empty-state-icon">🛒</div>
                    <h3>Your cart is empty.</h3>
                    <p>Add a few products and they’ll appear here.</p>
                    <button className="primary-btn" onClick={() => navigate("/")}>Continue Shopping</button>
                </section>
            ) : (
                <div className="cart-layout">
                    <section className="cart-items-panel">
                        <div className="cart-section-heading">
                            <span>Items in your cart</span>
                            <strong>{cartItems.length}</strong>
                        </div>
                        <div className="cart-items">
                            {cartItems.map((item)=>(
                                <CartItem key={item.id} item={item} />
                            ))}
                        </div>
                    </section>
                    
                    <aside className="cart-total">
                        <p className="eyebrow">Order overview</p>
                        <h3>Cart Summary</h3>
                        <div className="summary-row">
                            <span>Total Quantity</span>
                            <strong>{totalQuantity}</strong>
                        </div>
                        <div className="summary-divider"></div>
                        <div className="summary-row summary-total-row">
                            <span>Total Amount</span>
                            <strong>{formatPrice(totalAmount)}</strong>
                        </div>
                        <p className="summary-note">Taxes and delivery charges, if applicable, can be shown at checkout.</p>
                        <button className="checkout-btn" onClick={() => navigate("/checkout")}>Proceed to Checkout</button>
                        <button className="clear-cart-btn" onClick={handleClearCart}>Clear Cart</button>
                    </aside>
                </div>
            )}
        </main>
    );
}

export default Cart;
