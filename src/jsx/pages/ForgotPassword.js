import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logoPrime from "../../images/logo/logo-prime.png";
// image
import logo from "../../images/logo/logo-full.png";
import bg6 from "../../images/background/bg6.jpg";
import { useDispatch } from "react-redux";
import { forgotPassword } from "../../Redux/user";
import { ToastContainer, toast } from "react-toastify";

const ForgotPassword = ({ history }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(forgotPassword({ email: email, type: "forgot" })).then((res) => {
      if (res) {
        // call after 1 second
        setTimeout(() => {
          navigate("/login");
        }, 2000);

      }
    });

  };

  const handelChange = (e) => {
    e.preventDefault();
    setEmail(e.target.value);
  };

  return (
    <div className="page-wraper">
      <div className="browse-job login-style3">
        <div
        // className="bg-img-fix overflow-hidden"
        // style={{ backgroundColor: "white" }}
        >
          <div className="authincation h-100 p-meddle frgtbf">
            <div className="container h-100">
              <div className="row justify-content-center h-100 align-items-center">
                <div className="col-md-6">
                  <div
                    className="authincation-content"
                    style={{ borderRadius: "25px" }}
                  >
                    <div className="row no-gutters">
                      <div className="col-xl-12">
                        <div className="auth-form">
                          <div className="text-center mb-3">
                            <Link to="/login">
                              <img loading="lazy" src={logoPrime} alt="" />
                            </Link>
                          </div>
                          <h4
                            className="text-center mb-4 "
                            style={{ color: "black" }}
                          >
                            Forgot Password
                          </h4>
                          <form onSubmit={(e) => onSubmit(e)}>
                            <div className="form-group">
                              <label className="">
                                <strong style={{ color: "black" }}>
                                  Email
                                </strong>
                              </label>
                              <input
                                type="email"
                                value={email}
                                className="form-control"
                                onChange={(e) => handelChange(e)}
                              />
                            </div>
                            <div
                              className="text-center"
                              style={{ marginTop: "1rem" }}
                            >
                              <button
                                type="submit"
                                style={{ backgroundColor: "#3eacff" }}
                                className="btn text-white btn-block"
                              >
                                SUBMIT
                              </button>
                            </div>
                          </form>
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
      <ToastContainer></ToastContainer>
    </div>
  );
};

export default ForgotPassword;
