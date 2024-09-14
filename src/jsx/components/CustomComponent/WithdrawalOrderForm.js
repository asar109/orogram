import { useEffect, useState } from "react";
import { Button, ButtonGroup, Row, Spinner, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { withdrawAmount } from "../../../Redux/coins";
import qrCode from '../../../images/qr.png'

const WithdrawalOrderForm = () => {
  const [data, setData] = useState("");
  const navigate = useNavigate();
  let errorsObj = { data: "" };
  const [errors, setErrors] = useState(errorsObj);
  const [withdraw_type, setWithdraw_type] = useState("USDT");
  // const [usd, setUsd] = useState(false);
  // const [bank, setBank] = useState(true);

  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const postDeposit = (e) => {
    e.preventDefault();
    let error = false;
    const errorObj = { ...errorsObj };
    if (data === "") {
      errorObj.data = "Input is Required";
      error = true;
    }
    if (withdraw_type === "USDT") {
      if (data < 100) {
        errorObj.data = "Minimum Withdrawal Amount is 100 USDT";
        error = true;
      }
    }
    if (withdraw_type === "USD") {
      if (data < 5000) {
        errorObj.data = "Minimum Withdrawal Amount is 5000 USDT";
        error = true;
      }
    }

    setErrors(errorObj);
    if (error) {
      return;
    }
    // dispatch(postWithdrawalAction(data))
    // setData('');
    let body = {
      amount: data,
      withdraw_type,
      user_id: state.userReducer.currentUser.id,
    };
    console.log(body, "body from withdrawal");

    const res =  dispatch(withdrawAmount(body));
    res.then((res) => {
    
        setTimeout(() => {
          navigate("/transaction-history");
        }, 1000);
      
     
    });
    console.log(res, "res ");
  };
  const isloadingUser = useSelector((state) => state.coinReducer.isloading);
  const [loader, setLoader] = useState(false);
  useEffect(() => {
    if (isloadingUser) {
      setLoader(true);
    } else {
      setLoader(false);
    }
  }, [isloadingUser]);
  return (
    <>
      <form onSubmit={postDeposit} className="border-4">
        <h2
          className=" d-flex justify-content-center"
          style={{ marginBottom: "1rem", color: "black" }}
        >
          Withdraw
        </h2>

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
                setWithdraw_type("USDT");
              }}
              style={{
                backgroundColor: withdraw_type === "USDT" ? "#3eacff" : "#fff",
                color: withdraw_type === "USDT" ? "#fff" : "#3eacff",
                borderColor: "white",
              }}
              variant="secondary"
            >
              USDT
            </Button>
            <Button
              onClick={() => {
                setWithdraw_type("USD");
              }}
              style={{
                backgroundColor: withdraw_type === "USD" ? "#3eacff" : "#fff",
                color: withdraw_type === "USD" ? "#fff" : "#3eacff",
                borderColor: "white",
              }}
              variant="secondary"
            >
              USD
            </Button>
          </ButtonGroup>
        </Row>
        <div style={{
          width: "100%",
          display: 'flex',
          justifyContent: "center",
          alignItems : 'center'
        }}>

          <img src={qrCode} width={"200px"} />
        </div>

        {withdraw_type === "USDT" && (
          <p style={{ fontSize: "14px" }}>
            Enter the USD amount you would like to withdraw from your account.
            USDT 100 minimum to Crypto Wallet.
            <Link style={{ color: "#3eacff" }} to="/app-profile">
              {" "}
              Update Pay-Out Details
            </Link>
          </p>
        )}
        {withdraw_type === "USD" && (
          <p style={{ fontSize: "14px" }}>
            Withdrawal to Bank Account,
            <Link
              style={{ color: "#3eacff" }}
              to="https://www.primecryptoexchange.com/faq/withdrawing-fiat-currency/"
            >
              {" "}
              Please First Read Here{" "}
            </Link>
            *Ensure that you have updated pay-out details prior to submitting a
            withdrawal request.
            <Link style={{ color: "#3eacff" }} to="/app-profile">
              {" "}
              Update Pay-Out Details
            </Link>
          </p>
        )}

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
            <span className="input-group-text">{withdraw_type}</span>
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
              style={{ backgroundColor: "#3eacff", color: "white" }}
              variant="info"
            >
              Withdraw
            </Button>
          )}
          {loader && (
            <div
              type="submit"
              className="btn w-50 text-white"
              style={{ backgroundColor: "#3eacff", color: "white" }}
              variant="info"
            >
              <Spinner></Spinner>
            </div>
          )}
        </div>
        <ToastContainer />
      </form>
    </>
  );
};
export default WithdrawalOrderForm;
