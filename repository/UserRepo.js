import User from "../models/userModel.js";

const UserRepo = {
  findByUsername: async (username) => {
    return await User.findOne({ where: { username } });
  },

  findByEmail: async (email) => {
    return await User.findOne({ where: { email } });
  },

  findById: async (id) => {
    return await User.findByPk(id);
  },

  create: async (data) => {
    return await User.create(data);
  },

  update: async (id, data) => {
    return await User.update(data, { where: { id } });
  },

  delete: async (id) => {
    return await User.destroy({ where: { id } });
  },
};

export default UserRepo;