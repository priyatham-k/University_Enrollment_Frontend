import React, { useState, useEffect } from "react";
import "../App.css";
import StudentCourse from "./StudentCourse";
import { Link, useLocation } from "react-router-dom";
import { Modal, TextField, Button, Typography, Box } from "@mui/material";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function Dashboard() {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const location = useLocation();
  const isDashboard = location.pathname.includes("StudentDashboard");

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (user) {
      setUsername(user.firstName);
      setRole("Student");
    }
  }, []);

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match.");
      return;
    }
  
    try {
      const user = JSON.parse(sessionStorage.getItem("user"));
  
      if (!user || !user.email) {
        toast.error("User session has expired. Please log in again.");
        return;
      }
  
      const response = await axios.post("http://localhost:3001/api/student/change-password", {
        email: user.email,
        currentPassword,
        newPassword,
      });
  
      // Success toast
      toast.success(response.data.message || "Password updated successfully!");
  
      // Clear fields after successful password change
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowChangePasswordModal(false);
    } catch (err) {
      // Error handling with toasts
      if (err.response && err.response.status === 401) {
        toast.error("Incorrect current password.");
      } else if (err.response && err.response.status === 404) {
        toast.error("User not found. Please contact support.");
      } else if (err.response && err.response.status === 400) {
        toast.error(err.response.data.message || "Invalid input. Please try again.");
      } else {
        toast.error("An unexpected error occurred. Please try again later.");
      }
    }
  };

  return (
    <div>
      <div id="page-top">
        <div id="wrapper">
          {/* Sidebar */}
          <ul
            className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion"
            id="accordionSidebar"
            style={{
              backgroundColor: "#0D3B66",
              fontSize: "12px",
            }}
          >
            <a
              className="sidebar-brand d-flex align-items-center justify-content-center"
              style={{
                fontSize: "12px",
                color: "#fff",
                padding: "15px 0",
              }}
            >
              <div className="sidebar-brand-icon">
                <i className="fas fa-graduation-cap"></i>
              </div>
              <div className="sidebar-brand-text mx-3">UNIVERSITY PORTAL</div>
            </a>
            <hr className="sidebar-divider my-0" />
            <hr className="sidebar-divider" />
            <div className="sidebar-heading" style={{ fontSize: "12px" }}>
              MENU
            </div>
            <li className={`nav-item ${isDashboard ? "active" : ""}`}>
              <Link className="nav-link collapsed" to="/StudentDashboard">
                <i
                  className="fas fa-book"
                  style={{ marginRight: "12px", fontSize: "12px" }}
                ></i>
                <span style={{ fontSize: "12px", fontWeight: "600" }}>
                  All Courses
                </span>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link collapsed" to="/StudentEnrolledClasses">
                <i
                  className="fas fa-chalkboard-teacher"
                  style={{ marginRight: "12px", fontSize: "12px" }}
                ></i>
                <span style={{ fontSize: "12px", fontWeight: "600" }}>
                  Enrolled Classes
                </span>
              </Link>
            </li>
            <li className="nav-item">
              <a
                className="nav-link collapsed"
                onClick={() => {
                  setCurrentPassword(""); // Clear current password field
                  setNewPassword("");     // Clear new password field
                  setConfirmPassword(""); // Clear confirm password field
                  setShowChangePasswordModal(true); // Open the modal
                }}
                style={{ cursor: "pointer" }}
              >
                <i
                  className="fas fa-key"
                  style={{ marginRight: "12px", fontSize: "12px" }}
                ></i>
                <span style={{ fontSize: "12px", fontWeight: "600" }}>
                  Change Password
                </span>
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link collapsed"
                style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
              >
                <i
                  className="fas fa-sign-out-alt"
                  style={{ marginRight: "12px", fontSize: "12px" }}
                ></i>
                <Link
                  className="small"
                  to="/"
                  style={{
                    color: "rgba(255, 255, 255, 0.8)",
                    fontSize: "12px",
                    fontWeight: "600",
                  }}
                >
                  Logout
                </Link>
              </a>
            </li>
            <hr className="sidebar-divider" />
          </ul>

          {/* Content Wrapper */}
          <div id="content-wrapper" className="d-flex flex-column">
            <div id="content">
              <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
                <button
                  id="sidebarToggleTop"
                  className="btn btn-link d-md-none rounded-circle mr-3"
                >
                  <i className="fa fa-bars"></i>
                </button>
                <ul className="navbar-nav ml-auto">
                  <div className="topbar-divider d-none d-sm-block"></div>
                  <li className="nav-item dropdown no-arrow">
                    <a className="nav-link">
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          background: "#FF6F61",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginRight: "10px",
                          color: "#fff",
                        }}
                      >
                        <i className="fas fa-user"></i>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-start",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "12px",
                            fontWeight: "bold",
                            color: "#333",
                          }}
                        >
                          {username} <br /> Role: Student
                        </span>
                      </div>
                    </a>
                  </li>
                </ul>
              </nav>

              {/* Main Content */}
              <div className="container-fluid" style={{ fontSize: "12px" }}>
                <StudentCourse />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      <Modal open={showChangePasswordModal} onClose={() => setShowChangePasswordModal(false)}>
        <Box
          style={{
            background: "#fff",
            padding: "20px",
            margin: "100px auto",
            width: "400px",
            borderRadius: "8px",
            boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
          }}
        >
          <Typography style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "16px" }}>
            Change Password
          </Typography>
          <TextField
            label="Current Password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            fullWidth
            margin="dense"
            size="small"
          />
          <TextField
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            fullWidth
            margin="dense"
            size="small"
          />
          <TextField
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            fullWidth
            margin="dense"
            size="small"
          />
          <Box display="flex" justifyContent="flex-end" mt={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleChangePassword}
              style={{ fontSize: "12px" }}
            >
              Save
            </Button>
            <Button
              variant="outlined"
              onClick={() => setShowChangePasswordModal(false)}
              style={{ fontSize: "12px", marginLeft: "8px" }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}

export default Dashboard;
