import React from "react";

const ScheduleView = ({ enrolledSections, courses, onBack, onProceedToPayment }) => {
  // Filter out undefined or invalid entries
  const validEnrolledSections = enrolledSections.filter(
    (section) => section && section.courseId && section.sectionId && section.sectionName
  );

  console.log(validEnrolledSections);

  return (
    <>
      <div className="card shadow mb-4" style={{ fontSize: "12px" }}>
        <div className="card-header py-3 text-left">
          <h5 className="m-0 font-weight-bold text-primary" style={{ fontSize: "12px" }}>
            Your Schedule
          </h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered" style={{ fontSize: "12px" }}>
              <thead className="thead-light">
                <tr>
                  <th>Course Name</th>
                  <th>Sections (Day & Time)</th>
                  <th>Instructor</th>
                </tr>
              </thead>
              <tbody>
                {validEnrolledSections.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-center">
                      No courses registered.
                    </td>
                  </tr>
                ) : (
                  validEnrolledSections.map((enrolled) => (
                    <tr key={enrolled.sectionId}>
                      <td>
                        {
                          courses.find((course) => course._id === enrolled.courseId)
                            ?.courseName
                        }
                      </td>
                      <td>{enrolled.sectionName}</td>
                      <td>{enrolled.instructor}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="d-flex justify-content-between" style={{ marginTop: "20px" }}>
        <button className="btn btn-primary" onClick={onBack} style={{ fontSize: "12px" }}>
          Back to All Courses
        </button>
        <button
          className="btn btn-success"
          onClick={onProceedToPayment}
          style={{ fontSize: "12px" }}
        >
          Proceed to Payment
        </button>
      </div>
    </>
  );
};

export default ScheduleView;
