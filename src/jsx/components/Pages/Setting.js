import { useState } from "react";
import { Button, ButtonGroup, Col, Row, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  getCommissionFee,
  setCommissionFee,
  withdrawAmount,
  setCommissionFeeRedux,
} from "../../../Redux/coins";
import { ToastContainer, toast } from "react-toastify";
import PageTitle from "../../layouts/PageTitle";
import { postWithdrawalAction } from "../../../store/actions/WithdrawalAction";
import { useEffect } from "react";
import { getAdminSettings } from "../../../Redux/user";
const Setting = () => {
  let errorsObj = { data: "", apiKey: "" };
  const [errors, setErrors] = useState(errorsObj);
  const coinReducer = useSelector((state) => state.coinReducer);
  const userReducer = useSelector((state) => state.userReducer);
  const dispatch = useDispatch();
  // const state = useSelector((state) => state);
  const [data, setData] = useState(userReducer?.adminSettings.commission);
  const [apiKey, setApiKey] = useState(userReducer?.adminSettings.marketApiKey);
  const [coinApi, setCoinApi] = useState(false);
  const [commission, setCommission] = useState(true);

  useEffect(() => {
    dispatch(getAdminSettings()).then((res) => {
      console.log(res, "res of admin settings");
    });
  }, []);

  const postDeposit = (e) => {
    e.preventDefault();
    let error = false;
    const errorObj = { ...errorsObj };
    if (data === "") {
      errorObj.data = "Input is Required";
      error = true;
    }
    setErrors(errorObj);
    if (error) {
      return;
    }
    // dispatch(postWithdrawalAction(data))
    // setData('');
    let body = {
      commission: data,
      pk: userReducer?.adminSettings.id ? userReducer?.adminSettings.id : null,
    };
    console.log(body, "body from commission");

    const res = dispatch(setCommissionFee(body)).then((res) => {
      dispatch(getAdminSettings());
      dispatch(setCommissionFeeRedux(data));
      if (res) {
        toast.success("Successfully Set Commission Fee");
      }
    });
    console.log(res, "res of commission");
  };
  const changeApi = (e) => {
    e.preventDefault();
    let error = false;
    const errorObj = { ...errorsObj };
    if (apiKey === "") {
      errorObj.apiKey = "Input is Required";
      error = true;
    }
    setErrors(errorObj);
    if (error) {
      return;
    }
    let body = {
      marketApiKey: apiKey,
      pk: userReducer?.adminSettings.id ? userReducer?.adminSettings.id : null,
    };
    console.log(body, "body from api key");

    const res = dispatch(setCommissionFee(body)).then((res) => {
      dispatch(getAdminSettings());
      if (res) {
        toast.success("Successfully Set API key");
      }
    });
    console.log(res, "res of api key");
  };

  const [loader, setLoader] = useState(false);
  useEffect(() => {
    if (coinReducer.isloadingUser) {
      setLoader(true);
    } else {
      setLoader(false);
    }
  }, [coinReducer.isloadingUser]);
  useEffect(() => {
    dispatch(getCommissionFee());
  }, []);
  return (
    <>
      <Col>
        <PageTitle
          activeMenu="Settings"
          motherMenu="Dashboard"
          link="admin-dashboard"
        />
        <Row>
          <ButtonGroup
            style={{
              width: "30%",
              marginBottom: "30px",
              "@media (maxWidth: 575px)": {
                marginTop: "50%",
              },
            }}
            aria-label="Basic example"
          >
            <Button
              onClick={() => {
                setCommission(true);
                setCoinApi(false);
              }}
              style={{
                backgroundColor: commission ? "#3eacff" : "#fff",
                color: commission ? "#fff" : "#3eacff",
                borderColor: "white",
              }}
              variant="secondary"
            >
              Set Commission
            </Button>
            <Button
              onClick={() => {
                setCommission(false);
                setCoinApi(true);
              }}
              style={{
                backgroundColor: coinApi ? "#3eacff" : "#fff",
                color: coinApi ? "#fff" : "#3eacff",
                borderColor: "white",
              }}
              variant="secondary"
            >
              Set CoinApi
            </Button>
          </ButtonGroup>
        </Row>
        {commission ? (
          <Row>
            <Col xs={3}></Col>
            <Col xs={12} lg={6}>
              <div
                className="card h-auto border-1"
                style={{ marginTop: "7.5rem" }}
              >
                <div className="card-body ">
                  <div className="sell-element ">
                    <form onSubmit={postDeposit} className="border-4">
                      <h2
                        className=" d-flex justify-content-center"
                        style={{ marginBottom: "1rem" }}
                      >
                        Admin Commission
                      </h2>
                      <p className=" d-flex justify-content-center">
                        Enter % for admin commission.
                      </p>
                      <div className="sell-blance ">
                        {errors.data && (
                          <div className="text-danger fs-12">{errors.data}</div>
                        )}

                        <div className="input-group  d-flex justify-content-center">
                          <input
                            type="number"
                            value={data}
                            onChange={(e) => setData(e.target.value)}
                            className="form-control form-control-sm"
                            placeholder="0.00"
                          />
                          <span className="input-group-text">%</span>
                        </div>
                      </div>
                      <div
                        className="text-center  d-flex justify-content-center "
                        style={{ marginTop: "2rem", marginLeft: "1rem" }}
                      >
                        {!loader && (
                          <Button
                            type="submit"
                            className="btn w-50 text-white"
                            style={{
                              backgroundColor: "#3eacff",
                              color: "white",
                            }}
                            variant="info"
                          >
                            Set Commission
                          </Button>
                        )}
                        {loader && (
                          <Button
                            type="submit"
                            className="btn w-50 text-white"
                            style={{
                              backgroundColor: "#3eacff",
                              color: "white",
                            }}
                            variant="info"
                          >
                            <Spinner></Spinner>
                          </Button>
                        )}
                      </div>
                      <ToastContainer />
                    </form>
                  </div>
                </div>
              </div>
            </Col>
            <Col xs={3}></Col>
          </Row>
        ) : (
          <Row>
            <Col xs={3}></Col>
            <Col xs={12} lg={6}>
              <div
                className="card h-auto border-1"
                style={{ marginTop: "7.5rem" }}
              >
                <div className="card-body ">
                  <div className="sell-element ">
                    <form onSubmit={changeApi} className="border-4">
                      <h2
                        className=" d-flex justify-content-center"
                        style={{ marginBottom: "1rem" }}
                      >
                        Coin Market Api
                      </h2>
                      <p className=" d-flex justify-content-center">
                        Enter Api key for Coin Market.
                      </p>
                      <div className="sell-blance ">
                        {errors.apiKey && (
                          <div className="text-danger fs-12">
                            {errors.apiKey}
                          </div>
                        )}

                        <div className="input-group  d-flex justify-content-center">
                          <input
                            type="text"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            className="form-control form-control-sm"
                            placeholder="key"
                          />
                        </div>
                      </div>
                      <div
                        className="text-center  d-flex justify-content-center "
                        style={{ marginTop: "2rem", marginLeft: "1rem" }}
                      >
                        {!loader && (
                          <Button
                            type="submit"
                            className="btn w-50 text-white"
                            style={{
                              backgroundColor: "#3eacff",
                              color: "white",
                            }}
                            variant="info"
                          >
                            Set CoinApi
                          </Button>
                        )}
                        {loader && (
                          <div
                            type="submit"
                            className="btn w-50 text-white"
                            style={{
                              backgroundColor: "#3eacff",
                              color: "white",
                            }}
                            variant="info"
                          >
                            <Spinner></Spinner>
                          </div>
                        )}
                      </div>
                      <ToastContainer />
                    </form>
                  </div>
                </div>
              </div>
            </Col>
            <Col xs={3}></Col>
          </Row>
        )}
      </Col>
    </>
  );
};
export default Setting;
