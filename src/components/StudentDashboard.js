import React, { useState, useEffect } from "react";
import "../App.css";
import axios from "axios";
import StudentCourse from "./StudentCourse";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
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

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };
  const location = useLocation();
  const isDashboard = location.pathname.includes("StudentDashboard");
  const validateForm = () => {
    let formErrors = {};
    if (!formData.studentName) formErrors.studentName = "Full name is required";
    if (!formData.degreeProgram)
      formErrors.degreeProgram = "Degree program is required";
    if (!formData.major) formErrors.major = "Major is required";
    if (!formData.contactEmail) formErrors.contactEmail = "Email is required";
    if (!formData.contactPhone) formErrors.contactPhone = "Phone is required";
    if (!formData.season) formErrors.season = "Please select a season";
    if (!formData.englishTest)
      formErrors.englishTest = "Please select an English test";
    return formErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formErrors = validateForm();
    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      // Get the user details from sessionStorage
      const user = JSON.parse(sessionStorage.getItem("user"));

      // Check if the user exists and get the userId
      if (user && user._id) {
        const updatedFormData = {
          ...formData, // Spread the existing formData fields
          studentId: user._id, // Add the userId from session storage
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
          <ul
            className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion"
            id="accordionSidebar"
          >
            <a className="sidebar-brand d-flex align-items-center justify-content-center">
              <div className="sidebar-brand-icon rotate-n-15">
                <i className="fas fa-university"></i>
              </div>
              <div className="sidebar-brand-text mx-3">UNIVERSITY OF TEXAS</div>
            </a>
            <hr className="sidebar-divider my-0"></hr>
            <hr className="sidebar-divider"></hr>
            <div className="sidebar-heading">Interface</div>
            <li className={`nav-item ${isDashboard ? "active" : ""}`}>
              <Link className="nav-link collapsed" to="/StudentDashboard">
                <i
                  className="fas fa-book"
                  style={{ marginRight: "12px", fontSize: "15px" }}
                ></i>
                <span style={{ fontSize: "14px", fontWeight: "600" }}>
                  All Cources
                </span>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link collapsed" to="/StudentEnrolledClasses">
                <i
                  className="fas fa-fw fa-wrench"
                  style={{ marginRight: "12px", fontSize: "15px" }}
                ></i>
                <span style={{ fontSize: "14px", fontWeight: "600" }}>
                  Enrolled Classes
                </span>
              </Link>
              <div id="collapseUtilities" className="collapse"></div>
            </li>{" "}
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
            <hr className="sidebar-divider"></hr>
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
                <form className="d-none d-sm-inline-block form-inline mr-auto ml-md-3 my-2 my-md-0 mw-100 navbar-search">
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control bg-light border-0 small"
                      placeholder="Search for..."
                      aria-label="Search"
                      aria-describedby="basic-addon2"
                    ></input>
                    <div className="input-group-append">
                      <button className="btn btn-primary" type="button">
                        <i className="fas fa-search fa-sm"></i>
                      </button>
                    </div>
                  </div>
                </form>

                <ul className="navbar-nav ml-auto">
                  <div className="topbar-divider d-none d-sm-block"></div>
                  <li className="nav-item dropdown no-arrow">
                    <a>
                      <span className="mr-2 d-none d-lg-inline text-gray-600 small">
                        Douglas McGee
                      </span>
                    </a>
                    <div
                      className="dropdown-menu dropdown-menu-right shadow animated--grow-in"
                      aria-labelledby="userDropdown"
                    >
                      <a className="dropdown-item">
                        <i className="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
                        Profile
                      </a>
                      <a className="dropdown-item">
                        <i className="fas fa-cogs fa-sm fa-fw mr-2 text-gray-400"></i>
                        Settings
                      </a>
                      <a className="dropdown-item">
                        <i className="fas fa-list fa-sm fa-fw mr-2 text-gray-400"></i>
                        Activity Log
                      </a>
                      <div className="dropdown-divider"></div>
                      <a
                        className="dropdown-item"
                        data-toggle="modal"
                        data-target="#logoutModal"
                      >
                        <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                        Logout
                      </a>
                    </div>
                  </li>
                </ul>
              </nav>
              <div className="container-fluid">
                <div className=" mt-5">
                  {applicationStatus === "pending" ? (
                    <h2 className="text-center mb-4">
                      Your application is pending. Please wait for the review
                      process to complete.
                    </h2>
                  ) : applicationStatus === "approved" ? (
                    <h2 className="text-center mb-4">
                      <StudentCourse />
                    </h2>
                  ) : applicationStatus === "Application not found" ? (
                    <h2 className="text-center mb-4">
                      Graduation Application Form
                    </h2>
                  ) : (
                    <h2 className="text-center mb-4">
                      Graduation Application Form
                    </h2>
                  )}
                  {applicationStatus !== "approved" &&
                    applicationStatus !== "pending" && (
                      <form onSubmit={handleSubmit}>
                        <div className="form-group">
                          <label htmlFor="studentName">Full Name</label>
                          <input
                            type="text"
                            className="form-control"
                            id="studentName"
                            value={formData.studentName}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                          />
                          {errors.studentName && (
                            <span className="error">{errors.studentName}</span>
                          )}
                        </div>

                        <div className="form-group">
                          <label htmlFor="degreeProgram">Degree Program</label>
                          <input
                            type="text"
                            className="form-control"
                            id="degreeProgram"
                            value={formData.degreeProgram}
                            onChange={handleChange}
                            placeholder="Enter your degree program"
                          />
                          {errors.degreeProgram && (
                            <span className="error">
                              {errors.degreeProgram}
                            </span>
                          )}
                        </div>

                        <div className="form-group">
                          <label htmlFor="major">Major</label>
                          <input
                            type="text"
                            className="form-control"
                            id="major"
                            value={formData.major}
                            onChange={handleChange}
                            placeholder="Enter your major"
                          />
                          {errors.major && (
                            <span className="error">{errors.major}</span>
                          )}
                        </div>

                        <div className="form-group">
                          <label htmlFor="contactEmail">Email Address</label>
                          <input
                            type="email"
                            className="form-control"
                            id="contactEmail"
                            value={formData.contactEmail}
                            onChange={handleChange}
                            placeholder="Enter your email address"
                          />
                          {errors.contactEmail && (
                            <span className="error">{errors.contactEmail}</span>
                          )}
                        </div>

                        <div className="form-group">
                          <label htmlFor="contactPhone">Phone Number</label>
                          <input
                            type="tel"
                            className="form-control"
                            id="contactPhone"
                            value={formData.contactPhone}
                            onChange={handleChange}
                            placeholder="Enter your phone number"
                          />
                          {errors.contactPhone && (
                            <span className="error">{errors.contactPhone}</span>
                          )}
                        </div>

                        <div className="form-group">
                          <label htmlFor="season">
                            Which season will you be applying?
                          </label>
                          <select
                            className="form-control"
                            id="season"
                            value={formData.season}
                            onChange={handleChange}
                          >
                            <option value="">Select season</option>
                            <option value="Spring 2025">Spring 2025</option>
                            <option value="Summer 1 2025">Summer 1 2025</option>
                            <option value="Summer 2 2025">Summer 2 2025</option>
                            <option value="Fall 2025">Fall 2025</option>
                            <option value="Spring 2026">Spring 2026</option>
                          </select>
                          {errors.season && (
                            <span className="error">{errors.season}</span>
                          )}
                        </div>

                        <div className="form-group">
                          <label htmlFor="englishTest">English Test</label>
                          <select
                            className="form-control"
                            id="englishTest"
                            value={formData.englishTest}
                            onChange={handleChange}
                          >
                            <option value="">Select test</option>
                            <option value="TOEFL">TOEFL</option>
                            <option value="IELTS">IELTS</option>
                            <option value="Duolingo">Duolingo</option>
                          </select>
                          {errors.englishTest && (
                            <span className="error">{errors.englishTest}</span>
                          )}
                        </div>

                        <button type="submit" className="btn btn-primary">
                          Submit Application
                        </button>
                      </form>
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
