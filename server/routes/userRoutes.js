const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { verifyToken } = require("../middleware/authMiddleware");

// ✅ Profile
router.get("/profile", verifyToken, userController.getProfile);

// ✅ Update Profile (Name, Phone, DOB, Gender)
router.put("/update-profile", verifyToken, userController.updateProfile);

// ✅ Update Password
router.put("/update-password", verifyToken, userController.updatePassword);

// ✅ Deactivate Account
router.put("/deactivate", verifyToken, userController.deactivateUser);

// ✅ Reactivate Account
router.put("/reactivate", verifyToken, userController.reactivateUser);

// ✅ Logout from All Devices
router.post("/logout-all", verifyToken, userController.logoutAll);

module.exports = router;
