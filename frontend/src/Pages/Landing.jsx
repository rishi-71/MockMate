import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/landing.css";

const Landing = () => {
  return (

<div className="landing">

{/* NAVBAR */}

<nav className="navbar">

<div className="logo">MockMate</div>

<div className="nav-links">

<a href="#hero">Home</a>
<a href="#stats">Stats</a>
<a href="#features">Features</a>
<a href="#how">How it Works</a>

<Link to="/login" className="btn-outline">Login</Link>

<Link to="/register" className="btn-primary">
Get Started
</Link>

</div>

</nav>


{/* HERO */}

<section id="hero" className="hero">

<div className="hero-container">

<div className="hero-left">

<h1>
Master Coding Interviews with <span>AI</span>
</h1>

<p>
Practice coding problems, generate quizzes,
and get AI hints while solving them.
</p>

<div className="hero-buttons">

<Link to="/register" className="btn-primary">
Start Practicing
</Link>

<Link to="/login" className="btn-outline">
Login
</Link>

</div>

</div>


<div className="hero-right">

<div className="code-window">

<div className="window-bar">

<span className="dot red"></span>
<span className="dot yellow"></span>
<span className="dot green"></span>

</div>

<pre>
{`function twoSum(nums,target){

const map={}

for(let i=0;i<nums.length;i++){

const complement=target-nums[i]

if(map[complement]!==undefined){

return [map[complement],i]

}

map[nums[i]]=i

}

}`}
</pre>

</div>

</div>

</div>

</section>


{/* STATS */}

<section id="stats" className="stats">

<div className="stat">
<h3>10K+</h3>
<p>Questions Generated</p>
</div>

<div className="stat">
<h3>5K+</h3>
<p>Students Practicing</p>
</div>

<div className="stat">
<h3>AI</h3>
<p>Powered Learning</p>
</div>

<div className="stat">
<h3>100+</h3>
<p>Topics Covered</p>
</div>

</section>


{/* FEATURES */}

<section id="features" className="features">

<h2>Platform Features</h2>

<div className="features-grid">

<div className="feature-card">
<h3>AI Coding Questions</h3>
<p>Generate coding problems dynamically.</p>
</div>

<div className="feature-card">
<h3>Code Editor</h3>
<p>Practice coding inside built-in editor.</p>
</div>

<div className="feature-card">
<h3>AI Hints</h3>
<p>Get hints without revealing answers.</p>
</div>

<div className="feature-card">
<h3>Theory Quiz</h3>
<p>Upload syllabus and generate quizzes.</p>
</div>

</div>

</section>


{/* HOW */}

<section id="how" className="how">

<h2>How It Works</h2>

<div className="how-grid">

<div className="step">
<h3>1</h3>
<p>Upload your syllabus</p>
</div>

<div className="step">
<h3>2</h3>
<p>Generate quiz with AI</p>
</div>

<div className="step">
<h3>3</h3>
<p>Solve coding questions</p>
</div>

<div className="step">
<h3>4</h3>
<p>Get AI hints</p>
</div>

</div>

</section>


{/* CTA */}

<section className="cta">

<h2>Ready to improve your coding skills?</h2>

<Link to="/register" className="btn-primary">
Start Practicing
</Link>

</section>


{/* FOOTER */}

<footer className="footer">

<p>© 2026 MockMate AI Platform</p>

</footer>

</div>

  );
};

export default Landing;