import jwt_decode from "jwt-decode";
import React, { useEffect, useRef, useState } from "react";
import {
  Dropdown
} from "react-bootstrap";
import CurrencyFormat from "react-currency-format";
import { ImCross } from "react-icons/im";
import PerfectScrollbar from "react-perfect-scrollbar";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import io from "socket.io-client";
import Cookies from "universal-cookie";
import { createTrade } from "../../../Redux/coins";
import {
  hideSpecificNotification,
  seenAllNotifications,
  seenSpecificNotification,
  switchAccount,
} from "../../../Redux/user";
import cryptoicons from "../../../images/cryptoIcons/cryptoImg";
import Open from "../../components/OpenTradeModel/Open";


import LogoutPage from "./Logout";

import { Delete } from "@mui/icons-material";
import { getNotifcation } from "../../../Redux/user";
import avatar from "../../../images/avatar/11.jpeg";
import profile from "../../../images/profile/user.png";
const env = process.env.NODE_ENV === 'development' ? process.env.REACT_APP_DEV_MODE : process.env.REACT_APP_PRO_MODE;

const socket = io(env);

const Header = ({ onNote }) => {
  const searchRef = useRef(null);
  const cookies = new Cookies();

  const notification = useSelector((state) => state.userReducer.notification);
  const [Notifications, setNotifications] = useState([]);
  const dispatch = useDispatch();
  const coinReducer = useSelector((store) => store.coinReducer);
  const userReducer = useSelector((store) => store.userReducer);

  const [isSearched, setIsSearched] = useState("");
  const [isBlur, setIsBlur] = useState(false);

  const [coinMarketData, setCoinMarketData] = useState([]);
  const [largeModal, setLargeModal] = useState(false);
  const [stopLoss, setStopLoss] = useState(0);
  const [takeProfit, setTakeProfit] = useState(0);
  const [modalCurrentData, setModalCurrentData] = useState();
  const [inputValue, setInputValue] = useState();
  const [inputId, setInputId] = useState("price");

  const [rightSelect, setRightSelect] = useState("Eng");
  //For fix header
  const [headerFix, setheaderFix] = useState(false);
  useEffect(() => {
    setCoinMarketData(coinReducer.coinData);
  }, [coinReducer.coinData]);

  // useEffect(() => {
  //   window.addEventListener("scroll", () => {
  //     setheaderFix(window.scrollY > 50);
  //   });
  //   setCoinMarketData(coinReducer.coinData);
  //   (getNotifcationdispatch(userReducer.currentUser.is_admin));
  // }, []);

  // useEffect(() => {
  //   socket.on("newNotification", (data) => {
  //     console.log("messagefrom server", data);
  //     dispatch(getNotifcation(userReducer.currentUser.is_admin));
  //   });
  // }, []);

  // useEffect(() => {
  //   setNotifications(notification);
  // }, [notification]);

  // useEffect(() => {
  //   setNotifications(notification);
  // }, [notification]);
  //const [searchBut, setSearchBut] = useState(false);
  var path = window.location.pathname.split("/");
  var name = path[path.length - 1].split("-");
  var filterName = name.length >= 3 ? name.filter((n, i) => i > 0) : name;
  var finalName = filterName.includes("app")
    ? filterName.filter((f) => f !== "app")
    : filterName.includes("ui")
    ? filterName.filter((f) => f !== "ui")
    : filterName.includes("uc")
    ? filterName.filter((f) => f !== "uc")
    : filterName.includes("basic")
    ? filterName.filter((f) => f !== "basic")
    : filterName.includes("jquery")
    ? filterName.filter((f) => f !== "jquery")
    : filterName.includes("table")
    ? filterName.filter((f) => f !== "table")
    : filterName.includes("page")
    ? filterName.filter((f) => f !== "page")
    : filterName.includes("email")
    ? filterName.filter((f) => f !== "email")
    : filterName.includes("ecom")
    ? filterName.filter((f) => f !== "ecom")
    : filterName.includes("chart")
    ? filterName.filter((f) => f !== "chart")
    : filterName.includes("editor")
    ? filterName.filter((f) => f !== "editor")
    : filterName;

  const openTrade = (value) => {
    let body = {
      user_id: userReducer.currentUser.id,
      crypto_name: modalCurrentData.name,
      crypto_symbol: modalCurrentData.symbol,
      crypto_purchase_price: modalCurrentData.price,
      investment:
        inputId === "price"
          ? parseFloat(inputValue)
          : parseFloat(inputValue * modalCurrentData.price),
      stop_loss: stopLoss,
      take_profit: takeProfit,
    };
    console.log("body of trade", body);
    // const res = dispatch(createTrade(body));
    // console.log("res of trade", res);
    setLargeModal(false);
  };
  const handleClick = (price) => {
    if (inputId === "price") {
      setInputId("units");
      const newValue = inputValue / price;
      setInputValue(newValue);
    } else {
      setInputId("price");
      const newValue = inputValue * price;
      setInputValue(newValue);
    }
  };
  const viewSpecificNotification = async (id) => {
    // const res = await dispatch(
    //   seenSpecificNotification({ id, user_id: userReducer.currentUser.id })
    // );
    // console.log("res==", res);
    // if (res.payload.status === 200) {
    // }
  };
  const hideSpecificNotificationAction = async (id) => {
    // const res = await dispatch(
    //   hideSpecificNotification({ id, user_id: userReducer.currentUser.id })
    // );
    // console.log("res==", res);
    // if (res.payload.status === 200) {
    // }
  };

  const viewAll = async (id) => {
    const res = await dispatch(
      seenAllNotifications(userReducer.currentUser.id)
    );
    console.log("res==", res);
    if (res.payload.status === 200) {
    }
  };
  const callApi = async () => {
    // let previoustoken = cookies.get("previoustoken");
    // if (previoustoken) {
    //   const user = jwt_decode(previoustoken);
    //   const res = await dispatch(switchAccount(user));
    //   console.log("response===", res, user);
    //   if (res.payload) {
    //     cookies.set("token", res.payload.access);
    //     cookies.remove("previoustoken");
    //     window.location.replace("admin-dashboard");
    //   }
    // }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const handleClickOutside = (event) => {
    console.log("e====", event.target, searchRef.current);
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      setIsSearched("");
    }
  };
  return (
    <div className={`header ${headerFix ? "is-fixed" : ""}`}>
      <div className="header-content">
        <nav className="navbar navbar-expand">
          <div className="collapse navbar-collapse justify-content-between">
            <div className="header-left">
              <div
                className="dashboard_bar"
                style={{ textTransform: "capitalize", color: "black" }}
              >
                {finalName.join(" ").length === 0
                  ? "Dashboard"
                  : finalName.join(" ") === "dashboard dark"
                  ? "Dashboard"
                  : finalName.join(" ")}
              </div>
            </div>

            <div className="navbar-nav header-right">
              <div className="nav-item d-flex align-items-center searchbarnav">
                <div
                  className="input-group search-area align-items-center"
                  style={{ cursor: "pointer" }}
                >
                  <span className="input-group-text" style={{ height: "3rem" }}>
                    <Link to={"#"}>
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 32 32"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M27.414 24.586L22.337 19.509C23.386 17.928 24 16.035 24 14C24 8.486 19.514 4 14 4C8.486 4 4 8.486 4 14C4 19.514 8.486 24 14 24C16.035 24 17.928 23.386 19.509 22.337L24.586 27.414C25.366 28.195 26.634 28.195 27.414 27.414C28.195 26.633 28.195 25.367 27.414 24.586ZM7 14C7 10.14 10.14 7 14 7C17.86 7 21 10.14 21 14C21 17.86 17.86 21 14 21C10.14 21 7 17.86 7 14Z"
                          fill="var(--secondary)"
                        />
                      </svg>
                    </Link>
                  </span>
                  <input
                    type="text"
                    className="form-control search-field searchfieeled "
                    placeholder="Search here..."
                    value={isSearched}
                    onChange={(e) => setIsSearched(e.target.value)}
                  />
                  {isSearched !== "" && (
                    <span onClick={() => setIsSearched("")}>
                      <ImCross />
                    </span>
                  )}
                </div>
                {isSearched !== "" && (
                  <div
                    ref={searchRef}
                    className="scrollbar-container widget-media dlab-scroll p-3 height380 ps ps--active-y"
                    style={{
                      position: "absolute",
                      top: "70px",
                      right: "5px",
                      background: "white",
                      minWidth: "20rem",
                      color: "black",
                      borderRadius: "1.2rem",
                      boxShadow: "0 0 3.125rem 0 rgb(82 63 105 / 15%)",
                    }}
                  >
                    <h4
                      className="w-100 text-left p-2"
                      style={{ background: "white" }}
                    >
                      Markets
                    </h4>
                    {coinMarketData?.filter((data) => {
                      if (isSearched === "") {
                        return data;
                      } else if (
                        data?.name
                          ?.toLowerCase()
                          ?.includes(isSearched.toLowerCase())
                      ) {
                        return data;
                      } else if (
                        data?.symbol
                          ?.toLowerCase()
                          ?.includes(isSearched.toLowerCase())
                      ) {
                        return data;
                      }
                    }).length > 0 ? (
                      <div className="w-100 text-left p-1">
                        {coinMarketData
                          ?.filter((data) => {
                            if (isSearched === "") {
                              return data;
                            } else if (
                              data?.name
                                ?.toLowerCase()
                                ?.includes(isSearched.toLowerCase())
                            ) {
                              return data;
                            } else if (
                              data?.symbol
                                ?.toLowerCase()
                                ?.includes(isSearched.toLowerCase())
                            ) {
                              return data;
                            }
                          })
                          ?.map((item, index) => {
                            return (
                              <div className="timeline-panel" key={index}>
                                <div className="d-flex align-items-center justify-content-between w-100 my-1">
                                  <div className="d-flex align-items-center">
                                    <div className="media me-2">
                                      <img
                                        loading="lazy"
                                        alt="images"
                                        width={40}
                                        src={cryptoicons[item.symbol]}
                                      />
                                    </div>
                                    <div>{item?.name}</div>
                                  </div>
                                  <h6 className="mb-1">
                                    {!userReducer.currentUser.is_admin && (
                                      <button
                                        type="button"
                                        className="btn"
                                        style={{
                                          marginLeft: "5px",
                                          background: "#3eacff",
                                          color: "white",
                                          padding: "2px 4px",
                                          borderRadius: "7px",
                                        }}
                                        onClick={() => {
                                          setModalCurrentData(item);
                                          setLargeModal(true);
                                        }}
                                      >
                                        Invest
                                      </button>
                                    )}
                                  </h6>
                                </div>
                                <div className="media-body">
                                  <div className="d-flex justify-content-center">
                                    <span style={{ marginRight: "5px" }}>
                                      {item?.symbol} | Unit Price :
                                    </span>
                                    <span style={{ fontWeight: "800" }}>
                                      <CurrencyFormat
                                        value={item?.price}
                                        displayType={"text"}
                                        decimalScale={2}
                                        thousandSeparator={true}
                                        prefix={"$"}
                                        fixedDecimalScale={true}
                                        renderText={(value) => <p>{value}</p>}
                                      />
                                    </span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    ) : (
                      <div> No search results found</div>
                    )}
                  </div>
                )}
              </div>
              <div className="dz-side-menu">
                <div className="search-coundry d-flex align-items-center"></div>
              
                  <div className="sidebar-social-link">
                    {userReducer.notification.filter(
                      (d) =>
                        d.status == null ||
                        !d.status
                          ?.split(",")
                          ?.includes(userReducer?.currentUser?.id?.toString())
                    ).length > 0 && (
                      <div style={{ position: "relative" }}>
                        <div className="notification_style">
                          <span>
                            {
                              userReducer.notification.filter(
                                (d) =>
                                  d.status == null ||
                                  !d.status
                                    ?.split(",")
                                    ?.includes(
                                      userReducer?.currentUser?.id?.toString()
                                    )
                              ).length
                            }
                          </span>
                        </div>
                      </div>
                    )}

                    <ul className="">
                      <Dropdown
                        as="li"
                        className="nav-item dropdown notification_dropdown "
                      >
                       

                        <Dropdown.Menu className=" dropdown-menu dropdown-menu-end">
                          <PerfectScrollbar
                            className="widget-timeline dz-scroll style-1 ps p-3 ps--active-y height370"
                            id="DZ_W_TimeLine02"
                          >
                            <h4 className="text-center border-bottom pb-2">
                              Notications
                            </h4>
                            <ul className="timeline">
                              <li>
                                <div className="timeline-badge primary" />
                                <Link
                                  className="timeline-panel c-pointer text-muted"
                                  to="#"
                                >
                                  <span>10 minutes ago</span>
                                  <h6 className="mb-0">
                                    Youtube, a video-sharing website, goes live{" "}
                                    <strong className="text-primary">
                                      $500
                                    </strong>
                                    .
                                  </h6>
                                </Link>
                              </li>
                              <li>
                                <div className="timeline-badge info"></div>
                                <Link
                                  className="timeline-panel c-pointer text-muted"
                                  to="#"
                                >
                                  <span>20 minutes ago</span>
                                  <h6 className="mb-0">
                                    New order placed{" "}
                                    <strong className="text-info">
                                      #XF-2356.
                                    </strong>
                                  </h6>
                                  <p className="mb-0">
                                    {" "}
                                    Quisque a consequat ante Sit amet magna at
                                    volutapt...
                                  </p>
                                </Link>
                              </li>
                              <li>
                                <div className="timeline-badge danger"></div>
                                <Link
                                  className="timeline-panel c-pointer text-muted"
                                  to="#"
                                >
                                  <span>30 minutes ago</span>
                                  <h6 className="mb-0">
                                    john just buy your product{" "}
                                    <strong className="text-warning">
                                      Sell $250
                                    </strong>
                                  </h6>
                                </Link>
                              </li>
                              <li>
                                <div className="timeline-badge success"></div>
                                <Link
                                  className="timeline-panel c-pointer text-muted"
                                  to="#"
                                >
                                  <span>15 minutes ago</span>
                                  <h6 className="mb-0">
                                    StumbleUpon is acquired by eBay.{" "}
                                  </h6>
                                </Link>
                              </li>
                              <li>
                                <div className="timeline-badge warning"></div>
                                <Link
                                  className="timeline-panel c-pointer text-muted"
                                  to="#"
                                >
                                  <span>20 minutes ago</span>
                                  <h6 className="mb-0">
                                    Mashable, a news website and blog, goes
                                    live.
                                  </h6>
                                </Link>
                              </li>
                              <li>
                                <div className="timeline-badge dark"></div>
                                <Link
                                  className="timeline-panel c-pointer text-muted"
                                  to="#"
                                >
                                  <span>20 minutes ago</span>
                                  <h6 className="mb-0">
                                    Mashable, a news website and blog, goes
                                    live.
                                  </h6>
                                </Link>
                              </li>
                              <li>
                                <div className="timeline-badge primary" />
                                <Link
                                  className="timeline-panel c-pointer text-muted"
                                  to="#"
                                >
                                  <span>10 minutes ago</span>
                                  <h6 className="mb-0">
                                    {" "}
                                    Youtube, a video-sharing website, goes live{" "}
                                    <strong className="text-primary">
                                      $500
                                    </strong>
                                    .
                                  </h6>
                                </Link>
                              </li>
                              <li>
                                <div className="timeline-badge info"></div>
                                <Link
                                  className="timeline-panel c-pointer text-muted"
                                  to="#"
                                >
                                  <span>20 minutes ago</span>
                                  <h6 className="mb-0">
                                    New order placed{" "}
                                    <strong className="text-info">
                                      #XF-2356.
                                    </strong>
                                  </h6>
                                  <p className="mb-0">
                                    {" "}
                                    Quisque a consequat ante Sit amet magna at
                                    volutapt...
                                  </p>
                                </Link>
                              </li>
                              <li>
                                <div className="timeline-badge danger"></div>
                                <Link
                                  className="timeline-panel c-pointer text-muted"
                                  to="#"
                                >
                                  <span>30 minutes ago</span>
                                  <h6 className="mb-0">
                                    john just buy your product{" "}
                                    <strong className="text-warning">
                                      Sell $250
                                    </strong>
                                  </h6>
                                </Link>
                              </li>
                              <li>
                                <div className="timeline-badge success"></div>
                                <Link
                                  className="timeline-panel c-pointer text-muted"
                                  to="#"
                                >
                                  <span>15 minutes ago</span>
                                  <h6 className="mb-0">
                                    StumbleUpon is acquired by eBay.{" "}
                                  </h6>
                                </Link>
                              </li>
                            </ul>
                            <div
                              className="ps__rail-x"
                              style={{ left: 0, bottom: 0 }}
                            >
                              <div
                                className="ps__thumb-x"
                                tabIndex={0}
                                style={{ left: 0, width: 0 }}
                              />
                            </div>
                            <div
                              className="ps__rail-y"
                              style={{ top: 0, right: 0 }}
                            >
                              <div
                                className="ps__thumb-y"
                                tabIndex={0}
                                style={{ top: 0, height: 0 }}
                              />
                            </div>
                          </PerfectScrollbar>
                        </Dropdown.Menu>
                      </Dropdown>
                      {/* <Dropdown
                      as="li"
                      className="nav-item dropdown notification_dropdown "
                    >
                      <Dropdown.Toggle
                        variant=""
                        as="a"
                        className="nav-link  i-false c-pointer"
                        onClick={() => onNote()}
                      >
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M16.9394 3.57129C18.2804 3.57129 19.5704 4.06765 20.5194 4.95828C21.4694 5.84704 22.0004 7.04579 22.0004 8.30073V15.6993C22.0004 18.3122 19.7304 20.4287 16.9394 20.4287H7.0604C4.2694 20.4287 2.0004 18.3122 2.0004 15.6993V8.30073C2.0004 5.68783 4.2594 3.57129 7.0604 3.57129H16.9394ZM18.5304 9.69615L18.6104 9.62123C18.8494 9.34964 18.8494 8.9563 18.5994 8.68471C18.4604 8.54517 18.2694 8.45994 18.0704 8.44121C17.8604 8.43091 17.6604 8.4974 17.5094 8.62852L13.0004 12C12.4204 12.4505 11.5894 12.4505 11.0004 12L6.5004 8.62852C6.1894 8.41312 5.7594 8.44121 5.5004 8.69407C5.2304 8.94693 5.2004 9.34964 5.4294 9.6306L5.5604 9.75234L10.1104 13.077C10.6704 13.4891 11.3494 13.7138 12.0604 13.7138C12.7694 13.7138 13.4604 13.4891 14.0194 13.077L18.5304 9.69615Z"
                            fill="#130F26"
                          />
                        </svg>
                      </Dropdown.Toggle>
                    </Dropdown> */}
                      <Dropdown
                        as="li"
                        className="nav-item dropdown notification_dropdown"
                      >
                        <Dropdown.Toggle
                          className="nav-link i-false c-pointer"
                          variant=""
                          as="a"
                        >
                          <svg
                            width="24"
                            height="23"
                            viewBox="0 0 24 23"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M18.7071 8.56414C18.7071 9.74035 19.039 10.4336 19.7695 11.2325C20.3231 11.8211 20.5 12.5766 20.5 13.3963C20.5 14.215 20.2128 14.9923 19.6373 15.6233C18.884 16.3798 17.8215 16.8627 16.7372 16.9466C15.1659 17.0721 13.5937 17.1777 12.0005 17.1777C10.4063 17.1777 8.83505 17.1145 7.26375 16.9466C6.17846 16.8627 5.11602 16.3798 4.36367 15.6233C3.78822 14.9923 3.5 14.215 3.5 13.3963C3.5 12.5766 3.6779 11.8211 4.23049 11.2325C4.98384 10.4336 5.29392 9.74035 5.29392 8.56414V8.16515C5.29392 6.58996 5.71333 5.55995 6.577 4.55164C7.86106 3.08114 9.91935 2.19922 11.9558 2.19922H12.0452C14.1254 2.19922 16.2502 3.12359 17.5125 4.65728C18.3314 5.64484 18.7071 6.63146 18.7071 8.16515V8.56414ZM9.07367 19.1136C9.07367 18.642 9.53582 18.426 9.96318 18.3336C10.4631 18.2345 13.5093 18.2345 14.0092 18.3336C14.4366 18.426 14.8987 18.642 14.8987 19.1136C14.8738 19.5626 14.5926 19.9606 14.204 20.2134C13.7001 20.5813 13.1088 20.8143 12.4906 20.8982C12.1487 20.9397 11.8128 20.9407 11.4828 20.8982C10.8636 20.8143 10.2723 20.5813 9.76938 20.2125C9.37978 19.9606 9.09852 19.5626 9.07367 19.1136Z"
                              fill="#130F26"
                            />
                          </svg>
                        </Dropdown.Toggle>
                        <Dropdown.Menu
                          align="	right"
                          className="mt-2 dropdown-menu dropdown-menu-end"
                        >
                          <PerfectScrollbar className="widget-media dz-scroll p-3 height380">
                            {/* <div
                              onClick={() => viewAll()}
                              style={{ textAlign: "right", cursor: "pointer" }}
                              className="colorprimary"
                            >
                              see all
                            </div> */}
                            <ul className="timeline">
                              {Notifications &&
                                Notifications?.filter(
                                  (list, index) =>
                                    !list.hide
                                      ?.split(",")
                                      ?.includes(
                                        userReducer?.currentUser?.id?.toString()
                                      )
                                ).map((list, index) => (
                                  <>
                                    <li
                                      key={index}
                                      style={{
                                        cursor: "pointer",
                                        background: list.status
                                          ?.split(",")
                                          ?.includes(
                                            userReducer?.currentUser?.id?.toString()
                                          )
                                          ? ""
                                          : "#b9aeae7d",
                                        paddingBottom: "6px",
                                      }}
                                    >
                                      <div className="timeline-panel">
                                        <div className="media me-2">
                                          <img
                                            loading="lazy"
                                            alt="images"
                                            width={25}
                                            src={avatar}
                                          />
                                        </div>
                                        <div
                                          onClick={() =>
                                            viewSpecificNotification(list.id)
                                          }
                                          className="media-body"
                                        >
                                          <h6 className="mb-1">
                                            {list.content}
                                          </h6>

                                          <small className="d-block">
                                            {list.created_at}
                                          </small>
                                        </div>
                                        <div>
                                          {" "}
                                          <Delete
                                            onClick={() =>
                                              hideSpecificNotificationAction(
                                                list.id
                                              )
                                            }
                                          ></Delete>
                                        </div>
                                      </div>
                                    </li>
                                  </>
                                ))}
                            </ul>
                            <div
                              className="ps__rail-x"
                              style={{ left: 0, bottom: 0 }}
                            >
                              <div
                                className="ps__thumb-x"
                                tabIndex={0}
                                style={{ left: 0, width: 0 }}
                              />
                            </div>
                            <div
                              className="ps__rail-y"
                              style={{ top: 0, right: 0 }}
                            >
                              <div
                                className="ps__thumb-y"
                                tabIndex={0}
                                style={{ top: 0, height: 0 }}
                              />
                            </div>
                          </PerfectScrollbar>
                          {/* <Link
                            className="all-notification colorprimary"
                            to="#"
                          >
                            See all notifications{" "}
                            <i className="ti-arrow-right" />
                          </Link> */}
                        </Dropdown.Menu>
                      </Dropdown>
                    </ul>
                  </div>
             

                <ul>
                  <Dropdown
                    as="li"
                    className="nav-item dropdown header-profile"
                  >
                    <Dropdown.Toggle
                      variant=""
                      as="a"
                      className="nav-link i-false c-pointer"
                    >
                      <img loading="lazy" src={profile} width={20} alt="" />
                    </Dropdown.Toggle>
                    <Dropdown.Menu
                      align="right"
                      className="dropdown-menu dropdown-menu-end"
                    >
                      {!userReducer.currentUser.is_admin && (
                        <Link
                          to="/app-profile"
                          className="dropdown-item ai-icon colorprimary"
                        >
                          <svg
                            id="icon-user1"
                            xmlns="http://www.w3.org/2000/svg"
                            className="text-primary me-1 colorprimary"
                            width={18}
                            height={18}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx={12} cy={7} r={4} />
                          </svg>
                          <span className="ms-2 colorprimary">Profile </span>
                        </Link>
                      )}

                      <LogoutPage />
                      {!userReducer.currentUser.is_admin &&
                        cookies.get("previoustoken") && (
                          <div
                            className="dropdown-item ai-icon"
                            style={{ cursor: "pointer" }}
                          >
                            <span className="ms-2" onClick={() => callApi()}>
                              Back to admin
                            </span>
                          </div>
                        )}
                    </Dropdown.Menu>
                  </Dropdown>
                </ul>
              </div>
            </div>
          </div>
        </nav>
      </div>

      <Open
        largeModal={largeModal}
        setLargeModal={setLargeModal}
        modalCurrentData={modalCurrentData}
      ></Open>
    </div>
  );
};

export default Header;
