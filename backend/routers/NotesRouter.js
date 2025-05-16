import express from "express";
import {
    getNotes,
    createNotes,
    updateNotes,
    deleteNotes
  } from "../controllers/NotesController.js";
import { refreshToken } from "../controllers/RefreshToken.js";
import { verifyToken } from "../middleware/VerifyToken.js";

const router = express.Router();

router.get("/notes", verifyToken, getNotes);
router.get("/notes/:id", verifyToken, getNotes);
router.post("/add-notes",  verifyToken, createNotes);
router.put("/edit-notes/:id", verifyToken, updateNotes);
router.delete("/delete-notes/:id", verifyToken, deleteNotes);

export default router; 
