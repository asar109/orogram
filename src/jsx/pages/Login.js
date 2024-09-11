import axios from "axios";
import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import ReCAPTCHA from "react-google-recaptcha";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useNavigate, useSearchParams } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Cookies from "universal-cookie";
import logoPrime from "../../images/logo/logo-prime.png";
import { setCurrentUser, userLogin, verifyEmail } from "../../Redux/user";
import axiosInstance from "../../services/AxiosInstance";

function Login(props) {
  const cookies = new Cookies();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const [redrict, setredrict] = useState(false);
  const [remember, setRemember] = useState(false);

  const [recap, setRecap] = useState(false);
  const [checkEmail, setCheckEmail] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [dispplay, setDisplay] = useState(false);
  const [email, setEmail] = useState();
  let errorsObj = { email: "", password: "" };
  const [errors, setErrors] = useState(errorsObj);
  const [password, setPassword] = useState();

  async function onLogin(e) {
    e.preventDefault();

    let error = false;
    const errorObj = { ...errorsObj };
    if (email === "") {
      errorObj.email = "Email is Required";
      error = true;
    }
    if (password === "") {
      errorObj.password = "Password is Required";
      error = true;
    }
    setErrors(errorObj);
    if (error) {
      return;
    }
    let data = {
      email: email,
      password: password,
      remember,
    };
    const res = await dispatch(userLogin(data));

    if (res.payload?.token) {
      axios.defaults.headers[
        "Authorization"
      ] = `Bearer ${res?.payload?.token?.accessToken}`;
      axiosInstance.defaults.headers[
        "Authorization"
      ] = `Bearer ${res?.payload?.token?.accessToken}`;
      const token = res?.payload?.token?.accessToken;
      console.log("🚀 ~ onLogin ~ token:", token);
      cookies.set("token", token);
      dispatch(setCurrentUser(res?.payload?.user));
      if (user?.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/dashboard");
      }
    }
  }
  async function onLoginLoad(email, password) {
    let error = false;
    const errorObj = { ...errorsObj };
    if (email === "") {
      errorObj.email = "Email is Required";
      error = true;
    }
    if (password === "") {
      errorObj.password = "Password is Required";
      error = true;
    }
    setErrors(errorObj);
    if (error) {
      return;
    }
    let data = {
      email: email,
      password: password,
      remember,
    };
    const res = await dispatch(userLogin(data));

    if (res.payload?.token) {
      axios.defaults.headers[
        "Authorization"
      ] = `Bearer ${res?.payload?.token?.accessToken}`;
      axiosInstance.defaults.headers[
        "Authorization"
      ] = `Bearer ${res?.payload?.token?.accessToken}`;
      const token = res?.payload?.token?.accessToken;
      cookies.set("token", token);
      dispatch(setCurrentUser(res?.payload?.user));
      if (user?.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/dashboard");
      }
    }
  }

  const isloadingUser = useSelector((state) => state.userReducer.isloading);

  const [loader, setLoader] = useState(false);
  useEffect(() => {
    if (isloadingUser) {
      setLoader(true);
    } else {
      setLoader(false);
    }
  }, [isloadingUser]);

  useEffect(() => {
    if (cookies.get("token")) {
      navigate("/dashboard");
    } else {
      setDisplay(true);
    }
    if (searchParams.get("email") && searchParams.get("password")) {
      setredrict(true);
    }
  }, []);
  useEffect(() => {
    if (redrict) {
      setEmail(searchParams.get("email"));
      setPassword(searchParams.get("password"));
      onLoginLoad(searchParams.get("email"), searchParams.get("password"));
    }
  }, [redrict]);

  function onChange(value) {
    console.log("Captcha value:", value);
    if (value) {
      setRecap(true);
    }
  }

  return (
    <>
      <ToastContainer />
      {dispplay && (
        <div className="page-wraper">
          <div className="browse-job login-style3 bglogin">
            <div className="bg-img-fix " style={{ height: "100vh" }}>
              <div
                className="row gx-0"
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <div
                  className="col-xl-4 col-lg-5 col-md-6 col-sm-12  bg-white "
                  style={{ overflow: "auto", borderRadius: "25px" }}
                >
                  <div
                    id="mCSB_1"
                    className="mCustomScrollBox mCS-light mCSB_vertical mCSB_inside"
                    style={{ maxHeight: "753px" }}
                  >
                    <div
                      id="mCSB_1_container"
                      className="mCSB_container"
                      style={{
                        position: "relative",
                        top: "0",
                        left: "0",
                        dir: "ltr",
                      }}
                    >
                      <div className="login-form style-2">
                        <div className="card-body">
                          <div className="logo-header">
                            <Link to={"#"} className="logo logombl">
                              <img
                                style={{
                                  width : "150px"
                                }}
                                loading="lazy"
                                src={logoPrime}
                                alt=""
                                className="mCS_img_loaded"
                              />
                            </Link>
                          </div>
                          <div className="nav nav-tabs border-bottom-0">
                            <div
                              className="tab-content w-100"
                              id="nav-tabContent"
                            >
                              <div
                                className="tab-pane fade active show"
                                id="nav-personal"
                              >
                                {props.errorMessage && (
                                  <div className="bg-red-300 text-red-900 border border-red-900 p-1 my-2">
                                    {props.errorMessage}
                                  </div>
                                )}
                                {props.successMessage && (
                                  <div className="bg-green-300 text-green-900 border border-green-900 p-1 my-2">
                                    {props.successMessage}
                                  </div>
                                )}
                                <form
                                  className=" dz-form pb-3"
                                  onSubmit={onLogin}
                                >
                                  {/* <h3 className="form-title m-t0">
                                  Personal Information
                                </h3> */}
                                  <div className="dz-separator-outer m-b5">
                                    <div className="dz-separator bg-primary style-liner"></div>
                                  </div>
                                  <h3 className="form-title">Login</h3>
                                  <div className="form-group mb-3">
                                    <input
                                      type="email"
                                      className="form-control"
                                      placeholder="Email Address"
                                      value={email}
                                      onChange={(e) => setEmail(e.target.value)}
                                    />
                                    {errors.email && (
                                      <div className="text-danger fs-12">
                                        {errors.email}
                                      </div>
                                    )}
                                  </div>
                                  <div className="form-group mb-3">
                                    <input
                                      type="password"
                                      className="form-control"
                                      placeholder="Password"
                                      value={password}
                                      onChange={(e) =>
                                        setPassword(e.target.value)
                                      }
                                    />
                                    {errors.password && (
                                      <div className="text-danger fs-12">
                                        {errors.password}
                                      </div>
                                    )}
                                  </div>
                                  <div className="form-group mb-2">
                                    <ReCAPTCHA
                                      sitekey="6LdfNYslAAAAAMvGb8uMc53mUrRpgxz0y3p6wLCh"
                                      onChange={onChange}
                                    />
                                  </div>
                                  <div className="form-group text-left mb-3">
                                    {!loader && (
                                      <button
                                        type="submit"
                                        style={{ backgroundColor: "#3eacff" }}
                                        className="btn dz-xs-flex m-r5 text-white"
                                        // disabled={!recap}
                                      >
                                        Login
                                      </button>
                                    )}
                                    {loader && (
                                      <div
                                        type="submit"
                                        style={{ backgroundColor: "#3eacff" }}
                                        className="btn dz-xs-flex m-r5 text-white"
                                      >
                                        <Spinner></Spinner>
                                      </div>
                                    )}
                                    <span className="form-check d-inline-block ms-2">
                                      <input
                                        type="checkbox"
                                        // className="form-check-input"
                                        id="check1"
                                        name="example1"
                                        checked={remember}
                                        onChange={() => {
                                          setRemember(!remember);
                                        }}
                                      />

                                      <label
                                        className="form-check-label colorprimary"
                                        htmlFor="check1"
                                        style={{
                                          // fontSize: "12px",
                                          //marginTop: "15px",
                                          color: "grey",
                                          fontWeight: "400",
                                          cursor: "pointer",
                                        }}
                                      >
                                        Remember me
                                      </label>
                                    </span>
                                    <Link to="/page-forgot-password">
                                      <span className="forget colorprimary">
                                        Forgot Password
                                      </span>
                                    </Link>
                                  </div>
                                  <div
                                    className="form-group text-center"
                                    style={{ marginBottom: "5px" }}
                                  >
                                    <span
                                      className="text-muted"
                                      //style={{  }}
                                    >
                                      OR
                                    </span>
                                  </div>
                                </form>

                                <div className="text-center bottom">
                                  <NavLink
                                    to="/page-register"
                                    style={{ backgroundColor: "#3eacff" }}
                                    className="btn text-white button-md btn-block crtacnt"
                                  >
                                    Create an Account
                                  </NavLink>
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
          </div>
        </div>
      )}
    </>
  );
}

export default Login;
