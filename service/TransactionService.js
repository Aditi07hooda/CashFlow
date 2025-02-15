import TransactionRepo from "../repository/TransactionRepo.js";
import UserRepo from "../repository/UserRepo.js";
import CategoryRepo from "../repository/CategoryRepo.js";

const TransactionService = {
  createTransaction: async (payload) => {
    const {
      amount,
      username,
      category,
      transactionDate,
      transactionType,
      accountType,
      note,
    } = payload;

    if (!amount || amount <= 0) throw new Error("Transaction amount must be greater than 0");

    if (!username) throw new Error("Username is required");
    const user = await UserRepo.findByUsername(username);
    if (!user) throw new Error(`User not found: ${username}`);

    if (!category) throw new Error("Category is required");
    const categoryData = await CategoryRepo.findByCategoryName(category);
    if (!categoryData) throw new Error(`Category not found: ${category}`);

    if (!transactionType) throw new Error("Transaction type is required");
    if (!accountType) throw new Error("Account type is required");

    return await TransactionRepo.create({
      user_id: user.id,
      category_id: categoryData.categoryId,
      note: note || null,
      amount,
      transactionDate: transactionDate || new Date(),
      transactionType: transactionType.toUpperCase(),
      accountType: accountType.toUpperCase(),
    });
  },

  getAllTransactions: async (username) => {
    if (!username) throw new Error("Username is required");
    const user = await UserRepo.findByUsername(username);
    if (!user) throw new Error(`User not found: ${username}`);
    return await TransactionRepo.findByUser(user.id);
  },

  deleteTransaction: async (transId, username) => {
    if (!username) throw new Error("Username is required");
    const user = await UserRepo.findByUsername(username);
    if (!user) throw new Error(`User not found: ${username}`);
    return await TransactionRepo.delete(transId);
  },
};

export default TransactionService;