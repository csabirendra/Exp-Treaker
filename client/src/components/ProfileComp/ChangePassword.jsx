import React, { useState } from "react";
import { Lock, CheckCircle, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PasswordInput from "../../utils/PasswordInput";

const ChangePasswordAccordion = () => {
  const [open, setOpen] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [successPopup, setSuccessPopup] = useState(false);
  const [strength, setStrength] = useState("weak");

  // ✅ Password Strength Logic
  const checkStrength = (pwd) => {
    if (pwd.length < 6) return "weak";
    if (/[A-Z]/.test(pwd) && /[0-9]/.test(pwd)) return "medium";
    if (/[^A-Za-z0-9]/.test(pwd) && pwd.length >= 8) return "strong";
    return "weak";
  };

  const handleNewPassword = (e) => {
    const value = e.target.value;
    setNewPassword(value);
    setStrength(checkStrength(value));
  };

  // ✅ Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5002/api/user/update-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          OLD_PASSWORD: oldPassword,
          NEW_PASSWORD: newPassword,
          CONFIRM_PASSWORD: confirmNewPassword,
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (data.success) {
        setSuccessPopup(true);
        setTimeout(() => {
          setSuccessPopup(false);
          localStorage.removeItem("token"); // logout
          window.location.href = "/"; // redirect to login/landing
        }, 3000);
      } else {
        alert(data.message || "Password update failed!");
      }
    } catch (err) {
      console.error("Error updating password:", err);
      setLoading(false);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="bg-gray-900 md:bg-gray-800 rounded-lg mb-3 relative">
      {/* Accordion Header */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full bg-gray-900 md:bg-gray-900 border-none rounded-lg flex justify-between items-center px-4 py-2 text-left font-semibold"
      >
        <span className="flex items-center gap-1 text-gray-300 md:text-gray-300">
          <Lock className="w-5 h-5 text-gray-400 md:text-gray-300" />
          Change Password
        </span>
        {open ? <ChevronUp className="w-5 h-5 text-light" /> : <ChevronDown className="w-5 h-5 text-light" />}
      </button>

      {/* Accordion Body */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 1 }}
            exit={{ scaleY: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            style={{ originY: 0 }}
            className="px-4 pb-3 overflow-hidden"
          >
            {/* ✅ Password Strength Meter (PC only) */}
            <div className="h-1 mt-2 rounded bg-gray-200 hidden md:flex">
              <div
                className={`h-1 ${
                  strength === "weak"
                    ? "bg-red-400 w-1/3"
                    : strength === "medium"
                    ? "bg-yellow-400 w-2/3"
                    : "bg-green-500 w-full"
                }`}
              ></div>
            </div>

            {/* ✅ PC View */}
            <form
              onSubmit={handleSubmit}
              className="hidden md:grid grid-cols-4 gap-3 mt-4 items-end"
            >
              <PasswordInput
                label="Old Password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
              />

              <PasswordInput
                label="New Password"
                value={newPassword}
                onChange={handleNewPassword}
                required
              />

              <PasswordInput
                label="Confirm Password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                required
              />

              <div className="flex flex-col gap-2 items-start">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-1/2 py-1 border-none text-sm text-white rounded ${
                    loading
                      ? "bg-gray-500"
                      : "bg-green-600 hover:bg-green-700 transition"
                  }`}
                >
                  {loading ? "Updating..." : "Update"}
                </button>
              </div>
            </form>



            {/* ✅ Mobile View */}
            <form
              onSubmit={handleSubmit}
              className="md:hidden flex flex-col gap-3 mt-4"
            >
              <PasswordInput
                placeholder="Old Password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
                dark
              />

              <PasswordInput
                placeholder="New Password"
                value={newPassword}
                onChange={handleNewPassword}
                required
                dark
              />

              <PasswordInput
                placeholder="Confirm Password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                required
                dark
              />

              {/* Strength Meter (Mobile) */}
              <div className="h-1 mt-1 rounded bg-gray-200">
                <div
                  className={`h-1 ${
                    strength === "weak"
                      ? "bg-red-400 w-1/5"
                      : strength === "medium"
                      ? "bg-yellow-400 w-3/5"
                      : "bg-green-500 w-full"
                  }`}
                ></div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-auto py-1 px-3 border-none rounded-md text-sm text-white ${
                    loading
                      ? "bg-gray-400"
                      : "bg-green-500 hover:bg-green-700 transition"
                  }`}
                >
                  {loading ? "Updating..." : "Update"}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✅ Success Popup */}
      {successPopup && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 py-3 rounded-lg z-50">
          <CheckCircle className="text-green-400 w-10 h-10 mb-2 animate-bounce" />
          <p className="text-green-300 font-semibold">Password Updated!</p>
          <p className="text-gray-300 text-xs">Redirecting to LoginPage...</p>
        </div>
      )}
    </div>
  );
};

export default ChangePasswordAccordion;
