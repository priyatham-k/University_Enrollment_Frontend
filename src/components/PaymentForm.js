import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PaymentForm = ({ enrolledSections, courses, onSuccess, onBack }) => {
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: "",
    cardExpiry: "",
    cardCVV: "",
  });

  const toastOptions = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    style: { fontSize: "12px", padding: "8px" },
  };

  // Clean the enrolledSections array by filtering out undefined or empty objects
  const filteredEnrolledSections = enrolledSections.filter(
    (section) => section && section.courseId && section.sectionId
  );

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails((prev) => ({ ...prev, [name]: value }));
  };

  const validatePaymentDetails = () => {
    const { cardNumber, cardExpiry, cardCVV } = paymentDetails;

    if (!/^\d{16}$/.test(cardNumber)) {
      toast.error("Invalid card number. It must be 16 digits.", toastOptions);
      return false;
    }

    if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
      toast.error("Invalid expiry date. Use MM/YY format.", toastOptions);
      return false;
    }

    if (!/^\d{3}$/.test(cardCVV)) {
      toast.error("Invalid CVV. It must be 3 digits.", toastOptions);
      return false;
    }

    return true;
  };

  const handlePayment = async () => {
    if (!validatePaymentDetails()) return;

    const totalCost = filteredEnrolledSections.reduce(
      (total, section) => total + section.price,
      0
    );

    try {
      const user = JSON.parse(sessionStorage.getItem("user"));
      const userId = user._id;

      const paymentPayload = {
        userId,
        totalAmount: totalCost,
        paymentDetails,
        courses: filteredEnrolledSections.map((section) => ({
          courseId: section.courseId,
          sectionId: section.sectionId,
          amount: section.price,
        })),
      };

      const response = await axios.post(
        "http://localhost:3001/api/payments/process",
        paymentPayload
      );

      // Update session storage and notify the parent component
      user.enrolledCourses = response.data.enrolledCourses;
      sessionStorage.setItem("user", JSON.stringify(user));

      toast.success("Payment successful!", toastOptions);
      onSuccess(filteredEnrolledSections);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Payment failed.",
        toastOptions
      );
    }
  };

  const renderSelectedCourses = () => {
    return filteredEnrolledSections.map((section) => {
      const course = courses.find((course) => course._id === section.courseId);
      return (
        <li key={section.sectionId} style={{ fontSize: "12px", marginBottom: "8px" }}>
          <strong>{course?.courseName}</strong> - {section.sectionName} (Instructor: {section.instructor})
        </li>
      );
    });
  };

  const totalAmount = filteredEnrolledSections.reduce(
    (total, section) => total + section.price,
    0
  );

  return (
    <>
      
      <div className="card shadow mb-4" style={{ fontSize: "12px" }}>
        <div className="card-header py-3 text-left">
          <h5
            className="m-0 font-weight-bold text-primary"
            style={{ fontSize: "12px" }}
          >
            Payment
          </h5>
        </div>
        <div className="card-body">
          <div className="mb-3">
            <h6><b>Selected Courses:</b></h6>
            <ul style={{ paddingLeft: "16px" }}>{renderSelectedCourses()}</ul>
            <p style={{ fontWeight: "bold" }}>Total: ${totalAmount.toFixed(2)}</p>
          </div>
          <form>
            <div className="form-group">
              <label htmlFor="cardNumber">Card Number</label>
              <input
                type="text"
                id="cardNumber"
                name="cardNumber"
                value={paymentDetails.cardNumber}
                onChange={handlePaymentChange}
                className="form-control form-control-sm"
                placeholder="Enter 16-digit card number"
              />
            </div>
            <div className="form-group">
              <label htmlFor="cardExpiry">Expiry Date (MM/YY)</label>
              <input
                type="text"
                id="cardExpiry"
                name="cardExpiry"
                value={paymentDetails.cardExpiry}
                onChange={handlePaymentChange}
                className="form-control form-control-sm"
                placeholder="MM/YY"
              />
            </div>
            <div className="form-group">
              <label htmlFor="cardCVV">CVV</label>
              <input
                type="text"
                id="cardCVV"
                name="cardCVV"
                value={paymentDetails.cardCVV}
                onChange={handlePaymentChange}
                className="form-control form-control-sm"
                placeholder="Enter CVV"
              />
            </div>
          </form>
          <div className="d-flex justify-content-between">
            <button
              className="btn btn-secondary"
              onClick={onBack}
              style={{ fontSize: "12px" }}
            >
              Back to Schedule
            </button>
            <button
              className="btn btn-primary"
              onClick={handlePayment}
              style={{ fontSize: "12px" }}
            >
              Confirm Payment
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentForm;
