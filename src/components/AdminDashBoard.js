import React, { useState, useEffect } from "react";
import axios from "axios";
import "../App.css";
import StudentList from "./StudentList";
import Courses from "./Courses";
import Instructors from "./Instructors";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("StudentList");
  const [showModal, setShowModal] = useState(false);
  const [courseDetails, setCourseDetails] = useState({
    courseName: "",
    courseCode: "",
    classDay: "",
  });
  const [instructorDetails, setInstructorDetails] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [courses, setCourses] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (user) {
      setUsername(user.username);
      setRole(user.role);
    }
  }, []);

  useEffect(() => {
    if (activeSection === "courses") {
      fetchCourses();
    }
  }, [activeSection]);

  const fetchCourses = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/api/courses/allCourses"
      );
      setCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error.message);
      setErrorMessage("Failed to fetch courses. Please try again later.");
    }
  };

  const handleSectionSwitch = (section) => {
    setActiveSection(section);
  };

  const handleCourseChange = (e) => {
    setCourseDetails({ ...courseDetails, [e.target.name]: e.target.value });
  };

  const handleInstructorChange = (e) => {
    setInstructorDetails({
      ...instructorDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const instructorResponse = await axios.post(
        "http://localhost:3001/api/instructors/add",
        instructorDetails
      );
      if (instructorResponse.status !== 201) {
        throw new Error("Failed to add instructor");
      }

      const updatedCourseDetails = {
        ...courseDetails,
        instructor: instructorDetails,
      };

      const courseResponse = await axios.post(
        "http://localhost:3001/api/courses/add",
        updatedCourseDetails
      );
      if (courseResponse.status !== 201) {
        throw new Error("Failed to add course");
      }

      setCourseDetails({ courseName: "", courseCode: "", classDay: "" });
      setInstructorDetails({ name: "", email: "", password: "" });
      setShowModal(false);

      setSuccessMessage("Course and instructor added successfully!");
      fetchCourses();
    } catch (error) {
      console.error("Error:", error.message);
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontSize: "12px" }}>
      <div id="page-top">
        <div id="wrapper">
          <ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion">
            <a className="sidebar-brand d-flex align-items-center justify-content-center">
              <div className="sidebar-brand-icon rotate-n-15">
                <i className="fas fa-university"></i>
              </div>
              <div className="sidebar-brand-text mx-3">UNIVERSITY OF TEXAS</div>
            </a>
            <hr className="sidebar-divider my-0" />
            <hr className="sidebar-divider" />
            <div className="sidebar-heading">MENU</div>
            <li
              className={`nav-item ${
                activeSection === "StudentList" ? "active" : ""
              }`}
            >
              <a
                className="nav-link collapsed"
                onClick={() => handleSectionSwitch("StudentList")}
                style={{ cursor: "pointer" }}
              >
                <i
                  className="fas fa-fw fa-cog"
                  style={{ marginRight: "12px" }}
                ></i>
                <span style={{ fontWeight: "600" }}>Students</span>
              </a>
            </li>
            <li
              className={`nav-item ${
                activeSection === "courses" ? "active" : ""
              }`}
            >
              <a
                className="nav-link collapsed"
                onClick={() => handleSectionSwitch("courses")}
                style={{ cursor: "pointer" }}
              >
                <i
                  className="fas fa-fw fa-wrench"
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
                className="nav-link collapsed"
                onClick={() => handleSectionSwitch("Instructors")}
                style={{ cursor: "pointer" }}
              >
                <i
                  className="fas fa-fw fa-wrench"
                  style={{ marginRight: "12px" }}
                ></i>
                <span style={{ fontWeight: "600" }}>Instructors</span>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link collapsed" style={{ cursor: "pointer" }}>
                <i
                  className="fas fa-fw fa-wrench"
                  style={{ marginRight: "12px" }}
                ></i>
                <Link className="small" to="/">
                  <span
                    style={{
                      color: "rgba(255, 255, 255, 0.8)",
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
                      <span className="mr-2 d-none d-lg-inline text-gray-600 small">
                        {username}
                      </span>
                      <br />
                      <span className="d-none d-lg-inline text-gray-600 small">
                        {role}
                      </span>
                    </a>
                  </li>
                </ul>
              </nav>

              <div className="container-fluid">
                {successMessage && (
                  <div className="alert alert-success">{successMessage}</div>
                )}
                {errorMessage && (
                  <div className="alert alert-danger">{errorMessage}</div>
                )}
                {activeSection === "courses" && <Courses courses={courses} />}
                {activeSection === "StudentList" && <StudentList />}
                {activeSection === "Instructors" && <Instructors />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
