import React, { useState, useEffect, useRef } from "react";
import { LogOut , Settings } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";

// LOGO
import logo from "../assets/Logo1.png";
import FloatingButton from "../components/DashboardComp/FloatingButton.jsx";

// ✅ Pages
import Overview from "./Dashboard/Overview";
import Transactions from "./Dashboard/Transactions copy";
import Analytics from "./Dashboard/Analytics";
import Budget from "./Dashboard/Budget";
import Profile from "./Dashboard/Profile";

// ✅ Components
import MobileSidebar from "../components/DashboardComp/MobileSidebar";
import PcSidebar from "../components/DashboardComp/PcSidebar";
import TransactionModal from "../components/TransactionComp/TransactionModal.jsx";
import { useTransactions } from "../hooks/useTransactions";
// import NavDropdown from "../components/DashboardComp/NavDropdown.jsx";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const currentPath = location.pathname.split("/")[2] || "overview";
  const [activeTab, setActiveTab] = useState(currentPath);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTxn, setEditTxn] = useState(null);

  const [showDropdown, setShowDropdown] = useState(false); // ✅ Dropdown Profile && Logout
  const avatarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (avatarRef.current && !avatarRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape") setShowDropdown(false);
    };

    document.addEventListener("click", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const { handleSave } = useTransactions(); // ✅ use hook

  // ✅ Get user from localStorage (if available)
  const [user, setUser] = useState({
    fullname: "Dummy User",
    email: "dummyuser123@email.com",
  });

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser({
          fullname: parsed.fullname || "Dummy User",
          email: parsed.email || "dummyuser123@email.com",
        });
      } catch (err) {
        console.error("Error parsing user from localStorage:", err);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  useEffect(() => {
    const pathTab = location.pathname.split("/")[2] || "overview";
    setActiveTab(pathTab);
  }, [location.pathname]);

  const handleMenuClick = (itemId) => {
    setActiveTab(itemId);
    navigate(`/dashboard/${itemId}`);
  };

  return (
    <div className="bg-gray-900 md:bg-gray-100 h-screen flex flex-col overflow-hidden ">
      {/* TOP NAVBAR DESKTOP */}
      <header className="h-15 md:h-18 flex-shrink-0 z-50 bg-neutral-950 lg:bg-gray-900">
        <div className="h-full flex bg-neutral-950 lg:bg-gray-900 items-center justify-between px-3 lg:px-6">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2">
            <img src={logo} alt="Logo" className="h-8 md:h-12 w-auto" />
          </Link>

          {/* ✅ Right Side Navbar */}
          <div className="flex items-center gap-0 relative">
            {/* Avatar + Dropdown wrapper */}
            <div
              ref={avatarRef}
              className="hidden lg:flex items-center gap-3 relative select-none"
            >
              {/* User Info */}
              <div className="flex flex-col items-end leading-tight">
                <span className="text-sm font-semibold text-slate-300 capitalize">
                  Welcome, {user.fullname?.split(" ")[0]} !
                </span>
                <span className="text-xs text-green-600">{user.email}</span>
              </div>
              

              {/* ✅ Avatar (Dropdown Trigger) */}
              <div
                className="h-10 w-10 rounded-full bg-green-800 flex items-center justify-center font-semibold text-white shadow-md cursor-pointer select-none transition-transform duration-150 hover:scale-105"
                onClick={() => setShowDropdown((prev) => !prev)}
                aria-haspopup="true"
                aria-expanded={showDropdown}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setShowDropdown((prev) => !prev);
                  }
                }}
              >
                {user.fullname ? user.fullname.charAt(0).toUpperCase() : "U"}
              </div>

              {/* ✅ Dropdown Menu */}
              {showDropdown && (
                <div
                  className="absolute top-11 right-0 bg-gray-300 rounded-lg w-44 py-2 px-1 z-50 border-none animate-fadeIn"
                  role="menu"
                >
                  <button
                    onClick={() => {
                      navigate("/dashboard/profile");
                      setShowDropdown(false);
                    }}
                    className="flex items-center pl-3 w-full bg-gray-300 border-none text-sm text-gray-700 hover:bg- transition-colors duration-150"
                    role="menuitem"
                  >
                    <span className="material-icons text-gray-600 text-sm">
                      <Settings className="w-4 h-4 mr-2" />Profile
                    </span>
                    
                  </button>

                  <div className="border-t my-1 border-gray-200"></div>

                  <button
                    onClick={() => {
                      handleLogout();
                      setShowDropdown(false);
                    }}
                    className="flex items-center pl-3 w-full bg-gray-300 text-sm border-none text-red-600  transition-colors duration-150"
                    role="menuitem"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* ✅ Mobile Avatar → Sidebar Drawer */}
            <MobileSidebar
              activeTab={activeTab}
              handleMenuClick={handleMenuClick}
              handleLogout={handleLogout}
              user={user}
            />
          </div>

        </div>
      </header>

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* ✅ PC Sidebar */}
        <PcSidebar
          activeTab={activeTab}
          handleMenuClick={handleMenuClick}
          handleLogout={handleLogout}
          user={user}
        />

        {/* ✅ Main Content */}
        <main className="flex-1 overflow-auto bg-black md:bg-gray-100">
          <div className="px-4 py-2 lg:px-6 ">
            {activeTab === "overview" && <Overview setActiveTab={setActiveTab} />}
            {activeTab === "transactions" && <Transactions />}
            {activeTab === "analytics" && <Analytics />}
            {activeTab === "budget" && <Budget />}
            {activeTab === "profile" && <Profile />}
          </div>
        </main>
      </div>

      {/* ✅ Floating Button */}
      <FloatingButton
        onAddTransaction={() => setIsModalOpen(true)}
        onShowSummary={() => console.log("Show Today’s Summary")}
        onToggleDarkMode={() => document.body.classList.toggle("dark")}
        bgClass="from-pink-500 to-orange-500"
      />

      {/* ✅ Transaction Modal */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditTxn(null);
        }}
        onSave={(formData) =>
          handleSave(formData, editTxn, () => {
            setIsModalOpen(false);
            setEditTxn(null);
          })
        }
        initialData={editTxn}
      />
    </div>
  );
};

export default Dashboard;
