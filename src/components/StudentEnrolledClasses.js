import React, { useEffect, useState } from "react";
import "../App.css";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";

const StudentEnrolledClasses = () => {
  const [payments, setPayments] = useState([]);
  const location = useLocation();

  const isEnrolledClasses = location.pathname.includes("StudentEnrolledClasses");
  const isDashboard = location.pathname.includes("StudentDashboard");

  useEffect(() => {
    const userData = sessionStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      if (user.payment && Array.isArray(user.payment)) {
        setPayments(user.payment);
      }
    }
  }, []);

  const handleDropCourse = async (paymentId) => {
    const userData = sessionStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      const userId = user._id;

      try {
        const response = await axios.post(
          `http://localhost:3001/api/user/dropCourse/${userId}`,
          {
            courseId: paymentId,
          }
        );

        if (response.status === 200) {
          setPayments((prevPayments) =>
            prevPayments.filter((payment) => payment._id !== paymentId)
          );

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
          <ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">
            <a className="sidebar-brand d-flex align-items-center justify-content-center">
              <div className="sidebar-brand-icon rotate-n-15">
                <i className="fas fa-university"></i>
              </div>
              <div className="sidebar-brand-text mx-3" style={{ fontSize: "12px" }}>UNIVERSITY OF TEXAS</div>
            </a>
            <hr className="sidebar-divider my-0" />
            <hr className="sidebar-divider" />

            <div className="sidebar-heading" style={{ fontSize: "12px" }}>Menu</div>

            <li className={`nav-item ${isDashboard ? "active" : ""}`}>
              <Link className="nav-link collapsed" to="/StudentDashboard">
                <i className="fas fa-book" style={{ marginRight: "12px", fontSize: "12px" }}></i>
                <span style={{ fontSize: "12px", fontWeight: "600" }}>All Courses</span>
              </Link>
            </li>

            <li className={`nav-item ${isEnrolledClasses ? "active" : ""}`}>
              <a className="nav-link collapsed">
                <i className="fas fa-fw fa-wrench" style={{ marginRight: "12px", fontSize: "12px" }}></i>
                <span style={{ fontSize: "12px", fontWeight: "600" }}>Enrolled Classes</span>
              </a>
            </li>

            <li className="nav-item">
              <a className="nav-link collapsed" style={{ cursor: "pointer" }}>
                <i className="fas fa-fw fa-wrench" style={{ marginRight: "12px", fontSize: "12px" }}></i>
                <Link className="small" to="/">
                  <span style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "12px", fontWeight: "600" }}>Logout</span>
                </Link>
              </a>
            </li>
            <hr className="sidebar-divider" />
          </ul>

          <div id="content-wrapper" className="d-flex flex-column">
            <div id="content">
              <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
                <button id="sidebarToggleTop" className="btn btn-link d-md-none rounded-circle mr-3">
                  <i className="fa fa-bars"></i>
                </button>

                <ul className="navbar-nav ml-auto">
                  <div className="topbar-divider d-none d-sm-block"></div>
                </ul>
              </nav>

              <div className="container-fluid">
                <div className="card shadow mb-4">
                  <div className="card-header py-3">
                    <h6 className="m-0 font-weight-bold text-primary" style={{ fontSize: "12px" }}>Enrolled Classes</h6>
                  </div>
                  <div className="card-body" style={{ fontSize: "12px" }}>
                    {payments.length > 0 ? (
                      <div className="table-responsive">
                        <table className="table table-bordered" width="100%" cellSpacing="0" style={{ fontSize: "12px" }}>
                          <thead>
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
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{payment.courseName}</td>
                                <td>{payment.sectionName}</td>
                                <td>${payment.amount}</td>
                                <td>
                                  <button
                                    className="btn btn-danger"
                                    onClick={() => handleDropCourse(payment._id)}
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
                      <p>No classes enrolled.</p>
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
