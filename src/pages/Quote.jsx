import React, { useState } from 'react';
import axios from 'axios';
import './Quote.css';

const Quote = () => {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    origin: '',
    destination: '',
    weight: '',
    packageSize: '',
    deliveryType: '',
    details: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      await axios.post('http://localhost:5000/api/quote', form, {
        headers: { 'Content-Type': 'application/json' }
      });
      setMessage('Quote request sent successfully!');
      setForm({
        fullName: '', email: '', origin: '', destination: '',
        weight: '', packageSize: '', deliveryType: '', details: ''
      });
    } catch (err) {
      setError('Failed to send quote request. Try again.');
    }
  };

  return (
    <div className="quote-page">
      <h1>Get a Shipping Quote</h1>
      <p>Fill out the form below to receive a custom quote for your shipment.</p>

      <form className="quote-form" onSubmit={handleSubmit}>
        <input name="fullName" value={form.fullName} onChange={handleChange} placeholder="Full Name" required />
        <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email Address" required />
        <input name="origin" value={form.origin} onChange={handleChange} placeholder="Origin (City, State)" required />
        <input name="destination" value={form.destination} onChange={handleChange} placeholder="Destination (City, State)" required />
        <input name="weight" type="number" value={form.weight} onChange={handleChange} placeholder="Weight (kg)" required />

        <select name="packageSize" value={form.packageSize} onChange={handleChange} required>
          <option value="">Select Package Size</option>
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>

        <select name="deliveryType" value={form.deliveryType} onChange={handleChange} required>
          <option value="">Delivery Type</option>
          <option value="standard">Standard</option>
          <option value="express">Express</option>
        </select>

        <textarea name="details" value={form.details} onChange={handleChange} placeholder="Additional details (optional)" rows="4" />

        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}

        <button type="submit">Request Quote</button>
      </form>
    </div>
  );
};

export default Quote;
