import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const CourseTable = ({
  courses,
  enrolledSections,
  onSelect,
  onDrop,
  alreadyEnrolled,
  onProceedToSchedule,
}) => {
  const buttonStyle = {
    fontSize: "10px",
    padding: "4px 8px",
    marginLeft: "4px",
    borderRadius: "4px",
    cursor: "pointer",
  };

  const selectButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#4caf50",
    color: "#fff",
    border: "none",
  };

  const unselectButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#f44336",
    color: "#fff",
    border: "none",
  };

  return (
    <div>
      <div className="card shadow mb-4" style={{ fontSize: "12px" }}>
        <div className="card-header py-3 text-left">
          <h5
            className="m-0 font-weight-bold text-primary"
            style={{ fontSize: "12px" }}
          >
            All Courses
          </h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table
              className="table table-bordered"
              style={{ fontSize: "12px" }}
            >
              <thead className="thead-light">
                <tr>
                  <th>Course Name</th>
                  <th>Course Code</th>
                  <th>Description</th>
                  <th>Term</th>
                  <th>Sections (Day & Time) - Instructor</th>
                  <th>Actions</th>
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
                  courses.map((course) => {
                    const isCourseAlreadyEnrolled = alreadyEnrolled.some(
                      (enrolled) => enrolled.cid === course._id
                    );

                    return (
                      <tr key={course._id}>
                        <td>{course.courseName}</td>
                        <td>{course.courseCode}</td>
                        <td>{course.description}</td>
                        <td>{course.term}</td>
                        <td>
                          {course.sections && course.sections.length > 0 ? (
                            course.sections.map((section) => (
                              <div
                                key={section._id || Math.random()} // Use Math.random() as a fallback for key if _id is unavailable
                                style={{ marginBottom: "8px" }}
                              >
                                <strong>
                                  {section.sectionName || "Unnamed Section"}
                                </strong>{" "}
                                -{" "}
                                {section.instructor?.firstName ||
                                  "No instructor assigned"}
                              </div>
                            ))
                          ) : (
                            <div
                              style={{
                                fontSize: "12px",
                                color: "#999",
                                marginTop: "8px",
                              }}
                            >
                              No sections available.
                            </div>
                          )}
                        </td>
                        <td>
                          {isCourseAlreadyEnrolled ? (
                            <span
                              style={{
                                fontSize: "12px",
                                color: "green",
                                fontWeight: "bold",
                              }}
                            >
                              Already Enrolled
                            </span>
                          ) : (
                            course.sections.map((section) => {
                              const isSectionSelected = enrolledSections.some(
                                (enrolled) =>
                                  enrolled.courseId === course._id &&
                                  enrolled.sectionId === section._id
                              );

                              return (
                                <div
                                  key={section._id}
                                  style={{
                                    marginBottom: "8px",
                                  }}
                                >
                                  {isSectionSelected ? (
                                    <button
                                      style={unselectButtonStyle}
                                      onClick={() =>
                                        onDrop(course._id, section._id)
                                      }
                                    >
                                      Unselect
                                    </button>
                                  ) : (
                                    <button
                                      style={selectButtonStyle}
                                      onClick={() =>
                                        onSelect(course._id, section)
                                      }
                                    >
                                      Select
                                    </button>
                                  )}
                                </div>
                              );
                            })
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="d-flex justify-content-end" style={{ marginTop: "20px" }}>
        <button
          className="btn btn-success"
          onClick={onProceedToSchedule}
          style={{
            fontSize: "12px",
            padding: "6px 12px",
            borderRadius: "4px",
          }}
        >
          Get This Schedule
        </button>
      </div>
    </div>
  );
};

export default CourseTable;
