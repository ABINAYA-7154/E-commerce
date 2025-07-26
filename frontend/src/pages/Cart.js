// src/pages/Cart.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import './Cart.css';

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [confirmPaid, setConfirmPaid] = useState(false);
  const [loading, setLoading] = useState(false);

  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  const token = localStorage.getItem('token');
  const role = userInfo?.role;

  useEffect(() => {
    const fetchCart = async () => {
      if (!token) return;
      try {
        const res = await axios.get('http://localhost:5000/api/cart', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const cartItems = Array.isArray(res.data.cart?.items) ? res.data.cart.items : [];
        console.log('✅ Cart fetched:', cartItems);
        setCart(cartItems);
        setTotal(cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0));
      } catch (err) {
        console.error('❌ Cart fetch error:', err.message);
      }
    };
    fetchCart();
  }, [token]);

  const syncCartToDB = async (items) => {
    if (!token) return;
    try {
      await axios.put('http://localhost:5000/api/cart', { items }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Cart synced to DB');
    } catch (err) {
      console.error('❌ Cart sync error:', err.message);
    }
  };

  const handleRemove = (index) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    setCart(updatedCart);
    setTotal(updatedCart.reduce((sum, item) => sum + item.price * item.quantity, 0));
    syncCartToDB(updatedCart);
  };

  const handleQuantityChange = (index, newQuantity) => {
    if (newQuantity <= 0) return;
    const updatedCart = cart.map((item, i) =>
      i === index ? { ...item, quantity: newQuantity } : item
    );
    setCart(updatedCart);
    setTotal(updatedCart.reduce((sum, item) => sum + item.price * item.quantity, 0));
    syncCartToDB(updatedCart);
  };

  const handleConfirmOrder = async () => {
    if (!confirmPaid) return alert('⚠️ Confirm payment before placing order.');
    setLoading(true);
    try {
      // Step 1: Create the order
      const createRes = await axios.post('http://localhost:5000/api/orders', {
        name: userInfo.name,
        email: userInfo.email,
        items: cart,
        amount: total
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const orderId = createRes?.data?._id;
      if (!orderId) throw new Error('Order ID missing in response');

      // Step 2: Confirm the order (via backend route /api/orders/confirm/:id)
      await axios.put(`http://localhost:5000/api/orders/confirm/${orderId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('✅ Order confirmed and synced!');
      setCart([]);
      setTotal(0);
      setShowQR(false);
      setConfirmPaid(false);
      syncCartToDB([]);
      window.location.href = '/dashboard';
    } catch (err) {
      console.error('❌ Order confirmation error:', err.message);
      alert('Failed to confirm order');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <div className="cart-page">
      <button className="menu-button" onClick={() => setSidebarOpen(true)}>☰</button>
      <h2>Your Cart</h2>

      {cart.length === 0 ? (
        <p className="empty-state">🛒 Your cart is empty.</p>
      ) : (
        <>
          <ul className="cart-list">
            {cart.map((item, index) => (
              <li key={index} className="cart-item">
                <div className="item-details">
                  <strong>{item.name}</strong>
                  <small>Category: {item.category}</small>
                  <p>₹{item.price} each</p>
                </div>
                <div className="quantity-controls">
                  <button onClick={() => handleQuantityChange(index, item.quantity - 1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => handleQuantityChange(index, item.quantity + 1)}>+</button>
                </div>
                <div className="item-total">
                  ₹{item.price * item.quantity}
                </div>
                <button className="remove-btn" onClick={() => handleRemove(index)}>Remove</button>
              </li>
            ))}
          </ul>
          <p className="total-amount"><strong>Total:</strong> ₹{total}</p>
          <button className="order-btn" onClick={() => setShowQR(true)}>Order Now</button>
        </>
      )}

      {showQR && (
        <div className="qr-section">
          <h4>Scan QR to Pay ₹{total}</h4>
          <img
            src="/images/gpay-qr.jpeg"
            alt="GPay QR"
            onError={(e) => e.target.style.display = 'none'}
          />
          <label>
            <input
              type="checkbox"
              checked={confirmPaid}
              onChange={() => setConfirmPaid(!confirmPaid)}
            />
            I've completed the payment via QR
          </label>
          <button
            onClick={handleConfirmOrder}
            disabled={!confirmPaid || loading}
            className="confirm-btn"
            style={{ backgroundColor: confirmPaid ? '#0091ff' : '#888' }}
          >
            {loading ? 'Processing...' : 'Confirm Order'}
          </button>
        </div>
      )}

      <Sidebar
        isOpen={sidebarOpen}
        role={role}
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
      />
    </div>
  );
};

export default Cart;
