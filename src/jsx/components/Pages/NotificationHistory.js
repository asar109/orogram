import { React, useEffect, useState } from "react";
import PageTitle from "../../layouts/PageTitle";
import TabelComponent from "../../layouts/TabelComponent";
import { useNavigate } from "react-router-dom";
import {
  usermanagment,
  updateUser,
  switchAccount,
  getNotifcation,
  userReducer,
} from "../../../Redux/user";
import { Button, Spinner } from "react-bootstrap";
import CurrencyFormat from "react-currency-format";
import Cookies from "universal-cookie";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { useSelector, useDispatch } from "react-redux";
import axiosInstance from "../../../services/AxiosInstance";
import { errorMessage, successMessage } from "../../../utils/message";
import io from "socket.io-client";
const env = process.env.NODE_ENV === 'development' ? process.env.REACT_APP_DEV_MODE : process.env.REACT_APP_PRO_MODE;
const socket = io(env);

const cookies = new Cookies();

const UserManagment = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const notification = useSelector((state) => state.userReducer.notification);
  const [loader, setLoader] = useState(false);

  // const [contant, setContant] = useState("");
  const semdNotify = async (id) => {
    //filter the content of the notification where id is equal to the id of the notification
    const content = notification?.filter((item) => item.id === id);
    setLoader(true);
    try {
      const res = await axiosInstance
        .post(`/api/admin/notification/`, { content: content[0].content })
        .catch((err) => {
          console.log(err.response.data, "err.response.data");
        });
      if (res.status === 200) {
        setLoader(false);
        console.log(res.data, "notification send successfully");
        successMessage("Notification Sent Successfully");
        // dispatch(getNotifcation());
        return res.data;
      }
    } catch (err) {
      setLoader(false);
      errorMessage(err.response.data || err.message);
      console.log(err);
    }
  };

  useEffect(() => {
    socket.on("newNotification", (data) => {
      console.log("messagefrom server", data);
      dispatch(getNotifcation()).then((res) => {
        console.log("notification", notification);
        console.log("res", res);
      });
    });
  }, []);
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
        title: "Message",
        render: (rowData) => {
          return <span style={{ textAlign: "left" }}>{rowData.content}</span>;
        },
      },
      {
        title: "Date",
        sortId: "created_at",
        render: (rowData) => {
          return <span>{formattedDate(rowData.created_at)}</span>;
        },
      },
      {
        title: "Action",
        render: (rowData) => {
          return (
            <div>
              <>
                <Button
                  // onClick={semdNotify(rowData.id)}
                  onClick={() => semdNotify(rowData.id)}
                  //className="open2"
                  variant="info"
                  style={{ backgroundColor: "#3eacff", color: "white" }}
                >
                  Send
                </Button>
              </>
            </div>
          );
        },
      },
    ];
  };

  const dummy = [
    {
      id: 1,
      message: "    ",
      created_at: "2021-05-18T12:00:00Z",
    },
  ];

  return (
    <>
      <PageTitle
        activeMenu="Notification History"
        motherMenu="Dashboard"
        link="admin-dashboard"
      />

      <TabelComponent
        cols={renderTabel()}
        data={notification?.map((item, index) => ({
          ...item,
          count: index + 1,
        }))}
        itemsPerPage={6}
        searchKey={"content"}
        searchPlaceholder="Search Message"
      />
    </>
  );
};
export default UserManagment;
