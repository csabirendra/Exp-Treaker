const { poolPromise, pool,  sql } = require('../config/dbconfig');
const jwt = require('jsonwebtoken');
const { getConnection } = require('../config/dbconfig'); 
const { verifyToken } = require('../middleware/authMiddleware');




const getCurrentUser = async (req, res) => {
  try {
    const USERID = req.user.USERID; // From JWT token
    
    const pool = await getConnection();
    const result = await pool.request()
      .input('USERID', sql.VarChar, USERID)
      .query('SELECT USERID, FULLNAME, LOGINID, ISACTIVE FROM TBL_USER WHERE USERID = @USERID AND ISACTIVE = 1');

    const user = result.recordset[0];

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ 
      success: true, 
      user: {
        USERID: user.USERID,
        FULLNAME: user.FULLNAME,
        LOGINID: user.LOGINID
      }
    });

  } catch (err) {
    console.error('getCurrentUser Error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


// ======================================================

//  SIGN UP VALIDATION

const signup = async (req, res) => {
  try {
    const { email, password, fullname } = req.body;
    console.log("Received body via Signup():", req.body);

    const otp = Math.floor(100000 + Math.random() * 900000);

    const pool = await getConnection();

    const result = await pool
      .request()
      .input("EmailID", sql.VarChar, email)
      .input("Password", sql.VarChar, password)
      .input("FullName", sql.VarChar, fullname)
      .input("OTPCode", sql.VarChar, otp.toString())
      .execute("SP_USER_SIGNUP");

    // ✅ Add OTP in response only in DEV mode
    res.json({
      success: true,
      message: result.recordset[0].MESSAGE,
      otp: process.env.NODE_ENV === "development" ? otp : undefined,
    });
  } catch (err) {
    if (err.message.includes("User Already Exist !")) {
      res
        .status(400)
        .json({ success: false, message: "User Already Exist ! Use Login" });
    } else {
      console.error("Signup error:", err.message);
      res
        .status(500)
        .json({ success: false, message: "Server error on signup" });
    }
  }
};




// ======================================================

//  LOGIN VALIDATION

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and Password required' });
    }

    const pool = await getConnection();

    const result = await pool.request()
      .input('LoginID', sql.VarChar, email)
      .query('SELECT * FROM TBL_USER WHERE LOGINID = @LoginID AND ISACTIVE = 1');

    const user = result.recordset[0];

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid User' });
    }

    // Password check (plain for now)
    if (user.PASSWORD !== password) {
      return res.status(401).json({ success: false, message: 'Invalid Password' });
    }

    // Generate JWT
    const token = jwt.sign(
      { USERID: user.USERID, email: user.LOGINID },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.json({
      success: true,
      message: 'Login successful & Token Granted',
      token,
      user: {
        USERID: user.USERID,
        fullname: user.FULLNAME,
        email: user.LOGINID
      }
    });

  } catch (err) {
    console.error('❌ login error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { login };




// ======================================================

//  OTP VERIFICATION

const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required'
      });
    }

    const pool = await getConnection();
    // Execute SP
    const result = await pool.request()
      .input('EmailID', sql.VarChar, email)
      .input('OTPCode', sql.VarChar, otp)
      .execute('SP_VERIFY_OTP_SIGNUP');

    // SP returns RESULT and MESSAGE
    const spResponse = result.recordset[0];

    if (!spResponse) {
      return res.json({ success: false, message: 'OTP verification failed' });
    }

    // Send SP response to frontend
    res.json({
      success: spResponse.RESULT === 'SUCCESS',
      message: spResponse,
    });

  } catch (err) {
    console.error('❌ verifyOTP Error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};




// ============================================================================================================
//  FORGOT PASSWORD

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: "Email ID is required!" });
    }

    const pool = await getConnection();
    const result = await pool.request()
      .input("EmailID", sql.VarChar, email)
      .input("Action", sql.VarChar, "FORGOT")
      .execute("SP_FORGOT_RESET_PASSWORD");

    const spResponse = result.recordset[0];

    res.json({
      success: spResponse.success,
      message: spResponse.message,
      otp: spResponse.otp // comment this line in production
    });
  } catch (err) {
    console.error("ForgotPassword Error:", err.message);
    res.status(500).json({ success: false, message: "Server Error on forgotPassword" });
  }
};





// ======================================================
//  VERIFY RESET OTP REQUEST

const verifyResetOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ success: false, message: "Email and OTP are required!" });
    }

    const pool = await getConnection();
    const result = await pool.request()
      .input("EmailID", sql.VarChar, email)
      .input("OTPCode", sql.VarChar, otp)
      .input("Action", sql.VarChar, "VERIFY_OTP")
      .execute("SP_FORGOT_RESET_PASSWORD");

    const spResponse = result.recordset[0];
    res.json(spResponse);
  } catch (err) {
    console.error("verifyResetOtp Error:", err.message);
    res.status(500).json({ success: false, message: "Server Error on verifyResetOtp" });
  }
};






// ======================================================
//  RESET PASSWORD REQUEST

const resetPassword = async (req, res) => {
  try {
    const { email, newPassword, confirmPassword } = req.body;

    if (!email || !newPassword || !confirmPassword) {
      return res.status(400).json({ success: false, message: "All fields are required!" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ success: false, message: "Passwords do not match!" });
    }

    const pool = await getConnection();
    const result = await pool.request()
      .input("EmailID", sql.VarChar, email)
      .input("NewPassword", sql.VarChar, newPassword)
      .input("Action", sql.VarChar, "RESET")
      .execute("SP_FORGOT_RESET_PASSWORD");

    const spResponse = result.recordset[0];
    res.json(spResponse);
  } catch (err) {
    console.error("resetPassword Error:", err.message);
    res.status(500).json({ success: false, message: "Server Error on resetPassword" });
  }
};



// 🔹 Example: Get All Users (Public)
const getPublicUsers = async (req, res) => {
  try {
    const pool = await getConnection();
    // ❌ NEVER return passwords or sensitive data
    const result = await pool.request()
      .query("SELECT USERID, FULLNAME, LOGINID FROM TBL_USER WHERE ISACTIVE = 1");

    return res.json({ success: true, users: result.recordset });
  } catch (err) {
    console.error("Get Users Error:", err.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


module.exports = { signup, verifyOTP, login, forgotPassword, verifyResetOtp, getCurrentUser, resetPassword, getPublicUsers };
