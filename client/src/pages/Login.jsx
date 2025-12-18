import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Lottie from "lottie-react";
import expenseAnimation from "../assets/animations/expense.json";
import logo from "../assets/Logo1.png";
import axiosInstance from "../config/api.js";
// import axiosInstance, { API_BASE_URL } from "../config/api.js";


export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axiosInstance.post("/api/auth/login", form);
      const data = res.data;

      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("USERID", data.user.USERID);
        localStorage.setItem("user", JSON.stringify(data.user));

        navigate("/dashboard");
      } else {
        alert(data.message || "Login failed ❌");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Server error, please try again!");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className=" w-100 flex flex-col md:flex-row min-h-screen">
      {/* Left Section - Branding + Animation */}
      <div className="hidden md:flex w-3/7 bg-slate-700 text-white flex-col items-center justify-start">
        <div className="w-full h-25 flex items-center justify-center gap-1">
          <div className="w-1/4 h-1/2 flex justify-center">
            <Link to="/" className="flex items-center">
              <img src={logo} alt="Brand Logo" className="w-32 md:w-40" />
            </Link>
          </div>
        </div>

        <div className="w-100 md:w-80 md:h-80 flex flex-col">
          <div className="w-75 h-75 mx-auto">
            <Lottie animationData={expenseAnimation} loop={true} />
          </div>
          <div className="w-100 p-3 text-center">
            <h2 className="text-xl md:text-3xl font-bold">Track Smarter, Spend Better</h2>
            <p className="mt-2 text-sm md:text-lg opacity-80">
              Manage your expenses effortlessly with our platform.
            </p>
          </div>
        </div>
      </div>

      {/* Right Section - Login Form */}
      <div className="flex w-full md:w-4/7 items-center justify-center bg-gray-50 p-6 bg-pattern">
        <div className="w-full max-w-100 bg-white rounded-2xl shadow-lg p-4 md:p-10">
          <h2 className="text-2xl md:text-3xl font-semibold text-center mb-2 text-gray-800">
            <span className="font-bold text-slate-700">LogIn to </span>
            <Link to="/" className="">
              <img src={logo} alt="Brand Logo" className="w-30 md:w-40 inline-block" />
            </Link>
          </h2>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="••••••••"
              />
            </div>

            <div className="text-right">
              <a href="/forgot-password" className="text-sm text-green-600 hover:underline">Forgot Password?</a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:bg-gray-400"
            >
              {loading ? "Loading..." : "Login"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-4">
            Don’t have an account?{" "}
            <a href="/signup" className="text-green-600 hover:underline">Sign Up</a>
          </p>
        </div>
      </div>
    </div>
  );
}
