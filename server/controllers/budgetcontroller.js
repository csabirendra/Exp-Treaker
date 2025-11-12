// controllers/budgetController.js
const { getConnection, sql } = require("../config/dbconfig");
const { v4: uuidv4 } = require("uuid");

/**
 * Budget controller
 * - All actions use verifyToken (req.user must be set by middleware)
 * - Users can CRUD their own budgets
 * - Only current month budgets are editable / deletable
 * - Soft-delete uses ISACTIVE = 0
 */

const MONTHYEAR_REGEX = /^\d{4}-(0[1-9]|1[0-2])$/;


/* helpers */
function isCurrentMonth(ym) {
  if (!MONTHYEAR_REGEX.test(ym)) return false;
  const [y, m] = ym.split('-').map(Number);
  const now = new Date();
  return now.getFullYear() === y && (now.getMonth() + 1) === m;
}



const addBudget = async (req, res) => {
  try {
    const tokenUser = req.user && (req.user.USERID || req.user.userId || req.user.id);
    if (!tokenUser) return res.status(401).json({ success: false, message: "Unauthorized" });

    const { SUBCATEGORYID, MONTHYEAR, BUDGET_AMOUNT, BUDGET_NAME } = req.body;
    if (!SUBCATEGORYID || !MONTHYEAR || BUDGET_AMOUNT === undefined) {
      return res.status(400).json({ success: false, message: "SUBCATEGORYID, MONTHYEAR and BUDGET_AMOUNT are required" });
    }
    if (!MONTHYEAR_REGEX.test(MONTHYEAR)) {
      return res.status(400).json({ success: false, message: "MONTHYEAR must be in 'YYYY-MM' format" });
    }
    if (isNaN(Number(BUDGET_AMOUNT))) {
      return res.status(400).json({ success: false, message: "Invalid BUDGET_AMOUNT" });
    }

    // enforce current month only (per your requirement)
    if (!isCurrentMonth(MONTHYEAR)) {
      return res.status(403).json({ success: false, message: "Can only create budget for current month" });
    }

    const pool = await getConnection();
    const name = BUDGET_NAME || `Budget - ${MONTHYEAR}`;

    // Call stored procedure SP_ADD_BUDGET
    try {
      const spRequest = pool.request()
        .input("USERID", sql.UniqueIdentifier, tokenUser)
        .input("SUBCATEGORYID", sql.UniqueIdentifier, SUBCATEGORYID)
        .input("MONTHYEAR", sql.VarChar(7), MONTHYEAR)
        .input("BUDGET_AMOUNT", sql.Decimal(18, 2), Number(BUDGET_AMOUNT))
        .input("BUDGET_NAME", sql.NVarChar(250), name);

      const spResult = await spRequest.execute("SP_ADD_BUDGET");

      // SP uses OUTPUT inserted.* so recordset[0] should be the inserted row
      const inserted = spResult.recordset && spResult.recordset[0];
      return res.status(201).json({ success: true, budget: inserted });
    } catch (spErr) {
      console.error("SP_ADD_BUDGET Error:", spErr);

      // try to extract SQL THROW number/message in a few common places
      const errNumber = spErr.number || (spErr.originalError && spErr.originalError.number) || null;
      const errMessage = spErr.message || (spErr.originalError && spErr.originalError.message) || '';

      // Map known THROW codes from your SP to HTTP status
      // 51000 - invalid format, 51001 - invalid numeric, 51002 - invalid month range, 51003 - duplicate
      if (errNumber === 51000 || errNumber === 51001 || errNumber === 51002) {
        return res.status(400).json({ success: false, message: errMessage.replace(/^.*: /, '') });
      }
      if (errNumber === 51003 || (errMessage && errMessage.includes('Budget already exists'))) {
        return res.status(409).json({ success: false, message: 'Budget already exists for this subcategory and month' });
      }

      // Fallback: if message contains known hints
      if (errMessage.includes('Invalid MONTHYEAR') || errMessage.includes('Invalid numeric')) {
        return res.status(400).json({ success: false, message: errMessage });
      }
      if (errMessage.includes('Budget already exists')) {
        return res.status(409).json({ success: false, message: 'Budget already exists for this subcategory and month' });
      }

      // Unknown SQL error -> 500
      return res.status(500).json({ success: false, message: errMessage || 'Server error' });
    }
  } catch (err) {
    console.error("addBudget Error:", err && err.message ? err.message : err);
    return res.status(500).json({ success: false, message: err.message || "Server error" });
  }
};




/**
 * Get Budgets for logged-in user
 * query: ?month=YYYY-MM (optional) & ?subcategoryId optional
 */
const getBudgetForUser = async (req, res) => {
  try {
    const tokenUser = req.user && (req.user.USERID || req.user.userId || req.user.id);
    if (!tokenUser) return res.status(401).json({ success: false, message: "Unauthorized" });

    const { month, subcategoryId } = req.query;

    let query = `
      SELECT B.BUDGETID, B.BUDGET_NAME, B.USERID, B.SUBCATEGORYID, B.MONTHYEAR, B.BUDGET_AMOUNT, B.CREATED_ON, B.ISACTIVE,
             S.SUBCATEGORY, C.CATEGORY
      FROM TBL_BUDGET B
      LEFT JOIN TBL_SUBCATEGORY S ON B.SUBCATEGORYID = S.SUBCATEGORYID
      LEFT JOIN TBL_CATEGORY C ON S.CATEGORYID = C.CATEGORYID
      WHERE B.USERID = @USERID AND B.ISACTIVE = 1
    `;
    if (month) query += " AND B.MONTHYEAR = @MONTH";
    if (subcategoryId) query += " AND B.SUBCATEGORYID = @SUBCATEGORYID";
    query += " ORDER BY B.MONTHYEAR DESC, S.SUBCATEGORY";

    const pool = await getConnection();
    const reqPool = pool.request().input("USERID", sql.UniqueIdentifier, tokenUser);
    if (month) reqPool.input("MONTH", sql.VarChar(7), month);
    if (subcategoryId) reqPool.input("SUBCATEGORYID", sql.UniqueIdentifier, subcategoryId);

    const result = await reqPool.query(query);
    return res.json({ success: true, budgets: result.recordset });
  } catch (err) {
    console.error("getBudgetForUser Error:", err && err.message ? err.message : err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * Get budget by id for logged-in user (only if owner)
 */
const getBudgetByIdForUser = async (req, res) => {
  try {
    const tokenUser = req.user && (req.user.USERID || req.user.userId || req.user.id);
    if (!tokenUser) return res.status(401).json({ success: false, message: "Unauthorized" });

    const { id } = req.params;
    if (!id) return res.status(400).json({ success: false, message: "Id required" });

    const pool = await getConnection();
    const result = await pool.request()
      .input("BUDGETID", sql.UniqueIdentifier, id)
      .query(`
        SELECT BUDGETID, BUDGET_NAME, USERID, SUBCATEGORYID, MONTHYEAR, BUDGET_AMOUNT, CREATED_ON, ISACTIVE
        FROM TBL_BUDGET
        WHERE BUDGETID = @BUDGETID
      `);

    if (!result.recordset.length) return res.status(404).json({ success: false, message: "Budget not found" });

    const budget = result.recordset[0];
    if (String(budget.USERID).toLowerCase() !== String(tokenUser).toLowerCase()) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    return res.json({ success: true, budget });
  } catch (err) {
    console.error("getBudgetByIdForUser Error:", err && err.message ? err.message : err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * Update budget (user can update their own budget if for current month)
 * params: id (BUDGETID)
 * body: { BUDGET_AMOUNT, BUDGET_NAME, SUBCATEGORYID, MONTHYEAR? }
 */
const updateBudget = async (req, res) => {
  try {
    const tokenUser = req.user && (req.user.USERID || req.user.userId || req.user.id);
    if (!tokenUser) return res.status(401).json({ success: false, message: "Unauthorized" });

    const { id } = req.params;
    const { BUDGET_AMOUNT, BUDGET_NAME, SUBCATEGORYID, MONTHYEAR } = req.body;

    if (!id) return res.status(400).json({ success: false, message: "Id required" });
    if (BUDGET_AMOUNT !== undefined && isNaN(Number(BUDGET_AMOUNT))) {
      return res.status(400).json({ success: false, message: "Invalid BUDGET_AMOUNT" });
    }

    const pool = await getConnection();

    // ensure owner and get existing month
    let existing;
    try {
      existing = await assertOwnsBudget(pool, id, tokenUser);
    } catch (e) {
      return res.status(e.code || 500).json({ success: false, message: e.message || "Server error" });
    }

    // only allow update for current month
    if (!isCurrentMonth(existing.MONTHYEAR)) {
      return res.status(403).json({ success: false, message: "Cannot edit previous months' budgets" });
    }

    const updates = [];
    if (BUDGET_AMOUNT !== undefined) updates.push("BUDGET_AMOUNT = @BUDGET_AMOUNT");
    if (BUDGET_NAME !== undefined) updates.push("BUDGET_NAME = @BUDGET_NAME");
    if (SUBCATEGORYID !== undefined) updates.push("SUBCATEGORYID = @SUBCATEGORYID");
    if (MONTHYEAR !== undefined) {
      // optionally allow changing month only to current month
      if (!isCurrentMonth(MONTHYEAR)) {
        return res.status(403).json({ success: false, message: "Can only change MONTHYEAR to current month" });
      }
      updates.push("MONTHYEAR = @MONTHYEAR");
    }

    if (updates.length === 0) return res.status(400).json({ success: false, message: "No fields to update" });

    const query = `
      UPDATE TBL_BUDGET
      SET ${updates.join(", ")}, CREATED_ON = SYSUTCDATETIME()
      WHERE BUDGETID = @BUDGETID;

      SELECT BUDGETID, BUDGET_NAME, USERID, SUBCATEGORYID, MONTHYEAR, BUDGET_AMOUNT, CREATED_ON, ISACTIVE
      FROM TBL_BUDGET WHERE BUDGETID = @BUDGETID;
    `;

    const request = pool.request().input("BUDGETID", sql.UniqueIdentifier, id);
    if (BUDGET_AMOUNT !== undefined) request.input("BUDGET_AMOUNT", sql.Decimal(18, 2), Number(BUDGET_AMOUNT));
    if (BUDGET_NAME !== undefined) request.input("BUDGET_NAME", sql.NVarChar(250), BUDGET_NAME);
    if (SUBCATEGORYID !== undefined) request.input("SUBCATEGORYID", sql.UniqueIdentifier, SUBCATEGORYID);
    if (MONTHYEAR !== undefined) request.input("MONTHYEAR", sql.VarChar(7), MONTHYEAR);

    const result = await request.query(query);
    return res.json({ success: true, budget: result.recordset[0] });
  } catch (err) {
    console.error("UpdateBudget Error:", err && err.message ? err.message : err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * Delete budget (soft) - user can delete their own budget only for current month
 */
const deleteBudget = async (req, res) => {
  try {
    const tokenUser = req.user && (req.user.USERID || req.user.userId || req.user.id);
    if (!tokenUser) return res.status(401).json({ success: false, message: "Unauthorized" });

    const { id } = req.params;
    if (!id) return res.status(400).json({ success: false, message: "Id required" });

    const pool = await getConnection();

    // ensure owner & fetch month
    let existing;
    try {
      existing = await assertOwnsBudget(pool, id, tokenUser);
    } catch (e) {
      return res.status(e.code || 500).json({ success: false, message: e.message || "Server error" });
    }

    // only allow delete for current month
    if (!isCurrentMonth(existing.MONTHYEAR)) {
      return res.status(403).json({ success: false, message: "Cannot delete previous months' budgets" });
    }

    const result = await pool.request()
      .input("BUDGETID", sql.UniqueIdentifier, id)
      .query("UPDATE TBL_BUDGET SET ISACTIVE = 0 WHERE BUDGETID = @BUDGETID; SELECT @@ROWCOUNT AS rowsAffected;");

    const rows = result.recordset[0].rowsAffected;
    if (rows === 0) return res.status(404).json({ success: false, message: "Budget not found" });

    return res.json({ success: true, message: "Budget deleted (soft) successfully" });
  } catch (err) {
    console.error("DeleteBudget Error:", err && err.message ? err.message : err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  addBudget,
  getBudgetForUser,
  getBudgetByIdForUser,
  updateBudget,
  deleteBudget
};
