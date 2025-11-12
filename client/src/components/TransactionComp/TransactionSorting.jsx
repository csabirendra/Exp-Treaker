// src/components/TransactionComp/TransactionSorting.jsx
import React from "react";
import { FileSpreadsheet, FileText } from "lucide-react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

const TransactionSorting = ({ transactions, filteredTransactions, onSortChange }) => {
  const handleExport = (format) => {
    const exportData =
      filteredTransactions.length > 0 ? filteredTransactions : transactions;

    if (exportData.length === 0) {
      alert("❌ No transactions to export!");
      return;
    }

    const dateStr = new Date().toISOString().split("T")[0]; // yyyy-mm-dd

    if (format === "csv") {
      const worksheet = XLSX.utils.json_to_sheet(
        exportData.map((t) => ({
          Date: new Date(t.TRANSACTION_DATE).toLocaleDateString(),
          Category: t.CATEGORY,
          Description: t.DESCRIPTION,
          Amount: `${parseFloat(t.AMOUNT).toLocaleString()}`,
        }))
      );
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");
      XLSX.writeFile(workbook, `transactions_${dateStr}.csv`);
    }

    if (format === "pdf") {
      const doc = new jsPDF();
      const tableColumn = ["Description", "Category", "Subcategory", "Amount", "Date"];
      const tableRows = exportData.map((t) => [
        t.DESCRIPTION,
        t.CATEGORY,
        t.SUBCATEGORY || "-",
        `${parseFloat(t.AMOUNT).toLocaleString()}`,
        new Date(t.TRANSACTION_DATE).toLocaleDateString(),
      ]);

      doc.text("Transactions Report", 14, 10);
      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 20,
      });
      doc.save(`transactions_${dateStr}.pdf`);
    }
  };

  return (
    <div className="bg-gray-transparent lg:bg-black w-full mb-3 rounded-md ">
      {/* --------- DESKTOP VIEW --------- */}
      <div className="hidden md:flex justify-between items-center">
        {/* Export buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => handleExport("csv")}
            className="flex items-center border-none gap-1 px-2 py-1 bg-gray-800 hover:bg-gray-500 rounded-md text-xs text-gray-300 transition"
            ><FileSpreadsheet size={16} className="text-green-600" /> .csv
          </button>
          <button
            onClick={() => handleExport("pdf")}
            className="flex items-center border-none gap-1 px-2 py-1 bg-gray-800 hover:bg-gray-500 rounded-md text-xs text-gray-300 transition"
            ><FileText size={16} className="text-red-600" /> .pdf
          </button>
        </div>

        {/* Sorting dropdown */}
        <div>
          <select
            defaultValue=""
            onChange={(e) => {
              const [sortBy, order] = e.target.value.split("-");
              onSortChange({ sortBy, order });
            }}
            className="px-2 py-1 bg-gray-800 hover:bg-gray-800 rounded-md text-xs text-gray-300 border-none focus:outline-none transition"
          >
            <option value="" disabled>
              Sort By
            </option>
            <option value="date-desc">Newest</option>
            <option value="date-asc">Oldest</option>
            <option value="amount-desc">High → Low</option>
            <option value="amount-asc">Low → High</option>
          </select>
        </div>
      </div>

      {/* --------- MOBILE VIEW --------- */}
      <div className="flex flex-wrap items-center justify-between gap-2 md:hidden mt-1">
        {/* Export */}
        <div className="flex gap-2">
          <button
            onClick={() => handleExport("csv")}
            className="flex items-center border-none bg-gray-800 gap-1 px-2 py-1 rounded-md text-xs text-gray-100 transition"
          >
            <FileSpreadsheet size={14} className="text-green-600" />.csv
          </button>
          <button
            onClick={() => handleExport("pdf")}
            className="flex items-center border-none bg-gray-800 gap-1 px-2 py-1 rounded-md text-xs text-gray-100 transition"
          >
            <FileText size={14} className="text-red-600" />.pdf
          </button>
        </div>

        {/* Sort dropdown */}
        <div>
          <select
            defaultValue=""
            onChange={(e) => {
              const [sortBy, order] = e.target.value.split("-");
              onSortChange({ sortBy, order });
            }}
            className="px-1 py-1 bg-gray-800 border-none rounded-md text-xs text-gray-100 focus:outline-none"
          >
            <option value="" disabled>
              Sort
            </option>
            <option value="date-desc">Newest</option>
            <option value="date-asc">Oldest</option>
            <option value="amount-desc">High → Low</option>
            <option value="amount-asc">Low → High</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default TransactionSorting;
