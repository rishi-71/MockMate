import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../api/axios";
import Editor from "@monaco-editor/react";


const CodingPractice = () => {
  const { topicId } = useParams();
  const [language,setLanguage] = useState("javascript");
  const [question, setQuestion] = useState(null);
  const [code, setCode] = useState("// Write your solution here");
  const [hint, setHint] = useState("");
  const [loadingHint, setLoadingHint] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchQuestion = async () => {
      const res = await axios.get(`/coding/questions/${topicId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // take first question for now
      setQuestion(res.data[0]);
    };

    fetchQuestion();
  }, []);

  const getHint = async () => {
    try {
      setLoadingHint(true);

      const res = await axios.post(
        "/coding/code-hint",
        {
          questionId: question._id,
          userCode: code,
          language
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setHint(res.data.hint);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingHint(false);
    }
  };

  if (!question) return <div className="container">Loading...</div>;

  return (
   <div className="coding-container">
  
  <div className="problem-section">
    <h2>{question.title}</h2>
    <p>{question.description}</p>
  </div>

  <div className="editor-section">
    <div className="editor-header">
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="language-select"
      >
        <option value="javascript">JavaScript</option>
        <option value="python">Python</option>
        <option value="cpp">C++</option>
        <option value="java">Java</option>
      </select>

      <button className="btn" onClick={getHint}>
        {loadingHint ? "Analyzing..." : "Get AI Hint"}
      </button>
    </div>

    <Editor
      height="450px"
      language={language}
      theme="vs-dark"
      value={code}
      onChange={(value) => setCode(value)}
      options={{
        fontSize: 14,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        automaticLayout: true,
      }}
    />

    {hint && (
      <div className="hint-box">
        <strong>AI Hint:</strong> {hint}
      </div>
    )}
  </div>

</div>
  );
};

export default CodingPractice;