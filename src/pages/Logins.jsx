// src/pages/Logins.jsx
import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';  // ← pull in your context
import './Auth.css';

const Logins = () => {
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Call your context’s login, passing role='user'
    const ok = await login({
      role: 'user',
      email: form.email,
      password: form.password
    });

    setLoading(false);

    if (ok) {
      navigate('/dashboard');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="auth-page">
      <h2>Sign In to Your Account</h2>
      <form onSubmit={handleSubmit} className="auth-form" noValidate>
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        {error && <p className="error">{error}</p>}
        <button type="submit" className="cta-button primary" disabled={loading}>
          {loading ? 'Signing In…' : 'Sign In'}
        </button>
      </form>
      <p className="auth-switch-text">
        Don’t have an account? <Link to="/signup">Sign up</Link>
      </p>
    </div>
  );
};

export default Logins;
