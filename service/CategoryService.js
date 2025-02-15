import CategoryRepo from "../repository/CategoryRepo.js";

const CategoryService = {
  saveCategory: async (category) => {
    return await CategoryRepo.create(category);
  },

  getCategories: async () => {
    return await CategoryRepo.getAll();
  },

  getCategory: async (categoryName) => {
    return await CategoryRepo.findByCategoryName(categoryName);
  },
};

export default CategoryService;
