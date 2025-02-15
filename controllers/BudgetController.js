import express from "express";
import BudgetService from "../service/BudgetService.js";
import authenticateJWT from "../config/AuthMiddleware.js"

const router = express.Router();

router.post("/", authenticateJWT ,async (req, res) => {
  try {
    const budget = await BudgetService.createBudget(req.body);
    res.status(200).json(budget);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/", authenticateJWT ,async (req, res) => {
  try {
    const budgets = await BudgetService.getAllBudgets(req.query.username);
    res.status(200).json(budgets);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", authenticateJWT ,async (req, res) => {
  try {
    await BudgetService.deleteBudget(req.params.id, req.query.username);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;