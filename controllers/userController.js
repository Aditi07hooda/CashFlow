import express from "express";
import UserService from "../service/UserService.js";
import JWTUtil from "../config/JwtUtil.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const user = await UserService.registerUser(req.body);
    const token = JWTUtil.generateToken(user.username);

    res.cookie("jwt_token", token, { httpOnly: true, secure: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.status(201).json({ user, token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await UserService.login(req.body.email, req.body.password);
    const token = JWTUtil.generateToken(user.username);

    res.cookie("jwt_token", token, { httpOnly: true, secure: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.status(200).json({ user, token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;