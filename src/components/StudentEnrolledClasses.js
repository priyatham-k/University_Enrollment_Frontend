import React, { useEffect, useState } from "react";
import "../App.css";
import axios from "axios";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

const StudentEnrolledClasses = () => {
  const [payments, setPayments] = useState([]);
  const location = useLocation();

  // Check if the current path matches a specific route
  const isEnrolledClasses = location.pathname.includes(
    "StudentEnrolledClasses"
  );
  const isDashboard = location.pathname.includes("StudentDashboard");

  useEffect(() => {
    // Retrieve user data from sessionStorage
    const userData = sessionStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      console.log(user);
      // Check if payment array exists and set it to state
      if (user.payment && Array.isArray(user.payment)) {
        setPayments(user.payment);
      }
    }
  }, []);

  const handleDropCourse = async (paymentId) => {
    const userData = sessionStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      const userId = user._id; // Get the user ID from sessionStorage

      try {
        // Send DELETE request to drop the course
        const response = await axios.post(
          `http://localhost:3001/api/user/dropCourse/${userId}`,
          {
            courseId: paymentId, // Send the payment._id as courseId in the body
          }
        );

        if (response.status === 200) {
          // Remove the dropped payment from the state
          setPayments((prevPayments) =>
            prevPayments.filter((payment) => payment._id !== paymentId)
          );

          // Update user data in sessionStorage as well
          user.payment = user.payment.filter(
            (payment) => payment._id !== paymentId
          );
          sessionStorage.setItem("user", JSON.stringify(user));

          alert("Course dropped successfully.");
        }
      } catch (error) {
        console.error("Error dropping the course:", error);
        alert("Failed to drop the course.");
      }
    }
  };

  return (
    <div>
      <div id="page-top">
        <div id="wrapper">
          <ul
            className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion"
            id="accordionSidebar"
          >
            {/* Sidebar Brand */}
            <a className="sidebar-brand d-flex align-items-center justify-content-center">
              <div className="sidebar-brand-icon rotate-n-15">
                <i className="fas fa-university"></i>
              </div>
              <div className="sidebar-brand-text mx-3" style={{ fontSize: "12px" }}>UNIVERSITY OF TEXAS</div>
            </a>

            <hr className="sidebar-divider my-0" />

            <hr className="sidebar-divider" />

            <div className="sidebar-heading" style={{ fontSize: "12px" }}>Interface</div>

            {/* All Courses link */}
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

            {/* Enrolled Classes link */}
            <li className={`nav-item ${isEnrolledClasses ? "active" : ""}`}>
              <a className="nav-link collapsed">
                <i
                  className="fas fa-fw fa-wrench"
                  style={{ marginRight: "12px", fontSize: "12px" }}
                ></i>
                <span style={{ fontSize: "12px", fontWeight: "600" }}>
                  Enrolled Classes
                </span>
              </a>
              <div id="collapseUtilities" className="collapse"></div>
            </li>
            <li className="nav-item">
              <a className="nav-link collapsed" style={{ cursor: "pointer" }}>
                <i
                  className="fas fa-fw fa-wrench"
                  style={{ marginRight: "12px", fontSize: "12px" }}
                ></i>
                <Link className="small" to="/">
                  <span
                    style={{
                      color: "rgba(255, 255, 255, 0.8)",
                      fontSize: "12px",
                      fontWeight: "600",
                    }}
                  >
                    Logout
                  </span>
                </Link>
              </a>
            </li>
            <hr className="sidebar-divider" />
          </ul>

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
                    <a>
                      <span className="mr-2 d-none d-lg-inline text-gray-600 small" style={{ fontSize: "12px" }}>
                      </span>
                    </a>
                    <div
                      className="dropdown-menu dropdown-menu-right shadow animated--grow-in"
                      aria-labelledby="userDropdown"
                    >
                      <a className="dropdown-item" style={{ fontSize: "12px" }}>
                        <i className="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
                        Profile
                      </a>
                      <a className="dropdown-item" style={{ fontSize: "12px" }}>
                        <i className="fas fa-cogs fa-sm fa-fw mr-2 text-gray-400"></i>
                        Settings
                      </a>
                      <a className="dropdown-item" style={{ fontSize: "12px" }}>
                        <i className="fas fa-list fa-sm fa-fw mr-2 text-gray-400"></i>
                        Activity Log
                      </a>
                      <div className="dropdown-divider"></div>
                      <a
                        className="dropdown-item"
                        data-toggle="modal"
                        data-target="#logoutModal"
                        style={{ fontSize: "12px" }}
                      >
                        <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                        Logout
                      </a>
                    </div>
                  </li>
                </ul>
              </nav>

              <div className="container-fluid">
                {/* Card to display payments */}
                <div className="card shadow mb-4">
                  <div className="card-header py-3">
                    <h6 className="m-0 font-weight-bold text-primary" style={{ fontSize: "12px" }}>
                      Enrolled Classes
                    </h6>
                  </div>
                  <div className="card-body" style={{ fontSize: "12px" }}>
                    {payments.length > 0 ? (
                      <div className="table-responsive">
                        <table
                          className="table table-bordered"
                          width="100%"
                          cellSpacing="0"
                          style={{ fontSize: "12px" }}
                        >
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>Course Name</th>
                              <th>Class Cost</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {payments.map((payment, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{payment.courceName}</td>
                                <td>$1000</td>
                                <td>
                                  <button
                                    className="btn btn-danger"
                                    onClick={() =>
                                      handleDropCourse(payment._id)
                                    }
                                    style={{ fontSize: "12px" }}
                                  >
                                    Drop Course
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p>No classes Enrolled.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentEnrolledClasses;
