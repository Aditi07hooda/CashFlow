import NotesRepo from "../repository/NotesRepo.js";
import UserRepo from "../repository/UserRepo.js";

const NotesService = {
  getNotes: async (username) => {
    const user = await UserRepo.findByUsername(username);
    if (!user) throw new Error(`User not found: ${username}`);
    return await NotesRepo.findByUser(user.id);
  },

  addNote: async (username, noteContent) => {
    const user = await UserRepo.findByUsername(username);
    if (!user) throw new Error(`User not found: ${username}`);
    return await NotesRepo.create({ user_id: user.id, note: noteContent });
  },

  updateNote: async (username, noteId, newContent) => {
    const user = await UserRepo.findByUsername(username);
    if (!user) throw new Error(`User not found: ${username}`);
    return await NotesRepo.update(noteId, { note: newContent });
  },

  deleteNote: async (username, noteId) => {
    const user = await UserRepo.findByUsername(username);
    if (!user) throw new Error(`User not found: ${username}`);
    return await NotesRepo.delete(noteId);
  },
};

export default NotesService;
