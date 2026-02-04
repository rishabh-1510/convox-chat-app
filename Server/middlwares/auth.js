require("dotenv").config();
const jwt = require("jsonwebtoken");

exports.auth = async (req, res, next) => {
  try {
    //  Get token from header / cookie / body
    const token =
      req.header("Authorization")?.replace("Bearer ", "") ||
      req.cookies?.token ||
      req.body?.token;

    // Token missing
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication token missing",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //  Attach user to request
    req.user = {
      id: decoded.id,
      email: decoded.email,
    };

    // Continue
    next();

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};
