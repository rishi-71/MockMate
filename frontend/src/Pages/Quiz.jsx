import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../api/axios";

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
        console.error("Error fetching questions:", err);
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
      console.error("Hint error:", err);
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
          isCorrect: true, // currently static
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
      console.error("Submit error:", err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Questions</h2>

      {questions.map((q) => (
        <div
          key={q._id}
          style={{
            marginBottom: "25px",
            padding: "15px",
            border: "1px solid #ccc",
            borderRadius: "6px",
          }}
        >
          <h4>{q.title}</h4>
          <p>{q.description}</p>

          <button
            onClick={() => getHint(q._id)}
            disabled={loadingHintId === q._id}
            style={{ marginRight: "10px" }}
          >
            {loadingHintId === q._id ? "Generating..." : "Get Hint"}
          </button>

          <button onClick={() => submitAnswer(q._id)}>
            Mark as Solved
          </button>

          {/* Show hint only for that question */}
          {hints[q._id] && (
            <div
              style={{
                marginTop: "10px",
                color: "blue",
                background: "#f3f3f3",
                padding: "8px",
                borderRadius: "4px",
              }}
            >
              <strong>Hint:</strong> {hints[q._id]}
            </div>
          )}
        </div>
      ))}

      {message && (
        <div style={{ marginTop: "20px", color: "green" }}>
          {message}
        </div>
      )}
    </div>
  );
};

export default Quiz;