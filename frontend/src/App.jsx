import { Routes, Route, Outlet } from "react-router-dom";
import Home from "./pages/Home";
import Form from "./pages/Form";
import MapPage from "./pages/Map.jsx";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/dashboard/Dashboard";
import PredictionDashboard from "./pages/dashboard/PredictionDashboard";
import CityDashboard from "./pages/dashboard/CityDashboard";
import LocationDetails from "./pages/dashboard/LocationDetails";
import StrategyDashboard from "./components/StrategyDashboard";
import PrivateRoute from "./components/PrivateRoute";
import DashboardLayout from "./layouts/DashboardLayout";

function App() {
  return (
    <Routes>
      {/* Public Routes with Global Navbar and Padding Wrapper */}
      <Route element={
        <>
          <Navbar />
          <div className="pt-20 min-h-screen">
            <Outlet />
          </div>
        </>
      }>
        <Route path="/" element={<Home />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/form" element={<Form />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/strategy-dashboard"
          element={
            <PrivateRoute>
              <StrategyDashboard />
            </PrivateRoute>
          }
        />
      </Route>

      {/* Dashboard Route with Custom Layout */}
      <Route element={<DashboardLayout />}>
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/prediction-dashboard"
          element={
            <PrivateRoute>
              <PredictionDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/city-dashboard"
          element={
            <PrivateRoute>
              <CityDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/details"
          element={
            <PrivateRoute>
              <LocationDetails />
            </PrivateRoute>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
