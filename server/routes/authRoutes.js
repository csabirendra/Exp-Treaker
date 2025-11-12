const express = require('express');
const router = express.Router();
const { 
  signup, 
  verifyOTP, 
  login, 
  forgotPassword, 
  verifyResetOtp, 
  resetPassword,
  getCurrentUser,
  getPublicUsers 
} = require('../controllers/authController');

const { verifyToken } = require('../middleware/authMiddleware');

// User Signup & OTP flow
router.post('/signup', signup);              // Signup & OTP generate
router.post('/verify-otp', verifyOTP);       // Verify signup OTP

// Login
router.post('/login', login);                // User Login



// router.get('/users', getPublicUsers);
router.get('/me', verifyToken, getCurrentUser);




// Forgot / Reset Password flow
router.post('/forgot-password', forgotPassword);     // Step 1: Generate OTP
router.post('/verify-reset-otp', verifyResetOtp);    // Step 2: Verify OTP
router.post('/reset-password', resetPassword);       // Step 3: Reset password

module.exports = router;
