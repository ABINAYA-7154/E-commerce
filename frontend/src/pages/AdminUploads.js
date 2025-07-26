import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import './AdminUploads.css';

const AdminUploads = ({ setDesigns, designs }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isUploadPage = location.pathname === '/uploads';

  const [popup, setPopup] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const role = localStorage.getItem('role');
  const token = localStorage.getItem('token');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Women',
    price: '',
    file: null
  });

  useEffect(() => {
    if (role !== 'admin' || !token) {
      navigate('/dashboard');
      return;
    }

    const fetchDesigns = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/designs');
        const json = await res.json();
        setDesigns(Array.isArray(json.designs) ? json.designs : []);
      } catch (err) {
        console.error('Fetch failed:', err);
      }
    };

    fetchDesigns();
  }, [navigate, setDesigns, role, token]);

  const handleSubmit = async () => {
    if (!formData.file) return alert('Image file is required');

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'file') data.append(key, value);
      });
      data.append('image', formData.file);

      const res = await fetch('http://localhost:5000/api/designs/add', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: data
      });

      if (!res.ok) throw new Error('Upload failed');
      const newDesign = await res.json();
      setDesigns(prev => [...prev, newDesign]);
      setFormData({ name: '', description: '', category: 'Women', price: '', file: null });
      setPopup(false);
    } catch (err) {
      alert('Upload failed: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/designs/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) throw new Error('Delete failed');
      setDesigns(prev => prev.filter(d => d._id !== id));
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="admin-uploads-page">
      <button className="menu-button" onClick={() => setSidebarOpen(true)}>☰</button>
      <div className="header-box">
        <h2>{isUploadPage ? 'Upload Design' : 'Admin Uploads'}</h2>
      </div>

      {designs.length === 0 ? (
        <p className="empty-state">📭 No Uploads Yet</p>
      ) : (
        <div className="designs-list">
          {designs.map((design) => (
            <div key={design._id} className="design-card">
              <h3>{design.name}</h3>
              <img src={`data:image/png;base64,${design.image}`} alt={design.name} />
              <p>{design.description}</p>
              <p><b>Category:</b> {design.category}</p>
              <p><b>Price:</b> ₹{design.price}</p>
              <button className="delete-btn" onClick={() => handleDelete(design._id)}>Remove</button>
            </div>
          ))}
        </div>
      )}

      {isUploadPage && (
        <button className="upload-icon" onClick={() => setPopup(true)}>＋</button>
      )}

      {isUploadPage && popup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h3>Add New Design</h3>
            <input type="text" placeholder="Name" value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            <textarea placeholder="Description" value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
            <select value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
              <option>Women</option><option>Men</option>
              <option>Teen Girl</option><option>Teen Boy</option>
              <option>Girl Child</option><option>Boy Child</option>
            </select>
            <input type="number" placeholder="Price in ₹" value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
            <input type="file" accept="image/*"
              onChange={(e) => setFormData({ ...formData, file: e.target.files[0] })} />
            <div className="popup-buttons">
              <button onClick={handleSubmit}>Add</button>
              <button onClick={() => setPopup(false)}>Cancel</button>
            </div>
          </div>
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

export default AdminUploads;
