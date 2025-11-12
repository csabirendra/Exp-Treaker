import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
} from "recharts";

const Analytics = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = "http://localhost:5002/api";
  const getToken = () => localStorage.getItem("token");
  const getUSERID = () => {
    const userData = localStorage.getItem("userData");
    return userData ? JSON.parse(userData).USERID : null;
  };

  // ✅ Fetch Transactions
  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const USERID = getUSERID();
      const token = getToken();
      if (!USERID || !token) return;

      const resp = await fetch(`${API_BASE_URL}/transactions?USERID=${USERID}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await resp.json();
      if (data.success) setTransactions(data.transactions || []);
    } catch (err) {
      console.error("Error fetching transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // ✅ Last 6 Months Data
  const last6Months = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthStr = date.toLocaleDateString("en", { month: "short" });

    const monthlyIncome = transactions
      .filter(
        (t) =>
          new Date(t.TRANSACTION_DATE).getMonth() === date.getMonth() &&
          t.TYPE === "INCOME"
      )
      .reduce((sum, t) => sum + parseFloat(t.AMOUNT || 0), 0);

    const monthlyExpense = transactions
      .filter(
        (t) =>
          new Date(t.TRANSACTION_DATE).getMonth() === date.getMonth() &&
          t.TYPE === "EXPENSE"
      )
      .reduce((sum, t) => sum + parseFloat(t.AMOUNT || 0), 0);

    last6Months.push({
      month: monthStr,
      income: monthlyIncome,
      expense: monthlyExpense,
      balance: monthlyIncome - monthlyExpense,
    });
  }

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold text-gray-800">Analytics</h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading charts...</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 🔹 Bar Chart - Income vs Expense */}
          <div className="bg-white rounded-xl p-4 shadow">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Income vs Expenses
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={last6Months}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip formatter={(v) => `₹${v.toLocaleString()}`} />
                <Bar dataKey="income" fill="#10B981" name="Income" />
                <Bar dataKey="expense" fill="#EF4444" name="Expense" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* 🔹 Line Chart - Net Balance */}
          <div className="bg-white rounded-xl p-4 shadow">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Net Balance Trend
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={last6Months}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip formatter={(v) => `₹${v.toLocaleString()}`} />
                <Line
                  type="monotone"
                  dataKey="balance"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
