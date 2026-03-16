import { useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import axios from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import "../styles/dashboard.css";
import { 
  FaCode, FaBrain, FaChartLine, FaRobot, 
  FaCheckCircle, FaClipboardList, FaBullseye 
} from "react-icons/fa";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext); // Pulling user to personalize greeting
  const token = localStorage.getItem("token");

  const [stats, setStats] = useState({
    codingSolved: 0,
    quizAttempts: 0,
    accuracy: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("/results", {
          headers: { Authorization: `Bearer ${token}` }
        });

        const coding = res.data.codingResults || [];
        const quiz = res.data.quizResults || [];
        const solved = coding.filter(r => r.isCorrect).length;

        setStats({
          codingSolved: solved,
          quizAttempts: quiz.length,
          accuracy: coding.length
            ? Math.round((solved / coding.length) * 100)
            : 0
        });
      } catch (err) {
        console.error("Stats fetch error:", err);
      }
    };

    if (token) {
      fetchStats();
    }
  }, [token]);

  // Fallback to "Student" if user name isn't loaded yet
  const displayName = user?.name || "Student";

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        
        {/* HEADER */}
        <div className="dashboard-header">
          <h1 className="dashboard-title">Welcome back, {displayName}</h1>
          <p className="dashboard-subtitle">
            Sharpen your coding skills with AI-powered practice, quizzes, and tutoring.
          </p>
        </div>

        {/* STATS ROW */}
        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-icon-wrapper">
              <FaCheckCircle className="stat-icon" />
            </div>
            <div className="stat-details">
              <h3>{stats.codingSolved}</h3>
              <p>Problems Solved</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper">
              <FaClipboardList className="stat-icon" />
            </div>
            <div className="stat-details">
              <h3>{stats.quizAttempts}</h3>
              <p>Quiz Attempts</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper">
              <FaBullseye className="stat-icon" />
            </div>
            <div className="stat-details">
              <h3>{stats.accuracy}%</h3>
              <p>Accuracy</p>
            </div>
          </div>
        </div>

        {/* ACTION GRID */}
        <div className="dashboard-grid">
          <div className="dashboard-card" onClick={() => navigate("/coding")}>
            <div className="card-icon"><FaCode /></div>
            <div className="card-text">
              <h2>Coding Practice</h2>
              <p>Solve coding problems using our built-in editor and AI hints.</p>
            </div>
          </div>

          <div className="dashboard-card" onClick={() => navigate("/theory")}>
            <div className="card-icon"><FaBrain /></div>
            <div className="card-text">
              <h2>Theory Quiz</h2>
              <p>Generate quizzes from your syllabus and test your understanding.</p>
            </div>
          </div>

          <div className="dashboard-card" onClick={() => navigate("/ai-tutor")}>
            <div className="card-icon"><FaRobot /></div>
            <div className="card-text">
              <h2>AI Tutor</h2>
              <p>Learn any computer science topic with personalized AI explanations.</p>
            </div>
          </div>

          <div className="dashboard-card" onClick={() => navigate("/results")}>
            <div className="card-icon"><FaChartLine /></div>
            <div className="card-text">
              <h2>Results</h2>
              <p>Track your progress, view analytics, and review solved problems.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;