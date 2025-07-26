// src/pages/Suggestions.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import './Suggestions.css';

const Suggestions = () => {
  const [queries, setQueries] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  useEffect(() => {
    if (role === 'admin') {
      axios.get('http://localhost:5000/api/suggestions', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => setQueries(res.data || []))
        .catch(err => {
          console.error('Fetch error:', err.message);
          setQueries([]);
        });
    }
  }, [role, token]);

  const handleDeleteQuery = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/suggestions/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setQueries(prev => prev.filter(q => q._id !== id));
    } catch (err) {
      alert('Delete failed');
      console.error(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <div className="suggestions-page" style={{ padding: '2rem' }}>
      <button className="menu-button" onClick={() => setSidebarOpen(true)} style={{ float: 'right' }}>☰</button>
      <h2>Suggestions</h2>

      {role === 'admin' ? (
        queries.length === 0 ? (
          <p>No suggestions yet.</p>
        ) : (
          <ul>
            {queries.map((q) => (
              <li key={q._id}>
                <p><strong>{q.name}</strong>: {q.message}</p>
                <label>
                  <input
                    type="checkbox"
                    onChange={() => handleDeleteQuery(q._id)}
                  /> ✅ Seen (Delete)
                </label>
                <hr />
              </li>
            ))}
          </ul>
        )
      ) : (
        <p>Access denied. Only admins can view suggestions.</p>
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

export default Suggestions;
