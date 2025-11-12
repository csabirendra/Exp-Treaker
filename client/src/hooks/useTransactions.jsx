import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const API_BASE_URL = "http://localhost:5002/api";
const getToken = () => localStorage.getItem("token");
const getUSERID = () => localStorage.getItem("USERID");

export const useTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch Transactions
  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const USERID = getUSERID();
      const token = getToken();

      const resp = await fetch(`${API_BASE_URL}/transactions?USERID=${USERID}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await resp.json();
      if (data.success) {
        const sorted = [...(data.transactions || [])].sort(
          (a, b) => new Date(b.TRANSACTION_DATE) - new Date(a.TRANSACTION_DATE)
        );
        setTransactions(sorted);
      }
    } catch (err) {
      console.error("Error fetching transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Save / Update Transaction
  const handleSave = async (formData, editTxn, closeModal) => {
    try {
      const categoryObj = transactions.find(
        (t) => String(t.CATEGORYID) === String(formData.CATEGORYID)
      );
      const categoryName = categoryObj?.CATEGORY || "";

      const totalIncome = transactions
        .filter((t) => t.CATEGORY?.toLowerCase() === "income")
        .reduce((sum, t) => sum + parseFloat(t.AMOUNT), 0);

      const totalExpense = transactions
        .filter((t) => t.CATEGORY?.toLowerCase() === "expense")
        .reduce((sum, t) => sum + parseFloat(t.AMOUNT), 0);

      const totalSaving = totalIncome - totalExpense;

      if (
        categoryName.toLowerCase() === "expense" &&
        parseFloat(formData.AMOUNT) > totalSaving
      ) {
        toast.error("❌ Expense cannot be greater than your total savings!");
        return;
      }

      const token = getToken();
      const USERID = getUSERID();

      const url = editTxn
        ? `${API_BASE_URL}/transactions/${editTxn.TRANSACTIONID}`
        : `${API_BASE_URL}/transactions/add`;

      const method = editTxn ? "PUT" : "POST";

      const resp = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, USERID }),
      });

      const data = await resp.json();
      if (data.success) {
        if (closeModal) closeModal();
        fetchTransactions();
        toast.success(
          editTxn
            ? "Transaction updated successfully!"
            : "Transaction added successfully!"
        );
      }
    } catch (err) {
      console.error("Error saving transaction:", err);
      toast.error("❌ Something went wrong while saving transaction.");
    }
  };

  // ✅ Delete Transaction
  const handleDelete = async (transactionId, closeModal) => {
    try {
      const token = getToken();

      const resp = await fetch(`${API_BASE_URL}/transactions/${transactionId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await resp.json();
      if (data.success) {
        if (closeModal) closeModal();
        fetchTransactions();
        toast.success("Transaction deleted successfully!");
      }
    } catch (err) {
      console.error("Error deleting transaction:", err);
      toast.error("❌ Something went wrong while deleting transaction.");
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return {
    transactions,
    loading,
    fetchTransactions,
    handleSave,
    handleDelete,
  };
};
