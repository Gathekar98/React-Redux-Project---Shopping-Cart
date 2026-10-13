import { useState} from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { clearCart } from "../features/cart/cartSlice";
import { addOrder } from "../features/orders/orderSlice";
import { showNotification } from "../features/notification/notificationSlice";
import { formatPrice } from "../utils/formatPrice";
import Icon from "./Icon";

function CheckoutForm() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const cartItems = useSelector((state)=>state.cart.cartItems);
    const totalAmount = useSelector((state)=>state.cart.totalAmount);
    const totalQuantity = useSelector((state)=>state.cart.totalQuantity);

    const [formData, setFormData] = useState({
        fullName: "", 
        email: "",
        address: "",
        city: "",
        pincode: "",
    });

    const [errors, setErrors] = useState({});
    const [orderSuccess, setOrderSuccess] = useState(false);

    const validateForm = () => {
        const newErrors = {};

        if(formData.fullName.trim().length <3){
            newErrors.fullName = "Full name must be at least 3 characters.";
        }

        if(!formData.email.includes("@") || !formData.email.includes(".")){
            newErrors.email = "Please enter a valid email address";
        }

        if(formData.address.trim().length < 10){
            newErrors.address = "Address must be at least 10 characters.";
        }

        if(formData.city.trim().length < 2){
            newErrors.city = "City name must be at least 2 characters.";
        }

        if(!/^[0-9]{6}$/.test(formData.pincode)){
            newErrors.pincode = "Pincode must be exactly 6 digits.";
        }
        return newErrors;
    }

    const handleInputChange = (e) => {
        const { name, value} = e.target;

        setFormData({
            ...formData,
            [name]: value,
        })

        setErrors({
            ...errors,
            [name]:"",
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if(cartItems.length === 0){
            alert("Your cart is empty. please add products before checkout.");
            navigate("/");
            return;
        }

        const validationErrors = validateForm();

        if(Object.keys(validationErrors).length > 0){
            setErrors(validationErrors);
            return;
        }
        
        const orderData = {
            id: `ORD-${Date.now()}`,
            customer: {
                ...formData,
            },
            items: cartItems.map((item) => ({
                ...item,
            })),
            totalAmount,
            totalQuantity,
            orderDate: new Date().toLocaleString(),
        };
        dispatch(addOrder(orderData));

        dispatch(clearCart());
        dispatch(showNotification({
            message: "Order placed successfully",
            type: "success",
        }));

        setOrderSuccess(true);

        setFormData({
            fullName: "",
            email:"",
            address: "",
            city: "",
            pincode: "",
        });
        setErrors({});
    };

    if(orderSuccess){
        return (
            <main className="checkout-success">
                <div className="success-icon">✓</div>
                <p className="eyebrow">Order confirmed</p>
                <h2>Order Placed Successfully!</h2>
                <p>Thank you for shopping with us.</p>
                <div className="success-actions">
                    <button onClick={()=>navigate("/")}>Continue Shopping</button>
                    <button className="secondary-action" onClick={()=>navigate("/orders")}>View Orders</button>
                </div>
            </main>
        );
    }

    return (
        <main className="checkout">
            <div className="checkout-steps"><span className="complete"><b><Icon name="check" size={15}/></b> Cart</span><i></i><span className="active"><b>2</b> Delivery</span><i></i><span><b>3</b> Confirm</span></div>
            <section className="page-intro checkout-intro">
                <p className="eyebrow">Almost there</p>
                <h2>Checkout</h2>
                <p>Enter your delivery details and review the order summary before placing your order.</p>
            </section>

            <div className="checkout-layout">
                <form onSubmit={handleSubmit} className="checkout-form">
                    <div className="form-section-heading">
                        <span><Icon name="truck" size={18}/> Delivery details</span>
                        <small>All fields are required</small>
                    </div>

                    <div className="form-group full-width">
                        <label htmlFor="fullName">Full Name</label>
                        <input
                            id="fullName"
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            placeholder="Enter your full name"
                            autoComplete="name"
                            required
                        />
                        {errors.fullName && <p className="error-text">{errors.fullName}</p>}
                    </div>

                    <div className="form-group full-width">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Enter your email"
                            autoComplete="email"
                            required
                        />
                        {errors.email && <p className="error-text">{errors.email}</p>}
                    </div>

                    <div className="form-group full-width">
                        <label htmlFor="address">Address</label>
                        <textarea
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            placeholder="Enter your address"
                            autoComplete="street-address"
                            required
                        />
                        {errors.address && <p className="error-text">{errors.address}</p>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="city">City</label>
                        <input
                            id="city"
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            placeholder="Enter your city"
                            autoComplete="address-level2"
                            required
                        />
                        {errors.city && <p className="error-text">{errors.city}</p>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="pincode">Pincode</label>
                        <input
                            id="pincode"
                            type="text"
                            name="pincode"
                            value={formData.pincode}
                            onChange={handleInputChange}
                            placeholder="Enter your pincode"
                            autoComplete="postal-code"
                            inputMode="numeric"
                            required
                        />
                        {errors.pincode && <p className="error-text">{errors.pincode}</p>}
                    </div>

                    <div className="payment-note full-width"><Icon name="shield"/><div><strong>Payment method</strong><p>This project has no payment integration. Your existing local order flow is preserved.</p></div></div>
                    <button type="submit" className="place-order-btn full-width">Place Order <Icon name="arrow" size={18}/></button>
                </form>

                <aside className="checkout-summary">
                    <p className="eyebrow">Order summary</p>
                    <h3>Review your cart</h3>
                    <div className="summary-row">
                        <span>Total Products</span>
                        <strong>{cartItems.length}</strong>
                    </div>
                    <div className="summary-row">
                        <span>Total Quantity</span>
                        <strong>{totalQuantity}</strong>
                    </div>
                    <div className="summary-divider"></div>
                    <div className="summary-row summary-total-row">
                        <span>Total Amount</span>
                        <strong>{formatPrice(totalAmount)}</strong>
                    </div>
                    <p className="summary-note">Your cart stays unchanged until the order is successfully placed.</p>
                </aside>
            </div>
        </main>
    );
}
export default CheckoutForm;
