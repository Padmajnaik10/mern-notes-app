import express from "express";
import Note from "../models/Note.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// get notes
router.get("/", protect, async (req, res) => {
    try {
        const notes = await Note.find({ createdBy: req.user._id });
        res.json(notes);
    } catch (error) {
        console.error("Get all notes error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// create note
router.post("/", protect, async (req, res) => {
    const { title, description } = req.body;
    try {
        if (!title || !description) {
            return res.status(400).json({ message: "Please fill in all fields" });
        }
        const note = await Note.create({
            title,
            description,
            createdBy: req.user._id,
        });
        res.status(201).json(note);
    } catch (error) {
        console.error("Create note error:", error);
        res.status(500).json({ message: "Internal server error" });
    }   
});

//get note by id
router.get("/:id", protect, async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).json({ message: "Note not found" });
        }
    } catch (error) {
        console.error("Get note by ID error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// update note
router.put("/:id", protect, async (req, res) => {
    const { title, description } = req.body;
    try {
        const note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).json({ message: "Note not found" });
        }

        if (note.createdBy.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "Not authorized" });
        }

        note.title = title || note.title;
        note.description = description || note.description;

        const updatedNote = await note.save();
        res.json(updatedNote);
    } catch (error) {
        console.error("Update note error:", error);
        res.status(500).json({ message: "Internal server error" });
    }   
});

// delete note
router.delete("/:id", protect, async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).json({ message: "Note not found" });
        }
        if (note.createdBy.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "Not authorized" });
        }
        await note.deleteOne();
        res.json({ message: "Note deleted" });
    } catch (error) {
        console.error("Delete note error:", error);
        res.status(500).json({ message: "Internal server error" });
    }       
});

export default router;