const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionController");
const { verifyToken } = require("../middleware/authMiddleware");

// 🔹 Add Transaction
router.post("/add", verifyToken, transactionController.addTransaction);

// 🔹 Get All Transactions (with optional month/year filter)
router.get("/", verifyToken, transactionController.getTransactions);

// 🔹 Get recent Transactions
router.get("/recent", verifyToken, transactionController.getRecentTransactions);

// 🔹 Delete Transaction (soft delete)
router.delete("/:id", verifyToken, transactionController.deleteTransaction);

// 🔹 Update Transaction (soft delete)
router.put("/:id", verifyToken, transactionController.updateTransaction);


// 🔹 Get Monthly Report (summary + category breakdown)
router.get("/monthly-report", verifyToken, transactionController.getMonthlyReport);

module.exports = router;
