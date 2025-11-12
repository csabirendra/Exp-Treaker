// routes/reportRoute.js
const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
// If you have auth middleware for users, replace `optionalAuth` with verifyToken
// const { verifyUserToken } = require('../middleware/adminMiddleware'); // optional

// Protected route recommended (add middleware). For quick testing you can remove middleware.
router.post('/monthly-balance', reportController.getMonthlyBalance);

module.exports = router;
