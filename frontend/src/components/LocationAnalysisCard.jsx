import React, { Suspense, lazy, useState, useEffect } from "react";
import { motion } from "framer-motion";

const LazyImage = lazy(() => import("./LazyImage.jsx"));

// --- Icon Components ---
const UsersIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const BriefcaseIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);

const ZapIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const StoreIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
    <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
    <path d="M2 7h20" />
    <path d="M22 7l-2 5H4L2 7" />
  </svg>
);

const DollarSignIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

const FootprintsIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M4 16v-2.38c0-1.47 1.2-2.69 2.66-2.69h1.62c.9 0 1.7.54 2.06 1.35L12 16" />
    <path d="M10.68 18H8.32C6.5 18 5 16.57 5 14.82V14" />
    <path d="M12 20v-3.41c0-1.5 1.2-2.72 2.66-2.72h1.62c.9 0 1.7.54 2.06 1.35L20 20" />
    <path d="M18.68 22H16.32c-1.82 0-3.32-1.43-3.32-3.18V18" />
  </svg>
);

const HomeIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const Sparkles = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m12 3 1.912 5.813a2 2 0 0 0 1.275 1.275L21 12l-5.813 1.912a2 2 0 0 0-1.275 1.275L12 21l-1.912-5.813a2 2 0 0 0-1.275-1.275L3 12l5.813-1.912a2 2 0 0 0 1.275-1.275L12 3Z" />
    <path d="M5 3v4" />
    <path d="M19 17v4" />
    <path d="M3 5h4" />
    <path d="M17 19h4" />
  </svg>
);

// --- Circular Progress ---
const CircularProgress = ({ score, size = "normal" }) => {
  const numericScore = typeof score === "number" ? score : parseFloat(score) || 0;
  const percentage = Math.min(Math.max(numericScore * 18, 0), 99);
  const radius = size === "small" ? 35 : 52;
  const strokeWidth = size === "small" ? 8 : 10;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  let strokeColor = "stroke-emerald-400";
  if (percentage < 33) strokeColor = "stroke-rose-500";
  else if (percentage < 66) strokeColor = "stroke-amber-400";

  const containerSize = size === "small" ? "w-24 h-24" : "w-32 h-32";
  const fontSize = size === "small" ? "text-lg" : "text-3xl";

  return (
    <div className={`relative flex items-center justify-center ${containerSize}`}>
      <svg className="w-full h-full" viewBox="0 0 120 120">
        <circle
          className="text-white/10"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="60"
          cy="60"
        />
        <motion.circle
          className={`${strokeColor} transition-all duration-700 ease-in-out drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="60"
          cy="60"
          transform="rotate(-90 60 60)"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className={`font-black text-white ${fontSize} drop-shadow-md`}>
          {percentage.toFixed(0)}%
        </span>
        <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest -mt-1 opacity-80">Score</span>
      </div>
    </div>
  );
};

// --- Main Card ---
function LocationAnalysisCard({ data }) {
  if (!data) return null;
  const isUserFormResult = data.opportunity_score !== undefined || data.rank_score !== undefined;
  const formatNumber = (num) =>
    typeof num !== "number" ? num : num.toLocaleString("en-IN");

  return (
    <motion.div
      className="bg-[#1a1a2e]/80 backdrop-blur-xl text-gray-100 p-0 rounded-[32px] shadow-2xl mx-auto my-6 border border-white/10 w-full overflow-hidden flex flex-col group relative"
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(99, 102, 241, 0.25)" }}
    >
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl group-hover:bg-indigo-500/20 transition-all duration-700" />

      {isUserFormResult ? (
        <UserFormCardContent data={data} formatNumber={formatNumber} />
      ) : (
        <CityDataFormCardContent data={data} />
      )}
    </motion.div>
  );
}

// --- UserForm Layout ---
const UserFormCardContent = ({ data, formatNumber }) => (
  <div className="flex flex-col h-full">
    {/* Header Section */}
    <div className="p-6 pb-4 border-b border-white/5 relative z-10">
      <div className="flex justify-between items-start mb-2">
        <div className="flex flex-col gap-1 pr-4">
          <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">Target Zone</span>
          <h2 className="text-2xl font-black text-white capitalize leading-tight break-words">
            {data.Area || data.City || data.city}
          </h2>
        </div>
        <div className="flex-shrink-0">
          <CircularProgress score={data.opportunity_score || data.rank_score} size="small" />
        </div>
      </div>
      <p className="text-xs font-medium text-slate-500 capitalize flex items-center gap-1.5 mt-1">
        <div className="w-1 h-1 bg-indigo-500 rounded-full" />
        {data.Area ? `${data.City || data.city}, ${data.District}` : data.District}
      </p>
    </div>

    {/* Stats Section */}
    <div className="p-6 space-y-3">
      <div className="grid grid-cols-1 gap-3">
        <InfoBlock
          icon={<FootprintsIcon className="w-5 h-5 text-indigo-400" />}
          label="Monthly Traffic"
          value={formatNumber(data.FootFalls_per_month)}
        />
        <InfoBlock
          icon={<DollarSignIcon className="w-5 h-5 text-emerald-400" />}
          label="Area Avg. Income"
          value={`₹${formatNumber(data.avg_income)}`}
        />
      </div>

      {/* Actionable Insights */}
      <div className="mt-4 pt-4 border-t border-white/5 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-3 h-3 text-indigo-400" />
          <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Market Intelligence</h3>
        </div>
        <div className="grid grid-cols-2 gap-y-4 gap-x-2">
          <InfoRow
            icon={<UsersIcon className="w-4 h-4 text-indigo-400" />}
            label="Youth Ratio"
            value={`${((data.Youth_Ratio || 0) * 100).toFixed(0)}%`}
          />
          <InfoRow
            icon={<HomeIcon className="w-4 h-4 text-indigo-400" />}
            label="Rent index"
            value={`₹${formatNumber(data.Rent)}`}
          />
          <InfoRow
            icon={<BriefcaseIcon className="w-4 h-4 text-indigo-400" />}
            label="Industry"
            value={data.product_type}
            capitalize
          />
          <InfoRow
            icon={<StoreIcon className="w-4 h-4 text-indigo-400" />}
            label="Comps"
            value={data.similar_shop}
          />
        </div>
      </div>
    </div>

    {/* Footer Gradient Decorator */}
    <div className="mt-auto h-1 w-full bg-gradient-to-r from-indigo-600 via-purple-500 to-indigo-600 opacity-30" />
  </div>
);

// --- CityData Layout (With Gemini Insight) ---
const CityDataFormCardContent = ({ data }) => {
  const successCategory = data.predicted_category || "N/A";
  let categoryColor = "text-gray-500 shadow-gray-500/20";
  let bgColor = "bg-gray-500/10";

  if (successCategory.toLowerCase() === "high") {
    categoryColor = "text-emerald-400 shadow-emerald-500/20";
    bgColor = "bg-emerald-500/10 border-emerald-500/20";
  }
  else if (successCategory.toLowerCase() === "medium") {
    categoryColor = "text-amber-400 shadow-amber-500/20";
    bgColor = "bg-amber-500/10 border-amber-500/20";
  }
  else if (successCategory.toLowerCase() === "low") {
    categoryColor = "text-rose-400 shadow-rose-500/20";
    bgColor = "bg-rose-500/10 border-rose-500/20";
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header Section */}
      <div className="p-6 border-b border-white/5 relative z-10">
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">Regional Profile</span>
            <h2 className="text-2xl font-black text-white capitalize leading-tight">
              {data.city || data.City}
            </h2>
          </div>
          <div className={`px-3 py-1.5 rounded-xl border ${bgColor} flex flex-col items-center justify-center min-w-[70px]`}>
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.1em]">Potential</span>
            <span className={`text-[12px] font-black uppercase tracking-widest ${categoryColor}`}>
              {data.predicted_category}
            </span>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="space-y-3">
          {/* Business Type Pill */}
          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/5 group-hover:bg-white/10 transition-colors">
            <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
              <BriefcaseIcon className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Industry focus</span>
              <span className="text-sm font-black text-white capitalize">{data.product_type}</span>
            </div>
          </div>
        </div>

        {/* AI Insight Section */}
        {data.insights && (
          <div className="mt-2 space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">AI Strategic Insight</h3>
            </div>
            <div className="bg-indigo-500/5 border border-indigo-500/10 p-5 rounded-2xl relative group-hover:bg-indigo-500/10 transition-all">
              <p className="text-[13px] leading-relaxed text-slate-300 font-medium italic">
                "{data.insights}"
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer Gradient Decorator */}
      <div className="mt-auto h-1.5 w-full bg-gradient-to-r from-indigo-600 via-purple-500 to-indigo-600 opacity-50" />
    </div>
  );
};
// --- Reusable Blocks ---
const InfoRow = ({ icon, label, value, capitalize = false }) => (
  <div className="flex flex-col gap-1">
    <div className="flex items-center gap-1.5 overflow-hidden">
      <div className="opacity-50 group-hover:opacity-100 transition-opacity flex-shrink-0">
        {icon}
      </div>
      <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.1em] truncate">{label}</span>
    </div>
    <span
      className={`text-xs font-black text-slate-200 ${capitalize ? "capitalize" : ""} truncate pl-5`}
    >
      {value}
    </span>
  </div>
);

const InfoBlock = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 bg-white/5 rounded-2xl p-4 border border-white/5 group hover:bg-indigo-500/10 hover:border-indigo-500/20 transition-all duration-300">
    <div className="flex-shrink-0 p-2 bg-indigo-500/10 rounded-xl text-indigo-400 group-hover:scale-110 transition-transform shadow-inner">
      {icon}
    </div>
    <div className="flex flex-col min-w-0">
      <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em] leading-none mb-1 truncate">
        {label}
      </span>
      <span className="text-lg font-black text-white tracking-tight truncate">
        {value}
      </span>
    </div>
  </div>
);

export default LocationAnalysisCard;
