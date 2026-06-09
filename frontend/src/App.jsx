import { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import PageWrapper from "./components/PageWrapper";
import Navbar from "./components/Navbar"; // Ensure your folder casing matches
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Dashboard from "./Pages/Dashboard";
import Quiz from "./Pages/Theory"; // Might be unused based on TheoryQuiz below
import Result from "./Pages/Result";
import CodingHome from "./Pages/CodingHome";
import TheoryQuiz from "./Pages/TheoryQuiz";
import TheoryHome from "./Pages/CodingHome"; // Double-check this import if intended for Theory
import CodingPractice from "./Pages/CodingPractice";
import Landing from "./Pages/Landing";
import ProtectedRoute from "./components/Protected";
import AITutor from "./Pages/AITutor";

// --- ADMIN IMPORTS ---
import AdminRoute from "./components/AdminRoute"; // Make sure this path is correct
import AdminDashboard from "./Pages/AdminDashboard";
import AdminUsers from "./Pages/AdminUsers";
import AdminProblems from "./Pages/AdminProblems";
import AdminAnalytics from "./Pages/AdminAnalytics";

function App() {
  const [theme, setTheme] = useState("dark");
  const location = useLocation();

  // Hide navbar on auth pages
  const hideNavbar =
    location.pathname === "/" || location.pathname === "/register" || location.pathname === "/login";

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
          
          {/* PUBLIC ROUTES */}
          <Route path="/" element={ <PageWrapper><Landing /></PageWrapper> } />
          <Route path="/login" element={ <PageWrapper><Login /></PageWrapper> } />
          <Route path="/register" element={ <PageWrapper><Register /></PageWrapper> } />

          {/* STUDENT PROTECTED ROUTES */}
          <Route path="/dashboard" element={<ProtectedRoute><PageWrapper><Dashboard /></PageWrapper></ProtectedRoute>} />
          <Route path="/coding" element={<ProtectedRoute><PageWrapper><CodingHome /></PageWrapper></ProtectedRoute>} />
          <Route path="/coding/quiz/:topicId" element={<ProtectedRoute><PageWrapper><CodingPractice /></PageWrapper></ProtectedRoute>} />
          <Route path="/theory" element={<ProtectedRoute><PageWrapper><TheoryQuiz /></PageWrapper></ProtectedRoute>} />
          <Route path="/theory/quiz/:modulateId" element={<ProtectedRoute><PageWrapper><TheoryQuiz /></PageWrapper></ProtectedRoute>} />
          <Route path="/results" element={<ProtectedRoute><PageWrapper><Result /></PageWrapper></ProtectedRoute>} />
          <Route path="/coding/practice" element={<ProtectedRoute><PageWrapper><CodingPractice /></PageWrapper></ProtectedRoute>} />
          <Route path="/ai-tutor" element={<ProtectedRoute><PageWrapper><AITutor /></PageWrapper></ProtectedRoute>} />

          {/* ADMIN PROTECTED ROUTES */}
          <Route 
            path="/admin/dashboard" 
            element={
              <AdminRoute>
                <PageWrapper>
                  <AdminDashboard />
                </PageWrapper>
              </AdminRoute>
            } 
          />
          <Route 
            path="/admin/users" 
            element={
              <AdminRoute>
                <PageWrapper>
                  <AdminUsers />
                </PageWrapper>
              </AdminRoute>
            } 
          />
          <Route path="/admin/problems" element={<AdminRoute><PageWrapper><AdminProblems /></PageWrapper></AdminRoute>} />

          <Route 
  path="/admin/analytics" 
  element={
    <AdminRoute>
      <PageWrapper>
        <AdminAnalytics />
      </PageWrapper>
    </AdminRoute>
  } 
/>
             
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default App;