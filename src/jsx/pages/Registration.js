import React, { Suspense, lazy, useState } from "react";
import { Modal } from "react-bootstrap";
import { FaUserCheck } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { setCurrentUser, userLogin, verifyEmail } from "../../Redux/user";
import countryList from "react-select-country-list";
import Select from "react-select";
import axios from "axios";
import axiosInstance from "../../services/AxiosInstance";
import Cookies from "universal-cookie";
import jwt_decode from "jwt-decode";
// image
import { ToastContainer } from "react-toastify";

import ReCAPTCHA from "react-google-recaptcha";
import { userSignUp } from "../../Redux/user";
import logoPrime from "../../images/logo/logo-prime.png";
import sideImage from "../../images/sideimage.jpg";
import { countryOptions } from "../../utils/countryOptions";
const ImagePopup = lazy(() => import("../components/Popup/ImagePopup"));

function Register(props) {
  const cookies = new Cookies();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [recap, setRecap] = useState(false);
  const [checkEmail, setCheckEmail] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [countryName, setCountryName] = useState("");
  console.log("🚀 ~ Register ~ countryName:", countryName);
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    mobile: "",
    email: "",
    password: "",
    code: "",
    confirm_password: "",
  });

  let errorsObj = {
    firstName: "",
    lastName: "",
    mobile: "",
    email: "",
    password: "",
    code: "",
    confirm_password: "",
  };

  const handleCountryChange = (selectedOption) => {
    setUser({ ...user, code: selectedOption.value });
    setCountryName(selectedOption);
  };

  const [errors, setErrors] = useState(errorsObj);
  const handelChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  function onSignUp(e) {
    e.preventDefault();
    let error = false;
    const errorObj = { ...errorsObj };

    if (!user.email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
      errorObj.email = "Email is not valid";
      error = true;
      setUser({ ...user, password: "", confirm_password: "" });
    }

    if (user.code === "") {
      errorObj.code = "Country code is Required";
      error = true;
    }

    if (user.password === "") {
      errorObj.password = "Password is Required";
      error = true;
    }

    if (user.password.length < 6) {
      errorObj.password = "Password must be more than 6  characters";
      error = true;
    }

    if (user.confirm_password === "") {
      errorObj.confirm_password = "Confirm Password is Required";
      error = true;
    }

    if (user.confirm_password !== user.password) {
      errorObj.confirm_password = "Password and Confirm Password must be same";
      error = true;
    }
    if (user.firstName === "") {
      errorObj.firstName = "First Name is Required";
      error = true;
      setUser({ ...user, password: "", confirm_password: "" });
    }
    if (user.lastName === "") {
      errorObj.lastName = "Last Name is Required";
      error = true;
      setUser({ ...user, password: "", confirm_password: "" });
    }

    if (isNaN(user.mobile)) {
      errorObj.mobile = "Mobile number is Invalid";
      error = true;
      setUser({ ...user, mobile: "" });
    }
    if (user.mobile === "") {
      errorObj.mobile = "Mobile number is Required";
      error = true;
      setUser({ ...user, mobile: "" });
    }

    setErrors(errorObj);
    if (error) return;

    let data = {
      email: user.email,
      password: user.password,
      mobile: `${user.code} ${user.mobile}`,
      firstName: user.firstName,
      lastName: user.lastName,
      platform: "cryptoTrade",
    };

    dispatch(userSignUp(data)).then((res) => {
      if (res?.payload?.status === 201) {
        onLogin();
      }
    });
  }

  function onChange(value) {
    console.log("Captcha value:", value);
    if (value) {
      setRecap(true);
    }
  }
  async function onLogin() {
    let data = {
      email: user.email,
      password: user.password,
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
       } 
     }
  }
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <ImagePopup imageUrl={sideImage} />
      </Suspense>
      <div className="row">
        <div className="col-md-5">
          <div className="page-wraper ">
            <div className="browse-job login-style3">
              <div className="bg-img-fix bglogin">
                <div
                  className="row gx-0"
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                    padding: "2rem",
                  }}
                >
                  <div
                    className="col-xl-4 col-lg-5 col-md-6 col-sm-12 mblvie   bg-white"
                    style={{
                      overflow: "auto",
                      width: "100%",
                      borderRadius: "25px",
                    }}
                  >
                    <div
                      id="mCSB_1"
                      className="mCustomScrollBox mCS-light mCSB_vertical mCSB_inside"
                      style={{ overflow: "auto" }}
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
                          <div className="card-body" style={{ height: "100%" }}>
                            <div className="logo-header mb-3">
                              <Link to="/login" className="logo logombl">
                                <img
                                  style={{
                                    width: "150px",
                                  }}
                                  loading="lazy"
                                  src={logoPrime}
                                  alt=""
                                  className=" mCS_img_loaded"
                                />
                              </Link>
                            </div>
                            <nav className="nav nav-tabs border-bottom-0">
                              <div
                                className="tab-content w-100"
                                id="nav-tabContent"
                              >
                                <div className="tab-pane active show fade">
                                  {props.errorMessage && (
                                    <div className="">{props.errorMessage}</div>
                                  )}
                                  {props.successMessage && (
                                    <div className="">
                                      {props.successMessage}
                                    </div>
                                  )}
                                  <form
                                    className="dz-form py-2"
                                    onSubmit={onSignUp}
                                  >
                                    <h3 className="form-title">Sign Up</h3>
                                    <div className="dz-separator-outer m-b5">
                                      <div className="dz-separator bg-primary style-liner"></div>
                                    </div>
                                    <div
                                      style={{
                                        display: "flex ",
                                        justifyContent: "space-between",
                                      }}
                                    >
                                      <div className="form-group mt-3 box-size ">
                                        <input
                                          name="firstName"
                                          value={user.firstName}
                                          onChange={(e) => handelChange(e)}
                                          className="form-control"
                                          placeholder="First Name"
                                          type="text"
                                        />
                                        {errors.firstName && (
                                          <div className="text-danger fs-12">
                                            {errors.firstName}
                                          </div>
                                        )}
                                      </div>
                                      <div className="form-group mt-3 box-size">
                                        <input
                                          name="lastName"
                                          value={user.lastName}
                                          onChange={(e) => handelChange(e)}
                                          className="form-control"
                                          placeholder="Last Name"
                                          type="text"
                                        />
                                        {errors.lastName && (
                                          <div className="text-danger fs-12">
                                            {errors.lastName}
                                          </div>
                                        )}
                                      </div>
                                    </div>

                                    <div
                                      style={{
                                        display: "flex ",
                                        justifyContent: "space-between",
                                      }}
                                    >
                                      <div className="form-group mt-3 box-size">
                                        <Select
                                          options={countryOptions}
                                          onChange={handleCountryChange}
                                          placeholder="Select Country Code"
                                          styles={{
                                            control: (provided) => ({
                                              ...provided,
                                              width: "100%",
                                              padding: "0.375rem 0.75rem",
                                              border: "1px solid #efefef",
                                              borderRadius: "0.75rem",
                                            }),
                                          }}
                                        />
                                        {errors.code && (
                                          <div className="text-danger fs-12">
                                            {errors.code}
                                          </div>
                                        )}
                                      </div>
                                      <div className="form-group mt-3 box-size">
                                        <input
                                          value={user.mobile}
                                          name="mobile"
                                          onChange={(e) => handelChange(e)}
                                          className="form-control"
                                          placeholder=" 123456789"
                                        />
                                        {errors.mobile && (
                                          <div className="text-danger fs-12">
                                            {errors.mobile}
                                          </div>
                                        )}
                                      </div>
                                    </div>

                                    <div className="form-group mt-3">
                                      <input
                                        type={"email"}
                                        name="email"
                                        value={user.email}
                                        onChange={(e) => handelChange(e)}
                                        className="form-control"
                                        placeholder="email"
                                      />
                                      {errors.email && (
                                        <div className="text-danger fs-12">
                                          {errors.email}
                                        </div>
                                      )}
                                    </div>
                                    <div className="form-group mt-3">
                                      <input
                                        type={"password"}
                                        name="password"
                                        value={user.password}
                                        onChange={(e) => handelChange(e)}
                                        className="form-control"
                                        placeholder="Password"
                                      />
                                      {errors.password && (
                                        <div className="text-danger fs-12">
                                          {errors.password}
                                        </div>
                                      )}
                                    </div>
                                    <div className="form-group mt-3">
                                      <input
                                        type={"password"}
                                        name="confirm_password"
                                        value={user.confirm_password}
                                        onChange={(e) => handelChange(e)}
                                        className="form-control"
                                        placeholder="Confirm password"
                                      />
                                      {errors.confirm_password && (
                                        <div className="text-danger fs-12">
                                          {errors.confirm_password}
                                        </div>
                                      )}
                                    </div>
                                    <div className="form-group mt-2">
                                      <ReCAPTCHA
                                        sitekey="6LdfNYslAAAAAMvGb8uMc53mUrRpgxz0y3p6wLCh"
                                        onChange={onChange}
                                      />
                                    </div>

                                    <div className="mb-3 mt-3">
                                      <label
                                        style={{
                                          fontWeight: "400",
                                          marginTop: "1px",
                                          color: "grey",
                                        }}
                                      >
                                        By Signing up you accept the{" "}
                                        <NavLink
                                          target="_blank"
                                          to="https://www.primecryptoexchange.com/terms-conditions/"
                                          className="colorprimary"
                                          style={{
                                            fontWeight: "400",
                                            color: "grey",
                                          }}
                                        >
                                          Terms & Conditions{" "}
                                        </NavLink>
                                      </label>
                                    </div>
                                    <div className="form-group clearfix text-left">
                                      <NavLink
                                        to="/login"
                                        style={{ backgroundColor: "#3eacff" }}
                                        className="text-white btn outline gray"
                                        type="button"
                                      >
                                        Back
                                      </NavLink>

                                      <button
                                        type="submit"
                                        style={{ backgroundColor: "#3eacff" }}
                                        className="btn text-white float-end"
                                        // disabled={
                                        //   recap ? false : true
                                        // }
                                      >
                                        Register
                                      </button>
                                    </div>
                                  </form>
                                </div>
                              </div>
                            </nav>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Modal
            className="fade"
            show={showModal}
            centered
            onHide={() => setShowModal(false)}
          >
            <Modal.Body>
              <div class="form-group">
                <div className="d-flex justify-content-center">
                  <FaUserCheck size={60} color="#3eacff" />
                </div>
                <div className="d-flex flex-column justify-content-center align-items-center ">
                  <p className="text-center" style={{ fontSize: "14px" }}>
                    <b>
                      Account Created Successfully!
                      <br />
                    </b>
                    Welcome To Orogram
                  </p>
                </div>
              </div>
            </Modal.Body>
          </Modal>
          <ToastContainer />
        </div>
        <div className="col-md-7 imgdiv">
          <img
            style={{
              height: "100vh",
            }}
            loading="lazy"
            src={sideImage}
            alt=""
            className="w-100"
          />
        </div>
      </div>
    </>
  );
}

export default Register;
