import Transaction from "../models/transactionModel.js";
import { Op } from "sequelize";

const TransactionRepo = {
  create: async (transactionData) => {
    return await Transaction.create(transactionData);
  },

  update: async (transactionId, updatedData) => {
    return await Transaction.update(updatedData, { where: { id: transactionId } });
  },

  delete: async (transactionId) => {
    return await Transaction.destroy({ where: { id: transactionId } });
  },

  findById: async (transactionId) => {
    return await Transaction.findByPk(transactionId);
  },

  findByUserAndCategory: async (userId, categoryId) => {
    return await Transaction.findAll({ where: { user_id: userId, category_id: categoryId } });
  },

  findByUser: async (userId) => {
    return await Transaction.findAll({ where: { user_id: userId } });
  },

  findByUserAndTransactionType: async (userId, transactionType) => {
    return await Transaction.findAll({ where: { user_id: userId, transactionType } });
  },

  findByUserAndAmountGreaterThan: async (userId, amount) => {
    return await Transaction.findAll({ where: { user_id: userId, amount: { [Op.gt]: amount } } });
  },

  findByUserAndAmountLessThan: async (userId, amount) => {
    return await Transaction.findAll({ where: { user_id: userId, amount: { [Op.lt]: amount } } });
  },

  findTransactionByAmountBetween: async (userId, min, max) => {
    return await Transaction.findAll({
      where: { user_id: userId, amount: { [Op.between]: [min, max] } },
    });
  },

  findByTransactionDateBetweenAndUser: async (userId, startDate, endDate) => {
    return await Transaction.findAll({
      where: { user_id: userId, transactionDate: { [Op.between]: [startDate, endDate] } },
    });
  },

  getTotalIncome: async (userId, startDate, endDate) => {
    const transactions = await Transaction.findAll({
      where: {
        user_id: userId,
        transactionType: "INCOME",
        transactionDate: { [Op.between]: [startDate, endDate] },
      },
      attributes: ["amount"],
    });
    return transactions.reduce((sum, txn) => sum + txn.amount, 0);
  },

  getTotalSpent: async (userId, startDate, endDate) => {
    const transactions = await Transaction.findAll({
      where: {
        user_id: userId,
        transactionType: "EXPENSE",
        transactionDate: { [Op.between]: [startDate, endDate] },
      },
      attributes: ["amount"],
    });
    return transactions.reduce((sum, txn) => sum + txn.amount, 0);
  },

  getTransactionByAllCategoryExpense: async (userId) => {
    const transactions = await Transaction.findAll({ where: { user_id: userId, transactionType: "EXPENSE" } });

    const categoryTotals = {};
    transactions.forEach((txn) => {
      categoryTotals[txn.category_id] = (categoryTotals[txn.category_id] || 0) + txn.amount;
    });

    return categoryTotals;
  },

  getTransactionByAllCategoryIncome: async (userId) => {
    const transactions = await Transaction.findAll({ where: { user_id: userId, transactionType: "INCOME" } });

    const categoryTotals = {};
    transactions.forEach((txn) => {
      categoryTotals[txn.category_id] = (categoryTotals[txn.category_id] || 0) + txn.amount;
    });

    return categoryTotals;
  },
};

export default TransactionRepo;