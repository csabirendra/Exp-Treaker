import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FaMobileAlt,
  FaMoneyCheckAlt,
  FaChartLine,
  FaUsers,
} from "react-icons/fa";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {/* Hero Section */}
      <div className="w-full flex flex-col md:flex-row items-center justify-between px-10 md:px-20 py-12">
        {/* Left Content */}
        <div className="text-center md:text-left max-w-xl">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight text-center p-3" style={{background: "linear-gradient(120deg, #3de097ff 0%, #00f2fe 100%)",WebkitBackgroundClip: "text",WebkitTextFillColor: "transparent"}}>
            Your financial well-being, simplified !
          </h1><br />

            {/* <h2 className="text-4xl md:text-5xl font-bold text-gray-200 leading-tight">Save More,</h2>
            <h3 className="text-4xl md:text-5xl font-bold text-gray-200 leading-tight">Track Less.</h3><br/> */}
          <p className="mt-4 text-lg text-gray-600">
            Smart payment solutions built to work for your business 🚀
          </p>
          {/* <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <button
              onClick={() => navigate("/login")}
              className="px-6 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition shadow-lg"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="px-6 py-3 rounded-xl bg-gray-200 hover:bg-gray-300 transition shadow-md"
            >
              Sign Up
            </button>
          </div> */}
        </div>

        {/* Right Content (Animated Phone / Icons) */}
        <motion.div
          className="mt-10 md:mt-0"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="relative w-72 h-72 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-200 to-green-200 shadow-2xl">
            <motion.div
              className="absolute -top-6 left-10 bg-white p-4 rounded-xl shadow-lg"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <FaMobileAlt className="text-3xl text-blue-600" />
            </motion.div>
            <motion.div
              className="absolute top-12 -left-6 bg-white p-4 rounded-xl shadow-lg"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <FaMoneyCheckAlt className="text-3xl text-green-600" />
            </motion.div>
            <motion.div
              className="absolute -bottom-6 left-12 bg-white p-4 rounded-xl shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <FaChartLine className="text-3xl text-purple-600" />
            </motion.div>
            <motion.div
              className="absolute top-6 -right-8 bg-white p-4 rounded-xl shadow-lg"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 }}
            >
              <FaUsers className="text-3xl text-red-600" />
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Footer Logos / Clients */}
      <div className="w-full px-6 py-8 flex flex-wrap justify-center gap-8 text-gray-500">
        <a href="" className="text-dark text-decoration-none opacity-75 hover-opacity-100">Netflix</a>
        <a href="" className="text-dark text-decoration-none opacity-75 hover-opacity-100">Airbnb</a>
        <a href="" className="text-dark text-decoration-none opacity-75 hover-opacity-100">Uber</a>
        <a href="" className="text-dark text-decoration-none opacity-75 hover-opacity-100">Ola</a>
        <a href="" className="text-dark text-decoration-none opacity-75 hover-opacity-100">Myntra</a>
      </div>
    </div>
  );
};

export default LandingPage;
