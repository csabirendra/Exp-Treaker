// src/components/OverviewComp/RecentTransactions.jsx

import React, { useState, useEffect } from "react";
import { Pencil, PlusCircle, Wifi, Plug } from "lucide-react";
import Lottie from "lottie-react";
import axios from "axios";
import { subcategoryIcons } from "../../config/subcategoryIcons";
import transactionIcon from "../../assets/animations/transaction.json";
import TransactionModal from "../TransactionComp/TransactionModal"; // 🔹 imported your modal
import API_BASE_URL from "../../config/api";


const RecentTransactions = ({ transactions: parentTxns = [], setActiveTab }) => {
  const [useDummy, setUseDummy] = useState(false);
  const [liveTransactions, setLiveTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTxn, setEditTxn] = useState(null);

  // ✅ Dummy data
  const dummyTxns = [
    { TRANSACTIONID: "1", SUBCATEGORY: "Fuel", CATEGORY: "expense", AMOUNT: 1500, TRANSACTION_DATE: "2025-09-01", DESCRIPTION: "Petrol" },
    { TRANSACTIONID: "2", SUBCATEGORY: "Salary", CATEGORY: "income", AMOUNT: 25000, TRANSACTION_DATE: "2025-09-01", DESCRIPTION: "Monthly salary" },
    { TRANSACTIONID: "3", SUBCATEGORY: "Grocery", CATEGORY: "expense", AMOUNT: 3200, TRANSACTION_DATE: "2025-09-02", DESCRIPTION: "Big Bazaar" },
    { TRANSACTIONID: "4", SUBCATEGORY: "Bonus", CATEGORY: "income", AMOUNT: 5000, TRANSACTION_DATE: "2025-09-03", DESCRIPTION: "Quarterly Bonus" },
    { TRANSACTIONID: "5", SUBCATEGORY: "House Rent", CATEGORY: "expense", AMOUNT: 12000, TRANSACTION_DATE: "2025-09-04", DESCRIPTION: "September Rent" },
  ];

  // ✅ Fetch Live Transactions
  useEffect(() => {
    const fetchLiveTransactions = async () => {
      try {
        setLoading(true);
        const USERID = localStorage.getItem("USERID");
        const token = localStorage.getItem("token");

        const res = await axios.get("http://localhost:5002/api/transactions/recent", {
          headers: { Authorization: `Bearer ${token}` },
          params: { USERID, limit: 5 },
        });

        if (res.data.success) {
          setLiveTransactions(res.data.transactions || []);
        }
      } catch (err) {
        console.error("Error fetching live transactions:", err);
      } finally {
        setLoading(false);
      }
    };

    if (!useDummy) fetchLiveTransactions();
  }, [useDummy]);

  // ✅ Final display data
  const recentTxns = useDummy
    ? dummyTxns
    : liveTransactions.length
    ? liveTransactions
    : parentTxns.slice(-5).reverse();

  // ✅ Modal handlers
  const handleEditClick = (txn) => {
    setEditTxn(txn);
    setIsModalOpen(true);
  };

  const handleAddClick = () => {
    setEditTxn(null);
    setIsModalOpen(true);
  };

  const handleSave = async (form) => {
    try {
      const token = localStorage.getItem("token");
      const USERID = localStorage.getItem("USERID");

      const body = { ...form, USERID };

      const res = await axios.post("http://localhost:5002/api/transactions/save", body, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        console.log("Transaction saved successfully");
        setIsModalOpen(false);
        // refetch after save
        if (!useDummy) {
          const refresh = await axios.get("http://localhost:5002/api/transactions/recent", {
            headers: { Authorization: `Bearer ${token}` },
            params: { USERID, limit: 5 },
          });
          if (refresh.data.success) setLiveTransactions(refresh.data.transactions);
        }
      } else {
        alert(res.data.message || "Error saving transaction");
      }
    } catch (err) {
      console.error("Save Error:", err);
      alert("Failed to save transaction");
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-3 py-2 bg-gray-400 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Lottie animationData={transactionIcon} loop autoplay className="h-6 w-6" />
          <span className="text-base font-semibold text-gray-800">
            Recent Transactions
          </span>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          {/* 🔘 Toggle Switch */}
          <button
            onClick={() => setUseDummy(!useDummy)}
            className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs transition ${
              useDummy
                ? "bg-yellow-200 text-yellow-800"
                : "bg-green-200 text-green-800"
            }`}
          >
            {useDummy ? (
              <>
                <Plug className="w-3 h-3" /> Dummy
              </>
            ) : (
              <>
                <Wifi className="w-3 h-3" /> Live
              </>
            )}
          </button>

          {/* ➕ Add Button */}
          <button
            onClick={handleAddClick}
            className="flex items-center gap-1 text-xs bg-blue-600 text-white px-2 py-1 rounded-md hover:bg-blue-700"
          >
            <PlusCircle className="w-3 h-3" />
            Add
          </button>
        </div>
      </div>

      {/* Transactions */}
      {loading ? (
        <p className="text-center text-gray-400 py-6 text-sm">Loading transactions...</p>
      ) : (
        <div className="divide-y pb-2">
          {recentTxns.length > 0 ? (
            recentTxns.map((txn) => {
              const Icon = subcategoryIcons[txn.SUBCATEGORY];
              const isIncome = txn.CATEGORY?.toLowerCase() === "income";
              return (
                <div
                  key={txn.TRANSACTIONID}
                  className="flex items-center justify-between px-3 py-3 text-sm transition-all"
                >
                  <div className="flex items-center gap-2 min-w-0 bg- w-25">
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center ${
                        isIncome ? "bg-green-50" : "bg-red-50"
                      }`}
                    >
                      {Icon ? (
                        <Icon
                          className={`h-4 w-4 ${
                            isIncome ? "text-green-600" : "text-red-600"
                          }`}
                        />
                      ) : (
                        <span className="text-gray-400 text-xs">•</span>
                      )}
                    </div>

                    <div className="flex flex-col leading-tight">
                      <span className="truncate text-gray-100 text-xs sm:text-sm font-medium">
                        {txn.DESCRIPTION}
                      </span>
                      <span className="truncate text-gray-400 text-[11px]">
                        {txn.TRANSACTION_DATE.split("T")[0]}
                      </span>
                    </div>
                  </div>

                  <div className=" text-gray-400 text-xs sm:text-sm mr-4 bg- w-25 pl-12">
                    <span>{txn.CATEGORY}</span>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 w-25 bg- justify-between">
                    <span
                      className={`font-semibold text-xs sm:text-sm ${
                        isIncome ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {isIncome ? "+" : "-"}₹{txn.AMOUNT.toLocaleString()}
                    </span>

                    <button
                      className="text-gray-400 bg-transparent hover:text-blue-500 transition border-none"
                      onClick={() => handleEditClick(txn)}
                    >
                      <Pencil className="h-4 w-4 text-blue-300 hover:text-blue-600 transition" />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-xs sm:text-sm text-gray-500 text-center py-4">
              No transactions available
            </p>
          )}
        </div>
      )}

      {/* 🟩 Transaction Modal (edit/add) */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={editTxn}
      />
    </div>
  );
};

export default RecentTransactions;
