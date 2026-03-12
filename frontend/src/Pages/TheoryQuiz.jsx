import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import "../styles/theory.css";

const TheoryQuiz = () => {
  const [syllabus, setSyllabus] = useState("");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [file, setFile] = useState(null);
 // const navigate = useNavigate();
  const [result,setResult] = useState(null);

  const token = localStorage.getItem("token");

  const generateQuiz = async () => {
    try {
      const res = await axios.post(
        "/theory/generate",
        { syllabus },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setQuestions(res.data.questions);
      setAnswers({});
    } catch (err) {
      console.error(err);
    }
  };

  const handleOptionSelect = (index, option) => {
    setAnswers({
      ...answers,
      [index]: option,
    });
  };

  const submitQuiz = async () => {
    const formatted = questions.map((q, i) => ({
      question: q.question,
      options: q.options,
      correctAnswer: q.answer,
      userAnswer: answers[i],
    }));

    try {
      const res = await axios.post(
        "/theory/submit",
        { questions: formatted },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      // navigate("/results", {
      //   state: res.data,
      // });
      setResult(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const generateFromFile = async () => {

  const formData = new FormData();
  formData.append("file", file);

  const res = await axios.post(
    "/theory/generate-file",
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  setQuestions(res.data.questions);
};

  return (
    <div className="quiz-container">
      <h2 className="quiz-title">Theory Quiz Generator</h2>

      <input
        type="file"
        accept=".pdf,image/*"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <textarea
        className="syllabus-input"
        placeholder="Paste syllabus here..."
        value={syllabus}
        onChange={(e) => setSyllabus(e.target.value)}
      />

      <button onClick={generateFromFile}>
Generate From File
</button>

      <button className="generate-btn" onClick={generateQuiz}>
        Generate Quiz
      </button>

      {questions.map((q, i) => (
        <div key={i} className="question-card">
          <h3>
            {i + 1}. {q.question}
          </h3>

          {q.options.map((option, idx) => (
            <label key={idx} className="option-label">
              <input
                type="radio"
                name={`question-${i}`}
                value={option}
                checked={answers[i] === option}
                onChange={() => handleOptionSelect(i, option)}
              />

              {option}
            </label>
          ))}
        </div>
      ))}

      {questions.length > 0 && (
        <button className="submit-btn" onClick={submitQuiz}>
          Submit Quiz
        </button>
      )}
      {result && (

<div className="quiz-result">

<h2>Result</h2>

<h3>
Score: {result.score} / {result.total}
</h3>

{result.questions.map((q,i)=>(

<div key={i} className="result-card">

<h4>{i+1}. {q.question}</h4>

<p>Your Answer: {q.userAnswer}</p>

<p>Correct Answer: {q.correctAnswer}</p>

<p style={{
color:q.isCorrect ? "lightgreen":"red"
}}>

{q.isCorrect ? "Correct ✔":"Wrong ❌"}

</p>

</div>

))}

</div>

)}
    </div>
    
  );
};

export default TheoryQuiz;
