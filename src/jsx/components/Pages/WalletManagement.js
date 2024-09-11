import { React, useEffect, useState } from "react";
import PageTitle from "../../layouts/PageTitle";
import TabelComponent from "../../layouts/TabelComponent";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  usermanagment,
  walletmanagment,
  updateUser,
  switchAccount,
  walletTranfer,
} from "../../../Redux/user";
import { Button } from "react-bootstrap";
import CurrencyFormat from "react-currency-format";
import Cookies from "universal-cookie";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { toast, ToastContainer } from "react-toastify";
import AdminTransferModal from "./AdminTransferModal";

const cookies = new Cookies();
const WalletManagement = () => {
  const navigate = useNavigate();
  const [AddressModal, setAddressModal] = useState(false);
  const [transferModal, setTransferModal] = useState("")
  const zero = 0;
  const callApi = async (data) => {
    cookies.set("previoustoken", cookies.get("token"));
    const res = await dispatch(switchAccount(data));
    console.log("response==", res.payload.access);
    cookies.set("token", res.payload.access);
    window.location.replace("/dashboard");
  };
  const formattedDate = (item) => {
    if (!item) return;
    dayjs.extend(utc);
    dayjs.extend(timezone);
    return dayjs(item)
      .tz(Intl.DateTimeFormat().resolvedOptions().timeZone)
      .format("DD MMM YYYY HH:mm");
  };
  const renderTabel = () => {
    return [
      // {
      //   title: "In Order",
      //   sortId: "id",
      //   render: (rowData) => {
      //     return <span>{rowData.count}</span>;
      //   },
      // },
      {
        title: "User Name",
        sortId: "id",
        render: (rowData) => {
          return <span>{rowData.user_name}</span>;
        },
      },
      {
        title: "Ethereum",
        sortId: "ethAddress",
        render: (rowData) => {
          return (
            <>
              <span>{rowData.ethAddress}</span>
              <div style={{ fontWeight: "600" }}>
                USDT :<span>{rowData.usdtEthBalance}</span> <span>ETH :</span>
                <span>{rowData.ethBalance}</span>{" "}
              </div>
            </>
          );
        },
      },
      {
        title: "Tron",
        sortId: "tronAddress",
        render: (rowData) => {
          return (
            <>
              <span>{rowData.tronAddress}</span>
              <div style={{ fontWeight: "600" }}>
                USDT :<span>{rowData.usdtTronBalance}</span> <span>TRX :</span>
                <span>{rowData.trxBalance}</span>{" "}
              </div>
            </>
          );
        },
      },
      {
        title: "Binance Smart Chain (BSC)",
        sortId: "bscAddress",
        render: (rowData) => {
          return (
            <>
              <span>{rowData.bscAddress}</span>
              <div style={{ fontWeight: "600" }}>
                USDT :<span>{rowData.usdtBscBalance}</span> <span>BNB :</span>
                <span>{rowData.bnbBalance}</span>{" "}
              </div>
            </>
          );
        },
      },
      // {
      //   title: "Date",
      //   sortId: "created_at",
      //   render: (rowData) => {
      //     return <span>{formattedDate(rowData.created_at)}</span>;
      //   },
      // },
      {
        title: "Available Balance",
        sortId: "balance",
        render: (rowData) => {
          return (
            <span>
              {"$"}
              {(rowData?.balance &&
                rowData?.balance?.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })) ||
                zero.toFixed(2)}
            </span>
          );
        },
      },
      {
        title: "Action",
        render: (rowData) => {
          return (
            <div>
              {rowData.is_active_user && !rowData.is_admin ? (
                <>
                  <Button
                    onClick={() =>
                      handleActive({
                        id: rowData.id,
                        value: rowData.is_active_user,
                      })
                    }
                    variant="info"
                    style={{
                      backgroundColor: "red",
                      borderColor: "red",
                      color: "white",
                    }}
                    size="sm"
                  >
                    Suspend
                  </Button>
                  <Button
                    onClick={() => callApi(rowData)}
                    variant="info"
                    style={{
                      backgroundColor: "#3eacff",
                      color: "white",
                      marginLeft: "3px",
                    }}
                    size="sm"
                  >
                    Access
                  </Button>
                </>
              ) : !rowData.is_active_user && !rowData.is_admin ? (
                <>
                  <Button
                    onClick={() => {
                      setAddressModal(true);
                      debugger
                      setTransferModal(rowData.user_id)
                    }}
                    variant="info"
                    style={{
                      backgroundColor: "#1D5B79",
                      color: "white",
                      marginLeft: "3px",
                    }}
                    size="sm"
                  >
                    Transfer
                  </Button>
                </>
              ) : (
                <Button
                  variant="info"
                  size="sm"
                  style={{ color: "red", background: "none", border: "none" }}
                >
                  Admin
                </Button>
              )}
              { }
            </div>
          );
        },
      },
    ];
  };
  const userRequests = useSelector((state) => state.userReducer);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(walletmanagment());
  }, []);

  const handleActive = (id) => {
    dispatch(updateUser(id, { is_active_user: !id.value })).then((res) => {
      if (res) {
        if (id.value) {
          toast.success("User Suspended Successfully");
        } else {
          toast.success("User Activated Successfully");
        }
      }
    });
  };
  console.log(userRequests.walletmangement, "balance");
  return (
    <>
      <AdminTransferModal
        show={AddressModal}
        id={transferModal}
        handleClose={() => {
          setAddressModal(false);
        }}
      />
      <PageTitle
        activeMenu="Wallet Management"
        motherMenu="Dashboard"
        link="admin-dashboard"
      />
      <TabelComponent
        cols={renderTabel()}
        data={userRequests?.walletmangement?.map((item, index) => ({
          ...item,
          count: index + 1,
        }))}
        itemsPerPage={5}
        searchKey={"user_name"}
        searchPlaceholder="Search User Name"
      />
      <ToastContainer />
    </>
  );
};
export default WalletManagement;
