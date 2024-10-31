import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../App.css";
import "bootstrap/dist/css/bootstrap.min.css";

const StudentCourse = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrolledSections, setEnrolledSections] = useState([]);
  const [showSchedule, setShowSchedule] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: "",
    cardExpiry: "",
    cardCVV: "",
  });
  const [isPaymentConfirmed, setIsPaymentConfirmed] = useState(false);

  const toastOptions = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    style: { fontSize: "12px", padding: "8px" },
  };

  const fetchCourses = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/courses/allCourses");
      setCourses(response.data);
    } catch (err) {
      setError("Failed to fetch courses. Please try again later.");
      toast.error("Failed to fetch courses.", toastOptions);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSection = (courseId, section) => {
    if (enrolledSections.some((enrolled) => enrolled.courseId === courseId)) {
      toast.error("You can only select one section per course.", toastOptions);
    } else {
      setEnrolledSections((prev) => [
        ...prev,
        { courseId, sectionId: section._id, price: 1000, sectionName: section.sectionName, instructor: section.instructor?.name },
      ]);
      toast.success("Section selected successfully!", toastOptions);
    }
  };

  const handleDropSection = (sectionId) => {
    setEnrolledSections(enrolledSections.filter((enrolled) => enrolled.sectionId !== sectionId));
    toast.success("Section unselected successfully!", toastOptions);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  if (loading) return <div>Loading courses...</div>;
  if (error) return <div className="text-danger">{error}</div>;

  const handlePayment = async () => {
    const totalCost = enrolledSections.length * 1000;
    const confirmation = window.confirm(
      `Once payment is done for the subjects, if you drop any subject, only half of the amount will be returned. Total Amount: $${totalCost}. Do you want to proceed?`
    );

    if (confirmation) {
      const paymentsPayload = {
        payments: enrolledSections.map((section) => ({
          courseName: section.sectionName,
          payment: "1000",
        })),
      };

      try {
        const user = JSON.parse(sessionStorage.getItem("user"));
        const userId = user._id;
        const response = await axios.post(
          `http://localhost:3001/api/user/updatePayments/${userId}`,
          paymentsPayload
        );
        user.payment = response.data.user.payment;
        sessionStorage.setItem("user", JSON.stringify(user));
        setIsPaymentConfirmed(true);
        toast.success("Payment processed successfully!", toastOptions);

        setTimeout(() => {
          window.location.href = "/StudentEnrolledClasses";
        }, 2000);
      } catch (err) {
        toast.error(err.response?.data?.message || "Payment failed.", toastOptions);
      }
    }
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <ToastContainer />

      {!showSchedule ? (
        <>
          <div className="card shadow mb-4" style={{ fontSize: "12px" }}>
            <div className="card-header py-3 text-left">
              <h5 className="m-0 font-weight-bold text-primary">All Courses</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-bordered" width="100%">
                  <thead>
                    <tr>
                      <th>Course Name</th>
                      <th>Course Code</th>
                      <th>Description</th>
                      <th>Term</th>
                      <th>Sections</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center">No courses available.</td>
                      </tr>
                    ) : (
                      courses.map((course) => (
                        <tr key={course._id}>
                          <td>{course.courseName}</td>
                          <td>{course.courseCode}</td>
                          <td>{course.description}</td>
                          <td>{course.term}</td>
                          <td>
                            {course.sections.map((section) => (
                              <div key={section._id} style={{ marginBottom: "8px" }}>
                                <strong>{section.sectionName}</strong> - {section.instructor?.name || "No instructor assigned"}
                                {enrolledSections.some((enrolled) => enrolled.sectionId === section._id) ? (
                                  <button
                                    className="btn btn-danger btn-sm ml-2"
                                    onClick={() => handleDropSection(section._id)}
                                    style={{ fontSize: "12px" }}
                                  >
                                    Unselect
                                  </button>
                                ) : (
                                  <button
                                    className="btn btn-primary btn-sm ml-2"
                                    onClick={() => handleRegisterSection(course._id, section)}
                                    style={{ fontSize: "12px" }}
                                  >
                                    Select
                                  </button>
                                )}
                              </div>
                            ))}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-end" style={{ marginTop: "20px" }}>
            <button className="btn btn-success" onClick={() => setShowSchedule(true)} style={{ fontSize: "12px" }}>
              Get This Schedule
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="card shadow mb-4" style={{ fontSize: "12px" }}>
            <div className="card-header py-3 text-left">
              <h5 className="m-0 font-weight-bold text-primary">Your Schedule</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-bordered" width="100%">
                  <thead>
                    <tr>
                      <th>Course Name</th>
                      <th>Section</th>
                      <th>Instructor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enrolledSections.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="text-center">No courses registered.</td>
                      </tr>
                    ) : (
                      enrolledSections.map((enrolled) => (
                        <tr key={enrolled.sectionId}>
                          <td>{courses.find(course => course._id === enrolled.courseId)?.courseName}</td>
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

          <div className="row">
            <div className="col-md-6">
              <div className="card shadow mb-4">
                <div className="card-header py-3 text-left">
                  <h5 className="m-0 font-weight-bold text-primary">Payment Details</h5>
                </div>
                <div className="card-body">
                  <div className="form-group">
                    <label htmlFor="cardNumber" style={{ fontSize: "12px" }}>Card Number</label>
                    <input type="text" className="form-control" id="cardNumber" name="cardNumber" value={paymentDetails.cardNumber} onChange={handlePaymentChange} style={{ fontSize: "12px" }} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="cardExpiry" style={{ fontSize: "12px" }}>Expiry Date</label>
                    <input type="text" className="form-control" id="cardExpiry" name="cardExpiry" value={paymentDetails.cardExpiry} onChange={handlePaymentChange} style={{ fontSize: "12px" }} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="cardCVV" style={{ fontSize: "12px" }}>CVV</label>
                    <input type="text" className="form-control" id="cardCVV" name="cardCVV" value={paymentDetails.cardCVV} onChange={handlePaymentChange} style={{ fontSize: "12px" }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card shadow mb-4">
                <div className="card-header py-3 text-left">
                  <h5 className="m-0 font-weight-bold text-primary">Confirm Payment</h5>
                </div>
                <div className="card-body">
                  <h5 style={{ fontSize: "12px" }}>Total Price: ${enrolledSections.reduce((total, section) => total + section.price, 0)}</h5>
                  <button className="btn btn-primary" onClick={handlePayment} style={{ fontSize: "12px" }} disabled={enrolledSections.length === 0 || isPaymentConfirmed}>
                    {isPaymentConfirmed ? "Payment Confirmed" : "Confirm Payment"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default StudentCourse;
