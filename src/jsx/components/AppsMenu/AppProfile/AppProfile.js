import React, { Fragment, useEffect, useState } from "react";
import {
  Button
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
// import styles
import "lightgallery/css/lg-thumbnail.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lightgallery.css";

//** Import Image */
//** Import Image */
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import Cookies from "universal-cookie";
import { getBankDetails, resetCurrentUser } from "../../../../Redux/user";
import profile02 from "../../../../images/profile/2.jpg";
import profile03 from "../../../../images/profile/3.jpg";
import profile04 from "../../../../images/profile/4.jpg";
import axiosInstance from "../../../../services/AxiosInstance";
import { errorMessage, successMessage } from "../../../../utils/message";
import PageTitle from "../../../layouts/PageTitle";

const galleryBlog = [
  { image: profile03 },
  { image: profile04 },
  { image: profile02 },
  { image: profile04 },
  { image: profile03 },
  { image: profile02 },
];
const optionsSelect = [
  { value: "Ethereum (ERC-20)", label: "Ethereum (ERC-20)" },
  {
    value: "Binance Smart Chain (BEP-20)",
    label: "Binance Smart Chain (BEP-20)",
  },
  { value: "Tron (TRC-20)", label: "Tron (TRC-20)" },
];

// const initialState = false;
// const reducer = (state, action) => {
//   switch (action.type) {
//     case "sendMessage":
//       return { ...state, sendMessage: !state.sendMessage };
//     case "postModal":
//       return { ...state, post: !state.post };
//     case "linkModal":
//       return { ...state, link: !state.link };
//     case "cameraModal":
//       return { ...state, camera: !state.camera };
//     case "replyModal":
//       return { ...state, reply: !state.reply };
//     default:
//       return state;
//   }
// };

const AppProfile = () => {
  const cookies = new Cookies();
  let navigate = useNavigate();
  const dispatch = useDispatch();
  const userReducer = useSelector((store) => store.userReducer);
  const [profile, setProfile] = useState({
    user_name: "",
    first_name: "",
    last_name: "",
    contact: "",
    email: "",
    emailCheck: true,
  });
  const [bankinfo, setBankInfo] = useState({
    bank_name: "",
    account_number: "",
    bic_swift: "",
    usdt_payout: "",
    account_holder: "",
    network: "",
    confirm_account_no: "",
  });
  const [profilePassword, setProfilePassword] = useState({
    oldPassword: "",
    newPassword: "",
    passwordCheck: true,
  });
  const getData = async () => {
    let res = await dispatch(getBankDetails(userReducer?.currentUser?.id));
    console.log("get details,", res);
    let response = {
      bank_name: res.payload ? res.payload.bank_name : "",
      account_number: res.payload ? res.payload.account_number : "",
      confirm_account_no: res.payload ? res.payload.account_number : "",
      usdt_payout: res.payload ? res.payload.usdt_payout : "",
      bic_swift: res.payload ? res.payload.bic_swift : "",
      account_holder: res.payload ? res.payload.account_holder : "",
      network: res.payload
        ? { value: res.payload.network, label: res.payload.network }
        : "",
    };
    setBankInfo(response);
  };
  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    console.log("data===", userReducer.currentUser);
    setProfile({
      ...profile,
      first_name: userReducer.currentUser.first_name,
      last_name: userReducer.currentUser.last_name,
      user_name: userReducer.currentUser.user_name,
      contact: userReducer.currentUser.contact || "",
      email: userReducer.currentUser.email,
      emailCheck: true,
    });
  }, [userReducer.currentUser]);

  const handelChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };
  const handelChangeBankInfo = (e) => {
    setBankInfo({ ...bankinfo, [e.target.name]: e.target.value });
  };
  const handelChangeBankInfoDrop = (e) => {
    setBankInfo({ ...bankinfo, network: e });
  };

  const onInit = () => {
    //console.log('lightGallery has been initialized');
  };
  const options = {
    settings: {
      overlayColor: "#000000",
    },
  };

  const validatePassword = (text) => {
    let reg =
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[,./#?!@$%^&*-]).{8,}$/;
    if (reg.test(text) === false) {
      return false;
    } else {
      return true;
    }
  };

  const updatePasswordField = (e) => {
    const result = validatePassword(e);
    if (result) {
      console.log("Password is Valid ");
    } else {
      console.log("Password is invalid ");
    }

    setProfilePassword({
      ...profilePassword,
      newPassword: e,
    });
  };

  const focusChangePassword = () => {
    const result = validatePassword(profilePassword.newPassword);

    setProfilePassword({
      ...profilePassword,
      passwordCheck: result,
    });
  };
  function onLogout() {
    dispatch(resetCurrentUser());
    cookies.remove("token");
    navigate("/login");
  }
  const updatePassword = async (e) => {
    e.preventDefault();

    const postData = {
      password: profilePassword.oldPassword,
      new_password: profilePassword.newPassword,
    };
    console.log("postData", postData);
    axiosInstance
      .put(
        `api/profile/passwordchange/${userReducer?.currentUser?.id}`,
        postData
      )
      .then((res) => {
        console.log(res, "res");
        successMessage("Password Updated Successfully");
        //onLogout();
      })
      .catch((err) => {
        console.log("err", err.response.data);
        errorMessage(`❌ ${err.response.data}!`);
      });
  };
  //   const [state, dispatch] = useReducer(reducer, initialState);
  const validateEmail = (text) => {
    let reg = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w\w+)+$/;
    if (reg.test(text) === false) {
      return false;
    } else {
      return true;
    }
  };

  const focusChangeEmail = () => {
    const result = validateEmail(profile.email);
    setProfile({
      ...profile,
      emailCheck: result,
    });
  };
  const updateInfo = async (e) => {
    e.preventDefault();
    const postData = {
      user_name: profile.user_name,
      first_name: profile.first_name,
      last_name: profile.last_name,
      contact: profile.contact,
      email: profile.email,
    };
    console.log("postData", postData);
    if (profile.contact === "") {
      delete postData["contact"];
    }
    axiosInstance
      .put(`api/profile/${userReducer?.currentUser?.id}`, postData)
      .then((res) => {
        console.log(res, "res");
        successMessage("Profile Updated Successfully");
        //onLogout();
      })
      .catch((err) => {
        console.log("err", err.response.data);
        errorMessage(`❌ ${err.response.data}!`);
      });
  };
  const updateBankInfo = async (e) => {
    e.preventDefault();
    
    if (bankinfo.account_number !== bankinfo.confirm_account_no) {
      errorMessage(`❌ Please confirm your account no`);
      return;
    }
    const postData = {
      bank_name: bankinfo.bank_name,
      account_number: bankinfo.account_number,
      bic_swift: bankinfo.bic_swift,
     
      user_id: userReducer?.currentUser?.id,
      account_holder: bankinfo.account_holder,
      
    };
    console.log("postData", postData);
    axiosInstance
      .put(`api/bankdetail/${userReducer?.currentUser?.id}`, postData)
      .then((res) => {
        console.log(res, "res");
        successMessage("Bank Info Updated Successfully");
        getData();
      })
      .catch((err) => {
        console.log("err", err.response.data);
        errorMessage(`❌ ${err.response.data}!`);
      });
  };
  const updateUSDTInfo = async (e) => {
    e.preventDefault();
    if (bankinfo.usdt_payout === "0x0000000000000000000000000000000000000000") {
      errorMessage("❌ Please Enter a valid USDT Payout Address");
      return;
    }
    
    const postData = {
      usdt_payout: bankinfo.usdt_payout,
      network: bankinfo?.network?.value,
      user_id: userReducer?.currentUser?.id,
    };
    console.log("postData", postData);
    axiosInstance
      .put(`api/bankdetail/${userReducer?.currentUser?.id}`, postData)
      .then((res) => {
        console.log(res, "res");
        successMessage("Bank Info Updated Successfully");
        getData();
      })
      .catch((err) => {
        console.log("err", err.response.data);
        errorMessage(`❌ ${err.response.data}!`);
      });
  };
  return (
    <Fragment>
      <PageTitle activeMenu="Profile" motherMenu="Dashboard" />

      <div className="pt-3">
        <div className="settings-form">
          <h4 className="text-primary">Update Profile</h4>
          <form onSubmit={(e) => updateInfo(e)}>
            <div className="row">
              <div className="form-group mb-3 col-md-6">
                <label className="form-label">First Name</label>
                <input
                  type="text"
                  value={profile.first_name}
                  name="first_name"
                  onChange={(e) => handelChange(e)}
                  placeholder="first name"
                  className="form-control"
                />
              </div>
              <div className="form-group mb-3 col-md-6">
                <label className="form-label">Last Name</label>
                <input
                  type="text"
                  value={profile.last_name}
                  name="last_name"
                  onChange={(e) => handelChange(e)}
                  placeholder="last name"
                  className="form-control"
                />
              </div>
            </div>
            <div className="form-group mb-3">
              <label className="form-label">User Name</label>
              <input
                type="text"
                name="user_name"
                value={profile.user_name}
                onChange={(e) => handelChange(e)}
                placeholder="user name"
                className="form-control"
              />
            </div>
            <div className="form-group mb-3">
              <label className="form-label">Phone Number</label>
              <input
                type="text"
                name="contact"
                value={profile.contact}
                onChange={(e) => handelChange(e)}
                placeholder="Phone Number"
                className="form-control"
              />
            </div>
            <div className="row">
              <div className="form-group mb-3 col-md-6">
                <label className="form-label">Email</label>
                <input
                  onBlur={focusChangeEmail}
                  name="email"
                  value={profile.email}
                  onChange={(e) => handelChange(e)}
                  type="email"
                  className="form-control"
                  placeholder="email"
                />
              </div>
            </div>
            {!profile.emailCheck && (
              <h5 className="emailError" style={{ color: "red" }}>
                Not a valid e-mail address
              </h5>
            )}

            <Button
              style={{ backgroundColor: "#3eacff" }}
              variant="info"
              type="submit"
            >
              Update{" "}
            </Button>
          </form>
        </div>
      </div>
      <div className="pt-3">
        <div className="settings-form">
          <h4 className="text-primary">Update Bank Details</h4>
          <form onSubmit={(e) => updateBankInfo(e)}>
            <div className="row">
              <div className="form-group mb-3 col-md-6">
                <label className="form-label">Bank Name</label>
                <input
                  type="text"
                  value={bankinfo.bank_name}
                  name="bank_name"
                  onChange={(e) => handelChangeBankInfo(e)}
                  placeholder="Bank Name"
                  className="form-control"
                />
              </div>
              <div className="form-group mb-3 col-md-6">
                <label className="form-label">Account Holder</label>
                <input
                  type="text"
                  value={bankinfo.account_holder}
                  name="account_holder"
                  onChange={(e) => handelChangeBankInfo(e)}
                  placeholder="Account Holder"
                  className="form-control"
                />
              </div>
            </div>
            <div className="row">
              <div className="form-group mb-3 col-md-6">
                <label className="form-label">IBAN or Bank Account</label>
                <input
                  type="text"
                  value={bankinfo.account_number}
                  name="account_number"
                  onChange={(e) => handelChangeBankInfo(e)}
                  placeholder="IBAN or Bank Account"
                  className="form-control"
                />
              </div>
              <div className="form-group mb-3 col-md-6">
                <label className="form-label">
                  Confirm IBAN or Bank Account
                </label>
                <input
                  type="text"
                  value={bankinfo.confirm_account_no}
                  name="confirm_account_no"
                  onChange={(e) => handelChangeBankInfo(e)}
                  placeholder="IBAN or Bank Account"
                  className="form-control"
                />
              </div>
            </div>
            <div className="form-group mb-3">
              <label className="form-label">BIC or SWIFT</label>
              <input
                type="text"
                value={bankinfo.bic_swift}
                name="bic_swift"
                onChange={(e) => handelChangeBankInfo(e)}
                placeholder="BIC or SWIFT"
                className="form-control"
              />
            </div>
            
            {!profile.emailCheck && (
              <h5 className="emailError" style={{ color: "red" }}>
                Not a valid e-mail address
              </h5>
            )}
            <div className="row"></div>
            <Button
              style={{ backgroundColor: "#3eacff" }}
              variant="info"
              type="submit"
            >
              Update Bank Details
            </Button>
          </form>
        </div>
      </div>

      <div className="pt-3">
        <div className="settings-form">
          <h4 className="text-primary">Update USDT Details</h4>
          <form onSubmit={(e) => updateUSDTInfo(e)}>
          
            <div className="row">
              <div className="form-group mb-3 col-md-6">
                <label className="form-label">USDT Pay Out Address</label>
                <input
                  type="text"
                  value={bankinfo.usdt_payout}
                  name="usdt_payout"
                  onChange={(e) => handelChangeBankInfo(e)}
                  placeholder="0x0000000000000000000000000000000000000000"
                  className="form-control"
                />
              </div>
              <div className="form-group mb-3 col-md-6">
                <label className="form-label">Network</label>
                <Select
                  value={bankinfo.network}
                  onChange={(e) => handelChangeBankInfoDrop(e)}
                  options={optionsSelect}
                />
              </div>
            </div>
            {!profile.emailCheck && (
              <h5 className="emailError" style={{ color: "red" }}>
                Not a valid e-mail address
              </h5>
            )}
            <div className="row"></div>
            <Button
              style={{ backgroundColor: "#3eacff" }}
              variant="info"
              type="submit"
            >
              Update USDT Details
            </Button>
          </form>
        </div>
      </div>

      <div className="pt-3">
        <div className="settings-form">
          <h4 className="text-primary">Update Password</h4>
          <form onSubmit={(e) => updatePassword(e)}>
            <div className="row">
              <div className="form-group mb-3 col-md-6">
                <label className="form-label">Old Password</label>
                <input
                  value={profilePassword.oldPassword}
                  onChange={(e) =>
                    setProfilePassword({
                      ...profilePassword,
                      oldPassword: e.target.value,
                    })
                  }
                  type="password"
                  placeholder="Old Password"
                  className="form-control"
                />
              </div>
              <div className="form-group mb-3 col-md-6">
                <label className="form-label">New Password</label>
                <input
                  type="password"
                  onChange={(e) => updatePasswordField(e.target.value)}
                  onBlur={() => focusChangePassword()}
                  value={profilePassword.newPassword}
                  placeholder="New Password"
                  className="form-control"
                />
              </div>
            </div>
            {!profilePassword.passwordCheck && (
              <h5 className="emailError" style={{ color: "red" }}>
                Password needs atleast 8 characters, 1 number, 1 symbol, 1
                uppercase and 1 lowercase
              </h5>
            )}

            <Button
              style={{ backgroundColor: "#3eacff", marginBottom: "60px" }}
              variant="info"
              type="submit"
            >
              Update Password{" "}
            </Button>
          </form>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      {/* <div className="row">
        <div className="col-lg-12">
          <div className="profile card card-body px-3 pt-3 pb-0">
            <div className="profile-head">
              <div className="photo-content ">
                <div className="cover-photo rounded"></div>
              </div>
              <div className="profile-info">
                <div className="profile-photo">
                  <img  loading="lazy"
                    src={profile}
                    className="img-fluid rounded-circle"
                    alt="profile"
                  />
                </div>
                <div className="profile-details">
                  <div className="profile-name px-3 pt-2">
                    <h4 className="text-primary mb-0">Mitchell C. Shay</h4>
                    <p>UX / UI Designer</p>
                  </div>
                  <div className="profile-email px-2 pt-2">
                    <h4 className="text-muted mb-0">hello@email.com</h4>
                    <p>Email</p>
                  </div>
                  <Dropdown className="dropdown ms-auto">
                    <Dropdown.Toggle
                      variant="primary"
                      className="btn btn-primary light sharp i-false"
                      data-toggle="dropdown"
                      aria-expanded="true"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        //    xmlns:xlink="http://www.w3.org/1999/xlink"
                        width="18px"
                        height="18px"
                        viewBox="0 0 24 24"
                        version="1.1"
                      >
                        <g
                          stroke="none"
                          strokeWidth="1"
                          fill="none"
                          fillRule="evenodd"
                        >
                          <rect x="0" y="0" width="24" height="24"></rect>
                          <circle fill="#000000" cx="5" cy="12" r="2"></circle>
                          <circle fill="#000000" cx="12" cy="12" r="2"></circle>
                          <circle fill="#000000" cx="19" cy="12" r="2"></circle>
                        </g>
                      </svg>
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="dropdown-menu dropdown-menu-right">
                      <Dropdown.Item className="dropdown-item">
                        <i className="fa fa-user-circle text-primary me-2" />
                        View profile
                      </Dropdown.Item>
                      <Dropdown.Item className="dropdown-item">
                        <i className="fa fa-users text-primary me-2" />
                        Add to close friends
                      </Dropdown.Item>
                      <Dropdown.Item className="dropdown-item">
                        <i className="fa fa-plus text-primary me-2" />
                        Add to group
                      </Dropdown.Item>
                      <Dropdown.Item className="dropdown-item">
                        <i className="fa fa-ban text-primary me-2" />
                        Block
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}
      {/* <div className="row">
        <div className="col-xl-4">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <div className="profile-statistics">
                    <div className="text-center">
                      <div className="row">
                        <div className="col">
                          <h3 className="m-b-0">150</h3>
                          <span>Follower</span>
                        </div>
                        <div className="col">
                          <h3 className="m-b-0">140</h3> <span>Place Stay</span>
                        </div>
                        <div className="col">
                          <h3 className="m-b-0">45</h3> <span>Reviews</span>
                        </div>
                      </div>
                      <div className="mt-4">
                        <Link
                          to="/post-details"
                          className="btn btn-primary mb-1 me-1"
                        >
                          Follow
                        </Link>
                        <Button
                          as="a"
                          href="#"
                          className="btn btn-primary mb-1 ms-1"
                           onClick={() => dispatch({type:'sendMessage'})}
                        >
                          Send Message
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-12">
              <div className="card">
                <div className="card-header border-0 pb-0">
                  <h5 className="text-primary">Today Highlights</h5>
                </div>
                <div className="card-body pt-3">
                  <div className="profile-blog ">
                    <img  loading="lazy"
                      src={profile01}
                      alt="profile"
                      className="img-fluid  mb-4 w-100 "
                    />
                    <Link to="/post-details">
                      {" "}
                      <h4>Darwin Creative Agency Theme</h4>{" "}
                    </Link>
                    <p className="mb-0">
                      A small river named Duden flows by their place and
                      supplies it with the necessary regelialia. It is a
                      paradisematic country, in which roasted parts of sentences
                      fly into your mouth.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-12">
              <div className="card">
                <div className="card-header border-0 pb-0">
                  <h5 className="text-primary ">Interest</h5>
                </div>
                <div className="card-body pt-3">
                  <div className="profile-interest ">
                    <LightGallery
                      onInit={onInit}
                      speed={500}
                      plugins={[lgThumbnail, lgZoom]}
                      elementClassNames="row sp4"
                    >
                      {galleryBlog.map((item, index) => (
                        <div
                          data-src={item.image}
                          className="col-lg-4 col-xl-4 col-sm-4 col-6 int-col mb-1"
                          key={index}
                        >
                          <img  loading="lazy"
                            src={item.image}
                            style={{ width: "100%" }}
                            alt="gallery"
                          />
                        </div>
                      ))}
                    </LightGallery>
                    <SRLWrapper options={options}> 
										<div className="row sp4">
											<div className="col-lg-4 col-xl-4 col-sm-4 col-6 int-col mb-1">
												<a href={profile02}> <img  loading="lazy" src={profile02} alt="profileImage" className="img-fluid" /> </a>
											</div>
											<div className="col-lg-4 col-xl-4 col-sm-4 col-6 int-col mb-1">
												<a href={profile03}> <img  loading="lazy" src={profile03} alt="profile" className="img-fluid"/></a>
											</div>
											<div className="col-lg-4 col-xl-4 col-sm-4 col-6 int-col mb-1">
												<a href={profile04}><img  loading="lazy" src={profile04} alt="profile" className="img-fluid" /> </a>
											</div>
											<div className="col-lg-4 col-xl-4 col-sm-4 col-6 int-col mb-1">
												{" "}
												<a href={profile02}><img  loading="lazy" src={profile02} alt="profile" className="img-fluid" /> </a>
											</div>
											<div className="col-lg-4 col-xl-4 col-sm-4 col-6 int-col mb-1">
												<a href={profile03} className="col-lg-4 col-xl-4 col-sm-4 col-6 int-col" >
													<img  loading="lazy" src={profile03} alt="profile"	className="img-fluid"/>	
												</a>
											</div>
											<div className="col-lg-4 col-xl-4 col-sm-4 col-6 int-col mb-1">
												<a href={profile04}	className="col-lg-4 col-xl-4 col-sm-4 col-6 int-col">
													<img  loading="lazy"  src={profile04} alt="profile"	className="img-fluid"/>
												</a>
											</div>
										</div>
									 </SRLWrapper>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-12">
              <div className="card">
                <div className="card-header border-0 pb-0">
                  <h5 className="text-primary">Our Latest News</h5>
                </div>
                <div className="card-body pt-3">
                  <div className="profile-news">
                    <div className="media pt-3 pb-3">
                      <img  loading="lazy"
                        src={profile05}
                        alt=""
                        className="me-3 rounded"
                        width={75}
                      />
                      <div className="media-body">
                        <h5 className="m-b-5">
                          <Link to="/post-details" className="text-black">
                            Collection of textile samples
                          </Link>
                        </h5>
                        <p className="mb-0">
                          I shared this on my fb wall a few months back, and I
                          thought.{" "}
                        </p>
                      </div>
                    </div>
                    <div className="media pt-3 pb-3">
                      <img  loading="lazy"
                        src={profile06}
                        alt=""
                        className="me-3 rounded"
                        width={75}
                      />
                      <div className="media-body">
                        <h5 className="m-b-5">
                          <Link to="/post-details" className="text-black">
                            Collection of textile samples
                          </Link>
                        </h5>
                        <p className="mb-0">
                          I shared this on my fb wall a few months back, and I
                          thought.
                        </p>
                      </div>
                    </div>
                    <div className="media pt-3 ">
                      <img  loading="lazy"
                        src={profile07}
                        alt=""
                        className="me-3 rounded"
                        width={75}
                      />
                      <div className="media-body">
                        <h5 className="m-b-5">
                          <Link to="/post-details" className="text-black">
                            Collection of textile samples
                          </Link>
                        </h5>
                        <p className="mb-0">
                          I shared this on my fb wall a few months back, and I
                          thought.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-8">
          <div className="card">
            <div className="card-body">
              <div className="profile-tab">
                <div className="custom-tab-1">
                  <Tab.Container defaultActiveKey="Posts">
                    <Nav as="ul" className="nav nav-tabs">
                      <Nav.Item as="li" className="nav-item">
                        <Nav.Link to="#my-posts" eventKey="Posts">
                          Posts
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item as="li" i className="nav-item">
                        <Nav.Link to="#about-me" eventKey="About">
                          About Me
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item as="li" className="nav-item">
                        <Nav.Link to="#profile-settings" eventKey="Setting">
                          Setting
                        </Nav.Link>
                      </Nav.Item>
                    </Nav>
                    <Tab.Content>
                      <Tab.Pane id="my-posts" eventKey="Posts">
                        <div className="my-post-content pt-3">
                          <div className="post-input">
                            <textarea
                              name="textarea"
                              id="textarea"
                              cols={30}
                              rows={5}
                              className="form-control bg-transparent"
                              placeholder="Please type what you want...."
                              defaultValue={""}
                            />
                            <Link
                              to="/app-profile"
                              className="btn btn-primary light px-3 me-2"
                                onClick={() => dispatch({ type: "linkModal" })}
                            >
                              <i className="fa fa-link m-0" />{" "}
                            </Link>
                        

                            <Link
                              to={"#"}
                              className="btn btn-primary light px-3 me-1"
                              data-target="#cameraModal"
                                onClick={() => dispatch({ type: "cameraModal" })}
                            >
                              <i className="fa fa-camera m-0" />{" "}
                            </Link>
                          

                            <Link
                              to={"#"}
                              className="btn btn-primary ms-1"
                              data-target="#postModal"
                                onClick={() => dispatch({ type: "postModal" })}
                            >
                              Post
                            </Link>
                       
                          </div>

                          <div className="profile-uoloaded-post border-bottom-1 pb-5">
                            <img  loading="lazy"
                              src={profile08}
                              alt=""
                              className="img-fluid w-100 rounded"
                            />
                            <Link className="post-title" to="/post-details">
                              <h3 className="text-black">
                                Collection of textile samples lay spread
                              </h3>
                            </Link>
                            <p>
                              A wonderful serenity has take possession of my
                              entire soul like these sweet morning of spare
                              which enjoy whole heart.A wonderful serenity has
                              take possession of my entire soul like these sweet
                              morning of spare which enjoy whole heart.
                            </p>
                            <button className="btn btn-primary me-2">
                              <span className="me-2">
                                {" "}
                                <i className="fa fa-heart" />{" "}
                              </span>
                              Like
                            </button>
                            <button
                              className="btn btn-secondary"
                                onClick={() => dispatch({ type: "replyModal" })}
                            >
                              <span className="me-2">
                                {" "}
                                <i className="fa fa-reply" />
                              </span>
                              Reply
                            </button>
                          </div>
                          <div className="profile-uoloaded-post border-bottom-1 pb-5">
                            <img  loading="lazy"
                              src={profile09}
                              alt=""
                              className="img-fluid w-100 rounded"
                            />
                            <Link className="post-title" to="/post-details">
                              <h3 className="text-black">
                                Collection of textile samples lay spread
                              </h3>
                            </Link>
                            <p>
                              A wonderful serenity has take possession of my
                              entire soul like these sweet morning of spare
                              which enjoy whole heart.A wonderful serenity has
                              take possession of my entire soul like these sweet
                              morning of spare which enjoy whole heart.
                            </p>
                            <button className="btn btn-primary me-2">
                              <span className="me-2">
                                {" "}
                                <i className="fa fa-heart" />{" "}
                              </span>
                              Like
                            </button>
                            <button
                              className="btn btn-secondary"
                                onClick={() => dispatch({ type: "replyModal" })}
                            >
                              <span className="me-2">
                                {" "}
                                <i className="fa fa-reply" />
                              </span>
                              Reply
                            </button>
                          </div>
                          <div className="profile-uoloaded-post pb-3">
                            <img  loading="lazy"
                              src={profile08}
                              alt=""
                              className="img-fluid  w-100 rounded"
                            />
                            <Link className="post-title" to="/post-details">
                              <h3 className="text-black">
                                Collection of textile samples lay spread
                              </h3>
                            </Link>
                            <p>
                              A wonderful serenity has take possession of my
                              entire soul like these sweet morning of spare
                              which enjoy whole heart.A wonderful serenity has
                              take possession of my entire soul like these sweet
                              morning of spare which enjoy whole heart.
                            </p>
                            <button className="btn btn-primary me-2">
                              <span className="me-2">
                                <i className="fa fa-heart" />
                              </span>
                              Like
                            </button>
                            <button
                              className="btn btn-secondary"
                                onClick={() => dispatch({ type: "replyModal" })}
                            >
                              <span className="me-2">
                                {" "}
                                <i className="fa fa-reply" />
                              </span>
                              Reply
                            </button>
                          </div>
                        </div>
                      </Tab.Pane>
                      <Tab.Pane id="about-me" eventKey="About">
                        <div className="profile-about-me">
                          <div className="pt-4 border-bottom-1 pb-3">
                            <h4 className="text-primary">About Me</h4>
                            <p className="mb-2">
                              A wonderful serenity has taken possession of my
                              entire soul, like these sweet mornings of spring
                              which I enjoy with my whole heart. I am alone, and
                              feel the charm of existence was created for the
                              bliss of souls like mine.I am so happy, my dear
                              friend, so absorbed in the exquisite sense of mere
                              tranquil existence, that I neglect my talents.
                            </p>
                            <p>
                              A collection of textile samples lay spread out on
                              the table - Samsa was a travelling salesman - and
                              above it there hung a picture that he had recently
                              cut out of an illustrated magazine and housed in a
                              nice, gilded frame.
                            </p>
                          </div>
                        </div>
                        <div className="profile-skills mb-5">
                          <h4 className="text-primary mb-2">Skills</h4>
                          <Link
                            to="/app-profile"
                            className="btn btn-primary light btn-xs mb-1 me-1"
                          >
                            {" "}
                            Admin
                          </Link>
                          <Link
                            to="/app-profile"
                            className="btn btn-primary light btn-xs mb-1 me-1"
                          >
                            {" "}
                            Dashboard
                          </Link>
                          <Link
                            to="/app-profile"
                            className="btn btn-primary light btn-xs mb-1 me-1"
                          >
                            Photoshop
                          </Link>
                          <Link
                            to="/app-profile"
                            className="btn btn-primary light btn-xs mb-1 me-1"
                          >
                            Bootstrap
                          </Link>
                          <Link
                            to="/app-profile"
                            className="btn btn-primary light btn-xs mb-1 me-1"
                          >
                            Responsive
                          </Link>
                          <Link
                            to="/app-profile"
                            className="btn btn-primary light btn-xs mb-1 me-1"
                          >
                            Crypto
                          </Link>
                        </div>
                        <div className="profile-lang  mb-5">
                          <h4 className="text-primary mb-2">Language</h4>
                          <Link
                            to="/app-profile"
                            className="text-muted pe-3 f-s-16"
                          >
                            <i className="flag-icon flag-icon-us" />
                            English
                          </Link>
                          <Link
                            to="/app-profile"
                            className="text-muted pe-3 f-s-16"
                          >
                            <i className="flag-icon flag-icon-fr" />
                            French
                          </Link>
                          <Link
                            to="/app-profile"
                            className="text-muted pe-3 f-s-16"
                          >
                            <i className="flag-icon flag-icon-bd" />
                            Bangla
                          </Link>
                        </div>
                        <div className="profile-personal-info">
                          <h4 className="text-primary mb-4">
                            Personal Information
                          </h4>
                          <div className="row mb-2">
                            <div className="col-3">
                              <h5 className="f-w-500">
                                {" "}
                                Name<span className="pull-right">:</span>
                              </h5>
                            </div>
                            <div className="col-9">
                              <span>Mitchell C.Shay</span>
                            </div>
                          </div>
                          <div className="row mb-2">
                            <div className="col-3">
                              <h5 className="f-w-500">
                                Email<span className="pull-right">:</span>
                              </h5>
                            </div>
                            <div className="col-9">
                              <span>example@examplel.com</span>
                            </div>
                          </div>
                          <div className="row mb-2">
                            <div className="col-3">
                              <h5 className="f-w-500">
                                {" "}
                                Availability
                                <span className="pull-right">:</span>
                              </h5>
                            </div>
                            <div className="col-9">
                              <span>Full Time (Free Lancer)</span>
                            </div>
                          </div>
                          <div className="row mb-2">
                            <div className="col-3">
                              <h5 className="f-w-500">
                                Age<span className="pull-right">:</span>
                              </h5>
                            </div>
                            <div className="col-9">
                              <span>27</span>
                            </div>
                          </div>
                          <div className="row mb-2">
                            <div className="col-3">
                              <h5 className="f-w-500">
                                {" "}
                                Location<span className="pull-right">:</span>
                              </h5>
                            </div>
                            <div className="col-9">
                              <span>Rosemont Avenue Melbourne, Florida</span>
                            </div>
                          </div>
                          <div className="row mb-2">
                            <div className="col-3">
                              <h5 className="f-w-500">
                                Year Experience
                                <span className="pull-right">:</span>
                              </h5>
                            </div>
                            <div className="col-9">
                              <span>07 Year Experiences</span>
                            </div>
                          </div>
                        </div>
                      </Tab.Pane>
                      <Tab.Pane id="profile-settings" eventKey="Setting">
                        <div className="pt-3">
                          <div className="settings-form">
                            <h4 className="text-primary">Account Setting</h4>
                            <form onSubmit={(e) => e.preventDefault()}>
                              <div className="row">
                                <div className="form-group mb-3 col-md-6">
                                  <label className="form-label">Email</label>
                                  <input
                                    type="email"
                                    placeholder="Email"
                                    className="form-control"
                                  />
                                </div>
                                <div className="form-group mb-3 col-md-6">
                                  <label className="form-label">Password</label>
                                  <input
                                    type="password"
                                    placeholder="Password"
                                    className="form-control"
                                  />
                                </div>
                              </div>
                              <div className="form-group mb-3">
                                <label className="form-label">Address</label>
                                <input
                                  type="text"
                                  placeholder="1234 Main St"
                                  className="form-control"
                                />
                              </div>
                              <div className="form-group mb-3">
                                <label className="form-label">Address 2</label>
                                <input
                                  type="text"
                                  placeholder="Apartment, studio, or floor"
                                  className="form-control"
                                />
                              </div>
                              <div className="row">
                                <div className="form-group mb-3 col-md-6">
                                  <label className="form-label">City</label>
                                  <input type="text" className="form-control" />
                                </div>
                                <div className="form-group mb-3 col-md-4">
                                  <label className="form-label">State</label>
                                  <select
                                    className="form-control"
                                    id="inputState"
                                    defaultValue="option-1"
                                  >
                                    <option value="option-1">Choose...</option>
                                    <option value="option-2">Option 1</option>
                                    <option value="option-3">Option 2</option>
                                    <option value="option-4">Option 3</option>
                                  </select>
                                </div>
                                <div className="form-group mb-3 col-md-2">
                                  <label className="form-label">Zip</label>
                                  <input type="text" className="form-control" />
                                </div>
                              </div>
                              <div className="form-group mb-3">
                                <div className="form-check custom-checkbox">
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="gridCheck"
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="gridCheck"
                                  >
                                    Check me out
                                  </label>
                                </div>
                              </div>
                              <button className="btn btn-primary" type="submit">
                                Sign in
                              </button>
                            </form>
                          </div>
                        </div>
                      </Tab.Pane>
                    </Tab.Content>
                  </Tab.Container>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      {/* <Modal
        className="modal fade"
        show={state.sendMessage}
        onHide={() => dispatch({ type: "sendMessage" })}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Send Message</h5>
            <Button
              variant=""
              type="button"
              className="btn-close"
              data-dismiss="modal"
                onClick={() => dispatch({ type: "sendMessage" })}
            ></Button>
          </div>
          <div className="modal-body">
            <form
              className="comment-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  dispatch({ type: "sendMessage" });
                }}
            >
              <div className="row">
                <div className="col-lg-6">
                  <div className="form-group mb-3">
                    <label htmlFor="author" className="text-black font-w600">
                      {" "}
                      Name <span className="required">*</span>{" "}
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      defaultValue="Author"
                      name="Author"
                      placeholder="Author"
                    />
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="form-group mb-3">
                    <label htmlFor="email" className="text-black font-w600">
                      {" "}
                      Email <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      defaultValue="Email"
                      placeholder="Email"
                      name="Email"
                    />
                  </div>
                </div>
                <div className="col-lg-12">
                  <div className="form-group mb-3">
                    <label htmlFor="comment" className="text-black font-w600">
                      Comment
                    </label>
                    <textarea
                      rows={4}
                      className="form-control"
                      name="comment"
                      placeholder="Comment"
                      defaultValue={""}
                    />
                  </div>
                </div>
                <div className="col-lg-12">
                  <div className="form-group mb-3">
                    <input
                      type="submit"
                      value="Post Comment"
                      className="submit btn btn-primary"
                      name="submit"
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </Modal>
   
      <Modal
        show={state.post}
        className="modal fade"
        id="postModal"
        onHide={() => dispatch({ type: "postModal" })}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Post</h5>
            <Button
              variant=""
              type="button"
              className="close"
              data-dismiss="modal"
                onClick={() => dispatch({ type: "postModal" })}
            >
              <span>×</span>
            </Button>
          </div>
          <div className="modal-body">
            <textarea
              name="textarea"
              id="textarea"
              cols={30}
              rows={5}
              className="form-control mb-2 bg-transparent"
              placeholder="Please type what you want...."
              defaultValue={""}
            />
            <Link
              className="btn btn-primary btn-rounded mt-1"
              to="/app-profile"
            >
              Post
            </Link>
          </div>
        </div>
      </Modal>
  
      <Modal
        show={state.link}
        className="modal fade post-input"
        id="linkModal"
        onHide={() => dispatch({ type: "linkModal" })}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Social Links</h5>
            <button
              type="button"
              className="btn-close"
              data-dismiss="modal"
                onClick={() => dispatch({ type: "linkModal" })}
            ></button>
          </div>
          <div className="modal-body">
            <Link className="btn-social me-1 facebook" to="/app-profile">
              <i className="fab fa-facebook-f" />
            </Link>
            <Link className="btn-social me-1 google-plus" to="/app-profile">
              {" "}
              <i className="fab fa-google-plus" />
            </Link>
            <Link className="btn-social me-1 linkedin" to="/app-profile">
              <i className="fab fa-linkedin" />
            </Link>
            <Link className="btn-social me-1 instagram" to="/app-profile">
              {" "}
              <i className="fab fa-instagram" />
            </Link>
            <Link className="btn-social me-1 twitter" to="/app-profile">
              <i className="fab fa-twitter" />
            </Link>
            <Link className="btn-social me-1 youtube" to="/app-profile">
              <i className="fab fa-youtube" />
            </Link>
            <Link className="btn-social whatsapp" to="/app-profile">
              <i className="fab fa-whatsapp" />
            </Link>
          </div>
        </div>
      </Modal>

      <Modal
        show={state.camera}
        className="modal fade"
        id="cameraModal"
        onHide={() => dispatch({ type: "cameraModal" })}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Upload images</h5>
            <button
              type="button"
              className="btn-close"
              data-dismiss="modal"
                onClick={() => dispatch({ type: "cameraModal" })}
            ></button>
          </div>
          <div className="modal-body">
            <div className="input-group mb-3">
              <span className="input-group-text">Upload</span>
              <div className="form-file">
                <input type="file" className="form-file-input" />
              </div>
            </div>
          </div>
        </div>
      </Modal>
  
      <Modal
        show={state.reply}
        className="modal fade"
        id="replyModal"
        onHide={() => dispatch({ type: "replyModal" })}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Post Reply</h5>
            <button
              type="button"
              className="btn-close"
                onClick={() => dispatch({ type: "replyModal" })}
            ></button>
          </div>
          <div className="modal-body">
            <form>
              <textarea className="form-control" rows="4">
                Message
              </textarea>
            </form>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-danger light"
              onClick={() => dispatch({type:'replyModal'})}
            >
              Close
            </button>
            <button type="button" className="btn btn-primary">
              Reply
            </button>
          </div>
        </div>
      </Modal> */}
    </Fragment>
  );
};

export default AppProfile;
