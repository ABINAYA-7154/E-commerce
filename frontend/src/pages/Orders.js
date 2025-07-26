import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import './Order.css';
const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const role = localStorage.getItem('role');
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get('http://localhost:5000/api/orders', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setOrders(res.data || []))
      .catch(err => {
        console.error('Orders fetch error:', err.message);
        setOrders([]);
      });
  }, [token]);

  const handleMarkDone = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(prev => prev.filter(o => o._id !== id));
    } catch (err) {
      alert('Failed to delete order');
      console.error(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <div className="orders-page">
      <button className="menu-button" onClick={() => setSidebarOpen(true)}>☰</button>
      <h2>{role === 'admin' ? 'All Orders' : 'Your Orders'}</h2>

      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <ul className="orders-list">
          {orders.map((o) => (
            <li key={o._id} className="order-card">
              <strong>{o.name}</strong> ({o.email})
              <ul className="order-items">
                {o.items.map((item, idx) => (
                  <li key={idx}>
                    {item.name} — ₹{item.price} × {item.quantity || 1}
                  </li>
                ))}
              </ul>
              <p><strong>Total:</strong> ₹{o.amount}</p>
              {role === 'admin' && (
                <label className="mark-done">
                  <input
                    type="checkbox"
                    onChange={() => handleMarkDone(o._id)}
                  /> ✅ Mark as Done
                </label>
              )}
            </li>
          ))}
        </ul>
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

export default Orders;
