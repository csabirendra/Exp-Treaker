import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import useMediaQuery from "../../hooks/useMediaQuery"; 

const COLORS = ["#ff4c4cff", "#4096ffff", "#86ff45ff", "#ffc32bff", "#8056ffff"];

// Custom Tooltip
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-gray-900 text-white px-2 py-1 rounded-lg shadow-lg text-xs sm:text-sm">
        {data.SUBCATEGORY}: ₹{data.Total.toLocaleString()}
      </div>
    );
  }
  return null;
};

const ExpensePieChart = ({ transactions }) => {
  // 🔹 Dummy transactions for testing
  const dummyTransactions = [
    { TRANSACTIONID: "1", SUBCATEGORY: "Fuel", CATEGORY: "expense", AMOUNT: 1000, TRANSACTION_DATE: "2025-09-01" },
    { TRANSACTIONID: "2", SUBCATEGORY: "Grocery", CATEGORY: "expense", AMOUNT: 3200, TRANSACTION_DATE: "2025-09-02" },
    { TRANSACTIONID: "3", SUBCATEGORY: "House Rent", CATEGORY: "expense", AMOUNT: 12000, TRANSACTION_DATE: "2025-09-04" },
    { TRANSACTIONID: "4", SUBCATEGORY: "Transport", CATEGORY: "expense", AMOUNT: 6000, TRANSACTION_DATE: "2025-09-06" },
    { TRANSACTIONID: "5", SUBCATEGORY: "Healthcare", CATEGORY: "expense", AMOUNT: 2000, TRANSACTION_DATE: "2025-09-07" },
    { TRANSACTIONID: "6", SUBCATEGORY: "EMI", CATEGORY: "expense", AMOUNT: 5000, TRANSACTION_DATE: "2025-09-09" },
  ];

  // const txns = dummyTransactions; // demo
  const txns = transactions;    // live

  // 🔹 Group by SUBCATEGORY
  let expenseData = txns
    .filter((t) => t.CATEGORY.toLowerCase() === "expense")
    .reduce((acc, t) => {
      const subcat = acc.find((s) => s.SUBCATEGORY === t.SUBCATEGORY);
      if (subcat) {
        subcat.Total += t.AMOUNT;
      } else {
        acc.push({ SUBCATEGORY: t.SUBCATEGORY, Total: t.AMOUNT });
      }
      return acc;
    }, []);

  // 🔹 Top 5
  expenseData = expenseData.sort((a, b) => b.Total - a.Total).slice(0, 5);
  const totalExpense = expenseData.reduce((sum, item) => sum + item.Total, 0);

  if (!expenseData.length) {
    return (
      <div className="bg-white p-6 rounded-xl shadow text-center text-gray-500 text-sm">
        No expense data available
      </div>
    );
  }

  return (
    <>
      {/* ---------- PC VIEW (unchanged) ---------- */}
      <div className="hidden md:block bg-gray-900 lg:bg-gray-800 h-100 rounded-xl border-none shadow-md overflow-hidden">
        {/* Header */}
        <div className="px-3 py-2 sm:px-4 sm:py-3 bg-gray-400 flex justify-between border-none">
          <span className="text-sm sm:text-base font-semibold text-gray-800 flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            Top Expenses
          </span>
          <span className="font-semibold text-gray-900">
            ₹{totalExpense.toLocaleString()}
          </span>
        </div>

        {/* Pie Chart */}
        <div className="py-3 px-5 text-gray-200 sm:p-5 text-xs sm:text-xs">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={expenseData}
                dataKey="Total"
                nameKey="SUBCATEGORY"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={90}
                paddingAngle={2}
                animationDuration={800}
              >
                {expenseData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
                {/* Center Label */}
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-sm font-bold fill-gray-400"
                >
                  ₹{totalExpense.toLocaleString()}
                </text>
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          {/* Legend */}
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs sm:text-sm">
            {expenseData.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                ></div>
                <span className="truncate">{item.SUBCATEGORY}</span>
                <span className="ml-auto font-medium">
                  ₹{item.Total.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>



      {/* ---------- MOBILE VIEW ---------- */}



      <div className="md:hidden bg-gray-700 rounded-xl border-none overflow-hidden">
        {/* Header */}
        <div className="px-3 py-2 bg-gray-400 flex justify-between border-none">
          <span className="text-md font-semibold text-dark flex flex-row gap-2 items-center"><div className="w-2.5 h-2.5 bg-red-500 rounded-full"></div>Top Expenses</span>
          <span className="font-semibold text-dark">
            ₹ {totalExpense.toLocaleString()}
          </span>
        </div>

        {/* Chart */}
        <div className="px-2 border-none">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={expenseData}
                dataKey="Total"
                nameKey="SUBCATEGORY"
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={2}
                animationDuration={800}
                stroke="none"
                activeShape={null}
              >
                {expenseData.map((entry, index) => (
                  <Cell
                    key={`cell-m-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-xs font-bold fill-light"
                >
                  ₹{totalExpense.toLocaleString()}
                </text>
              </Pie>

              {/* ✅ Tooltip only for desktop */}
              {window.innerWidth >= 768 && <Tooltip content={<CustomTooltip />} />}
            </PieChart>

          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 gap-1 text-xs px-3 py-2">
          {expenseData.map((item, index) => (
            <div key={index} className="flex items-center gap-1 text-light">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              ></div>
              <span className="truncate">{item.SUBCATEGORY}</span>
              <span className="ml-auto pr-2 font-medium text-light">
                ₹{item.Total.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ExpensePieChart;
