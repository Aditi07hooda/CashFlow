import Transaction from "../models/transactionModel.js";

const TransactionRepo = {
  create: async (transactionData) => {
    return await Transaction.create(transactionData);
  },

  delete: async (transactionId) => {
    return await Transaction.destroy({ where: { id: transactionId } });
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
};

export default TransactionRepo;