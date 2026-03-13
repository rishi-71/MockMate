import { useState } from "react";
import axios from "../api/axios";
import "../styles/aiTutor.css";
import jsPDF from "jspdf";

const AITutor = () => {

const [topic,setTopic] = useState("");
const [content,setContent] = useState("");
const [loading,setLoading] = useState(false);

const token = localStorage.getItem("token");

const generateLesson = async () => {

if(!topic){
alert("Enter a topic");
return;
}

try{

setLoading(true);

const res = await axios.post(
"/ai/teach",
{topic},
{
headers:{Authorization:`Bearer ${token}`}
}
);

setContent(res.data.content);

}catch(err){

console.error(err);
setContent("AI failed to generate notes.");

}

setLoading(false);

};

const downloadPDF = () => {

const doc = new jsPDF();

doc.setFontSize(18);
doc.text(topic + " Notes",20,20);

doc.setFontSize(12);

const lines = doc.splitTextToSize(content,170);

doc.text(lines,20,40);

doc.save(`${topic}-notes.pdf`);

};

return (

<div className="ai-tutor">

<h1 className="ai-title">AI Study Assistant</h1>

<p className="ai-subtitle">
Generate structured notes for any computer science topic
</p>

<div className="ai-search-box">

<input
type="text"
placeholder="Enter topic (Binary Search, Sliding Window...)"
value={topic}
onChange={(e)=>setTopic(e.target.value)}
/>

<button
className="ai-btn"
onClick={generateLesson}
>
{loading ? "Generating..." : "Generate Notes"}
</button>

</div>

{content && (

<div className="ai-result">

<div className="notes-header">

<h2>{topic}</h2>

<button
className="download-btn"
onClick={downloadPDF}
>
Download PDF
</button>

</div>

<div className="notes-content">

{content.split("\n").map((line,index)=>{

if(line.includes(":")){
return <h3 key={index}>{line}</h3>;
}

return <p key={index}>{line}</p>;

})}

</div>

</div>

)}

</div>

);

};

export default AITutor;