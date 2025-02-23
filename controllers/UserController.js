import express from "express";
import UserService from "../service/UserService.js";
import JWTUtil from "../config/JwtUtil.js";
import authenticateJWT from "../config/AuthMiddleware.js";

const router = express.Router();

// Register a new user
router.post("/register", async (req, res) => {
  try {
    const user = await UserService.registerUser(req.body);
    const token = JWTUtil.generateToken(user.username);

    res.cookie("jwt_token", token, {
      httpOnly: true,
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(201).json({ user, token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Login user
router.post("/login", async (req, res) => {
  try {
    const user = await UserService.login(req.body.email, req.body.password);
    if (!user) throw new Error("Invalid email or password");

    const token = JWTUtil.generateToken(user.username);

    res.cookie("jwt_token", token, {
      httpOnly: true,
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get user details with transactions
router.get("/myaccount", authenticateJWT, async (req, res) => {
  try {
    const { username, minDateControl, maxDateControl } = req.query;
    const userData = await UserService.getUser(
      username,
      minDateControl,
      maxDateControl
    );
    res.status(200).json(userData);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
