// routes/budgetRoutes.js
const express = require("express");
const router = express.Router();
const budgetController = require("../controllers/budgetcontroller"); // note casing
const { verifyToken } = require("../middleware/authMiddleware");

router.post("/add", verifyToken, budgetController.addBudget);
router.put("/:id", verifyToken, budgetController.updateBudget);
router.delete("/:id", verifyToken, budgetController.deleteBudget);
router.get("/", verifyToken, budgetController.getBudgetForUser);
router.get("/:id", verifyToken, budgetController.getBudgetByIdForUser);

module.exports = router;
