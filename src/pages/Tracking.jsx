import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ShipmentsContext }                 from '../context/ShipmentsContext';
import './Tracking.css';
import { FaBox, FaTruck, FaShippingFast, FaCheckCircle } from 'react-icons/fa';

// OPTIONAL: import a default bg image
import defaultBg from '../assets/images/tracking.jpg';

const allStages = ["Shipped", "In Transit", "Out for Delivery", "Delivered"];
const iconMap = {
  "Shipped":       <FaBox />,
  "In Transit":    <FaTruck />,
  "Out for Delivery": <FaShippingFast />,
  "Delivered":     <FaCheckCircle />
};

const Tracking = ({ bgImage }) => {
  const navigate       = useNavigate();
  const { getShipment } = useContext(ShipmentsContext);
  const { id: paramId } = useParams();

  const [trackingNumber, setTrackingNumber] = useState(paramId || '');
  const [shipment, setShipment]             = useState(null);
  const [loading, setLoading]               = useState(true);

  useEffect(() => {
    if (paramId) {
      const found = getShipment(paramId);
      setShipment(found || null);
    }
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, [paramId, getShipment]);

  const handleSubmit = e => {
    e.preventDefault();
    const id = trackingNumber.trim().toUpperCase();
    if (id) {
      setLoading(true);
      navigate(`/track/${id}`);
    }
  };

  // decide background
  const style = {
    backgroundImage: `url(${bgImage || defaultBg})`,
    backgroundSize:   'cover',
    backgroundPosition: 'center',
    minHeight:        '100vh'
  };

  if (loading) {
    return (
      <div className="loader-wrapper">
        <div className="spinner" />
        <span>Loading...</span>
      </div>
    );
  }

  // form-only
  if (!paramId) {
    return (
      <div className="track-page form-only" style={style}>
        <h1>Track Your Shipment</h1>
        <form className="tracking-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter tracking number"
            value={trackingNumber}
            onChange={e => setTrackingNumber(e.target.value)}
            required
          />
          <button type="submit">Track</button>
        </form>
      </div>
    );
  }

  // not found
  if (paramId && !shipment) {
    return (
      <div className="track-page" style={style}>
        <h1>No shipment found for #{paramId}</h1>
        <Link to="/tracking" className="back-link">← Try another</Link>
      </div>
    );
  }

  // results
  const currentIndex    = allStages.indexOf(shipment.status);
  const progressPercent = ((currentIndex + 1) / allStages.length) * 100;

  return (
    <div className="track-page results" style={style}>
      <div className="overlay" />          {/* optional translucent overlay */}

      <div className="summary-card">
        <h1>{iconMap[shipment.status]} Tracking #{paramId}</h1>
        <p><strong>Route:</strong> {shipment.origin} → {shipment.destination}</p>
        <p><strong>Weight:</strong> {shipment.weight} kg</p>
      </div>

      <div className="progress-bar">
        <div className="fill-bar" style={{ width: `${progressPercent}%` }} />
        {allStages.map((stage, idx) => (
          <div key={stage} className={`progress-step ${idx <= currentIndex ? 'active' : ''}`}>
            <div className="icon">{iconMap[stage]}</div>
            <span>{stage}</span>
          </div>
        ))}
      </div>

      <p className="current-status">
        Current Status: <strong>{shipment.status}</strong>
      </p>

      <h3>History</h3>
      <ul className="history-list">
        {shipment.history.map((h,i) => (
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
