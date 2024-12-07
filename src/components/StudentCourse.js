import React, { useState, useEffect } from "react";
import axios from "axios";

import CourseTable from "./CourseTable";
import PaymentForm from "./PaymentForm";
import EnrolledView from "./EnrolledView";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const StudentCourse = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrolledSections, setEnrolledSections] = useState([]);
  const [currentView, setCurrentView] = useState("courses");
  const [alreadyEnrolled, setAlreadyEnrolled] = useState([]);

  const toastOptions = {
    position: "top-right",
    autoClose: 3000,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    style: { fontSize: "12px", padding: "8px",zIndex: 9999222222 },
  };
  const showToast = (type, message) => {
    toast.dismiss(); // Clear any existing toasts
    console.log(`Toast triggered: ${type} - ${message}`); // Debugging line
    if (type === "error") {
      toast.error(message, toastOptions);
    } else if (type === "success") {
      toast.success(message, toastOptions);
    }
  };
  const handleRegisterSection = (courseId, section) => {
    console.log(enrolledSections);
    console.log(courseId);
    if (enrolledSections.some((enrolled) => enrolled.courseId === courseId)) {
      showToast("error", "You can only enroll in one section per course.");
      return;
    }

    if (!courseId || !section?._id) {
      console.error("Invalid section data:", { courseId, section });
      toast.error("Invalid section data. Please try again.", toastOptions);
      return;
    }

    setEnrolledSections((prev) => [
      ...prev,
      {
        courseId,
        sectionId: section._id,
        sectionName: section.sectionName,
        instructor: section.instructor?.firstName || "Unknown",
        price: 1000,
      },
    ]);

    toast.success("Section selected successfully!", toastOptions);
  };

  const handleDropSection = (courseId) => {
    setEnrolledSections((prev) =>
      prev.filter((enrolled) => enrolled.courseId !== courseId)
    );

    toast.success("Section unselected successfully!", toastOptions);
  };

  const handlePaymentSuccess = (updatedEnrolledCourses) => {
    setEnrolledSections([]);
    const user = JSON.parse(sessionStorage.getItem("user"));
    user.enrolledCourses = updatedEnrolledCourses;
    sessionStorage.setItem("user", JSON.stringify(user));
    setCurrentView("enrolled");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const coursesResponse = await axios.get(
          "http://localhost:3001/api/courses/all"
        );
        setCourses(coursesResponse.data);

        const user = JSON.parse(sessionStorage.getItem("user"));
        if (user?._id) {
          const enrollmentsResponse = await axios.get(
            `http://localhost:3001/api/student/enrolledClasses/${user._id}`
          );
          setAlreadyEnrolled(enrollmentsResponse.data);
          const currentEnrollments = enrollmentsResponse.data
            .filter((enrollment) => enrollment.courseId && enrollment.sectionId)
            .map((enrollment) => ({
              courseId: enrollment.courseId,
              sectionId: enrollment.sectionId,
            }));
          setEnrolledSections(currentEnrollments);
        }
      } catch (err) {
        setError("Failed to fetch data. Please try again later.");
        toast.error("Failed to fetch data.", toastOptions);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const goTopayments = () => {
    if (enrolledSections.length === 0) {
      toast.error("No courses selected. Please select at least one course to proceed.", toastOptions);
    } else {
      setCurrentView("payment");
    }
  };
  

  if (loading) return <div>Loading courses...</div>;
  if (error) return <div className="text-danger">{error}</div>;

  return (
    <div>
      {currentView === "courses" && (
        <CourseTable
          courses={courses}
          enrolledSections={enrolledSections}
          alreadyEnrolled={alreadyEnrolled}
          onSelect={handleRegisterSection}
          onDrop={handleDropSection}
          onProceedToSchedule={goTopayments}
        />
      )}
      {currentView === "payment" && (
        <PaymentForm
          enrolledSections={enrolledSections}
          courses={courses}
          onSuccess={handlePaymentSuccess}
          onBack={() => setCurrentView("courses")}
        />
      )}
      {currentView === "enrolled" && <EnrolledView />}
      </div>
  );
};

export default StudentCourse;
