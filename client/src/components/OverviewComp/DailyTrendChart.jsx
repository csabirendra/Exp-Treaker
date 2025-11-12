import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import { CreditCard } from "lucide-react";

// Custom Tooltip
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 text-white px-2 py-1 rounded-lg shadow-lg text-xs sm:text-sm">
        <p className="font-semibold">Day {label}</p>
        {payload.map((item, idx) => (
          <span key={idx} style={{ color: item.color }}>
            {item.name}: ₹{item.value.toLocaleString()}
          </span>
        ))}
      </div>
    );
  }
  return null;
};

const DailyTrendChart = ({ transactions }) => {
  // 🔹 Dummy transactions for testing
  // const dummyTransactions = [
  //   { TRANSACTION_DATE: "2025-09-01", CATEGORY: "income", AMOUNT: 30200 },
  //   { TRANSACTION_DATE: "2025-09-01", CATEGORY: "INCOME", AMOUNT: 3500 },
  //   { TRANSACTION_DATE: "2025-09-02", CATEGORY: "INCOME", AMOUNT: 1200 },
  //   { TRANSACTION_DATE: "2025-09-03", CATEGORY: "income", AMOUNT: 5000 },
  //   { TRANSACTION_DATE: "2025-09-04", CATEGORY: "expense", AMOUNT: 2200 },
  //   { TRANSACTION_DATE: "2025-09-05", CATEGORY: "income", AMOUNT: 8000 },
  //   { TRANSACTION_DATE: "2025-09-05", CATEGORY: "INCOME", AMOUNT: 1500 },
  //   { TRANSACTION_DATE: "2025-09-07", CATEGORY: "INCOME", AMOUNT: 2800 },
  //   { TRANSACTION_DATE: "2025-09-08", CATEGORY: "income", AMOUNT: 7000 },
  //   { TRANSACTION_DATE: "2025-09-09", CATEGORY: "expense", AMOUNT: 2200 },
  //   { TRANSACTION_DATE: "2025-09-10", CATEGORY: "expense", AMOUNT: 500 },
  //   { TRANSACTION_DATE: "2025-09-11", CATEGORY: "income", AMOUNT: 2000 },
  //   { TRANSACTION_DATE: "2025-09-27", CATEGORY: "income", AMOUNT: 200 },
  // ];

  // 🔹 Use Dummy for now
  // const txns = dummyTransactions;

  // 🔹 If you want to use real data, just switch this line:
  const txns = transactions;

  const dailyMap = {};
  txns.forEach((t) => {
    const day = new Date(t.TRANSACTION_DATE).getDate(); // 1,2,3...
    if (!dailyMap[day]) {
      dailyMap[day] = { day, income: 0, expense: 0 };
    }
    if (t.CATEGORY.toLowerCase() === "income") {
      dailyMap[day].income += t.AMOUNT;
    } else if (t.CATEGORY.toLowerCase() === "expense") {
      dailyMap[day].expense += t.AMOUNT;
    }
  });

  const dailyData = Object.values(dailyMap).sort((a, b) => a.day - b.day);

  const totalIncome = dailyData.reduce((sum, d) => sum + d.income, 0);
  const totalExpense = dailyData.reduce((sum, d) => sum + d.expense, 0);

  if (!dailyData.length) {
    return (
      <div className="bg-gray-900 p-6 rounded-xl shadow text-center text-gray-500 text-sm">
        No daily data available
      </div>
    );
  }

  return (
    <div className="bg-gray-800 h-100 rounded-xl border-none shadow-md overflow-hidden">
      {/* Header */}
      <div className="px-3 py-2.5 sm:px-4 md:py-2 bg-gray-400 flex justify-between mb-4">
        <span className="text-sm sm:text-base font-semibold text-gray-800 flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          Daily Trend
        </span>
      </div>

      {/* Chart */}
      <div className="p-2 sm:p-2 h-100">
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={dailyData}>
            <defs>
              <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="2">
                <stop offset="5%" stopColor="#34D399" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#34D399" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="2">
                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="day" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              CATEGORY="monotone"
              dataKey="income"
              stroke="#34D399"
              fill="url(#incomeGradient)"
              name="Income"
            />
            <Area
              CATEGORY="monotone"
              dataKey="expense"
              stroke="#EF4444"
              fill="url(#expenseGradient)"
              name="Expense"
            />
          </AreaChart>
        </ResponsiveContainer>


        {/* Legend Summary */}
        <div className="m-auto mt-3 w-70 gap-3 flex justify-center text-xs sm:text-sm bg-transparent">
          <div className="w-2/5 flex justify-end   items-center px-2 py-1 rounded-lg bg-green-100 bg-opacity-10 ">
            <CreditCard className="w-4 h-4 text-gray-500"/>
            <span className="ml-auto font-medium text-green-600">
              ₹{totalIncome.toLocaleString()}
            </span>
          </div>
          <div className="w-2/5 flex justify-start items-center px-2 py-1 rounded-lg bg-red-100   bg-opacity-10">
            <CreditCard className="w-4 h-4 text-gray-500"/>
            <span className="ml-auto font-medium text-red-600">
              ₹{totalExpense.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyTrendChart;
