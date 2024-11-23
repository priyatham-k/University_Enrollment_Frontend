import React, { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";
import { Link, useLocation } from "react-router-dom";
import { Modal, Box, Typography, Button } from "@mui/material";

const StudentEnrolledClasses = () => {
  const [payments, setPayments] = useState([]);
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const isEnrolledClasses = location.pathname.includes("StudentEnrolledClasses");
  const isDashboard = location.pathname.includes("StudentDashboard");

  // Fetch user and enrolled classes
  useEffect(() => {
    const fetchData = async () => {
      const userData = sessionStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        setUsername(user.username.split("@")[0]); // Show username before "@"
        setRole(user.role);

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
          // Remove dropped course from the state
          setPayments((prevPayments) =>
            prevPayments.filter((payment) => payment._id !== selectedPaymentId)
          );

          // Update session storage
          user.payment = user.payment.filter(
            (payment) => payment._id !== selectedPaymentId
          );
          sessionStorage.setItem("user", JSON.stringify(user));

          alert("Course dropped successfully!");
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
                          {username}
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
                            <th>Section Name</th>
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
    </div>
  );
};

export default StudentEnrolledClasses;
