import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import { notify } from "../utils/notify";  // 🔹 Custom notifier

// 🎨 Animations
import mailAnimation from "../assets/animations/forgot.json";
import successAnimation from "../assets/animations/success.json";

// ✅ Frame wrapper (Laptop on PC, Phone on Mobile)
const FrameWrapper = ({ children }) => (
  <div className="flex items-center justify-center min-h-screen bg-light p-1">
    {/* Laptop (PC view) */}
    <div className="hidden md:flex w-[500px] h-[500px] rounded-2xl border-2 bg-white shadow-2xl items-center justify-center">
      <div className="w-[75%] h-[90%] bg-white rounded-xl p-2 overflow-y-auto">
        {children}
      </div>
    </div>

    {/* Phone (Mobile view) */}
    <div className="flex md:hidden w-[360px] h-[720px] rounded-[40px] border-4 border-gray-700 bg-black shadow-xl items-center justify-center">
      <div className="w-[90%] h-[90%] bg-white rounded-xl p-6 overflow-y-auto">
        {children}
      </div>
    </div>
  </div>
);

export default function ForgotPassword() {
  const [step, setStep] = useState("email"); // email | otp | reset | success
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [passwords, setPasswords] = useState({ new: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Step 1: Send OTP
  const handleSendOtp = async () => {
    if (!email) return notify("error", "Enter your email!");
    setLoading(true);
    try {
      const resp = await fetch("http://localhost:5002/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await resp.json();
      if (data.success) {
        notify("success", data.message);
        setStep("otp");
        if (data.otpcode) notify("info", `Testing OTP: ${data.otpcode}`); // ⚠️ Testing only
      } else {
        notify("error", data.message || "Something went wrong");
      }
    } catch {
      notify("error", "Server error!");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) return notify("error", "Enter complete 6-digit OTP!");
    setLoading(true);
    try {
      const resp = await fetch("http://localhost:5002/api/auth/verify-reset-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await resp.json();
      if (data.success) {
        notify("success", "OTP Verified ✅");
        setStep("reset");
      } else {
        notify("error", data.message || "Invalid OTP ❌");
      }
    } catch {
      notify("error", "Server error!");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async () => {
    if (!passwords.new || !passwords.confirm) return notify("error", "All fields required!");
    if (passwords.new !== passwords.confirm) return notify("error", "Passwords do not match!");

    setLoading(true);
    try {
      const resp = await fetch("http://localhost:5002/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          newPassword: passwords.new,
          confirmPassword: passwords.confirm,
        }),
      });
      const data = await resp.json();
      if (data.success) {
        notify("success", "Password reset successful ✅");
        setStep("success");
        setEmail("");
        setPasswords({ new: "", confirm: "" });
        setOtp("");
      } else {
        notify("error", data.message || "Reset failed ❌");
      }
    } catch {
      notify("error", "Server error!");
    } finally {
      setLoading(false);
    }
  };

  // Auto redirect on success
  useEffect(() => {
    if (step === "success") {
      const timer = setTimeout(() => navigate("/login"), 2500);
      return () => clearTimeout(timer);
    }
  }, [step, navigate]);

  return (
    <FrameWrapper>
      <div className="flex flex-col items-center p-0">
        {/* 🔹 Animation on top */}
        {step !== "success" && (
          <Lottie animationData={mailAnimation} loop className="w-50 h-40 mb-2" />
        )}

        {/* Email Step */}
        {step === "email" && (
          <>
            <h2 className="text-2xl font-semibold text-center mb-6">Forgot Password?</h2>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg mb-4 focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSendOtp}
              disabled={loading}
              className="w-full py-2 bg-blue-600 text-white border-none rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
            <hr className="w-50 mb-2" />
            <button 
              onClick={() => navigate("/login")}
              className="border-none bg-white text-gray-700"
            >
              Go Back
            </button>
          </>
        )}

        {/* OTP Step */}
        {step === "otp" && (
          <>
            <h2 className="text-2xl font-semibold text-center mb-6">Verify OTP</h2>
            <input
              type="text"
              value={otp}
              maxLength="6"
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              placeholder="Enter 6-digit OTP"
              className="w-full text-center px-3 py-2 border rounded-lg text-lg tracking-widest mb-4 focus:ring-2 focus:ring-green-500"
            />
            <button
              onClick={handleVerifyOtp}
              disabled={loading}
              className="w-full py-2 bg-green-600 text-white border-none rounded-lg hover:bg-green-700 transition disabled:bg-gray-400"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </>
        )}

        {/* Reset Step */}
        {step === "reset" && (
          <>
            <h2 className="text-2xl font-semibold text-center mb-6">Reset Password</h2>
            <input
              type="password"
              placeholder="New Password"
              value={passwords.new}
              onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg mb-3 focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={passwords.confirm}
              onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg mb-4 focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={handleResetPassword}
              disabled={loading}
              className="w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:bg-gray-400"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </>
        )}

        {/* Success Step */}
        {step === "success" && (
          <div className="flex flex-col items-center text-center">
            <Lottie animationData={successAnimation} loop={false} className="w-40 h-40 mb-4" />
            <h2 className="text-xl font-bold text-green-600">Password Reset Successful 🎉</h2>
            <p className="text-gray-600 mt-2">Redirecting to login...</p>
          </div>
        )}
      </div>
    </FrameWrapper>
  );
}
