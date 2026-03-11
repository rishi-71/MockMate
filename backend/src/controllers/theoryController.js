import pdf from "pdf-parser";
import Tesseract from "tesseract.js";
import QuizResult from "../models/QuizResult.js";

export const generateQuiz = async (req, res) => {
  try {
    const { syllabus } = req.body;

    const prompt = `
Generate 5 MCQ questions from this syllabus:

${syllabus}

Return STRICT JSON:

{
 "questions":[
   {
     "question":"...",
     "options":["A","B","C","D"],
     "answer":"Correct option"
   }
 ]
}

No explanation.
Only JSON.
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await response.json();

    const text = data.candidates[0].content.parts[0].text;

    const jsonStart = text.indexOf("{");
    const jsonEnd = text.lastIndexOf("}") + 1;

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

const {questions} = req.body;

if(!questions || !Array.isArray(questions)){
return res.status(400).json({message:"Invalid questions data"});
}

let score = 0;

    questions.forEach(q => {
      if (q.correctAnswer === q.userAnswer) {
        score++;
      }
    });

    const result = await QuizResult.create({
      user: req.user._id,
      questions,
      score,
      total: questions.length
    });

    res.json({
      score,
      total: questions.length
    });

  } catch (err) {
    res.status(500).json({ message: "Quiz submission failed" });
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
Generate 5 MCQ questions from this syllabus:

${syllabusText}

Return STRICT JSON:

{
 "questions":[
   {
     "question":"...",
     "options":["A","B","C","D"],
     "answer":"Correct option"
   }
 ]
}

Return JSON only.
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await response.json();

    const text = data.candidates[0].content.parts[0].text;

    const jsonStart = text.indexOf("{");
    const jsonEnd = text.lastIndexOf("}") + 1;

    const cleanJson = text.slice(jsonStart, jsonEnd);

    const quiz = JSON.parse(cleanJson);

    res.json(quiz);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Quiz generation failed" });
  }
};