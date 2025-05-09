// src/pages/Quote.jsx
import React, { useState } from 'react';
import axios from 'axios';
import './Quote.css';

const Quote = () => {
  const [form, setForm]     = useState({
    fullName: '',
    email: '',
    origin: '',
    destination: '',
    weight: '',
    packageSize: '',
    deliveryType: '',
    details: ''
  });
  const [status, setStatus] = useState({ loading:false, message:'', error:'' });

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setStatus({ loading:true, message:'', error:'' });
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/quote`,
        form,
        { headers: { 'Content-Type':'application/json' } }
      );
      setStatus({ loading:false, message:'✅ Quote request sent successfully!', error:'' });
      setForm({
        fullName:'', email:'', origin:'', destination:'',
        weight:'', packageSize:'', deliveryType:'', details:''
      });
    } catch {
      setStatus({ loading:false, message:'', error:'❌ Failed to send quote request. Try again.' });
    }
  };

  return (
    <div className="quote-page">
      <h1>Get a Shipping Quote</h1>
      <p>Fill out the form below to receive a custom quote for your shipment.</p>

      <form className="quote-form" onSubmit={handleSubmit}>
        {['fullName','email','origin','destination','weight'].map((field, i) => (
          <input
            key={i}
            name={field}
            type={field==='email'?'email':field==='weight'?'number':'text'}
            value={form[field]}
            onChange={handleChange}
            placeholder={
              field==='fullName'   ? 'Full Name' :
              field==='email'      ? 'Email Address' :
              field==='origin'     ? 'Origin (City, State)' :
              field==='destination'? 'Destination (City, State)' :
              'Weight (kg)'
            }
            required
            step={field==='weight'?'0.1':undefined}
          />
        ))}

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

        <textarea
          name="details"
          value={form.details}
          onChange={handleChange}
          placeholder="Additional details (optional)"
          rows="4"
        />

        <button type="submit" disabled={status.loading}>
          {status.loading
            ? <span className="spinner" aria-label="Sending..." />
            : 'Request Quote'
          }
        </button>

        {status.message && <p className="success">{status.message}</p>}
        {status.error   && <p className="error">{status.error}</p>}
      </form>
    </div>
  );
};

export default Quote;
