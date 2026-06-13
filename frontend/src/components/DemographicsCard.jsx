import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const DemographicsCard = ({ data }) => {
  if (!data) return null;

  const maleRatio = parseFloat(data.male_ratio) || 0;
  const femaleRatio = parseFloat(data.female_ratio) || 0;

  const genderData = [
    { name: "Male", value: maleRatio },
    { name: "Female", value: femaleRatio },
  ];

  const COLORS = ["#6366f1", "#a855f7"];

  const confidenceData = data.confidence_distribution ? [
    { label: "High", value: parseFloat(data.confidence_distribution.high_confidence) || 0 },
    { label: "Medium", value: parseFloat(data.confidence_distribution.medium_confidence) || 0 },
    { label: "Low", value: parseFloat(data.confidence_distribution.low_confidence) || 0 },
  ] : [];

  return (
    <div className="w-full bg-[#0a0c1b]/80 backdrop-blur-xl border border-indigo-500/20 rounded-[2.5rem] p-10 shadow-2xl shadow-indigo-500/10 text-slate-200">
      {/* ================= HEADER ================= */}
      <div className="mb-10">
        <h2 className="text-2xl font-black text-white mb-2">
          Demographic & Population Insights
        </h2>
      </div>

      {/* ================= TOP METRICS ================= */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14 border-b border-indigo-500/10 pb-10">
        <div>
          <p className="text-xs uppercase tracking-widest text-slate-500 mb-2">
            Total Population
          </p>
          <p className="text-4xl font-black text-white">
            {(data.population || 0).toLocaleString()}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Total residents in the target city
          </p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-widest text-slate-500 mb-2">
            Population Density
          </p>
          <p className="text-4xl font-black text-white">
            {data.density || "N/A"}
            <span className="text-lg font-medium text-slate-500"> / km²</span>
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Population per square kilometer
          </p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-widest text-slate-500 mb-2">
            Youth Ratio
          </p>
          <p className="text-4xl font-black text-purple-400">
            {data.youth_ratio || 0}%
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Percentage of youth population
          </p>
        </div>

        <div className="text-center md:text-right">
          <p className="text-xs uppercase tracking-widest text-slate-500 mb-3">
            Demographic Index
          </p>
          <div className="w-20 h-20 mx-auto md:ml-auto rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.4)]">
            <span className="text-2xl font-black text-white">
              {data.demographic_index || 82}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Overall demographic strength score
          </p>
        </div>
      </div>

      {/* ================= MAIN ANALYSIS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        {/* ========= GENDER ANALYSIS ========= */}
        <div className="flex flex-col items-center">
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6">
            Gender Composition
          </h3>

          <div className="relative h-72 w-full max-w-xs">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={genderData}
                  cx="50%"
                  cy="50%"
                  innerRadius={75}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {genderData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-white">
                {maleRatio}%
              </span>
              <span className="text-xs uppercase text-slate-500">
                Male Population
              </span>
            </div>
          </div>

          <div className="flex justify-between w-full max-w-xs mt-6 text-sm">
            <div>
              <span className="text-indigo-400 font-bold">
                {maleRatio}%
              </span>
              <p className="text-xs text-slate-500">Male</p>
            </div>
            <div className="text-right">
              <span className="text-purple-400 font-bold">
                {femaleRatio}%
              </span>
              <p className="text-xs text-slate-500">Female</p>
            </div>
          </div>

          <p className="text-xs text-slate-500 mt-4 text-center max-w-xs">
            Gender distribution indicates overall demographic balance within the
            target location.
          </p>
        </div>

        {/* ========= CONFIDENCE ANALYSIS ========= */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-8">
            Prediction Confidence Distribution
          </h3>

          <div className="space-y-8">
            {Object.entries(data.confidence_distribution || {}).map(
              ([label, value]) => {
                const numericValue = parseFloat(value) || 0;

                return (
                  <div key={label}>
                    <div className="flex justify-between text-xs font-semibold mb-2">
                      <span className="text-slate-400">{label}</span>
                      <span className="text-indigo-400">
                        {numericValue.toFixed(2)}%
                      </span>
                    </div>

                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 transition-all duration-1000 shadow-[0_0_15px_rgba(99,102,241,0.7)]"
                        style={{ width: `${numericValue}%` }}
                      />
                    </div>
                  </div>
                );
              },
            )}
          </div>

          <p className="text-xs text-slate-500 mt-8">
            Confidence levels represent the predictive certainty of the model
            for this location.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DemographicsCard;
