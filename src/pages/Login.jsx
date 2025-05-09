// src/pages/Login.jsx
import React, { useState, useContext } from 'react';
import { useNavigate }            from 'react-router-dom';
import { AuthContext }            from '../context/AuthContext';
import './Auth.css';

const Login = () => {
  const [form, setForm]   = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const { login }        = useContext(AuthContext);
  const navigate         = useNavigate();

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    const ok = await login({
      role: 'admin',
      username: form.username,
      password: form.password
    });

    if (ok) {
      navigate('/admin');
    } else {
      setError('Invalid admin credentials');
    }
  };

  return (
    <div className="auth-page">
      <h2>Admin Login</h2>
      <form onSubmit={handleSubmit} className="auth-form" noValidate>
        <input
          name="username"
          placeholder="Username"
          value={form.username}
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
        <button type="submit" className="cta-button primary">
          Log In
        </button>
      </form>
    </div>
  );
};

export default Login;
