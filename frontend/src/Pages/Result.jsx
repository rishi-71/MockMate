import { useEffect, useState } from "react";
import axios from "../api/axios";
import "../styles/result.css";

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
    <div className="results-container">

      {/* QUIZ HISTORY */}
      <div className="results-card">
        <h2>Quiz History</h2>

        <table>
          <thead>
            <tr>
              <th>Score</th>
              <th>Total</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {quizResults.map((q,i)=>(
              <tr key={i}>
                <td>{q.score}</td>
                <td>{q.total}</td>
                <td>{new Date(q.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>

      {/* CODING HISTORY */}
      <div className="results-card">
        <h2>Coding History</h2>

        <table>
          <thead>
            <tr>
              <th>Problem</th>
              <th>Status</th>
              <th>Passed</th>
              <th>Score</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {codingResults.map((c,i)=>(
              <tr key={i}>
                <td>{c.question.title}</td>

                <td>
                  <span className={c.isCorrect ? "status accepted" : "status wrong"}>
                    {c.isCorrect ? "Accepted" : "Wrong"}
                  </span>
                </td>

                <td>{c.passed}/{c.total}</td>
                <td>{c.score}</td>
                <td>{new Date(c.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>

    </div>
  );
};

export default Result;