import { useState} from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { clearCart } from "../features/cart/cartSlice";
import { addOrder } from "../features/orders/orderSlice";
import { showNotification } from "../features/notification/notificationSlice";

function CheckoutForm() {

    const dispatch = useDispatch();

    {/* React Router’s useNavigate gives us a function to navigate programmatically */}
    const navigate = useNavigate();

    const cartItems = useSelector((state)=>state.cart.cartItems);
    const totalAmount = useSelector((state)=>state.cart.totalAmount);
    const totalQuantity = useSelector((state)=>state.cart.totalQuantity);

    // This is local component state:
    // This data belongs only to the checkout form.
    const [formData, setFormData] = useState({
        fullName: "", 
        email: "",
        address: "",
        city: "",
        pincode: "",
    });

    // We added one new state: This stores error messages.
    const [errors, setErrors] = useState({});
    const [orderSuccess, setOrderSuccess] = useState(false);


    // This function checks the form values:
    const validateForm = () => {
        // This function checks the form values:
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
        // Check every field.
        // If any field is wrong, add error message.
        // Return all errors.
        return newErrors;
    }
    

    // When the user types, this function runs:
    const handleInputChange = (e) => {

        // This part gets the input name and value:
        const { name, value} = e.target;

        // Then this updates only that field:
        setFormData({
            ...formData,
            [name]: value,
        })

        // When user starts typing again in a field, clear the error message for that field.
        setErrors({
            ...errors,
            [name]:"",
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if(cartItems.length === 0){
            alert("Your cart is empty. please add products before checkout.");
            {/* we can redirect the user after actions like empty-cart checkout or successful order. */}
            navigate("/");
            return;
        }

        const validationErrors = validateForm();

        // If there is even one error,
        // show errors on screen,
        // stop form submit.
        if(Object.keys(validationErrors).length > 0){
            setErrors(validationErrors);
            return;
        }
        // So the order will not be placed until all fields are valid.
        
        const orderData = {
            id: `ORD-${Date.now()}`, //e.g. ORD-1720000000000
            customer: {
                ...formData, //This stores checkout form details.
            },
            items: cartItems.map((item) => ({
                ...item, //This stores checkout form details.
            })),
            totalAmount, //This stores the order value.
            totalQuantity, //This stores the total quantity of items.
            orderDate: new Date().toLocaleString(), //This stores the date and time of order.
        };
        dispatch(addOrder(orderData));

        // console.log("Order Details :" ,{
        //     customer : formData,
        //     products : cartItems,
        //     totalAmount : totalAmount,
        // });

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
            <div className="checkout-success">
                <h2>Order Placed Successfully!</h2>
                <p>Thank you for shopping with us.</p>
                {/* we can redirect the user after actions like empty-cart checkout or successful order. */}
                <button onClick={()=>navigate("/")}>Continue Shopping</button>
                <button onClick={()=>navigate("/orders")}>View Orders</button>
            </div>
        );
    }

    return (
        <div className="checkout">
            <h2>Checkout</h2>

            <div className="checkout-summary">
                <p>Total Products : {cartItems.length}</p>
                 <p>Total Quantity: {totalQuantity}</p>
                <p>Total Amount : Rs.{totalAmount}</p>
            </div>

            <form onSubmit={handleSubmit} className="checkout-form">
                <div className="form-group">
                    <label>Full Name</label>
                    <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    required
                    >
                    </input>
                    {errors.fullName && <p className="error-text">{errors.fullName}</p>}
                </div>

                <div className="form-group">
                    <label>Email</label>
                    <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    required
                    >
                    </input>
                    {errors.email && <p className="error-text">{errors.email}</p>}
                </div>

                <div className="form-group">
                    <label>Address</label>
                    <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter your address"
                    required
                    >
                    </textarea>
                    {errors.address && <p className="error-text">{errors.address}</p>}
                </div>

                <div className="form-group">
                    <label>City</label>
                    <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Enter your city"
                    required
                    >
                    </input>
                    {errors.city && <p className="error-text">{errors.city}</p>}
                </div>

                <div className="form-group">
                    <label>Pincode</label>
                    <input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        placeholder="Enter your pincode"
                        required
                        >
                    </input>
                    {errors.pincode && <p className="error-text">{errors.pincode}</p>}
                </div>

                <button type="submit" className="place-order-btn">Place Order</button>
            </form>
        </div>
    );
}
export default CheckoutForm;