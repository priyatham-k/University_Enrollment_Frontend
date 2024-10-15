import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

const StudentCourse = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [showSchedule, setShowSchedule] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: "",
    cardExpiry: "",
    cardCVV: "",
  });
  const [isPaymentConfirmed, setIsPaymentConfirmed] = useState(false);
  const navigate = useNavigate();

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

  const handleRegisterCourse = (courseId) => {
    if (enrolledCourses.length >= 3) {
      toast.error(
        "You can only select for a maximum of 3 courses.",
        toastOptions
      );
      return;
    }

    if (enrolledCourses.some((course) => course._id === courseId)) {
      toast.error("You are already enrolled in this course.", toastOptions);
    } else {
      const course = courses.find((course) => course._id === courseId);
      setEnrolledCourses((prev) => [...prev, { ...course, price: 1000 }]);
      toast.success("Course selected successfully!", toastOptions);
    }
  };

  const handleDropCourse = (courseId) => {
    const updatedEnrolledCourses = enrolledCourses.filter(
      (course) => course._id !== courseId
    );
    setEnrolledCourses(updatedEnrolledCourses);
    toast.success("Course unselected successfully!", toastOptions);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  if (loading) return <div>Loading courses...</div>;
  if (error) return <div className="text-danger">{error}</div>;

  const handlePayment = async () => {
    const totalCost = enrolledCourses.length * 1000;
    const confirmation = window.confirm(
      `Once payment is done for the subjects, if you drop any subject, only half of the amount will be returned. Total Amount: $${totalCost}. Do you want to proceed?`
    );

    if (confirmation) {
      // Card validation logic
      const cardNumber = paymentDetails.cardNumber;
      const cardExpiry = paymentDetails.cardExpiry;
      const cardCVV = paymentDetails.cardCVV;

      let cardErrors = {};
      if (!cardNumber || !/^\d{16}$/.test(cardNumber)) {
        cardErrors.cardNumber = "Invalid card number. Must be 16 digits.";
      }

      if (!cardExpiry || !/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(cardExpiry)) {
        cardErrors.cardExpiry = "Invalid expiry date. Format should be MM/YY.";
      }

      if (!cardCVV || !/^\d{3}$/.test(cardCVV)) {
        cardErrors.cardCVV = "Invalid CVC. Must be 3 digits.";
      }

      if (Object.keys(cardErrors).length > 0) {
        toast.error(
          "Invalid card details. Please check your input.",
          toastOptions
        );
        return;
      }

      // Proceed with payment if no errors
      const paymentsPayload = {
        payments: enrolledCourses.map((course) => ({
          courseName: course.courseName,
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
        console.log(sessionStorage.setItem("test", JSON.stringify(response)));
        user.payment = response.data.user.payment;

        // Store the updated user object back to session storage
        sessionStorage.setItem("user", JSON.stringify(user));
        setIsPaymentConfirmed(true);
        toast.success("Payment processed successfully!", toastOptions);

        setTimeout(() => {
          window.location.href = "/StudentEnrolledClasses";
        }, 2000);
      } catch (err) {
        console.log(err);
        toast.error(
          err.response?.data?.message || "Payment failed.",
          toastOptions
        );
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
          <div className="card shadow mb-4" style={{ fontSize: "13px" }}>
            <div className="card-header py-3 text-left">
              <h5 className="m-0 font-weight-bold text-primary">All Courses</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table
                  className="table table-bordered"
                  id="dataTable"
                  width="100%"
                >
                  <thead>
                    <tr>
                      <th>Course Name</th>
                      <th>Course Code</th>
                      <th>Course Description</th>
                      <th>Term</th>
                      <th>Instructor Name</th>
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
                      courses.map((course) => (
                        <tr key={course._id}>
                          <td>{course.courseName}</td>
                          <td>{course.courseCode}</td>
                          <td>{course.description}</td>
                          <td>{course.term}</td>
                          <td>{course.instructor?.name}</td>
                          <td>
                            {enrolledCourses.some(
                              (enrolledCourse) =>
                                enrolledCourse?._id === course._id
                            ) ? (
                              <button
                                className="btn btn-danger"
                                style={{
                                  width: "67px",
                                  height: "30px",
                                  padding: "0px",
                                }}
                                onClick={() => handleDropCourse(course._id)}
                              >
                                unselect
                              </button>
                            ) : (
                              <button
                                className="btn btn-primary"
                                style={{
                                  width: "67px",
                                  height: "30px",
                                  padding: "0px",
                                }}
                                onClick={() => handleRegisterCourse(course._id)}
                              >
                                Select
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

          <div
            className="d-flex justify-content-end"
            style={{ marginTop: "20px" }}
          >
            <button
              className="btn btn-success"
              style={{ padding: "10px 20px" }}
              onClick={() => setShowSchedule(true)}
            >
              Get This Schedule
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="card shadow mb-4" style={{ fontSize: "13px" }}>
            <div className="card-header py-3 text-left">
              <h5 className="m-0 font-weight-bold text-primary">
                Your Schedule
              </h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table
                  className="table table-bordered"
                  id="dataTable"
                  width="100%"
                >
                  <thead>
                    <tr>
                      <th>Course Name</th>
                      <th>Course Code</th>
                      <th>Term</th>
                      <th>Instructor Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enrolledCourses.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center">
                          No courses registered.
                        </td>
                      </tr>
                    ) : (
                      enrolledCourses.map((course) => (
                        <tr key={course._id}>
                          <td>{course.courseName}</td>
                          <td>{course.courseCode}</td>
                          <td>{course.term}</td>
                          <td>{course.instructor?.name}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Side-by-side Cards for Payment Details and Confirm Payment */}
          <div className="row">
            {/* Credit Card Input Card */}
            <div className="col-md-6">
              <div className="card shadow mb-4">
                <div className="card-header py-3 text-left">
                  <h5 className="m-0 font-weight-bold text-primary">
                    Payment Details
                  </h5>
                </div>
                <div className="card-body">
                  <div className="form-group">
                    <label
                      htmlFor="cardNumber"
                      style={{
                        float: "left",
                        fontSize: "15px",
                      }}
                    >
                      Card Number
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="cardNumber"
                      name="cardNumber"
                      placeholder="Enter card number"
                      value={paymentDetails.cardNumber}
                      onChange={handlePaymentChange}
                    />
                  </div>
                  <div className="form-group">
                    <label
                      htmlFor="cardExpiry"
                      style={{
                        float: "left",
                        fontSize: "15px",
                      }}
                    >
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="cardExpiry"
                      name="cardExpiry"
                      placeholder="MM/YY"
                      value={paymentDetails.cardExpiry}
                      onChange={handlePaymentChange}
                    />
                  </div>
                  <div className="form-group">
                    <label
                      htmlFor="cardCVV"
                      style={{
                        float: "left",
                        fontSize: "15px",
                      }}
                    >
                      CVV
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="cardCVV"
                      name="cardCVV"
                      placeholder="Enter CVV"
                      value={paymentDetails.cardCVV}
                      onChange={handlePaymentChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Total Price and Confirm Payment Card */}
            <div className="col-md-6">
              <div className="card shadow mb-4">
                <div className="card-header py-3 text-left">
                  <h5 className="m-0 font-weight-bold text-primary">
                    Confirm Payment
                  </h5>
                </div>
                <div className="card-body">
                  <h5>
                    Total Price: $
                    {enrolledCourses.reduce(
                      (total, course) => total + course.price,
                      0
                    )}
                  </h5>
                  <button
                    className="btn btn-primary"
                    onClick={handlePayment}
                    style={{ padding: "10px 20px", marginTop: "10px" }}
                    disabled={
                      enrolledCourses.length === 0 || isPaymentConfirmed
                    }
                  >
                    {isPaymentConfirmed
                      ? "Payment Confirmed"
                      : "Confirm Payment"}
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
