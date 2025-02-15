import Category from "../models/categoryModel.js";

const CategoryRepo = {
  findByCategoryName: async (categoryName) => {
    return await Category.findOne({ where: { categoryName } });
  },

  findById: async (id) => {
    return await Category.findByPk(id);
  },

  create: async (data) => {
    return await Category.create(data);
  },

  update: async (id, data) => {
    return await Category.update(data, { where: { categoryId: id } });
  },

  delete: async (id) => {
    return await Category.destroy({ where: { categoryId: id } });
  },
};

export default CategoryRepo;