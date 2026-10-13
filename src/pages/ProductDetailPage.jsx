import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router";
import { fetchProducts } from "../features/products/productSlice";
import { addToCart } from "../features/cart/cartSlice";
import { showNotification } from "../features/notification/notificationSlice";
import { formatPrice } from "../utils/formatPrice";
import ProductCard from "../components/ProductCard";
import Icon from "../components/Icon";

function ProductDetailPage() {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products, isLoading } = useSelector((state) => state.products);
  const product = products.find((item) => String(item.id) === productId);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  useEffect(() => { if (!products.length) dispatch(fetchProducts()); }, [dispatch, products.length]);
  if (isLoading && !product) return <main className="loading-page"><div className="skeleton-hero"></div></main>;
  if (!product) return <main className="empty-state standalone-state"><h2>Product not found</h2><Link className="primary-btn" to="/">Back to shop</Link></main>;
  const addProduct = (goToCart = false) => { dispatch(addToCart({ ...product, quantity })); dispatch(showNotification({ message: `${product.name} added to cart.`, type: "success" })); if (goToCart) navigate("/cart"); };
  const images = product.images?.length ? product.images : [product.image];
  const related = products.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 4);
  return <main className="product-detail-page">
    <nav className="breadcrumbs"><Link to="/">Home</Link><Icon name="chevron" size={14}/><span>{product.category}</span><Icon name="chevron" size={14}/><b>{product.name}</b></nav>
    <section className="product-detail"><div className="product-gallery"><div className="thumbnail-list">{images.slice(0,4).map((image, index) => <button className={activeImage === index ? "active" : ""} key={`${image}-${index}`} onClick={() => setActiveImage(index)}><img src={image} alt="" onError={(e) => { e.currentTarget.src = "/favicon.svg"; }}/></button>)}</div><div className="main-product-image"><img src={images[activeImage]} alt={product.name} onError={(e) => { e.currentTarget.src = "/favicon.svg"; }}/></div></div><div className="product-info"><p className="eyebrow">{product.category}</p><h1>{product.name}</h1><p className="availability"><span></span> In stock and ready to add</p><p className="detail-price">{formatPrice(product.price)}</p><p className="detail-description">{product.description || "Product details are not currently available."}</p><div className="purchase-row"><div className="quantity-controls"><button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button><span>{quantity}</span><button onClick={() => setQuantity(quantity + 1)}>+</button></div><button className="detail-cart-btn" onClick={() => addProduct()}><Icon name="cart"/> Add to cart</button></div><button className="buy-now-btn" onClick={() => addProduct(true)}>Buy now</button><div className="detail-benefits"><span><Icon name="shield"/> Secure local checkout</span><span><Icon name="truck"/> Delivery details at checkout</span></div></div></section>
    {related.length > 0 && <section className="related-section"><div className="section-heading"><div><p className="eyebrow">You may also like</p><h2>Related products</h2></div></div><div className="product-grid">{related.map((item) => <ProductCard product={item} key={item.id}/>)}</div></section>}
  </main>;
}
export default ProductDetailPage;
