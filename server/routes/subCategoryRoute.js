const express = require('express');
const router = express.Router();
const subCategoryController = require('../controllers/subCategoryController');
const { verifyAdminToken } = require('../middleware/adminMiddleware');

// Add SubCategory
router.post('/add', verifyAdminToken, subCategoryController.addSubCategory);

// Get All Active subcategory
router.get('/', verifyAdminToken, subCategoryController.getAllsubcategory);

// Public route for user
router.get('/public', subCategoryController.getAllsubcategory);


// Update SubCategory
router.put('/:subCategoryId', verifyAdminToken, subCategoryController.updateSubCategory);

// Soft Delete SubCategory
router.delete('/:subCategoryId', verifyAdminToken, subCategoryController.deleteSubCategory);

module.exports = router;
