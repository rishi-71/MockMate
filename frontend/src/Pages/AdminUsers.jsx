import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { FaArrowLeft, FaTrash, FaUserShield, FaUserGraduate } from "react-icons/fa";
import "../styles/admin.css"; // Reusing our admin styles

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/admin/users", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete ${userName}? This cannot be undone.`)) {
      return;
    }

    try {
      await axios.delete(`/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Remove the user from the UI without reloading the page
      setUsers(users.filter(user => user._id !== userId));
      alert("User deleted successfully.");
    } catch (err) {
      console.error("Failed to delete user", err);
      alert(err.response?.data?.message || "Failed to delete user");
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-content">
        
        <div className="admin-header">
          <div>
            <button className="back-btn" onClick={() => navigate("/admin/dashboard")}>
              <FaArrowLeft /> Back to Dashboard
            </button>
            <h1 className="admin-title" style={{marginTop: "16px"}}>Manage Users</h1>
            <p className="admin-subtitle">View and manage all registered MockMate accounts.</p>
          </div>
        </div>

        <div className="admin-table-card">
          {loading ? (
            <p className="loading-text">Loading users...</p>
          ) : (
            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Joined Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td className="problem-name">{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`role-pill ${user.role === 'admin' ? 'admin' : 'student'}`}>
                          {user.role === 'admin' ? <FaUserShield /> : <FaUserGraduate />}
                          {user.role}
                        </span>
                      </td>
                      <td className="date-text">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        <button 
                          className="delete-btn"
                          onClick={() => handleDeleteUser(user._id, user.name)}
                          disabled={user.role === 'admin'} // Disable delete for admins
                        >
                          <FaTrash /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default AdminUsers;