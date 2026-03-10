import {useEffect,useState} from "react";
import axios from "../api/axios";

const Results = ()=>{

const [quiz,setQuiz] = useState([]);
const [coding,setCoding] = useState([]);

const token = localStorage.getItem("token");

useEffect(()=>{

const fetchResults = async ()=>{

const res = await axios.get(
"/results",
{
headers:{Authorization:`Bearer ${token}`}
}
);

console.log("Api response",res.data);

setQuiz(res.data.quizResults);
setCoding(res.data.codingResults);

};

fetchResults();

},[]);

return(

<div className="container">

<h2>Quiz Results</h2>

{quiz.map(r=>(
<div key={r._id}>

Score: {r.score}/{r.total}

</div>
))}

<h2 style={{marginTop:"30px"}}>Coding Results</h2>

{coding.map(r=>(
<div key={r._id}>

Passed: {r.passed}/{r.total}

</div>
))}

</div>

)

}

export default Results;