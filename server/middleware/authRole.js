const jwt = require("jsonwebtoken");

module.exports = (allowedRoles = []) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader)
      return res.status(401).json({ message: "Token missing" });

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = decoded; // { id, email, role }

      // 🔒 Role check
      if (!allowedRoles.includes(decoded.role)) {
        return res.status(403).json({
          message: "Access denied for role: " + decoded.role
        });
      }

      next();
    } catch (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
  };
};
