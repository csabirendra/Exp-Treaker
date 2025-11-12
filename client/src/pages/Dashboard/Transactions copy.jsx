import React, { useState } from "react";
import ConfirmDeleteModal from "../../components/TransactionComp/ConfirmDeleteModal";
import TransactionModal from "../../components/TransactionComp/TransactionModal";
import TransactionFilters from "../../components/TransactionComp/TransactionFilters";
import TransactionSorting from "../../components/TransactionComp/TransactionSorting";
import { useTransactions } from "../../hooks/useTransactions";
import TransactionCard from "../../components/TransactionComp/TransactionCard";

const Transactions = () => {
  const { transactions, loading, handleSave, handleDelete } = useTransactions();

  const [deleteTxn, setDeleteTxn] = useState(null);
  const [editTxn, setEditTxn] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatDate = (Datestr) => {
    const d = new Date(Datestr);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0"); // ✅ fixed month
    const year = d.getFullYear();
    return `${day}.${month}.${year}`;
  };

  // Sorting
  const [sortConfig, setSortConfig] = useState({ sortBy: "", order: "" });


  // ✅ Dummy Transactions
  const dummyTransactions = [
  {
    TRANSACTIONID: "1",
    DESCRIPTION: "Grocery Shopping",
    CATEGORY: "Expense",
    SUBCATEGORY: "Food",
    AMOUNT: 1200,
    TRANSACTION_DATE: "2025-09-20",
  },
  {
    TRANSACTIONID: "2",
    DESCRIPTION: "Salary",
    CATEGORY: "Income",
    SUBCATEGORY: "Job",
    AMOUNT: 45000,
    TRANSACTION_DATE: "2025-09-01",
  },
  {
    TRANSACTIONID: "3",
    DESCRIPTION: "Petrol",
    CATEGORY: "Expense",
    SUBCATEGORY: "Travel",
    AMOUNT: 1800,
    TRANSACTION_DATE: "2025-09-18",
  },
  {
    TRANSACTIONID: "4",
    DESCRIPTION: "Electricity Bill",
    CATEGORY: "Expense",
    SUBCATEGORY: "Utilities",
    AMOUNT: 2200,
    TRANSACTION_DATE: "2025-09-10",
  },
  {
    TRANSACTIONID: "5",
    DESCRIPTION: "Dinner at Restaurant",
    CATEGORY: "Expense",
    SUBCATEGORY: "Food",
    AMOUNT: 950,
    TRANSACTION_DATE: "2025-09-12",
  },
  {
    TRANSACTIONID: "6",
    DESCRIPTION: "Gym Membership",
    CATEGORY: "Expense",
    SUBCATEGORY: "Health",
    AMOUNT: 2500,
    TRANSACTION_DATE: "2025-09-03",
  },
  {
    TRANSACTIONID: "7",
    DESCRIPTION: "Freelance Payment",
    CATEGORY: "Income",
    SUBCATEGORY: "Side Hustle",
    AMOUNT: 15000,
    TRANSACTION_DATE: "2025-09-07",
  },
  {
    TRANSACTIONID: "8",
    DESCRIPTION: "Movie Tickets",
    CATEGORY: "Expense",
    SUBCATEGORY: "Entertainment",
    AMOUNT: 600,
    TRANSACTION_DATE: "2025-09-09",
  },
  {
    TRANSACTIONID: "9",
    DESCRIPTION: "Laptop Purchase",
    CATEGORY: "Expense",
    SUBCATEGORY: "Electronics",
    AMOUNT: 56000,
    TRANSACTION_DATE: "2025-09-05",
  },
  {
    TRANSACTIONID: "10",
    DESCRIPTION: "Cab Ride",
    CATEGORY: "Expense",
    SUBCATEGORY: "Travel",
    AMOUNT: 350,
    TRANSACTION_DATE: "2025-09-14",
  },
  {
    TRANSACTIONID: "11",
    DESCRIPTION: "Mobile Recharge",
    CATEGORY: "Expense",
    SUBCATEGORY: "Utilities",
    AMOUNT: 499,
    TRANSACTION_DATE: "2025-09-02",
  },
  {
    TRANSACTIONID: "12",
    DESCRIPTION: "Sold Old Bike",
    CATEGORY: "Income",
    SUBCATEGORY: "Sale",
    AMOUNT: 35000,
    TRANSACTION_DATE: "2025-09-11",
  },
  {
    TRANSACTIONID: "13",
    DESCRIPTION: "Gift to Friend",
    CATEGORY: "Expense",
    SUBCATEGORY: "Personal",
    AMOUNT: 2000,
    TRANSACTION_DATE: "2025-09-13",
  },
  {
    TRANSACTIONID: "14",
    DESCRIPTION: "Bonus",
    CATEGORY: "Income",
    SUBCATEGORY: "Job",
    AMOUNT: 10000,
    TRANSACTION_DATE: "2025-09-15",
  },
  {
    TRANSACTIONID: "15",
    DESCRIPTION: "Car Service",
    CATEGORY: "Expense",
    SUBCATEGORY: "Maintenance",
    AMOUNT: 7500,
    TRANSACTION_DATE: "2025-09-16",
  },
  {
    TRANSACTIONID: "16",
    DESCRIPTION: "Online Shopping",
    CATEGORY: "Expense",
    SUBCATEGORY: "Clothing",
    AMOUNT: 3200,
    TRANSACTION_DATE: "2025-09-08",
  },
  {
    TRANSACTIONID: "17",
    DESCRIPTION: "Coffee",
    CATEGORY: "Expense",
    SUBCATEGORY: "Food",
    AMOUNT: 150,
    TRANSACTION_DATE: "2025-09-06",
  },
  {
    TRANSACTIONID: "18",
    DESCRIPTION: "Concert Ticket",
    CATEGORY: "Expense",
    SUBCATEGORY: "Entertainment",
    AMOUNT: 2500,
    TRANSACTION_DATE: "2025-09-17",
  },
  {
    TRANSACTIONID: "19",
    DESCRIPTION: "Water Bill",
    CATEGORY: "Expense",
    SUBCATEGORY: "Utilities",
    AMOUNT: 800,
    TRANSACTION_DATE: "2025-09-19",
  },
  {
    TRANSACTIONID: "20",
    DESCRIPTION: "Interest Income",
    CATEGORY: "Income",
    SUBCATEGORY: "Bank",
    AMOUNT: 1200,
    TRANSACTION_DATE: "2025-09-04",
  },
];


  // 🔹 Switch between LIVE & DUMMY
  const txnSource = transactions;   // 👉 LIVE DATA
  // const txnSource = dummyTransactions; // 👉 DUMMY DATA

  // ✅ Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [categoryFilter, setCategoryFilter] = useState("");
  const [subCategoryFilter, setSubCategoryFilter] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");

  // ✅ Apply Filters
  const filteredTransactions = txnSource.filter((t) => {
    const dateMatch =
      (!dateRange.from ||
        new Date(t.TRANSACTION_DATE) >= new Date(dateRange.from)) &&
      (!dateRange.to ||
        new Date(t.TRANSACTION_DATE) <= new Date(dateRange.to));

    const categoryMatch = categoryFilter ? t.CATEGORY === categoryFilter : true;
    const subCategoryMatch = subCategoryFilter
      ? t.SUBCATEGORY === subCategoryFilter
      : true;

    const amountMatch =
      (!minAmount || t.AMOUNT >= parseFloat(minAmount)) &&
      (!maxAmount || t.AMOUNT <= parseFloat(maxAmount));

    const searchMatch = searchTerm
      ? t.DESCRIPTION?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.SUBCATEGORY?.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    return (
      dateMatch && categoryMatch && subCategoryMatch && amountMatch && searchMatch
    );
  });


  let finalTransactions = [...filteredTransactions];

  if (sortConfig.sortBy) {
  finalTransactions.sort((a, b) => {
    if (sortConfig.sortBy === "date") {
      return sortConfig.order === "asc"
        ? new Date(a.TRANSACTION_DATE) - new Date(b.TRANSACTION_DATE)
        : new Date(b.TRANSACTION_DATE) - new Date(a.TRANSACTION_DATE);
    }
    if (sortConfig.sortBy === "amount") {
      return sortConfig.order === "asc"
        ? parseFloat(a.AMOUNT) - parseFloat(b.AMOUNT)
        : parseFloat(b.AMOUNT) - parseFloat(a.AMOUNT);
    }
    return 0;
  });
}



  // ✅ Unique dropdowns
  const uniquecategory = [...new Set(txnSource.map((t) => t.CATEGORY))];
  const uniqueSubcategory = [...new Set(txnSource.map((t) => t.SUBCATEGORY))];

  return (
    <div className="bg-black md:bg-gray-100 min-h-screen">
      <div className="w-100 flex justify-between items-center mb-2"></div>

      <div className="bg-100">
        <div className="flex flex-col md:flex-row gap-3">

          {/* Mobile View */}
          <div className="lg:hidden mb-0">
            <TransactionSorting
              onExport={(format) => handleExport(format)}
              transactions={txnSource}
              filteredTransactions={filteredTransactions}
              onSortChange={(sort) => setSortConfig(sort)}
            />
          </div>


          {/* Filters */}
          <div className="md:w-1/4 lg:w-2/7">
            <TransactionFilters
              dateRange={dateRange}
              setDateRange={setDateRange}
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
              subCategoryFilter={subCategoryFilter}
              setSubCategoryFilter={setSubCategoryFilter}
              minAmount={minAmount}
              setMinAmount={setMinAmount}
              maxAmount={maxAmount}
              setMaxAmount={setMaxAmount}
              uniquecategory={uniquecategory}
              uniqueSubcategory={uniqueSubcategory}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
          </div>


          {/* Transactions List */}
          <div className="md:w-1/4 lg:w-5/7 space-y-2 pb-5">
            {loading && (
              <p className="text-gray-500 text-center">Loading...</p>
            )}


            {/* ✅ Sorting Top bar (Desktop only) */}
            <div className="hidden lg:flex mb-2">
              <TransactionSorting
                onExport={(format) => handleExport(format)}
                transactions={txnSource}
                filteredTransactions={filteredTransactions}
                onSortChange={(sort) => setSortConfig(sort)}
              />
            </div>

            {finalTransactions.length > 0 ? (
              finalTransactions.map((t) => (
                <TransactionCard
                  key={t.TRANSACTIONID}
                  txn={t}
                  formatDate={formatDate}
                  onEdit={(txn) => {
                    setEditTxn(txn);
                    setIsModalOpen(true);
                  }}
                  onDelete={(txn) => setDeleteTxn(txn)}
                />
              ))
            ) : (
              <p className="text-center text-gray-500 py-4">No transactions found</p>
            )}

          </div>
        </div>
      </div>

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        isOpen={!!deleteTxn}
        onClose={() => setDeleteTxn(null)}
        onConfirm={() => {
          if (deleteTxn) {
            handleDelete(deleteTxn.TRANSACTIONID, () => setDeleteTxn(null));
          }
        }}
        onEditInstead={() => {
          setEditTxn(deleteTxn);
          setDeleteTxn(null);
          setIsModalOpen(true);
        }}
      />

      {/* Transaction Modal */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditTxn(null);
        }}
        onSave={(formData) =>
          handleSave(formData, editTxn, () => {
            setIsModalOpen(false);
            setEditTxn(null);
          })
        }
        initialData={editTxn}
      />
    </div>
  );
};

export default Transactions;
