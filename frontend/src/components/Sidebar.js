import React from 'react';
import { motion } from 'framer-motion';
import './Sidebar.css';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ isOpen, role, onClose, onLogout }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      className="sidebar"
      initial={{ x: '100%' }} // slide in from left
      animate={{ x: isOpen ? '0%' : '100%' }} // open to closed
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <button onClick={onClose} className="close-btn">✖</button>
      <ul>
        <li onClick={() => navigate('/dashboard')}> Dashboard</li>
        {role === 'admin' ? (
          <>
            <li onClick={() => navigate('/uploads')}> Upload</li>
            <li onClick={() => navigate('/suggestions')}> Suggestions</li>
            <li onClick={() => navigate('/orders')}> Orders</li>
          </>
        ) : (
          <>
            <li onClick={() => navigate('/search')}> Search</li>
            <li onClick={() => navigate('/cart')}> Cart</li>
            <li onClick={() => navigate('/contact')}> Contact Us</li>
            <li onClick={() => navigate('/queries')}> Queries</li>
          </>
        )}
        <li onClick={onLogout}> Logout</li>
      </ul>
    </motion.div>
  );
};

export default Sidebar;
