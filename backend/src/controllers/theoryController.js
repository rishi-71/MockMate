import { generateTheoryQuiz } from "../lib/theoryAI.js";

export const generateQuiz = async (req, res) => {
  try {
    const { moduleName } = req.body;

    const questions = await generateTheoryQuiz(moduleName);

    res.json({ questions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const submitTheoryQuiz = async (req, res) => {
  const { answers, questions } = req.body;

  let score = 0;

  questions.forEach((q, index) => {
    if (q.correctAnswer === answers[index]) {
      score++;
    }
  });

  res.json({
    total: questions.length,
    score,
  });
};