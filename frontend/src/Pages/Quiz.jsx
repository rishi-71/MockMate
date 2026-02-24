import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../api/axios";
import "../styles/quiz.css";

const Quiz = () => {
  const { topicId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [hints, setHints] = useState({});
  const [loadingHintId, setLoadingHintId] = useState(null);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await axios.get(`/coding/questions/${topicId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setQuestions(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchQuestions();
  }, [topicId]);

  const getHint = async (questionId) => {
    try {
      setLoadingHintId(questionId);

      const res = await axios.post(
        "/coding/hint",
        { questionId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setHints((prev) => ({
        ...prev,
        [questionId]: res.data.hint,
      }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingHintId(null);
    }
  };

  const submitAnswer = async (questionId) => {
    try {
      await axios.post(
        "/coding/submit",
        {
          questionId,
          isCorrect: true,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("✅ Attempt saved successfully!");
      setTimeout(() => setMessage(""), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container">
      <h2 className="title">Questions</h2>

      {questions.map((q) => (
        <div key={q._id} className="card question-card">
          <h4 className="question-title">{q.title}</h4>
          <p className="question-desc">{q.description}</p>

          <div className="button-group">
            <button
              className="btn"
              onClick={() => getHint(q._id)}
              disabled={loadingHintId === q._id}
            >
              {loadingHintId === q._id ? "Generating..." : "Get Hint"}
            </button>

            <button
              className="btn btn-secondary"
              onClick={() => submitAnswer(q._id)}
            >
              Mark as Solved
            </button>
          </div>

          {hints[q._id] && (
            <div className="hint-box">
              <strong>Hint:</strong> {hints[q._id]}
            </div>
          )}
        </div>
      ))}

      {message && <div className="success-msg">{message}</div>}
    </div>
  );
};

export default Quiz;