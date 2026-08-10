import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token =
      req.cookies?.token || (authHeader && authHeader.split(" ")[1]);

    if (!token) {
      return res.status(401).json({
        message: "Access denied, missing token",
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = decoded;
      next();
    } catch (error) {
      console.log("JWT Verification Error:", error.message);
      return res.status(403).json({
        message: "Invalid or expired token",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: `Server error: ${error.message}`,
    });
  }
};

export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access denied: Insufficient permissions",
      });
    }
    next();
  };
};
