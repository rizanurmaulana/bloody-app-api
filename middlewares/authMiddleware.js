import jwt from "jsonwebtoken";

export const authenticate = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

  if (!token) {
    return res.status(401).json({
      status: "error",
      message: "No token provided.",
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        status: "error",
        message: "Failed to authenticate token.",
      });
    }

    console.log("Decoded Token:", decoded);
    req.userId = decoded.id;
    req.userRole = decoded.role;

    next();
  });
};

export const authorizeRole = (allowedRoles) => {
  return (req, res, next) => {
    console.log("User Role:", req.userRole);
    console.log("Allowed Roles:", allowedRoles);

    if (!allowedRoles.includes(req.userRole)) {
      return res.status(403).json({
        status: "error",
        message: "Access denied. Insufficient permissions.",
      });
    }

    next();
  };
};
