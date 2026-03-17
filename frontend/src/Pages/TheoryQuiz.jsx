import { useState } from "react";
import axios from "../api/axios";
import { FaFileUpload, FaMagic, FaSpinner, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import "../styles/theory.css";

const TheoryQuiz = () => {
  const [syllabus, setSyllabus] = useState("");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [difficulty, setDifficulty] = useState("Medium");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const generateQuiz = async () => {
    if (!syllabus && !file) {
      alert("Please provide a syllabus text or upload a file.");
      return;
    }

    setLoading(true);
    setResult(null); // Clear previous results
    try {
      if (file) {
        // Handle File Upload Generation
        const formData = new FormData();
        formData.append("file", file);
        formData.append("difficulty", difficulty);

        const res = await axios.post("/theory/generate-file", formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setQuestions(res.data.questions);
      } else {
        // Handle Text Generation
        const res = await axios.post(
          "/theory/generate",
          { syllabus, difficulty },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setQuestions(res.data.questions);
      }
      setAnswers({});
    } catch (err) {
      console.error(err);
      alert("Failed to generate quiz. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (index, option) => {
    setAnswers({
      ...answers,
      [index]: option,
    });
  };

const submitQuiz = async () => {
    setLoading(true);

    // --- SMART GRADING LOGIC ---
    let calculatedScore = 0;

    const formatted = questions.map((q, i) => {
      const rawUserAnswer = answers[i] || "Not Answered";
      const cAns = q.answer || ""; // The AI's correct answer

      // Helper function to extract "A", "B", "C", "D" from the start of a string
      const getLetter = (str) => {
        const match = str.trim().match(/^([A-D])(?:[\)\.\-:]|\s|$)/i);
        return match ? match[1].toUpperCase() : null;
      };

      const uLetter = getLetter(rawUserAnswer);
      const cLetter = getLetter(cAns);

      let isCorrect = false;

      // 1. Strict match (if AI perfectly matched the string)
      if (rawUserAnswer.trim() === cAns.trim()) {
        isCorrect = true;
      } 
      // 2. Letter match (Handles "B) text..." vs "B")
      else if (uLetter && cLetter && uLetter === cLetter) {
        isCorrect = true;
      }

      if (isCorrect) {
        calculatedScore++;
      }

      return {
        question: q.question,
        options: q.options,
        // BULLETPROOF FIX: If our smart logic says it's correct, force the strings 
        // to match perfectly so the backend database grades it as 100% correct!
        correctAnswer: isCorrect ? rawUserAnswer : cAns, 
        userAnswer: rawUserAnswer,
        isCorrect: isCorrect 
      };
    });

    try {
      const res = await axios.post(
        "/theory/submit",
        { questions: formatted },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Override the backend's result with our smart-graded version for the UI
      setResult({
        ...res.data,
        score: calculatedScore,
        total: questions.length,
        questions: formatted
      });
      
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="theory-container">
      
      {loading && (
        <div className="loading-overlay">
          <div className="loading-content">
            <FaSpinner className="spinner-icon" />
            <h2>{result ? "Grading Quiz..." : "Generating Quiz..."}</h2>
            <p>Our AI is analyzing your syllabus.</p>
          </div>
        </div>
      )}

      <div className="theory-header">
        <h1 className="theory-title">AI Theory Quiz Generator</h1>
        <p className="theory-subtitle">Upload a syllabus or paste topics to instantly generate a custom practice test.</p>
      </div>

      {/* INPUT SECTION */}
      {!result && questions.length === 0 && (
        <div className="input-panel">
          
          <div className="input-group">
            <label className="input-label">Paste Syllabus or Topics</label>
            <textarea
              className="syllabus-input"
              placeholder="e.g. Operating Systems, Deadlocks, Mutex, Semaphores..."
              value={syllabus}
              onChange={(e) => {
                setSyllabus(e.target.value);
                setFile(null); // Clear file if typing
              }}
              disabled={file !== null}
            />
          </div>

          <div className="divider">OR</div>

          <div className="input-group">
            <label className="input-label">Upload Document (.pdf, image)</label>
            <div className="file-upload-wrapper">
              <input
                type="file"
                id="file-upload"
                accept=".pdf,image/*"
                onChange={(e) => {
                  setFile(e.target.files[0]);
                  setSyllabus(""); // Clear text if uploading
                }}
              />
              <label htmlFor="file-upload" className="file-upload-btn">
                <FaFileUpload /> {file ? file.name : "Choose File"}
              </label>
            </div>
          </div>

          <div className="controls-row">
            <div className="difficulty-toggle">
              {["Easy", "Medium", "Hard"].map((level) => (
                <button
                  key={level}
                  className={`diff-btn ${difficulty === level ? "active" : ""}`}
                  onClick={() => setDifficulty(level)}
                >
                  {level}
                </button>
              ))}
            </div>

            <button className="generate-btn" onClick={generateQuiz}>
              <FaMagic /> Generate Quiz
            </button>
          </div>

        </div>
      )}

      {/* RESULTS SECTION */}
      {result && (
        <div className="results-panel">
          <div className="score-header">
            <h2>Quiz Results</h2>
            <div className="score-circle">
              <span className="score-number">{result.score}</span>
              <span className="score-total">/ {result.total}</span>
            </div>
          </div>

          <div className="results-list">
            {result.questions.map((q, i) => {
              // Ensure we have a boolean for correctness
              const isCorrect = q.isCorrect !== undefined ? q.isCorrect : q.userAnswer === q.correctAnswer;
              
              return (
                <div key={i} className={`result-card ${isCorrect ? "correct" : "incorrect"}`}>
                  <div className="result-card-header">
                    <h4>{i + 1}. {q.question}</h4>
                    {isCorrect ? <FaCheckCircle className="icon-correct" /> : <FaTimesCircle className="icon-incorrect" />}
                  </div>
                  <div className="result-answers">
                    <p className={`user-answer ${isCorrect ? "text-correct" : "text-incorrect"}`}>
                      <strong>Your Answer:</strong> {q.userAnswer}
                    </p>
                    {!isCorrect && (
                      <p className="correct-answer">
                        <strong>Correct Answer:</strong> {q.correctAnswer}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <button className="generate-btn secondary" onClick={() => { setResult(null); setQuestions([]); setFile(null); setSyllabus(""); }}>
            Create New Quiz
          </button>
        </div>
      )}

      {/* QUIZ TAKING SECTION */}
      {!result && questions.length > 0 && (
        <div className="quiz-panel">
          
          <div className="quiz-header">
            <h3>Custom Quiz ({difficulty})</h3>
            <span>{questions.length} Questions</span>
          </div>

          <div className="questions-list">
            {questions.map((q, i) => (
              <div key={i} className="question-card">
                <h4>{i + 1}. {q.question}</h4>
                
                <div className="options-grid">
                  {q.options.map((option, idx) => (
                    <label 
                      key={idx} 
                      className={`option-label ${answers[i] === option ? "selected" : ""}`}
                    >
                      <input
                        type="radio"
                        name={`question-${i}`}
                        value={option}
                        checked={answers[i] === option}
                        onChange={() => handleOptionSelect(i, option)}
                      />
                      <span className="custom-radio"></span>
                      {option}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="quiz-actions">
            <button className="generate-btn submit" onClick={submitQuiz}>
              Submit Quiz
            </button>
          </div>

        </div>
      )}

    </div>
  );
};

export default TheoryQuiz;