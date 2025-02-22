import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import serverless from "serverless-http";

import sequelize from "../config/database.js";
import authenticateJWT from "../config/AuthMiddleware.js"
import "../models/transactionModel.js"
import "../models/userModel.js"
import "../models/notesModel.js"
import "../models/categoryModel.js"
import "../models/budgetModel.js"
import userRoutes from "../controllers/UserController.js"
import transactionRoutes from "../controllers/TransactionController.js"
import notesRoutes from "../controllers/NotesController.js"
import categoryRoutes from "../controllers/CategoryController.js"
import budgetRoutes from "../controllers/BudgetController.js"

const app = express()

app.use(express.json({ limit: "15mb" })); 
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.options("*", cors());

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connected to PostgreSQL database!");
    
    await sequelize.sync({ alter: true });
    console.log("Database & tables synced successfully");
  } catch (error) {
    console.error("Database connection error:", error);
  }
})();

app.use("/api/", userRoutes);
app.use("/api/budget", authenticateJWT, budgetRoutes);
app.use("/api/transaction", authenticateJWT, transactionRoutes);
app.use("/api/notes", authenticateJWT, notesRoutes);
app.use("/api/", categoryRoutes);

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error("🔥 Error:", err.stack);
  res.status(500).json({ error: "Internal Server Error", message: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});