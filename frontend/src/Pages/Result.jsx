// import { useEffect, useState } from "react";
// import axios from "../api/axios";

// const Result = () => {
//   const [results, setResults] = useState([]);
//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     const fetchResults = async () => {
//       const res = await axios.get("/coding/results", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       setResults(res.data);
//     };

//     fetchResults();
//   }, []);

//   return (
// <div className="container">
//   <h2 className="title">Your Progress</h2>

//   {results.map((r) => (
//     <div key={r._id} className="result-item">
//       <strong>{r.question?.title}</strong>
//       <p className={r.isCorrect ? "correct" : "wrong"}>
//         {r.isCorrect ? "Correct" : "Wrong"}
//       </p>
//       <p>Score: {r.score}</p>
//     </div>
//   ))}
// </div>
//   );
// };

// export default Result;

import { useLocation } from "react-router-dom";

const Result = () => {

  const location = useLocation();
  const result = location.state;

  if (!result) return <h2>No result found</h2>;

  return (
    <div className="container">

      <h2>Quiz Result</h2>

      <h3>
        Score: {result.score} / {result.total}
      </h3>

    </div>
  );
};

export default Result;