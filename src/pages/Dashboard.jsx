import React, { useContext } from 'react';
import { Link }           from 'react-router-dom';
import { ShipmentsContext } from '../context/ShipmentsContext';
import { AuthContext }      from '../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const { shipments } = useContext(ShipmentsContext);
  const { userEmail } = useContext(AuthContext);

  // Only show shipments that have this userEmail as ownerEmail
  const myShipments = shipments.filter(s => s.ownerEmail === userEmail);

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <h1>Welcome, {userEmail}!</h1>
        <p>Manage and track your shipments below.</p>
      </header>

      <section className="dashboard-actions">
        <Link to="/shipping" className="action-card">
          <h3>📦 Create Shipment</h3>
        </Link>
        <Link to="/tracking" className="action-card">
          <h3>🔍 Track Shipment</h3>
        </Link>
      </section>

      <section className="dashboard-recent">
        <h2>Your Shipments</h2>
        {myShipments.length === 0 ? (
          <p>
            You have no shipments yet. <Link to="/shipping">Create one now</Link>.
          </p>
        ) : (
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Tracking #</th>
                <th>Route</th>
                <th>Status</th>
                <th>View</th>
              </tr>
            </thead>
            <tbody>
              {myShipments.map(s => (
                <tr key={s._id}>
                  <td>{s._id}</td>
                  <td>{s.origin} → {s.destination}</td>
                  <td>{s.status}</td>
                  <td>
                    <Link to={`/track/${s._id}`} className="track-link">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
