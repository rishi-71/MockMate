// 
import { useEffect, useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import "../styles/codingHome.css";

export default function CodingHome() {

  const [topics, setTopics] = useState([]);
  const [loading,setLoading] = useState(false);
  const [difficulty, setDifficulty] = useState("Medium");
  const navigate = useNavigate();

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    try {
      const res = await axios.get("/coding/topics");
      setTopics(res.data);
    } catch (err) {
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

    // 🔹 Save new question
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
  <div className="coding-page">

    <h1 className="coding-title">Select Coding Topic</h1>
    {loading && (
  <div className="loading-box">
    Generating question...
  </div>
)}

  <div className="difficulty-filter">
  <label>Select Difficulty:</label>

  <select
    value={difficulty}
    onChange={(e) => setDifficulty(e.target.value)}
  >
    <option value="Easy">Easy</option>
    <option value="Medium">Medium</option>
    <option value="Hard">Hard</option>
  </select>
</div>

    <div className="topics-grid">

      {topics.map((topic) => (
        <div
          key={topic._id}
          className="topic-card"
          onClick={() => handleTopicClick(topic.name)}
        >
          <h3>{topic.name}</h3>
          <p>Practice problems related to {topic.name}</p>
        </div>
      ))}

    </div>

  </div>
);
}