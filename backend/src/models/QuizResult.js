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
      userAnswer: String,
      isCorrect:Boolean
    }
  ],

  score: Number,
  total: Number,

  // type:{
  //   type:String,
  //   default:"theory"
  // }

}, { timestamps: true });

export default mongoose.model("QuizResult", quizResultSchema);