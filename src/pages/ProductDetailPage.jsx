import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router";
import { fetchProductById, fetchRelatedProducts, setFilters } from "../features/products/productSlice";
import { getDepartment, toTitleCase } from "../features/products/catalog";
import { addToCart } from "../features/cart/cartSlice";
import { showNotification } from "../features/notification/notificationSlice";
import { formatPrice } from "../utils/formatPrice";
import ProductCard from "../components/ProductCard";
import Icon from "../components/Icon";

function ProductDetailPage() {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products, selectedProduct, related } = useSelector((state) => state.products);
  const selectedStatus = useSelector((state) => state.products.selectedId === productId ? state.products.selectedStatus : "idle");
  // Use the product from the loaded list when we have it; otherwise ask the API.
  const product = products.find((item) => item.id === productId)
    ?? (selectedProduct?.id === productId ? selectedProduct : null);
  // Quantity belongs to one product, so it starts at 1 again on another product.
  const [chosenQuantity, setChosenQuantity] = useState({ id: productId, value: 1 });
  const quantity = chosenQuantity.id === productId ? chosenQuantity.value : 1;
  const setQuantity = (value) => setChosenQuantity({ id: productId, value });

  useEffect(() => {
    if (!product) dispatch(fetchProductById(productId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, productId]);

  useEffect(() => {
    if (product) dispatch(fetchRelatedProducts(product));
    window.scrollTo(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, product?.id]);

  if (!product && (selectedStatus === "not-found")) return <main className="empty-state standalone-state"><h2>Product not found</h2><p>This product may have been removed from the collection.</p><Link className="primary-btn" to="/">Back to shop</Link></main>;
  if (!product && selectedStatus === "failed") return <main className="api-error"><span className="state-icon">!</span><h2>We couldn’t load this product.</h2><button className="primary-btn" onClick={() => dispatch(fetchProductById(productId))}><Icon name="refresh" size={18}/> Try again</button></main>;
  if (!product) return <main className="loading-page"><div className="skeleton-hero"></div></main>;

  const department = getDepartment(product.audience);
  const category = toTitleCase(product.category);
  const savings = product.originalPrice - product.price;
  const addProduct = (goToCart = false) => { dispatch(addToCart({ ...product, quantity })); dispatch(showNotification({ message: `${product.name} added to cart.`, type: "success" })); if (goToCart) navigate("/cart"); };
  const browse = (filters) => dispatch(setFilters({ q: "", sort: "", ...filters }));

  return <main className="product-detail-page">
    <nav className="breadcrumbs"><Link to="/">Home</Link><Icon name="chevron" size={14}/><Link to="/#catalog" onClick={() => browse({ audience: product.audience })}>{department.label}</Link><Icon name="chevron" size={14}/><Link to="/#catalog" onClick={() => browse({ audience: product.audience, category: product.category })}>{category}</Link><Icon name="chevron" size={14}/><b>{product.name}</b></nav>
    <section className="product-detail">
      <div className="product-gallery single-image"><div className={`main-product-image audience-${product.audience}`}><img src={product.image} alt={product.name} onError={(e) => { e.currentTarget.src = "/favicon.svg"; }}/>{product.discount > 0 && <span className="discount-badge">{product.discount}% off</span>}</div></div>
      <div className="product-info">
        <p className="eyebrow">{product.brand}</p>
        <h1>{product.name}</h1>
        <div className="detail-rating"><span className="rating-pill"><Icon name="star" size={13} filled/>{product.rating}</span><span>{product.ratingCount.toLocaleString("en-IN")} ratings</span></div>
        <div className="detail-price-row"><p className="detail-price">{formatPrice(product.price)}</p>{savings > 0 && <><s className="original-price">MRP {formatPrice(product.originalPrice)}</s><span className="detail-discount">{product.discount}% off</span></>}</div>
        {savings > 0 && <p className="detail-savings">You save {formatPrice(savings)}</p>}
        {product.inStock ? <p className="availability"><span></span> In stock and ready to add</p> : <p className="availability out-of-stock"><span></span> Currently out of stock</p>}
        <dl className="detail-specs"><div><dt>Brand</dt><dd>{product.brand}</dd></div><div><dt>Department</dt><dd>{department.label}</dd></div><div><dt>Category</dt><dd>{category}</dd></div><div><dt>Product ID</dt><dd>{product.id}</dd></div></dl>
        <div className="purchase-row"><div className="quantity-controls"><button onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={!product.inStock}>−</button><span>{quantity}</span><button onClick={() => setQuantity(quantity + 1)} disabled={!product.inStock}>+</button></div><button className="detail-cart-btn" onClick={() => addProduct()} disabled={!product.inStock}><Icon name="cart"/> {product.inStock ? "Add to cart" : "Out of stock"}</button></div>
        <button className="buy-now-btn" onClick={() => addProduct(true)} disabled={!product.inStock}>Buy now</button>
        <div className="detail-benefits"><span><Icon name="shield"/> Secure local checkout</span><span><Icon name="truck"/> Delivery details at checkout</span></div>
      </div>
    </section>
    {related.length > 0 && <section className="related-section"><div className="section-heading"><div><p className="eyebrow">You may also like</p><h2>More in {category}</h2></div></div><div className="product-grid">{related.map((item) => <ProductCard product={item} key={item.id}/>)}</div></section>}
  </main>;
}
export default ProductDetailPage;
