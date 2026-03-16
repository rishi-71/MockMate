import { useState } from "react";
import axios from "../api/axios";
import { FaBookOpen, FaDownload, FaSpinner, FaSearch } from "react-icons/fa";
import jsPDF from "jspdf";
import "../styles/aiTutor.css";

const AITutor = () => {
  const [topic, setTopic] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const generateLesson = async () => {
    if (!topic.trim()) {
      alert("Please enter a topic to generate notes.");
      return;
    }

    try {
      setLoading(true);
      setContent(""); // Clear previous content

      const res = await axios.post(
        "/ai/teach",
        { topic },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setContent(res.data.content);
    } catch (err) {
      console.error(err);
      setContent("❌ AI failed to generate notes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Helper function to convert basic AI Markdown into formatted HTML
  const renderFormattedContent = (text) => {
    return text.split("\n").map((line, index) => {
      const trimmed = line.trim();
      if (!trimmed) return <br key={index} />;

      // Handle Headers
      if (trimmed.startsWith("### ")) return <h4 key={index}>{trimmed.replace("### ", "")}</h4>;
      if (trimmed.startsWith("## ")) return <h3 key={index}>{trimmed.replace("## ", "")}</h3>;
      if (trimmed.startsWith("# ")) return <h2 key={index}>{trimmed.replace("# ", "")}</h2>;

      // Handle bold text parsing within paragraphs or lists
      const formatBold = (str) => {
        return str.split("**").map((part, i) => (i % 2 === 1 ? <strong key={i}>{part}</strong> : part));
      };

      // Handle Lists
      if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
        return <li key={index} className="note-list-item">{formatBold(trimmed.substring(2))}</li>;
      }

      // Default Paragraph
      return <p key={index} className="note-paragraph">{formatBold(trimmed)}</p>;
    });
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const margin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Title
    doc.setFontSize(22);
    doc.setTextColor(234, 88, 12); // Accent Color
    doc.text(`${topic} - Study Notes`, margin, 20);

    // Body Content
    doc.setFontSize(11);
    doc.setTextColor(40, 40, 40); // Dark grey for readability in PDF

    // Clean up Markdown symbols for the plain text PDF
    const cleanContent = content.replace(/\*\*/g, "").replace(/#/g, "");
    
    // Split text so it wraps nicely within the page bounds
    const lines = doc.splitTextToSize(cleanContent, pageWidth - margin * 2);

    doc.text(lines, margin, 35);
    doc.save(`${topic.replace(/\s+/g, "_")}_Notes.pdf`);
  };

  return (
    <div className="tutor-container">
      
      {loading && (
        <div className="loading-overlay">
          <div className="loading-content">
            <FaSpinner className="spinner-icon" />
            <h2>Writing Notes...</h2>
            <p>Gathering the best explanations for "{topic}"</p>
          </div>
        </div>
      )}

      <div className="tutor-header">
        <h1 className="tutor-title">AI Study Assistant</h1>
        <p className="tutor-subtitle">
          Generate perfectly structured, easy-to-understand notes for any computer science topic.
        </p>
      </div>

      <div className="search-wrapper">
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="e.g. Binary Search, Operating System Scheduling..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && generateLesson()}
          />
          <button className="generate-btn" onClick={generateLesson} disabled={loading}>
            <FaBookOpen /> {loading ? "Generating..." : "Generate Notes"}
          </button>
        </div>
      </div>

      {content && (
        <div className="notes-panel">
          <div className="notes-header">
            <div className="notes-title-group">
              <span className="badge">Generated Notes</span>
              <h2>{topic}</h2>
            </div>
            <button className="download-btn" onClick={downloadPDF}>
              <FaDownload /> Download PDF
            </button>
          </div>

          <div className="notes-content">
            {renderFormattedContent(content)}
          </div>
        </div>
      )}
    </div>
  );
};

export default AITutor;