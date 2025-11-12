const jwt = require('jsonwebtoken');

// 🔹 Middleware to verify Admin JWT
const verifyAdminToken = (req, res, next) => {
  try {
    // Header se uthana
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
      return res.status(403).json({ success: false, message: 'No token provided' });
    }

    // "Bearer <token>" format
    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(403).json({ success: false, message: 'Invalid token format' });
    }

    // Token verify
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ success: false, message: 'Unauthorized: Invalid or Expired token' });
      }

      // Admin info attach karo
      req.admin = decoded;
      next();
    });
  } catch (err) {
    console.error("JWT Middleware Error:", err.message);
    return res.status(500).json({ success: false, message: 'Server error in token verification' });
  }
};

module.exports = { verifyAdminToken };
