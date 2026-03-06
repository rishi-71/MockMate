import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";

const Dashboard = () => {

  const navigate = useNavigate();

  return (
    <div className="dashboard">

      {/* HEADER */}
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Practice coding and test your theory knowledge</p>
      </div>

      {/* MAIN CARDS */}
      <div className="dashboard-grid">

        {/* CODING PRACTICE */}
        <div
          className="dashboard-card"
          onClick={() => navigate("/coding")}
        >
          <h2>💻 Coding Practice</h2>
          <p>
            Solve coding problems using our built-in editor and AI hints.
          </p>
        </div>

        {/* THEORY QUIZ */}
        <div
          className="dashboard-card"
          onClick={() => navigate("/theory")}
        >
          <h2>📚 Theory Quiz</h2>
          <p>
            Generate quizzes from your syllabus and test your understanding.
          </p>
        </div>

        {/* RESULTS */}
        <div
          className="dashboard-card"
          onClick={() => navigate("/results")}
        >
          <h2>📊 Results</h2>
          <p>
            Track your progress and view solved problems.
          </p>
        </div>

      </div>

    </div>
  );
};

export default Dashboard;