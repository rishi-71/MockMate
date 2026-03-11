import express from "express";
import {getTopics,getQuestions,getHint, submitAttempt} from "../controllers/codingController.js";
import {protect} from "../middleware/authMiddleware.js";
import { getUserResults } from "../controllers/codingController.js";
import { generateCodeHint } from "../controllers/codingController.js";
import { executeCode } from "../controllers/codingController.js";
import { generateCodingQuestion } from "../controllers/codingController.js";
import { submitSolution } from "../controllers/codingController.js";
const router = express.Router();

router.get("/topics",protect,getTopics);
router.get("/questions/:topicId",protect,getQuestions);
router.post("/hint",protect,getHint);
//router.post("/submit", protect,submitAttempt);
router.get("/results", protect, getUserResults);
router.post("/code-hint", protect, generateCodeHint);
router.post("/execute", protect, executeCode);
router.post("/generate", protect, generateCodingQuestion);
router.post("/submit", protect, submitSolution);
// router.post("/submit", protect, (req,res)=>{
//   console.log("Submit route hit");
//   res.send("Submit working");
// });

export default router;