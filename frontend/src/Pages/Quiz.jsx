import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../api/axios";

const Quiz = () => {
  const { topicId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [hint, setHint] = useState("");
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchQuestions = async () => {
      const res = await axios.get(`/coding/questions/${topicId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setQuestions(res.data);
    };

    fetchQuestions();
  }, [topicId]);

  const getHint = async (questionId) => {
    const res = await axios.post(
      "/coding/hint",
      { questionId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setHint(res.data.hint);
  };

  const submitAnswer = async (questionId) => {
    const res = await axios.post(
      "/coding/submit",
      {
        questionId,
        isCorrect: true, // abhi manually true de rahe
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setMessage("Attempt saved successfully!");
  };

  return (
    <div>
      <h2>Questions</h2>

      {questions.map((q) => (
        <div key={q._id} style={{ marginBottom: "20px" }}>
          <h4>{q.title}</h4>
          <p>{q.description}</p>

          <button onClick={() => getHint(q._id)}>Get Hint</button>
          <button onClick={() => submitAnswer(q._id)}>
            Mark as Solved
          </button>
        </div>
      ))}

      {hint && (
        <div style={{ marginTop: "20px", color: "blue" }}>
          <strong>Hint:</strong> {hint}
        </div>
      )}

      {message && (
        <div style={{ marginTop: "20px", color: "green" }}>
          {message}
        </div>
      )}
    </div>
  );
};

export default Quiz;