import Budget from "../models/budgetModel.js";
import User from "../models/userModel.js";

const BudgetRepo = {
  findByUser: async (userId) => {
    return await Budget.findAll({
      where: { user_id: userId },
      include: User,
    });
  },

  findById: async (id) => {
    return await Budget.findByPk(id);
  },

  create: async (data) => {
    return await Budget.create(data);
  },

  update: async (id, data) => {
    return await Budget.update(data, { where: { id } });
  },

  delete: async (id) => {
    return await Budget.destroy({ where: { id } });
  },
};

export default BudgetRepo;