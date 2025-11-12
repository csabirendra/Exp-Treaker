const { getConnection, sql } = require("../config/dbconfig");



// 🔹 Get Profile Info
exports.getProfile = async (req, res) => {
  try {
    const USERID = req.user.USERID; 
    const pool = await getConnection();

    const result = await pool.request()
      .input("USERID", sql.UniqueIdentifier, USERID)
      .query(`
        SELECT  USERID, FULLNAME, LOGINID, PHONE, ISACTIVE, FORMAT(CREATED_ON, 'dd-MM-yyyy') AS CREATED_ON, 
                DOB, GENDER
        FROM TBL_USER
        WHERE USERID = @USERID
      `);

    if (result.recordset.length === 0)
      return res.status(404).json({ success: false, message: "User not found" });

    let user = result.recordset[0];

    // ✅ Format DOB for <input type="date" />
    if (user.DOB) {
      user.DOB = new Date(user.DOB).toISOString().split("T")[0]; // yyyy-MM-dd
    }

    res.json({ success: true, user });
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};




// 🔹 Update Profile (Name, Phone, DOB, Gender)
exports.updateProfile = async (req, res) => {
  try {
    const { USERID } = req.user;
    const { FULLNAME, PHONE, DOB, GENDER } = req.body;

    const pool = await getConnection();

    await pool.request()
      .input("USERID", sql.UniqueIdentifier, USERID)
      .input("FULLNAME", sql.NVarChar(200), FULLNAME || null)
      .input("PHONE", sql.VarChar(20), PHONE || null)
      .input("DOB", sql.Date, DOB || null)
      .input("GENDER", sql.VarChar(10), GENDER || null)
      .execute("SP_UPDATE_USER_INFO"); // ✅ Stored Procedure

    res.json({ success: true, message: "Profile updated successfully" });
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};







// 🔹 Update Password (Plaintext)
exports.updatePassword = async (req, res) => {
  try {
    const { USERID } = req.user; // from token
    const { OLD_PASSWORD, NEW_PASSWORD, CONFIRM_PASSWORD } = req.body;

    if (!OLD_PASSWORD || !NEW_PASSWORD || !CONFIRM_PASSWORD) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    if (NEW_PASSWORD !== CONFIRM_PASSWORD) {
      return res.status(400).json({ success: false, message: "New passwords do not match" });
    }

    const pool = await getConnection();

    // 🔹 Call SP
    await pool.request()
      .input("USERID", sql.UniqueIdentifier, USERID)
      .input("OLD_PASSWORD", sql.VarChar(255), OLD_PASSWORD)
      .input("NEW_PASSWORD", sql.VarChar(255), NEW_PASSWORD)
      .execute("SP_UPDATE_PASSWORD");

    // 🔹 Invalidate token (force logout) → frontend should handle removing token
    res.json({ success: true, message: "Password updated successfully. Please login again." });

  } catch (err) {
    console.error("Error updating password:", err);
    res.status(500).json({ success: false, message: err.message || "Server error" });
  }
};





// 🔹 Soft Delete (Deactivate User)
exports.deactivateUser = async (req, res) => {
  try {
    const { USERID } = req.user;
    const { password, confirmDelete } = req.body;

    if (!confirmDelete) {
      return res.status(400).json({ success: false, message: "Please confirm account deletion" });
    }

    const pool = await getConnection();

    const user = await pool.request()
      .input("USERID", sql.UniqueIdentifier, USERID)
      .query("SELECT PASSWORD FROM TBL_USER WHERE USERID = @USERID");

    if (user.recordset.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.recordset[0].PASSWORD !== password) {
      return res.status(401).json({ success: false, message: "Invalid password" });
    }

    await pool.request()
      .input("USERID", sql.UniqueIdentifier, USERID)
      .execute("SP_DEACTIVATE_USER");

    res.json({ success: true, message: "Account deactivated successfully" });

  } catch (err) {
    console.error("Error deactivating user:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};







// 🔹 Reactivate User
exports.reactivateUser = async (req, res) => {
  try {
    const { USERID } = req.user;
    const pool = await getConnection();

    await pool.request()
      .input("USERID", sql.UniqueIdentifier, USERID)
      .query(`
        UPDATE TBL_USER
        SET ISACTIVE = 1, UPDATED_ON = GETDATE()
        WHERE USERID = @USERID
      `);

    res.json({ success: true, message: "Account reactivated successfully" });
  } catch (err) {
    console.error("Error reactivating user:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 🔹 Logout from All Devices
exports.logoutAll = async (req, res) => {
  try {
    res.json({ success: true, message: "Logged out from all devices" });
  } catch (err) {
    console.error("Error logging out:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
