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

  updateTransaction: async (transId, username, payload) => {
    if (!username) throw new Error("Username is required");
    const user = await UserRepo.findByUsername(username);
    if (!user) throw new Error(`User not found: ${username}`);

    const transaction = await TransactionRepo.findById(transId);
    if (!transaction)
      throw new Error(`Transaction not found with ID: ${transId}`);
    if (transaction.user_id !== user.id)
      throw new Error("Transaction does not belong to this user");

    const updatedData = {};
    if (payload.amount) {
      if (payload.amount <= 0) throw new Error("Amount must be greater than 0");
      updatedData.amount = payload.amount;
    }
    if (payload.category) {
      const categoryData = await CategoryRepo.findByCategoryName(
        payload.category
      );
      if (!categoryData)
        throw new Error(`Category not found: ${payload.category}`);
      updatedData.category_id = categoryData.categoryId;
    }
    if (payload.transactionType) {
      updatedData.transactionType = payload.transactionType.toUpperCase();
    }
    if (payload.accountType) {
      updatedData.accountType = payload.accountType.toUpperCase();
    }
    if (payload.note) {
      updatedData.note = payload.note;
    }
    if (payload.transactionDate) {
      updatedData.transactionDate = new Date(payload.transactionDate);
    }

    return await TransactionRepo.update(transId, updatedData);
  },

  getAllTransactionsByCategory: async (username, category) => {
    if (!username) throw new Error("Username is required");
    if (!category) throw new Error("Category is required");

    const user = await UserRepo.findByUsername(username);
    if (!user) throw new Error(`User not found: ${username}`);

    const categoryData = await CategoryRepo.findByCategoryName(category);
    if (!categoryData) throw new Error(`Category not found: ${category}`);

    return await TransactionRepo.findByUserAndCategory(
      user.id,
      categoryData.categoryId
    );
  },

  getAllTransactionsByType: async (username, transactionType) => {
    if (!username) throw new Error("Username is required");
    if (!transactionType) throw new Error("Transaction type is required");

    const user = await UserRepo.findByUsername(username);
    if (!user) throw new Error(`User not found: ${username}`);

    return await TransactionRepo.findByUserAndTransactionType(
      user.id,
      transactionType.toUpperCase()
    );
  },

  getAllTransactionsByAmountAbove: async (username, amount) => {
    if (!username) throw new Error("Username is required");
    if (amount === undefined || amount < 0)
      throw new Error("Amount must be valid and greater than 0");

    const user = await UserRepo.findByUsername(username);
    if (!user) throw new Error(`User not found: ${username}`);

    return await TransactionRepo.findByUserAndAmountGreaterThan(
      user.id,
      amount
    );
  },

  getAllTransactionsByAmountBelow: async (username, amount) => {
    if (!username) throw new Error("Username is required");
    if (amount === undefined || amount < 0)
      throw new Error("Amount must be valid and greater than 0");

    const user = await UserRepo.findByUsername(username);
    if (!user) throw new Error(`User not found: ${username}`);

    return await TransactionRepo.findByUserAndAmountLessThan(user.id, amount);
  },

  getAllTransactionsByAmountBetween: async (username, minAmount, maxAmount) => {
    if (!username) throw new Error("Username is required");
    if (
      minAmount === undefined ||
      maxAmount === undefined ||
      minAmount < 0 ||
      maxAmount < minAmount
    ) {
      throw new Error("Invalid amount range");
    }

    const user = await UserRepo.findByUsername(username);
    if (!user) throw new Error(`User not found: ${username}`);

    return await TransactionRepo.findTransactionByAmountBetween(
      user.id,
      minAmount,
      maxAmount
    );
  },

  getAllTransactionsByDate: async (username, startDate, endDate) => {
    if (!username) throw new Error("Username is required");
    if (!startDate || !endDate)
      throw new Error("Start date and end date are required");

    const user = await UserRepo.findByUsername(username);
    if (!user) throw new Error(`User not found: ${username}`);

    return await TransactionRepo.findByTransactionDateBetweenAndUser(
      user.id,
      new Date(startDate),
      new Date(endDate)
    );
  },

  getTotalIncome: async (username, startDate, endDate) => {
    const transactions = await TransactionService.getAllTransactionsByDate(
      username,
      startDate,
      endDate
    );
    return transactions
      .filter((txn) => txn.transactionType === "INCOME")
      .reduce((sum, txn) => sum + txn.amount, 0);
  },

  getTotalSpent: async (username, startDate, endDate) => {
    const transactions = await TransactionService.getAllTransactionsByDate(
      username,
      startDate,
      endDate
    );
    return transactions
      .filter((txn) => txn.transactionType === "EXPENSE")
      .reduce((sum, txn) => sum + txn.amount, 0);
  },

  getTransactionByAllCategoryExpense: async (username) => {
    const user = await UserRepo.findByUsername(username);
    if (!user) throw new Error(`User not found: ${username}`);

    const transactions = await TransactionRepo.findByUser(user.id);
    const categoryTotals = {};

    transactions.forEach((txn) => {
      if (txn.transactionType === "EXPENSE") {
        categoryTotals[txn.category_id] =
          (categoryTotals[txn.category_id] || 0) + txn.amount;
      }
    });

    return categoryTotals;
  },

  getTransactionByAllCategoryIncome: async (username) => {
    const user = await UserRepo.findByUsername(username);
    if (!user) throw new Error(`User not found: ${username}`);

    const transactions = await TransactionRepo.findByUser(user.id);
    const categoryTotals = {};

    transactions.forEach((txn) => {
      if (txn.transactionType === "INCOME") {
        categoryTotals[txn.category_id] =
          (categoryTotals[txn.category_id] || 0) + txn.amount;
      }
    });

    return categoryTotals;
  },
};

export default TransactionService;
