import { useEffect, useState } from "react";
import axios from "../api/axios";

const Result = () => {
  const [results, setResults] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchResults = async () => {
      const res = await axios.get("/coding/results", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setResults(res.data);
    };

    fetchResults();
  }, []);

  return (
    <div>
      <h2>Your Progress</h2>

      {results.map((r) => (
        <div key={r._id} style={{ marginBottom: "15px" }}>
          <strong>{r.question?.title}</strong>
          <p>Status: {r.isCorrect ? "Correct" : "Wrong"}</p>
          <p>Score: {r.score}</p>
        </div>
      ))}
    </div>
  );
};

export default Result;