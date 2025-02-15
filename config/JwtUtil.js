import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_KEY || "your_secret_key";
const JWT_EXPIRY = process.env.JWT_EXPIRY || "7d";

const JWTUtil = {
  generateToken: (username) => {
    return jwt.sign({ username }, JWT_SECRET, {
      expiresIn: JWT_EXPIRY,
    });
  },

  verifyToken: (token) => {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return null;
    }
  },
};

export default JWTUtil;