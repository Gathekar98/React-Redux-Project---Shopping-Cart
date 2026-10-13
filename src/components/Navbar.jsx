import { NavLink, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { useState } from "react";
import Icon from "./Icon";

function Navbar() {
    const totalQuantity = useSelector((state)=>state.cart.totalQuantity);
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const closeMenu = () => setMenuOpen(false);

    return(
        <header className="site-header">
            <div className="header-main">
                <NavLink to="/" className="brand-block" onClick={closeMenu} aria-label="ShopKart home">
                    <span className="brand-mark"><Icon name="bag" size={22}/></span>
                    <span className="brand-name">Shop<span>Kart</span></span>
                </NavLink>

                <button className="header-search" onClick={() => navigate("/#catalog")} aria-label="Go to product search">
                    <Icon name="search" size={19}/>
                    <span>Search for products, categories and more</span>
                </button>

                <div className="header-actions">
                    <button className="header-action desktop-only" aria-label="Profile"><Icon name="user"/><span>Account</span></button>
                    <button className="header-action desktop-only" aria-label="Wishlist"><Icon name="heart"/><span>Wishlist</span></button>
                    <NavLink className="header-action cart-action" to="/cart" aria-label={`Cart with ${totalQuantity} items`}>
                        <span className="icon-badge"><Icon name="cart"/>{totalQuantity > 0 && <b>{totalQuantity}</b>}</span><span>Cart</span>
                    </NavLink>
                    <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label="Toggle navigation"><Icon name={menuOpen ? "close" : "menu"}/></button>
                </div>
            </div>

            <nav className={`category-nav ${menuOpen ? "is-open" : ""}`} aria-label="Main navigation">
                <NavLink to="/" end onClick={closeMenu}>Shop</NavLink>
                <a href="/#catalog" onClick={closeMenu}>Categories</a>
                <NavLink to="/cart" onClick={closeMenu}>Cart</NavLink>
                <NavLink to="/checkout" onClick={closeMenu}>Checkout</NavLink>
                <NavLink to="/orders" onClick={closeMenu}>Orders</NavLink>
                <span className="nav-promise"><Icon name="truck" size={17}/> Simple shopping, delivered</span>
            </nav>
        </header>
    );
}

export default Navbar;
