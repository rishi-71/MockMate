import Topic from "../models/Topic.js";
import Question from "../models/Question.js";
import Result from "../models/Result.js";
import { generateHint } from "../lib/gemini.js";


export const getTopics = async (req,res) =>{
    const topics = await Topic.find();
    res.json(topics);
};

export const getQuestions = async (req,res)=>{
    const {topicId} = req.params;

    const questions = await Question.find({topic: topicId});

    res.json(questions);
}


export const getHint = async (req, res) => {
  try {
    const { questionId } = req.body;

    const question = await Question.findById(questionId);

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    const hint = await generateHint(question.description);

    res.json({ hint });
  } catch (err) {
    console.error("HINT ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};
export const submitAttempt = async (req,res)=>{
    const {questionId,isCorrect} = req.body;

    const result = await Result.create({
        user:req.user,
        question:questionId,
        isCorrect,
        score: isCorrect ? 10 : 0,
    });
    res.json({
        message:"Attempt saved",
        result,
    });
};
export const getUserResults = async (req, res) => {
  try {
    const results = await Result.find({ user: req.user })
      .populate("question")
      .sort({ createdAt: -1 });

    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};