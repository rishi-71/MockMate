import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { FaArrowLeft, FaChartPie, FaCode, FaBrain, FaUsers } from "react-icons/fa";
import "../styles/admin.css";

const AdminAnalytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Reusing the /stats route we already built!
        const res = await axios.get("/admin/stats", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch analytics", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [token]);

  // Calculate percentages for our visual progress bars
  const totalPractice = stats ? (stats.totalCoding + stats.totalQuizzes) : 0;
  const codingPercent = totalPractice === 0 ? 0 : Math.round((stats.totalCoding / totalPractice) * 100);
  const quizPercent = totalPractice === 0 ? 0 : Math.round((stats.totalQuizzes / totalPractice) * 100);

  return (
    <div className="admin-container">
      <div className="admin-content">
        
        <div className="admin-header">
          <div>
            <button className="back-btn" onClick={() => navigate("/admin/dashboard")}>
              <FaArrowLeft /> Back to Dashboard
            </button>
            <h1 className="admin-title" style={{marginTop: "16px"}}>Platform Analytics</h1>
            <p className="admin-subtitle">Monitor student engagement and platform usage.</p>
          </div>
        </div>

        {loading || !stats ? (
          <p className="loading-text">Loading analytics...</p>
        ) : (
          <div className="analytics-grid">
            
            {/* OVERVIEW CARD */}
            <div className="admin-table-card analytics-card">
              <h2 className="analytics-card-title"><FaUsers /> Growth Overview</h2>
              <div className="big-stat">
                <span className="big-number">{stats.totalUsers}</span>
                <span className="big-label">Total Registered Students</span>
              </div>
              <p className="analytics-desc">Keep track of your expanding user base.</p>
            </div>

            {/* ENGAGEMENT CARD */}
            <div className="admin-table-card analytics-card">
              <h2 className="analytics-card-title"><FaChartPie /> Practice Engagement</h2>
              <div className="big-stat">
                <span className="big-number">{totalPractice}</span>
                <span className="big-label">Total Exercises Completed</span>
              </div>
              
              {/* Visual CSS Bar Chart */}
              <div className="visual-bar-container">
                <div className="visual-bar-labels">
                  <span style={{color: "#22c55e"}}><FaCode/> Coding ({codingPercent}%)</span>
                  <span style={{color: "#a855f7"}}><FaBrain/> Theory ({quizPercent}%)</span>
                </div>
                
                <div className="visual-bar">
                  <div className="bar-segment coding" style={{ width: `${codingPercent}%` }}></div>
                  <div className="bar-segment theory" style={{ width: `${quizPercent}%` }}></div>
                </div>
                
                <p className="analytics-desc" style={{marginTop: "16px"}}>
                  {codingPercent > quizPercent 
                    ? "Students are currently favoring practical coding challenges." 
                    : "Students are currently focusing more on theoretical quizzes."}
                </p>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default AdminAnalytics;