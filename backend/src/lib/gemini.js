import { GoogleGenerativeAI } from "@google/generative-ai";

// API key ko initialize karein
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateHint = async (questionText) => {
  try {
    // SDK khud best version aur endpoint dhoond lega
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
You are a coding mentor.
Give only a short hint.
Do NOT give full solution.

Question:
${questionText}
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    return text;
  } catch (error) {
    console.error("Gemini SDK Error:", error);
    throw new Error("Gemini request failed");
  }
};