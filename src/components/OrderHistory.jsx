import { useDispatch, useSelector } from "react-redux";
import { clearOrder } from "../features/orders/orderSlice";
import { showNotification } from "../features/notification/notificationSlice";
import { formatPrice } from "../utils/formatPrice";

function OrderHistory() {
    const dispatch = useDispatch();
    const orders = useSelector((state) => state.orders.orders);
    const handleClearOrders = () =>{
        dispatch(clearOrder);

        dispatch(showNotification({
            message: "Order history cleared.",
            type: "success",
        }));
    };

    return (
        <div className="orders-page">
            <div className="orders-header">
                <h2>Order History</h2>

                {orders.length < 0 && (
                    <button className="clear-orders-btn" onClick={handleClearOrders}>Clear Order History</button>
                )}
            </div>
                {orders.length === 0 ? (
                    <p>No orders placed yet.</p>
                ) : (
                    <div className="orders-list">
                        {orders.map((order) => (
                            <div className="order-card" key={order.id}>
                                <div className="order-card-header">
                                    <div>
                                        <h3>Order Id: {order.id}</h3>
                                        <p>Order Date: {order.orderDate}</p>
                                    </div>
                                    <div>
                                        <strong>Total Order Amount: {formatPrice(order.totalAmount)}</strong>
                                    </div>
                                </div>

                                <div className="order-customer">
                                    <h4>Customer Details</h4>
                                    <p>Name: {order.customer.fullName}</p>
                                    <p>Email: {order.customer.email}</p>
                                    <p>Address: {order.customer.address}</p>
                                </div>

                                <div className="order-total">
                                    <p>Total Quantity : {order.totalQuantity}</p>
                                    <p>Total Amount : {formatPrice(order.totalAmount)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
        </div>
    );
}
export default OrderHistory;