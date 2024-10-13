import React, { useEffect, useState } from "react";
import "../App.css";
import axios from "axios";

const StudentEnrolledClasses = () => {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    // Retrieve user data from sessionStorage
    const userData = sessionStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      // Check if payment array exists and set it to state
      if (user.payment && Array.isArray(user.payment)) {
        setPayments(user.payment);
      }
    }
  }, []);

  const handleDropCourse = async (paymentId) => {
    const userData = sessionStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      const userId = user._id; // Get the user ID from sessionStorage
      
      try {
        // Send DELETE request to drop the course
        const response = await axios.post(`http://localhost:3001/api/user/dropCourse/${userId}`, {
           courseId: paymentId // Send the payment._id as courseId in the body
        });

        if (response.status === 200) {
          // Remove the dropped payment from the state
          setPayments((prevPayments) =>
            prevPayments.filter((payment) => payment._id !== paymentId)
          );

          // Update user data in sessionStorage as well
          user.payment = user.payment.filter((payment) => payment._id !== paymentId);
          sessionStorage.setItem("user", JSON.stringify(user));
          
          alert("Course dropped successfully.");
        }
      } catch (error) {
        console.error("Error dropping the course:", error);
        alert("Failed to drop the course.");
      }
    }
  };

  return (
    <div>
      <div id="page-top">
        <div id="wrapper">
        <ul
            className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion"
            id="accordionSidebar"
          >
            <a
              className="sidebar-brand d-flex align-items-center justify-content-center"
              
            >
              <div className="sidebar-brand-icon rotate-n-15">
                <i className="fas fa-laugh-wink"></i>
              </div>
              <div className="sidebar-brand-text mx-3">
                SB Admin <sup>2</sup>
              </div>
            </a>

            <hr className="sidebar-divider my-0"></hr>

            <li className="nav-item active">
              <a className="nav-link">
                <i className="fas fa-fw fa-tachometer-alt"></i>
                <span>Dashboard</span>
              </a>
            </li>
            <hr className="sidebar-divider"></hr>
            <div className="sidebar-heading">Interface</div>
            <li className="nav-item">
              <a className="nav-link collapsed">
                <i className="fas fa-fw fa-cog"></i>
                <span>All Cources</span>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link collapsed">
                <i className="fas fa-fw fa-wrench"></i>
                <span>Enrolled Classes</span>
              </a>
              <div id="collapseUtilities" className="collapse"></div>
            </li>
            <hr className="sidebar-divider"></hr>
          </ul>

          <div id="content-wrapper" className="d-flex flex-column">
            <div id="content">
            <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
                <button
                  id="sidebarToggleTop"
                  className="btn btn-link d-md-none rounded-circle mr-3"
                >
                  <i className="fa fa-bars"></i>
                </button>
                <form className="d-none d-sm-inline-block form-inline mr-auto ml-md-3 my-2 my-md-0 mw-100 navbar-search">
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control bg-light border-0 small"
                      placeholder="Search for..."
                      aria-label="Search"
                      aria-describedby="basic-addon2"
                    ></input>
                    <div className="input-group-append">
                      <button className="btn btn-primary" type="button">
                        <i className="fas fa-search fa-sm"></i>
                      </button>
                    </div>
                  </div>
                </form>

                <ul className="navbar-nav ml-auto">
                  <div className="topbar-divider d-none d-sm-block"></div>
                  <li className="nav-item dropdown no-arrow">
                    <a>
                      <span className="mr-2 d-none d-lg-inline text-gray-600 small">
                        Douglas McGee
                      </span>
                    </a>
                    <div
                      className="dropdown-menu dropdown-menu-right shadow animated--grow-in"
                      aria-labelledby="userDropdown"
                    >
                      <a className="dropdown-item">
                        <i className="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
                        Profile
                      </a>
                      <a className="dropdown-item">
                        <i className="fas fa-cogs fa-sm fa-fw mr-2 text-gray-400"></i>
                        Settings
                      </a>
                      <a className="dropdown-item">
                        <i className="fas fa-list fa-sm fa-fw mr-2 text-gray-400"></i>
                        Activity Log
                      </a>
                      <div className="dropdown-divider"></div>
                      <a
                        className="dropdown-item"
                        data-toggle="modal"
                        data-target="#logoutModal"
                      >
                        <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                        Logout
                      </a>
                    </div>
                  </li>
                </ul>
              </nav>

              <div className="container-fluid">
                {/* Card to display payments */}
                <div className="card shadow mb-4">
                  <div className="card-header py-3">
                    <h6 className="m-0 font-weight-bold text-primary">
                      Enrolled Classes and Payments
                    </h6>
                  </div>
                  <div className="card-body">
                    {payments.length > 0 ? (
                      <div className="table-responsive">
                        <table className="table table-bordered" width="100%" cellSpacing="0">
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>Course Name</th>
                              <th>Date</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {payments.map((payment, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{payment.courceName}</td>
                                <td>{payment.date}</td>
                                <td>
                                  <button
                                    className="btn btn-danger"
                                    onClick={() => handleDropCourse(payment._id)}
                                  >
                                    Drop Course
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p>No payments found.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* Footer if needed */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentEnrolledClasses;
