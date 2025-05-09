// src/layout/RootLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import FedexNavbar from '../components/FedexNavbar';
import ChatWidget  from '../components/ChatWidget';

const RootLayout = () => (
  <>
    <FedexNavbar />
    <main>
      <Outlet />
    </main>
    <ChatWidget />
  </>
);

export default RootLayout;
