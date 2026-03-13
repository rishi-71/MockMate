import { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import PageWrapper from "./components/PageWrapper";
import Navbar from "./components/Navbar";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Dashboard from "./Pages/Dashboard";
import Quiz from "./Pages/Theory";
import Result from "./Pages/Result";
import CodingHome from "./Pages/CodingHome";
import TheoryQuiz from "./Pages/TheoryQuiz";
import TheoryHome from "./Pages/CodingHome";
import CodingPractice from "./Pages/CodingPractice";
import Landing from "./Pages/Landing";
import ProtectedRoute from "./components/Protected";
import AITutor from "./Pages/AITutor";

function App() {
  const [theme, setTheme] = useState("dark");
  const location = useLocation();

  // Hide navbar on auth pages
  const hideNavbar =
    location.pathname === "/" || location.pathname === "/register";

  // Load saved theme
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const initialTheme = savedTheme || "dark";

    setTheme(initialTheme);
    document.documentElement.setAttribute("data-theme", initialTheme);
  }, []);

  // Update theme
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <>
      {!hideNavbar && <Navbar />}

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <PageWrapper>
                <Landing setTheme={setTheme} theme={theme} />
              </PageWrapper>
            }
          />
          <Route
            path="/login"
            element={
              <PageWrapper>
                <Login setTheme={setTheme} theme={theme} />
              </PageWrapper>
            }
          />
          <Route
            path="/register"
            element={
              <PageWrapper>
                <Register setTheme={setTheme} theme={theme} />
              </PageWrapper>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
              <PageWrapper>
                <Dashboard setTheme={setTheme} theme={theme} />
              </PageWrapper>
              </ProtectedRoute>
            }
          />
          <Route
            path="/coding"
            element={
              <ProtectedRoute>
              <PageWrapper>
                <CodingHome />
              </PageWrapper>
              </ProtectedRoute>
            }
          />
          <Route
            path="/coding/quiz/:topicId"
            element={
              <ProtectedRoute>
              <PageWrapper>
                <CodingPractice />
              </PageWrapper>
              </ProtectedRoute>
            }
          />
          <Route
            path="/theory"
            element={
              <ProtectedRoute>
              <PageWrapper>
                <TheoryQuiz />
              </PageWrapper>
              </ProtectedRoute>
            }
          />
          <Route
            path="/theory/quiz/:modulateId"
            element={
              <ProtectedRoute>
              <PageWrapper>
                <TheoryQuiz />
              </PageWrapper>
              </ProtectedRoute>
            }
          />
          <Route
            path="/results"
            element={
              <ProtectedRoute>
              <PageWrapper>
                <Result />
              </PageWrapper>
              </ProtectedRoute>
            }
          />
          <Route
            path="/coding/practice"
            element={
              <ProtectedRoute>
              <PageWrapper>
                <CodingPractice />
              </PageWrapper>
              </ProtectedRoute>
            }
          />
          <Route path="/ai-tutor" element={<ProtectedRoute>
              <PageWrapper>
                <AITutor />
              </PageWrapper>
              </ProtectedRoute>} />
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default App;
