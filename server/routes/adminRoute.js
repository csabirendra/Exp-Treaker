const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyAdminToken } = require('../middleware/adminMiddleware');

// 🔹 Public Route
router.post('/login', adminController.adminLogin);

// 🔹 Protected Route
router.get('/users', verifyAdminToken, adminController.getAllAdminUsers);

module.exports = router;
