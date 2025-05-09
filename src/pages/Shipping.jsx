// src/pages/Shipping.jsx
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './Shipping.css';
import bgImage from '../assets/images/shipping.jpg';

const Shipping = () => {
  const { token } = useContext(AuthContext);   // grab your JWT token
  const [form, setForm]     = useState({
    origin: '', destination: '', weight: '', service: 'standard'
  });
  const [estimate, setEstimate] = useState(null);
  const [loading, setLoading]   = useState(true);

  // simulate page load
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    const base = form.service === 'express' ? 20 : 10;
    const cost = base + (parseFloat(form.weight) || 0) * 1.5;
    setEstimate(cost.toFixed(2));
  };

  const handleProceed = async () => {
    if (!token) {
      alert('Please log in or sign up first.');
      return;
    }

    try {
      const payload = {
        origin:      form.origin,
        destination: form.destination,
        weight:      parseFloat(form.weight),
        service:     form.service,
        notes:       ''
      };
      const resp = await axios.post(
        'http://localhost:5000/api/shipments',
        payload,
        { headers: { 
            'Content-Type': 'application/json',
            Authorization:   `Bearer ${token}` 
        }}
      );
      const newShipment = resp.data;
      alert(`Shipment created! Your tracking number is ${newShipment._id}`);
      // reset form & estimate
      setForm({ origin:'', destination:'', weight:'', service:'standard' });
      setEstimate(null);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to create shipment');
    }
  };

  if (loading) {
    return (
      <div className="loader-wrapper">
        <div className="spinner"></div>
        <span>Loading Shipping Page…</span>
      </div>
    );
  }

  return (
    <div
      className="shipping-bg-wrapper"
      style={{
        backgroundImage: `url(${bgImage})`,
        position:        'relative'
      }}
    >
      <div className="bg-overlay" />

      <div className="shipping-page">
        {/* Hero */}
        <section className="shipping-hero">
          <h1>Calculate Your Shipping Rate</h1>
          <p>Enter your details below and get an instant quote.</p>
        </section>

        {/* Rate Calculator */}
        <section className="rate-calculator">
          <form onSubmit={handleSubmit}>
            {['origin','destination','weight'].map((field, i) => (
              <div key={i} className="form-row">
                <label htmlFor={field}>
                  {field.charAt(0).toUpperCase() + field.slice(1)}{' '}
                  {field === 'weight' ? '(kg)' : ''}
                </label>
                <input
                  id={field}
                  name={field}
                  type={field === 'weight' ? 'number' : 'text'}
                  step={field === 'weight' ? '0.1' : undefined}
                  value={form[field]}
                  onChange={handleChange}
                  placeholder={
                    field === 'origin' ? 'e.g. 90210'
                    : field === 'destination' ? 'e.g. 10001'
                    : 'e.g. 5.0'
                  }
                  required
                />
              </div>
            ))}

            <div className="form-row">
              <label htmlFor="service">Service Type</label>
              <select
                id="service"
                name="service"
                value={form.service}
                onChange={handleChange}
              >
                <option value="standard">Standard</option>
                <option value="express">Express</option>
                <option value="overnight">Overnight</option>
              </select>
            </div>

            <button type="submit" className="cta-button primary">
              Get Estimate
            </button>
          </form>

          {estimate !== null && (
            <div className="estimate-result">
              <h3>Estimated Cost</h3>
              <p className="cost">${estimate}</p>
              <button
                className="cta-button secondary"
                onClick={handleProceed}
              >
                Proceed to Ship
              </button>
            </div>
          )}
        </section>

        {/* Info Cards */}
        <section className="shipping-info">
          <div className="info-card">
            <h4>Reliable Delivery</h4>
            <p>On-time performance backed by real-time tracking.</p>
          </div>
          <div className="info-card">
            <h4>Global Coverage</h4>
            <p>Reach 220+ countries and territories worldwide.</p>
          </div>
          <div className="info-card">
            <h4>Secure Handling</h4>
            <p>Enterprise-grade security and custom packaging solutions.</p>
          </div>
        </section>

        {/* Final CTA */}
        <section className="cta-section shipping-cta">
          <h2>Ready to Ship?</h2>
          <p>Create an account today and start sending.</p>
          <Link to="/signup" className="cta-button primary">
            Sign Up Now
          </Link>
        </section>
      </div>
    </div>
  );
};

export default Shipping;
