import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import './QueryForm.css';

const QueryForm = () => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [queries, setQueries] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const role = localStorage.getItem('role');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (role === 'admin') {
      axios.get('http://localhost:5000/api/suggestions', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => setQueries(res.data || []))
        .catch(err => {
          console.error('Fetch queries failed:', err.message);
          setQueries([]);
        });
    }
  }, [role, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/suggestions', { name, message });
      alert('Query submitted!');
      setName('');
      setMessage('');
    } catch (err) {
      console.error('Submission failed:', err.message);
      alert('Failed to send query.');
    }
  };

  const handleDeleteQuery = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/suggestions/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setQueries(prev => prev.filter(q => q._id !== id));
    } catch (err) {
      console.error('Delete failed:', err.message);
      alert('Failed to delete query.');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <div className="query-page">
      <button className="menu-button" onClick={() => setSidebarOpen(true)}>☰</button>

      <h2>Ask a Question</h2>

      <form className="query-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <textarea
          placeholder="Your Message"
          value={message}
          onChange={e => setMessage(e.target.value)}
          required
        />
        <button type="submit">Send</button>
      </form>

      {role === 'admin' && (
        <div className="query-list">
          <h3>📋 Incoming Queries</h3>
          <ul>
            {queries.map((q) => (
              <li key={q._id}>
                <p><strong>{q.name}</strong>: {q.message}</p>
                <label>
                  <input
                    type="checkbox"
                    onChange={() => handleDeleteQuery(q._id)}
                  /> ✅ Seen (Deletes)
                </label>
                <hr />
              </li>
            ))}
          </ul>
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

export default QueryForm;
