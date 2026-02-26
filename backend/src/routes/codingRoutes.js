import express from "express";
import {getTopics,getQuestions,getHint, submitAttempt} from "../controllers/codingController.js";
import {protect} from "../middleware/authMiddleware.js";
import { getUserResults } from "../controllers/codingController.js";
import { generateCodeHint } from "../controllers/codingController.js";

const router = express.Router();

router.get("/topics",protect,getTopics);
router.get("/questions/:topicId",protect,getQuestions);
router.post("/hint",protect,getHint);
router.post("/submit", protect,submitAttempt);
router.get("/results", protect, getUserResults);
router.post("/code-hint", protect, generateCodeHint);

export default router;