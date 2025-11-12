import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Lottie from "lottie-react";
import expenseAnimation from "../assets/animations/expense.json";
import logo from "../assets/logo1.png";


export default function Signup() {
  const [step, setStep] = useState("form"); // "form" | "otp"
  const [form, setForm] = useState({
    fullname: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];


  // 🔹 Signup Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      const resp = await fetch("http://localhost:5002/api/auth/signup", {      
      // const resp = await fetch("http://loca:5002/api/auth/signup", {     //local mobile testing

        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      console.log("RAW response:", resp);

      const data = await resp.json();
      // .catch(() => ({}));
      console.log("Signup response:", data);

      if (data.success) {
        setStep("otp");
      } else {
        alert(data.message || "Signup failed ❌");
      }
    } catch (err) {
      console.error("Signup error:", err);
      alert("Server error, please try again!");
    } finally {
      setLoading(false);
    }

  };

  // 🔹 OTP Verify
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const resp = await fetch("http://localhost:5002/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, otp }),
      });

      const data = await resp.json();
      if (data.success) {
        localStorage.setItem("token", data.token);
        alert("OTP Verified !! ");
        navigate("/login");
      } else {
        alert(data.message || "Invalid OTP ❌");
      }
    } catch (err) {
      console.error("OTP Verify error:", err);
      alert("Server error, please try again!");
    } finally {
      setLoading(false);
    }
  };




  return (
    <div className="w-full flex flex-col md:flex-row min-h-screen">
      {/* Left Section */}
      <div className="hidden md:flex w-3/7 bg-slate-700 text-white flex-col items-center justify-start">
        <div className="w-full h-25 bg- flex items-center justify-center gap-1">
          <div className="w-1/4 h-1/2 flex justify-center bg">
            <Link to="/" className="flex items-center">
              <img src={logo} alt="Brand Logo" className="w-32 md:w-40" />
            </Link>
          </div>
        </div>

        <div className="w-100 bg h-75 md:w-80 md:h-80 d-flex flex-col">
          <div className="w-75 h-75 bg- mx-auto ">
            <Lottie animationData={expenseAnimation} loop={true} />
          </div>
          <div className="bg- w-100 h-25 d-flex flex-col p-3">
            <h2 className="text-xl md:text-3xl font-bold text-center">Track Smarter, Spend Better</h2>
            <p className="mt-2 text-sm md:text-lg opacity-80 text-center px-4">
              Manage your expenses effortlessly with our platform.
            </p>
          </div>
        </div>
      </div>



      {/* Right Section */}
      <div className="flex w-full md:w-4/7 items-center justify-center bg-gray-50 p-6">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 md:p-10">
          {step === "form" && (
            <>
              <h2 className="text-2xl md:text-3xl font-semibold text-center mb-2 text-gray-800">
                <span className="font-bold text-4 text-slate-700">Sign Up to </span>
                <Link to="/" className="">
                  <img src={logo} alt="Brand Logo" className="w-30 md:w-40" />
                </Link>
              </h2>

              <form onSubmit={handleSubmit} className="space-y-3">
                {/* Name */}
                <div>
                  <label className="block text-sm font-small text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullname"
                    value={form.fullname}
                    onChange={handleChange}
                    required
                    placeholder="John Doe"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="you@example.com"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    placeholder="9876543210"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    placeholder="••••••••"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    required
                    placeholder="••••••••"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>

                {/* Terms */}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <input type="checkbox" required />
                  <label>
                    I agree to the{" "}
                    <Link
                      to="/terms"
                      className="text-blue-600 hover:underline"
                    >
                      Terms
                    </Link>{" "}
                    &{" "}
                    <Link
                      to="/privacy"
                      className="text-blue-600 hover:underline"
                    >
                      Privacy Policy
                    </Link>
                  </label>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2 bg-blue-600 text-white border-none rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
                >
                  {loading ? "Signing up..." : "Sign Up"}
                </button>
              </form>

              <p className="text-center text-sm text-gray-600 mt-3 mb-0">
                Already have an account?{" "}
                <Link to="/login" className="text-blue-600 hover:underline text-decoration-none">Login</Link>
              </p>
            </>
          )}

          {step === "otp" && (
            <>
              <h2 className="text-xl md:text-2xl font-semibold text-center mb-6 text-gray-800 flex items-center justify-center gap-2">
                <span>Verify OTP</span>
              </h2>
              <p className="text-center text-gray-600 mb-4">
                Enter the OTP sent to <b>{form.email}</b>
              </p>

              <form onSubmit={handleOtpSubmit} className="space-y-3">
                <div>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    required
                    placeholder="Enter OTP"
                    className="w-full text-center px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 tracking-widest"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2 bg-blue-600 border-none text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </button>
              </form>

              <div className="flex justify-between mt-2">
                <button onClick={() => setStep("form")} className="text-green-600 hover:underline">
                  Change Details
                </button>
                <span className="text-sm text-gray-600">
                  Didn’t receive OTP?{" "}
                  <button type="button" className="text-green-600 hover:underline"
                    onClick={() => alert("Resend OTP API call here")}
                  >
                    Resend
                  </button>
                </span>
              </div>

            </>
          )}
        </div>
      </div>
    </div>
  );
}
