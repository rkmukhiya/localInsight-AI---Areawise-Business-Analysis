import React, { useState, useEffect } from "react";
import { Map, Source, Layer, Marker, Popup } from "@vis.gl/react-maplibre";
import "maplibre-gl/dist/maplibre-gl.css";

const MAPTILER_API_KEY = "PSKKY9Cyh2izeQTNhuac";

const DashboardMap = ({ locations = [] }) => {
  const [geoData, setGeoData] = useState([]);
  const [boundaryData, setBoundaryData] = useState(null);
  const [viewState, setViewState] = useState({
    longitude: 78.9629,
    latitude: 20.5937,
    zoom: 4,
  });
  const [hoverInfo, setHoverInfo] = useState(null);
  const [mapStyle, setMapStyle] = useState('dark');
  const [brandCounts, setBrandCounts] = useState({});

  useEffect(() => {
    const fetchCoordinates = async () => {
      const results = [];
      let cityBoundary = null;
      let brandStats = {};

      for (const loc of locations) {
        // --- YOUR LOGIC: Brand and Shop Extraction ---
        if (loc.market_analysis) {
          const { markers, brand_counts } = loc.market_analysis;
          brandStats = brand_counts;

          markers.forEach(shop => {
            results.push({
              ...shop,
              latitude: shop.lat,
              longitude: shop.lng,
              opportunity_score: loc.opportunity_score || 0.8,
              isShopMarker: true 
            });
          });
        }

        // --- TEAMMATE LOGIC: Boundary and GeoJSON Fetch ---
        const cityQuery = loc.City || loc.city || "";
        const pinQuery = loc.pincode || "";
        const finalQuery = pinQuery ? `${pinQuery}, ${cityQuery}` : cityQuery;
        
        if (!finalQuery) continue;

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&polygon_geojson=1&q=${encodeURIComponent(finalQuery)}`
          );
          const data = await res.json();

          if (data && data.length > 0) {
            const firstResult = data[0];
            
            // If no shop markers were found in market_analysis, use city center
            if (!loc.market_analysis || results.length === 0) {
              results.push({
                ...loc,
                latitude: parseFloat(firstResult.lat),
                longitude: parseFloat(firstResult.lon),
              });
            }

            // Set boundary logic from teammate
            if (firstResult.geojson && !cityBoundary) {
              cityBoundary = {
                type: "Feature",
                geometry: firstResult.geojson,
                properties: { name: finalQuery }
              };
            }
          }
        } catch (err) {
          console.error(`Fetch error:`, err);
        }
        // Rate limiting for Nominatim
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      setGeoData(results);
      setBoundaryData(cityBoundary);
      setBrandCounts(brandStats);

      if (results.length > 0) {
        setViewState(prev => ({
          ...prev,
          longitude: results[0].longitude,
          latitude: results[0].latitude,
          zoom: 12 
        }));
      }
    };

    if (locations.length > 0) fetchCoordinates();
  }, [locations]);

  const getMapStyleUrl = () => {
    const styles = {
      streets: `https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_API_KEY}`,
      dark: `https://api.maptiler.com/maps/darkmatter/style.json?key=${MAPTILER_API_KEY}`,
      satellite: `https://api.maptiler.com/maps/satellite/style.json?key=${MAPTILER_API_KEY}`,
    };
    return styles[mapStyle] || styles.dark;
  };

  const getMetricVisuals = (score) => {
    const s = parseFloat(score) || 0;
    if (s >= 0.6) return { color: "#4ade80" };
    if (s >= 0.3) return { color: "#facc15" };
    return { color: "#f87171" };
  };

  return (
    <div className="w-full h-full min-h-[550px] relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-[#0a0a0a]">
      
      {/* 1. LEFT: Opportunity Legend */}
      <div className="absolute top-6 left-6 z-30 bg-black/60 backdrop-blur-xl p-4 rounded-2xl border border-white/10 text-white shadow-2xl pointer-events-auto">
        <h3 className="font-bold text-[10px] uppercase tracking-widest text-slate-400 mb-3 border-b border-white/5 pb-2">Analysis Score</h3>
        <div className="space-y-2.5">
          <div className="flex items-center gap-3 text-[11px]"><div className="w-2.5 h-2.5 bg-green-400 rounded-full"></div><span>High Potential</span></div>
          <div className="flex items-center gap-3 text-[11px]"><div className="w-2.5 h-2.5 bg-yellow-400 rounded-full"></div><span>Mid Market</span></div>
          <div className="flex items-center gap-3 text-[11px]"><div className="w-2.5 h-2.5 bg-red-400 rounded-full"></div><span>Low Potential</span></div>
        </div>
      </div>

      {/* 2. RIGHT: Brand Clusters */}
      {Object.keys(brandCounts).length > 0 && (
        <div className="absolute top-6 right-6 z-30 bg-black/60 backdrop-blur-xl p-4 rounded-2xl border border-white/10 text-white shadow-2xl w-44 pointer-events-auto">
          <h3 className="font-bold text-[10px] uppercase tracking-widest text-indigo-400 mb-3 border-b border-white/5 pb-2">Competitors</h3>
          <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 no-scrollbar">
            {Object.entries(brandCounts).map(([brand, count]) => (
              <div key={brand} className="flex justify-between items-center text-[11px]">
                <span className="opacity-70 truncate pr-2">{brand}</span>
                <span className="bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-md font-mono font-bold">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. BOTTOM: Map Style Switcher (Resolved Conflict Position) */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 bg-black/80 backdrop-blur-2xl p-1.5 rounded-2xl border border-white/20 shadow-2xl flex gap-1 items-center">
        {['dark', 'streets', 'satellite'].map(id => (
          <button
            key={id}
            onClick={() => setMapStyle(id)}
            className={`px-4 py-2 rounded-xl text-[11px] font-bold transition-all ${
              mapStyle === id ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            {id.toUpperCase()}
          </button>
        ))}
      </div>

      <Map 
        {...viewState} 
        onMove={(evt) => setViewState(evt.viewState)} 
        mapStyle={getMapStyleUrl()} 
        style={{ width: "100%", height: "100%" }}
      >
        {boundaryData && (
          <Source type="geojson" data={boundaryData}>
            <Layer id="city-fill" type="fill" paint={{ "fill-color": "#ef4444", "fill-opacity": 0.05 }} />
            <Layer id="city-line" type="line" paint={{ "line-color": "#ef4444", "line-width": 2, "line-dasharray": [2, 1] }} />
          </Source>
        )}

        {geoData.map((loc, index) => {
          const visuals = getMetricVisuals(loc.opportunity_score);
          return (
            <Marker key={index} longitude={loc.longitude} latitude={loc.latitude} anchor="bottom" onClick={e => { e.originalEvent.stopPropagation(); setHoverInfo(loc); }}>
              <div className="relative cursor-pointer group">
                <svg width="30" height="30" viewBox="0 0 24 24" fill={loc.isShopMarker ? "#6366f1" : visuals.color} stroke="white" strokeWidth="2" className="drop-shadow-lg transition-transform group-hover:scale-110">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                </svg>
              </div>
            </Marker>
          );
        })}

        {hoverInfo && (
  <Popup
    longitude={hoverInfo.longitude}
    latitude={hoverInfo.latitude}
    anchor="top"
    onClose={() => setHoverInfo(null)}
    closeButton={false}
    offset={12}
  >
    <div className="p-0 min-w-[200px] max-w-[220px] bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100">
      {/* Optimized Image Logic */}
      <div className="w-full h-24 bg-gray-100 relative">
        {hoverInfo.thumbnail ? (
          <img 
            src={hoverInfo.thumbnail} 
            alt={hoverInfo.title} 
            loading="lazy" // Browsers prioritize loading visible images
            className="w-full h-full object-cover transition-opacity duration-300 opacity-0"
            onLoad={(e) => e.target.classList.remove('opacity-0')} // Only show once loaded
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/400x300?text=No+Preview";
              e.target.classList.remove('opacity-0');
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">
            No Image Available
          </div>
        )}
      </div>
      
      <div className="p-3">
        <h3 className="font-bold text-gray-900 text-sm leading-tight mb-1">
          {hoverInfo.title || hoverInfo.brand || hoverInfo.City}
        </h3>
        
        {hoverInfo.brand && (
          <span className="text-[9px] font-black uppercase text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-md mb-2 inline-block">
            Competitor
          </span>
        )}

        <div className="flex items-center gap-2 mt-1">
          <span className="text-[10px] font-bold text-gray-600">
            {hoverInfo.rating ? `${hoverInfo.rating} ★` : 'N/A'}
          </span>
          {hoverInfo.reviews_count && (
            <span className="text-[9px] text-gray-400">({hoverInfo.reviews_count})</span>
          )}
        </div>

        <p className="text-[9px] text-gray-400 mt-2 line-clamp-2">{hoverInfo.address}</p>

        {hoverInfo.link && (
          <a
            href={hoverInfo.link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 block w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold py-2 rounded-lg transition-colors no-underline cursor-pointer"
          >
            View on Google Maps
          </a>
        )}
      </div>
    </div>
  </Popup>
)}
      </Map>
    </div>
  );
};

export default DashboardMap;