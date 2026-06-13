// src/components/BusinessMap/ControlPanel.jsx
import React from 'react';
import { Layers, Eye, EyeOff, Coffee, MapPin, BarChart2 } from 'lucide-react';

import { motion, AnimatePresence } from 'framer-motion';

const ControlPanel = ({ layers, toggleLayer, mapStyle, setMapStyle, stats = {} }) => {
  return (
    <div className="absolute top-24 right-8 z-20">
      <motion.div
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-[24px] p-6 shadow-2xl w-[260px]"
      >
        <div className="mb-6">
          <h2 className="text-lg font-black text-white uppercase tracking-tighter">Map Index</h2>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              {stats.totalHubs || 0} Hubs Connected
            </span>
          </div>
        </div>

        <div className="space-y-6">

          {/* Style Selector */}
          <div className="mb-8">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2 px-1">
              <Layers className="w-3 h-3 text-cyan-400" /> Perspective Mode
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'dataviz', label: 'Matrix', icon: '💎' },
                { id: 'dark', label: 'Nocturnal', icon: '🌑' },
                { id: 'streets', label: 'Vector', icon: '🗺️' },
                { id: 'hybrid', label: 'Organic', icon: '🛰️' }
              ].map(style => (
                <button
                  key={style.id}
                  onClick={() => setMapStyle(style.id)}
                  className={`
                   px-3 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-wider flex flex-col items-center gap-1 transition-all
                   ${mapStyle === style.id
                      ? 'bg-cyan-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] scale-[0.98]'
                      : 'bg-white/5 text-slate-400 border border-white/5 hover:bg-white/10'}
                 `}
                >
                  <span className="text-base">{style.icon}</span>
                  {style.label}
                </button>
              ))}
            </div>
          </div>

          {/* Layer Toggles */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2 px-1">
              <Eye className="w-3 h-3 text-indigo-400" /> Intelligence Layers
            </label>

            <LayerToggle
              label="Market Heatmap"
              icon={<BarChart2 className="w-4 h-4" />}
              enabled={layers.heatmap}
              onToggle={() => toggleLayer('heatmap')}
              activeColor="text-cyan-400"
            />
            <LayerToggle
              label="Competitor Nodes"
              icon={<MapPin className="w-4 h-4" />}
              enabled={layers.competitors}
              onToggle={() => toggleLayer('competitors')}
              activeColor="text-rose-400"
            />
            <LayerToggle
              label="Service POIs"
              icon={<Coffee className="w-4 h-4" />}
              enabled={layers.pois}
              onToggle={() => toggleLayer('pois')}
              activeColor="text-amber-400"
            />
          </div>
        </div>
      </motion.div>

    </div>
  );
};

const LayerToggle = ({ icon, label, enabled, onToggle, activeColor }) => (
  <button
    onClick={onToggle}
    className={`
      w-full flex items-center justify-between p-3 rounded-2xl transition-all duration-300 group
      ${enabled ? 'bg-white/5 border border-white/10' : 'bg-transparent border border-transparent opacity-40'}
    `}
  >
    <div className="flex items-center gap-3">
      <div className={`${enabled ? activeColor : 'text-slate-600'} transition-colors`}>
        {icon}
      </div>
      <span className={`text-[10px] font-black uppercase tracking-wider ${enabled ? 'text-white' : 'text-slate-500'}`}>{label}</span>
    </div>
    <div className={`w-8 h-4 rounded-full relative transition-colors ${enabled ? 'bg-cyan-500/50' : 'bg-slate-800'}`}>
      <motion.div
        animate={{ x: enabled ? 18 : 2 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className={`absolute top-1 w-2 h-2 rounded-full ${enabled ? 'bg-white' : 'bg-slate-600'}`}
      />
    </div>
  </button>
);

export default ControlPanel;