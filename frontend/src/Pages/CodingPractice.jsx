import { useEffect, useState, useContext } from "react";
import axios from "../api/axios";
import Editor from "@monaco-editor/react";
import { ThemeContext } from "../context/ThemeContext";
import "../styles/coding.css";

const CodingPractice = () => {
  const [question, setQuestion] = useState(null);
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [hint, setHint] = useState("");
  const [hintLoading, setHintLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("problem");

  const { theme } = useContext(ThemeContext); // Use global theme for the editor
  const token = localStorage.getItem("token");

  // Load AI generated question
  useEffect(() => {
    const savedQuestion = localStorage.getItem("currentCodingQuestion");
    if (savedQuestion) {
      const parsed = JSON.parse(savedQuestion);
      setQuestion(parsed);
      setCode(parsed.template);
    }
  }, []);

  const runCode = async () => {
    try {
      setLoading(true);
      setActiveTab("output"); // Automatically switch to output tab
      let results = [];

      for (let i = 0; i < question.testCases.length; i++) {
        const test = question.testCases[i];
        const res = await axios.post(
          "/coding/execute",
          { code, input: test.input },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const output = res.data.stdout?.trim() || "";
        const expected = test.expectedOutput.trim();

        results.push({
          input: test.input,
          expected,
          output,
          passed: output === expected
        });
      }
      setOutput(results);
      setSubmissionResult(null); // Clear previous submission result
    } catch (err) {
      console.error(err);
      setOutput([{ input: "Error", expected: "-", output: "Execution Failed", passed: false }]);
    } finally {
      setLoading(false);
    }
  };

  const submitSolution = async () => {
    try {
      setLoading(true);
      setActiveTab("output");
      const res = await axios.post(
        "/coding/submit",
        { question, code },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSubmissionResult(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getHint = async () => {
    try {
      setHintLoading(true);
      setActiveTab("hint"); // Automatically switch to hint tab
      const res = await axios.post(
        "/coding/hint",
        { question, userCode: code },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setHint(res.data.hint);
    } catch (err) {
      console.error(err);
    } finally {
      setHintLoading(false);
    }
  };

  if (!question) return <div className="loading-screen">Loading Workspace...</div>;

  return (
    <div className="coding-workspace">
      
      {/* LEFT SIDE - Problem Description & Output */}
      <div className="problem-section">
        
        <div className="problem-header">
          <h2>{question.title}</h2>
          <span className="difficulty-badge">{question.difficulty || "Medium"}</span>
        </div>

        {/* Tabs */}
        <div className="problem-tabs">
          <button className={activeTab === "problem" ? "active-tab" : ""} onClick={() => setActiveTab("problem")}>
            Description
          </button>
          <button className={activeTab === "testcases" ? "active-tab" : ""} onClick={() => setActiveTab("testcases")}>
            Testcases
          </button>
          <button className={activeTab === "output" ? "active-tab" : ""} onClick={() => setActiveTab("output")}>
            Result
          </button>
          <button className={activeTab === "hint" ? "active-tab" : ""} onClick={() => setActiveTab("hint")}>
            AI Hint
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content-area">
          {activeTab === "problem" && (
            <div className="problem-content">
              <p>{question.description}</p>
            </div>
          )}

          {activeTab === "testcases" && (
            <div className="testcase-list">
              {question.testCases.map((t, index) => (
                <div key={index} className="testcase-box">
                  <div className="testcase-header">Test Case {index + 1}</div>
                  <div className="testcase-body">
                    <p className="io-label">Input:</p>
                    <pre>{t.input}</pre>
                    <p className="io-label">Expected Output:</p>
                    <pre>{t.expectedOutput}</pre>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "output" && (
            <div className="output-section">
              {loading && <div className="running-text">Executing code...</div>}
              
              {/* Submission Result (Final verdict) */}
              {submissionResult && (
                <div className={`verdict-box ${submissionResult.isCorrect ? "success" : "error"}`}>
                  <h3>{submissionResult.isCorrect ? "Accepted ✅" : "Wrong Answer ❌"}</h3>
                  <p>Passed {submissionResult.passed} / {submissionResult.total} test cases</p>
                  <p>Score Awarded: {submissionResult.score}</p>
                </div>
              )}

              {/* Standard Run Output */}
              {!loading && Array.isArray(output) && output.map((r, i) => (
                <div key={i} className={`result-box ${r.passed ? "passed" : "failed"}`}>
                  <div className="result-header">
                    <strong>Test Case {i + 1}</strong>
                    <span>{r.passed ? "Passed" : "Failed"}</span>
                  </div>
                  <div className="result-body">
                    <p className="io-label">Input:</p>
                    <pre>{r.input}</pre>
                    <p className="io-label">Expected:</p>
                    <pre>{r.expected}</pre>
                    <p className="io-label">Your Output:</p>
                    <pre>{r.output || "No output"}</pre>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "hint" && (
            <div className="hint-content">
              {hintLoading ? (
                <div className="running-text">AI is analyzing your code...</div>
              ) : hint ? (
                <div className="ai-hint-box">
                  <h3>🤖 AI Tutor Suggestion</h3>
                  <p>{hint}</p>
                </div>
              ) : (
                <p className="placeholder-text">Click "Get AI Hint" to receive guidance without giving away the answer.</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT SIDE - Code Editor */}
      <div className="editor-section">
        <div className="editor-wrapper">
          <Editor
            height="100%" /* Stretches to fill wrapper */
            language="cpp"
            theme={theme === "light" ? "light" : "vs-dark"}
            value={code}
            onChange={(value) => setCode(value)}
            options={{
              fontSize: 15,
              minimap: { enabled: false },
              automaticLayout: true,
              scrollBeyondLastLine: false,
              padding: { top: 16 }
            }}
          />
        </div>

        {/* Action Controls Bar */}
        <div className="editor-controls">
          <button className="btn-hint" onClick={getHint} disabled={hintLoading || loading}>
            {hintLoading ? "Thinking..." : "Get AI Hint"}
          </button>
          
          <div className="action-buttons">
            <button className="btn-run" onClick={runCode} disabled={loading}>
              Run Code
            </button>
            <button className="btn-submit" onClick={submitSolution} disabled={loading}>
              Submit
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default CodingPractice;