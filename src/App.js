import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Lazy load components
const Login = lazy(() => import("./components/Login"));
const Register = lazy(() => import("./components/Register"));
const StudentDashboard = lazy(() => import("./components/StudentDashboard"));
const InstructorDashBoard = lazy(() => import("./components/InstructorDashBoard"));
const AdminDashBoard = lazy(() => import("./components/AdminDashBoard"));
const StudentEnrolledClasses = lazy(() => import("./components/StudentEnrolledClasses"));
function App() {
  return (
    <div className="appStyle"><ToastContainer />
      <Router>
        {/* Suspense to show fallback while components load */}
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/Register" element={<Register />} />
            <Route path="/StudentDashboard" element={<StudentDashboard />} />
            <Route path="/InstructorDashBoard" element={<InstructorDashBoard />} />
            <Route path="/AdminDashBoard" element={<AdminDashBoard />} />
            <Route path="/StudentEnrolledClasses" element={<StudentEnrolledClasses />} />
          </Routes>
        </Suspense>
      </Router>
    </div>
  );
}

export default App;
