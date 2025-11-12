const { getConnection, sql } = require('../config/dbconfig');
const { v4: uuidv4 } = require('uuid');

// 🔹 Add SubCategory
const addSubCategory = async (req, res) => {
  try {
    const { category, subCategory } = req.body;

    if (!category || !subCategory) {
      return res.status(400).json({ success: false, message: "Category & SubCategory required" });
    }

    const pool = await getConnection();
    const categoryUpper = category.trim();
    const subCategoryUpper = subCategory.trim();

    // 1️⃣ Get CATEGORYID
    const categoryResult = await pool.request()
      .input("CATEGORY", sql.VarChar, categoryUpper)
      .query("SELECT CATEGORYID FROM TBL_CATEGORY WHERE CATEGORY = @CATEGORY AND ISACTIVE = 1");

    if (categoryResult.recordset.length === 0) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    const categoryId = categoryResult.recordset[0].CATEGORYID;

    // 2️⃣ Duplicate Check
    const dupCheck = await pool.request()
      .input("CATEGORYID", sql.UniqueIdentifier, categoryId)
      .input("SUBCATEGORY", sql.VarChar, subCategoryUpper)
      .query("SELECT 1 FROM TBL_SUBCATEGORY WHERE CATEGORYID = @CATEGORYID AND SUBCATEGORY = @SUBCATEGORY AND ISACTIVE = 1");

    if (dupCheck.recordset.length > 0) {
      return res.status(400).json({ success: false, message: "SubCategory already exists" });
    }

    // 3️⃣ Insert SubCategory
    await pool.request()
      .input("SUBCATEGORYID", sql.UniqueIdentifier, uuidv4())
      .input("CATEGORYID", sql.UniqueIdentifier, categoryId)
      .input("SUBCATEGORY", sql.VarChar, subCategoryUpper)
      .query(`
        INSERT INTO TBL_SUBCATEGORY (SUBCATEGORYID, CATEGORYID, SUBCATEGORY, ISACTIVE, CREATED_ON)
        VALUES (@SUBCATEGORYID, @CATEGORYID, @SUBCATEGORY, 1, GETDATE())
      `);

    return res.json({ success: true, message: "SubCategory added successfully" });
  } catch (err) {
    console.error("Add SubCategory Error:", err.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};



// 🔹 Get All subcategory
const getAllsubcategory = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT 
        S.SUBCATEGORYID, 
        S.CATEGORYID,        -- 👈 Ab CATEGORYID bhi aa raha hai
        C.CATEGORY, 
        S.SUBCATEGORY, 
        S.ISACTIVE, 
        S.CREATED_ON
      FROM TBL_SUBCATEGORY S
      INNER JOIN TBL_CATEGORY C ON S.CATEGORYID = C.CATEGORYID
      WHERE S.ISACTIVE = 1 ORDER BY S.CREATED_ON ASC
    `);

    return res.json({ success: true, subcategory: result.recordset });
  } catch (err) {
    console.error("Get subcategory Error:", err.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};




// 🔹 Update SubCategory
const updateSubCategory = async (req, res) => {
  try {
    const { subCategoryId } = req.params;
    const { category, subCategory } = req.body;

    if (!category || !subCategory) {
      return res.status(400).json({ success: false, message: "Category and SubCategory required" });
    }

    const pool = await getConnection();

    // Remove uppercase conversion
    const categoryTrimmed = category.trim();
    const subCategoryTrimmed = subCategory.trim();

    // Find CategoryID
    const categoryResult = await pool.request()
      .input("CATEGORY", sql.VarChar, categoryTrimmed)
      .query("SELECT CATEGORYID FROM TBL_CATEGORY WHERE CATEGORY = @CATEGORY AND ISACTIVE = 1");

    if (categoryResult.recordset.length === 0) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    const categoryId = categoryResult.recordset[0].CATEGORYID;

    // Update SubCategory
    const result = await pool.request()
      .input("SUBCATEGORYID", sql.UniqueIdentifier, subCategoryId)
      .input("CATEGORYID", sql.UniqueIdentifier, categoryId)
      .input("SUBCATEGORY", sql.VarChar, subCategoryTrimmed)
      .query(`
        UPDATE TBL_SUBCATEGORY
        SET CATEGORYID = @CATEGORYID,
            SUBCATEGORY = @SUBCATEGORY
        WHERE SUBCATEGORYID = @SUBCATEGORYID
      `);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ success: false, message: "SubCategory not found" });
    }

    return res.json({ success: true, message: "SubCategory updated successfully" });

  } catch (err) {
    console.error("Update SubCategory Error:", err.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


// 🔹 Soft Delete SubCategory
const deleteSubCategory = async (req, res) => {
  try {
    const { subCategoryId } = req.params;

    const pool = await getConnection();
    const result = await pool.request()
      .input("SUBCATEGORYID", sql.UniqueIdentifier, subCategoryId)
      .query("UPDATE TBL_SUBCATEGORY SET ISACTIVE = 0 WHERE SUBCATEGORYID = @SUBCATEGORYID");

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ success: false, message: "SubCategory not found" });
    }

    return res.json({ success: true, message: "SubCategory deactivated successfully" });
  } catch (err) {
    console.error("Delete SubCategory Error:", err.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  addSubCategory,
  getAllsubcategory,
  updateSubCategory,
  deleteSubCategory
};
