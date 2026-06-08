import pdf from "pdf-parser";
import Tesseract from "tesseract.js";
import QuizResult from "../models/QuizResult.js";

export const generateQuiz = async (req, res) => {
  try {
    const { syllabus, difficulty } = req.body;

    const prompt = `
You are an expert educator. Generate exactly 5 Multiple Choice Questions (MCQs) from this syllabus.

CRITICAL INSTRUCTION - DIFFICULTY LEVEL: ${difficulty.toUpperCase()}
- If EASY: Focus on basic definitions.
- If MEDIUM: Focus on applying concepts.
- If HARD: Focus on complex scenarios and trick questions.

Syllabus Text:
${syllabus}

Return STRICT JSON ONLY following this exact structure:
{
  "topic": "A short, 3-5 word title summarizing the syllabus",
  "questions":[
    {
      "question":"...",
      "options":["A. Option 1","B. Option 2","C. Option 3","D. Option 4"],
      "answer":"The exact string of the correct option"
    }
  ]
}
`;

    // 1. UPDATED TO v1beta TO PREVENT 404 ERRORS
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await response.json();

    // 2. SAFETY CHECK
    if (!response.ok || !data.candidates) {
      console.error("Gemini API Error:", data);
      return res.status(500).json({ message: "AI failed to generate content." });
    }

    let text = data.candidates[0].content.parts[0].text;

    // 3. CLEAN MARKDOWN (Just like the file upload version)
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();
    
    const jsonStart = text.indexOf("{");
    const jsonEnd = text.lastIndexOf("}") + 1;

    if (jsonStart === -1 || jsonEnd === 0) {
       console.error("Failed to parse JSON from AI response:", text);
       return res.status(500).json({ message: "AI returned invalid format." });
    }

    const cleanJson = text.slice(jsonStart, jsonEnd);
    const quiz = JSON.parse(cleanJson);

    res.json(quiz);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Quiz generation failed" });
  }
};

export const submitQuiz = async (req,res)=>{

try{

const {questions, topic} = req.body;


if(!questions || !Array.isArray(questions)){
return res.status(400).json({message:"Invalid questions data"});
}

let score = 0;

questions.forEach(q=>{
if(q.userAnswer?.trim() === q.correctAnswer?.trim()){
score++;
}
});

questions.forEach(q=>{
  q.isCorrect = q.userAnswer === q.correctAnswer;
});

const result = await QuizResult.create({

user:req.user._id,
topic: topic || "Custom Theory Quiz",
score,
total:questions.length,
questions

});

res.json({
score,
total:questions.length,
questions
});

}catch(err){

console.error("Quiz Submit Error:",err);
res.status(500).json({message:err.message});

}

};

export const getQuizResults = async (req, res) => {
  try {

    const results = await QuizResult.find({
      user: req.user._id
    }).sort({ createdAt: -1 });

    res.json(results);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const generateQuizFromFile = async (req, res) => {
  try {

    let syllabusText = "";

    const file = req.file;

    const difficulty = req.body.difficulty || "Medium";

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // PDF handling
    if (file.mimetype === "application/pdf") {

      const data = await pdf(file.buffer);
      syllabusText = data.text;

    }

    // Image handling
    else if (file.mimetype.startsWith("image")) {

      const result = await Tesseract.recognize(
        file.buffer,
        "eng"
      );

      syllabusText = result.data.text;

    }

    else {
      return res.status(400).json({ message: "Unsupported file type" });
    }

    // Send extracted text to AI
const prompt = `
You are an expert educator. Generate exactly 5 Multiple Choice Questions (MCQs) from this syllabus.

CRITICAL INSTRUCTION - DIFFICULTY LEVEL: ${difficulty.toUpperCase()}
- If EASY: Focus on basic definitions, direct facts, and fundamental concepts.
- If MEDIUM: Focus on applying concepts, comparing ideas, and moderate analytical thinking.
- If HARD: Focus on complex scenarios, deep conceptual understanding, edge cases, and trick questions.

Syllabus Text:
${syllabusText}

Return STRICT JSON ONLY:
{
  "topic":"A short, 3-5 word title summarizing the syllabus",
  "questions":[
    {
      "question":"...",
      "options":["A. Option 1","B. Option 2","C. Option 3","D. Option 4"],
      "answer":"The exact string of the correct option"
    }
  ]
}
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await response.json();

    // 1. SAFETY CHECK: Did Google return an error?
    if (!response.ok || !data.candidates) {
      console.error("Gemini API Error:", data);
      return res.status(500).json({ message: "AI failed to generate content." });
    }

    let text = data.candidates[0].content.parts[0].text;

    text = text.replace(/```json/g,"").replace(/```/g,"").trim();
    const jsonStart = text.indexOf("{");
    const jsonEnd = text.lastIndexOf("}") + 1;

    if (jsonStart === -1 || jsonEnd === 0) {
       console.error("Failed to parse JSON from AI response:", text);
       return res.status(500).json({ message: "AI returned invalid format." });
    }

    const cleanJson = text.slice(jsonStart, jsonEnd);

    const quiz = JSON.parse(cleanJson);

    res.json(quiz);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Quiz generation failed" });
  }
};