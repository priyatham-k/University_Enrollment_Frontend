import React from "react";
import "../App.css";
function Login() {
  return (
    <div>
      <div class="bg-gradient-primary">
        <div class="container">
          <div class="row justify-content-center">
            <div class="col-xl-10 col-lg-12 col-md-9">
              <div class="card o-hidden border-0 shadow-lg my-5">
                <div class="card-body p-0">
                  <div class="row">
                    <div class="col-lg-6 d-none d-lg-block bg-login-image"></div>
                    <div class="col-lg-6">
                      <div class="p-5">
                        <div class="text-center">
                          <h1 class="h4 text-gray-900 mb-4">Welcome Back!</h1>
                        </div>
                        <form class="user">
                          <div class="form-group">
                            <input
                              type="email"
                              class="form-control form-control-user"
                              id="exampleInputEmail"
                              aria-describedby="emailHelp"
                              placeholder="Enter Email Address..."
                            ></input>
                          </div>
                          <div class="form-group">
                            <input
                              type="password"
                              class="form-control form-control-user"
                              id="exampleInputPassword"
                              placeholder="Password"
                            ></input>
                          </div>
       
                          <a class="btn btn-primary btn-user btn-block">Student Login</a>
                          <hr></hr>
                          <a class="btn btn-google btn-user btn-block">
                            <i class="fab fa-google fa-fw"></i> instructor Login
                          </a>
                          <a class="btn btn-facebook btn-user btn-block">
                            <i class="fab fa-facebook-f fa-fw"></i> Admin Login
                          </a>
                        </form>
                        <hr></hr>
                        <div class="text-center">
                          <a class="small">Forgot Password?</a>
                        </div>
                        <div class="text-center">
                          <a class="small">Create an Account!</a>
                        </div>
                      </div>
                    </div>
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

export default Login;
