import { Routes, Route } from 'react-router';
import Navbar from './components/Navbar';
import Toast from './components/Toast';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';

function App() {
  return (
    <div className="app">
      <Navbar />
      <Toast />
      <Routes>
        <Route path="/" element={<ProductPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/orders" element={<OrdersPage/>}/>
      </Routes>
    </div>
  );
}
export default App;