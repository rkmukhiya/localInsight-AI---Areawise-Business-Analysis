import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const CityDataForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    business_category: "",
    city: "",
    pincode: "",
  });

  const [loading, setLoading] = useState(false);
  const [citiesData, setCitiesData] = useState({});

  // ✅ Fetch cities + pincodes from backend
  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/cities")
      .then((res) => res.json())
      .then((data) => {
        setCitiesData(data);
      })
      .catch((err) => console.error("Error fetching cities:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "city") {
      setFormData({ ...formData, city: value, pincode: "" });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:5000/api/predict_city", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("activeDashboard", "city");
        navigate("/city-dashboard", { state: { locations: [data] } });
      } else {
        alert(`Prediction failed: ${data.error || "Unknown error"}`);
      }
    } catch (error) {
      alert("Failed to fetch prediction. Please check backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm z-50">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
            className="w-16 h-16 border-4 border-t-transparent border-cyan-400 rounded-full"
          />
          <p className="mt-6 text-cyan-300 text-lg font-medium">
            Evaluating city data...
          </p>
        </div>
      )}

      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="w-full bg-transparent rounded-xl max-w-lg mx-auto mt-10"
      >
        <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
          Evaluate City for Business
        </h2>

        {/* Business Category */}
        <div className="relative mb-5 rounded-lg p-[1px] bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 shadow-lg shadow-cyan-500/20">
          <select
            name="business_category"
            value={formData.business_category}
            onChange={handleChange}
            required
            className="w-full appearance-none bg-[#0f1535]/90 text-cyan-100 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
          >
            <option value="">Select Business Category</option>
            <option value="Bakery">Bakery</option>
            <option value="Cafe">Cafe</option>
            <option value="Shoe">Shoes</option>
            <option value="Watch">Watch</option>
          </select>
        </div>

        {/* City Dropdown */}
        <div className="relative mb-5 rounded-lg p-[1px] bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 shadow-lg shadow-cyan-500/20">
          <select
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
            className="w-full appearance-none bg-[#0f1535]/90 text-cyan-100 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
          >
            <option value="">Select City</option>
            {Object.keys(citiesData).map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* Pincode Dropdown */}
        <div className="relative mb-5 rounded-lg p-[1px] bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 shadow-lg shadow-cyan-500/20">
          <select
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
            required
            className="w-full appearance-none bg-[#0f1535]/90 text-cyan-100 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
          >
            <option value="">Select Pincode</option>
            {formData.city &&
              citiesData[formData.city]?.map((pin) => (
                <option key={pin} value={pin}>
                  {pin}
                </option>
              ))}
          </select>
        </div>

        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full py-3 font-semibold text-gray-900 rounded-lg bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400"
        >
          Evaluate City
        </motion.button>
      </motion.form>
    </>
  );
};

export default CityDataForm;
