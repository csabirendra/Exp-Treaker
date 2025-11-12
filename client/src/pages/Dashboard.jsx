import React, { useState, useEffect } from "react";
import { LogOut } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";

// LOGO
import logo from "../assets/logo1.png";
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

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const currentPath = location.pathname.split("/")[2] || "overview";
  const [activeTab, setActiveTab] = useState(currentPath);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTxn, setEditTxn] = useState(null);

  const { handleSave } = useTransactions(); // ✅ use hook

  // ✅ Get user from localStorage (if available)
  const [user, setUser] = useState({
    FULLNAME: "Dummy User",
    LOGINID: "dummyuser123@email.com",
  });

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser({
          FULLNAME: parsed.FULLNAME || "Dummy User",
          LOGINID: parsed.LOGINID || "dummyuser123@email.com",
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
    <div className="h-screen flex flex-col overflow-hidden bg-white">
      {/* TOP NAVBAR */}
      <header className="h-16 flex-shrink-0 z-50 bg-white border-b">
        <div className="h-full flex items-center justify-between px-3 lg:px-6">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2">
            <img src={logo} alt="Logo" className="h-10 w-auto" />
          </Link>

          {/* ✅ Right Side Navbar */}
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-3">
              <div className="flex flex-col items-end leading-tight">
                <span className="text-sm font-semibold text-gray-800 capitalize">
                  Welcome, {user.FULLNAME} !
                </span>
                <span className="text-xs text-gray-500">{user.LOGINID}</span>
              </div>

              {/* ✅ Avatar */}
              <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center font-semibold text-white shadow-md">
                {user.FULLNAME ? user.FULLNAME.charAt(0).toUpperCase() : "U"}
              </div>

              {/* ✅ Logout */}
              <button
                onClick={handleLogout}
                className="flex items-center justify-center h-9 w-9 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-500 transition-all"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>

            {/* Mobile Avatar → Sidebar Drawer */}
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
        <main className="flex-1 overflow-auto bg-gray-100">
          <div className="px-4 py-2 lg:px-6">
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
