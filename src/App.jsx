
// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { AuthProvider }      from './context/AuthContext';
import { ShipmentsProvider } from './context/ShipmentsContext';

import RootLayout     from './layout/RootLayout';
import Home           from './pages/Home';
import Admin          from './pages/Admin';
import Shipping       from './pages/Shipping';
import Tracking       from './pages/Tracking';
import Track          from './pages/Track';
import Locations      from './pages/Locations';
import Support        from './pages/Support';
import Quote          from './pages/Quote';
import Login          from './pages/Login';     // Admin login
import Logins         from './pages/Logins';    // User login
import SignUp         from './pages/SignUp';
import Dashboard      from './pages/Dashboard';
import NotFound       from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <ShipmentsProvider>
        <Router>
          <Routes>
            {/* Public auth pages (no layout) */}
            <Route path="login"      element={<Login />} />
            <Route path="user-login" element={<Logins />} />
            <Route path="signup"     element={<SignUp />} />

            {/* All other pages share the root layout */}
            <Route path="/" element={<RootLayout />}>
              {/* Public routes */}
              <Route index              element={<Home />} />
              <Route path="shipping"    element={<Shipping />} />
              <Route path="tracking"    element={<Tracking />} />
              <Route path="track/:id"   element={<Track />} />
              <Route path="locations"   element={<Locations />} />
              <Route path="support"     element={<Support />} />
              <Route path="get-a-quote" element={<Quote />} />

              {/* Protected user dashboard */}
              <Route
                path="dashboard"
                element={
                  <ProtectedRoute requiredRole="user">
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              {/* Protected admin dashboard */}
              <Route
                path="admin"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <Admin />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all 404 */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Router>
      </ShipmentsProvider>
    </AuthProvider>
  );
}

export default App;