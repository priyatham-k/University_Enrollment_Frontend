import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../App.css"; // Adjust the path as needed

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student"); // Default role
  const [error, setError] = useState(null);
  const [validationError, setValidationError] = useState("");
  const navigate = useNavigate();

  const validateInputs = () => {
    if (!email || !password) {
      setValidationError("Email and Password are required.");
      return false;
    }
    setValidationError("");
    return true;
  };

  const handleLogin = async () => {
    // Clear session and error messages
    sessionStorage.clear();
    setError(null);

    if (!validateInputs()) return;

    try {
      let response;

      // Determine API endpoint based on role
      const endpoint =
        role === "instructor"
          ? "http://localhost:3001/api/instructors/login"
          : role === "admin"
          ? "http://localhost:3001/api/admin/login"
          : "http://localhost:3001/api/student/login";

      response = await axios.post(endpoint, {
        email,
        password,
      });

      if (response.status === 200 && response.data.user) {
        sessionStorage.setItem("user", JSON.stringify(response.data.user));

        // Navigate based on the role
        if (role === "student") {
          navigate("/StudentDashboard");
        } else if (role === "instructor") {
          navigate("/InstructorDashBoard");
        } else if (role === "admin") {
          navigate("/AdminDashboard");
        }
      } else {
        setError(response.data.message || "An error occurred during login.");
      }
    } catch (err) {
      setError("Failed to login. Please check your credentials.");
    }
  };

  return (
    <div
      style={{
        background: "#0D3B66",
        height: "100vh",
        fontFamily: "Arial, sans-serif",
        fontSize: "12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "#fff",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
          borderRadius: "10px",
          width: "800px",
          display: "flex",
          overflow: "hidden",
        }}
      >
        {/* Left side: Background Image */}
        <div
          className="bg-login-image"
          style={{
            width: "50%",
          }}
        ></div>

        {/* Right side: Login Form */}
        <div style={{ width: "50%", padding: "20px" }}>
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <h1
              style={{
                color: "#0D3B66",
                fontSize: "16px",
                marginBottom: "10px",
              }}
            >
              Welcome to the University Portal
            </h1>
            <p style={{ color: "#333", margin: 0 }}>
              Please log in to manage your account
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
          >
            {" "}
            <div style={{ marginBottom: "15px" }}>
              <select
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                  fontSize: "12px",
                  backgroundColor: "#fff",
                }}
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="student">I'm a Student</option>
                <option value="instructor">I'm an Instructor</option>
                <option value="admin">I'm an Admin</option>
              </select>
            </div>
            <div style={{ marginBottom: "15px" }}>
              <input
                type="email"
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                  fontSize: "12px",
                }}
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div style={{ marginBottom: "15px" }}>
              <input
                type="password"
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                  fontSize: "12px",
                }}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {validationError && (
              <p
                style={{ color: "red", fontSize: "12px", marginBottom: "15px" }}
              >
                {validationError}
              </p>
            )}
            {error && (
              <p
                style={{ color: "red", fontSize: "12px", marginBottom: "15px" }}
              >
                {error}
              </p>
            )}
            <button
              type="submit"
              style={{
                width: "100%",
                padding: "10px",
                background: "#007EA7",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                fontSize: "12px",
                cursor: "pointer",
              }}
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
