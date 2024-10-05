import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../App.css";
import "bootstrap/dist/css/bootstrap.min.css";

const StudentCourse = () => {
  const [courses, setCourses] = useState([]); // All courses fetched from the server
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]); // Enrolled courses fetched from sessionStorage

  // Slim Toastify options
  const toastOptions = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    style: {
      fontSize: "12px",
      padding: "8px",
    },
  };

  // Fetch all courses from the API
  const fetchCourses = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/api/courses/allCourses"
      );
      setCourses(response.data);
    } catch (err) {
      setError("Failed to fetch courses. Please try again later.");
      toast.error("Failed to fetch courses.", toastOptions);
    } finally {
      setLoading(false);
    }
  };

  // Load enrolled courses from sessionStorage
  const loadEnrolledCourses = () => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (user && user.enrolledCourses) {
      setEnrolledCourses(user.enrolledCourses);
    }
  };

  // Update sessionStorage and enrolledCourses state after a successful registration/drop
  const updateSessionStorage = (updatedEnrolledCourses) => {
    let user = JSON.parse(sessionStorage.getItem("user"));
    if (user) {
      user.enrolledCourses = updatedEnrolledCourses;
      sessionStorage.setItem("user", JSON.stringify(user)); // Update sessionStorage
      setEnrolledCourses(updatedEnrolledCourses); // Update local state
    }
  };

  // Handle course registration
  const handleRegisterCourse = async (courseId) => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    try {
      const response = await axios.post(
        `http://localhost:3001/api/user/addCourse/${user._id}`,
        { courseId }
      );
      const updatedEnrolledCourses = response.data.user.enrolledCourses; // Ensure you're getting the correct enrolledCourses array
      updateSessionStorage(updatedEnrolledCourses); // Update sessionStorage with the newly enrolled courses
      toast.success("Course registered successfully!", toastOptions);
    } catch (err) {
      toast.error(err.response?.data?.message, toastOptions);
    }
  };

  // Handle course dropping
  const handleDropCourse = async (courseId) => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    try {
      await axios.post(
        `http://localhost:3001/api/user/dropCourse/${user._id}`,
        { courseId }
      );
      const updatedEnrolledCourses = enrolledCourses.filter(
        (course) => course._id !== courseId
      );
      updateSessionStorage(updatedEnrolledCourses); // Update sessionStorage after dropping the course
      toast.success("Course dropped successfully!", toastOptions);
    } catch (err) {
      toast.error("Failed to drop course. Please try again.", toastOptions);
    }
  };

  // Load courses and enrolled courses on component mount
  useEffect(() => {
    fetchCourses();
    loadEnrolledCourses();
  }, []);

  // Handle loading and error states
  if (loading) return <div>Loading courses...</div>;
  if (error) return <div className="text-danger">{error}</div>;

  return (
    <div>
      <ToastContainer />
      <div className="card shadow mb-4" style={{ fontSize: "13px" }}>
        <div className="card-header py-3">
          <h5 className="m-0 font-weight-bold text-primary float-left">All Courses</h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered" id="dataTable" width="100%">
              <thead>
                <tr>
                  <th>Course Name</th>
                  <th>Course Code</th>
                  <th>Course Description</th>
                  <th>Term</th>
                  <th>Instructor Name</th>
                  <th>Actions</th> {/* Actions for enrolling/dropping */}
                </tr>
              </thead>
              <tbody>
                {courses.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center">
                      No courses available.
                    </td>
                  </tr>
                ) : (
                  courses.map((course) => (
                    <tr key={course._id}>
                      <td>{course.courseName}</td>
                      <td>{course.courseCode}</td>
                      <td>{course.description}</td>
                      <td>{course.term}</td>
                      <td>{course.instructor?.name}</td>
                      <td>
                        {enrolledCourses.some(
                          (enrolledCourse) => enrolledCourse?._id === course._id
                        ) ? (
                          <button
                            className="btn btn-danger"
                            style={{ width: "67px", height: "30px", padding: "0px" }}
                            onClick={() => handleDropCourse(course._id)}
                          >
                            Drop Course
                          </button>
                        ) : (
                          <button
                            className="btn btn-primary"
                            style={{ width: "67px", height: "30px", padding: "0px" }}
                            onClick={() => handleRegisterCourse(course._id)}
                          >
                            Register Course
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* New Button at Bottom Right */}
      <div className="d-flex justify-content-end" style={{ marginTop: "20px" }}>
        <button className="btn btn-success" style={{ padding: "10px 20px" }}>
          Proceed
        </button>
      </div>
    </div>
  );
};

export default StudentCourse;
