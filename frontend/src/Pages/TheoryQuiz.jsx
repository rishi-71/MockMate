import { useState, useEffect } from "react";
import axios from "../api/axios";
import { useParams } from "react-router-dom";

const TheoryQuiz = () => {
  const { moduleId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await axios.post(
          "/theory/generate",
          { moduleName: `Module ${moduleId}` },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setQuestions(res.data.questions);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, []);

  const handleSelect = (qIndex, option) => {
    const updated = [...answers];
    updated[qIndex] = option;
    setAnswers(updated);
  };

  const handleSubmit = async () => {
    const res = await axios.post(
      "/theory/submit",
      { answers, questions },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setResult(res.data);
  };

  if (loading) return <div className="container">Generating Quiz...</div>;

  return (
    <div className="container">
      <h2>Theory Quiz</h2>

      {questions.map((q, i) => (
        <div key={i} className="card">
          <p><strong>{i + 1}. {q.question}</strong></p>

          {q.options.map((opt, index) => (
            <label key={index} style={{ display: "block", marginBottom: "5px" }}>
              <input
                type="radio"
                name={`q-${i}`}
                value={opt}
                onChange={() => handleSelect(i, opt)}
              />
              {" "} {opt}
            </label>
          ))}

          {result && (
            <div style={{ marginTop: "10px", color: "#aaa" }}>
              Correct Answer: {q.correctAnswer}
              <br />
              Explanation: {q.explanation}
            </div>
          )}
        </div>
      ))}

      {!result && (
        <button className="btn" onClick={handleSubmit}>
          Submit Quiz
        </button>
      )}

      {result && (
        <div style={{ marginTop: "20px" }}>
          <h3>
            Score: {result.score} / {result.total}
          </h3>
        </div>
      )}
    </div>
  );
};

export default TheoryQuiz;