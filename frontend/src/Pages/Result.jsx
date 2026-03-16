import { useEffect, useState } from "react";
import axios from "../api/axios";
import { FaCode, FaBrain, FaCheckCircle, FaTimesCircle, FaTrophy } from "react-icons/fa";
import "../styles/result.css";

const Result = () => {
  const [quizResults, setQuizResults] = useState([]);
  const [codingResults, setCodingResults] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await axios.get("/results", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setQuizResults(res.data.quizResults || []);
        setCodingResults(res.data.codingResults || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [token]);

  return (
    <div className="results-container">
      
      <div className="results-header">
        <h1 className="results-title"><FaTrophy className="header-icon"/> Your Progress</h1>
        <p className="results-subtitle">Review your past performance and track your improvement.</p>
      </div>

      {loading ? (
        <div className="loading-text">Loading your history...</div>
      ) : (
        <>
          {/* CODING HISTORY */}
          <div className="results-card">
            <div className="card-header">
              <h2><FaCode /> Coding History</h2>
            </div>
            
            {codingResults.length === 0 ? (
              <p className="empty-state">You haven't solved any coding problems yet.</p>
            ) : (
              <div className="table-responsive">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Problem</th>
                      <th>Status</th>
                      <th>Test Cases</th>
                      <th>Score</th>
                      <th>Date Completed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {codingResults.map((c, i) => (
                      <tr key={i}>
                        <td className="problem-name">{c.question?.title || "Unknown Problem"}</td>
                        <td>
                          <span className={`status-pill ${c.isCorrect ? "accepted" : "wrong"}`}>
                            {c.isCorrect ? <><FaCheckCircle /> Accepted</> : <><FaTimesCircle /> Wrong</>}
                          </span>
                        </td>
                        <td className="monospace-text">{c.passed} / {c.total}</td>
                        <td className="score-text">+{c.score}</td>
                        <td className="date-text">
                          {new Date(c.createdAt).toLocaleDateString()} <span className="time-text">{new Date(c.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* QUIZ HISTORY */}
          <div className="results-card">
            <div className="card-header">
              <h2><FaBrain /> Theory Quiz History</h2>
            </div>

            {quizResults.length === 0 ? (
              <p className="empty-state">You haven't taken any theory quizzes yet.</p>
            ) : (
              <div className="table-responsive">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Quiz Attempt</th>
                      <th>Score</th>
                      <th>Accuracy</th>
                      <th>Date Completed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quizResults.map((q, i) => {
                      const percentage = Math.round((q.score / q.total) * 100);
                      let scoreClass = "average";
                      if (percentage >= 80) scoreClass = "good";
                      if (percentage < 50) scoreClass = "poor";

                      return (
                        <tr key={i}>
                          <td className="problem-name">Generated Quiz #{quizResults.length - i}</td>
                          <td className="monospace-text">{q.score} / {q.total}</td>
                          <td>
                            <span className={`accuracy-pill ${scoreClass}`}>
                              {percentage}%
                            </span>
                          </td>
                          <td className="date-text">
                            {new Date(q.createdAt).toLocaleDateString()} <span className="time-text">{new Date(q.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Result;