import express from "express";
import cors from "cors";
import "./lib/env.js";
import { connectDB } from "./lib/db.js";

import authRoutes from "./routes/authRoutes.js";
import codingRoutes from "./routes/codingRoutes.js";
import theoryRoutes from "./routes/theoryRoutes.js";
import resultRoutes from "./routes/resultRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";



const app = express();

// middleware

app.use(express.json());

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));


//app.use("/api/theory",theoryRoutes);
app.use("/api/auth",authRoutes);
//app.use("/api/coding",codingRoutes);
//app.use("/api",resultRoutes);
app.use("/api/ai",aiRoutes);
app.use("/api/admin",adminRoutes);

// routes
//app.use("/api/auth", authRoutes);
app.use("/api/theory", theoryRoutes);
app.use("/api/coding", codingRoutes);
app.use("/api", resultRoutes);

// test route

console.log("MONGO: ", process.env.MONGO_URI);
console.log("JWT:", process.env.JWT_SECRET);
// connect database
connectDB().catch(err => {
  console.log("DB ERROR:", err);
});

// start server
const PORT = process.env.PORT || 5000;

 app.listen(PORT, () => {
   console.log(`Server started on port ${PORT}`);
 });

app.get("/", (req, res) => {
  res.send("MockMate Backend Running");
});

// optional debug
console.log("Gemini Key:", process.env.GEMINI_API_KEY);
export default app;
