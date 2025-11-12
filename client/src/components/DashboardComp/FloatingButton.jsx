// src/components/DashboardComp/FloatingButton.jsx
import React, { useState } from "react";
import { Plus, X, BarChart2, Moon, FilePlus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";




const FloatingButton = ({
  onAddTransaction,
  onShowSummary,
  onToggleDarkMode,
  bgClass = "from-blue-500 to-purple-600", // 👈 custom bg
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-5 lg:bottom-25 right-6 z-50 flex flex-col items-end gap-3">
      {/* Mini Buttons */}
      <AnimatePresence>
        {open && (
          <>
            {/* Add Transaction */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
              onClick={onAddTransaction}
              className="hidden border-none md:flex items-center gap-2 px-3 py-2 rounded-full shadow-md bg-blue-600 hover:bg-blue-700 text-white text-sm"
            >
              <FilePlus className="w-4 h-4" /> Add Transaction
            </motion.button>

            {/* Today’s Summary */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.25 }}
              onClick={onShowSummary}
              className="hidden border-none md:flex items-center gap-2 px-3 py-2 rounded-full shadow-md bg-green-600 hover:bg-green-700 text-white text-sm"
            >
              <BarChart2 className="w-4 h-4" /> Today’s Summary
            </motion.button>
          </>
        )}
      </AnimatePresence>





      {/* ✅ Mobile Mini Button (just Add Transaction) */}
      {open && (
        <AnimatePresence>
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            onClick={onAddTransaction}
            className="md:hidden border-none flex items-center gap-2 px-3 py-2 rounded-full shadow-md bg-green-600 hover:bg-green-700 text-white text-sm"
          >
            <FilePlus className="w-5 h-5" />Add Txn 
          </motion.button>
          <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.25 }}
              onClick={onShowSummary}
              className="md:hidden border-none flex items-center gap-2 px-3 py-2 rounded-full shadow-md bg-green-600 hover:bg-green-700 text-white text-sm"
            >
              <BarChart2 className="w-4 h-4" />Summary
            </motion.button>
        </AnimatePresence>
      )}



{/* Main FAB */}
    {/* Desktop */}
      <motion.button
        onClick={() => setOpen(!open)}
        whileTap={{ scale: 0.9 }}
        animate={{ rotate: open ? 30 : 0 }}
        className={`hidden border-none lg:flex p-3 rounded-full shadow-xl bg-gradient-to-r ${bgClass} 
                    text-white hover:opacity-90 transition fixed bottom-8 right-6`}>
        {open ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
      </motion.button>

    {/* Mobile */}
      <motion.button
        onClick={() => setOpen(!open)}
        whileTap={{ scale: 0.9 }}
        animate={{ rotate: open ? 90 : 0 }}
        className={`lg:hidden border-none p-3 rounded-full shadow-xl bg-blue-500 ${bgClass} text-white hover:opacity-90 transition`}>
        {open ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
      </motion.button>


    </div>
  );
};

export default FloatingButton;
