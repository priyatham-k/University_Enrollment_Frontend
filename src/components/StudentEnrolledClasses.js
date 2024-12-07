import React, { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";
import { Link, useLocation } from "react-router-dom";
import { Modal,TextField, Box, Typography, Button } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const StudentEnrolledClasses = () => {
  const [payments, setPayments] = useState([]);
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const isEnrolledClasses = location.pathname.includes("StudentEnrolledClasses");
  const isDashboard = location.pathname.includes("StudentDashboard");

  // Fetch user and enrolled classes
  useEffect(() => {
    const fetchData = async () => {
      const userData = sessionStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        setUsername(user.firstName); // Show username before "@"
        setRole("Student");

        try {
          // Fetch payments/enrolled classes from backend
          const response = await axios.get(
            `http://localhost:3001/api/student/enrolledClasses/${user._id}`
          );
          setPayments(response.data); // Assumes backend returns a list of payments
        } catch (error) {
          console.error("Error fetching enrolled classes:", error);
        }
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleOpenModal = (paymentId) => {
    setSelectedPaymentId(paymentId);
    setOpenModal(true);
  };
  const buttonStyle = {
    fontSize: "10px",
    padding: "4px 8px",
    marginLeft: "4px",
    borderRadius: "4px",
    cursor: "pointer",
  };
  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedPaymentId(null);
  };
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
  const handleDropCourse = async () => {
    const userData = sessionStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      const userId = user._id;

      try {
        // Call backend to drop the course
        const response = await axios.post(
          `http://localhost:3001/api/student/dropCourse/${userId}`,
          { courseId: selectedPaymentId }
        );

        if (response.status === 200 || response.message == "Course dropped successfully") {
          toast.success("Course dropped successfully!");
          // Remove dropped course from the state
          setPayments((prevPayments) =>
            prevPayments.filter((payment) => payment._id !== selectedPaymentId)
          );

          // Update session storage
          user.payment = user.payment.filter(
            (payment) => payment._id !== selectedPaymentId
          );
          sessionStorage.setItem("user", JSON.stringify(user));
          
        }
      } catch (error) {
        console.error("Error dropping the course:", error);
      } finally {
        handleCloseModal();
      }
    }
  };

  if (loading) {
    return <div>Loading enrolled classes...</div>;
  }

  return (
    <div>
      <div id="page-top">
        <div id="wrapper">
          {/* Sidebar */}
          <ul
            className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion"
            id="accordionSidebar"
            style={{ backgroundColor: "#0D3B66", fontSize: "12px" }}
          >
            <a className="sidebar-brand d-flex align-items-center justify-content-center">
              <div className="sidebar-brand-icon">
                <i className="fas fa-graduation-cap"></i>
              </div>
              <div className="sidebar-brand-text mx-3">UNIVERSITY PORTAL</div>
            </a>
            <hr className="sidebar-divider my-0" />
            <div className="sidebar-heading" style={{ fontSize: "12px" }}>
              MENU
            </div>
            <li className={`nav-item ${isDashboard ? "active" : ""}`}>
              <Link className="nav-link collapsed" to="/StudentDashboard">
                <i className="fas fa-book" style={{ marginRight: "12px" }}></i>
                <span style={{ fontSize: "12px", fontWeight: "600" }}>
                  All Courses
                </span>
              </Link>
            </li>
            <li className={`nav-item ${isEnrolledClasses ? "active" : ""}`}>
              <a className="nav-link">
                <i
                  className="fas fa-chalkboard-teacher"
                  style={{ marginRight: "12px" }}
                ></i>
                <span style={{ fontSize: "12px", fontWeight: "600" }}>
                  Enrolled Classes
                </span>
              </a>
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
              <Link className="nav-link collapsed" to="/">
                <i className="fas fa-sign-out-alt" style={{ marginRight: "12px" }}></i>
                <span style={{ fontSize: "12px", fontWeight: "600" }}>Logout</span>
              </Link>
            </li>
            <hr className="sidebar-divider" />
          </ul>

          {/* Content */}
          <div id="content-wrapper" className="d-flex flex-column">
            <div id="content">
              <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
                <ul className="navbar-nav ml-auto">
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
                      <div>
                        <span
                          style={{
                            fontSize: "12px",
                            fontWeight: "bold",
                            color: "#333",
                          }}
                        >
                          {username} <br/> Role: Student
                        </span>
                  
                      </div>
                    </a>
                  </li>
                </ul>
              </nav>
              <div className="container-fluid">
                <div className="card shadow mb-4">
                  <div className="card-header py-3">
                    <h6 className="m-0 font-weight-bold text-primary">
                      Enrolled Classes
                    </h6>
                  </div>
                  <div className="card-body">
                    {payments.length > 0 ? (
                      <table className="table table-bordered">
                        <thead className="thead-light">
                          <tr>
                            <th>#</th>
                            <th>Course Name</th>
                            <th>Sections (Day & Time)</th>
                            <th>Instructor</th>
                            <th>Amount</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {payments.map((payment, index) => (
                            <tr key={payment._id}>
                              <td>{index + 1}</td>
                              <td>{payment.courseName}</td>
                              <td>{payment.sectionName}</td>
                              <td>{payment.instructorName}</td>
                              <td>${payment.amount}</td>
                              <td>
                                <button
                                  className="btn btn-sm btn-danger" style={buttonStyle}
                                  onClick={() => handleOpenModal(payment._id)}
                                >
                                  Drop
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p>No classes enrolled.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Drop Confirmation */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 300,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 3,
            textAlign: "center",
          }}
        >
          <Typography sx={{ fontSize: "14px", mb: 2 }}>
            Are you sure you want to drop this course? Refund will be processed.
          </Typography>
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={handleDropCourse}
            sx={{ fontSize: "12px", mr: 1 }}
          >
            Confirm
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={handleCloseModal}
            sx={{ fontSize: "12px" }}
          >
            Cancel
          </Button>
        </Box>
      </Modal>
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
};

export default StudentEnrolledClasses;
