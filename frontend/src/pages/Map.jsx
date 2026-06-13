import React, { useState, useEffect } from 'react';
import BusinessMap from '../components/BusinessMap/BusinessMap.jsx';
import ControlPanel from '../components/BusinessMap/ControlPanel.jsx';
import { motion } from 'framer-motion';

const MapPage = () => {
  const [mapStyle, setMapStyle] = useState('dataviz');
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mapStats, setMapStats] = useState({
    totalHubs: 0,
    geocodedCount: 0,
    isGeocoding: false,
    efficiencyQuotient: 0
  });

  // State to control layer visibility
  const [visibleLayers, setVisibleLayers] = useState({
    heatmap: true,
    competitors: true,
    pois: true,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log("Fetching map data...");
        const res = await fetch('http://localhost:5000/api/locations');
        if (!res.ok) throw new Error("Backend response not OK");
        const data = await res.json();
        console.log("Map data received:", data);
        if (Array.isArray(data)) {
          setLocations(data.slice(0, 200));
        }
      } catch (err) {
        console.error("Failed to load map data:", err);
      } finally {
        // Reduced loading time for better UX
        setTimeout(() => setLoading(false), 800);
      }
    };
    loadData();
  }, []);

  const toggleLayer = (layerName) => {
    setVisibleLayers(prev => ({ ...prev, [layerName]: !prev[layerName] }));
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#0a0a1a] relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/10 blur-[150px] rounded-full" />

        <div className="relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-24 h-24 rounded-full border-t-2 border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.4)]"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full animate-ping" />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 text-center"
        >
          <h2 className="text-xl font-black text-white uppercase tracking-[0.4em] mb-2">Synchronizing Data</h2>
          <p className="text-[10px] text-cyan-400 font-black uppercase tracking-widest opacity-60">Mapping Global Intelligence Matrix</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#0a0a1a]">
      <BusinessMap
        mapStyle={mapStyle}
        visibleLayers={visibleLayers}
        locations={locations}
        onStatsUpdate={setMapStats}
      />
      <ControlPanel
        layers={visibleLayers}
        toggleLayer={toggleLayer}
        mapStyle={mapStyle}
        setMapStyle={setMapStyle}
        stats={mapStats}
      />

    </div>
  );
};

export default MapPage;