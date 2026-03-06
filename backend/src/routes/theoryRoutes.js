import express from "express";
import upload from "../middleware/upload.js";
import { generateQuizFromFile } from "../controllers/theoryController.js";

import {
  generateQuiz,
  submitQuiz,
  getQuizResults
} from "../controllers/theoryController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/generate", protect, generateQuiz);

router.post("/submit", protect, submitQuiz);

router.get("/results", protect, getQuizResults);

router.post("/generate-file",protect,upload.single("file"),generateQuizFromFile);

export default router;