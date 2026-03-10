import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import CodingResult from "../models/CodingResult.js";
import Result from "../models/Result.js";

const router = express.Router();

router.get("/results", protect, async (req, res) => {
  try {

    const quizResults = await Result.find({
      user: req.user._id
    }).sort({ createdAt: -1 });

    const codingResults = await CodingResult.find({
      user: req.user._id
    }).sort({ createdAt: -1 });

    res.json({
      quizResults,
      codingResults
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;