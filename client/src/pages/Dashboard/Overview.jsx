// src/components/OverviewComp/Overview.jsx
import React, { useState, useEffect } from "react";
import {
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  IndianRupee,
  List,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import CategoryBreakdown from "../../components/OverviewComp/top5expenses";
import DailyTrendChart from "../../components/OverviewComp/DailyTrendChart";
import RecentTransactions from "../../components/OverviewComp/RecentTransactions";
import StatCards from "../../components/OverviewComp/StatCards";
import axios from "axios";

// 🔹 Helper: Month names
const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

// 🔹 Helper: Get Month-Year string
const getMonthYear = (date) => {
  const d = new Date(date);
  return `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
};

// 🔹 Helper: Calculate stats for a given month
const calculateStatsForMonth = (transactions, monthYear) => {
  const txns = transactions.filter(
    (txn) => getMonthYear(txn.TRANSACTION_DATE) === monthYear
  );

  const income = txns
    .filter((t) => t.CATEGORY && t.CATEGORY.toLowerCase() === "income")
    .reduce((sum, t) => sum + t.AMOUNT, 0);

  const expense = txns
    .filter((t) => t.CATEGORY && t.CATEGORY.toLowerCase() === "expense")
    .reduce((sum, t) => sum + t.AMOUNT, 0);

  const balance = income - expense;
  const count = txns.length;

  return { income, expense, balance, count };
};

// 🔹 Helper: Calculate overall saving
const calculateOverallSaving = (transactions, uniqueMonths, selectedMonth) => {
  const selectedIndex = uniqueMonths.indexOf(selectedMonth);
  const monthsToInclude = uniqueMonths.slice(0, selectedIndex + 1);

  const overallTxns = transactions.filter((txn) => {
    const txnMonthYear = getMonthYear(txn.TRANSACTION_DATE);
    return monthsToInclude.includes(txnMonthYear);
  });

  const income = overallTxns
    .filter((t) => t.CATEGORY && t.CATEGORY.toLowerCase() === "income")
    .reduce((sum, t) => sum + t.AMOUNT, 0);

  const expense = overallTxns
    .filter((t) => t.CATEGORY && t.CATEGORY.toLowerCase() === "expense")
    .reduce((sum, t) => sum + t.AMOUNT, 0);

  return income - expense;
};

// 🔹 Helper: Trend vs last month
const getTrend = (current, previous) => {
  if (previous === 0 && current === 0)
    return { icon: Minus, color: "text-gray-400", text: "0%" };
  if (previous === 0)
    return { icon: TrendingUp, color: "text-green-600", text: "+100%" };

  const change = ((current - previous) / previous) * 100;
  if (change > 0)
    return { icon: TrendingUp, color: "text-green-600", text: `+${change.toFixed(1)}%` };
  if (change < 0)
    return { icon: TrendingDown, color: "text-red-600", text: `${change.toFixed(1)}%` };

  return { icon: Minus, color: "text-gray-400", text: "0%" };
};

const Overview = ({ setActiveTab }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentDate = new Date();
  const currentMonth = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const USERID = localStorage.getItem("USERID");
        const token = localStorage.getItem("token");

        const res = await axios.get("http://localhost:5002/api/transactions", {
          headers: { Authorization: `Bearer ${token}` },
          params: { USERID },
        });

        if (res.data.success) {
          setTransactions(res.data.transactions);
        }
      } catch (err) {
        console.error("Error fetching transactions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const uniqueMonths = Array.from(
    new Set(
      transactions
        .sort((a, b) => new Date(a.TRANSACTION_DATE) - new Date(b.TRANSACTION_DATE))
        .map((txn) => getMonthYear(txn.TRANSACTION_DATE))
    )
  );

  const { income, expense, balance, count: txnCount } =
    calculateStatsForMonth(transactions, selectedMonth);

  const selectedIndex = uniqueMonths.indexOf(selectedMonth);
  const lastMonth = selectedIndex > 0 ? uniqueMonths[selectedIndex - 1] : null;
  const {
    income: lastIncome,
    expense: lastExpense,
    balance: lastBalance,
    count: lastCount,
  } = lastMonth
    ? calculateStatsForMonth(transactions, lastMonth)
    : { income: 0, expense: 0, balance: 0, count: 0 };

  const overallSaving = calculateOverallSaving(
    transactions,
    uniqueMonths,
    selectedMonth
  );

  const stats = [
    {
      id: 1,
      label: "Income",
      value: `₹ ${income.toLocaleString()}`,
      icon: ArrowUpRight,
      color: "bg-green-100 text-green-600",
      trend: getTrend(income, lastIncome),
    },
    {
      id: 2,
      label: "Expense",
      value: `₹ ${expense.toLocaleString()}`,
      icon: ArrowDownRight,
      color: "bg-red-100 text-red-600",
      trend: getTrend(expense, lastExpense),
    },
    {
      id: 3,
      label: "Balance",
      value: `₹ ${balance.toLocaleString()}`,
      icon: Wallet,
      color: "bg-blue-100 text-blue-600",
      trend: getTrend(balance, lastBalance),
    },
    {
      id: 4,
      label: "Overall Saving",
      value: `₹ ${overallSaving.toLocaleString()}`,
      icon: IndianRupee,
      color: "bg-purple-100 text-purple-600",
      trend: getTrend(balance, lastBalance),
    },
    {
      id: 5,
      label: "Transactions",
      value: txnCount,
      icon: List,
      color: "bg-yellow-100 text-yellow-600",
      trend: getTrend(txnCount, lastCount),
    },
  ];

  const filteredTxns = transactions.filter(
    (txn) => getMonthYear(txn.TRANSACTION_DATE) === selectedMonth
  );

  if (loading) return <p className="text-center py-10">Loading transactions...</p>;

  return (
    <div className="space-y-2">
      {/* ==== Month-Year Dropdown ==== */}
      <div className="flex justify-end bg-">
        <div className="relative inline-block text-center">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="appearance-none bg-gray-800 border-none text-gray-100 text-center
                       text-3 font-medium rounded-md px-2 py-1 shadow-xm transition"
          >
            {uniqueMonths.map((month) => (
              <option key={month} value={month} className="text-gray-500 text-center">
                {month}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ==== Stats Cards ==== */}
      <StatCards stats={stats} cols="grid-cols-2 sm:grid-cols-2 lg:grid-cols-5" />

      {/* ==== Subcategory Breakdown ==== */}
      <div className="w-full flex flex-col lg:flex-row gap-3 mb-3">
        <div className="w-full lg:w-1/2">
          <CategoryBreakdown transactions={filteredTxns} />
        </div>
        <div className="w-full lg:w-1/2">
          <DailyTrendChart transactions={filteredTxns} />
        </div>
      </div>

      {/* ==== Recent Transactions ==== */}
      <div className="bg-transparent shadow-none border-none mb-3 rounded-xl">
        <RecentTransactions transactions={filteredTxns} setActiveTab={setActiveTab} />
      </div>
    </div>
  );
};

export default Overview;
