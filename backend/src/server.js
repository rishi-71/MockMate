import express from "express";
import cors from "cors";
import "./lib/env.js";
import { connectDB } from "./lib/db.js";

import authRoutes from "./routes/authRoutes.js";
import codingRoutes from "./routes/codingRoutes.js";
import theoryRoutes from "./routes/theoryRoutes.js";
import resultRoutes from "./routes/resultRoutes.js";

const app = express();

// middleware
app.use(cors());
app.use(express.json());
//app.use("/api/theory",theoryRoutes);
app.use("/api/auth",authRoutes);
//app.use("/api/coding",codingRoutes);
//app.use("/api",resultRoutes);

// routes
//app.use("/api/auth", authRoutes);
app.use("/api/theory", theoryRoutes);
app.use("/api/coding", codingRoutes);
app.use("/api", resultRoutes);

// test route
app.get("/", (req, res) => {
  res.send("MockMate Backend Running");
});

// connect database
connectDB();

// start server
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

// optional debug
console.log("Gemini Key:", process.env.GEMINI_API_KEY);