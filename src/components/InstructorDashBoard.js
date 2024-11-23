import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Card, CardHeader, CardContent, Typography, Box } from "@mui/material";
import { Person as PersonIcon } from "@mui/icons-material";
import "../App.css";

function InstructorDashBoard() {
  const [courses, setCourses] = useState([]);
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    const fetchCoursesAndStudents = async () => {
      const userData = sessionStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        const instructorId = user._id;
        setUsername(user.username.split("@")[0]); // Extract username before "@"
        setRole(user.role);

        try {
          // Fetch courses and sections assigned to the instructor
          const courseResponse = await axios.get(
            `http://localhost:3001/api/instructors/courses/${instructorId}`
          );
          const coursesWithSections = courseResponse.data;

          // Fetch enrolled students for each section
          const coursesWithStudents = await Promise.all(
            coursesWithSections.map(async (course) => {
              const enrichedSections = await Promise.all(
                course.sections.map(async (section) => {
                  try {
                    const studentResponse = await axios.get(
                      `http://localhost:3001/api/sections/${section._id}/students`
                    );
                    return {
                      ...section,
                      enrolledStudents: studentResponse.data.length
                        ? studentResponse.data.map((student) => student.username)
                        : [], // Handle sections with no students
                    };
                  } catch (error) {
                    console.error(
                      `Error fetching students for section ${section._id}:`,
                      error
                    );
                    return {
                      ...section,
                      enrolledStudents: [], // Default to empty if fetch fails
                    };
                  }
                })
              );
              return {
                ...course,
                sections: enrichedSections,
              };
            })
          );

          setCourses(coursesWithStudents);
        } catch (error) {
          console.error("Error fetching courses or students:", error);
        }
      } else {
        console.error("User not found in sessionStorage.");
      }
    };

    fetchCoursesAndStudents();
  }, []);

  return (
    <div style={{ fontSize: "12px" }}>
      <div id="page-top">
        <div id="wrapper">
          {/* Sidebar */}
          <ul
            className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion"
            style={{ backgroundColor: "#0D3B66" }}
          >
            <a
              className="sidebar-brand d-flex align-items-center justify-content-center"
              style={{ fontSize: "12px", color: "#fff", padding: "15px 0" }}
            >
              <div className="sidebar-brand-icon">
                <i className="fas fa-graduation-cap"></i>
              </div>
              <div className="sidebar-brand-text mx-3">UNIVERSITY PORTAL</div>
            </a>
            <hr className="sidebar-divider my-0" />
            <div className="sidebar-heading" style={{ fontSize: "12px", color: "#ddd" }}>
              MENU
            </div>
            <li className="nav-item active">
              <a className="nav-link" style={{ cursor: "pointer", fontSize: "12px" }}>
                <i className="fas fa-book" style={{ marginRight: "12px" }}></i>
                <span style={{ fontWeight: "600" }}>Assigned Courses</span>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" style={{ cursor: "pointer", fontSize: "12px" }}>
                <i className="fas fa-sign-out-alt" style={{ marginRight: "12px" }}></i>
                <Link to="/" style={{ color: "rgba(255, 255, 255, 0.8)", fontWeight: "600" }}>
                  Logout
                </Link>
              </a>
            </li>
          </ul>

          {/* Main Content */}
          <div id="content-wrapper" className="d-flex flex-column">
            <div id="content">
              {/* Topbar */}
              <nav
                className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow"
                style={{ padding: "0.5rem 1rem" }}
              >
                <ul className="navbar-nav ml-auto">
                  <li className="nav-item dropdown no-arrow">
                    <Box display="flex" alignItems="center">
                      <PersonIcon style={{ marginRight: "8px", color: "#0D3B66" }} />
                      <Box>
                        <Typography
                          style={{
                            fontSize: "12px",
                            fontWeight: "bold",
                            marginBottom: "2px",
                            color: "#333",
                          }}
                        >
                          {username}
                        </Typography>
                      </Box>
                    </Box>
                  </li>
                </ul>
              </nav>

              {/* Courses List */}
              <div className="container-fluid" style={{ fontSize: "12px" }}>
                <Card style={{ boxShadow: "0px 4px 10px rgba(0,0,0,0.1)" }}>
                  <CardHeader
                    title={
                      <Typography style={{ fontSize: "14px", fontWeight: "bold", color: "#0D3B66" }}>
                        Instructor Assigned Courses
                      </Typography>
                    }
                    style={{ paddingBottom: 0 }}
                  />
                  <CardContent>
                    <div className="table-responsive">
                      <table
                        className="table table-bordered"
                        style={{
                          fontSize: "12px",
                          textAlign: "center",
                          width: "100%",
                          borderCollapse: "collapse",
                        }}
                      >
                        <thead>
                          <tr style={{ backgroundColor: "#f1f1f1", color: "#333" }}>
                            <th style={{ padding: "8px" }}>Course Name</th>
                            <th style={{ padding: "8px" }}>Course Code</th>
                            <th style={{ padding: "8px" }}>Description</th>
                            <th style={{ padding: "8px" }}>Term</th>
                            <th style={{ padding: "8px" }}>Section Name</th>
                            <th style={{ padding: "8px" }}>Enrolled Students</th>
                          </tr>
                        </thead>
                        <tbody>
                          {courses.length === 0 ? (
                            <tr>
                              <td
                                colSpan="6"
                                className="text-center"
                                style={{ fontSize: "12px", padding: "8px" }}
                              >
                                No courses found
                              </td>
                            </tr>
                          ) : (
                            courses.map((course) =>
                              course.sections.map((section) => (
                                <tr key={section.sectionName}>
                                  <td style={{ padding: "8px" }}>{course.courseName}</td>
                                  <td style={{ padding: "8px" }}>{course.courseCode}</td>
                                  <td style={{ padding: "8px" }}>{course.description}</td>
                                  <td style={{ padding: "8px" }}>{course.term}</td>
                                  <td style={{ padding: "8px" }}>{section.sectionName}</td>
                                  <td style={{ padding: "8px" }}>
                                    {section.enrolledStudents.length > 0
                                      ? section.enrolledStudents.join(", ")
                                      : "No students enrolled"}
                                  </td>
                                </tr>
                              ))
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InstructorDashBoard;
