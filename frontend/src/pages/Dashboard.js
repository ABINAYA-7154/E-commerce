import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import UploadPopup from '../components/UploadPopup';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const userData = JSON.parse(localStorage.getItem('userInfo') || '{}');
    setUserName(userData?.name || 'User');
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const role = localStorage.getItem('role');

  return (
    <div className="dashboard-wrapper">
      <button className="menu-button" onClick={() => setSidebarOpen(true)}>☰</button>

      <div className="center-box">
        <h2>Welcome to the Dashboard, {userName}!</h2>
      </div>

      {isSidebarOpen && (
        <Sidebar
          isOpen={true}
          role={role}
          onClose={() => setSidebarOpen(false)}
          onLogout={handleLogout}
        />
      )}

      {showPopup && (
        <UploadPopup
          onClose={() => setShowPopup(false)}
          onUploadSuccess={() => {}}
        />
      )}
    </div>
  );
};

export default Dashboard;
