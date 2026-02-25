import express from "express";
import { generateQuiz, submitTheoryQuiz } from "../controllers/theoryController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/generate", protect, generateQuiz);
router.post("/submit", protect, submitTheoryQuiz);

export default router;