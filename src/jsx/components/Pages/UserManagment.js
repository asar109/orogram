import { React, useEffect, useState } from "react";
import PageTitle from "../../layouts/PageTitle";
import TabelComponent from "../../layouts/TabelComponent";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { usermanagment, updateUser, switchAccount } from "../../../Redux/user";
import { Button } from "react-bootstrap";
import CurrencyFormat from "react-currency-format";
import Cookies from "universal-cookie";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { toast, ToastContainer } from "react-toastify";
import AdminTransferModal from "./AdminTransferModal";
const cookies = new Cookies();
const UserManagment = () => {
  const navigate = useNavigate();
  const [AddressModal, setAddressModal] = useState(false);
  const [id, setid] = useState(0);

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
      {
        title: "In Order",
        sortId: "id",
        render: (rowData) => {
          return <span>{rowData.count}</span>;
        },
      },
      {
        title: "User Name",
        sortId: "user_name",
        render: (rowData) => {
          return <span>{rowData.user_name}</span>;
        },
      },
      {
        title: "Email",
        sortId: "email",
        render: (rowData) => {
          return <span>{rowData.email}</span>;
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
                  {/* <Button
                    onClick={() => {
                      setAddressModal(true);
                      setid(rowData.id,)
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
                  </Button> */}
                </>
              ) : !rowData.is_active_user && !rowData.is_admin ? (
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
                      backgroundColor: "green",
                      borderColor: "green",
                      color: "white",
                    }}
                    size="sm"
                  >
                    Activate
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
    dispatch(usermanagment());
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

  return (
    <>
      <AdminTransferModal
        show={AddressModal}
        handleClose={() => setAddressModal(false)}
        id={id}
      />


      <PageTitle
        activeMenu="User Management"
        motherMenu="Dashboard"
        link="admin-dashboard"
      />
      <TabelComponent
        cols={renderTabel()}
        data={userRequests.usermangement.map((item, index) => ({
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
export default UserManagment;
