import React, { useState, useEffect } from "react";
import axios from "axios";
import "../App.css";
import ApplicationList from "./ApplicationList";
import Courses from "./Courses";
import Instructors from "./Instructors";
import { Link } from "react-router-dom";
function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("ApplicationList");
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
  const [courses, setCourses] = useState([]); // State to store fetched courses
  const [errorMessage, setErrorMessage] = useState(""); // State for error message
  const [successMessage, setSuccessMessage] = useState(""); // State for success message
  const [loading, setLoading] = useState(false); // State for loading state

  // Fetch the courses when the component loads or the active section is 'courses'
  useEffect(() => {
    if (activeSection === "courses") {
      fetchCourses();
    }
  }, [activeSection]);

  // Function to fetch courses from the API
  const fetchCourses = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/api/courses/allCourses"
      );
      setCourses(response.data); // Store the fetched data in state
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
      // First, create the instructor
      const instructorResponse = await axios.post(
        "http://localhost:3001/api/instructors/add",
        instructorDetails
      );
      if (instructorResponse.status !== 201) {
        throw new Error("Failed to add instructor");
      }

      // Add instructor ID to the course details
      const updatedCourseDetails = {
        ...courseDetails,
        instructor: instructorDetails,
      };

      // Then, create the course
      const courseResponse = await axios.post(
        "http://localhost:3001/api/courses/add",
        updatedCourseDetails
      );
      if (courseResponse.status !== 201) {
        throw new Error("Failed to add course");
      }

      // Reset forms and close modal
      setCourseDetails({ courseName: "", courseCode: "", classDay: "" });
      setInstructorDetails({ name: "", email: "", password: "" });
      setShowModal(false);

      // Show success message
      setSuccessMessage("Course and instructor added successfully!");

      // Fetch the updated list of courses after adding a new one
      fetchCourses();
    } catch (error) {
      console.error("Error:", error.message);
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
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
            <div className="sidebar-heading">Interface</div>
            <li
              className={`nav-item ${
                activeSection === "ApplicationList" ? "active" : ""
              }`}
            >
              <a
                className="nav-link collapsed"
                onClick={() => handleSectionSwitch("ApplicationList")}
                style={{ cursor: "pointer" }}
              >
                <i
                  className="fas fa-fw fa-cog"
                  style={{ marginRight: "12px", fontSize: "15px" }}
                ></i>
                <span style={{ fontSize: "14px", fontWeight: "600" }}>
                  Applications
                </span>
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
                  style={{ marginRight: "12px", fontSize: "15px" }}
                ></i>
                <span style={{ fontSize: "14px", fontWeight: "600" }}>
                  Courses
                </span>
              </a>
            </li>{" "}
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
                  style={{ marginRight: "12px", fontSize: "15px" }}
                ></i>
                <span style={{ fontSize: "14px", fontWeight: "600" }}>
                  Instructors
                </span>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link collapsed" style={{ cursor: "pointer" }}>
                <i
                  className="fas fa-fw fa-wrench"
                  style={{ marginRight: "12px", fontSize: "15px" }}
                ></i>
                <Link className="small" to="/">
                  <span
                    style={{
                      color: "rgba(255, 255, 255, 0.8)",
                      fontSize: "14px",
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
                        Douglas McGee
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
                {activeSection === "ApplicationList" && <ApplicationList />}
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
