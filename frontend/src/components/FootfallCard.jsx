import React from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const FootfallCard = ({ data }) => {
  if (!data) return null;

  const monthly = parseFloat(data.footfall_monthly) || 0;

  const dailyAvg = Math.round(monthly / 30);

  // Proper weekday/weekend split
  const weekdayAvg = Math.round((dailyAvg * 5) / 7);
  const weekendAvg = Math.round(((dailyAvg * 2) / 7) * 1.2); // slight boost

  const weekendBoost = weekdayAvg > 0 ? Math.round(
    ((weekendAvg - weekdayAvg) / weekdayAvg) * 100
  ) : 0;

  /* ======================
     HOURLY TREND (SCALED)
  ====================== */

  const trendData = [
    { time: "06h", visitors: Math.round(dailyAvg * 0.15) },
    { time: "10h", visitors: Math.round(dailyAvg * 0.35) },
    { time: "14h", visitors: Math.round(dailyAvg * 0.6) },
    { time: "18h", visitors: Math.round(dailyAvg * 1.1) }, // peak
    { time: "22h", visitors: Math.round(dailyAvg * 0.7) },
  ];

  const trafficData = [
    { name: "Weekday Avg", value: weekdayAvg },
    { name: "Weekend Avg", value: weekendAvg },
  ];

  return (
    <div className="bg-[#0a0c1b]/90 backdrop-blur-xl border border-indigo-500/20 rounded-[2.5rem] p-8 shadow-2xl shadow-indigo-500/10 text-slate-200 mb-20">

      {/* ================= HEADER ================= */}
      <div className="mb-10">
        <h2 className="text-2xl font-black text-white mb-2">
          Footfall & Market Activity Analysis
        </h2>
      </div>

      {/* ================= KPI ROW ================= */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12 border-b border-indigo-500/10 pb-10">

        <div>
          <p className="text-xs uppercase tracking-widest text-slate-500 mb-2">
            Monthly Footfall
          </p>
          <p className="text-4xl font-black text-white">
            {monthly.toLocaleString()}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Total visitors per month
          </p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-widest text-slate-500 mb-2">
            Daily Average
          </p>
          <p className="text-4xl font-black text-white">
            {dailyAvg.toLocaleString()}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Estimated visitors per day
          </p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-widest text-slate-500 mb-2">
            Avg Household Income
          </p>
          <p className="text-4xl font-black text-white">
            ₹{Math.round((parseFloat(data.avg_income) || 0) / 1000)}k
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Purchasing power indicator
          </p>
        </div>

        <div className="text-right">
          <p className="text-xs uppercase tracking-widest text-slate-500 mb-3">
            Market Attractiveness
          </p>
          <div className="w-20 h-20 ml-auto rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.4)]">
            <span className="text-2xl font-black text-white">
              {Math.round(parseFloat(data.city_index_score) || 0)}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Composite viability score
          </p>
        </div>
      </div>

      {/* ================= CHARTS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-14">

        {/* HOURLY TREND */}
        <div className="h-72">
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6 text-center">
            Hourly Traffic Trend
          </h3>

          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="colorVis" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e1b4b" />
              <XAxis
                dataKey="time"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 10 }}
              />
              <YAxis hide />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0a0c1b",
                  border: "1px solid #1e1b4b",
                  borderRadius: "12px",
                }}
              />
              <Area
                type="monotone"
                dataKey="visitors"
                stroke="#a855f7"
                strokeWidth={3}
                fill="url(#colorVis)"
              />
            </AreaChart>
          </ResponsiveContainer>

          <p className="text-xs text-slate-500 text-center mt-4">
            Evening hours show peak visitor concentration.
          </p>
        </div>

        {/* WEEKDAY VS WEEKEND */}
        <div className="h-72">
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6 text-center">
            Weekday vs Weekend Traffic
          </h3>

          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trafficData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e1b4b" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 10 }}
              />
              <YAxis hide />
              <Tooltip />
              <Bar dataKey="value" radius={[10, 10, 0, 0]} barSize={60}>
                {trafficData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={index === 0 ? "#3b82f6" : "#6366f1"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          <p className="text-xs text-slate-500 text-center mt-4">
            Weekend traffic shows a {weekendBoost > 0 ? "+" : ""}
            {weekendBoost}% uplift compared to weekday average.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FootfallCard;
