import { useEffect, useState } from "react";
import axios from "../api/axios";

const Result = () => {

  const [quizResults, setQuizResults] = useState([]);
  const [codingResults, setCodingResults] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {

    const fetchResults = async () => {

      try {

        const res = await axios.get("/results", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setQuizResults(res.data.quizResults);
        setCodingResults(res.data.codingResults);

      } catch (err) {
        console.error(err);
      }

    };

    fetchResults();

  }, []);

  return (
    <div className="container">

      <h2>Quiz History</h2>

      {quizResults.map((q, i) => (
        <div key={i} className="result-card">
          <p>Score: {q.score} / {q.total}</p>
          <p>Date: {new Date(q.createdAt).toLocaleString()}</p>
        </div>
      ))}

      <h2 style={{ marginTop: "30px" }}>Coding History</h2>

      {codingResults.map((c, i) => (
        <div key={i} className="result-card">
          <p><b>{c.question.title}</b></p>
          <p>Status: {c.isCorrect ? "Accepted" : "Wrong"}</p>
          <p>Passed: {c.passed} / {c.total}</p>
          <p>Score: {c.score}</p>
          <p>Date: {new Date(c.createdAt).toLocaleString()}</p>
        </div>
      ))}

    </div>
  );
};

export default Result;