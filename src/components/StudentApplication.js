import React, { useState } from "react";
import "../App.css";import axios from "axios";
function Dashboard() {
  const [formData, setFormData] = useState({
    studentName: "",
    degreeProgram: "",
    major: "",
    contactEmail: "",
    contactPhone: "",
    season: "",
    englishTest: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const validateForm = () => {
    let formErrors = {};
    if (!formData.studentName) formErrors.studentName = "Full name is required";
    if (!formData.degreeProgram) formErrors.degreeProgram = "Degree program is required";
    if (!formData.major) formErrors.major = "Major is required";
    if (!formData.contactEmail) formErrors.contactEmail = "Email is required";
    if (!formData.contactPhone) formErrors.contactPhone = "Phone is required";
    if (!formData.season) formErrors.season = "Please select a season";
    if (!formData.englishTest) formErrors.englishTest = "Please select an English test";
    return formErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      try {
        const response = await axios.post("http://localhost:3001/api/submitapplication/submit", formData);
        if (response.status === 200) {
          alert("Application submitted successfully");
        } else {
          alert("Failed to submit the application");
        }
      } catch (error) {
        console.error("Error submitting form", error);
        alert("Error occurred while submitting");
      }
    }
  };
  return (
    <div>
      <div id="page-top">
        <div id="wrapper">
          <ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">
            <a className="sidebar-brand d-flex align-items-center justify-content-center" href="index.html">
              <div className="sidebar-brand-icon rotate-n-15">
                <i className="fas fa-laugh-wink"></i>
              </div>
              <div className="sidebar-brand-text mx-3">
                SB Admin <sup>2</sup>
              </div>
            </a>

            <hr className="sidebar-divider my-0"></hr>

            <li className="nav-item active">
              <a className="nav-link" href="index.html">
                <i className="fas fa-fw fa-tachometer-alt"></i>
                <span>Dashboard</span>
              </a>
            </li>

            <hr className="sidebar-divider"></hr>

            <div className="sidebar-heading">Interface</div>

            <li className="nav-item">
              <a
                className="nav-link collapsed"
                href="#"
                data-toggle="collapse"
                data-target="#collapseTwo"
                aria-expanded="true"
                aria-controls="collapseTwo"
              >
                <i className="fas fa-fw fa-cog"></i>
                <span>Components</span>
              </a>
              <div id="collapseTwo" className="collapse" aria-labelledby="headingTwo" data-parent="#accordionSidebar">
                <div className="bg-white py-2 collapse-inner rounded">
                  <h6 className="collapse-header">Custom Components:</h6>
                  <a className="collapse-item" href="buttons.html">
                    Buttons
                  </a>
                  <a className="collapse-item" href="cards.html">
                    Cards
                  </a>
                </div>
              </div>
            </li>

            <li className="nav-item">
              <a
                className="nav-link collapsed"
                href="#"
                data-toggle="collapse"
                data-target="#collapseUtilities"
                aria-expanded="true"
                aria-controls="collapseUtilities"
              >
                <i className="fas fa-fw fa-wrench"></i>
                <span>Utilities</span>
              </a>
              <div id="collapseUtilities" className="collapse" aria-labelledby="headingUtilities" data-parent="#accordionSidebar">
                <div className="bg-white py-2 collapse-inner rounded">
                  <h6 className="collapse-header">Custom Utilities:</h6>
                  <a className="collapse-item" href="utilities-color.html">
                    Colors
                  </a>
                  <a className="collapse-item" href="utilities-border.html">
                    Borders
                  </a>
                  <a className="collapse-item" href="utilities-animation.html">
                    Animations
                  </a>
                  <a className="collapse-item" href="utilities-other.html">
                    Other
                  </a>
                </div>
              </div>
            </li>
            <hr className="sidebar-divider"></hr>
            <div className="sidebar-heading">Addons</div>
            <li className="nav-item">
              <a
                className="nav-link collapsed"
                href="#"
                data-toggle="collapse"
                data-target="#collapsePages"
                aria-expanded="true"
                aria-controls="collapsePages"
              >
                <i className="fas fa-fw fa-folder"></i>
                <span>Pages</span>
              </a>
              <div id="collapsePages" className="collapse" aria-labelledby="headingPages" data-parent="#accordionSidebar">
                <div className="bg-white py-2 collapse-inner rounded">
                  <h6 className="collapse-header">Login Screens:</h6>
                  <a className="collapse-item" href="login.html">
                    Login
                  </a>
                  <a className="collapse-item" href="register.html">
                    Register
                  </a>
                  <a className="collapse-item" href="forgot-password.html">
                    Forgot Password
                  </a>
                  <div className="collapse-divider"></div>
                  <h6 className="collapse-header">Other Pages:</h6>
                  <a className="collapse-item" href="404.html">
                    404 Page
                  </a>
                  <a className="collapse-item" href="blank.html">
                    Blank Page
                  </a>
                </div>
              </div>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="charts.html">
                <i className="fas fa-fw fa-chart-area"></i>
                <span>Charts</span>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="tables.html">
                <i className="fas fa-fw fa-table"></i>
                <span>Tables</span>
              </a>
            </li>
          </ul>
          <div id="content-wrapper" className="d-flex flex-column">
            <div id="content">
              <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
                <button id="sidebarToggleTop" className="btn btn-link d-md-none rounded-circle mr-3">
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
                  <li className="nav-item dropdown no-arrow d-sm-none">
                    <a
                      className="nav-link dropdown-toggle"
                      href="#"
                      id="searchDropdown"
                      role="button"
                      data-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      <i className="fas fa-search fa-fw"></i>
                    </a>
                    <div
                      className="dropdown-menu dropdown-menu-right p-3 shadow animated--grow-in"
                      aria-labelledby="searchDropdown"
                    >
                      <form className="form-inline mr-auto w-100 navbar-search">
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
                    </div>
                  </li>

                  <li className="nav-item dropdown no-arrow mx-1">
                    <a
                      className="nav-link dropdown-toggle"
                      href="#"
                      id="alertsDropdown"
                      role="button"
                      data-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      <i className="fas fa-bell fa-fw"></i>
                      <span className="badge badge-danger badge-counter">3+</span>
                    </a>
                    <div
                      className="dropdown-list dropdown-menu dropdown-menu-right shadow animated--grow-in"
                      aria-labelledby="alertsDropdown"
                    >
                      <h6 className="dropdown-header">Alerts Center</h6>
                      <a className="dropdown-item d-flex align-items-center" href="#">
                        <div className="mr-3">
                          <div className="icon-circle bg-primary">
                            <i className="fas fa-file-alt text-white"></i>
                          </div>
                        </div>
                        <div>
                          <div className="small text-gray-500">December 12, 2019</div>
                          <span className="font-weight-bold">A new monthly report is ready to download!</span>
                        </div>
                      </a>
                      <a className="dropdown-item d-flex align-items-center" href="#">
                        <div className="mr-3">
                          <div className="icon-circle bg-success">
                            <i className="fas fa-donate text-white"></i>
                          </div>
                        </div>
                        <div>
                          <div className="small text-gray-500">December 7, 2019</div>
                          $290.29 has been deposited into your account!
                        </div>
                      </a>
                      <a className="dropdown-item d-flex align-items-center" href="#">
                        <div className="mr-3">
                          <div className="icon-circle bg-warning">
                            <i className="fas fa-exclamation-triangle text-white"></i>
                          </div>
                        </div>
                        <div>
                          <div className="small text-gray-500">December 2, 2019</div>
                          Spending Alert: We've noticed unusually high spending for your account.
                        </div>
                      </a>
                      <a className="dropdown-item text-center small text-gray-500" href="#">
                        Show All Alerts
                      </a>
                    </div>
                  </li>

                  <li className="nav-item dropdown no-arrow mx-1">
                    <a
                      className="nav-link dropdown-toggle"
                      href="#"
                      id="messagesDropdown"
                      role="button"
                      data-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      <i className="fas fa-envelope fa-fw"></i>
                      <span className="badge badge-danger badge-counter">7</span>
                    </a>
                    <div
                      className="dropdown-list dropdown-menu dropdown-menu-right shadow animated--grow-in"
                      aria-labelledby="messagesDropdown"
                    >
                      <h6 className="dropdown-header">Message Center</h6>
                      <a className="dropdown-item d-flex align-items-center" href="#">
                        <div className="dropdown-list-image mr-3">
                          <img className="rounded-circle" src="img/undraw_profile_1.svg" alt="..."></img>
                          <div className="status-indicator bg-success"></div>
                        </div>
                        <div className="font-weight-bold">
                          <div className="text-truncate">
                            Hi there! I am wondering if you can help me with a problem I've been having.
                          </div>
                          <div className="small text-gray-500">Emily Fowler · 58m</div>
                        </div>
                      </a>
                      <a className="dropdown-item d-flex align-items-center" href="#">
                        <div className="dropdown-list-image mr-3">
                          <img className="rounded-circle" src="img/undraw_profile_2.svg" alt="..."></img>
                          <div className="status-indicator"></div>
                        </div>
                        <div>
                          <div className="text-truncate">
                            I have the photos that you ordered last month, how would you like them sent to you?
                          </div>
                          <div className="small text-gray-500">Jae Chun · 1d</div>
                        </div>
                      </a>
                      <a className="dropdown-item d-flex align-items-center" href="#">
                        <div className="dropdown-list-image mr-3">
                          <img className="rounded-circle" src="img/undraw_profile_3.svg" alt="..."></img>
                          <div className="status-indicator bg-warning"></div>
                        </div>
                        <div>
                          <div className="text-truncate">
                            Last month's report looks great, I am very happy with the progress so far, keep up the good work!
                          </div>
                          <div className="small text-gray-500">Morgan Alvarez · 2d</div>
                        </div>
                      </a>
                      <a className="dropdown-item d-flex align-items-center" href="#">
                        <div className="dropdown-list-image mr-3">
                          <img className="rounded-circle" src="https://source.unsplash.com/Mv9hjnEUHR4/60x60" alt="..."></img>
                          <div className="status-indicator bg-success"></div>
                        </div>
                        <div>
                          <div className="text-truncate">
                            Am I a good boy? The reason I ask is because someone told me that people say this to all dogs, even if
                            they aren't good...
                          </div>
                          <div className="small text-gray-500">Chicken the Dog · 2w</div>
                        </div>
                      </a>
                      <a className="dropdown-item text-center small text-gray-500" href="#">
                        Read More Messages
                      </a>
                    </div>
                  </li>

                  <div className="topbar-divider d-none d-sm-block"></div>

                  <li className="nav-item dropdown no-arrow">
                    <a>
                      <span className="mr-2 d-none d-lg-inline text-gray-600 small">Douglas McGee</span>
                    </a>
                    <div className="dropdown-menu dropdown-menu-right shadow animated--grow-in" aria-labelledby="userDropdown">
                      <a className="dropdown-item" href="#">
                        <i className="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
                        Profile
                      </a>
                      <a className="dropdown-item" href="#">
                        <i className="fas fa-cogs fa-sm fa-fw mr-2 text-gray-400"></i>
                        Settings
                      </a>
                      <a className="dropdown-item" href="#">
                        <i className="fas fa-list fa-sm fa-fw mr-2 text-gray-400"></i>
                        Activity Log
                      </a>
                      <div className="dropdown-divider"></div>
                      <a className="dropdown-item" href="#" data-toggle="modal" data-target="#logoutModal">
                        <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                        Logout
                      </a>
                    </div>
                  </li>
                </ul>
              </nav>

              <div className="container-fluid">
                <div class="container mt-5">
                  <h2 class="text-center mb-4">Graduation Application Form</h2>
                  <form onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label htmlFor="studentName">Full Name</label>
                      <input
                        type="text"
                        className="form-control"
                        id="studentName"
                        value={formData.studentName}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                      />
                      {errors.studentName && <span className="error">{errors.studentName}</span>}
                    </div>

                    <div className="form-group">
                      <label htmlFor="degreeProgram">Degree Program</label>
                      <input
                        type="text"
                        className="form-control"
                        id="degreeProgram"
                        value={formData.degreeProgram}
                        onChange={handleChange}
                        placeholder="Enter your degree program"
                      />
                      {errors.degreeProgram && <span className="error">{errors.degreeProgram}</span>}
                    </div>

                    <div className="form-group">
                      <label htmlFor="major">Major</label>
                      <input
                        type="text"
                        className="form-control"
                        id="major"
                        value={formData.major}
                        onChange={handleChange}
                        placeholder="Enter your major"
                      />
                      {errors.major && <span className="error">{errors.major}</span>}
                    </div>

                    <div className="form-group">
                      <label htmlFor="contactEmail">Email Address</label>
                      <input
                        type="email"
                        className="form-control"
                        id="contactEmail"
                        value={formData.contactEmail}
                        onChange={handleChange}
                        placeholder="Enter your email address"
                      />
                      {errors.contactEmail && <span className="error">{errors.contactEmail}</span>}
                    </div>

                    <div className="form-group">
                      <label htmlFor="contactPhone">Phone Number</label>
                      <input
                        type="tel"
                        className="form-control"
                        id="contactPhone"
                        value={formData.contactPhone}
                        onChange={handleChange}
                        placeholder="Enter your phone number"
                      />
                      {errors.contactPhone && <span className="error">{errors.contactPhone}</span>}
                    </div>

                    <div className="form-group">
                      <label htmlFor="season">Which season will you be applying?</label>
                      <select className="form-control" id="season" value={formData.season} onChange={handleChange}>
                        <option value="">Select season</option>
                        <option value="Spring 2025">Spring 2025</option>
                        <option value="Summer 1 2025">Summer 1 2025</option>
                        <option value="Summer 2 2025">Summer 2 2025</option>
                        <option value="Fall 2025">Fall 2025</option>
                        <option value="Spring 2026">Spring 2026</option>
                      </select>
                      {errors.season && <span className="error">{errors.season}</span>}
                    </div>

                    <div className="form-group">
                      <label htmlFor="englishTest">English Test</label>
                      <select className="form-control" id="englishTest" value={formData.englishTest} onChange={handleChange}>
                        <option value="">Select test</option>
                        <option value="TOEFL">TOEFL</option>
                        <option value="IELTS">IELTS</option>
                        <option value="Duolingo">Duolingo</option>
                      </select>
                      {errors.englishTest && <span className="error">{errors.englishTest}</span>}
                    </div>

                    <button type="submit" className="btn btn-primary">
                      Submit Application
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        <a className="scroll-to-top rounded" href="#page-top">
          <i className="fas fa-angle-up"></i>
        </a>
      </div>
    </div>
  );
}

export default Dashboard;
