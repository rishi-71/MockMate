import { useEffect, useState } from "react"
import { Routes, Route } from "react-router-dom"

import Login from "./Pages/Login"
import Register from "./Pages/Register"
import Dashboard from "./Pages/Dashboard"
import Quiz from "./Pages/Quiz"
import Result from "./Pages/Result"

function App() {
  const [theme, setTheme] = useState("light")

  // Load saved theme on first load
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme")
    if (savedTheme) {
      setTheme(savedTheme)
      document.documentElement.setAttribute("data-theme", savedTheme)
    } else {
      document.documentElement.setAttribute("data-theme", "light")
    }
  }, [])

  // Update theme when changed
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme)
    localStorage.setItem("theme", theme)
  }, [theme])

  return (
    <Routes>
      <Route path="/" element={<Login setTheme={setTheme} theme={theme} />} />
      <Route path="/register" element={<Register setTheme={setTheme} theme={theme} />} />
      <Route path="/dashboard" element={<Dashboard setTheme={setTheme} theme={theme} />} />
      <Route path="/quiz" element={<Quiz setTheme={setTheme} theme={theme} />} />
      <Route path="/result" element={<Result setTheme={setTheme} theme={theme} />} />
    </Routes>
  )
}

export default App
