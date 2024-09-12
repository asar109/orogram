import { React, useState, useEffect } from "react";
import {
  Button,
  Card,
  Col,
  Dropdown,
  Form,
  Modal,
  Nav,
  Row,
  Spinner,
  Tab,
} from "react-bootstrap";
import { connect } from "react-redux";
import cryptoicons from "../../../images/cryptoIcons/cryptoImg";
import { Link, useNavigate } from "react-router-dom";
import { successMessage, errorMessage } from "../../../utils/message";
import { createTrade } from "../../../Redux/coins";
import { getAdminSettings, getUserWallet } from "../../../Redux/user";
import { getCommissionFee } from "../../../Redux/coins";
import jwt_decode from "jwt-decode";
import Cookies from "universal-cookie";
import { AddCommissionFee } from "../../../services/DataService";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { Balance } from "@mui/icons-material";
const Open = (props) => {
  const {
    largeModal,
    setLargeModal,
    modalCurrentData,
    coinReducer,
    userWallet,
    createTradeAction,
    getAdminSettingsAction,
    getCommissionFeeAction,
  } = props;
  const dispatch = useDispatch();
  const userReducer = useSelector((state) => state.userReducer);
  const [inputValue, setInputValue] = useState();
  const [inputId, setInputId] = useState("price");
  const [tPinputId, setTPInputId] = useState("rate");
  const [sLinputId, setSLInputId] = useState("rate");
  const [stopLoss, setStopLoss] = useState();
  const [takeProfit, setTakeProfit] = useState();
  const [loader, setLoader] = useState(false);
  const [shuldSLDisabled, setShouldSLDisabled] = useState(false);
  const [shuldTPDisabled, setShouldTPDisabled] = useState(false);

  const cookies = new Cookies();
  const token = cookies.get("token");
  const user = jwt_decode(token);
  const id = user.id;

  const openTrade = (value) => {
    let val = value;
    setInputValue();
    let body = {
      user_id: id,
      crypto_name: modalCurrentData.name,
      crypto_symbol: modalCurrentData.symbol,
      crypto_purchase_price: AddCommissionFee(
        getCoinPrice(modalCurrentData?.symbol),
        coinReducer
      ),
      investment:
        inputId === "price"
          ? parseFloat(inputValue)
          : parseFloat(
            inputValue *
            AddCommissionFee(
              getCoinPrice(modalCurrentData?.symbol),
              coinReducer
            )
          ),
      stop_loss:
        sLinputId === "rate"
          ? parseFloat(stopLoss)
          : parseFloat(
            stopLoss *
            AddCommissionFee(
              getCoinPrice(modalCurrentData?.symbol),
              coinReducer
            )
          ),
      take_profit:
        tPinputId === "rate"
          ? parseFloat(takeProfit)
          : parseFloat(
            takeProfit *
            AddCommissionFee(
              getCoinPrice(modalCurrentData?.symbol),
              coinReducer
            )
          ),
    };
    console.log("body of trade", body);

    const tenPercentInvestment = body.investment * 0.1;
    // if(userWallet?.getUserWallet < 50)
    // {
    //   errorMessage("Minimum wallet balance should be 50$");
    //   setInputValue(val);
    //   return;
    // }
    if (body.stop_loss !== 0) {
      if (body.stop_loss < tenPercentInvestment) {
        errorMessage(
          "Stop loss value should be greater then 10% of the investment amount."
        );
        setInputValue(val);
        return;
      }
    }
    if (body.take_profit !== 0) {
      if (body.take_profit < tenPercentInvestment) {
        errorMessage(
          "Take profit value should be greater then 10% of the investment amount."
        );
        setInputValue(val);
        return;
      }
    }

    if (body.investment > userWallet?.getUserWallet) {
      errorMessage("You don't have enough balance to create this trade");
      setInputValue(val);
      return;
    }
    else {
      body.crypto_Original_price = getCoinPrice(modalCurrentData?.symbol);
      // check if body has null the set it to 0
      if (body.stop_loss === null) body.stop_loss = 0;
      if (body.take_profit === null) body.take_profit = 0;
      if (body.investment === null) body.investment = 0;

      createTradeAction(body).then((res) => {
        if (res) {
          setInputValue();
          setTakeProfit();
          setStopLoss();
          setLargeModal(false);
          setSLInputId("rate");
          setTPInputId("rate");
          setInputId("price");
          setLoader(false);
          setLargeModal(false);
        }
      });
    }
  };
  const getCoinPrice = (symbol) => {
    if (symbol) {
      const coin = coinReducer?.coinData.filter((d) => d.symbol === symbol);
      if (coin) return parseFloat(coin[0]?.price);
      else return 0;
    }
    return 0;
  };
  const convertSL = (price) => {
    if (sLinputId === "rate") {
      setSLInputId("units");
      const newValue =
        stopLoss /
        AddCommissionFee(getCoinPrice(modalCurrentData?.symbol), coinReducer);
      setStopLoss(newValue);
    } else {
      setSLInputId("rate");
      const newValue =
        stopLoss *
        AddCommissionFee(getCoinPrice(modalCurrentData?.symbol), coinReducer);
      setStopLoss(newValue);
    }
  };

  const convertTP = (price) => {
    if (tPinputId === "rate") {
      setTPInputId("units");
      const newValue =
        takeProfit /
        AddCommissionFee(getCoinPrice(modalCurrentData?.symbol), coinReducer);
      setTakeProfit(newValue);
    } else {
      setTPInputId("rate");
      const newValue =
        takeProfit *
        AddCommissionFee(getCoinPrice(modalCurrentData?.symbol), coinReducer);
      setTakeProfit(newValue);
    }
  };
  const getAmount = (e) => { };

  useEffect(() => {
    if (inputValue <= 0) {
      setInputValue();
    }
    if (takeProfit <= 0) {
      setTakeProfit();
    }
    if (stopLoss <= 0) {
      setStopLoss();
    }
  }, [inputValue, takeProfit, stopLoss]);
  const handleClick = () => {
    if (inputId === "price") {
      setInputId("units");
      const newValue =
        inputValue /
        AddCommissionFee(getCoinPrice(modalCurrentData?.symbol), coinReducer);
      setInputValue(newValue);
    } else {
      setInputId("price");
      const newValue =
        inputValue *
        AddCommissionFee(getCoinPrice(modalCurrentData?.symbol), coinReducer);
      setInputValue(newValue);
    }
  };

  const inputValueUnits = (
    inputValue /
    AddCommissionFee(getCoinPrice(modalCurrentData?.symbol), coinReducer)
  ).toFixed(2);
  const inputValueOnePointFivePercent = (inputValue * 0.015).toFixed(2);
  const inputValueNinetyEightPointFivePercent = (inputValue * 0.985).toFixed(2);

  useEffect(() => {
    if (modalCurrentData?.symbol) {
      if (
        (AddCommissionFee(
          getCoinPrice(modalCurrentData?.symbol),
          coinReducer
        ) === getCoinPrice(modalCurrentData?.symbol)) || (coinReducer.commissionFee !== userReducer.adminSettings?.commission)
      ) {
        setLargeModal(false);
        setTimeout(function () {
          getAdminSettingsAction();
          getCommissionFeeAction();
          window.location.reload();
        }, 1000);
      }
    }
    dispatch(getUserWallet(id));
  }, [largeModal]);

  useEffect(() => {
    if (coinReducer?.isloading) {
      setLoader(true);
    } else {
      setLoader(false);
    }
  }, [coinReducer?.isloading]);

  return (
    <Modal className="fade bd-example-modal-lg" show={largeModal} size="lg">
      <Modal.Header>
        <Modal.Title>Open Trade</Modal.Title>
        <Button
          variant=""
          className="btn-close"
          onClick={() => {
            // reset all the values
            setInputValue();
            setTakeProfit();
            setStopLoss();
            setLargeModal(false);
            setSLInputId("rate");
            setTPInputId("rate");
            setInputId("price");

            setLargeModal(false);
          }}
        ></Button>
      </Modal.Header>
      <Modal.Body style={{ backgroundColor: "#f1f1f1" }}>
        <Tab.Container defaultActiveKey="Navbuy">
          <div className="">
            <Tab.Content>
              <Tab.Pane eventKey="Navbuy">
                <Tab.Container defaultActiveKey="Navbuymarket">
                  <Card>
                    <Card.Header>
                      <Row>
                        <Col xl={2} xs={4}>
                          <img loading="lazy"
                            src={cryptoicons[modalCurrentData?.symbol]}
                            width="100%"
                          />
                        </Col>

                        <Col>
                          <h4 className="mb-0">{modalCurrentData?.name}</h4>
                          <Row>
                            <div className="d-flex justify-content-start mb-0">
                              <p className="mb-0" style={{ fontSize: "20px" }}>
                                <h3 className="mb-0">
                                  {"$ " +
                                    AddCommissionFee(
                                      getCoinPrice(modalCurrentData?.symbol),
                                      coinReducer
                                    )?.toLocaleString("us-US", {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    }) || 0}
                                </h3>
                              </p>
                              {/* <span
                                  style={{ marginTop: "0.7rem" }}
                                  className="text-green mb-0"
                                >
                                  650.89[3.04%]
                                </span> */}
                            </div>
                            <span
                              className="mb-0"
                              style={{ color: "black", fontWeight: "300" }}
                            >
                              Price by Orogram
                            </span>
                          </Row>
                        </Col>
                      </Row>
                    </Card.Header>
                    <Card.Body>
                      <Row>
                        <Col xl={1}></Col>
                        <Col xl={2}>
                          <h3 className="heading" style={{ fontSize: "20px" }}>
                            {inputId === "price" ? <>Price</> : <>Units</>}
                          </h3>
                        </Col>
                        <Col xl={6}>
                          <form style={{ marginTop: "8px" }}>
                            <div className="input-group ">
                              <span
                                className="input-group-text text-black crsr"
                                onClick={() => {
                                  if (inputValue <= 0) {
                                    setInputValue();
                                  } else {
                                    setInputValue(inputValue - 1);
                                  }
                                }}
                              >
                                -
                              </span>
                              {/* <input type="text" className="form-control" value={inputValue}/> */}
                              <input
                                type="number"
                                step="any"
                                className="form-control"
                                id={inputId}
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                              />
                              <span
                                className="input-group-text text-black crsr"
                                onClick={() =>
                                  setInputValue(parseFloat(inputValue) + 1)
                                }
                              >
                                +
                              </span>
                            </div>
                          </form>
                        </Col>
                        <Col className="unitbtn">
                          {/* <Button style={{ backgroundColor: '#3eacff', height: "3rem" }} className='btn btn-sm'><i className="material-icons">swap_horiz</i></Button> */}
                          <Button
                            variant="info"
                            className="bttn"
                            onClick={() => handleClick()}
                          >
                            <i className="material-icons">swap_horiz</i>
                            {inputId === "price" ? <>Units</> : <>Price</>}
                          </Button>
                        </Col>
                        <Col xl={1}></Col>
                      </Row>
                      <Row>
                        <div className="text-center mb-0">
                          <p style={{ color: "black", fontWeight: "300" }}>
                            {inputValue ? (
                              inputId === "price" ? (
                                <>
                                  {(
                                    inputValue /
                                    AddCommissionFee(
                                      getCoinPrice(modalCurrentData?.symbol),
                                      coinReducer
                                    )
                                  ).toFixed(2)}{" "}
                                  Units
                                </>
                              ) : (
                                <>
                                  {(
                                    inputValue *
                                    AddCommissionFee(
                                      getCoinPrice(modalCurrentData?.symbol),
                                      coinReducer
                                    )
                                  ).toLocaleString()}{" "}
                                  Price
                                </>
                              )
                            ) : (
                              <>0 {inputId}</>
                            )}{" "}
                            {/* |{" "}
                            {inputValue ? (
                              inputId === "price" ? (
                                <>
                                  {(inputValue /
                                    getCoinPrice(modalCurrentData?.symbol)) *
                                    100}
                                  % Of Equity
                                </>
                              ) : (
                                <></>
                              )
                            ) : (
                              <>0% Of Equity</>
                            )} */}
                          </p>
                        </div>
                        {/* <div className="text-center mb-0">
                          <p style={{ color: "black", fontWeight: "300" }}>

                            {inputValue ? (
                              inputId === "price" ? (
                                <>
                                  You will receive{" "}
                                  {(
                                    (inputValue * 0.985) /
                                    getCoinPrice(modalCurrentData?.symbol)
                                  ).toFixed(4)}{" "}
                                  Units
                                </>
                              ) : (
                                <>

                                </>
                              )
                            ) : (
                              <>{""}</>
                            )}{" "}
                          </p>
                          <p style={{ color: "black", fontWeight: "300" }}></p>
                        </div> */}
                      </Row>

                      <div className="custom-tab-1">
                        <Tab.Container defaultActiveKey="Posts">
                          <Nav
                            as="ul"
                            style={{ justifyContent: "space-around" }}
                          >
                            <Nav.Item as="li" className="nav-item">
                              <Nav.Link
                                to="#nosl"
                                eventKey="NoSl"
                                style={{ color: "red" }}
                                onClick={() => {
                                  setShouldSLDisabled(false);
                                }}
                              >
                                Stop Loss
                              </Nav.Link>
                            </Nav.Item>
                            {/* <Nav.Item as="li" i className="nav-item">
                                  <Nav.Link
                                    to="#take-profit"
                                    eventKey="TakeProfit" >
                                    X1
                                  </Nav.Link>
                                  <Link style={{color:"rgb(62, 172, 255)"}}
                                    onClick={() =>
                                      onClick()
                                    }
                                  >
                                    Leverage
                                  </Link>
                                </Nav.Item> */}
                            <Nav.Item as="li" i className="nav-item">
                              <Nav.Link
                                to="#take-profit"
                                eventKey="TakeProfit"
                                style={{ color: "green" }}
                                onClick={() => {
                                  setShouldTPDisabled(false);
                                }}
                              >
                                Take Profit
                              </Nav.Link>
                            </Nav.Item>
                          </Nav>
                          <Tab.Content>
                            <Tab.Pane id="nosl" eventKey="NoSl">
                              <div className="sell-element">
                                <div className="">
                                  <Row>
                                    <Col xl={1}></Col>
                                    <Col xl={2}>
                                      <h3
                                        style={{
                                          color: "#3eacff",
                                          marginTop: "10px",
                                        }}
                                      >
                                        {sLinputId === "rate" ? (
                                          <>Rate</>
                                        ) : (
                                          <>Unit</>
                                        )}
                                      </h3>
                                    </Col>
                                    <Col xl={6}>
                                      <form style={{ marginTop: "8px" }}>
                                        <div className="input-group ">
                                          <span
                                            className="input-group-text text-black"
                                            onClick={() => {
                                              if (stopLoss <= 0) {
                                                setStopLoss();
                                              } else {
                                                setStopLoss(stopLoss - 1);
                                              }
                                            }}
                                          >
                                            -
                                          </span>
                                          <input
                                            type="number"
                                            className="form-control"
                                            id={sLinputId}
                                            value={stopLoss}
                                            onChange={(e) =>
                                              setStopLoss(e.target.value)
                                            }
                                            disabled={shuldSLDisabled}
                                          />
                                          <span
                                            className="input-group-text text-black"
                                            onClick={() =>
                                              setStopLoss(
                                                parseFloat(stopLoss) + 1
                                              )
                                            }
                                          >
                                            +
                                          </span>
                                        </div>
                                      </form>
                                    </Col>
                                    <Col className="unitbtn">
                                      <Button
                                        variant="info"
                                        className="bttn"
                                        onClick={() =>
                                          convertSL(
                                            AddCommissionFee(
                                              getCoinPrice(
                                                modalCurrentData?.symbol
                                              ),
                                              coinReducer
                                            )
                                          )
                                        }
                                      >
                                        <i className="material-icons">
                                          swap_horiz
                                        </i>
                                        {sLinputId === "rate" ? (
                                          <>Units</>
                                        ) : (
                                          <>Rate</>
                                        )}
                                      </Button>
                                    </Col>
                                    <Col xl={1}></Col>
                                  </Row>
                                  <Row>
                                    <div className="text-center mb-0">
                                      {sLinputId === "rate" &&
                                        inputId === "price" && (
                                          <p>
                                            {" "}
                                            {stopLoss && inputValue ? (
                                              <>
                                                {(
                                                  (stopLoss / inputValue) *
                                                  100
                                                ).toFixed(2)}
                                                % of the Position Amount
                                              </>
                                            ) : (
                                              <>0% of the Position Amount</>
                                            )}{" "}
                                          </p>
                                        )}

                                      {sLinputId === "rate" &&
                                        inputId === "units" && (
                                          <p>
                                            {" "}
                                            {stopLoss && inputValue ? (
                                              <>
                                                {(
                                                  (stopLoss /
                                                    (inputValue *
                                                      AddCommissionFee(
                                                        getCoinPrice(
                                                          modalCurrentData?.symbol
                                                        ),
                                                        coinReducer
                                                      ))) *
                                                  100
                                                ).toFixed(2)}
                                                % of the Position Amount
                                              </>
                                            ) : (
                                              <>0% of the Position Amount</>
                                            )}{" "}
                                          </p>
                                        )}
                                      {sLinputId === "units" &&
                                        inputId === "price" && (
                                          <p>
                                            {" "}
                                            {stopLoss && inputValue ? (
                                              <>
                                                {(
                                                  ((stopLoss *
                                                    AddCommissionFee(
                                                      getCoinPrice(
                                                        modalCurrentData?.symbol
                                                      ),
                                                      coinReducer
                                                    )) /
                                                    inputValue) *
                                                  100
                                                ).toFixed(2)}
                                                % of the Position Amount
                                              </>
                                            ) : (
                                              <>0% of the Position Amount</>
                                            )}{" "}
                                          </p>
                                        )}
                                      {sLinputId === "units" &&
                                        inputId === "units" && (
                                          <p>
                                            {" "}
                                            {stopLoss && inputValue ? (
                                              <>
                                                {(
                                                  ((stopLoss *
                                                    AddCommissionFee(
                                                      getCoinPrice(
                                                        modalCurrentData?.symbol
                                                      ),
                                                      coinReducer
                                                    )) /
                                                    (inputValue *
                                                      AddCommissionFee(
                                                        getCoinPrice(
                                                          modalCurrentData?.symbol
                                                        ),
                                                        coinReducer
                                                      ))) *
                                                  100
                                                ).toFixed(2)}
                                                % of the Position Amount
                                              </>
                                            ) : (
                                              <>0% of the Position Amount</>
                                            )}{" "}
                                          </p>
                                        )}

                                      {/* <Link
                                        style={{ color: "rgb(62, 172, 255)" }}
                                        onClick={() => {
                                          setStopLoss();
                                          setShouldSLDisabled(true);
                                        }}
                                      >
                                        No SL
                                      </Link> */}
                                    </div>
                                  </Row>
                                </div>
                              </div>
                            </Tab.Pane>

                            <Tab.Pane id="take-profit" eventKey="TakeProfit">
                              <div className="sell-element">
                                <div className="">
                                  <Row>
                                    <Col xl={1}></Col>
                                    <Col xl={2}>
                                      <h3
                                        style={{
                                          color: "#3eacff",
                                          marginTop: "10px",
                                        }}
                                      >
                                        {tPinputId === "rate" ? (
                                          <>Rate</>
                                        ) : (
                                          <>Unit</>
                                        )}
                                      </h3>
                                    </Col>
                                    <Col xl={6}>
                                      <form style={{ marginTop: "8px" }}>
                                        <div className="input-group ">
                                          <span
                                            className="input-group-text text-black"
                                            onClick={() => {
                                              if (takeProfit <= 0) {
                                                setTakeProfit();
                                              } else {
                                                setTakeProfit(takeProfit - 1);
                                              }
                                            }}
                                          >
                                            -
                                          </span>
                                          <input
                                            type="number"
                                            className="form-control"
                                            id={tPinputId}
                                            value={takeProfit}
                                            onChange={(e) =>
                                              setTakeProfit(e.target.value)
                                            }
                                            disabled={shuldTPDisabled}
                                          />
                                          <span
                                            className="input-group-text text-black"
                                            onClick={() =>
                                              setTakeProfit(
                                                parseFloat(takeProfit) + 1
                                              )
                                            }
                                          >
                                            +
                                          </span>
                                        </div>
                                      </form>
                                    </Col>
                                    <Col className="unitbtn">
                                      <Button
                                        variant="info"
                                        className="bttn"
                                        onClick={() =>
                                          convertTP(
                                            getCoinPrice(
                                              modalCurrentData?.symbol
                                            )
                                          )
                                        }
                                      >
                                        <i className="material-icons">
                                          swap_horiz
                                        </i>
                                        {tPinputId === "rate" ? (
                                          <>Units</>
                                        ) : (
                                          <>Rate</>
                                        )}
                                      </Button>
                                    </Col>
                                    <Col xl={1}></Col>
                                  </Row>
                                  <Row>
                                    <div className="text-center mb-0">
                                      {tPinputId === "rate" &&
                                        inputId === "price" && (
                                          <p>
                                            {" "}
                                            {takeProfit && inputValue ? (
                                              <>
                                                {(
                                                  (takeProfit / inputValue) *
                                                  100
                                                ).toFixed(2)}
                                                % of the Position Amount
                                              </>
                                            ) : (
                                              <>0% of the Position Amount</>
                                            )}{" "}
                                          </p>
                                        )}
                                      {tPinputId === "rate" &&
                                        inputId === "units" && (
                                          <p>
                                            {" "}
                                            {takeProfit && inputValue ? (
                                              <>
                                                {(
                                                  (takeProfit /
                                                    (inputValue *
                                                      AddCommissionFee(
                                                        getCoinPrice(
                                                          modalCurrentData?.symbol
                                                        ),
                                                        coinReducer
                                                      ))) *
                                                  100
                                                ).toFixed(2)}
                                                % of the Position Amount
                                              </>
                                            ) : (
                                              <>0% of the Position Amount</>
                                            )}{" "}
                                          </p>
                                        )}
                                      {tPinputId === "units" &&
                                        inputId === "price" && (
                                          <p>
                                            {" "}
                                            {takeProfit && inputValue ? (
                                              <>
                                                {(
                                                  ((takeProfit *
                                                    AddCommissionFee(
                                                      getCoinPrice(
                                                        modalCurrentData?.symbol
                                                      ),
                                                      coinReducer
                                                    )) /
                                                    inputValue) *
                                                  100
                                                ).toFixed(2)}
                                                % of the Position Amount
                                              </>
                                            ) : (
                                              <>0% of the Position Amount</>
                                            )}{" "}
                                          </p>
                                        )}
                                      {tPinputId === "units" &&
                                        inputId === "units" && (
                                          <p>
                                            {" "}
                                            {takeProfit && inputValue ? (
                                              <>
                                                {(
                                                  ((takeProfit *
                                                    AddCommissionFee(
                                                      getCoinPrice(
                                                        modalCurrentData?.symbol
                                                      ),
                                                      coinReducer
                                                    )) /
                                                    (inputValue *
                                                      AddCommissionFee(
                                                        getCoinPrice(
                                                          modalCurrentData?.symbol
                                                        ),
                                                        coinReducer
                                                      ))) *
                                                  100
                                                ).toFixed(2)}
                                                % of the Position Amount
                                              </>
                                            ) : (
                                              <>0% of the Position Amount</>
                                            )}{" "}
                                          </p>
                                        )}
                                      {/* <Link
                                        style={{
                                          color: "rgb(62, 172, 255)",
                                          marginLeft: "2rem",
                                        }}
                                        onClick={() => {
                                          setTakeProfit();
                                          setShouldTPDisabled(true);
                                        }}
                                      >
                                        No TP
                                      </Link> */}
                                    </div>
                                  </Row>
                                </div>
                              </div>
                            </Tab.Pane>
                          </Tab.Content>
                        </Tab.Container>
                        <Card.Text>
                          <h6
                            className="mb-0"
                            style={{ textAlign: "center", marginTop: "10px" ,color:"black" }}
                          >
                            Note: Token/Coin Price Includes a {userReducer?.adminSettings?.commission}% Commission Fee. No Commission Payable on Closing of Trades.
                          </h6>
                        </Card.Text>
                      </div>
                    </Card.Body>
                  </Card>
                  <Modal.Footer
                    style={{ justifyContent: "center", textAlign: "center" }}
                  >
                    <Col>
                      <h6 className="mb-0" style={{ paddingBottom: "5px" }}>
                        Available $
                        {userWallet?.getUserWallet?.toLocaleString("us-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }) || 0}
                      </h6>
                      {!loader && (
                        <Button
                          className="open"
                          variant="info"
                          style={{ color: "white" }}
                          onClick={() => openTrade(inputValue)}
                        >
                          Open Trade
                        </Button>
                      )}
                      {loader && (
                        <Button
                          className="open"
                          variant="info"
                          style={{ color: "white" }}
                          disabled
                        >
                          <Spinner></Spinner>
                        </Button>
                      )}
                    </Col>
                  </Modal.Footer>
                  <p style={{ textAlign: "center" }}>
                   By opening this trade you accept our <span> </span>
                    <Link target="_blank" to="https://www.primecryptoexchange.com/terms-conditions/" style={{ color: "rgb(62, 172, 255)" }}>
                    Terms & Conditions
                    </Link>
                  </p>
                </Tab.Container>
              </Tab.Pane>
            </Tab.Content>
          </div>
        </Tab.Container>
      </Modal.Body>
    </Modal>
  );
};

const mapStateToProps = (state) => ({
  coinReducer: state.coinReducer,
  userWallet: state.userReducer,
  userReducer: state.userReducer,
});

const mapDispatchToProps = {
  // call createTrade action here
  createTradeAction: (data) => createTrade(data),
  getAdminSettingsAction: () => getAdminSettings(),
  getCommissionFeeAction: () => getCommissionFee(),
};

export default connect(mapStateToProps, mapDispatchToProps)(Open);
