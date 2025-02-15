import express from "express";
import TransactionService from "../service/TransactionService.js";
import authenticateJWT from "../config/AuthMiddleware.js";

const router = express.Router();

router.post("/", authenticateJWT ,async (req, res) => {
  try {
    const transaction = await TransactionService.createTransaction(req.body);
    res.status(200).json(transaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put("/:id", authenticateJWT ,async (req, res) => {
  try {
    const transaction = await TransactionService.updateTransaction(req.params.id, req.query.username, req.body);
    res.status(200).json(transaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", authenticateJWT ,async (req, res) => {
  try {
    await TransactionService.deleteTransaction(req.params.id, req.query.username);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/", authenticateJWT, async (req, res) => {
  try {
    const transactions = await TransactionService.getAllTransactions(req.query.username);
    res.status(200).json(transactions);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;