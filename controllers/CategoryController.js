import express from "express";
import CategoryService from "../service/CategoryService.js";
import authenticateJWT from "../config/AuthMiddleware.js";

const router = express.Router();

router.post("/admin/category", async (req, res) => {
  try {
    const category = await CategoryService.saveCategory(req.body);
    res.status(200).json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/admin/category", async (req, res) => {
  try {
    const categories = await CategoryService.getCategories();
    res.status(200).json(categories);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/category", authenticateJWT, async (req, res) => {
  try {
    const categories = await CategoryService.getCategories();
    res.status(200).json(categories);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/admin/category/:categoryName", async (req, res) => {
  try {
    const category = await CategoryService.getCategory(req.params.categoryName);
    res.status(200).json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;