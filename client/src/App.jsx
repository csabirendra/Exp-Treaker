import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SessionTimeoutPopup from "./components/SessionTimeoutPopup";

// pages...
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup_copy.jsx";
import OtpVerification from "./pages/OtpVerification.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import LandingPage from "./components/LandingPage.jsx";
import Dashboard from "./pages/Dashboard copy.jsx";
import Overview from "./pages/Dashboard/Overview.jsx";
import Transactions from "./pages/Dashboard/Transactions copy.jsx";
import Budget from "./pages/Dashboard/Budget.jsx";
import Profile from "./pages/Dashboard/Profile.jsx";
import Analytics from "./pages/Dashboard/Analytics.jsx";

import MainLayout from "./layouts/MainLayout.jsx";
import AuthLayout from "./layouts/AuthLayout.jsx";

export default function App() {
  const [sessionExpired, setSessionExpired] = useState(false);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/QuidFlow" replace />} />

        {/* Auth routes */}
        <Route
          path="/login"
          element={
            <AuthLayout>
              <Login />
            </AuthLayout>
          }
        />
        <Route
          path="/signup"
          element={
            <AuthLayout>
              <Signup />
            </AuthLayout>
          }
        />
        <Route
          path="/otp-verification"
          element={
            <AuthLayout>
              <OtpVerification />
            </AuthLayout>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <AuthLayout>
              <ForgotPassword />
            </AuthLayout>
          }
        />

        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="overview" element={<Overview />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="budget" element={<Budget />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Landing page */}
        <Route
          path="/QuidFlow"
          element={
            <MainLayout>
              <LandingPage />
            </MainLayout>
          }
        />

        {/* 404 */}
        <Route
          path="*"
          element={
            <div className="flex items-center justify-center h-screen bg-red-50">
              <h1 className="text-3xl font-bold text-red-600">
                404 - Page Not Found
              </h1>
            </div>
          }
        />
      </Routes>

      {/* ✅ Session Timeout Popup */}
      {sessionExpired && (
        <SessionTimeoutPopup onClose={() => setSessionExpired(false)} />
      )}

      <ToastContainer position="bottom-right" autoClose={3000} />
    </BrowserRouter>
  );
}
