import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CourseTable from "./CourseTable";
import ScheduleView from "./ScheduleView";
import PaymentForm from "./PaymentForm";
import EnrolledView from "./EnrolledView";

const StudentCourse = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrolledSections, setEnrolledSections] = useState([]);
  const [currentView, setCurrentView] = useState("courses"); // 'courses', 'schedule', 'payment', 'enrolled'

  const toastOptions = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    style: { fontSize: "12px", padding: "8px" },
  };

  const handleRegisterSection = (courseId, section) => {
    // Check if the student is already enrolled in the course
    if (enrolledSections.some((enrolled) => enrolled.courseId === courseId)) {
      toast.error("You can only enroll in one section per course.", toastOptions);
      return;
    }

    // Retrieve current user enrollment data
    const user = JSON.parse(sessionStorage.getItem("user")) || {};
    const currentEnrollments = (user?.enrolledCourses || []).filter(
      (course) => course?.courseId && course?.sectionId
    );

    // Filter out undefined objects in `enrolledSections`
    const validEnrolledSections = enrolledSections.filter(
      (section) => section?.courseId && section?.sectionId
    );

    console.log("Current Enrollments:", currentEnrollments);
    console.log("Valid Enrolled Sections:", validEnrolledSections);

    // Ensure total enrollments do not exceed 3
    if (currentEnrollments.length + validEnrolledSections.length > 3) {
      toast.error(
        "You can only enroll in a maximum of three courses.",
        toastOptions
      );
      return;
    }

    // Validate section before adding
    if (!courseId || !section?._id) {
      console.error("Invalid section data:", { courseId, section });
      toast.error("Invalid section data. Please try again.", toastOptions);
      return;
    }

    // Add the selected section
    setEnrolledSections((prev) => [
      ...prev,
      {
        courseId,
        sectionId: section._id,
        sectionName: section.sectionName,
        instructor: section.instructor?.username || "Unknown",
        price: 1000, // Fixed price per course
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

        // Fetch current enrollments for the user
        const user = JSON.parse(sessionStorage.getItem("user"));
        if (user?._id) {
          const enrollmentsResponse = await axios.get(
            `http://localhost:3001/api/student/enrolledClasses/${user._id}`
          );
          const currentEnrollments = enrollmentsResponse.data
            .filter(
              (enrollment) => enrollment.courseId && enrollment.sectionId
            ) // Filter invalid entries
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

  if (loading) return <div>Loading courses...</div>;
  if (error) return <div className="text-danger">{error}</div>;

  return (
    <div>
      <ToastContainer />
      {currentView === "courses" && (
        <CourseTable
          courses={courses}
          enrolledSections={enrolledSections}
          onSelect={handleRegisterSection}
          onDrop={handleDropSection}
          onProceedToSchedule={() => setCurrentView("schedule")}
        />
      )}
      {currentView === "schedule" && (
        <ScheduleView
          enrolledSections={enrolledSections}
          courses={courses}
          onBack={() => setCurrentView("courses")}
          onProceedToPayment={() => setCurrentView("payment")}
        />
      )}
      {currentView === "payment" && (
        <PaymentForm
          enrolledSections={enrolledSections}
          courses={courses}
          onSuccess={handlePaymentSuccess}
          onBack={() => setCurrentView("schedule")}
        />
      )}
      {currentView === "enrolled" && <EnrolledView />}
    </div>
  );
};

export default StudentCourse;
