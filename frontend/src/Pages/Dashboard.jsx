import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../api/axios";
import "../styles/dashboard.css";

const Dashboard = () => {

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [stats,setStats] = useState({
    codingSolved:0,
    quizAttempts:0,
    accuracy:0
  });

  useEffect(() => {

    const fetchStats = async () => {

      try{

        const res = await axios.get("/results",{
          headers:{Authorization:`Bearer ${token}`}
        });

        const coding = res.data.codingResults || [];
        const quiz = res.data.quizResults || [];

        const solved = coding.filter(r=>r.isCorrect).length;

        setStats({
          codingSolved: solved,
          quizAttempts: quiz.length,
          accuracy: coding.length
            ? Math.round((solved/coding.length)*100)
            : 0
        });

      }catch(err){
        console.error("Stats fetch error:",err);
      }

    };

    fetchStats();

  },[]);

  return (
    <div className="dashboard">

      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Practice coding and test your theory knowledge</p>
      </div>

      <div className="stats-container">

        <div className="stat-card">
          <h3>{stats.codingSolved}</h3>
          <p>Problems Solved</p>
        </div>

        <div className="stat-card">
          <h3>{stats.quizAttempts}</h3>
          <p>Quiz Attempts</p>
        </div>

        <div className="stat-card">
          <h3>{stats.accuracy}%</h3>
          <p>Accuracy</p>
        </div>

      </div>

      <div className="dashboard-grid">

        <div className="dashboard-card" onClick={() => navigate("/coding")}>
          <h2>💻 Coding Practice</h2>
          <p>Solve coding problems using our built-in editor and AI hints.</p>
        </div>

        <div className="dashboard-card" onClick={() => navigate("/theory")}>
          <h2>📚 Theory Quiz</h2>
          <p>Generate quizzes from your syllabus and test your understanding.</p>
        </div>

        <div
className="dashboard-card"
onClick={() => navigate("/ai-tutor")}
>
<h2>🤖 AI Tutor</h2>
<p>
Learn any computer science topic with AI explanations.
</p>
</div>

        <div className="dashboard-card" onClick={() => navigate("/results")}>
          <h2>📊 Results</h2>
          <p>Track your progress and view solved problems.</p>
        </div>

      </div>

    </div>
  );
};

export default Dashboard;