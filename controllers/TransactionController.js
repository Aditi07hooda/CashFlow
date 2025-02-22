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

// Get transactions by category
router.get("/category", authenticateJWT, async (req, res) => {
  try {
    const transactions = await TransactionService.getAllTransactionsByCategory(req.query.username, req.body.category);
    res.status(200).json(transactions);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get transactions by transaction type
router.get("/transactionType", authenticateJWT, async (req, res) => {
  try {
    const transactions = await TransactionService.getAllTransactionsByType(req.query.username, req.body.transactionType);
    res.status(200).json(transactions);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get transactions by amount above a value
router.get("/amount/above", authenticateJWT, async (req, res) => {
  try {
    const transactions = await TransactionService.getAllTransactionsByAmountAbove(req.query.username, req.body.amount);
    res.status(200).json(transactions);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get transactions by amount below a value
router.get("/amount/below", authenticateJWT, async (req, res) => {
  try {
    const transactions = await TransactionService.getAllTransactionsByAmountBelow(req.query.username, req.body.amount);
    res.status(200).json(transactions);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get transactions by amount range
router.get("/amount/between", authenticateJWT, async (req, res) => {
  try {
    const transactions = await TransactionService.getAllTransactionsByAmountBetween(req.query.username, req.body.minAmount, req.body.maxAmount);
    res.status(200).json(transactions);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get transactions within a date range
router.get("/dates/between", authenticateJWT, async (req, res) => {
  try {
    const transactions = await TransactionService.getAllTransactionsByDate(req.query.username, req.body.startDate, req.body.endDate);
    res.status(200).json(transactions);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get total income within a date range
router.get("/income/total", authenticateJWT, async (req, res) => {
  try {
    const totalIncome = await TransactionService.getTotalIncome(req.query.username, req.body.startDate, req.body.endDate);
    res.status(200).json({ totalIncome });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get total spending within a date range
router.get("/spent/total", authenticateJWT, async (req, res) => {
  try {
    const totalSpent = await TransactionService.getTotalSpent(req.query.username, req.body.startDate, req.body.endDate);
    res.status(200).json({ totalSpent });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get total spending by category
router.get("/category/all/spending", authenticateJWT, async (req, res) => {
  try {
    const spendingData = await TransactionService.getTransactionByAllCategoryExpense(req.query.username);
    res.status(200).json(spendingData);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get total income by category
router.get("/category/all/income", authenticateJWT, async (req, res) => {
  try {
    const incomeData = await TransactionService.getTransactionByAllCategoryIncome(req.query.username);
    res.status(200).json(incomeData);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Download transaction report as PDF
router.get("/downloadPDFFile", authenticateJWT, async (req, res) => {
  try {
    const pdfData = await TransactionService.generateTransactionsPDFForCurrentYear(req.query.username);
    
    res.setHeader("Content-Disposition", "attachment; filename=transactions.pdf");
    res.setHeader("Content-Type", "application/pdf");
    res.status(200).send(pdfData);
  } catch (error) {
    res.status(500).json({ message: "Error generating PDF file", error: error.message });
  }
});

export default router;