import JWTUtil from "./JwtUtil.js";

const authenticateJWT = (req, res, next) => {
  const token = req.cookies.jwt_token || req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const decoded = JWTUtil.verifyToken(token);
  if (!decoded) {
    return res.status(403).json({ message: "Forbidden: Invalid token" });
  }

  req.user = decoded;
  next();
};

export default authenticateJWT;