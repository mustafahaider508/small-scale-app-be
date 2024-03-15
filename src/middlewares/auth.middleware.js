const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  // Public Routes
  const excludedPaths = ["/api/admin/signup", "/api/admin/signin"];

  // Get token from header
  const token = req.header("Authorization") || req.header("authorization");

  // Check if route is public
  if (excludedPaths.includes(req.params["0"]) && !token) return next();

  // Check if no token exists
  if (!token) {
    return res.status(401).json({
      code: 401,
      success: false,
      message: "No token, authorization denied",
    });
  }

  // Verify token
  try {
    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
      console.log("decoded", decoded);
      if (error) {
        return res.status(401).json({
          code: 401,
          success: false,
          message: "Invalid token, authorization denied",
        });
      } else {
        req.user = decoded.user;
        next();
      }
    });
  } catch (error) {
    console.error("Something went wrong with auth middleware");
    return next({ code: 5000, status: 500, error: error.message });
  }
};

module.exports = auth;
