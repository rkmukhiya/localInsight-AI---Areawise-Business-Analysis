import React, { useEffect } from "react";
import DashboardMap from "../../components/DashboardMap.jsx";
import LocationAnalysisCard from "../../components/LocationAnalysisCard.jsx";
import CollaboratedInsights from "../../components/CollaboratedInsights.jsx";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth.jsx";

function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleGoToMap = () => {
    navigate("/map");
  };

  // Get initial locations from either location.state or localStorage
  const storedLocations = JSON.parse(localStorage.getItem("dashboardLocations")) || [];
  const locations = location.state?.locations || storedLocations;

  // If new data comes from navigation (i.e., after prediction), update localStorage
  useEffect(() => {
    if (location.state?.locations && location.state.locations.length > 0) {
      localStorage.setItem("dashboardLocations", JSON.stringify(location.state.locations));
    }
  }, [location.state]);

  // Handle Map View if needed (now inline)

  // Sort for Top 3
  const topLocations = [...locations]
    .sort((a, b) => (parseFloat(b.opportunity_score) || 0) - (parseFloat(a.opportunity_score) || 0))
    .slice(0, 3);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      {/* <Sidebar /> */}

      {/* Main Content */}
      <main className="flex-1 bg-gradient-to-br from-black via-indigo-950 to-black p-8">
        <h1 className="text-3xl font-semibold text-gray-300">
          Welcome {currentUser?.displayName || "User"}!
        </h1>

        {/* Button to go to map */}
        <div className="mt-4">
          <button
            onClick={handleGoToMap}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium px-6 py-3 rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            View All Locations on Map
          </button>
        </div>

        {/* Locations Grid */}
        {locations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {locations.map((loc, index) => (
              <LocationAnalysisCard key={index} data={loc} />
            ))}
          </div>
        ) : (
          <p className="mt-6 text-gray-500">No location data available yet.</p>
        )}
      </main>
    </div>
  );
}

export default Dashboard;
