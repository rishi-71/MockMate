import Topic from "../models/Topic.js";
import Question from "../models/Question.js";
import Result from "../models/Result.js";
import { generateHint } from "../lib/gemini.js";
import CodingResult from "../models/CodingResult.js";


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
export const executeCode = async (req, res) => {
  try {
    const { code, input } = req.body;

    const response = await fetch(
      "https://ce.judge0.com/submissions?base64_encoded=false&wait=true",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          source_code: code,
          language_id: 54, // C++
          stdin: input,
        }),
      }
    );

    const result = await response.json();

    res.json({
      stdout: result.stdout,
      stderr: result.stderr,
      compile_output: result.compile_output,
      status: result.status?.description,
    });

  } catch (err) {
    console.error("Execution Error:", err);
    res.status(500).json({ message: "Execution failed" });
  }
};

export const generateCodingQuestion = async (req, res) => {
  try {
    const { topic } = req.body;

    const prompt = `
Generate 1 C++ coding problem for topic: ${topic}

Return STRICT valid JSON only in this exact structure:

{
  "title": "Problem title",
  "description": "Clear problem description",
  "difficulty": "Easy",
  "template": "Full valid C++ template including class Solution and main() using standard input/output only",
  "testCases": [
    { "input": "example input 1", "expectedOutput": "correct output 1" },
    { "input": "example input 2", "expectedOutput": "correct output 2" },
    { "input": "example input 3", "expectedOutput": "correct output 3" }
  ]
}

IMPORTANT RULES:
- Template must use std::cin / getline for input
- Template must print ONLY the function return value
- No debug prints
- No explanations
- No markdown
- No extra text outside JSON
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await response.json();

    // If Gemini API fails
    if (!response.ok) {
      console.error("Gemini API Error:", data);
      return res.status(500).json({
        message: data.error?.message || "Gemini API failed",
      });
    }

    // If no candidates returned
    if (!data.candidates || !data.candidates.length) {
      console.error("Invalid Gemini Response:", data);
      return res.status(500).json({
        message: "Invalid AI response structure",
      });
    }

    const rawText = data.candidates[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      return res.status(500).json({
        message: "AI returned empty response",
      });
    }

    // Extract JSON safely
    const jsonStart = rawText.indexOf("{");
    const jsonEnd = rawText.lastIndexOf("}") + 1;

    if (jsonStart === -1 || jsonEnd === -1) {
      console.error("AI Response:", rawText);
      return res.status(500).json({
        message: "AI did not return valid JSON",
      });
    }

    const cleanJson = rawText.slice(jsonStart, jsonEnd);

    let question;

    try {
      question = JSON.parse(cleanJson);
    } catch (err) {
      console.error("Invalid JSON from AI:", cleanJson);
      return res.status(500).json({
        message: "AI returned invalid JSON",
      });
    }

    res.json(question);

  } catch (err) {
    console.error("Generate Question Error:", err);
    res.status(500).json({ message: "AI generation failed" });
  }
};
export const submitSolution = async (req, res) => {
  try {
    const { questionId, code } = req.body;

    const question = await Question.findById(questionId);

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    let passed = 0;
    const total = question.testCases.length;

    for (const test of question.testCases) {

      const response = await fetch(
        "https://ce.judge0.com/submissions?base64_encoded=false&wait=true",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            source_code: code,
            language_id: 54,
            stdin: test.input
          })
        }
      );

      const result = await response.json();

      const userOutput = result.stdout?.trim();
      const expected = test.expectedOutput.trim();

      if (userOutput === expected) {
        passed++;
      }

    }

    const isCorrect = passed === total;
    const score = isCorrect ? 10 : 0;

    // Save basic attempt
    await Result.create({
      user: req.user._id,
      question: questionId,
      isCorrect,
      score
    });

    // Save detailed coding result
    await CodingResult.create({
      user: req.user._id,
      question: questionId,
      passed,
      total,
      isCorrect,
      score
    });

    res.json({
      passed,
      total,
      isCorrect,
      score
    });

  } catch (err) {
    console.error("Submit Solution Error:", err);
    res.status(500).json({ message: "Submission failed" });
  }
};

// await CodingResult.create({

// user:req.user._id,
// question:questionId,
// passed,
// total,
// isCorrect:passed === total,
// score

// });