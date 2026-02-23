import { useEffect, useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

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
    <div>
      <h2>Topics</h2>
      {topics.map((t) => (
        <div
          key={t._id}
          onClick={() => navigate(`/quiz/${t._id}`)}
          style={{
            cursor: "pointer",
            margin: "10px 0",
            padding: "8px",
            border: "1px solid black"
          }}
        >
          {t.name}
        </div>
      ))}
      <button onClick={() => navigate("/results")}>
  View Progress
</button>
    </div>
  );
};

export default Dashboard;