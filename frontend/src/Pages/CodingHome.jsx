import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import "../styles/dashboard.css";

const CodingHome = () => {
  const [topics, setTopics] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const res = await axios.get("/coding/topics", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setTopics(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTopics();
  }, [token]);

  const handleGenerateQuestion = async (topicName) => {
    try {
      const res = await axios.post(
        "/coding/generate",
        { topic: topicName },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Save question in localStorage (temporary)
      localStorage.setItem("currentCodingQuestion", JSON.stringify(res.data));

      // Navigate to coding practice page
      navigate("/coding/practice");

    } catch (err) {
      console.error("Generate Question Error:", err);
    }
  };

  return (
    <div className="container">
      <h2 className="title">Select Coding Topic</h2>

      {topics.map((t) => (
        <div
          key={t._id}
          className="topic-item"
          onClick={() => handleGenerateQuestion(t.name)}
        >
          {t.name}
        </div>
      ))}
    </div>
  );
};

export default CodingHome;