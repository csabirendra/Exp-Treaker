const { getConnection, sql } = require('../config/dbconfig');
const { v4: uuidv4 } = require('uuid');

// 🔹 Add Category
const addCategory = async (req, res) => {
  try {
    const { category } = req.body;
    if (!category) {
      return res.status(400).json({ success: false, message: "Category Type is required" });
    }

    const pool = await getConnection();
    const categoryUpper = category.trim().toUpperCase();

    // Duplicate Check
    const dupCheck = await pool.request()
      .input("CATEGORY", sql.VarChar, categoryUpper)
      .query("SELECT 1 FROM TBL_CATEGORY WHERE CATEGORY = @CATEGORY AND ISACTIVE = 1");

    if (dupCheck.recordset.length > 0) {
      return res.status(400).json({ success: false, message: "Category already exists" });
    }

    await pool.request()
      .input("CATEGORYID", sql.UniqueIdentifier, uuidv4())
      .input("CATEGORY", sql.VarChar, categoryUpper)
      .query("INSERT INTO TBL_CATEGORY (CATEGORYID, CATEGORY, ISACTIVE, CREATED_ON) VALUES (@CATEGORYID, @CATEGORY, 1, GETDATE())");

    return res.json({ success: true, message: "Category added successfully" });
  } catch (err) {
    console.error("Add Category Error:", err.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// 🔹 Get All category
const getcategory = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query("SELECT * FROM TBL_CATEGORY WHERE ISACTIVE = 1");

    return res.json({ success: true, category: result.recordset });
  } catch (err) {
    console.error("Get category Error:", err.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// 🔹 Update Category
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { category } = req.body;

    if (!category) {
      return res.status(400).json({ success: false, message: "Category Type is required" });
    }

    const pool = await getConnection();
    const categoryUpper = category.trim().toUpperCase();

    const result = await pool.request()
      .input("CATEGORYID", sql.UniqueIdentifier, id)
      .input("CATEGORY", sql.VarChar, categoryUpper)
      .query("UPDATE TBL_CATEGORY SET CATEGORY = @CATEGORY WHERE CATEGORYID = @CATEGORYID");

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    return res.json({ success: true, message: "Category updated successfully" });
  } catch (err) {
    console.error("Update Category Error:", err.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// 🔹 Soft Delete Category
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const pool = await getConnection();
    const result = await pool.request()
      .input("CATEGORYID", sql.UniqueIdentifier, id)
      .query("UPDATE TBL_CATEGORY SET ISACTIVE = 0 WHERE CATEGORYID = @CATEGORYID");

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    return res.json({ success: true, message: "Category deactivated successfully" });
  } catch (err) {
    console.error("Delete Category Error:", err.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  addCategory,
  getcategory,
  updateCategory,
  deleteCategory
};
