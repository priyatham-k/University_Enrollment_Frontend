import React, { useState, useEffect } from "react";
import "../App.css";
import axios from "axios";
import StudentCourse from "./StudentCourse";
import { Link, useLocation } from "react-router-dom";

function Dashboard() {
  const [formData, setFormData] = useState({
    studentName: "",
    degreeProgram: "",
    major: "",
    contactEmail: "",
    contactPhone: "",
    season: "",
    englishTest: "",
  });
  const [errors, setErrors] = useState({});
  const [applicationStatus, setApplicationStatus] = useState(null);
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const location = useLocation();
  const isDashboard = location.pathname.includes("StudentDashboard");

  const validateForm = () => {
    let formErrors = {};
    if (!formData.studentName) formErrors.studentName = "Full name is required";
    if (!formData.degreeProgram) formErrors.degreeProgram = "Degree program is required";
    if (!formData.major) formErrors.major = "Major is required";
    if (!formData.contactEmail) formErrors.contactEmail = "Email is required";
    if (!formData.contactPhone) formErrors.contactPhone = "Phone is required";
    if (!formData.season) formErrors.season = "Please select a season";
    if (!formData.englishTest) formErrors.englishTest = "Please select an English test";
    return formErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formErrors = validateForm();
    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      const user = JSON.parse(sessionStorage.getItem("user"));

      if (user && user._id) {
        const updatedFormData = {
          ...formData,
          studentId: user._id,
        };

        try {
          const response = await axios.post(
            "http://localhost:3001/api/submitapplication/submit",
            updatedFormData
          );

          if (response.status === 201) {
            alert("Application submitted successfully");
          } else {
            alert("Failed to submit the application");
          }
        } catch (error) {
          console.error("Error submitting form", error);
          alert("Error occurred while submitting");
        }
      } else {
        alert("User not logged in");
      }
    }
  };

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (user && user._id) {
      setUsername(user.username);
      setRole(user.role);

      axios
        .get(`http://localhost:3001/api/applicationstatus/${user._id}`)
        .then((response) => {
          setApplicationStatus(response.data.applicationStatus);
        })
        .catch((error) => {
          console.error("Error fetching application status", error);
        });
    }
  }, []);

  return (
    <div>
      <div id="page-top">
        <div id="wrapper">
          <ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">
            <a className="sidebar-brand d-flex align-items-center justify-content-center" style={{ fontSize: "12px" }}>
              <div className="sidebar-brand-icon rotate-n-15">
                <i className="fas fa-university"></i>
              </div>
              <div className="sidebar-brand-text mx-3">UNIVERSITY OF TEXAS</div>
            </a>
            <hr className="sidebar-divider my-0"></hr>
            <hr className="sidebar-divider"></hr>
            <div className="sidebar-heading" style={{ fontSize: "12px" }}>MENU</div>
            <li className={`nav-item ${isDashboard ? "active" : ""}`}>
              <Link className="nav-link collapsed" to="/StudentDashboard">
                <i className="fas fa-book" style={{ marginRight: "12px", fontSize: "12px" }}></i>
                <span style={{ fontSize: "12px", fontWeight: "600" }}>All Courses</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link collapsed" to="/StudentEnrolledClasses">
                <i className="fas fa-fw fa-wrench" style={{ marginRight: "12px", fontSize: "12px" }}></i>
                <span style={{ fontSize: "12px", fontWeight: "600" }}>Enrolled Classes</span>
              </Link>
            </li>
            <li className="nav-item">
              <a className="nav-link collapsed" style={{ cursor: "pointer" }}>
                <i className="fas fa-fw fa-wrench" style={{ marginRight: "12px", fontSize: "12px" }}></i>
                <Link className="small" to="/">
                  <span style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "12px", fontWeight: "600" }}>Logout</span>
                </Link>
              </a>
            </li>
            <hr className="sidebar-divider"></hr>
          </ul>
          <div id="content-wrapper" className="d-flex flex-column">
            <div id="content">
              <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
                <button id="sidebarToggleTop" className="btn btn-link d-md-none rounded-circle mr-3">
                  <i className="fa fa-bars"></i>
                </button>
              
                <ul className="navbar-nav ml-auto">
                  <div className="topbar-divider d-none d-sm-block"></div>
                  <li className="nav-item dropdown no-arrow">
                    <a>
                      <span className="mr-2 d-none d-lg-inline text-gray-600 small" style={{ fontSize: "12px" }}>
                        {username} <br></br> Role:{role}
                      </span>
                    </a>
                  </li>
                </ul>
              </nav>
              <div className="container-fluid" style={{ fontSize: "12px" }}>
                <StudentCourse />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
