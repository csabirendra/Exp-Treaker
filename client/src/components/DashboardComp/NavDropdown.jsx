
// src/components/NavDropdown.jsx

import React, { useState, useEffect, useRef } from "react";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NavDropdown = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const avatarRef = useRef(null);

  // Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (avatarRef.current && !avatarRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div ref={avatarRef} className="relative select-none">
      {/* User Info */}
      <div className="flex flex-col items-end leading-tight">
        <span className="text-sm font-semibold text-slate-300 capitalize">
          Welcome, {user.fullname?.split(" ")[0]} !
        </span>
        <span className="text-xs text-green-600">{user.email}</span>
      </div>

      {/* Avatar */}
      <div
        className="h-10 w-10 rounded-full bg-green-800 flex items-center justify-center font-semibold text-white shadow-md cursor-pointer mt-1"
        onClick={() => setShowDropdown((prev) => !prev)}
      >
        {user.fullname ? user.fullname.charAt(0).toUpperCase() : "U"}
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute top-14 right-0 bg-white shadow-lg rounded-lg w-40 py-2 z-50">
          <button
            onClick={() => {
              navigate("/dashboard/profile");
              setShowDropdown(false);
            }}
            className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 text-gray-800"
          >
            <span className="material-icons text-gray-600 mr-2">person</span>
            Profile
          </button>
          <button
            onClick={() => {
              onLogout();
              setShowDropdown(false);
            }}
            className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 text-red-600"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default NavDropdown;
