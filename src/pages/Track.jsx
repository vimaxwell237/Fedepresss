// src/pages/Track.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link }                     from 'react-router-dom';
import { ShipmentsContext }                    from '../context/ShipmentsContext';
import './Track.css';
import { FaBoxOpen, FaTruck, FaShippingFast, FaCheckCircle, FaUser, FaMapMarkerAlt, FaCalendarAlt, FaFileAlt } from 'react-icons/fa';

const stages = ["Shipped", "In Transit", "Out for Delivery", "Delivered"];
const icons  = {
  "Shipped":        <FaBoxOpen />,
  "In Transit":     <FaTruck />,
  "Out for Delivery": <FaShippingFast />,
  "Delivered":      <FaCheckCircle />
};

const Track = () => {
  const { id }             = useParams();
  const { getShipmentById }= useContext(ShipmentsContext);
  const [shipment, setShipment] = useState(null);
  const [error, setError]       = useState('');

  useEffect(() => {
    getShipmentById(id)
      .then(data => {
        if (data && data._id) setShipment(data);
        else setError(`No shipment found for #${id}`);
      })
      .catch(err => {
        setError(err.response?.data?.message || err.message);
      });
  }, [id, getShipmentById]);

  if (error) {
    return (
      <div className="track-page">
        <h1>{error}</h1>
        <Link to="/tracking" className="back-link">← Try another tracking number</Link>
      </div>
    );
  }
  if (!shipment) return <p>Loading…</p>;

  const idx      = stages.indexOf(shipment.status);
  const percent  = ((idx + 1) / stages.length) * 100;

  return (
    <div className="track-page">
      {/* Summary */}
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
        {stages.map((stage, i) => (
          <div key={stage} className={`progress-step ${i <= idx ? 'active' : ''}`}>
            <div className="icon">{icons[stage]}</div>
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

      <Link to="/tracking" className="back-link">← Track another package</Link>
    </div>
  );
};

export default Track;
