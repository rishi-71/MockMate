import { useLocation, useNavigate } from "react-router-dom";
import "../styles/result.css";

const Result = () => {

  async function handleRegister() {


    try {
      await api.post("/auth/register", {
        name,
        email,
        password
      })

      navigate("/login");
    } catch (err) {
      alert("Registration failed");
      console.log(err);
    }

  }
}

  return (
    <div className="result-container">

      <h1 className="result-title">Quiz Result</h1>

      <div className="score-box">
        Score: {result.score} / {result.total}
      </div>

      {result.questions.map((q, index) => (
        <div key={index} className="result-card">

          <h3>
            {index + 1}. {q.question}
          </h3>

          <p>
            <strong>Your Answer:</strong> {q.userAnswer || "Not Answered"}
          </p>

          <p>
            <strong>Correct Answer:</strong> {q.correctAnswer}
          </p>

          <p
            className={q.isCorrect ? "correct" : "wrong"}
          >
            {q.isCorrect ? "Correct ✔" : "Incorrect ❌"}
          </p>

        </div>
      ))}

      <button
        className="result-btn"
        onClick={() => navigate("/dashboard")}
      >
        Back to Dashboard
      </button>

    </div>
  );
};

export default Result;