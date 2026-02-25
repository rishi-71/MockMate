import { useEffect, useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";

const Dashboard = () => {
  const [topics, setTopics] = useState([]);
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchData = async () => {
      try {
        const [topicsRes, resultsRes] = await Promise.all([
          axios.get("/coding/topics", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("/coding/results", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setTopics(topicsRes.data);
        setResults(resultsRes.data);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      }
    };

    fetchData();
  }, []);

  // 📊 Stats calculation
  const total = results.length;
  const correct = results.filter((r) => r.isCorrect).length;
  const accuracy = total ? Math.round((correct / total) * 100) : 0;

  return (
    <div className="container">
      <h2 className="title">Dashboard</h2>

      {/* 📊 Stats Section */}
      <div className="stats-grid">
        <div className="card stat-card">
          <h3>{total}</h3>
          <p>Total Attempts</p>
        </div>

        <div className="card stat-card">
          <h3>{correct}</h3>
          <p>Correct Answers</p>
        </div>

        <div className="card stat-card">
          <h3>{accuracy}%</h3>
          <p>Accuracy</p>
        </div>
      </div>

      <h2 className="title">Practice Sections</h2>

      {/* 💻 Coding */}
      <div
        className="card stat-card"
        onClick={() => navigate("/coding")}
        style={{ cursor: "pointer" }}
      >
        <h3>💻 Coding Practice</h3>
        <p>Solve DSA & Programming Problems</p>
      </div>

      {/* 📘 Theory */}
      <div
        className="card stat-card"
        onClick={() => navigate("/theory")}
        style={{ cursor: "pointer" }}
      >
        <h3>📘 Theory Practice</h3>
        <p>Module-wise Quiz & MCQs</p>
      </div>
    </div>
  );
};

export default Dashboard;