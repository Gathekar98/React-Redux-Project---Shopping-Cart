import { NavLink } from "react-router";
import { useSelector } from "react-redux";
import { formatPrice } from "../utils/formatPrice";

function Navbar() {
    const totalQuantity = useSelector((state)=>state.cart.totalQuantity);
    const totalAmount = useSelector((state)=>state.cart.totalAmount);

    return(
        <nav className="navbar">
            <h1>Shopping Cart Redux App</h1>

            <div className="nav-links">
                <NavLink to="/">Products</NavLink>
                <NavLink to="/cart">Cart ({totalQuantity})</NavLink>
                <NavLink to="/checkout">Checkout</NavLink>
                <NavLink to="/orders">Orders</NavLink>
            </div>

            <div className="cart-summary">
                <p>Total Items: {totalQuantity}</p>
                <p>Total : {formatPrice(totalAmount)}</p>
            </div>
        </nav>
    );
}

export default Navbar;