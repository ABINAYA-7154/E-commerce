import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import './Admin.css';

const Admin = () => {
  const [message, setMessage] = useState('');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('📡 Admin useEffect triggered');

    const token = localStorage.getItem('token');
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const role = userInfo?.role?.toLowerCase() || localStorage.getItem('role');

    console.log('🔍 Stored role:', role);
    console.log('🔍 Stored token:', token);

    if (!token || role !== 'admin') {
      console.warn('🚫 Unauthorized access – clearing session');
      localStorage.clear();
      navigate('/login');
      return;
    }

    axios
      .get('http://localhost:5000/api/users/admin', {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 7000,
      })
      .then((res) => {
        console.log(' Admin data received:', res.data);
        setMessage(res.data.message || 'Welcome to Admin Panel');
      })
      .catch((error) => {
        const status = error.response?.status;
        console.error(`❌ Axios error [${status || 'no status'}]:`, error.response?.data || error.message);
        setMessage(status === 403 ? 'Forbidden' : 'Access denied');
        localStorage.clear();
        navigate('/login');
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    setSidebarOpen(false);
    navigate('/login');
  };

  const currentRole =
    JSON.parse(localStorage.getItem('userInfo') || '{}')?.role ||
    localStorage.getItem('role');

  return (
    <div className="admin-page">
      <div className="topbar">
        <button className="hamburger" onClick={() => setSidebarOpen(true)}>
          ☰
        </button>
      </div>

      <Sidebar
        isOpen={isSidebarOpen}
        role={currentRole}
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
      />

      <h2>Admin Panel</h2>
      <p>{message}</p>
    </div>
  );
};

export default Admin;
