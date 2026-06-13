import React, { useState, useEffect, useMemo } from "react";
import { Map, Source, Layer, Marker } from "@vis.gl/react-maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart2, Navigation } from "lucide-react";

const MAPTILER_API_KEY = "PSKKY9Cyh2izeQTNhuac";

const CITY_COORDS_PRESET = {
  "Mumbai": { latitude: 19.0760, longitude: 72.8777 },
  "Pune": { latitude: 18.5204, longitude: 73.8567 },
  "Nagpur": { latitude: 21.1458, longitude: 79.0882 },
  "Nashik": { latitude: 19.9975, longitude: 73.7898 },
  "Aurangabad": { latitude: 19.8762, longitude: 75.3433 },
  "Thane": { latitude: 19.2183, longitude: 72.9781 },
  "Solapur": { latitude: 17.6599, longitude: 75.9064 },
  "Amravati": { latitude: 20.9320, longitude: 77.7523 },
  "Nanded": { latitude: 19.1429, longitude: 77.3037 },
  "Kolhapur": { latitude: 16.7050, longitude: 74.2433 }
};

const BusinessMap = ({
  mapStyle = "dark",
  visibleLayers = {},
  locations: passedLocations = [],
  onStatsUpdate // Prop to send stats back to parent
}) => {
  const location = useLocation();

  // Consolidate location data source
  const locationsData = useMemo(() => {
    if (passedLocations && passedLocations.length > 0) return passedLocations.slice(0, 200);
    const fromState = location.state?.locations;
    if (fromState && fromState.length > 0) return fromState.slice(0, 200);
    try {
      const stored = localStorage.getItem("dashboardLocations");
      const parsed = stored ? JSON.parse(stored) : [];
      const data = Array.isArray(parsed) ? parsed : [];
      return data.slice(0, 200);
    } catch (e) {
      return [];
    }
  }, [passedLocations, location.state]);

  const [geoData, setGeoData] = useState([]);
  const [viewState, setViewState] = useState({
    longitude: 78.9629,
    latitude: 20.5937,
    zoom: 4.5,
  });
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [geocodedCount, setGeocodedCount] = useState(0);

  // Notify parent of stat changes
  useEffect(() => {
    if (onStatsUpdate) {
      const avgScore = locationsData.length > 0
        ? (locationsData.reduce((acc, curr) => acc + (parseFloat(curr.opportunity_score) || 0.5), 0) / locationsData.length)
        : 0;

      onStatsUpdate({
        totalHubs: locationsData.length,
        geocodedCount,
        isGeocoding,
        efficiencyQuotient: avgScore
      });
    }
  }, [locationsData, geocodedCount, isGeocoding, onStatsUpdate]);

  // Geocoding logic with caching and incremental updates
  useEffect(() => {
    const fetchCoordinates = async () => {
      setIsGeocoding(true);
      const uniqueCities = [...new Set(locationsData.map(loc => loc.City || loc.city))].filter(Boolean);
      let currentResults = [];

      for (const cityName of uniqueCities) {
        console.log(`Geocoding city: ${cityName}`);
        // 1. Check Pre-defined high-priority cache
        if (CITY_COORDS_PRESET[cityName]) {
          const coords = CITY_COORDS_PRESET[cityName];
          const nodes = locationsData
            .filter(loc => (loc.City || loc.city) === cityName)
            .map(loc => ({ ...loc, ...coords }));

          currentResults = [...currentResults, ...nodes];
          setGeoData([...currentResults]);
          setGeocodedCount(prev => prev + nodes.length);
          continue; // Skip Nominatim for preset cities
        }

        // 2. Fetch from Nominatim for unknown cities
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cityName)}`);
          if (!res.ok) throw new Error("Net Error");
          const data = await res.json();

          if (data && data.length > 0) {
            const coords = {
              latitude: parseFloat(data[0].lat),
              longitude: parseFloat(data[0].lon)
            };

            const newNodes = locationsData
              .filter(loc => (loc.City || loc.city) === cityName)
              .map(loc => ({ ...loc, ...coords }));

            currentResults = [...currentResults, ...newNodes];
            setGeoData([...currentResults]);
            setGeocodedCount(prev => prev + newNodes.length);
          }
        } catch (err) {
          console.error(`Error geocoding ${cityName}:`, err);
        }
        // Strict rate limit for Nominatim
        await new Promise(r => setTimeout(r, 1000));
      }

      setIsGeocoding(false);

      if (currentResults.length > 0) {
        const bounds = currentResults.reduce((acc, curr) => ({
          minLon: Math.min(acc.minLon, curr.longitude),
          maxLon: Math.max(acc.maxLon, curr.longitude),
          minLat: Math.min(acc.minLat, curr.latitude),
          maxLat: Math.max(acc.maxLat, curr.latitude)
        }), { minLon: 180, maxLon: -180, minLat: 90, maxLat: -90 });

        setViewState(prev => ({
          ...prev,
          longitude: (bounds.minLon + bounds.maxLon) / 2,
          latitude: (bounds.minLat + bounds.maxLat) / 2,
          zoom: currentResults.length < 5 ? 6 : 4.5
        }));
      }
    };

    if (locationsData.length > 0) {
      fetchCoordinates();
    }
  }, [locationsData]);

  const getMapStyleUrl = () => {
    const styles = {
      streets: `https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_API_KEY}`,
      hybrid: `https://api.maptiler.com/maps/hybrid/style.json?key=${MAPTILER_API_KEY}`,
      dataviz: `https://api.maptiler.com/maps/dataviz-dark/style.json?key=${MAPTILER_API_KEY}`,
      dark: `https://api.maptiler.com/maps/darkmatter/style.json?key=${MAPTILER_API_KEY}`,
    };
    return styles[mapStyle] || styles.dark;
  };

  const heatmapGeojson = useMemo(() => ({
    type: "FeatureCollection",
    features: geoData.map(loc => ({
      type: "Feature",
      geometry: { type: "Point", coordinates: [loc.longitude, loc.latitude] },
      properties: { score: parseFloat(loc.opportunity_score) || 0.5 }
    }))
  }), [geoData]);

  return (
    <div className="w-full h-screen relative bg-[#0a0a1a]">
      <Map
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        mapStyle={getMapStyleUrl()}
        style={{ width: "100%", height: "100%" }}
      >
        {/* Heatmap Layer */}
        {visibleLayers?.heatmap && geoData.length > 0 && (
          <Source id="heatmap-source" type="geojson" data={heatmapGeojson}>
            <Layer
              id="heatmap-layer"
              type="heatmap"
              paint={{
                "heatmap-weight": ["interpolate", ["linear"], ["get", "score"], 0, 0, 1, 1],
                "heatmap-intensity": 1.5,
                "heatmap-color": [
                  "interpolate", ["linear"], ["heatmap-density"],
                  0, "rgba(0,0,0,0)",
                  0.2, "rgba(34, 211, 238, 0.2)",
                  0.4, "rgba(34, 211, 238, 0.4)",
                  0.6, "rgba(99, 102, 241, 0.6)",
                  0.8, "rgba(168, 85, 247, 0.8)",
                  1, "rgba(236, 72, 153, 0.9)"
                ],
                "heatmap-radius": 35,
                "heatmap-opacity": 0.6,
              }}
            />
          </Source>
        )}

        {/* POI Simulation Layer */}
        {visibleLayers?.pois && geoData.length > 0 && (
          <Source id="pois-source" type="geojson" data={heatmapGeojson}>
            <Layer
              id="pois-dot"
              type="circle"
              paint={{
                "circle-radius": 4,
                "circle-color": "#fbbf24",
                "circle-opacity": 0.6,
                "circle-stroke-width": 1,
                "circle-stroke-color": "#fff"
              }}
            />
          </Source>
        )}

        {/* Tactical Markers */}
        <AnimatePresence>
          {geoData.map((loc, index) => {
            const score = parseFloat(loc.opportunity_score) || 0.5;
            const color = score >= 0.6 ? "#22d3ee" : score >= 0.3 ? "#fbbf24" : "#f43f5e";

            return (
              <Marker
                key={`${loc.City}-${loc.product_type}-${index}`}
                longitude={loc.longitude}
                latitude={loc.latitude}
                anchor="center"
              >
                <div className="relative group cursor-pointer">
                  {/* Pulse Effect */}
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: [1, 1.5], opacity: [0.2, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute inset-0 w-8 h-8 -translate-x-1/2 -translate-y-1/2 rounded-full border"
                    style={{ borderColor: color }}
                  />

                  {/* City Label - Hidden by default, smooth transition on hover */}
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-500 scale-90 group-hover:scale-100">
                    <div className="bg-black/90 backdrop-blur-xl px-4 py-1.5 rounded-full border border-white/20 shadow-2xl flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
                      <span className="text-[12px] font-black text-white uppercase tracking-widest leading-none">
                        {loc.City || loc.city}
                      </span>
                    </div>
                  </div>

                  <motion.div
                    initial={{ rotate: 180, scale: 0 }}
                    animate={{ rotate: 45, scale: 1 }}
                    whileHover={{ scale: 1.4, rotate: 45 }}
                    className="relative z-10 -translate-x-1/2 -translate-y-1/2"
                  >
                    <Navigation
                      size={16}
                      fill={color}
                      className="opacity-80 group-hover:opacity-100"
                      style={{ color: color, filter: `drop-shadow(0 0 8px ${color})` }}
                    />
                  </motion.div>

                  {/* Intelligence Card on Hover */}
                  <div className="absolute top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-50">
                    <div className="bg-slate-900/95 backdrop-blur-2xl border border-white/10 p-5 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] min-w-[220px]">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="text-white font-black text-sm uppercase tracking-tight">{loc.Area || "Strategic Zone"}</h4>
                          <p className="text-[9px] text-slate-500 font-black uppercase mt-0.5">{loc.District || "Intelligence Matrix"}</p>
                        </div>
                        <div className="px-2 py-1 rounded text-[10px] font-black" style={{ backgroundColor: `${color}20`, color }}>
                          {score.toFixed(2)}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-[9px] font-black text-slate-400 uppercase mb-1">
                            <span>Opportunity Index</span>
                            <span className="text-white">{Math.round(score * 100)}%</span>
                          </div>
                          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${score * 100}%` }}
                              className="h-full rounded-full"
                              style={{ backgroundColor: color }}
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-white/5">
                          <span className="text-[9px] font-black text-slate-500 uppercase">Sector</span>
                          <span className="text-[10px] font-black text-cyan-400 uppercase">{loc.product_type || "Generic"}</span>
                        </div>
                      </div>
                    </div>
                    {/* Tooltip Arrow */}
                    <div className="w-3 h-3 bg-slate-900/95 rotate-45 mx-auto -mt-1.5 border-l border-t border-white/10" />
                  </div>
                </div>
              </Marker>
            );
          })}
        </AnimatePresence>
      </Map>

    </div>
  );
};

export default BusinessMap;
