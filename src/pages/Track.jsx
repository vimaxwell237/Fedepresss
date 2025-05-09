// src/pages/Track.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link }                     from 'react-router-dom';
import axios                                    from 'axios';
import { AuthContext }                          from '../context/AuthContext';
import './Track.css';
import {
  FaBoxOpen,
  FaTruck,
  FaShippingFast,
  FaCheckCircle,
  FaUser,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaFileAlt
} from 'react-icons/fa';

const STAGES = ["Shipped", "In Transit", "Out for Delivery", "Delivered"];
const ICONS  = {
  "Shipped":        <FaBoxOpen />,
  "In Transit":     <FaTruck />,
  "Out for Delivery": <FaShippingFast />,
  "Delivered":      <FaCheckCircle />
};

const Track = () => {
  const { id }          = useParams();
  const { token }       = useContext(AuthContext);
  const [shipment, setShipment] = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    axios.get(
      `${import.meta.env.VITE_API_URL}/api/shipments/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .then(res => setShipment(res.data))
    .catch(err => {
      if (err.response?.status === 404) {
        setError(`No shipment found for #${id}`);
      } else {
        setError(err.response?.data?.message || err.message);
      }
    })
    .finally(() => setLoading(false));
  }, [id, token]);

  if (loading) {
    return <div className="loader-wrapper">
      <div className="spinner" />
      <span>Loading…</span>
    </div>;
  }

  if (error) {
    return (
      <div className="track-page">
        <h1>{error}</h1>
        <Link to="/tracking" className="back-link">
          ← Try another tracking number
        </Link>
      </div>
    );
  }

  // if we have a shipment, render it
  const idx     = STAGES.indexOf(shipment.status);
  const percent = ((idx + 1) / STAGES.length) * 100;

  return (
    <div className="track-page">
      {/* Summary Card */}
      <div className="summary-card">
        <h1><FaBoxOpen /> Tracking #{id}</h1>
        <p><FaUser className="icon-inline" /> <strong>Customer:</strong> {shipment.customerName}</p>
        <p><FaMapMarkerAlt className="icon-inline" /> <strong>Route:</strong> {shipment.origin} → {shipment.destination}</p>
        <p><FaCalendarAlt className="icon-inline" /> <strong>Date Shipped:</strong> {new Date(shipment.dateShipped || shipment.createdAt).toLocaleDateString()}</p>
        <p><FaCalendarAlt className="icon-inline" /> <strong>Est. Delivery:</strong> {shipment.estimatedDelivery ? new Date(shipment.estimatedDelivery).toLocaleDateString() : '—'}</p>
        <p><FaFileAlt className="icon-inline" /> <strong>Notes:</strong> {shipment.notes || '—'}</p>
      </div>

      {/* Progress Bar */}
      <div className="progress-bar">
        <div className="fill-bar" style={{ width: `${percent}%` }} />
        {STAGES.map((stage, i) => (
          <div key={stage} className={`progress-step ${i <= idx ? 'active' : ''}`}>
            <div className="icon">{ICONS[stage]}</div>
            <span>{stage}</span>
          </div>
        ))}
      </div>

      {/* History */}
      <h3>History</h3>
      <ul className="history-list">
        {shipment.history.map((h, i) => (
          <li key={i}>
            <span>{new Date(h.date).toLocaleString()}</span> — <strong>{h.status}</strong>
          </li>
        ))}
      </ul>

      <Link to="/tracking" className="back-link">
        ← Track another package
      </Link>
    </div>
  );
};

export default Track;
