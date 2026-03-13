import express from "express";
import { teachTopic } from "../controllers/aiController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/teach",protect,teachTopic);

export default router;