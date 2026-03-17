import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios"; // Make sure this path is correct for your project
import { AuthContext } from "../context/AuthContext";
import { FaUsers, FaCode, FaQuestionCircle, FaChartBar, FaSpinner } from "react-icons/fa";
import "../styles/admin.css"; 

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // State to hold our live numbers
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCoding: 0,
    totalQuizzes: 0,
  });
  const [loading, setLoading] = useState(true);

  // Fallback just in case
  const adminName = user?.name || "Admin";

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const res = await axios.get("/admin/stats", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setStats({
          totalUsers: res.data.totalUsers || 0,
          totalCoding: res.data.totalCoding || 0,
          totalQuizzes: res.data.totalQuizzes || 0,
        });
      } catch (err) {
        console.error("Failed to fetch admin stats", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, [token]);

  return (
    <div className="admin-container">
      <div className="admin-content">
        
        {/* HEADER */}
        <div className="admin-header">
          <div>
            <span className="admin-badge">Admin Access</span>
            <h1 className="admin-title">Welcome, {adminName}</h1>
            <p className="admin-subtitle">Manage users, questions, and monitor platform analytics.</p>
          </div>
        </div>

        {/* ADMIN QUICK STATS */}
        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <div className="admin-stat-icon users"><FaUsers /></div>
            <div>
              <h3>Total Users</h3>
              <p className="stat-number">
                {loading ? <FaSpinner className="fa-spin" style={{ fontSize: "18px" }}/> : stats.totalUsers}
              </p>
            </div>
          </div>
          
          <div className="admin-stat-card">
            <div className="admin-stat-icon code"><FaCode /></div>
            <div>
              <h3>Coding Problems Solved</h3>
              <p className="stat-number">
                {loading ? <FaSpinner className="fa-spin" style={{ fontSize: "18px" }}/> : stats.totalCoding}
              </p>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon quizzes"><FaQuestionCircle /></div>
            <div>
              <h3>Quizzes Generated</h3>
              <p className="stat-number">
                {loading ? <FaSpinner className="fa-spin" style={{ fontSize: "18px" }}/> : stats.totalQuizzes}
              </p>
            </div>
          </div>
        </div>

        {/* ADMIN ACTIONS */}
        <div className="admin-actions-section">
          <h2>Quick Actions</h2>
          <div className="admin-actions-grid">
            
            <div className="action-card" onClick={() => navigate("/admin/users")}>
              <FaUsers className="action-icon" />
              <h3>Manage Users</h3>
              <p>View, edit, or delete registered students.</p>
            </div>

            <div className="action-card" onClick={() => navigate("/admin/problems")}>
              <FaCode className="action-icon" />
              <h3>Manage Problems</h3>
              <p>Add new coding challenges or update test cases.</p>
            </div>

            <div className="action-card" onClick={() => navigate("/admin/analytics")}>
              <FaChartBar className="action-icon" />
              <h3>Platform Analytics</h3>
              <p>View overall system usage and performance.</p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;