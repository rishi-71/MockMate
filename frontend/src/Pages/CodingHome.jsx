import { useEffect, useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import { FaLaptopCode, FaSpinner } from "react-icons/fa";
import "../styles/codingHome.css";

export default function CodingHome() {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [difficulty, setDifficulty] = useState("Medium");
  const navigate = useNavigate();

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    try {
      const res = await axios.get("/coding/topics");
      console.log("Topics response", res.data);
      setTopics(res.data);
    } catch (err) {
      console.log("Topics error: ",err.response?.data);
      console.log("Status:", err.response?.status);
      console.error(err);
    }
  };

  const handleTopicClick = async (topic) => {
    try {
      setLoading(true);

      const res = await axios.post("/coding/generate", {
        topic,
        difficulty
      });

      // Save new question
      localStorage.setItem(
        "currentCodingQuestion",
        JSON.stringify(res.data)
      );

      navigate("/coding/practice");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="coding-container">
      
      {/* LOADING OVERLAY */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-content">
            <FaSpinner className="spinner-icon" />
            <h2>Generating Question...</h2>
            <p>Our AI is crafting a unique {difficulty.toLowerCase()} problem for you.</p>
          </div>
        </div>
      )}

      <div className="coding-header">
        <h1 className="coding-title">Select a Coding Topic</h1>
        <p className="coding-subtitle">Choose a data structure or algorithm to practice.</p>
      </div>

      {/* MODERN DIFFICULTY SELECTOR */}
      <div className="difficulty-tabs">
        {["Easy", "Medium", "Hard"].map((level) => (
          <button
            key={level}
            className={`diff-tab ${difficulty === level ? "active" : ""}`}
            onClick={() => setDifficulty(level)}
          >
            {level}
          </button>
        ))}
      </div>

      {/* TOPICS GRID */}
      <div className="topics-grid">
        {topics.map((topic) => (
          <div
            key={topic._id}
            className="topic-card"
            onClick={() => handleTopicClick(topic.name)}
          >
            <div className="topic-icon-wrapper">
              <FaLaptopCode className="topic-icon" />
            </div>
            <div className="topic-info">
              <h3>{topic.name}</h3>
              <p>Practice {topic.name.toLowerCase()} problems</p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}