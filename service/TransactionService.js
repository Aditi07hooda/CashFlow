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

    if (!amount || amount <= 0)
      throw new Error("Transaction amount must be greater than 0");

    const user = await UserRepo.findByUsername(username);
    if (!user) throw new Error(`User not found: ${username}`);

    const categoryData = await CategoryRepo.findByCategoryName(category);
    if (!categoryData) throw new Error(`Category not found: ${category}`);

    return await TransactionRepo.create({
      user_id: user.id,
      category_id: categoryData.id,
      note,
      amount,
      transactionDate,
      transactionType: transactionType.toUpperCase(),
      accountType: accountType.toUpperCase(),
    });
  },

  getAllTransactions: async (username) => {
    const user = await UserRepo.findByUsername(username);
    if (!user) throw new Error(`User not found: ${username}`);
    return await TransactionRepo.findByUser(user.id);
  },

  deleteTransaction: async (transId, username) => {
    const user = await UserRepo.findByUsername(username);
    if (!user) throw new Error(`User not found: ${username}`);
    return await TransactionRepo.delete(transId);
  },
};

export default TransactionService;
