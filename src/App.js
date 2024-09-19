import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Lazy load components
const Login = lazy(() => import("./components/Login"));
const Register = lazy(() => import("./components/Register"));
const StudentApplication = lazy(() => import("./components/StudentApplication"));
const InstructorDashBoard = lazy(() => import("./components/InstructorDashBoard"));
const AdminDashBoard = lazy(() => import("./components/AdminDashBoard"));
function App() {
  return (
    <div className="appStyle">
      <Router>
        {/* Suspense to show fallback while components load */}
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/Register" element={<Register />} />
            <Route path="/StudentApplication" element={<StudentApplication />} />
            <Route path="/InstructorDashBoard" element={<InstructorDashBoard />} />
            <Route path="/AdminDashBoard" element={<AdminDashBoard />} />
          </Routes>
        </Suspense>
      </Router>
    </div>
  );
}

export default App;
