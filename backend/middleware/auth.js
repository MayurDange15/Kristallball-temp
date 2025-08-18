const jwt = require("jsonwebtoken");

const protect = (roles = []) => {
  // roles param can be a single role string or array of roles
  if (typeof roles === "string") roles = [roles];

  return (req, res, next) => {
    let token = req.headers.authorization;
    if (!token || !token.startsWith("Bearer "))
      return res
        .status(401)
        .json({ message: "No token, Authorization Denied" });

    token = token.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      if (roles.length && !roles.includes(decoded.role)) {
        return res
          .status(403)
          .json({ message: "Access forbidden: Insufficient Role" });
      }

      next();
    } catch (err) {
      return res.status(401).json({ message: "Token is not valid" });
    }
  };
};

module.exports = { protect };
