import express from "express";
import cors from "cors";
import "./lib/env.js";
import {connectDB} from "./lib/db.js";
import authRoutes from "./routes/authRoutes.js";
import codingRoutes from "./routes/codingRoutes.js";

const app = express();

app.use(cors());

app.use(express.json());
app.use("/api/auth",authRoutes);
app.use("/api/coding",codingRoutes);

app.get("/",(req,res)=>{
    res.send("MockMate Backend Running");
});
connectDB();
app.listen(5000,()=>{
    console.log("Server started on port 5000");
});