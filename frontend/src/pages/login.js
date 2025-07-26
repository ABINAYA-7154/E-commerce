import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './login.css';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('🔐 Login attempt with form:', form);

    try {
      const res = await axios.post('http://localhost:5000/api/users/login', form);
      console.log(' Login response:', res.data);

      const { token, user } = res.data;
      if (!token || !user || !user.role) {
        throw new Error('🚨 Malformed login response');
      }

      // 🧠 Normalize and store
      const role = user.role.toLowerCase();
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('userInfo', JSON.stringify(user));

      alert(` Login successful – Welcome ${user.name}`);

      // 🌐 Redirect based on role
      const redirectPath = role === 'admin' ? '/admin' : '/dashboard';
      window.location.href = redirectPath;

    } catch (error) {
      console.error('❌ Login failed:', error.response?.data || error.message);
      alert(error.response?.data?.error || 'Login failed. Try again.');
    }
  };

  return (
    <div className="auth-page">
      <div className="form-wrapper">
        <form onSubmit={handleSubmit} className="form-container">
          <h2>Login</h2>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button type="submit">Login</button>
          <p>
            Don't have an account? <Link to="/">Register</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
