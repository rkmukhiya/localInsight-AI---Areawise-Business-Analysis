import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/auth";
import {
  Menu,
  X,
  LogOut,
  Home as HomeIcon,
  Map as MapIcon,
  ClipboardList,
  LayoutDashboard,
} from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, logOut } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [clicked, setClicked] = useState(null);

  const handleLogout = async () => {
    await logOut();
    navigate("/login");
  };

  // 🔥 underline animation trigger
  const handleClick = (path) => {
    setClicked(path);
    setTimeout(() => setClicked(null), 400);
  };

  const isActive = (path) => location.pathname === path;

  const NavLink = ({ to, icon: Icon, label }) => {
    const active = isActive(to);

    return (
      <Link
        to={to}
        onClick={() => handleClick(to)}
        className={`
          relative flex items-center gap-2 px-1
          transition-colors duration-200
          ${active ? "text-indigo-400" : "text-slate-400 hover:text-white"}
        `}
      >
        {Icon && <Icon size={16} />}
        {label}

        {/* CLICK-ONLY UNDERLINE (DISAPPEARS) */}
        <span
          className={`
            absolute left-0 -bottom-2 h-[2px] w-full
            bg-gradient-to-r from-indigo-400 to-purple-500
            ${clicked === to ? "animate-underline" : "scale-x-0"}
          `}
        />
      </Link>
    );
  };

  return (
    <>
      {/* underline animation */}
      <style>{`
        @keyframes underline {
          0% {
            transform: scaleX(0);
            transform-origin: left;
            opacity: 1;
          }
          70% {
            transform: scaleX(1);
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }
        .animate-underline {
          animation: underline 0.6s ease-out forwards;
        }
      `}</style>

      <nav className="fixed top-0 left-0 w-full z-[9999] bg-[#0a0a1a] border-0 shadow-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

          {/* LOGO */}
          <div
            onClick={() => navigate("/")}
            className="text-3xl font-extrabold cursor-pointer text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 via-purple-400 to-indigo-400"
          >
            LocalInsight
          </div>

          {/* DESKTOP MENU */}
          <ul className="hidden md:flex items-center space-x-8 text-sm font-semibold">
            <NavLink to="/" icon={HomeIcon} label="Home" />
            <NavLink to="/map" icon={MapIcon} label="Map" />
            <NavLink to="/form" icon={ClipboardList} label="Analysis" />

            {currentUser && (
              <>
                {localStorage.getItem("activeDashboard") === "prediction" && localStorage.getItem("predictionLocations") && (
                  <NavLink to="/prediction-dashboard" icon={LayoutDashboard} label="Prediction Dashboard" />
                )}
                {localStorage.getItem("activeDashboard") === "city" && localStorage.getItem("lastPrediction") && (
                  <NavLink to="/city-dashboard" icon={LayoutDashboard} label="City Dashboard" />
                )}
                <NavLink to="/strategy-dashboard" icon={ClipboardList} label="Strategic Roadmap" />
              </>
            )}
          </ul>

          {/* AUTH */}
          <div className="hidden md:flex items-center gap-4">
            {currentUser ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-xl"
              >
                <LogOut size={16} />
                Logout
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="text-white hover:text-indigo-400"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl font-bold"
                >
                  Get Started
                </button>
              </>
            )}
          </div>

          {/* MOBILE BUTTON */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-white">
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {isOpen && (
          <div className="md:hidden px-6 py-6 space-y-4 bg-[#070716] border-0">
            <NavLink to="/" label="Home" />
            <NavLink to="/map" label="Map" />
            <NavLink to="/form" label="Analysis" />

            {currentUser && (
              <>
                {localStorage.getItem("activeDashboard") === "prediction" && localStorage.getItem("predictionLocations") && (
                  <NavLink to="/prediction-dashboard" label="Prediction Dashboard" />
                )}
                {localStorage.getItem("activeDashboard") === "city" && localStorage.getItem("lastPrediction") && (
                  <NavLink to="/city-dashboard" label="City Dashboard" />
                )}
                <NavLink to="/strategy-dashboard" label="Strategy Dashboard" />
              </>
            )}

            {currentUser && (
              <button
                onClick={handleLogout}
                className="w-full mt-4 bg-white/5 text-white py-3 rounded-xl border border-white/10"
              >
                Logout
              </button>
            )}
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
