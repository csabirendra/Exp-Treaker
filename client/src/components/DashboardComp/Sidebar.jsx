
// //                    --  Un Used  --

// // src/pages/DashboardComp/Sidebar.jsx
// import React, { useState } from "react";
// import { LogOut } from "lucide-react";
// // import { sidebarItems } from "../../config/sidebarConfig";

// const Sidebar = ({
//   activeTab,
//   handleMenuClick,
//   handleLogout,
//   isMobileMenuOpen,
//   setIsMobileMenuOpen,
//   user,
// }) => {

//   return (
//     <>
//       {/* ========== MOBILE SIDEBAR ========== */}
//       {isMobileMenuOpen && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-30 z-30 lg:hidden"
//           onClick={() => setIsMobileMenuOpen(false)} // ✅ close on outside click
//         />
//       )}

//       <aside
//         className={`lg:hidden fixed top-0 right-0 bottom-0 w-64 bg-white shadow-lg z-40 transform transition-transform duration-300 ease-in-out
//           ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}
//       >
//         <div className="h-full flex flex-col">
//           {/* User Info */}
//           <div className="flex items-center gap-3 p-4 border-b bg-gray-50">
//             <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center font-bold text-white shadow">
//               {user?.FULLNAME?.charAt(0).toUpperCase()}
//             </div>
//             <div>
//               <p className="text-sm font-semibold text-gray-800">
//                 {user?.FULLNAME || "Undefined User"}
//               </p>
//               <p className="text-xs text-gray-500 truncate max-w-[150px]">
//                 {user?.LOGINID}
//               </p>
//             </div>
//           </div>

//           {/* Nav Items */}
//           <nav className="flex-1 overflow-y-auto p-2 space-y-2">
//             {sidebarItems.map((item) => (
//               <button
//                 key={item.id}
//                 onClick={() => {
//                   handleMenuClick(item.id);
//                   setIsMobileMenuOpen(false); // ✅ close on menu click
//                 }}
//                 className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition-all text-sm
//                   ${
//                     activeTab === item.id
//                       ? "bg-blue-50 text-blue-600 font-semibold shadow-sm"
//                       : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
//                   }`}
//               >
//                 <item.icon className="h-5 w-5 mr-3 flex-shrink-0" />
//                 <span>{item.label}</span>
//               </button>
//             ))}
//           </nav>

//           {/* Logout */}
//           <div className="p-3 border-t bg-gray-50">
//             <button
//               onClick={() => {
//                 handleLogout();
//                 setIsMobileMenuOpen(false); // ✅ close on logout
//               }}
//               className="w-full flex items-center justify-center px-3 py-2 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-500 text-sm transition"
//             >
//               <LogOut className="h-5 w-5 mr-2" />
//               Logout
//             </button>
//           </div>
//         </div>
//       </aside>

//       {/* ========== PC SIDEBAR (Expandable on Hover) ========== */}
//       <aside
//         onMouseEnter={() => setIsExpanded(true)}
//         onMouseLeave={() => setIsExpanded(false)}
//         className={`hidden lg:flex ${
//           isExpanded ? "w-56" : "w-16"
//         } bg-white border-r shadow-sm flex-col transition-all duration-300`}
//       >
//         {/* User Info (only when expanded) */}
//         {isExpanded && (
//           <div className="flex items-center gap-3 p-4 border-b bg-gray-50">
//             <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center font-bold text-white shadow">
//               {user?.FULLNAME?.charAt(0).toUpperCase()}
//             </div>
//             <div>
//               <p className="text-sm font-semibold text-gray-800 truncate max-w-[120px]">
//                 {user?.FULLNAME || "Undefined User"}
//               </p>
//               <p className="text-xs text-gray-500 truncate max-w-[120px]">
//                 {user?.LOGINID}
//               </p>
//             </div>
//           </div>
//         )}

//         {/* Nav Items */}
//         <nav className="flex-1 overflow-y-auto p-2 space-y-2">
//           {sidebarItems.map((item) => (
//             <button
//               key={item.id}
//               onClick={() => handleMenuClick(item.id)}
//               className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition-all text-sm ${
//                 activeTab === item.id
//                   ? "bg-blue-50 text-blue-600 font-semibold shadow-sm border-l-4 border-blue-600"
//                   : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
//               }`}
//             >
//               <item.icon className="h-5 w-5 flex-shrink-0" />
//               {isExpanded && <span className="ml-3">{item.label}</span>}
//             </button>
//           ))}
//         </nav>

//         {/* Logout */}
//         <div className="p-3 border-t bg-gray-50">
//           <button
//             onClick={handleLogout}
//             className="w-full flex items-center justify-center px-3 py-2 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-500 text-sm transition"
//           >
//             <LogOut className="h-5 w-5" />
//             {isExpanded && <span className="ml-2">Logout</span>}
//           </button>
//         </div>
//       </aside>
//     </>
//   );
// };

// export default Sidebar;
