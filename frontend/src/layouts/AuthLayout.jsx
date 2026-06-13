// src/layouts/AuthLayout.jsx
import React from "react";

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a1a] relative overflow-hidden font-sans">
      {/* Background Glows matching Home.jsx */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-purple-600/15 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="w-full max-w-md z-10 p-4">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;

