import React, { Fragment, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
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
    </Fragment>
  );
};

export default AppProfile;
