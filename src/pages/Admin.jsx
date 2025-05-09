// src/pages/Admin.jsx
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate }      from 'react-router-dom';
import { ShipmentsContext } from '../context/ShipmentsContext';
import './Admin.css';

const STATUSES = ["Shipped", "In Transit", "Out for Delivery", "Delivered"];

const Admin = () => {
  const navigate = useNavigate();
  const {
    shipments,
    loading,
    error: shipmentsError,
    fetchShipments,
    createShipment,
    updateShipment,
    deleteShipment
  } = useContext(ShipmentsContext);

  // --- New shipment form state
  const [form, setForm] = useState({
    customerName: '',
    origin:       '',
    destination:  '',
    weight:       '',
    service:      'standard',
    notes:        ''
  });
  const [createError, setCreateError] = useState('');

  // --- Inline edit state
  const [editingId, setEditingId]     = useState(null);
  const [editForm, setEditForm]       = useState({});

  // --- Load shipments on mount
  useEffect(() => { fetchShipments() }, []);


  // --- Handlers for new-shipment form
  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };
  const handleGenerate = async e => {
    e.preventDefault();
    setCreateError('');
    try {
      const payload = {
        ...form,
        weight: parseFloat(form.weight)
      };
      const newS = await createShipment(payload);
      navigate(`/track/${newS._id}`);
    } catch (err) {
      setCreateError(err.response?.data?.message || err.message);
    }
  };

  // --- Handlers for update-status dropdown
  const [statusUpdates, setStatusUpdates] = useState({});
  const handleStatusChange = (id, s) =>
    setStatusUpdates(prev => ({ ...prev, [id]: s }));
  const handleUpdateStatus = async id => {
    const s = statusUpdates[id];
    if (!s) return;
    await updateShipment(id, s);
    setStatusUpdates(prev => { const p={...prev}; delete p[id]; return p });
    fetchShipments();
  };

  // --- Delete
  const handleDelete = async id => {
    if (!window.confirm(`Delete shipment #${id}?`)) return;
    await deleteShipment(id);
    fetchShipments();
  };

  // --- Edit inline
  const startEdit = s => {
    setEditingId(s._id);
    setEditForm({
      customerName: s.customerName,
      origin:       s.origin,
      destination:  s.destination,
      weight:       s.weight,
      service:      s.service,
      notes:        s.notes || '',
      status:       s.status
    });
  };
  const handleEditChange = e => {
    const { name, value } = e.target;
    setEditForm(f => ({ ...f, [name]: value }));
  };
  const submitEdit = async id => {
    const payload = {
      ...editForm,
      weight: parseFloat(editForm.weight)
    };
    await updateShipment(id, editForm.status, payload);
    setEditingId(null);
    fetchShipments();
  };
  const cancelEdit = () => setEditingId(null);


  return (
    <div className="admin-page">
      <h1>Admin Dashboard</h1>

      {/* --- Create Shipment */}
      <section className="admin-section">
        <h2>Generate New Shipment</h2>
        <form onSubmit={handleGenerate} className="admin-form">
          <input name="customerName" placeholder="Customer Name"
            value={form.customerName} onChange={handleChange} required />
          <input name="origin" placeholder="Origin"
            value={form.origin} onChange={handleChange} required />
          <input name="destination" placeholder="Destination"
            value={form.destination} onChange={handleChange} required />
          <input name="weight" type="number" step="0.1" placeholder="Weight (kg)"
            value={form.weight} onChange={handleChange} required />
          <select name="service" value={form.service} onChange={handleChange}>
            <option value="standard">Standard</option>
            <option value="express">Express</option>
            <option value="overnight">Overnight</option>
          </select>
          <textarea name="notes" placeholder="Notes / Comments"
            value={form.notes} onChange={handleChange} />
          {createError && <p className="error">{createError}</p>}
          <button type="submit" className="cta-button primary">
            Generate Tracking
          </button>
        </form>
      </section>

      {/* --- Existing Shipments */}
      <section className="admin-section">
        <h2>Existing Shipments</h2>
        {loading && <p>Loading…</p>}
        {shipmentsError && <p className="error">{shipmentsError}</p>}
        {!loading && shipments.length===0 && <p>No shipments found.</p>}

        <ul className="shipment-list">
          {shipments.map(s => (
            <li key={s._id} className="shipment-item">
              {editingId === s._id
                ? (
                  // Inline edit form
                  <form className="edit-form" onSubmit={e=>{e.preventDefault(); submitEdit(s._id)}}>
                    <input name="customerName" value={editForm.customerName} onChange={handleEditChange} required />
                    <input name="origin" value={editForm.origin} onChange={handleEditChange} required />
                    <input name="destination" value={editForm.destination} onChange={handleEditChange} required />
                    <input name="weight" type="number" value={editForm.weight} onChange={handleEditChange} required />
                    <select name="service" value={editForm.service} onChange={handleEditChange}>
                      <option value="standard">Standard</option>
                      <option value="express">Express</option>
                      <option value="overnight">Overnight</option>
                    </select>
                    <textarea name="notes" value={editForm.notes} onChange={handleEditChange} />
                    <select name="status" value={editForm.status} onChange={handleEditChange}>
                      {STATUSES.map(st => <option key={st} value={st}>{st}</option>)}
                    </select>

                    <div className="status-controls">
                      <button type="submit" className="cta-button primary">Save</button>
                      <button type="button" className="cta-button secondary" onClick={cancelEdit}>Cancel</button>
                    </div>
                  </form>
                )
                : (
                  <>
                    <div>
                      <strong>#{s._id}</strong>
                      &nbsp;— {s.origin} → {s.destination}
                      &nbsp;— Status: <em>{s.status}</em>
                    </div>
                    <div className="status-controls">
                      <select
                        value={statusUpdates[s._id] || ''}
                        onChange={e => handleStatusChange(s._id, e.target.value)}
                      >
                        <option value="">— Select new status —</option>
                        {STATUSES.map(st => <option key={st} value={st}>{st}</option>)}
                      </select>
                      <button
                        className="cta-button secondary"
                        onClick={() => handleUpdateStatus(s._id)}
                        disabled={!statusUpdates[s._id]}
                      >
                        Update
                      </button>
                      <button className="cta-button" onClick={() => startEdit(s)}>
                        Edit
                      </button>
                      <button
                        className="cta-button danger"
                        onClick={() => handleDelete(s._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default Admin;
