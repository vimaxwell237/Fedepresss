// src/context/ShipmentsContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api.js';
import { AuthContext } from './AuthContext';

export const ShipmentsContext = createContext({
  shipments:        [],
  loading:          false,
  error:            null,
  fetchShipments:   () => Promise.resolve(),
  createShipment:   () => Promise.resolve(null),
  updateShipment:   () => Promise.resolve(null),
  deleteShipment:   () => Promise.resolve(),
  getShipmentById:  () => Promise.resolve(null),
});

export const ShipmentsProvider = ({ children }) => {
  const { token, userRole } = useContext(AuthContext);
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);

  // Fetch all shipments: admin gets all, user gets only their own
  const fetchShipments = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/shipments');
      setShipments(res.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // whenever token changes, reload shipments
    fetchShipments();
  }, [token]);

  // Create a new shipment
  const createShipment = async (data) => {
    if (!token) throw new Error('Not authenticated');
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/shipments', data);
      // append new to local state
      setShipments(prev => [...prev, res.data]);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update shipment status (admin only)
  const updateShipment = async (id, newStatus) => {
    if (!token) throw new Error('Not authenticated');
    if (userRole !== 'admin') throw new Error('Forbidden');
    setLoading(true);
    setError(null);
    try {
      const res = await api.patch(`/shipments/${id}`, { status: newStatus });
      setShipments(prev => prev.map(s => (s._id === id ? res.data : s)));
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete a shipment (admin only)
  const deleteShipment = async (id) => {
    if (!token) throw new Error('Not authenticated');
    if (userRole !== 'admin') throw new Error('Forbidden');
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/shipments/${id}`);
      setShipments(prev => prev.filter(s => s._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get a single shipment by ID
  const getShipmentById = async (id) => {
    if (!token) throw new Error('Not authenticated');
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/shipments/${id}`);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return (
    <ShipmentsContext.Provider
      value={{
        shipments,
        loading,
        error,
        fetchShipments,
        createShipment,
        updateShipment,
        deleteShipment,
        getShipmentById
      }}
    >
      {children}
    </ShipmentsContext.Provider>
  );
};
