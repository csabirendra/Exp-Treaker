import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";


export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    alert("Signup successful! Please verify OTP.");
    navigate("/otp-verification", { state: { email: form.email, phone: form.phone } });
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center vh-100"
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      <div
        className="card shadow-lg p-5"
        style={{
          width: "480px",
          borderRadius: "20px",
          background: "rgba(255, 255, 255, 0.85)",
          backdropFilter: "blur(10px)",
        }}
      >
        <div className="text-center mb-4">
          <i className="bi bi-person-plus-fill text-success" style={{ fontSize: "3rem" }}></i>
          <h2 className="fw-bold text-dark mt-2">Create Account</h2>
          <p className="text-muted">Join us to start managing your expenses smartly</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="form-floating mb-3">
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="form-control"
              id="name"
              placeholder="Full Name"
              required
            />
            <label htmlFor="name">Full Name</label>
          </div>

          {/* Email */}
          <div className="form-floating mb-3">
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="form-control"
              id="email"
              placeholder="Email"
              required
            />
            <label htmlFor="email">Email Address</label>
          </div>

          {/* Phone */}
          <div className="form-floating mb-3">
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="form-control"
              id="phone"
              placeholder="Phone"
              required
            />
            <label htmlFor="phone">Phone Number</label>
          </div>

          {/* Password */}
          <div className="form-floating mb-3">
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="form-control"
              id="password"
              placeholder="Password"
              required
            />
            <label htmlFor="password">Password</label>
          </div>

          {/* Confirm Password */}
          <div className="form-floating mb-3">
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              className="form-control"
              id="confirmPassword"
              placeholder="Confirm Password"
              required
            />
            <label htmlFor="confirmPassword">Confirm Password</label>
          </div>

          {/* Terms */}
          <div className="form-check mb-4">
            <input type="checkbox" className="form-check-input" id="terms" required />
            <label className="form-check-label text-muted" htmlFor="terms">
              I agree to the <Link to="/terms">Terms</Link> &{" "}
              <Link to="/privacy">Privacy Policy</Link>
            </label>
          </div>

          <button
            type="submit"
            className="btn btn-success w-100 fw-bold py-2"
            style={{ borderRadius: "10px", fontSize: "1.1rem" }}
          >
            Sign Up
          </button>
        </form>

        <p className="text-center mt-4 mb-0">
          Already have an account?{" "}
          <Link to="/login" className="fw-semibold text-primary">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
