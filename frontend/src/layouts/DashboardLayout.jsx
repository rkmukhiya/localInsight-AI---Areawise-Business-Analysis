import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from "../context/auth.jsx";
import Navbar from "../components/Navbar.jsx";

const DashboardLayout = () => {
  const { currentUser } = useAuth();

  return (
    <div className="flex flex-col h-screen text-white font-sans overflow-hidden bg-[#0a0a1a]" style={{ backgroundImage: 'linear-gradient(110deg, #1a1a2e 0%, #0a0a1a 100%)', backgroundAttachment: 'fixed' }}>
      {/* 1. Project Navigation Bar */}
      <Navbar />

      {/* Main Layout Container */}
      <main className="flex-1 flex flex-col pt-18 overflow-hidden relative">
        {/* Welcome Message moved to top of main content if needed, or rely on Dashboard page's header */}
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
