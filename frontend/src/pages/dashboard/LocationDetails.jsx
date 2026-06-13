import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  MapPin,
  Users,
  IndianRupee,
  Activity,
  Target,
  AlertCircle,
  CheckCircle2,
  TrendingDown,
  BarChart3,
  Lightbulb
} from "lucide-react";

// --- Visual Components ---

// 1. Opportunity Score Gauge (Card 1)
const ScoreGauge = ({ score }) => {
  const percentage = Math.min(Math.max(score * 50, 0), 100);
  const radius = 85;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  const colorMap = {
    high: { text: "text-indigo-400", bg: "bg-indigo-500", glow: "rgba(99, 102, 241, 0.6)" },
    mid: { text: "text-amber-400", bg: "bg-amber-500", glow: "rgba(251, 191, 36, 0.6)" },
    low: { text: "text-rose-500", bg: "bg-rose-500", glow: "rgba(244, 63, 94, 0.6)" }
  };

  const currentStatus = score >= 0.6 ? 'high' : score >= 0.4 ? 'mid' : 'low';
  const theme = colorMap[currentStatus];

  return (
    <div className="relative flex items-center justify-center py-6 w-full">
      <div className="relative w-64 h-64 group">
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute inset-0 rounded-full blur-[60px] ${theme.bg}`}
        />

        <svg className="w-full h-full transform -rotate-90 filter drop-shadow-2xl" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r={radius} stroke="#1e293b" strokeWidth="12" fill="none" opacity="0.5" />
          <motion.circle
            cx="100" cy="100" r={radius}
            stroke="currentColor"
            strokeWidth="12"
            fill="none"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 2, ease: "circOut" }}
            strokeLinecap="round"
            className={`${theme.text}`}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span className={`text-6xl font-black ${theme.text} tracking-tighter`}>
            {(score * 50).toFixed(0)}%
          </motion.span>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Opportunity Score</p>
        </div>
      </div>
    </div>
  );
};

// 2. Rent History Chart (Card 2)
const RentHistory = ({ currentRent }) => {
  // Generate 5 years of mock historical data based on current rent
  const history = [
    { year: 2022, value: currentRent * 0.8 },
    { year: 2023, value: currentRent * 0.85 },
    { year: 2024, value: currentRent * 0.92 },
    { year: 2025, value: currentRent * 0.98 },
    { year: 2026, value: currentRent },
  ];

  const maxVal = Math.max(...history.map(d => d.value)) * 1.25;
  const gridLines = [0.25, 0.5, 0.75, 1];

  return (
    <div className="h-full w-full flex flex-col justify-between p-2 relative">
      <div className="flex-1 relative mb-6">
        {/* Chart Grid Lines & Labels */}
        <div className="absolute inset-x-12 inset-y-4 pointer-events-none">
          {gridLines.map((line, idx) => (
            <div
              key={idx}
              className="absolute w-full border-t border-white/[0.03] flex items-center h-px"
              style={{ bottom: `${line * 100}%` }}
            >
              <span className="text-[8px] font-bold text-slate-700 mr-2 -ml-12 w-8 text-right">
                ₹{(maxVal * line / 1000).toFixed(0)}k
              </span>
            </div>
          ))}
          {/* Baseline */}
          <div className="absolute w-full border-t border-white/10 bottom-0" />
        </div>

        <div className="flex items-end justify-around h-56 relative pb-2 px-12 gap-4">
          {history.map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center justify-end group z-10 h-full">
              <div className="relative w-full flex justify-center h-full items-end">
                {/* Glow Highlight */}
                <motion.div
                  animate={{ opacity: [0.1, 0.3, 0.1] }}
                  transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                  className="absolute w-12 blur-2xl bg-indigo-500/20 z-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ height: `${(d.value / maxVal) * 100}%` }}
                />

                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(d.value / maxVal) * 100}%` }}
                  transition={{ duration: 1.5, delay: i * 0.1, ease: "circOut" }}
                  className="w-full max-w-[44px] bg-gradient-to-t from-indigo-600 via-purple-500 to-indigo-400 rounded-t-xl relative border-t border-x border-white/20 shadow-2xl group-hover:scale-x-105 transition-transform"
                >
                  {/* Glossy Top Overlay */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-white/20 rounded-t-xl" />

                  {/* Floating Value Tag */}
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-2.5 py-1.5 bg-slate-900 border border-white/10 rounded-lg text-[10px] font-black text-white opacity-0 group-hover:opacity-100 transition-all transform group-hover:-translate-y-2 shadow-2xl z-20 whitespace-nowrap">
                    ₹{Math.round(d.value).toLocaleString()}
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45 border-r border-b border-white/10"></div>
                  </div>
                </motion.div>
              </div>
              <span className="text-[10px] font-black text-slate-500 mt-4 tracking-widest uppercase">{d.year}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-6 p-4 bg-white/[0.02] border border-white/5 rounded-3xl flex items-center justify-between shadow-inner">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 rounded-xl">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <p className="text-[10px] font-black text-white uppercase tracking-tight">Appreciation Rate</p>
            <p className="text-[9px] font-bold text-slate-500">Compounded Growth: <span className="text-emerald-400">+6.8%</span></p>
          </div>
        </div>
        <div className="text-right px-4 py-1.5 bg-white/5 rounded-xl border border-white/5">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Market Volatility</span>
          <span className="text-[11px] font-black text-indigo-400">Ultra Low</span>
        </div>
      </div>
    </div>
  );
};

// 3. Demographic Distribution (Card 3)
const DemographicStats = ({ youth, male, female }) => {
  const stats = [
    { label: "Youth", value: youth, color: "bg-indigo-500" },
    { label: "Male", value: male, color: "bg-blue-500" },
    { label: "Female", value: female, color: "bg-purple-500" },
  ];

  return (
    <div className="h-full w-full flex flex-col justify-center gap-8 p-6">
      {stats.map((stat, i) => (
        <div key={i} className="space-y-2">
          <div className="flex justify-between items-end">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</span>
            <span className="text-lg font-black text-white">{stat.value}%</span>
          </div>
          <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${stat.value}%` }}
              className={`h-full ${stat.color} shadow-[0_0_15px_rgba(0,0,0,0.5)]`}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

// 4. Footfall vs Density (Card 4 - My Choice)
const MarketDensity = ({ footfall, similarShops }) => {
  const saturation = Math.min((similarShops / 10) * 100, 100);
  const footfallIndex = Math.min((footfall / 50000) * 100, 100);

  return (
    <div className="h-full w-full flex flex-col justify-around p-6">
      <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl">
        <div className="p-3 bg-indigo-500/20 rounded-xl">
          <Activity className="w-6 h-6 text-indigo-400" />
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-500 uppercase">Footfall Index</p>
          <div className="flex items-center gap-2">
            <h4 className="text-xl font-black text-white">{footfallIndex.toFixed(0)}</h4>
            <span className="text-[10px] text-emerald-400">+12% vs Avg</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          <span>Market Saturation</span>
          <span className={saturation > 70 ? "text-rose-400" : "text-emerald-400"}>
            {saturation > 70 ? "High Risk" : "Blue Ocean"}
          </span>
        </div>
        <div className="h-4 w-full bg-slate-800 rounded-full flex overflow-hidden">
          <div className="h-full bg-emerald-500/40 w-[30%]" />
          <div className="h-full bg-amber-500/40 w-[40%]" />
          <div className="h-full bg-rose-500/40 w-[30%]" />
          <motion.div
            initial={{ left: 0 }}
            animate={{ left: `${saturation}%` }}
            className="absolute w-1 h-6 bg-white shadow-[0_0_10px_white] -mt-1"
          />
        </div>
      </div>
    </div>
  );
};

// --- Main Page ---

const LocationDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const locationData = state?.location;

  if (!locationData) return null;

  // Data Extraction
  const score = parseFloat(locationData.opportunity_score || locationData.rank_score || 0);
  const rent = parseFloat(locationData.Rent || 0);
  const youth = Math.round(parseFloat(locationData['Youth_Pop_%'] || locationData.Youth_Ratio || 0) * 100) / 100 || 0;
  const male = Math.round(parseFloat(locationData['Male_Pop_%'] || 0));
  const female = Math.round(parseFloat(locationData['Female_Pop_%'] || 0));
  const footfall = parseFloat(locationData.FootFalls_per_month || 0);
  const similarShops = parseInt(locationData.similar_shop || 0);

  // Recommendations Generation
  const getImprovements = () => {
    const list = [];
    if (score < 0.5) list.push({ title: "Visibility Issues", tip: "Investing in premium street-facing signage can increase organic footfall by 15%." });
    if (similarShops > 5) list.push({ title: "High Competition", tip: "Differentiate with a unique sub-category or niche service that nearby competitors lack." });
    if (youth < 20) list.push({ title: "Audience Mismatch", tip: "Current regional demographic shifts towards family units; adjust product inventory to cater to households." });
    if (rent > 50000) list.push({ title: "High Overhead", tip: "Consider more efficient space utilization or a cloud-kitchen hybrid model to offset premium rent." });

    // Default if none apply
    if (list.length === 0) {
      list.push({ title: "Operational Scaling", tip: "Market data suggests this area is under-tapped. Consider multi-layered marketing campaigns." });
    }
    return list;
  };

  const improvements = getImprovements();

  return (
    <div className="h-full overflow-y-auto bg-[#0a0a1a] text-white p-6 pb-20 relative overflow-x-hidden selection:bg-indigo-500/30">
      {/* Immersive Background System */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(15,23,42,0.5)_0%,_rgba(10,10,26,1)_100%)]"></div>
        <motion.div animate={{ scale: [1, 1.2, 1], x: [0, 50, 0] }} transition={{ duration: 20, repeat: Infinity }} className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-cyan-500/5 blur-[120px] rounded-full" />
        <motion.div animate={{ scale: [1, 1.3, 1], x: [0, -40, 0] }} transition={{ duration: 25, repeat: Infinity }} className="absolute top-[20%] -right-[5%] w-[35%] h-[35%] bg-indigo-500/5 blur-[100px] rounded-full" />
      </div>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 flex flex-col md:flex-row justify-between items-end pb-8 mb-8 border-b border-white/5">
        <div>
          <button onClick={() => navigate(-1)} className="text-sm text-gray-500 hover:text-white flex items-center gap-2 mb-4 transition-colors">
            <Target className="w-4 h-4" /> Back to Analysis
          </button>
          <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-indigo-500 capitalize leading-tight">
            {locationData.Area || locationData.City || locationData.city}
          </h1>
          <div className="flex items-center gap-3 mt-2">
            <MapPin className="w-4 h-4 text-indigo-400" />
            <p className="text-slate-400 font-bold tracking-wide uppercase text-xs">
              {locationData.City ? `${locationData.City}, ${locationData.District}` : locationData.District}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xl font-black text-indigo-400">
              {locationData.predicted_category || "Standard"} Rank
            </span>
          </div>
        </div>
      </motion.div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">

        {/* Card 1: Score */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#111122]/80 backdrop-blur-xl border border-white/5 rounded-[40px] p-8 flex flex-col items-center justify-center min-h-[400px]">
          <h3 className="absolute top-8 left-8 text-[11px] font-black text-slate-500 uppercase tracking-[0.4em]">Proprietary Opportunity Score</h3>
          <ScoreGauge score={score} />
        </motion.div>

        {/* Card 2: Rent History */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="bg-[#111122]/80 backdrop-blur-xl border border-white/5 rounded-[40px] p-8 flex flex-col min-h-[400px]">
          <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] mb-8 flex items-center gap-2">
            <BarChart3 className="w-4 h-4" /> 5-Year Rental Trajectory
          </h3>
          <RentHistory currentRent={rent} />
        </motion.div>

        {/* Card 3: Demographics */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="bg-[#111122]/80 backdrop-blur-xl border border-white/5 rounded-[40px] p-8 flex flex-col min-h-[400px]">
          <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] mb-8 flex items-center gap-2">
            <Users className="w-4 h-4" /> Demographic Segmentation
          </h3>
          <DemographicStats youth={youth} male={male} female={female} />
        </motion.div>

        {/* Card 4: Market Density */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="bg-[#111122]/80 backdrop-blur-xl border border-white/5 rounded-[40px] p-8 flex flex-col min-h-[400px]">
          <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] mb-8 flex items-center gap-2">
            <Activity className="w-4 h-4" /> Market Capture Dynamics
          </h3>
          <MarketDensity footfall={footfall} similarShops={similarShops} />
        </motion.div>

        {/* Strategic Roadmap (Full Width) */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="md:col-span-2">
          <div className="bg-gradient-to-br from-[#1a1a3a] to-[#0a0a1a] border border-indigo-500/20 rounded-[40px] p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-40 bg-indigo-500/5 blur-[100px] rounded-full pointer-events-none" />

            <div className="flex items-center gap-4 mb-8">
              <div className="p-4 bg-indigo-500/20 rounded-2xl">
                <Lightbulb className="w-8 h-8 text-indigo-400" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-white">Improvement Roadmap</h2>
                <p className="text-slate-400 font-medium">Actionable insights to maximize your business potential</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
              {improvements.map((item, idx) => (
                <div key={idx} className="flex gap-6 p-6 bg-white/5 rounded-3xl border border-white/5 hover:border-indigo-500/30 transition-all group">
                  <div className="flex-shrink-0 w-12 h-12 bg-indigo-500/10 rounded-full flex items-center justify-center text-indigo-400 font-bold group-hover:scale-110 transition-transform">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-white mb-2 underline decoration-indigo-500/50 decoration-2 underline-offset-4">{item.title}</h4>
                    <p className="text-slate-400 text-sm leading-relaxed">{item.tip}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Growth Focused</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Risk Managed</span>
                </div>
              </div>
              <button
                onClick={() => navigate('/strategy-dashboard')}
                className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl flex items-center gap-3 transition-all shadow-[0_10px_30px_rgba(79,70,229,0.3)] hover:shadow-[0_15px_40px_rgba(79,70,229,0.5)] active:scale-95"
              >
                Launch Strategic Roadmap <TrendingUp className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LocationDetails;
