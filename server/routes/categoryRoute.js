const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { verifyAdminToken } = require('../middleware/adminMiddleware');

// Add Category
router.post('/add', verifyAdminToken, categoryController.addCategory);

// Get All Active category
router.get('/', verifyAdminToken, categoryController.getcategory);

// Public route for user
router.get('/public', categoryController.getcategory);

// Update Category
router.put('/:id', verifyAdminToken, categoryController.updateCategory);

// Soft Delete Category
router.delete('/:id', verifyAdminToken, categoryController.deleteCategory);

module.exports = router;
