import React, { useState } from "react";
import { LogOut } from "lucide-react";
import { sidebarItems } from "../../config/sidebarConfig";
import imga from "../../assets/img/bg-mob-sidebar.png"

const MobileSidebar = ({ user, handleMenuClick, handleLogout }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="">
      {/* Avatar Button (Top Right Navbar) */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden border-none flex items-center justify-center h-10 w-10 rounded-full bg-green-800 text-white font-bold shadow fs-3"
      >
        {user?.fullname?.charAt(0).toUpperCase() || "U"}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg- bg-opacity-40 z-40">
        </div>
      )}

      {/* Sidebar Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-70 bg-gray-800 shadow-lg z-50 rounded transform transition-transform duration-300 flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"}`}>

        {/* User Info */}
        <div  className="flex items-center gap-2 pt-5 pb-5 pl-5 bg-black rounded-b-lg mb-3 bg-contain bg-center"
              style={{backgroundImage: `url(${imga})`,}}>
          <div className="h-13 w-13 border rounded-lg bg-gray-200 flex items-center justify-center text-black font-bold text-3xl p-4 shadow">
            {user?.fullname?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-white">
              {user?.fullname || "Undefined User"}
            </span>
            <span className="text-xs text-white">{user?.email}</span>
          </div>
        </div>


        {/* Menus */}
        <nav className="flex-1 pl-0 space-y-2.5 overflow-y-auto">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                handleMenuClick(item.id);
                setIsOpen(false);
              }}
              className="w-full border-none bg-gray-800 flex items-center px-3 py-2 rounded-lg text-gray-100 active:text-blue-500 focus:text-blue-500 hover:text-blue-500 transition text-sm"
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.label}
            </button>
          ))}
        </nav>

        {/* ✅ Logout last me */}
        <div className="p-4 border-t">
          <button onClick={() => { handleLogout();setIsOpen(false);}}
                  className="w-50 border-none bg-red-500 flex items-center px-3 py-2 rounded-lg text-white hover:bg-red-50 hover:text-red-500 text-sm transition">
          <LogOut className="h-5 w-5 mr-2" />Logout</button>
        </div>
      </div>
    </div>
  );
};

export default MobileSidebar;
