import { NavLink } from "react-router";
import { useSelector } from "react-redux";
import { formatPrice } from "../utils/formatPrice";

function Navbar() {
    const totalQuantity = useSelector((state)=>state.cart.totalQuantity);
    const totalAmount = useSelector((state)=>state.cart.totalAmount);

    return(
        <nav className="navbar">
            <div className="brand-block">
                <div className="brand-mark">S</div>
                <div>
                    <p className="brand-kicker">Everyday essentials</p>
                    <h1>ShopKart</h1>
                </div>
            </div>

            <div className="nav-links">
                <NavLink to="/">Products</NavLink>
                <NavLink to="/cart">Cart ({totalQuantity})</NavLink>
                <NavLink to="/checkout">Checkout</NavLink>
                <NavLink to="/orders">Orders</NavLink>
            </div>

            <div className="cart-summary">
                <div>
                    <span className="summary-label">Items</span>
                    <strong>{totalQuantity}</strong>
                </div>
                <div>
                    <span className="summary-label">Cart total</span>
                    <strong>{formatPrice(totalAmount)}</strong>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
