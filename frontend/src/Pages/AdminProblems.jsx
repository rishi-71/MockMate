import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { FaArrowLeft, FaTrash, FaPlus, FaLaptopCode } from "react-icons/fa";
import "../styles/admin.css";

const AdminProblems = () => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTopicName, setNewTopicName] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    try {
      // If your backend route from step 1 is different, adjust this URL
      const res = await axios.get("/admin/topics", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTopics(res.data);
    } catch (err) {
      console.error("Failed to fetch topics", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTopic = async (e) => {
    e.preventDefault();
    if (!newTopicName.trim()) return;

    try {
      const res = await axios.post("/admin/topics", 
        { name: newTopicName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Add the new topic to the top of the UI list
      setTopics([res.data, ...topics]);
      setNewTopicName(""); // Clear input
    } catch (err) {
      console.error("Failed to add topic", err);
      alert("Failed to add new topic.");
    }
  };

  const handleDeleteTopic = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete the "${name}" topic?`)) return;

    try {
      await axios.delete(`/admin/topics/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Remove from UI
      setTopics(topics.filter(t => t._id !== id));
    } catch (err) {
      console.error("Failed to delete topic", err);
      alert("Failed to delete topic.");
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-content">
        
        <div className="admin-header">
          <div>
            <button className="back-btn" onClick={() => navigate("/admin/dashboard")}>
              <FaArrowLeft /> Back to Dashboard
            </button>
            <h1 className="admin-title" style={{marginTop: "16px"}}>Manage Topics</h1>
            <p className="admin-subtitle">Add or remove coding categories available to students.</p>
          </div>
        </div>

        {/* ADD NEW TOPIC FORM */}
        <div className="admin-table-card" style={{ marginBottom: "30px", padding: "20px 30px" }}>
          <form className="add-topic-form" onSubmit={handleAddTopic}>
            <div style={{ flex: 1 }}>
              <input 
                type="text" 
                placeholder="New Topic Name (e.g., Tries, Graph Theory...)" 
                value={newTopicName}
                onChange={(e) => setNewTopicName(e.target.value)}
                className="admin-input"
              />
            </div>
            <button type="submit" className="generate-btn" disabled={!newTopicName.trim()}>
              <FaPlus /> Add Topic
            </button>
          </form>
        </div>

        {/* TOPICS TABLE */}
        <div className="admin-table-card">
          {loading ? (
            <p className="loading-text">Loading topics...</p>
          ) : topics.length === 0 ? (
            <p className="empty-state">No topics found. Add one above!</p>
          ) : (
            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Icon</th>
                    <th>Topic Name</th>
                    <th>Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {topics.map((topic) => (
                    <tr key={topic._id}>
                      <td>
                        <div className="topic-icon-wrapper" style={{ width: "40px", height: "40px", padding: "8px" }}>
                          <FaLaptopCode className="topic-icon" />
                        </div>
                      </td>
                      <td className="problem-name">{topic.name}</td>
                      <td className="text-secondary">{topic.description}</td>
                      <td>
                        <button 
                          className="delete-btn"
                          onClick={() => handleDeleteTopic(topic._id, topic.name)}
                        >
                          <FaTrash /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default AdminProblems;