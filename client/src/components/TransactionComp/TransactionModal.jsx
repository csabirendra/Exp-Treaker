import React, { useEffect, useState } from "react";
import { X, ArrowLeftRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const TransactionModal = ({ isOpen, onClose, onSave, initialData }) => {
  const API_BASE_URL = "http://localhost:5002/api";

  const [form, setForm] = useState({
    CATEGORYID: "",
    SUBCATEGORYID: "",
    AMOUNT: "",
    DESCRIPTION: "",
    TRANSACTION_DATE: new Date().toISOString().split("T")[0],
  });

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [filteredSubs, setFilteredSubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});

  // ✅ Prefill form if editing
  useEffect(() => {
    if (initialData) {
      setForm((prev) => ({
        ...prev,
        CATEGORYID: initialData.CATEGORYID || "",
        SUBCATEGORYID: initialData.SUBCATEGORYID || "",
        AMOUNT: initialData.AMOUNT || "",
        DESCRIPTION: initialData.DESCRIPTION || "",
        TRANSACTION_DATE:
          initialData.TRANSACTION_DATE?.split("T")[0] ||
          new Date().toISOString().split("T")[0],
      }));
    }
  }, [initialData]);

  // ✅ Fetch categories & subcategories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, subRes] = await Promise.all([
          fetch(`${API_BASE_URL}/category/public`).then((r) => r.json()),
          fetch(`${API_BASE_URL}/subcategory/public`).then((r) => r.json()),
        ]);
        if (catRes.success) setCategories(catRes.category || []);
        if (subRes.success) setSubcategories(subRes.subcategory || []);
      } catch (err) {
        console.error("Error fetching categories/subcategories:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ✅ Filter subcategories when category changes
  useEffect(() => {
    if (form.CATEGORYID && subcategories.length > 0) {
      const filtered = subcategories.filter(
        (s) => String(s.CATEGORYID) === String(form.CATEGORYID)
      );
      setFilteredSubs(filtered);

      if (
        form.SUBCATEGORYID &&
        !filtered.some((s) => String(s.SUBCATEGORYID) === String(form.SUBCATEGORYID))
      ) {
        setForm((prev) => ({ ...prev, SUBCATEGORYID: "" }));
      }
    } else {
      setFilteredSubs([]);
      setForm((prev) => ({ ...prev, SUBCATEGORYID: "" }));
    }
  }, [form.CATEGORYID, subcategories]);

  // ✅ Close modal on ESC
  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && onClose();
    if (isOpen) document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = () => {
    const newErrors = {};
    if (!form.CATEGORYID) newErrors.CATEGORYID = "Category is required";
    if (!form.SUBCATEGORYID) newErrors.SUBCATEGORYID = "Subcategory is required";
    if (!form.AMOUNT) newErrors.AMOUNT = "Amount is required";
    if (!form.TRANSACTION_DATE) newErrors.TRANSACTION_DATE = "Date is required";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    onSave(form);
  };

  const handleOverlayClick = (e) => e.target.id === "overlay" && onClose();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id="overlay"
          className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50"
          onClick={handleOverlayClick}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* PC view */}
          <motion.div
            className="w-96 hidden lg:block bg-gray-800 rounded-xl shadow-lg max-w-md px-4 pt-3 pb-3 relative"
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-3 flex justify-between items-center p-1">
              <div className="text-lg font-semibold text-gray-300 flex items-center gap-2">
                <ArrowLeftRight className="w-8 h-8 text-green-700" />
                <span>{initialData ? " Edit Transaction" : " Add Transaction"}</span>
              </div>
              <button
                className="text-red-500 hover:text-red-700 transition border-none bg-gray-800"
                onClick={onClose}
              >
                <X className="h-7 w-7" />
              </button>
            </div>

            {loading ? (
              <p className="text-center text-gray-500">Loading...</p>
            ) : (
              <div className="space-y-3">
                {/* Category */}
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Category</label>
                  <select
                    name="CATEGORYID"
                    value={form.CATEGORYID}
                    onChange={handleChange}
                    className="w-full bg-gray-700 text-gray-300 rounded-lg px-3 py-2 text-sm border-none"
                  >
                    <option value="">-- Select --</option>
                    {categories.map((c) => (
                      <option key={c.CATEGORYID} value={c.CATEGORYID}>
                        {c.CATEGORY}
                      </option>
                    ))}
                  </select>
                  {errors.CATEGORYID && (
                    <p className="text-xs text-red-500 mt-1">{errors.CATEGORYID}</p>
                  )}
                </div>

                {/* Subcategory */}
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Subcategory</label>
                  <select
                    name="SUBCATEGORYID"
                    value={form.SUBCATEGORYID}
                    onChange={handleChange}
                    className="w-full bg-gray-700 text-gray-300 rounded-lg px-3 py-2 text-sm border-none"
                    disabled={!form.CATEGORYID}
                  >
                    <option value="">-- Select --</option>
                    {filteredSubs.map((s) => (
                      <option key={s.SUBCATEGORYID} value={s.SUBCATEGORYID}>
                        {s.SUBCATEGORY}
                      </option>
                    ))}
                  </select>
                  {errors.SUBCATEGORYID && (
                    <p className="text-xs text-red-500 mt-1">{errors.SUBCATEGORYID}</p>
                  )}
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Amount</label>
                  <input
                    type="text"
                    name="AMOUNT"
                    value={form.AMOUNT}
                    onChange={handleChange}
                    className="w-full bg-gray-700 text-gray-300 rounded-lg px-3 py-2 text-sm border-none"
                  />
                  {errors.AMOUNT && (
                    <p className="text-xs text-red-500 mt-1">{errors.AMOUNT}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Description</label>
                  <input
                    type="text"
                    name="DESCRIPTION"
                    value={form.DESCRIPTION}
                    onChange={handleChange}
                    className="w-full bg-gray-700 text-gray-300 rounded-lg px-3 py-2 text-sm border-none"
                  />
                </div>

                {/* Transaction Date */}
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Transaction Date</label>
                  <input
                    type="date"
                    name="TRANSACTION_DATE"
                    value={form.TRANSACTION_DATE}
                    onChange={handleChange}
                    className="w-full bg-gray-700 text-gray-300 rounded-lg px-3 py-2 text-sm border-none"
                  />
                  {errors.TRANSACTION_DATE && (
                    <p className="text-xs text-red-500 mt-1">{errors.TRANSACTION_DATE}</p>
                  )}
                </div>

                <div className="flex justify-end mt-4">
                  <button
                    onClick={handleSubmit}
                    className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm border-none"
                  >
                    {initialData ? "Update" : "Save"}
                  </button>
                </div>
              </div>
            )}
          </motion.div>





          {/* Mobile view */}
          <motion.div
            className="lg:hidden bg-gray-800 rounded-t-2xl shadow-lg w-full fixed bottom-0 left-0 p-4 pt-4"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-base font-italic text-gray-200">
                {initialData ? "Edit Transaction" : "Add Transaction"}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition border-none bg-transparent"
              >
                <X className="h-6 w-6 text-red" />
              </button>
            </div>

            {loading ? (
              <p className="text-center text-gray-500">Loading...</p>
            ) : (
              <div className="space-y-3 flex flex-col items-center">
                <select
                  name="CATEGORYID"
                  value={form.CATEGORYID}
                  onChange={handleChange}
                  className="w-80 borde-none bg-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="">Category</option>
                  {categories.map((c) => (
                    <option key={c.CATEGORYID} value={c.CATEGORYID}>
                      {c.CATEGORY}
                    </option>
                  ))}
                </select>

                <select
                  name="SUBCATEGORYID"
                  value={form.SUBCATEGORYID}
                  onChange={handleChange}
                  className="w-80 border-none bg-gray-300 rounded-lg px-3 py-2 text-sm"
                  disabled={!form.CATEGORYID}
                >
                  <option value="">Subcategory</option>
                  {filteredSubs.map((s) => (
                    <option key={s.SUBCATEGORYID} value={s.SUBCATEGORYID}>
                      {s.SUBCATEGORY}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  name="AMOUNT"
                  placeholder="Amount"
                  value={form.AMOUNT}
                  onChange={handleChange}
                  className="w-80 border-none bg-gray-300 rounded-lg px-3 py-2 text-sm"
                />

                <input
                  type="text"
                  name="DESCRIPTION"
                  placeholder="Description"
                  value={form.DESCRIPTION}
                  onChange={handleChange}
                  className="w-80 border-none bg-gray-300 rounded-lg px-3 py-2 text-sm"
                />

                <input
                  type="date"
                  name="TRANSACTION_DATE"
                  value={form.TRANSACTION_DATE}
                  onChange={handleChange}
                  className="w-80 border-none bg-gray-300 rounded-lg px-3 py-2 text-sm"
                />

                <button
                  onClick={handleSubmit}
                  className="w-50 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                >
                  {initialData ? "Update" : "Save"}
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TransactionModal;
