import React, { useState } from "react";
import { DollarSign, TrendingUp } from "lucide-react";

const Budget = () => {
  const [monthlyBudget, setMonthlyBudget] = useState(30000); // default
  const [spent, setSpent] = useState(22000); // sample (ye baad me API se fetch hoga)

  const remaining = monthlyBudget - spent;
  const percentage = Math.min((spent / monthlyBudget) * 100, 100);

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold text-gray-800">Budget Planning</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 🔹 Monthly Budget Card */}
        <div className="bg-white rounded-xl p-6 shadow flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-700">Monthly Budget</h3>
            <p className="text-2xl font-bold text-green-600 mt-2">
              ₹{monthlyBudget.toLocaleString()}
            </p>
          </div>
          <div className="mt-4">
            <input
              type="number"
              value={monthlyBudget}
              onChange={(e) => setMonthlyBudget(Number(e.target.value))}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter budget"
            />
          </div>
        </div>

        {/* 🔹 Spent vs Remaining */}
        <div className="bg-white rounded-xl p-6 shadow">
          <h3 className="text-lg font-semibold text-gray-700">This Month</h3>

          <div className="mt-4 space-y-2">
            <p className="text-gray-600 flex justify-between">
              <span>Spent</span>
              <span className="font-medium text-red-600">₹{spent.toLocaleString()}</span>
            </p>
            <p className="text-gray-600 flex justify-between">
              <span>Remaining</span>
              <span className="font-medium text-green-600">
                ₹{remaining.toLocaleString()}
              </span>
            </p>
          </div>

          {/* 🔹 Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full ${
                  percentage > 80 ? "bg-red-500" : "bg-green-500"
                }`}
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-500 mt-1">{percentage.toFixed(1)}% of budget used</p>
          </div>
        </div>
      </div>

      {/* 🔹 Quick Insights */}
      <div className="bg-white rounded-xl p-6 shadow mt-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-between">
            <span>Total Budget</span>
            <span className="font-bold">₹{monthlyBudget.toLocaleString()}</span>
          </div>
          <div className="p-4 rounded-lg bg-red-50 text-red-700 flex items-center justify-between">
            <span>Spent</span>
            <span className="font-bold">₹{spent.toLocaleString()}</span>
          </div>
          <div className="p-4 rounded-lg bg-green-50 text-green-700 flex items-center justify-between">
            <span>Remaining</span>
            <span className="font-bold">₹{remaining.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Budget;
