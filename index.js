import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import sequelize from "./config/database.js";
import authenticateJWT from "./config/AuthMiddleware.js"
import "./models/transactionModel.js"
import "./models/userModel.js"
import "./models/notesModel.js"
import "./models/categoryModel.js"
import "./models/budgetModel.js"
import userRoutes from "./controllers/UserController.js"
import transactionRoutes from "./controllers/TransactionController.js"
import notesRoutes from "./controllers/NotesController.js"
import categoryRoutes from "./controllers/CategoryController.js"
import budgetRoutes from "./controllers/BudgetController.js"

const app = express()

app.use(express.json());
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

app.use("/", userRoutes);
app.use("/budget", authenticateJWT, budgetRoutes);
app.use("/transaction", authenticateJWT, transactionRoutes);
app.use("/notes", authenticateJWT, notesRoutes);
app.use("/", categoryRoutes);

app.listen(5000, () => {
  console.log("server is running on port 5000");
});
