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
  }, []);

  return (
    <div className="container">
      <h2 className="title">Select Coding Topic</h2>

      {topics.map((t) => (
        <div
          key={t._id}
          className="topic-item"
          onClick={() => navigate(`/coding/quiz/${t._id}`)}
        >
          {t.name}
        </div>
      ))}
    </div>
  );
};

export default CodingHome;