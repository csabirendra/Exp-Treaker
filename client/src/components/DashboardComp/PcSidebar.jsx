import React from "react";
import { LogOut } from "lucide-react";
import { sidebarItems } from "../../config/sidebarConfig";

const PcSidebar = ({ activeTab, handleMenuClick, handleLogout, user }) => {
  return (
    <aside className="hidden lg:flex w-45 bg-gray-900 border-r shadow-sm flex-col">
      

      {/* Nav Items */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-3 mt-3">
        {sidebarItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleMenuClick(item.id)}
            className={`w-full border-none flex items-center px-3 py-2 rounded-lg text-left transition-all text-sm ${
              activeTab === item.id
                ? " text-green-500 bg-transparent font-semibold border-l-4 border-blue-600"
                : " bg-white text-gray-400 bg-transparent hover:text-gray-200"
            }`}
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            <span className="ml-3">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t bg-gray-900">
        <button
          onClick={handleLogout}
          className="w-full flex items-center bg-red-600 text-white border-none py-2 rounded-lg hover:bg-red-800 hover:text-red-100 text-sm transition">
          {/* <LogOut className="h-5 w-5" /> */}
          <span className="ml-2 m-auto">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default PcSidebar;
