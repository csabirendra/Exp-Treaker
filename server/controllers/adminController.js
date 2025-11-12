const { getConnection, sql } = require('../config/dbconfig');
const jwt = require('jsonwebtoken');




// 🔹 Admin Login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email & Password required" });
    }

    const pool = await getConnection();
    const result = await pool.request()
      .input("EMAILID", sql.VarChar, email)
      .input("PASSWORD", sql.VarChar, password)
      .query("SELECT * FROM TBL_ADMIN WHERE EMAILID = @EMAILID AND ISACTIVE = 1");

    const admin = result.recordset[0];

    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid Admin Login' });
    }

    // Password check (plain for now)
    if (admin.PASSWORD !== password) {
      return res.status(401).json({ success: false, message: 'Invalid Admin Password' });
    }


    // JWT Generate
    const token = jwt.sign(
      { adminId: admin.ADMINID, email: admin.EMAILID },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.json({
      success: true,
      message: "Admin login successful",
      token
    });
  } catch (err) {
    console.error("Admin Login Error:", err.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


// 🔹 Example: Get All Admin Users (Protected)
const getAllAdminUsers = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query("SELECT FULLNAME, EMAILID, ROLE, ISACTIVE FROM TBL_ADMIN");

    return res.json({ success: true, users: result.recordset });
  } catch (err) {
    console.error("Get Users Error:", err.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  adminLogin,
  getAllAdminUsers
};
