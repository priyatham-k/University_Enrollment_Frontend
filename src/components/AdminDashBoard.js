import React, { useState, useEffect } from "react";
import axios from "axios";
import "../App.css";
import StudentList from "./StudentList";
import Courses from "./Courses";
import Instructors from "./Instructors";
import Enrollments from "./Enrollments"; // Placeholder for Enrollments component
import Payments from "./Payments"; // Placeholder for Payments component
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("StudentList");
  const [courses, setCourses] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (user) {
      setFirstName(user.firstName); // Set the first name
      setLastName(user.lastName);   // Set the last name
      setRole("Admin");
    }
  }, []);

  useEffect(() => {
    if (activeSection === "courses") {
      fetchCourses();
    }
  }, [activeSection]);

  const fetchCourses = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/courses/all");
      setCourses(response.data);
    } catch (error) {
      setErrorMessage("Failed to fetch courses. Please try again later.");
    }
  };

  const handleSectionSwitch = (section) => {
    setActiveSection(section);
  };

  return (
    <div style={{ fontSize: "12px" }}>
      <div id="page-top">
        <div id="wrapper">
          {/* Sidebar */}
          <ul
            className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion"
            style={{
              backgroundColor: "#0D3B66", // University blue
            }}
          >
            <a
              className="sidebar-brand d-flex align-items-center justify-content-center"
              style={{
                color: "#fff",
                padding: "15px 0",
                fontSize: "12px",
              }}
            >
              <div className="sidebar-brand-icon">
                <i className="fas fa-graduation-cap"></i>
              </div>
              <div className="sidebar-brand-text mx-3">UNIVERSITY PORTAL</div>
            </a>
            <hr className="sidebar-divider my-0" />
            <div className="sidebar-heading" style={{ fontSize: "12px" }}>
              MENU
            </div>
            <li
              className={`nav-item ${
                activeSection === "StudentList" ? "active" : ""
              }`}
            >
              <a
                className="nav-link"
                onClick={() => handleSectionSwitch("StudentList")}
                style={{ cursor: "pointer", fontSize: "12px" }}
              >
                <i className="fas fa-users" style={{ marginRight: "12px" }}></i>
                <span style={{ fontWeight: "600" }}>Students</span>
              </a>
            </li>
            <li
              className={`nav-item ${
                activeSection === "courses" ? "active" : ""
              }`}
            >
              <a
                className="nav-link"
                onClick={() => handleSectionSwitch("courses")}
                style={{ cursor: "pointer", fontSize: "12px" }}
              >
                <i
                  className="fas fa-book"
                  style={{ marginRight: "12px" }}
                ></i>
                <span style={{ fontWeight: "600" }}>Courses</span>
              </a>
            </li>
            <li
              className={`nav-item ${
                activeSection === "Instructors" ? "active" : ""
              }`}
            >
              <a
                className="nav-link"
                onClick={() => handleSectionSwitch("Instructors")}
                style={{ cursor: "pointer", fontSize: "12px" }}
              >
                <i
                  className="fas fa-chalkboard-teacher"
                  style={{ marginRight: "12px" }}
                ></i>
                <span style={{ fontWeight: "600" }}>Instructors</span>
              </a>
            </li>
            <li
              className={`nav-item ${
                activeSection === "Enrollments" ? "active" : ""
              }`}
            >
              <a
                className="nav-link"
                onClick={() => handleSectionSwitch("Enrollments")}
                style={{ cursor: "pointer", fontSize: "12px" }}
              >
                <i
                  className="fas fa-list-alt"
                  style={{ marginRight: "12px" }}
                ></i>
                <span style={{ fontWeight: "600" }}>Enrollments</span>
              </a>
            </li>
            <li
              className={`nav-item ${
                activeSection === "Payments" ? "active" : ""
              }`}
            >
              <a
                className="nav-link"
                onClick={() => handleSectionSwitch("Payments")}
                style={{ cursor: "pointer", fontSize: "12px" }}
              >
                <i
                  className="fas fa-money-check-alt"
                  style={{ marginRight: "12px" }}
                ></i>
                <span style={{ fontWeight: "600" }}>Payments</span>
              </a>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link"
                to="/"
                style={{
                  display: "flex",
                  alignItems: "center",
                  fontSize: "12px",
                }}
              >
                <i
                  className="fas fa-sign-out-alt"
                  style={{ marginRight: "12px" }}
                ></i>
                <span style={{ fontWeight: "600" }}>Logout</span>
              </Link>
            </li>
            <hr className="sidebar-divider" />
          </ul>

          {/* Content Wrapper */}
          <div id="content-wrapper" className="d-flex flex-column">
            <div id="content">
              {/* Topbar */}
              <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
                <button
                  id="sidebarToggleTop"
                  className="btn btn-link d-md-none rounded-circle mr-3"
                  style={{ fontSize: "12px" }}
                >
                  <i className="fa fa-bars"></i>
                </button>
                <ul className="navbar-nav ml-auto">
                  <div className="topbar-divider d-none d-sm-block"></div>
                  <li className="nav-item dropdown no-arrow">
                    <a className="nav-link" style={{ fontSize: "12px" }}>
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
                        <i className="fas fa-user-shield"></i>
                      </div>
                      <div>
                        <span
                          style={{
                            fontSize: "12px",
                            fontWeight: "bold",
                            color: "#333",
                          }}
                        >
                          {firstName} {lastName}<br/> Role: {role}
                        </span>
                        
                      </div>
                    </a>
                  </li>
                </ul>
              </nav>

              {/* Main Content */}
              <div className="container-fluid" style={{ fontSize: "12px" }}>
                {successMessage && (
                  <div
                    className="alert alert-success"
                    style={{ fontSize: "12px" }}
                  >
                    {successMessage}
                  </div>
                )}
                {errorMessage && (
                  <div
                    className="alert alert-danger"
                    style={{ fontSize: "12px" }}
                  >
                    {errorMessage}
                  </div>
                )}
                {activeSection === "courses" && <Courses courses={courses} />}
                {activeSection === "StudentList" && <StudentList />}
                {activeSection === "Instructors" && <Instructors />}
                {activeSection === "Enrollments" && <Enrollments />}
                {activeSection === "Payments" && <Payments />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
