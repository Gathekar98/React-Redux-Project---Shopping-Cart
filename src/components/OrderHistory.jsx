import { useDispatch, useSelector } from "react-redux";
import { clearOrder } from "../features/orders/orderSlice";
import { showNotification } from "../features/notification/notificationSlice";
import { formatPrice } from "../utils/formatPrice";

function OrderHistory() {
    const dispatch = useDispatch();
    const orders = useSelector((state) => state.orders.orders);

    const handleClearOrders = () =>{
        dispatch(clearOrder());

        dispatch(showNotification({
            message: "Order history cleared.",
            type: "success",
        }));
    };

    return (
        <main className="orders-page">
            <section className="orders-header">
                <div>
                    <p className="eyebrow">Purchase record</p>
                    <h2>Order History</h2>
                    <p>Review your previously placed orders and customer details.</p>
                </div>

                {orders.length > 0 && (
                    <button className="clear-orders-btn" onClick={handleClearOrders}>Clear Order History</button>
                )}
            </section>

            {orders.length === 0 ? (
                <section className="empty-state">
                    <div className="empty-state-icon">📦</div>
                    <h3>No orders placed yet.</h3>
                    <p>Your completed orders will appear here.</p>
                </section>
            ) : (
                <section className="orders-list">
                    {orders.map((order) => (
                        <article className="order-card" key={order.id}>
                            <div className="order-card-header">
                                <div>
                                    <p className="order-label">Order ID</p>
                                    <h3>{order.id}</h3>
                                    <p>Order Date: {order.orderDate}</p>
                                </div>
                                <div className="order-amount-badge">
                                    <span>Total Order Amount</span>
                                    <strong>{formatPrice(order.totalAmount)}</strong>
                                </div>
                            </div>

                            <div className="order-card-grid">
                                <div className="order-customer">
                                    <h4>Customer Details</h4>
                                    <p><span>Name</span>{order.customer.fullName}</p>
                                    <p><span>Email</span>{order.customer.email}</p>
                                    <p><span>Address</span>{order.customer.address}</p>
                                </div>

                                <div className="order-total">
                                    <h4>Order Summary</h4>
                                    <p><span>Total Quantity</span><strong>{order.totalQuantity}</strong></p>
                                    <p><span>Total Amount</span><strong>{formatPrice(order.totalAmount)}</strong></p>
                                </div>
                            </div>
                        </article>
                    ))}
                </section>
            )}
        </main>
    );
}
export default OrderHistory;
