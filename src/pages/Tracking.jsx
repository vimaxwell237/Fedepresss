// src/pages/Tracking.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams, Link }          from 'react-router-dom';
import axios                                       from 'axios';
import { AuthContext }                            from '../context/AuthContext';
import './Tracking.css';
import { FaBox, FaTruck, FaShippingFast, FaCheckCircle } from 'react-icons/fa';
import defaultBg                                  from '../assets/images/tracking.jpg';

const STAGES = ["Shipped", "In Transit", "Out for Delivery", "Delivered"];
const ICONS  = {
  "Shipped":        <FaBox />,
  "In Transit":     <FaTruck />,
  "Out for Delivery": <FaShippingFast />,
  "Delivered":      <FaCheckCircle />
};

const Tracking = ({ bgImage }) => {
  const navigate       = useNavigate();
  const { token }      = useContext(AuthContext);
  const { id }         = useParams();           // e.g. /track/ABC123
  const [trackingNo, setTrackingNo] = useState(id || '');
  const [shipment,   setShipment]   = useState(null);
  const [loading,    setLoading]    = useState(!!id);
  const [error,      setError]      = useState(null);

  // Fetch from back-end if we have an :id
  useEffect(() => {
    if (!id) return;

    setLoading(true);
    setError(null);

    axios.get(
      `${import.meta.env.VITE_API_URL}/api/shipments/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .then(res => {
      setShipment(res.data);
    })
    .catch(err => {
      if (err.response?.status === 404) {
        setError(`No shipment found for #${id}`);
      } else {
        setError(err.response?.data?.message || err.message);
      }
    })
    .finally(() => {
      setLoading(false);
    });
  }, [id, token]);

  const handleSubmit = e => {
    e.preventDefault();
    const nextId = trackingNo.trim().toUpperCase();
    if (nextId) {
      navigate(`/track/${nextId}`);
    }
  };

  // background style
  const style = {
    backgroundImage: `url(${bgImage || defaultBg})`,
    backgroundSize:   'cover',
    backgroundPosition: 'center',
    minHeight:        '100vh'
  };

  // 1) Loading
  if (loading) {
    return (
      <div className="loader-wrapper">
        <div className="spinner" />
        <span>Loading…</span>
      </div>
    );
  }

  // 2) No ID → just the form
  if (!id) {
    return (
      <div className="track-page form-only" style={style}>
        <h1>Track Your Shipment</h1>
        <form className="tracking-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter tracking number"
            value={trackingNo}
            onChange={e => setTrackingNo(e.target.value)}
            required
          />
          <button type="submit">Track</button>
        </form>
      </div>
    );
  }

  // 3) Error (not found or server error)
  if (error) {
    return (
      <div className="track-page" style={style}>
        <h1>{error}</h1>
        <Link to="/tracking" className="back-link">← Try another tracking #</Link>
      </div>
    );
  }

  // 4) Success → show progress
  const idx       = STAGES.indexOf(shipment.status);
  const percent   = ((idx + 1) / STAGES.length) * 100;

  return (
    <div className="track-page results" style={style}>
      <div className="overlay" />

      <div className="summary-card">
        <h1>
          {ICONS[shipment.status]} Tracking #{id}
        </h1>
        <p><strong>Route:</strong> {shipment.origin} → {shipment.destination}</p>
        <p><strong>Weight:</strong> {shipment.weight} kg</p>
      </div>

      <div className="progress-bar">
        <div className="fill-bar" style={{ width: `${percent}%` }} />
        {STAGES.map((stage, i) => (
          <div key={stage} className={`progress-step ${i <= idx ? 'active' : ''}`}>
            <div className="icon">{ICONS[stage]}</div>
            <span>{stage}</span>
          </div>
        ))}
      </div>

      <p className="current-status">
        Current Status: <strong>{shipment.status}</strong>
      </p>

      <h3>History</h3>
      <ul className="history-list">
        {shipment.history.map((h, i) => (
          <li key={i}>
            {new Date(h.date).toLocaleString()} – <strong>{h.status}</strong>
          </li>
        ))}
      </ul>

      <Link to="/tracking" className="back-link">← Track another package</Link>
    </div>
  );
};

export default Tracking;
