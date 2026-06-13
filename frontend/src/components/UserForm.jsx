import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const UserForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    business_name: "",
    business_category: "",
    investment_max: "",
    target_customer: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:5000/api/predict_location", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        console.log(data);
        localStorage.setItem("activeDashboard", "prediction");
        navigate("/prediction-dashboard", { state: { locations: data } });
      } else {
        alert(data.message || "No suitable location found");
      }
    } catch (error) {
      alert("Error connecting to the backend");
    }
  };

  // const districts = [
  //   "Ahmednagar", "Akola", "Amravati", "Aurangabad", "Beed", "Chandrapur",
  //   "Dhule", "Gondia", "Jalgaon", "Jalna", "Kolhapur", "Latur",
  //   "Mumbai City", "Mumbai Suburban", "Nagpur", "Nanded", "Nandurbar",
  //   "Nashik", "Osmanabad", "Palghar", "Parbhani", "Pune", "Raigad",
  //   "Sangli", "Satara", "Solapur", "Thane", "Wardha", "Yavatmal"
  // ];

  return (
    <>
      {/* 🔹 Custom inline styles for number input arrows */}
      <style>{`
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          appearance: none;
          margin: 0;
        }

        input[type="number"] {
          position: relative;
        }

        input[type="number"]::after {
          content: "▲";
          position: absolute;
          right: 10px;
          top: 6px;
          font-size: 10px;
          color: #22d3ee; /* cyan-400 */
          pointer-events: none;
          opacity: 0.8;
        }

        input[type="number"]::before {
          content: "▼";
          position: absolute;
          right: 10px;
          bottom: 6px;
          font-size: 10px;
          color: #22d3ee;
          pointer-events: none;
          opacity: 0.8;
        }

        input[type="number"]:hover::after,
        input[type="number"]:hover::before {
          text-shadow: 0 0 6px rgba(34, 211, 238, 0.7);
          opacity: 1;
        }
      `}</style>

      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="w-full bg-transparent rounded-xl"
      >
        {/* Business Name */}
        <div className="relative mb-5 rounded-lg p-[1px] bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 shadow-lg shadow-cyan-500/20">
          <input
            type="text"
            name="business_name"
            value={formData.business_name}
            onChange={handleChange}
            required
            className="w-full bg-[#1a1f3c]/80 backdrop-blur-md text-cyan-100 border-none rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-gray-400"
            placeholder="Business Name"
          />
        </div>

        {/* Business Category */}
        <div className="relative mb-5 rounded-lg p-[1px] bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 shadow-lg shadow-cyan-500/20">
          <select
            name="business_category"
            value={formData.business_category}
            onChange={handleChange}
            required
            className="w-full appearance-none bg-[#1a1f3c]/80 backdrop-blur-md border-none text-cyan-100 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 cursor-pointer"
          >
            <option value="" className="bg-[#1a1f3c] text-cyan-200">
              Select Business Category
            </option>
            <option value="Bakery" className="bg-[#1a1f3c] text-cyan-200">
              Bakery
            </option>
            <option value="Cafe" className="bg-[#1a1f3c] text-cyan-200">
              Cafe
            </option>
            <option value="Shoe" className="bg-[#1a1f3c] text-cyan-200">
              Shoes
            </option>
            <option value="Watch" className="bg-[#1a1f3c] text-cyan-200">
              Watch
            </option>
          </select>
          <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-cyan-300">
            ▼
          </div>
        </div>

        {/* Investment Range */}
        <div className="flex gap-4 mb-5">
          <div className="relative w-full rounded-lg p-[1px] bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 shadow-lg shadow-cyan-500/20">
            <input
              type="number"
              name="investment_max"
              value={formData.investment_max}
              onChange={handleChange}
              required
              className="peer w-full bg-[#1a1f3c]/80 backdrop-blur-md text-cyan-100 border-none rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-gray-400"
              placeholder="Max Investment"
            />
          </div>
        </div>

        {/* Prefered Target_Customer  */}
        <div className="relative mb-5 rounded-lg p-[1px] bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 shadow-lg shadow-cyan-500/20">
          <select
            name="target_customer"
            value={formData.target_customer}
            onChange={handleChange}
            required
            className="w-full appearance-none bg-[#1a1f3c]/80 backdrop-blur-md border-none text-cyan-100 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 cursor-pointer"
          >
            <option value="" className="bg-[#1a1f3c] text-cyan-200">
              Target Customer
            </option>
            <option value="youth" className="bg-[#1a1f3c] text-cyan-200">
              Youth
            </option>
            <option value="male" className="bg-[#1a1f3c] text-cyan-200">
              Men
            </option>
            <option value="female" className="bg-[#1a1f3c] text-cyan-200">
              Women
            </option>
          </select>
          <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-cyan-300">
            ▼
          </div>
        </div>

        {/* Preferred District */}
        {/* <div className="relative mb-6 rounded-lg p-[1px] bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 shadow-lg shadow-cyan-500/20">
          <select
            name="preferred_district"
            value={formData.preferred_district}
            onChange={handleChange}
            required
            className="w-full appearance-none bg-[#1a1f3c]/80 backdrop-blur-md border-none text-cyan-100 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 cursor-pointer"
          >
            <option value="" className="bg-[#1a1f3c] text-cyan-200">
              Target Customer
            </option>
            {districts.map((district) => (
              <option
                key={district}
                value={district}
                className="bg-[#1a1f3c] text-cyan-200 hover:bg-[#243063]"
              >
                {district}
              </option>
            ))}
          </select>
          <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-cyan-300">
            ▼
          </div>
        </div> */}

        {/* Glowing Button */}
        <motion.button
          type="submit"
          whileHover={{
            scale: 1.05,
            boxShadow: "0 0 30px rgba(34,211,238,0.9)",
          }}
          whileTap={{ scale: 0.95 }}
          className="w-full py-3 mt-2 font-semibold text-gray-900 rounded-lg bg-gradient-to-r 
          from-cyan-400 via-blue-400 to-purple-400 hover:from-cyan-300 hover:to-purple-300 
          transition-all duration-300 shadow-lg shadow-cyan-500/30"
        >
          Predict Location
        </motion.button>
      </motion.form>
    </>
  );
};

export default UserForm;
