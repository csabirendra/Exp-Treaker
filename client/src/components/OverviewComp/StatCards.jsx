// src/components/OverviewComp/StatCards.jsx
import React from "react";
const StatCards = ({ stats }) => {
  return (
    <>
      {/* ---------- PC / Desktop Cards ---------- */}
      <div className="hidden md:grid grid-cols-5 gap-4 mb-4">
        {stats.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between px-3 py-2 bg-gray-800 shadow-xm rounded-xl"
          >
            <div>
              <p className="text-sm text-gray-300">{item.label}</p>
              <p className="text-sm font-semibold text-gray-100">{item.value}</p>
              {item.trend && (
                <div
                  className={`flex items-center gap-1 text-xs mt-1 ${item.trend.color}`}
                >
                  <item.trend.icon className="h-3 w-3" />
                  <span>{item.trend.text} Last 30 Days</span>
                </div>
              )}
            </div>
            <div
              className={`h-10 w-10 rounded-full flex items-center justify-center ${item.color}`}
            >
              <item.icon className="h-5 w-5" />
            </div>
          </div>
        ))}
      </div>
      {/* ---------- Mobile Cards ---------- */}
      <div className="grid grid-cols-2 gap-3 mb-3 md:hidden">
        {stats.map((item) => (
          <div 
            key={item.id} 
            className="relative bg-gray-700 rounded-2xl py-3 px-2 overflow-hidden"
          >
            {/* Background gradient accent */}
            <div className={`absolute top-0 right-0 w-20 h-20 ${item.color} opacity-10 rounded-full -mr-8 -mt-8`}></div>
            
            <div className="relative">
              {/* Icon and Label in same row */}
              <div className="flex items-center gap-2 mb-2">
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0 ${item.color}`}>
                  <item.icon className="h-6 w-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-light font-medium mb-3">{item.label}</p>
                  <h3 className="text-lg font-semibold text-white">{item.value}</h3>
                </div>
              </div>
              
              {/* Trend */}
              {item.trend && (
                <div className={`inline-flex items-center gap-1 text-xs font-medium ${item.trend.color} bg-opacity-10 px-2 py-1 rounded-full`}>
                  <item.trend.icon className="h-3 w-3" />
                  <span>{item.trend.text}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
export default StatCards;