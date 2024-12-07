import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Modal, TextField, Button,Card, CardHeader, CardContent, Typography, Box } from "@mui/material";
import { Person as PersonIcon } from "@mui/icons-material";
import "../App.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function InstructorDashBoard() {
  const [courses, setCourses] = useState([]);
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  useEffect(() => {
    const fetchCoursesAndStudents = async () => {
      const userData = sessionStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        const instructorId = user._id;
        setUsername(user.firstName); // Extract username before "@"
        setRole("Instructor");

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
                        ? studentResponse.data.map(
                            (student) =>
                              `${student.firstName} ${student.lastName}`
                          )
                        : [],
                    };
                  } catch (error) {
                    console.error(error);
                    return {
                      ...section,
                      enrolledStudents: [],
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
          console.log(courses);
          console.log(coursesWithStudents);
        } catch (error) {
          console.error("Error fetching courses or students:", error);
        }
      } else {
        console.error("User not found in sessionStorage.");
      }
    };

    fetchCoursesAndStudents();
  }, []);
  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match.");
      return;
    }
  
    try {
      const user = JSON.parse(sessionStorage.getItem("user"));
  
      if (!user || !user.email) {
        toast.error("User session has expired. Please log in again.");
        return;
      }
      const response = await axios.post("http://localhost:3001/api/instructors/change-password", {
        email: user.email,
        currentPassword,
        newPassword,
      });
  
      // Success toast
      toast.success(response.data.message || "Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowChangePasswordModal(false);
    } catch (err) {
      // Error handling with toasts
      if (err.response && err.response.status === 401) {
        toast.error("Incorrect current password.");
      } else if (err.response && err.response.status === 404) {
        toast.error("User not found. Please contact support.");
      } else if (err.response && err.response.status === 400) {
        toast.error(err.response.data.message || "Invalid input. Please try again.");
      } else {
        toast.error("An unexpected error occurred. Please try again later.");
      }
    }
  };
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
            <div
              className="sidebar-heading"
              style={{ fontSize: "12px", color: "#ddd" }}
            >
              MENU
            </div>
            <li className="nav-item active">
              <a
                className="nav-link"
                style={{ cursor: "pointer", fontSize: "12px" }}
              >
                <i className="fas fa-book" style={{ marginRight: "12px" }}></i>
                <span style={{ fontWeight: "600" }}>Assigned Courses</span>
              </a>
            </li>
            <li className="nav-item ">
              <a
                className="nav-link"
                onClick={() => {
                  setCurrentPassword(""); // Clear current password field
                  setNewPassword("");     // Clear new password field
                  setConfirmPassword(""); // Clear confirm password field
                  setShowChangePasswordModal(true); // Open the modal
                }}
                style={{ cursor: "pointer", fontSize: "12px" }}
              >
                <i className="fas fa-book" style={{ marginRight: "12px" }}></i>
                <span style={{ fontWeight: "600" }}>Change Password</span>
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                style={{ cursor: "pointer", fontSize: "12px" }}
              >
                <i
                  className="fas fa-sign-out-alt"
                  style={{ marginRight: "12px" }}
                ></i>
                <Link
                  to="/"
                  style={{
                    color: "rgba(255, 255, 255, 0.8)",
                    fontWeight: "600",
                  }}
                >
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
                    <Box
                      display="flex"
                      alignItems="center"
                      style={{
                        backgroundColor: "#f5f5f5",
                        padding: "12px",
                        borderRadius: "8px",
                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                        width: "fit-content",
                      }}
                    >
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        style={{
                          width: "40px",
                          height: "40px",
                          backgroundColor: "#BB271A",
                          border: "2px solid #BB271A",
                          borderRadius: "50%",
                          marginRight: "8px",
                        }}
                      >
                        <PersonIcon
                          style={{ color: "#fff", fontSize: "24px" }}
                        />
                      </Box>

                      <Box>
                        <Typography
                          style={{
                            fontSize: "14px",
                            fontWeight: "bold",
                            color: "#0D3B66",
                          }}
                        >
                          {username}
                        </Typography>
                        <Typography
                          style={{
                            fontSize: "12px",
                            fontWeight: "bold",
                            color: "#555",
                          }}
                        >
                          Role: {role}
                        </Typography>
                      </Box>
                    </Box>
                  </li>
                </ul>
              </nav>

              <div className="container-fluid" style={{ fontSize: "12px" }}>
                <Card style={{ boxShadow: "0px 4px 10px rgba(0,0,0,0.1)" }}>
                  <CardHeader
                    title={
                      <Typography
                        style={{
                          fontSize: "14px",
                          fontWeight: "bold",
                          color: "#0D3B66",
                        }}
                      >
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
                          <tr
                            style={{
                              backgroundColor: "#f1f1f1",
                              color: "#333",
                            }}
                          >
                            <th style={{ padding: "8px" }}>Course Name</th>
                            <th style={{ padding: "8px" }}>Course Code</th>
                            <th style={{ padding: "8px" }}>Description</th>
                            <th style={{ padding: "8px" }}>Term</th>
                            <th style={{ padding: "8px" }}>
                              Sections (Day & Time)
                            </th>
                            <th style={{ padding: "8px" }}>
                              Enrolled Students
                            </th>
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
                                  <td style={{ padding: "8px" }}>
                                    {course.courseName}
                                  </td>
                                  <td style={{ padding: "8px" }}>
                                    {course.courseCode}
                                  </td>
                                  <td style={{ padding: "8px" }}>
                                    {course.description}
                                  </td>
                                  <td style={{ padding: "8px" }}>
                                    {course.term}
                                  </td>
                                  <td style={{ padding: "8px" }}>
                                    {section.sectionName}
                                  </td>
                                  <td style={{ padding: "8px" }}>
                                    {section.enrolledStudents &&
                                    section.enrolledStudents.length > 0 ? (
                                      <ul
                                        style={{
                                          paddingLeft: "16px",
                                          margin: 0,
                                        }}
                                      >
                                        {section.enrolledStudents.map(
                                          (student, index) => (
                                            <li
                                              key={index}
                                              style={{
                                                listStyleType: "none",
                                                marginBottom: "4px",
                                              }}
                                            >
                                              {student}
                                            </li>
                                          )
                                        )}
                                      </ul>
                                    ) : (
                                      "No students enrolled"
                                    )}
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
       {/* Change Password Modal */}
       <Modal open={showChangePasswordModal} onClose={() => setShowChangePasswordModal(false)}>
        <Box
          style={{
            background: "#fff",
            padding: "20px",
            margin: "100px auto",
            width: "400px",
            borderRadius: "8px",
            boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
          }}
        >
          <Typography style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "16px" }}>
            Change Password
          </Typography>
          <TextField
            label="Current Password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            fullWidth
            margin="dense"
            size="small"
          />
          <TextField
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            fullWidth
            margin="dense"
            size="small"
          />
          <TextField
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            fullWidth
            margin="dense"
            size="small"
          />
          <Box display="flex" justifyContent="flex-end" mt={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleChangePassword}
              style={{ fontSize: "12px" }}
            >
              Save
            </Button>
            <Button
              variant="outlined"
              onClick={() => setShowChangePasswordModal(false)}
              style={{ fontSize: "12px", marginLeft: "8px" }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
      
    </div>
  );
}

export default InstructorDashBoard;
