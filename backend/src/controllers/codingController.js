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
export const generateCodeHint = async (req, res) => {
  try {
    const { questionId, userCode, language } = req.body;

    const question = await Question.findById(questionId);

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `
You are a coding mentor.

Language: ${language}

Problem:
${question.title}
${question.description}

User Code:
${userCode}

Give only a hint.
Do not provide full solution.
                  `,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini Error:", data);
      return res.status(500).json({
        message: data.error?.message || "Gemini API failed",
      });
    }

    if (!data.candidates || !data.candidates.length) {
      console.error("Invalid Gemini Response:", data);
      return res.status(500).json({
        message: "Invalid AI response structure",
      });
    }

    const hint =
      data.candidates[0]?.content?.parts?.[0]?.text ||
      "No hint generated.";

    res.json({ hint });

  } catch (err) {
    console.error("Code Hint Error:", err);
    res.status(500).json({ message: "AI Error" });
  }
};