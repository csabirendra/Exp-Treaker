import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";


export default function OtpVerification() {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("OTP verified!");
    navigate("/login");
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="card shadow p-4" style={{ width: "400px" }}>
        <h3 className="text-center mb-3 text-info">Verify OTP</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Enter OTP</label>
            <input
              type="text"
              maxLength="6"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="form-control text-center fs-4"
              placeholder="000000"
              required
            />
          </div>
          <button type="submit" className="btn btn-info w-100">
            Verify
          </button>
        </form>
        <p className="text-center mt-3">
          Didn’t get the OTP? <Link to="/signup">Resend</Link>
        </p>
      </div>
    </div>
  );
}
