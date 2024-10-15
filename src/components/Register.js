import React, { useState } from "react";
import "../App.css";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  sessionStorage.clear();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null); // Reset error state

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      // Make API call to register the student
      const response = await axios.post("http://localhost:3001/api/user/register", {
        username: email,
        password,
        role: "student", // Ensuring only student role is allowed
      });

      if (response.data.message === "User registered successfully.") {
        setSuccess(true);
        setTimeout(() => {
          // Redirect to login after 2 seconds
          navigate("/");
        }, 2000);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <div class="bg-gradient-primary appStyle">
      <div class="container p-1">
        <div class="card o-hidden border-0 shadow-lg my-5">
          <div class="card-body p-0">
            <div class="row">
              <div class="col-lg-5 d-none d-lg-block bg-login-image"></div>
              <div class="col-lg-7">
                <div class="p-5">
                  <div class="text-center">
                    <h1 class="h4 text-gray-900 mb-4">Create an Account!</h1>
                  </div>
                  <form class="user" onSubmit={handleRegister}>
                    <div class="form-group row">
                      <div class="col-sm-6 mb-3 mb-sm-0">
                        <input
                          type="text"
                          class="form-control form-control-user"
                          id="exampleFirstName"
                          placeholder="First Name"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          required
                        />
                      </div>
                      <div class="col-sm-6">
                        <input
                          type="text"
                          class="form-control form-control-user"
                          id="exampleLastName"
                          placeholder="Last Name"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div class="form-group">
                      <input
                        type="email"
                        class="form-control form-control-user"
                        id="exampleInputEmail"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div class="form-group row">
                      <div class="col-sm-6 mb-3 mb-sm-0">
                        <input
                          type="password"
                          class="form-control form-control-user"
                          id="exampleInputPassword"
                          placeholder="Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>
                      <div class="col-sm-6">
                        <input
                          type="password"
                          class="form-control form-control-user"
                          id="exampleRepeatPassword"
                          placeholder="Repeat Password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    {error && <p style={{ color: "red" }}>{error}</p>}
                    {success && <p style={{ color: "green" }}>Registration successful! Redirecting...</p>}
                    <button class="btn btn-primary btn-user btn-block" type="submit">
                      Register Account
                    </button>
                    <hr />
                  </form>
                  <hr />
                  <div class="text-center">
                    <a class="small">
                      <Link to="/">Already have an account? Login!</Link>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
