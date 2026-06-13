import React, { useState } from "react";
import UserForm from "../components/UserForm";
import CityDataForm from "../components/CityDataForm";

const Form = () => {
  const [activeTab, setActiveTab] = useState("user");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black via-indigo-950 to-black p-8 text-white px-6">
      <div className="w-full max-w-5xl bg-white/5 backdrop-blur-md rounded-2xl border border-cyan-400/20 p-10 shadow-lg shadow-cyan-900/40">
        <h2 className="text-4xl font-bold text-center mb-10 tracking-wide">
          Business Form
        </h2>

        {/* Tab Buttons */}
        <div className="flex rounded-lg mb-10 overflow-hidden border border-cyan-400/30">
          <button
            onClick={() => setActiveTab("user")}
            className={`flex-1 py-3 font-medium text-lg transition-all duration-300 ${
              activeTab === "user"
                ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
                : "text-cyan-300 bg-transparent hover:bg-cyan-600/20"
            }`}
          >
            Predict Location
          </button>
          <button
            onClick={() => setActiveTab("city")}
            className={`flex-1 py-3 font-medium text-lg transition-all duration-300 ${
              activeTab === "city"
                ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
                : "text-cyan-300 bg-transparent hover:bg-cyan-600/20"
            }`}
          >
            Evaluate City
          </button>
        </div>

        {/* Form Content */}
        <div className="w-full transition-all duration-500">
          {activeTab === "user" ? <UserForm /> : <CityDataForm />}
        </div>
      </div>
    </div>
  );
};

export default Form;
