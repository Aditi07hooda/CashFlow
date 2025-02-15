import Notes from "../models/notesModel.js";

const NotesRepo = {
  findByUser: async (userId) => {
    return await Notes.findAll({ where: { user_id: userId } });
  },

  findById: async (id) => {
    return await Notes.findByPk(id);
  },

  create: async (data) => {
    return await Notes.create(data);
  },

  update: async (id, data) => {
    return await Notes.update(data, { where: { id } });
  },

  delete: async (id) => {
    return await Notes.destroy({ where: { id } });
  },
};

export default NotesRepo;