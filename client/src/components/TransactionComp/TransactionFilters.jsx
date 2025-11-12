// src/components/TransactionComp/TransactionFilters.jsx
import React, { useState } from "react";
import { Calendar, ChevronDown, ChevronUp } from "lucide-react";
import FilterListAltIcon from '@mui/icons-material/FilterListAlt';

const TransactionFilters = ({
    dateRange,
    setDateRange,
    categoryFilter,
    setCategoryFilter,
    subCategoryFilter,
    setSubCategoryFilter,
    minAmount,
    setMinAmount,
    maxAmount,
    setMaxAmount,
    uniquecategory,
    uniqueSubcategory,
    description,
    setDescription,
    searchTerm = { searchTerm },
    setSearchTerm = { setSearchTerm }
}) => {


    const [isOpen, setIsOpen] = useState(false);


    return (
        <div className="bg-gray-800 p-1 rounded-lg">

            {/* ---------- DESKTOP FILTERS (md and up) ---------- */}
            <div className="hidden lg:flex justify-start pl-2 pt-1 mb-3">
                <span className="font-semibold text-gray-200 tracking-wide">Apply Filters</span>
            </div>

            <div className="hidden md:flex flex-col gap-2.5">

                {/* Search Box */}
                <div className="px-2">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search..."
                        className="w-full border-none bg-gray-400 rounded-lg px-3 py-1 text-sm focus:outline-none"
                    />
                </div>

                {/* Date Range */}
                <div className="px-2 flex gap-3">
                    <div className="flex flex-col flex-1">
                        <label className="text-xs font-medium text-gray-400 mb-1">From</label>
                        <input
                            type="date"
                            value={dateRange.from || ""}
                            onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                            className="w-full border-none bg-gray-400 rounded-md px-2 py-1 text-xs focus:outline-none"
                        />
                    </div>
                    <div className="flex flex-col flex-1">
                        <label className="text-xs font-medium text-gray-400 mb-1">To</label>
                        <input
                            type="date"
                            value={dateRange.to || ""}
                            onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                            className="w-full border-none bg-gray-400 rounded-md px-2 py-1 text-xs focus:outline-none"
                        />
                    </div>
                </div>

                {/* Category */}
                <div className="px-2">
                    <label className="text-xs font-medium text-gray-400 mb-1">Category</label>
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="w-full border-none bg-gray-400 rounded-md px-3 py-1 text-sm focus:outline-none"
                    >
                        <option value="">All</option>
                        {uniquecategory.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Min and Max Amount */}
                <div className="px-2 flex gap-3">
                    <div className="flex flex-col flex-1">
                        <label className="text-xs font-medium text-gray-400 mb-1">Min Amount</label>
                        <input
                            type="text"
                            value={minAmount}
                            onChange={(e) => setMinAmount(e.target.value)}
                            className="w-full border-none bg-gray-400 rounded-md px-3 py-1 text-sm focus:outline-none"
                            placeholder="0"
                        />
                    </div>
                    <div className="flex flex-col flex-1">
                        <label className="text-xs font-medium text-gray-400 mb-1">Max Amount</label>
                        <input
                            type="text"
                            value={maxAmount}
                            onChange={(e) => setMaxAmount(e.target.value)}
                            className="w-full border-none bg-gray-400 rounded-md px-3 py-1 text-sm focus:outline-none"
                            placeholder="0"
                        />
                    </div>
                </div>
            </div>

            {/* Clear Filters Button */}
            <div className="hidden lg:flex justify-end mt-3 mb-1 pr-2">
                <button
                    onClick={() => {
                        setSearchTerm("");
                        setDateRange({ from: "", to: "" });
                        setCategoryFilter("");
                        setSubCategoryFilter("");
                        setMinAmount("");
                        setMaxAmount("");
                    }}
                    className="bg-red-600 border-none text-white px-3 py-1 rounded-md text-xs font-medium hover:bg-red-500 transition"
                >
                    Clear Filters
                </button>
            </div>



            {/* ---------- MOBILE FILTERS (below md) ---------- */}



            <div className="md:hidden bg-gray-800 rounded-lg ">
                {/* Accordion Toggle */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full border-none flex items-center justify-between bg-gray-800 py-2 rounded-lg text-gray-100 font-medium"
                >
                    <span>Apply Filters</span>
                    {isOpen ? (
                        <ChevronUp className="w-5 h-5" />
                    ) : (
                        <ChevronDown className="w-5 h-5" />
                    )}
                </button>

                {/* Accordion Content */}
                {isOpen && (
                    <div
                        className={`bg-gray-700 mt-2 rounded-lg p-2 transition-all duration-20000 ease-in-out overflow-hidden ${isOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"}`}>
                        {/* Search Box */}
                        <div className="w-full mb-2">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search..."
                                className="w-full border-none rounded-lg px-3 py-2 text-sm bg-gray-400 text-gray-200"
                            />
                        </div>

                        {/* Date Range */}
                        <div className="flex gap-2 mb-2">
                            <div className="w-1/2">
                                <label className="text-xs font-medium text-gray-200">From</label>
                                <input
                                    type="date"
                                    value={dateRange.from || ""}
                                    onChange={(e) =>
                                        setDateRange({ ...dateRange, from: e.target.value })
                                    }
                                    className="w-full border-none rounded-md px-2 py-1 text-xs bg-gray-200"
                                />
                            </div>
                            <div className="w-1/2">
                                <label className="text-xs font-medium text-gray-200">To</label>
                                <input
                                    type="date"
                                    value={dateRange.to || ""}
                                    onChange={(e) =>
                                        setDateRange({ ...dateRange, to: e.target.value })
                                    }
                                    className="w-full border-none rounded-md px-2 py-1 text-xs bg-gray-200"
                                />
                            </div>
                        </div>

                        {/* Category */}
                        <div className="mb-2">
                            <label className="text-xs font-medium text-gray-200 mb-2">Category</label>
                            <select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                className="w-full border-none bg-gray-200 rounded-md px-2 py-1 text-sm focus:border-none"
                            >
                                <option value="">All</option>
                                {uniquecategory.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Min & Max Amount */}
                        <div className="flex gap-2 mb-2">
                            <div className="w-1/2">
                                <label className="text-xs font-medium text-gray-200 mb-2">
                                    Min Amount
                                </label>
                                <input
                                    type="number"
                                    value={minAmount}
                                    onChange={(e) => setMinAmount(e.target.value)}
                                    className="w-full border-none bg-gray-200 rounded-md px-2 py-1 text-sm"
                                    placeholder="0"
                                />
                            </div>
                            <div className="w-1/2">
                                <label className="text-xs font-medium text-gray-200 mb-2">
                                    Max Amount
                                </label>
                                <input
                                    type="number"
                                    value={maxAmount}
                                    onChange={(e) => setMaxAmount(e.target.value)}
                                    className="w-full border-none bg-gray-200 rounded-md px-2 py-1 text-sm"
                                    placeholder="0"
                                />
                            </div>
                        </div>

                        {/* Clear Button */}
                        <div className="flex justify-end">
                            <button
                                onClick={() => {
                                    setSearchTerm("");
                                    setDateRange({ from: "", to: "" });
                                    setCategoryFilter("");
                                    setSubCategoryFilter("");
                                    setMinAmount("");
                                    setMaxAmount("");
                                }}
                                className="bg-red-700 border-none text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-red-600 transition"
                            >
                                Clear Filters
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TransactionFilters;
