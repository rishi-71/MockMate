import express from "express";

// 1. Changed verifyToken to protect right here 👇
import { protect, isAdmin } from "../middleware/authMiddleware.js"; 

// Import your database models
import User from "../models/User.js";
import QuizResult from "../models/QuizResult.js"; 
import CodingResult from "../models/CodingResult.js"; 
import Topic from "../models/Topic.js";

const router = express.Router();

// Route: GET /api/admin/stats
// Desc: Get total counts for the admin dashboard
// 2. Changed verifyToken to protect here as well 👇
router.get("/stats", protect, isAdmin, async (req, res) => {
  try {
    // Count how many users have the role of "user"
    const totalUsers = await User.countDocuments({ role: "user" });
    
    // Count total quizzes and coding problems solved
    const totalQuizzes = await QuizResult.countDocuments();
    const totalCoding = await CodingResult.countDocuments();

    res.status(200).json({
      totalUsers,
      totalQuizzes,
      totalCoding,
    });
  } catch (err) {
    console.error("Admin stats error:", err);
    res.status(500).json({ message: "Server error while fetching stats" });
  }
});

// Route: GET /api/admin/users
// Desc: Get a list of all registered users
router.get("/users", protect, isAdmin, async (req, res) => {
  try {
    // We use .select("-password") so we don't accidentally send user passwords to the frontend!
    const users = await User.find({}).select("-password").sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (err) {
    console.error("Fetch users error:", err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

// Route: DELETE /api/admin/users/:id
// Desc: Delete a user by their ID
router.delete("/users/:id", protect, isAdmin, async (req, res) => {
  try {
    // Prevent the admin from deleting themselves by accident!
    if (req.user._id.toString() === req.params.id) {
      return res.status(400).json({ message: "You cannot delete your own admin account!" });
    }

    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Delete user error:", err);
    res.status(500).json({ message: "Failed to delete user" });
  }
});

// Import your Topic model at the top of the file if you haven't already!
// import Topic from "../models/Topic.js"; (Adjust the name to match your actual topic model)

// Route: GET /api/admin/topics
// Desc: Get all coding topics
router.get("/topics", protect, isAdmin, async (req, res) => {
  try {
    // Replace 'Topic' with whatever your mongoose model for coding topics is named
    const topics = await Topic.find({}).sort({ createdAt: -1 });
    res.status(200).json(topics);
  } catch (err) {
    console.error("Fetch topics error:", err);
    res.status(500).json({ message: "Failed to fetch topics" });
  }
});

// Route: POST /api/admin/topics
// Desc: Add a new coding topic
router.post("/topics", protect, isAdmin, async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ message: "Topic name is required" });

    // Create new topic (Adjust 'Topic' to match your model)
    const newTopic = await Topic.create({
      name,
      description: description || `Practice problems related to ${name}`
    });

    res.status(201).json(newTopic);
  } catch (err) {
    console.error("Add topic error:", err);
    res.status(500).json({ message: "Failed to add topic" });
  }
});

// Route: DELETE /api/admin/topics/:id
// Desc: Delete a coding topic
router.delete("/topics/:id", protect, isAdmin, async (req, res) => {
  try {
    await Topic.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Topic deleted successfully" });
  } catch (err) {
    console.error("Delete topic error:", err);
    res.status(500).json({ message: "Failed to delete topic" });
  }
});

export default router;