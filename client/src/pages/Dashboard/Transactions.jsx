import React, { useState } from "react";
import { Trash2, Pencil, Plus } from "lucide-react";
import ConfirmDeleteModal from "../../components/TransactionComp/ConfirmDeleteModal";
import TransactionModal from "../../components/TransactionComp/TransactionModal";
import TransactionFilters from "../../components/TransactionComp/TransactionFilters";
import TransactionSorting from "../../components/TransactionComp/TransactionSorting";
import { useTransactions } from "../../hooks/useTransactions";

const Transactions = () => {
  const { transactions, loading, handleSave, handleDelete } = useTransactions();

  const [deleteTxn, setDeleteTxn] = useState(null);
  const [editTxn, setEditTxn] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ✅ Filters
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [categoryFilter, setCategoryFilter] = useState("");
  const [subCategoryFilter, setSubCategoryFilter] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [searchTerm, setSearchTerm] = useState("");


  // ✅ Apply Filters
  const filteredTransactions = transactions.filter((t) => {
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
      ? t.DESCRIPTION?.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    return dateMatch && categoryMatch && subCategoryMatch && amountMatch && searchMatch;
  });


  // ✅ Unique dropdowns
  const uniquecategory = [...new Set(transactions.map((t) => t.CATEGORY))];
  const uniqueSubcategory = [...new Set(transactions.map((t) => t.SUBCATEGORY))];

  return (
    <div className="bg--100 min-h-screen">
      <div className="w-100 flex justify-between items-center mb-2">
        {/* <div className="relative w-full md:w-64 hidden lg:flex">Transactions</div> */}
      </div>

      <div className="bg-100">
        <div className="flex flex-col md:flex-row gap-3">
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

          {/* Mobile View */}
          <div className="lg:hidden mb-0">
            <TransactionSorting
              onExport={(format) => handleExport(format)}
              onSortChange={(sort) => setSortConfig(sort)}
            />
          </div>




          {/* Transactions List */}
          <div className="md:w-1/4 lg:w-5/7 space-y-2 pb-3 bg--300">
            {loading && (
              <p className="text-gray-500 text-center">Loading...</p>
              
            )}
            <div className="hidden lg:flex">
              <TransactionSorting
                onExport={(format) => handleExport(format)}
                onSortChange={(sort) => setSortConfig(sort)}
              />
            </div>

            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((t) => (
                <div
                  key={t.TRANSACTIONID}
                  className="bg-white shadow rounded-lg py-1 px-3 flex justify-between items-center"
                >
                  <div>
                    <span className="text-sm font-semibold text-gray-800">
                      {t.DESCRIPTION} -{" "}
                    </span>
                    <span
                      className={`text-m ${t.CATEGORY?.toLowerCase() === "income"
                          ? "text-green-600"
                          : "text-red-600"
                        }`}
                    >
                      ₹{parseFloat(t.AMOUNT).toLocaleString()}
                    </span>
                    <br />
                    <span className="text-xs text-gray-400">
                      {t.SUBCATEGORY} ~
                    </span>
                    <span className="text-xs text-gray-600">
                      {" "}
                      {new Date(t.TRANSACTION_DATE).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => {
                        setEditTxn(t);
                        setIsModalOpen(true);
                      }}
                      className="p-1 text-gray-400 border-none bg-white hover:text-blue-500 hover:bg-blue-50 rounded-lg transition"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteTxn(t)}
                      className="p-1 text-gray-400 border-none bg-white hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-4">
                No transactions found
              </p>
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
