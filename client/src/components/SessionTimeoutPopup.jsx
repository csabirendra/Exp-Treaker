import React, { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

const SessionTimeoutPopup = ({ onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => handleLogout(), 5000); // auto redirect after 5s
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token"); // clear token
    if (onClose) onClose();
    window.location.href = "/"; // redirect to login/landing
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 text-center shadow-lg animate-fadeIn w-80">
        <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-3 animate-pulse" />
        <h2 className="text-lg font-semibold text-gray-800">Session Timeout</h2>
        <p className="text-sm text-gray-600 mt-2">
          Your session has expired. You will be redirected shortly.
        </p>

        {/* Buttons */}
        <div className="mt-4 flex justify-center gap-3">
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-md text-sm hover:bg-red-600"
          >
            Logout Now
          </button>
        </div>
      </div>

      {/* Animation */}
      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default SessionTimeoutPopup;
