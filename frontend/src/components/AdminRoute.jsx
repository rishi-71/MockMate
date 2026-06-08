import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const AdminRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

  // 1. If the user is not logged in at all, send them to the login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 2. If the user IS logged in, but their role is NOT admin, send them back to the normal dashboard
  if (user.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  // 3. If they pass both checks, they are an admin! Let them see the page.
  return children;
};

export default AdminRoute;