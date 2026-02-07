import express from "express";
import {getTopics,getQuestions,getHint} from "../controllers/codingController.js";
import {protect} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/topics",protect,getTopics);
router.get("/questions/:topicId",protect,getQuestions);
router.post("/hint",protect,getHint);

export default router;