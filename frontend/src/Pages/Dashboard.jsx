import { useEffect, useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";

const Dashboard = () => {
  const [topics, setTopics] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopics = async () => {
      const token = localStorage.getItem("token");

      const res = await axios.get("/coding/topics", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTopics(res.data);
    };

    fetchTopics();
  }, []);

  return (
   <div className="container">
  <h2 className="title">Topics</h2>

  {topics.map((t) => (
    <div
      key={t._id}
      className="topic-item"
      onClick={() => navigate(`/quiz/${t._id}`)}
    >
      {t.name}
    </div>
  ))}
</div>
  );
};

export default Dashboard;