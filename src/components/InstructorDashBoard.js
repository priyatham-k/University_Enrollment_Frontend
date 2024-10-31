import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../App.css";

function InstructorDashBoard() {
  const [courses, setCourses] = useState([]);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      const userData = sessionStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        const instructorId = user._id;
        setUsername(user.username);

        try {
          const response = await axios.get(
            `http://localhost:3001/api/courses/instructor/${instructorId}`
          );
          setCourses(response.data);
        } catch (error) {
          console.error("Error fetching courses:", error);
        }
      } else {
        console.error("User not found in sessionStorage.");
      }
    };

    fetchCourses();
  }, []);

  return (
    <div>
      <div id="page-top">
        <div id="wrapper">
          <ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion">
            <a className="sidebar-brand d-flex align-items-center justify-content-center">
              <div className="sidebar-brand-icon rotate-n-15">
                <i className="fas fa-university" ></i>
              </div>
              <div className="sidebar-brand-text mx-3" style={{ fontSize: "12px" }}>
                UNIVERSITY OF TEXAS
              </div>
            </a>
            <hr className="sidebar-divider my-0" />
            <hr className="sidebar-divider" />
            <div className="sidebar-heading" style={{ fontSize: "12px" }}>MENU</div>
            <li className="nav-item active">
              <a className="nav-link collapsed" style={{ cursor: "pointer" }}>
                <i className="fas fa-book" style={{ marginRight: "12px", fontSize: "12px" }}></i>
                <span style={{ fontSize: "12px", fontWeight: "600" }}>Assigned Courses</span>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link collapsed" style={{ cursor: "pointer" }}>
                <i className="fas fa-sign-out-alt" style={{ marginRight: "12px", fontSize: "12px" }}></i>
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
                    <a>
                      <span className="mr-2 d-none d-lg-inline text-gray-600 small" style={{ fontSize: "12px" }}>
                        {username}
                      </span>
                    </a>
                  </li>
                </ul>
              </nav>

              <div className="container-fluid" style={{ fontSize: "12px" }}>
                <div className="card shadow mb-4">
                  <div className="card-header py-3">
                    <h6 className="m-0 font-weight-bold text-primary" style={{ fontSize: "12px" }}>
                      Instructor Assigned Courses
                    </h6>
                  </div>
                  <div className="card-body">
                    <div className="table-responsive">
                      <table className="table table-bordered" width="100%" cellSpacing="0" style={{ fontSize: "12px" }}>
                        <thead>
                          <tr>
                            <th>Course Name</th>
                            <th>Course Code</th>
                            <th>Description</th>
                            <th>Term</th>
                            <th>Section Name</th>
                            <th>Enrolled Students</th>
                          </tr>
                        </thead>
                        <tbody>
                          {courses.length === 0 ? (
                            <tr>
                              <td colSpan="6" className="text-center" style={{ fontSize: "12px" }}>
                                No courses found
                              </td>
                            </tr>
                          ) : (
                            courses.map((course) =>
                              course.sections.map((section) => (
                                <tr key={section.sectionName}>
                                  <td>{course.courseName}</td>
                                  <td>{course.courseCode}</td>
                                  <td>{course.description}</td>
                                  <td>{course.term}</td>
                                  <td>{section.sectionName}</td>
                                  <td>
                                    {section.enrolledStudents && section.enrolledStudents.length > 0 ? (
                                      section.enrolledStudents.join(", ")
                                    ) : (
                                      <span>No students enrolled</span>
                                    )}
                                  </td>
                                </tr>
                              ))
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InstructorDashBoard;
