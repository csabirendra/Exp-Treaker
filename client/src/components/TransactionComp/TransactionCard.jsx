// src/components/TransactionComp/TransactionCard.jsx
import React from "react";
import { Trash2, Pencil } from "lucide-react";

const TransactionCard = ({ txn, onEdit, onDelete, formatDate }) => {
    return (
        <div className="bg-gray-900 py-2 h-auto md:py-5 md:bg-gray-800 py-0 shadow rounded-lg px-2 hover:shadow-md transition">

            { }
            <div className="hidden md:flex items-center justify-between bg-">
                {/* Left side */}
                <div className="flex flex-col gap-0 bg-">
                    <span
                        className={`font-semibold ${txn.CATEGORY?.toLowerCase() === "income"
                                ? "text-gray-100"
                                : "text-gray-400"
                            }`}
                        >{txn.DESCRIPTION}
                    </span>
                    <span className="text-xs text-gray-500">
                        {txn.SUBCATEGORY} - {formatDate(txn.TRANSACTION_DATE)}
                    </span>
                </div>

                {/* Right side */}
                <div className="flex items-center gap-5">
                    <span
                        className={`font-semibold text-m ${txn.CATEGORY?.toLowerCase() === "income"
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                    >
                        ₹{parseFloat(txn.AMOUNT).toLocaleString()}
                    </span>

                    <div className="flex gap-2">
                        <button
                            onClick={() => onEdit(txn)}
                            className="p-1 text-gray-400 border-none hover:text-blue-500 bg-transparent hover:bg-blue-50 rounded-lg transition"
                        >
                            <Pencil className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => onDelete(txn)}
                            className="p-1 text-gray-400 border-none hover:text-red-500 bg-transparent hover:bg-red-50 rounded-lg transition"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>





            {/* ✅ Mobile View */}
            <div className="flex justify-between gap- md:hidden">
                <div className="flex w-5/10 flex-col text-sm items-left bg--200 gap-2">
                    <span
                        className={` ${txn.CATEGORY?.toLowerCase() === "income"
                            ? "text-gray-200"
                            : "text-gray-400"
                            }`}>
                        {txn.DESCRIPTION}
                    </span>
                    <span className="text-xs font-roboto font-semibold text-gray-500 truncate">
                        {formatDate(txn.TRANSACTION_DATE)}
                    </span>
                </div>

                <div className="flex w-2/10 justify-between items-center text-xs text-gray-500 bg--200">
                    <span
                        className={` ${txn.CATEGORY?.toLowerCase() === "income"
                                ? "text-green-400"
                                : "text-red-500"
                            }`}>
                        ₹{parseFloat(txn.AMOUNT).toLocaleString()}
                    </span>
                </div>

                <div className="flex w-2/10 justify-end gap-3 items-center text-xs text-gray-500 bg--200">
                    <button
                        onClick={() => onEdit(txn)}
                        className="p-1 border-none bg-gray-900 text-gray-400 hover:text-blue-500 rounded-lg transition"
                    >
                        <Pencil className="w-4 h-4 text-blue-400" />
                    </button>
                    <button
                        onClick={() => onDelete(txn)}
                        className="p-1 border-none bg-gray-900 text-gray-400 hover:text-red-500  rounded-lg transition"
                    >
                        <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                </div>
            </div>

            
        </div>
    );
};

export default TransactionCard;
