import mongoose from "mongoose";

const quizResultSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  questions: [
    {
      question: String,
      options: [String],
      correctAnswer: String,
      userAnswer: String
    }
  ],

  score: Number,
  total: Number

}, { timestamps: true });

export default mongoose.model("QuizResult", quizResultSchema);