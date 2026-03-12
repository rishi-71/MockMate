import { useEffect, useState } from "react";
import axios from "../api/axios";
import Editor from "@monaco-editor/react";
import "../styles/coding.css";

const CodingPractice = () => {
  const [question, setQuestion] = useState(null);
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  //const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [hint,setHint] = useState("");
  const [hintLoading, setHintLoading] = useState(false);
  const [activeTab , setActiveTab] = useState("problem");

  const token = localStorage.getItem("token");

  // Load AI generated question
useEffect(() => {
  const savedQuestion = localStorage.getItem("currentCodingQuestion");

  if (savedQuestion) {
    const parsed = JSON.parse(savedQuestion);
    console.log("Loaded Question:", parsed);
    setQuestion(parsed);
    setCode(parsed.template);
  }
}, []);

const runCode = async () => {

  try {

    setLoading(true);
    let results = [];

    for (let i = 0; i < question.testCases.length; i++) {

      const test = question.testCases[i];

      const res = await axios.post(
        "/coding/execute",
        {
          code,
          input: test.input
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const output = res.data.stdout?.trim();
      const expected = test.expectedOutput.trim();

      results.push({
        input: test.input,
        expected,
        output,
        passed: output === expected
      });
    }

    setOutput(results);

  } catch (err) {

    console.error(err);

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
        question,
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

const getHint = async () => {

  try {

    setHintLoading(true);

    const res = await axios.post(
      "/coding/hint",
      {
        question,
        userCode: code
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    setHint(res.data.hint);

  } catch (err) {
    console.error(err);
  } finally {
    setHintLoading(false);
  }
};
  return (
  <div className="coding-container">

    <div className="tabs">

<button
className={activeTab==="problem" ? "active-tab" : ""}
onClick={()=>setActiveTab("problem")}
>
Problem
</button>

<button
className={activeTab==="testcases" ? "active-tab" : ""}
onClick={()=>setActiveTab("testcases")}
>
Testcases
</button>

<button
className={activeTab==="output" ? "active-tab" : ""}
onClick={()=>setActiveTab("output")}
>
Output
</button>

<button
className={activeTab==="hint" ? "active-tab" : ""}
onClick={()=>setActiveTab("hint")}
>
Hint
</button>

</div>


    {/* LEFT SIDE - Problem */}
    {/* <div className="problem-section">
      <h2>{question.title}</h2>
      <p>{question.description}</p>
    </div>


    <h3 style={{ marginTop: "20px" }}>Test Cases</h3> */}

    {activeTab === "problem" && (
  <div>
    <h2>{question.title}</h2>
    <p>{question.description}</p>
  </div>
)}

{activeTab === "testcases" && (
  <div>
    <h3>Test Cases</h3>

    {question.testCases.map((t,i)=>(
      <div key={i} className="testcase">
        <p><b>Input:</b> {t.input}</p>
        <p><b>Expected:</b> {t.expectedOutput}</p>
      </div>
    ))}

  </div>
)}

{activeTab === "output" && output && (
  <div>
    <h3>Execution Output</h3>
    <pre>{output}</pre>
  </div>
)}

{activeTab === "hint" && hint && (
  <div className="hint-box">
    <h3>AI Hint</h3>
    <p>{hint}</p>
  </div>
)}

{/* {question.testCases.map((t, index) => (
  <div key={index} className="testcase-box">
    <strong>Test Case {index + 1}</strong>
    <p><b>Input:</b> {t.input}</p>
    <p><b>Expected:</b> {t.expectedOutput}</p>
  </div>
))} */}

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
      {hint && (
  <div className="hint-box">
    <h3>AI Hint</h3>
    <p>{hint}</p>
  </div>
)}

     

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

        <button
  className="btn hint-btn"
  onClick={getHint}
  style={{ marginTop: "10px" }}
>
  {hintLoading ? "Generating Hint..." : "Get AI Hint"}
</button>

{Array.isArray(output) && (
  <div className="output-box">
    <h3>Test Results</h3>

    {output.map((r, i) => (
      <div key={i} className="test-result">
        <strong>Test Case {i + 1}</strong>

        <p>Input: {r.input}</p>
        <p>Expected: {r.expected}</p>
        <p>Your Output: {r.output}</p>

        <p style={{ color: r.passed ? "#00ff88" : "#ff4d4d" }}>
          {r.passed ? "Passed" : "Failed"}
        </p>
      </div>
    ))}
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