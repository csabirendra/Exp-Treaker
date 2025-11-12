import React, { useState } from "react";
import { Trash2, CheckCircle } from "lucide-react";
import PasswordInput from "../../utils/PasswordInput";

const DeleteAccountModal = ({ isOpen, onClose }) => {
  const [confirmChecked, setConfirmChecked] = useState(false);
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [progressStep, setProgressStep] = useState(0);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setError("");
    setLoading(true);
    setProgressStep(1);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5002/api/user/deactivate", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password, confirmDelete: true }),
      });

      const data = await res.json();

      if (!data.success) {
        setLoading(false);
        setError(data.message || "Invalid password!");
        return;
      }

      // ✅ Agar password sahi hai toh fake timeline continue karega
      setTimeout(() => setProgressStep(2), 2000);
      setTimeout(() => setProgressStep(3), 5000);

      setTimeout(() => {
        setLoading(false);
        setSuccess(true);
        localStorage.removeItem("token"); // logout

        setTimeout(() => {
          setSuccess(false);
          window.location.href = "/";
        }, 4000);
      }, 8000);

    } catch (err) {
      console.error("API error:", err);
      setLoading(false);
      setError("Something went wrong!");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-end md:items-center">
      {/* ✅ Mobile Bottom Sheet */}
      <div className="w-full md:hidden bg-gray-800 rounded-t-2xl shadow-lg p-4 animate-slideUp">
        <div className="flex justify-start items-center gap-2 mb-4 rounded-lg">
          <Trash2 className="text-red-600 w-10 h-10" />
          <h2 className="font-semibold text-red-500 fs-5 my-auto">Delete Account</h2>
        </div>

        {!loading && !success && (
          <>
            <p className="text-sm text-gray-200 mb-3">
              ⚠️ Deleting  account is <span className="text-red-500 font-medium font-bold">permanent</span>. 
              All your data will be lost and cannot be recovered again.<br/>Please confirm your password to continue.
            </p>

            <PasswordInput
              label="Password"
              className="bg-gray-700 text-gray-400"
              placeholder="Enter Password*"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}

            <div className="flex items-center my-4">
              <input
                id="confirmDeleteMob"
                type="checkbox"
                checked={confirmChecked}
                onChange={(e) => setConfirmChecked(e.target.checked)}
                className="h-4 w-4 bg-red text-red-600 border-gray-300 rounded"
              />
              <label htmlFor="confirmDeleteMob" className="ml-2 text-sm text-gray-400">
                I understand my account will be permanently deleted.
              </label>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={onClose}
                className="px-3 py-1 bg-gray-900 border-none text-gray-300 rounded-md text-sm transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={!confirmChecked || !password}
                className={`px-3 py-1 bg-red-400 hover:bg-red-900 transition border-none text-sm text-white rounded-md ${
                  confirmChecked && password ? "bg-red-600" : "bg-red-300 cursor-not-allowed"
                }`}
              >
                Yes, Delete
              </button>
            </div>
          </>
        )}

        {loading && !success && (
          <div className="py-3 text-sm space-y-2">
            <p className="font-medium text-gray-700">Processing...</p>
            <p className={progressStep >= 1 ? "text-green-600" : "text-gray-400"}>🔐 Verifying password...</p>
            <p className={progressStep >= 2 ? "text-green-600" : "text-gray-400"}>📦 Moving data...</p>
            <p className={progressStep >= 3 ? "text-green-600" : "text-gray-400"}>🗑️ Deleting...</p>
          </div>
        )}

        {success && (
          <div className="text-center py-5">
            <CheckCircle className="text-green-600 w-10 h-10 mx-auto mb-2 animate-bounce" />
            <p className="text-green-600 font-medium text-sm">Deleted successfully!</p>
          </div>
        )}
      </div>

      {/* ✅ Desktop Center Modal */}
      <div className="hidden md:block bg-gray-800 w-full max-w-md rounded-xl shadow-lg p-3 animate-fadeIn">
        <div className="flex justify-start items-center gap-2 mb-3">
          <Trash2 className="text-red-600 w-6 h-6" />
          <h2 className="text-lg font-semibold my-auto text-gray-200">Delete Account</h2>
        </div>

        {!loading && !success && (
          <>
            <p className="text-sm text-gray-200 mb-3 text-justify">
              ⚠️Deleting  account is <span className="text-red-500 font-medium font-bold">permanent</span> process. 
              All your data will be lost and cannot be recovered again. Please confirm your password to continue.
            </p>

            <PasswordInput
              label="Password"
              placeholder="Confirm password"
              className="border-none outline-none bg-gray-700 text-gray-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}

            <div className="flex items-center my-4">
              <input
                id="confirmDeleteDesk"
                type="checkbox"
                checked={confirmChecked}
                onChange={(e) => setConfirmChecked(e.target.checked)}
                className="h-4 w-4 text-red-600 border-gray-300 rounded"
              />
              <label htmlFor="confirmDeleteDesk" className="ml-2 text-sm text-gray-300">
                I understand my account will be permanently deleted.
              </label>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-2 py-2 bg-transparent border-none text-gray-300 rounded-md text-sm transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={!confirmChecked || !password}
                className={`px-4 py-2 text-sm text-white bg-red-300 border-none transition rounded-md ${
                  confirmChecked && password ? "bg-red-500 hover:bg-red-900" : "bg-red-200 cursor-not-allowed"
                }`}
              >
                Yes, Delete
              </button>
            </div>
          </>
        )}

        {loading && !success && (
          <div className="py-4 space-y-2 text-sm">
            <p className="font-medium text-gray-700">Processing request...</p>
            <ul className="space-y-1">
              <li className={progressStep >= 1 ? "text-green-600" : "text-gray-400"}>🔐 Verifying password</li>
              <li className={progressStep >= 2 ? "text-green-600" : "text-gray-400"}>📦 Moving logs</li>
              <li className={progressStep >= 3 ? "text-green-600" : "text-gray-400"}>🗑️ Deleting account</li>
            </ul>
          </div>
        )}

        {success && (
          <div className="flex flex-col items-center text-center py-6">
            <CheckCircle className="text-green-600 w-12 h-12 mb-2 animate-bounce" />
            <p className="text-green-600 font-medium">Account deleted!</p>
            <p className="text-gray-500 text-sm">Redirecting...</p>
          </div>
        )}
      </div>

      {/* Animations */}
      <style jsx>{`
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default DeleteAccountModal;
