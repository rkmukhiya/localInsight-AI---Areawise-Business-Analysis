import React, { useMemo } from "react";
import { Trophy, MapPin, AlertCircle, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../context/auth.jsx";
import { useNavigate } from "react-router-dom";

function Sidebar({ data }) {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Logic: Calculate Potential based on Confidence + Footfall
  const potential = useMemo(() => {
  if (!data) return null;

  const prediction = data.predicted_category;

  if (prediction === "High") {
    return {
      label: "High Potential",
      color: "text-yellow-500",
      bg: "bg-yellow-500/10",
      border: "border-yellow-500/20",
      icon: <Trophy className="w-3 h-3 text-yellow-500" />
    };
  } else if (prediction === "Low") {
    return {
      label: "Low Potential",
      color: "text-rose-500",
      bg: "bg-rose-500/10",
      border: "border-rose-500/20",
      icon: <AlertCircle className="w-3 h-3 text-rose-500" />
    };
  } else {
    return {
      label: "Medium Potential",
      color: "text-indigo-400",
      bg: "bg-indigo-500/10",
      border: "border-indigo-500/20",
      icon: <Zap className="w-3 h-3 text-indigo-400" />
    };
  }
}, [data]);


  return (
    <aside className="w-full lg:w-[28%] xl:w-1/4 h-full lg:overflow-y-auto p-6 flex flex-col gap-6 border-b lg:border-b-0 lg:border-r border-white/5 no-scrollbar bg-gradient-to-b from-[#0b0f2a] via-[#11152e] to-[#15193a] shadow-[inset_-1px_0_20px_rgba(99,102,241,0.08)] relative">
      {/* Welcome */}
      <h1 className="text-3xl font-semibold text-white">
        Welcome{" "}
        <span className="font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
          {currentUser?.displayName || "User"}
        </span>
        !
      </h1>

      {/* Location Overview Header */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
          <h2 className="text-xl font-black text-white tracking-tight">Location Overview</h2>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 rounded-full border border-indigo-500/20">
          <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
          <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest">Live</span>
        </div>
      </div>

      {/* Main Location Card */}
      {data && (
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative bg-[#1e1b4b]/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6 overflow-hidden ring-1 ring-indigo-500/20 shadow-[0_0_30px_rgba(99,102,241,0.1)]"
        >
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl"></div>

          {/* Dynamic Potential Badge */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
              Primary Target
            </span>
            {potential && (
              <div className={`flex items-center gap-1 px-2 py-0.5 rounded border ${potential.bg} ${potential.border}`}>
                {potential.icon}
                <span className={`text-[8px] font-bold uppercase ${potential.color}`}>
                  {potential.label}
                </span>
              </div>
            )}
          </div>

          <h3 className="text-2xl font-black mb-3 text-indigo-400">{data.city}</h3>

          <div className="flex items-center gap-2.5 mb-4">
            <div className="p-1.5 bg-indigo-500/10 rounded-lg">
              <MapPin className="w-4 h-4 text-indigo-400" />
            </div>
            <span className="text-sm font-bold text-slate-400">{data.pincode}</span>
          </div>

          {/* Score Circle */}
          <div className="absolute top-6 right-6 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full border-2 border-indigo-500/50 flex items-center justify-center relative bg-[#1a1a2e]">
              <div className="text-sm font-black font-mono text-indigo-400">
                {parseFloat(data.city_index_score || 0).toFixed(1)}
              </div>
              <div className="absolute -inset-1.5 border-2 border-indigo-500 rounded-full opacity-30 animate-ping"></div>
            </div>
          </div>
        </motion.div>
      )}

      {/* New Prediction Button */}
      <button
        onClick={() => navigate("/form")}
        className="w-full mt-6 py-4 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all text-indigo-300"
      >
        New Prediction
      </button>

      <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-600/10 blur-3xl rounded-full"></div>
    </aside>
  );
}

export default Sidebar;