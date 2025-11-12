// controllers/reportController.js
const { getConnection, sql } = require('../config/dbconfig');

/**
 * POST /api/report/monthly-balance
 * Body: { USERID: "<GUID>", year: 2025, month: 9, includePrevBalance: true }
 */
const getMonthlyBalance = async (req, res) => {
  try {
    const { USERID, year, month, includePrevBalance = true } = req.body;

    // basic validation
    if (!USERID || !year || !month) {
      return res.status(400).json({ success: false, message: 'USERID, year and month are required' });
    }

    const pool = await getConnection();
    if (!pool) return res.status(500).json({ success: false, message: 'DB connection not available' });

    // call stored procedure
    const result = await pool.request()
      .input('USERID', sql.UniqueIdentifier, USERID)
      .input('YEAR', sql.Int, parseInt(year, 10))
      .input('MONTH', sql.Int, parseInt(month, 10))
      .input('INCLUDE_PREV_BAL', sql.Bit, includePrevBalance ? 1 : 0)
      .execute('USP_GET_MONTHLY_BALANCE');

    // result.recordsets is an array of recordsets returned by the SP
    const recordsets = result.recordsets || [];
    const summaryRows = recordsets[0] || [];
    const breakdownRows = recordsets[1] || [];

    const summary = summaryRows[0] || {
      TotalIncome: 0,
      TotalExpense: 0,
      Balance: 0,
      OpeningBalance: 0,
      ClosingBalance: 0
    };

    return res.json({
      success: true,
      summary,
      breakdown: breakdownRows
    });
  } catch (err) {
    console.error('getMonthlyBalance error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { getMonthlyBalance };
