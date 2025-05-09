import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Support.css';
import bgImage from '../assets/images/suport.jpg';

const Support = () => {
  const [formData, setFormData]     = useState({ name: '', email: '', subject: '', message: '' });
  const [submitStatus, setSubmitStatus] = useState(null);
  const [loading, setLoading]       = useState(false);

  const handleChange = e => {
    setFormData(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setSubmitStatus(null);
    try {
      await axios.post('http://localhost:5000/api/support/submit', formData);
      setSubmitStatus({ ok: true, msg: 'Ticket submitted successfully!' });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch {
      setSubmitStatus({ ok: false, msg: 'Failed to submit ticket. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="support-page" style={{ backgroundImage: `url(${bgImage})` }}>
      <div className="overlay" />
      <div className="ticket-form-wrapper">
        <h2>Submit a Support Ticket</h2>
        <form className="ticket-form" onSubmit={handleSubmit}>
          <input
            name="name"
            type="text"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            name="subject"
            type="text"
            placeholder="Subject"
            value={formData.subject}
            onChange={handleChange}
            required
          />
          <textarea
            name="message"
            placeholder="Describe your issue..."
            rows="5"
            value={formData.message}
            onChange={handleChange}
            required
          />
          <button type="submit" disabled={loading}>
            {loading
              ? <span className="spinner" aria-label="Sending..." />
              : "Submit Ticket"
            }
          </button>
        </form>
        {submitStatus && (
          <p className={`form-status ${submitStatus.ok ? 'success' : 'error'}`}>
            {submitStatus.ok ? '✅' : '❌'} {submitStatus.msg}
          </p>
        )}
      </div>
    </div>
  );
};

export default Support;
