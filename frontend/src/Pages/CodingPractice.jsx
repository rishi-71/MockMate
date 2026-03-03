import { useEffect, useState } from "react";
import axios from "../api/axios";
import Editor from "@monaco-editor/react";
import "../styles/coding.css";

const CodingPractice = () => {
  const [question, setQuestion] = useState(null);
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);

  const token = localStorage.getItem("token");

  // Load AI generated question
  useEffect(() => {
    const savedQuestion = localStorage.getItem("currentCodingQuestion");

    if (savedQuestion) {
      const parsed = JSON.parse(savedQuestion);
      setQuestion(parsed);
      setCode(parsed.template); // load template into editor
    }
  }, []);

  const runCode = async () => {
    try {
      setLoading(true);
      setOutput("");

      const res = await axios.post(
        "/coding/execute",
        {
          code,
          input,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.compile_output) {
        setOutput("Compile Error:\n" + res.data.compile_output);
      } else if (res.data.stderr) {
        setOutput("Runtime Error:\n" + res.data.stderr);
      } else {
        setOutput(res.data.stdout || "No Output");
      }

    } catch (err) {
      console.error("Execution Error:", err);
      setOutput("Execution Failed");
    } finally {
      setLoading(false);
    }
  };

  if (!question) return <div className="container">Loading...</div>;
  
  const submitSolution = async () => {
    console.log("Submit Button Clicked");
  try {
    const res = await axios.post(
      "/coding/submit",
      {
        questionId: question._id,
        code
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    console.log("Submission Response: ",res.data);

    setSubmissionResult(res.data);

  } catch (err) {
    console.error(err);
  }

};
  return (
  <div className="coding-container">

    {/* LEFT SIDE - Problem */}
    <div className="problem-section">
      <h2>{question.title}</h2>
      <p>{question.description}</p>
    </div>

    {/* RIGHT SIDE - Editor */}
    <div className="editor-section">
      <Editor
        height="400px"
        language="cpp"
        theme="vs-dark"
        value={code}
        onChange={(value) => setCode(value)}
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          automaticLayout: true,
        }}
      />

      <h3 style={{ marginTop: "15px" }}>Custom Input</h3>
      <textarea
        className="input-box"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter test input here"
      />

      <button
        className="btn"
        onClick={runCode}
        style={{ marginTop: "10px" }}
      >
        {loading ? "Running..." : "Run Code"}
      </button>

      <button
        className="btn submit-btn"
        onClick={submitSolution}
        style={{ marginTop: "10px" }}
      >
        Submit Solution
      </button>

      {output && (
        <div className="output-box">
          <strong>Output:</strong>
          <pre>{output}</pre>
        </div>
      )}

      {submissionResult && (
        <div
          className="result-box"
          style={{
            marginTop: "15px",
            padding: "10px",
            background: submissionResult.isCorrect ? "#123c1f" : "#3c1212",
            color: submissionResult.isCorrect ? "#00ff88" : "#ff4d4d",
            borderRadius: "6px"
          }}
        >
          <strong>
            {submissionResult.isCorrect ? "Accepted ✅" : "Wrong Answer ❌"}
          </strong>
          <p>
            Passed {submissionResult.passed} / {submissionResult.total} test cases
          </p>
          <p>Score: {submissionResult.score}</p>
        </div>
      )}

    </div>
  </div>
);
  
};

export default CodingPractice;