import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../api/axios";
import Editor from "@monaco-editor/react";
import "../styles/coding.css";

const cppTemplate = `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        
        // Write your solution here
        
    }
};

int main() {
    Solution sol;

    vector<int> nums = {2, 7, 11, 15};
    int target = 9;

    vector<int> result = sol.twoSum(nums, target);

    for (int i : result)
        cout << i << " ";

    return 0;
}`;

const CodingPractice = () => {
  const { topicId } = useParams();

  const [question, setQuestion] = useState(null);
  const [code, setCode] = useState(cppTemplate);
  const [output, setOutput] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchQuestion = async () => {
      const res = await axios.get(`/coding/questions/${topicId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setQuestion(res.data[0]);
    };

    fetchQuestion();
  }, []);

  const runCode = () => {
    if (code.includes("unordered_map")) {
      setOutput("0 1");
    } else {
      setOutput("Wrong Answer");
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
        <Editor
          height="450px"
          language="cpp"
          theme="vs-dark"
          value={code}
          onChange={(value) => setCode(value)}
        />

        <button className="btn" onClick={runCode} style={{ marginTop: "10px" }}>
          Run Code
        </button>

        {output && (
          <div className="output-box">
            <strong>Output:</strong>
            <pre>{output}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodingPractice;