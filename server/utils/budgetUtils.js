// server/utils/budgetUtils.js
const { getConnection, sql } = require("../config/dbconfig");

/**
 * Utility to check budget thresholds (50, 90, 100) after a transaction add/update/delete.
 *
 * Expects:
 *  - userId (GUID string)
 *  - subcategoryId (GUID string)
 *  - transactionDate (Date or date-string)
 *  - transactionId (optional GUID string)
 *
 * Returns: { alerted: boolean, alerts: [...], percentUsed: number } or throws on DB errors.
 */

const THRESHOLDS = [50, 90, 100];

const formatMonthYear = (date) => {
  const d = (date instanceof Date) ? date : new Date(date);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${yyyy}-${mm}`;
};

async function checkBudgetThresholds({ userId, subcategoryId, transactionDate, transactionId = null }) {
  if (!userId || !subcategoryId || !transactionDate) {
    throw new Error("userId, subcategoryId and transactionDate are required.");
  }

  const monthYear = formatMonthYear(transactionDate);
  const pool = await getConnection();

  // 1) Sum spent for that user/subcategory/month
  const spentQ = `
    SELECT ISNULL(SUM(AMOUNT), 0) AS SpentAmount
    FROM TBL_TRANSACTION
    WHERE USERID = @USERID
      AND SUBCATEGORYID = @SUBCATEGORYID
      AND ISACTIVE = 1
      AND FORMAT(TRANSACTION_DATE, 'yyyy-MM') = @MONTHYEAR
  `;

  const spentRes = await pool.request()
    .input("USERID", sql.UniqueIdentifier, userId)
    .input("SUBCATEGORYID", sql.UniqueIdentifier, subcategoryId)
    .input("MONTHYEAR", sql.VarChar(7), monthYear)
    .query(spentQ);

  const spentAmount = Number(spentRes.recordset[0].SpentAmount || 0);

  // 2) Fetch budget row for this user/subcategory/month
  const budgetQ = `
    SELECT BUDGETID, BUDGET_AMOUNT, LAST_ALERTED_THRESHOLD
    FROM TBL_BUDGET
    WHERE USERID = @USERID
      AND SUBCATEGORYID = @SUBCATEGORYID
      AND MONTHYEAR = @MONTHYEAR
      AND ISACTIVE = 1
  `;

  const budgetRes = await pool.request()
    .input("USERID", sql.UniqueIdentifier, userId)
    .input("SUBCATEGORYID", sql.UniqueIdentifier, subcategoryId)
    .input("MONTHYEAR", sql.VarChar(7), monthYear)
    .query(budgetQ);

  if (!budgetRes.recordset.length) {
    return { alerted: false, alerts: [], reason: "NoBudget", percentUsed: 0 };
  }

  const budget = budgetRes.recordset[0];
  const budgetAmount = Number(budget.BUDGET_AMOUNT || 0);
  if (budgetAmount <= 0) {
    return { alerted: false, alerts: [], reason: "ZeroBudget", percentUsed: 0 };
  }

  const prevThreshold = budget.LAST_ALERTED_THRESHOLD ? Number(budget.LAST_ALERTED_THRESHOLD) : 0;
  const percentUsed = Number(((spentAmount * 100) / budgetAmount).toFixed(2));

  // 3) determine which thresholds are crossed now (and were not crossed before)
  const thresholdsToAlert = THRESHOLDS.filter(th => prevThreshold < th && percentUsed >= th);

  if (thresholdsToAlert.length === 0) {
    return { alerted: false, alerts: [], percentUsed };
  }

  // 4) Insert notifications and update LAST_ALERTED_THRESHOLD within a transaction
  const highestThreshold = Math.max(...thresholdsToAlert);

  const insertNotifQ = `
    INSERT INTO TBL_NOTIFICATIONS (NOTIFID, USERID, BUDGETID, TRANSACTIONID, THRESHOLD, PERCENTAGE, MESSAGE, CREATED_ON, ISREAD)
    OUTPUT INSERTED.*
    VALUES (NEWID(), @USERID, @BUDGETID, @TRANSACTIONID, @THRESHOLD, @PERCENTAGE, @MESSAGE, SYSUTCDATETIME(), 0)
  `;

  const txn = pool.transaction();
  try {
    await txn.begin();
    const tReq = txn.request()
      .input("USERID", sql.UniqueIdentifier, userId)
      .input("BUDGETID", sql.UniqueIdentifier, budget.BUDGETID)
      .input("TRANSACTIONID", sql.UniqueIdentifier, transactionId)
      .input("PERCENTAGE", sql.Decimal(5,2), percentUsed);

    const alertsCreated = [];

    for (const th of thresholdsToAlert) {
      const msg = `Budget ${th}% reached for this subcategory this month. Used ${percentUsed}% of ${budgetAmount}.`;
      const resNotif = await tReq
        .input("THRESHOLD", sql.Int, th)
        .input("MESSAGE", sql.NVarChar(500), msg)
        .query(insertNotifQ);

      alertsCreated.push({ threshold: th, percent: percentUsed, notif: resNotif.recordset[0] });
    }

    // Update LAST_ALERTED_THRESHOLD to the highest alerted threshold
    const updateBudgetQ = `
      UPDATE TBL_BUDGET
      SET LAST_ALERTED_THRESHOLD = @LASTTH
      WHERE BUDGETID = @BUDGETID
    `;
    await tReq.input("LASTTH", sql.TinyInt, highestThreshold)
              .query(updateBudgetQ);

    await txn.commit();
    return { alerted: true, alerts: alertsCreated, percentUsed };
  } catch (err) {
    await txn.rollback();
    console.error("checkBudgetThresholds error:", err);
    throw err;
  }
}

module.exports = {
  checkBudgetThresholds,
  formatMonthYear,
};
