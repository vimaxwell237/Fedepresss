// src/context/ShipmentsContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
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

  // Helper to get auth headers
  const authHeaders = () => ({
    headers: { Authorization: `Bearer ${token}` }
  });

  // Fetch all shipments for this user
  const fetchShipments = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(
        'http://localhost:5000/api/shipments',
        authHeaders()
      );
      setShipments(res.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShipments();
  }, [token]);

  // Create a new shipment
  const createShipment = async (data) => {
    if (!token) throw new Error('Not authenticated');
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(
        'http://localhost:5000/api/shipments',
        data,
        authHeaders()
      );
      setShipments(prev => [...prev, res.data]);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update an existing shipment (admin only)
  const updateShipment = async (id, newStatus) => {
    if (!token) throw new Error('Not authenticated');
    if (userRole !== 'admin') throw new Error('Forbidden');
    setLoading(true);
    setError(null);
    try {
      const res = await axios.patch(
        `http://localhost:5000/api/shipments/${id}`,
        { status: newStatus },
        authHeaders()
      );
      setShipments(prev =>
        prev.map(s => (s._id === id ? res.data : s))
      );
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
      await axios.delete(
        `http://localhost:5000/api/shipments/${id}`,
        authHeaders()
      );
      setShipments(prev => prev.filter(s => s._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Fetch a single shipment by ID
  const getShipmentById = async (id) => {
    if (!token) throw new Error('Not authenticated');
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(
        `http://localhost:5000/api/shipments/${id}`,
        authHeaders()
      );
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
