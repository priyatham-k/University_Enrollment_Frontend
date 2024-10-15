import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../App.css";

function InstructorDashBoard() {
  const [courses, setCourses] = useState([]);

  // Fetch courses when the component mounts
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/courses/instructor/670e8773d2592a5ecc732ef9"
        );
        setCourses(response.data); // Set the courses data
      } catch (error) {
        console.error("Error fetching courses:", error);
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
                <i className="fas fa-laugh-wink"></i>
              </div>
              <div className="sidebar-brand-text mx-3">
                SB Admin <sup>2</sup>
              </div>
            </a>
            <hr className="sidebar-divider my-0" />
            <hr className="sidebar-divider" />
            <div className="sidebar-heading">Interface</div>
            <li className="nav-item">
              <a className="nav-link collapsed" style={{ cursor: "pointer" }}>
                <i className="fas fa-fw fa-cog"></i>
                <span>Course Data</span>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link collapsed" style={{ cursor: "pointer" }}>
                <i className="fas fa-fw fa-wrench"></i>
                <Link className="small" to="/">
                  <span style={{ color: "rgba(255, 255, 255, 0.8)" }}>
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
                <div className="card shadow mb-4">
                  <div className="card-header py-3">
                    <h6 className="m-0 font-weight-bold text-primary">
                      Instructor Courses
                    </h6>
                  </div>
                  <div className="card-body">
                    <div className="table-responsive">
                      <table className="table table-bordered" id="dataTable" width="100%" cellSpacing="0">
                        <thead>
                          <tr>
                            <th>Course Name</th>
                            <th>Course Code</th>
                            <th>Course Number</th>
                            <th>Description</th>
                            <th>Term</th>
                          </tr>
                        </thead>
                        <tbody>
                          {courses.length === 0 ? (
                            <tr>
                              <td colSpan="5" className="text-center">No courses found</td>
                            </tr>
                          ) : (
                            courses.map((course) => (
                              <tr key={course._id}>
                                <td>{course.courseName}</td>
                                <td>{course.courseCode}</td>
                                <td>{course.courseNumber}</td>
                                <td>{course.description}</td>
                                <td>{course.term}</td>
                              </tr>
                            ))
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
