// src/pages/SignUp.jsx
import React, { useState } from 'react';
import api               from '../api';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css';

const SignUp = () => {
  const [form, setForm]       = useState({
    fullName: '', username: '', email: '', phone: '',
    password: '', confirmPassword: ''
  });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const navigate               = useNavigate();

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      // NOTE: we only use '/auth/register' here because baseURL already includes '/api'
      await api.post('/auth/register', {
        fullName: form.fullName,
        username: form.username,
        email: form.email,
        phone: form.phone,
        password: form.password
      });
      navigate('/user-login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <h2>Create Your Account</h2>
      <form onSubmit={handleSubmit} className="auth-form" noValidate>
        <input name="fullName" placeholder="Full Name"      value={form.fullName}      onChange={handleChange} required />
        <input name="username" placeholder="Username"       value={form.username}      onChange={handleChange} required />
        <input name="email"    type="email" placeholder="Email" value={form.email}         onChange={handleChange} required />
        <input name="phone"    type="tel"   placeholder="Phone Number" value={form.phone}   onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password"    value={form.password}     onChange={handleChange} required />
        <input name="confirmPassword" type="password" placeholder="Confirm Password" value={form.confirmPassword} onChange={handleChange} required />

        {error && <p className="error">{error}</p>}

        <button type="submit" className="cta-button primary" disabled={loading}>
          {loading ? 'Signing Up…' : 'Sign Up'}
        </button>
      </form>

      <p className="auth-switch-text">
        Already have an account? <Link to="/user-login">Sign in</Link>
      </p>
    </div>
  );
};

export default SignUp;
