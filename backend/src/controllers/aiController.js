export const teachTopic = async (req,res)=>{
try{

const {topic} = req.body;

const prompt = `
You are a computer science tutor.

Teach the topic: ${topic}

Return response in this exact structure:

Concept:
Explain the core idea simply.

When to Use:
Explain where this algorithm is useful.

Step-by-step Explanation:
Explain how the algorithm works.

Example:
Give a simple example.

C++ Code:
Provide working C++ code.

Time Complexity:
Explain time complexity.

Space Complexity:
Explain space complexity.

Do NOT include markdown formatting.
`;

const response = await fetch(
`https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({
contents:[{parts:[{text:prompt}]}]
})
}
);

const data = await response.json();

const text = data.candidates[0].content.parts[0].text;

res.json({content:text});

}catch(err){

console.error("AI Tutor Error:",err);
res.status(500).json({message:"AI generation failed"});

}
};