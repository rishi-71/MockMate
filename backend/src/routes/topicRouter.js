import express from "express";
import Topic from "../models/topic.js";

const router = express.Router();

// GET topics
router.get("/", async (req, res) => {
  try {
    const topics = await Topic.find();
    res.json(topics);
  } catch (err) {
    res.status(500).json({ message: "Error fetching topics" });
  }
});

export default router;