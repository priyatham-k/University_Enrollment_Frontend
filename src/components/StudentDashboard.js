import React, { useState, useEffect } from "react";
import "../App.css";
import StudentCourse from "./StudentCourse";
import { Link, useLocation } from "react-router-dom";

function Dashboard() {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");

  const location = useLocation();
  const isDashboard = location.pathname.includes("StudentDashboard");

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (user && user._id) {
      setUsername(user.username.split("@")[0]); // Extract username before "@"
      setRole(user.role);
    }
  }, []);

  return (
    <div>
      <div id="page-top">
        <div id="wrapper">
          {/* Sidebar */}
          <ul
            className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion"
            id="accordionSidebar"
            style={{
              backgroundColor: "#0D3B66", // University blue
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
                <i className="fas fa-graduation-cap"></i> {/* Meaningful icon */}
              </div>
              <div className="sidebar-brand-text mx-3">
                UNIVERSITY PORTAL
              </div>
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
              {/* Topbar */}
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
                      {/* Profile User Icon */}
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
                          {username}
                        </span>
                 
                      </div>
                    </a>
                  </li>
                </ul>
              </nav>

              {/* Main Content */}
              <div
                className="container-fluid"
                style={{
                  fontSize: "12px",
                }}
              >
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
