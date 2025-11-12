const { getConnection, sql } = require("../config/dbconfig");
const { v4: uuidv4 } = require("uuid");
const { checkBudgetThresholds } = require("../utils/budgetUtils");

/**
 * 🔹 Add Transaction
 */
// controllers/transactionController.js — corrected addTransaction
const addTransaction = async (req, res) => {
  try {
    const {
      USERID: bodyUserId,
      CATEGORYID,
      SUBCATEGORYID,
      AMOUNT,
      DESCRIPTION,
      TRANSACTION_DATE, // frontend gives YYYY-MM-DD
    } = req.body;

    // prefer token user if available, fallback to body (backwards compat)
    const USERID = (req.user && req.user.USERID) ? req.user.USERID : bodyUserId;

    if (!USERID || !CATEGORYID || !SUBCATEGORYID || !AMOUNT || !TRANSACTION_DATE) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required!" });
    }

    // Merge client date with server time
    const dateOnly = new Date(TRANSACTION_DATE);
    const now = new Date();
    const finalDateTime = new Date(
      dateOnly.getFullYear(),
      dateOnly.getMonth(),
      dateOnly.getDate(),
      now.getHours(),
      now.getMinutes(),
      now.getSeconds()
    );

    const pool = await getConnection();
    const transactionId = uuidv4();

    // <-- make sure we *capture* the query result into `insertResult` (or `result`) and use the same name -->
    const insertResult = await pool
      .request()
      .input("TRANSACTIONID", sql.UniqueIdentifier, transactionId)
      .input("USERID", sql.UniqueIdentifier, USERID)
      .input("CATEGORYID", sql.UniqueIdentifier, CATEGORYID)
      .input("SUBCATEGORYID", sql.UniqueIdentifier, SUBCATEGORYID)
      .input("AMOUNT", sql.Decimal(18, 2), AMOUNT)
      .input("DESCRIPTION", sql.VarChar, DESCRIPTION || null)
      .input("TRANSACTION_DATE", sql.DateTime, finalDateTime)
      .query(`
        INSERT INTO TBL_TRANSACTION 
        (TRANSACTIONID, USERID, CATEGORYID, SUBCATEGORYID, AMOUNT, DESCRIPTION, TRANSACTION_DATE, CREATED_ON, ISACTIVE)
        OUTPUT INSERTED.*
        VALUES (@TRANSACTIONID, @USERID, @CATEGORYID, @SUBCATEGORYID, @AMOUNT, @DESCRIPTION, @TRANSACTION_DATE, GETDATE(), 1)
      `);

    const saved = insertResult.recordset[0];

    // Call threshold checker but don't fail main request if it errors
    try {
      await checkBudgetThresholds({
        userId: USERID,
        subcategoryId: SUBCATEGORYID,
        transactionDate: saved.TRANSACTION_DATE,
        transactionId: saved.TRANSACTIONID,
      });
    } catch (err) {
      console.error("Budget threshold check failed (addTransaction):", err);
    }

    return res.status(201).json({
      success: true,
      message: "Transaction added successfully",
      transaction: saved,
    });
  } catch (err) {
    console.error("Add Transaction Error:", err && err.message ? err.message : err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};






/**
 * 🔹 Get Transactions (User wise, optional month/year filter) 
 */
const getTransactions = async (req, res) => {
  try {
    const { USERID, month, year } = req.query;

    if (!USERID) {
      return res
        .status(400)
        .json({ success: false, message: "USERID is required" });
    }

    let query = `
      SELECT T.TRANSACTIONID, T.AMOUNT, T.DESCRIPTION, T.TRANSACTION_DATE,
             C.CATEGORY, S.SUBCATEGORY
      FROM TBL_TRANSACTION T
      INNER JOIN TBL_CATEGORY C ON T.CATEGORYID = C.CATEGORYID
      INNER JOIN TBL_SUBCATEGORY S ON T.SUBCATEGORYID = S.SUBCATEGORYID
      WHERE T.USERID = @USERID AND T.ISACTIVE = 1
      ORDER BY T.TRANSACTION_DATE DESC
    `;

    if (month && year) {
      query +=
        " AND MONTH(T.TRANSACTION_DATE) = @MONTH AND YEAR(T.TRANSACTION_DATE) = @YEAR";
    }

    const pool = await getConnection();
    const result = await pool
      .request()
      .input("USERID", sql.UniqueIdentifier, USERID)
      .input("MONTH", sql.Int, month || null)
      .input("YEAR", sql.Int, year || null)
      .query(query);

    return res.json({ success: true, transactions: result.recordset });
  } catch (err) {
    console.error("GetTransactions Error:", err.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};




/**
 * 🔹 GET_Recent_Transactions
 */
const getRecentTransactions = async (req, res) => {
  try {
    const { USERID, month, year } = req.query;

    if (!USERID) {
      return res
        .status(400)
        .json({ success: false, message: "USERID is required" });
    }

    let query = `
      SELECT TOP 5*
      FROM TBL_TRANSACTION T
      INNER JOIN TBL_CATEGORY C ON T.CATEGORYID = C.CATEGORYID
      INNER JOIN TBL_SUBCATEGORY S ON T.SUBCATEGORYID = S.SUBCATEGORYID
      WHERE T.USERID = @USERID AND T.ISACTIVE = 1
      ORDER BY T.TRANSACTION_DATE DESC
    `;

    if (month && year) {
      query +=
        " AND MONTH(T.TRANSACTION_DATE) = @MONTH AND YEAR(T.TRANSACTION_DATE) = @YEAR";
    }

    const pool = await getConnection();
    const result = await pool
      .request()
      .input("USERID", sql.UniqueIdentifier, USERID)
      .input("MONTH", sql.Int, month || null)
      .input("YEAR", sql.Int, year || null)
      .query(query);

    return res.json({ success: true, transactions: result.recordset });
  } catch (err) {
    console.error("getRecentTransactions Error:", err.message);
    return res.status(500).json({ success: false, message: "Server error while getRecentTransactions" });
  }
};





/**
 * 🔹 Update Transaction
 */
const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params; // TRANSACTIONID
    const {
      CATEGORYID,
      SUBCATEGORYID,
      AMOUNT,
      DESCRIPTION,
      TRANSACTION_DATE, // may come as YYYY-MM-DD
    } = req.body;
    const USERID = req.user.USERID; // from verifyToken

    if (!CATEGORYID || !SUBCATEGORYID || !AMOUNT) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const pool = await getConnection();

    // ✅ Fetch existing transaction (to preserve old values and for threshold re-check)
    const existingRes = await pool
      .request()
      .input("TRANSACTIONID", sql.UniqueIdentifier, id)
      .input("USERID", sql.UniqueIdentifier, USERID)
      .query(`
        SELECT TRANSACTION_DATE, SUBCATEGORYID
        FROM TBL_TRANSACTION 
        WHERE TRANSACTIONID = @TRANSACTIONID AND USERID = @USERID AND ISACTIVE = 1
      `);

    if (existingRes.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found or not authorized",
      });
    }

    const oldRow = existingRes.recordset[0];
    const oldSubcategoryId = oldRow.SUBCATEGORYID;
    const oldDateTime = oldRow.TRANSACTION_DATE;

    let finalDateTime;
    if (TRANSACTION_DATE) {
      // User changed date → new date + system time
      const dateOnly = new Date(TRANSACTION_DATE);
      const now = new Date();
      finalDateTime = new Date(
        dateOnly.getFullYear(),
        dateOnly.getMonth(),
        dateOnly.getDate(),
        now.getHours(),
        now.getMinutes(),
        now.getSeconds()
      );
    } else {
      // preserve old datetime
      finalDateTime = oldDateTime;
    }

    const result = await pool
      .request()
      .input("TRANSACTIONID", sql.UniqueIdentifier, id)
      .input("USERID", sql.UniqueIdentifier, USERID)
      .input("CATEGORYID", sql.UniqueIdentifier, CATEGORYID)
      .input("SUBCATEGORYID", sql.UniqueIdentifier, SUBCATEGORYID)
      .input("AMOUNT", sql.Decimal(18, 2), AMOUNT)
      .input("DESCRIPTION", sql.VarChar, DESCRIPTION || "")
      .input("TRANSACTION_DATE", sql.DateTime, finalDateTime)
      .query(`
        UPDATE TBL_TRANSACTION
        SET CATEGORYID = @CATEGORYID,
            SUBCATEGORYID = @SUBCATEGORYID,
            AMOUNT = @AMOUNT,
            DESCRIPTION = @DESCRIPTION,
            TRANSACTION_DATE = @TRANSACTION_DATE
        WHERE TRANSACTIONID = @TRANSACTIONID 
          AND USERID = @USERID 
          AND ISACTIVE = 1
      `);

    // After update: re-check budgets for affected months/subcategories
    try {
      // new values
      await checkBudgetThresholds({
        userId: USERID,
        subcategoryId: SUBCATEGORYID,
        transactionDate: finalDateTime,
        transactionId: id,
      });

      // if subcategory or month changed, re-check for the old one as well
      const oldMonth = oldDateTime ? `${oldDateTime.getFullYear()}-${String(oldDateTime.getMonth() + 1).padStart(2, "0")}` : null;
      const newMonth = finalDateTime ? `${finalDateTime.getFullYear()}-${String(finalDateTime.getMonth() + 1).padStart(2, "0")}` : null;

      if (oldSubcategoryId !== SUBCATEGORYID || oldMonth !== newMonth) {
        try {
          await checkBudgetThresholds({
            userId: USERID,
            subcategoryId: oldSubcategoryId,
            transactionDate: oldDateTime,
            transactionId: id,
          });
        } catch (innerErr) {
          console.error("Budget threshold check failed for old values (updateTransaction):", innerErr);
        }
      }
    } catch (err) {
      console.error("Budget threshold check failed (updateTransaction):", err);
    }

    return res.json({
      success: true,
      message: "Transaction updated successfully",
    });
  } catch (err) {
    console.error("Update Transaction Error:", err.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};





/**
 * 🔹 Delete Transaction (Soft Delete)
 */
const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    const pool = await getConnection();
    const result = await pool
      .request()
      .input("TRANSACTIONID", sql.UniqueIdentifier, id)
      .query(
        "UPDATE TBL_TRANSACTION SET ISACTIVE = 0 WHERE TRANSACTIONID = @TRANSACTIONID"
      );

    if (result.rowsAffected[0] === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Transaction not found" });
    }

    return res.json({
      success: true,
      message: "Transaction deleted successfully",
    });
  } catch (err) {
    console.error("Delete Transaction Error:", err.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};





/**
 * 🔹 Monthly Report (based only on Category breakdown)
 */
const getMonthlyReport = async (req, res) => {
  try {
    const { USERID, month, year } = req.query;

    if (!USERID || !month || !year) {
      return res.status(400).json({
        success: false,
        message: "USERID, Month & Year required",
      });
    }

    const pool = await getConnection();

    // Category wise totals
    const categoryResult = await pool
      .request()
      .input("USERID", sql.UniqueIdentifier, USERID)
      .input("MONTH", sql.Int, month)
      .input("YEAR", sql.Int, year)
      .query(`
        SELECT 
          C.CATEGORY,
          SUM(T.AMOUNT) AS Total
        FROM TBL_TRANSACTION T
        INNER JOIN TBL_CATEGORY C ON T.CATEGORYID = C.CATEGORYID
        WHERE T.USERID = @USERID
          AND MONTH(T.TRANSACTION_DATE) = @MONTH
          AND YEAR(T.TRANSACTION_DATE) = @YEAR
          AND T.ISACTIVE = 1
        GROUP BY C.CATEGORY
      `);

    return res.json({
      success: true,
      report: {
        category: categoryResult.recordset,
      },
    });
  } catch (err) {
    console.error("Monthly Report Error:", err.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  addTransaction,
  updateTransaction,
  getTransactions,
  getRecentTransactions,
  deleteTransaction,
  getMonthlyReport,
};
