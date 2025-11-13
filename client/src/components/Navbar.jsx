import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import logo from "../assets/Logo1.png";
import "../styles/navbar.css";
import { FiLogIn, FiUserPlus } from "react-icons/fi";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-100 px-4 bg-gray-100 sticky  top-0 left-0 z-50 ">
      {/* <div className="w-100 h-bg-gray-800">dwdw</div> */}
      <div className="flex bg- justify-between items-center py-2 md:px-3">

        {/* Logo */}
        <div className=" w-25 bg- d-flex justify-content-center">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="Brand Logo" className="w-32 md:w-40" />
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="w-75 bg- hidden md:flex items-center space-x-5">
          <div className="w-75 bg- d-flex flex-end justify-content-end ">
            <div className="w-75 bg- d-flex justify-content-center gap-4">
              {/* <a href="" className="text-gray-700 text-decoration-none hover:text-black">Products</a>
              <a href="" className="text-gray-700 text-decoration-none hover:text-black">Pricing</a>
              <a href="" className="text-gray-700 text-decoration-none hover:text-black">Support</a>
              <a href="" className="text-gray-700 text-decoration-none hover:text-black">Support</a>
              <a href="" className="text-gray-700 text-decoration-none hover:text-black">Support</a> */}
            </div>
          </div>

          <div className="w-25 bg- d-flex justify-content-start gap-3 ">
            <Link to="/login"  className="flex items-center text-decoration-none gap-2 px-3 py-2 rounded-md">
              <FiLogIn size={18} className="text-green-700"/><span className="text-green-700 text-sm">Login</span>
            </Link>
            <Link to="/signup" className="flex items-center text-decoration-none gap-2 px-3 rounded-md text-dark bg-opacity-75 border">
              <FiUserPlus size={15} className="text-green-700"/><span className="text-green-700 text-sm">SignUp</span>
            </Link>
          </div>
        </div>

        {/* Mobile Hamburger // toggle and menu */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray border-none bg-gray-50 outline-none"
          >
            {isOpen ? <FiX size={28} /> : <FiMenu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-50 border-t animate-slideDown">
          <div className="px-6 py-4 space-y-4">

            <Link to="/products" className="block text-gray-700 text-decoration-none hover:text-black">Products</Link>
            <Link to="/pricing" className="block text-gray-700 text-decoration-none hover:text-black">Pricing</Link>
            <Link to="/support" className="block text-gray-700 text-decoration-none hover:text-black">Support</Link>
            <Link to="/support" className="block text-gray-700 text-decoration-none hover:text-black">Contact</Link>
            <Link to="/support" className="block text-gray-700 text-decoration-none hover:text-black">Team</Link>

            <div className="w-100 bg- d-flex justify-content-around">

              <Link to="/login" className="flex items-center text-decoration-none gap-2 px-2 py-1 rounded-md  text-dark ">
              <FiLogIn size={15} className="text-gray-600" /><span>Login</span>
            </Link>
            <Link to="/signup" className="flex items-center text-decoration-none gap-2 px-2 py-1 rounded-md bg-primary text-white border">
              <FiUserPlus size={15} /><span>Signup</span>
            </Link>
            </div>

          </div>
        </div>
      )}
    </nav>
  );
}
