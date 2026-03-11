export const generateTheoryQuiz = async (moduleName) => {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `
Generate exactly 5 multiple choice questions for ${moduleName}.

Rules:
- 4 options per question
- Only 1 correct answer
- Include explanation
- Return ONLY valid JSON array
- No markdown
- No extra text

Format strictly like this:

[
 {
  "question": "Question text",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctAnswer": "Option A",
  "explanation": "Short explanation"
 }
]
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
    throw new Error(data.error?.message || "Gemini error");
  }

  const text = data.candidates[0].content.parts[0].text;

  // Extract JSON safely
  const jsonMatch = text.match(/\[[\s\S]*\]/);

  if (!jsonMatch) {
    throw new Error("AI did not return valid JSON");
  }

  return JSON.parse(jsonMatch[0]);
};