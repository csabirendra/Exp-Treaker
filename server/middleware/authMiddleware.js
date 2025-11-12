// server/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"] || req.headers["Authorization"];
    if (!authHeader) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).json({ success: false, message: "Invalid token format" });
    }

    const token = parts[1];
    const secret = process.env.JWT_SECRET;
    if (!secret) return res.status(500).json({ success: false, message: "JWT secret not configured" });

    const decoded = jwt.verify(token, secret);

    // normalize user id field so controllers can rely on req.user.USERID
    const userId = decoded.USERID || decoded.userId || decoded.id || decoded.sub;
    req.user = {
      ...decoded,
      USERID: userId
    };

    next();
  } catch (err) {
    console.error("verifyToken error:", err && err.message ? err.message : err);
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

module.exports = { verifyToken };
