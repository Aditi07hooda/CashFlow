import BudgetRepo from "../repository/BudgetRepo.js";
import UserRepo from "../repository/UserRepo.js";
import CategoryRepo from "../repository/CategoryRepo.js";

const BudgetService = {
  createBudget: async (payload) => {
    const {
      amount,
      username,
      startDate,
      endDate,
      budgetPeriod,
      categoryNames,
      description,
    } = payload;

    if (!amount || amount <= 0) throw new Error("Transaction amount must be greater than 0");

    const user = await UserRepo.findByUsername(username);
    if (!user) throw new Error(`User not found: ${username}`);

    const categories = categoryNames.includes("ALL")
      ? await CategoryRepo.getAll()
      : await Promise.all(categoryNames.map((name) => CategoryRepo.findByCategoryName(name)));

    if (!categories.length) throw new Error("No valid categories found");

    // **Validate and Convert Dates**
    const parsedStartDate = startDate ? new Date(startDate) : null;
    const parsedEndDate = endDate ? new Date(endDate) : null;

    if (!parsedStartDate || isNaN(parsedStartDate.getTime())) {
      throw new Error("Invalid startDate format. Expected format: YYYY-MM-DD");
    }
    if (!parsedEndDate || isNaN(parsedEndDate.getTime())) {
      throw new Error("Invalid endDate format. Expected format: YYYY-MM-DD");
    }

    return await BudgetRepo.create({
      budget: amount,
      startDate: parsedStartDate,
      endDate: parsedEndDate,
      period: budgetPeriod.toUpperCase(),
      user_id: user.id,
      description,
      categories,
    });
  },

  getAllBudgets: async (username) => {
    const user = await UserRepo.findByUsername(username);
    if (!user) throw new Error(`User not found: ${username}`);
    return await BudgetRepo.findByUser(user.id);
  },

  deleteBudget: async (budgetId, username) => {
    const user = await UserRepo.findByUsername(username);
    if (!user) throw new Error(`User not found: ${username}`);
    return await BudgetRepo.delete(budgetId);
  },
};

export default BudgetService;