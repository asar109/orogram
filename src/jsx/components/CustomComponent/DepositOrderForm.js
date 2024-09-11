import { Link } from "react-router-dom";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { postDepositAction } from "../../../store/actions/DepositAction";
import { Button } from "react-bootstrap";
import { depositAmount } from "../../../Redux/coins";
import { ToastContainer, toast } from "react-toastify";
import { Spinner } from "react-bootstrap";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { successMessage, errorMessage } from "../../../utils/message";
import DepositeOrderFormModal from "./DepositeOrderFormModal";

const DepositOrderForm = () => {
  const navigate = useNavigate();
  const state = useSelector((state) => state);
  const [data, setData] = useState("");
  const [AddressModal, setAddressModal] = useState(false);

  let errorsObj = { data: "" };
  const [errors, setErrors] = useState(errorsObj);
  const dispatch = useDispatch();
  const postDeposit = (e) => {
    e.preventDefault();

    // dispatch(postDepositAction(data))
    // setData('');
    let error = false;
    const errorObj = { ...errorsObj };
    if (data === "") {
      errorObj.data = "Amount is Required";
      error = true;
      return;
    }
    setErrors(errorObj);
    if (error) {
      return;
    }

    let body = {
      amount: data,
      user_id: state?.userReducer?.currentUser?.id,
    };
    console.log(body, "body");

    const res = dispatch(depositAmount(body));
    res.then((res) => {
      if (res.payload.status === 200) {
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      } else {
      }
    });
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
  let body = {
    amount: data,
    user_id: state?.userReducer?.currentUser?.id,
  };
  return (
    <>
      <DepositeOrderFormModal
        show={AddressModal}
        body={body}
        amount={data}
        handleClose={() => {
          setAddressModal(false);
        }}
      />
      <form onSubmit={postDeposit} className="border-4">
        <h2
          className=" d-flex justify-content-center"
          style={{ marginBottom: "1rem", color:"black" }}
        >
          Deposit
        </h2>
        <p style={{fontSize:"14px"}} className=" d-flex justify-content-center">
          Enter the USD amount you would like to deposit to your account No minimum amount required.
        </p>
        <div className="sell-blance ">
          <div className="input-group  d-flex justify-content-center">
            <input
              type="number"
              value={data}
              onChange={(e) => setData(e.target.value)}
              className="form-control form-control-sm"
              placeholder="0.00"
            />
            <span className="input-group-text">USD</span>
          </div>
          {errors.data && (
            <div className="text-danger fs-12">{errors.data}</div>
          )}
        </div>
        <div
          className="text-center  d-flex justify-content-center "
          style={{ marginTop: "2rem", marginLeft: "1rem" }}
        >

          <Button
            // type="submit"
            className="btn w-50 text-white"
            style={{ backgroundColor: "#3eacff", color: "white" }}
            variant="info"
            onClick={() => {
              if (data <= 0) {
                errorMessage("Amount must be greater then $0");
                return;
              }

              setAddressModal(true);
            }}
          >
            Pay with USDT
          </Button>
        
         
          
          {/* {loader && (
            <div
              type="submit"
              className="btn w-50 text-white"
              style={{ backgroundColor: "#3eacff", color: "white" }}
              variant="info"
            >
              <Spinner></Spinner>
            </div>
          )} */}
        </div>
        <div style={{fontSize: "14px", display: "flex", justifyContent: "center", margin: "10px"}}>
          <p style={{ fontSize: "14px" }} >To deposit FIAT Currency
            <a style={{ color: "#3eacff" }} href="https://www.primecryptoexchange.com/faq/depositing-fiat-currency/"> Please Read Here </a>
          </p>
          </div>
        <ToastContainer />
      </form>
    </>
  );
};
export default DepositOrderForm;
