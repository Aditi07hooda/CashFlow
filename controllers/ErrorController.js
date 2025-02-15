import express from "express";

const router = express.Router();

router.use((err, req, res, next) => {
  if (err.message.includes("Email already in use")) {
    return res.status(409).json({ message: err.message });
  } else if (err.message.includes("User not found")) {
    return res.status(404).json({ message: err.message });
  }
  res.status(500).json({ message: "Internal Server Error" });
});

export default router;