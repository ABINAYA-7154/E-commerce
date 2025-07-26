import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/login';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import ContactUs from './pages/ContactUs';
import AdminUploads from './pages/AdminUploads';
import Search from './pages/Search';
import ProtectedRoute from './components/ProtectedRoute';
import Suggestions from './pages/Suggestions';
import Cart from './pages/Cart';
import QueryForm from './pages/QueryForm';
import Orders from './pages/Orders';

function App() {
  const [designs, setDesigns] = useState([]);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/contact" element={<ContactUs />} />
      <Route path="/search" element={<Search />} />
      
      {/* Protected User Routes */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard designs={designs} setDesigns={setDesigns} />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/cart" 
        element={
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/queries" 
        element={
          <ProtectedRoute>
            <QueryForm />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/orders" 
        element={
          <ProtectedRoute>
            <Orders />
          </ProtectedRoute>
        } 
      />

      {/* Admin Routes */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute adminOnly>
            <Admin />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/uploads" 
        element={
          <ProtectedRoute adminOnly>
            <AdminUploads designs={designs} setDesigns={setDesigns} />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/adminuploads" 
        element={
          <ProtectedRoute adminOnly>
            <AdminUploads designs={designs} setDesigns={setDesigns} />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/suggestions" 
        element={
          <ProtectedRoute adminOnly>
            <Suggestions />
          </ProtectedRoute>
        } 
      />

      {/* Catch all route - redirect to login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;