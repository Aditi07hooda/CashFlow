import express from "express";
import NotesService from "../service/NotesService.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const notes = await NotesService.getNotes(req.query.username);
    res.status(200).json(notes);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const note = await NotesService.addNote(req.query.username, req.body.note);
    res.status(200).json(note);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedNote = await NotesService.updateNote(req.query.username, req.params.id, req.body.note);
    res.status(200).json(updatedNote);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await NotesService.deleteNote(req.query.username, req.params.id);
    res.status(200).json({ message: "Note deleted successfully." });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;