import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import './Search.css';

const Search = () => {
  const [designs, setDesigns] = useState([]);
  const [filteredDesigns, setFilteredDesigns] = useState([]);
  const [filter, setFilter] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  useEffect(() => {
    axios.get('http://localhost:5000/api/designs')
      .then(res => {
        const data = Array.isArray(res.data.designs) ? res.data.designs : [];
        setDesigns(data);
        setFilteredDesigns(data);
      })
      .catch(() => {
        setDesigns([]);
        setFilteredDesigns([]);
      });
  }, []);

  const handleFilterChange = (e) => {
    const selectedCategory = e.target.value;
    setFilter(selectedCategory);
    setFilteredDesigns(!selectedCategory
      ? designs
      : designs.filter(d => d.category === selectedCategory));
  };

  const handleAddToCart = async (design) => {
    if (!token) {
      alert('Please login to add items to cart');
      return;
    }

    const cartItem = {
      name: design.name,
      price: design.price,
      quantity: 1,
      category: design.category
    };

    console.log('📤 Sending to cart:', cartItem);
    console.log('🔐 Token:', token);

    try {
      const res = await axios.post('http://localhost:5000/api/cart', {
        items: [cartItem]
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('Cart response:', res.data);
      alert(`${design.name} added to cart!`);
    } catch (err) {
      console.error('❌ Add to cart error:', err.response?.data || err.message);
      if (err.response?.status === 401) {
        alert('Session expired. Please login again.');
        localStorage.clear();
        window.location.href = '/login';
      } else {
        alert('Failed to add item to cart');
      }
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <div className="search-page">
      <button className="menu-button" onClick={() => setSidebarOpen(true)}>☰</button>
      <center><h2>Explore Designs</h2></center>

      <div className="select-wrapper">
        <select value={filter} onChange={handleFilterChange}>
          <option value="">All Categories</option>
          <option value="Women">Women</option>
          <option value="Men">Men</option>
          <option value="Teen Girl">Teen Girl</option>
          <option value="Teen Boy">Teen Boy</option>
          <option value="Girl Child">Girl Child</option>
          <option value="Boy Child">Boy Child</option>
        </select>
      </div>

      {filteredDesigns.length === 0 ? (
        <p className="empty-state">🧵 No Designs Were Added Yet.</p>
      ) : (
        <div className="design-grid">
          {filteredDesigns.map((d) => (
            <div key={d._id} className="design-card">
              <strong>{d.name}</strong>
              <img src={`data:image/png;base64,${d.image}`} alt={d.name} />
              <small><strong>Category:</strong> {d.category}</small>
              <p>{d.description}</p>
              <strong>₹{d.price}</strong>
              <button onClick={() => handleAddToCart(d)}>Add to Cart</button>
            </div>
          ))}
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

export default Search;