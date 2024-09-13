import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import jwt_decode from "jwt-decode";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";

import {
  getAllWithdrawalsByUserId
} from "../../../Redux/user";
import TabelComponent from "../../layouts/TabelComponent";

const DataTable = ({ header, description, rows, columns, trade = false }) => {
  const [data, setData] = useState(
    document.querySelectorAll("#market_wrapper tbody tr")
  );
  const [largeModal, setLargeModal] = useState(false);
  const [noSl, setNoSl] = useState(true);
  const navigate = useNavigate();
  const sort = 6;
  const activePag = useRef(0);
  const [test, settest] = useState(0);
  const cookies = new Cookies();
  const dispatch = useDispatch();
  const token = cookies.get("token");
  const user = jwt_decode(token);
  const id = user.id;
  //use s
  //const requests = useSelector((state) => state.userReducer);

  const buyNow = (value) => {
    console.log("row clicked", value);
    // navigate("/coin-details")
    setLargeModal(true);
  };

  // Active data
  const chageData = (frist, sec) => {
    for (var i = 0; i < data.length; ++i) {
      if (i >= frist && i < sec) {
        data[i].classList.remove("d-none");
      } else {
        data[i].classList.add("d-none");
      }
    }
  };
  // use effect
  // useEffect(() => {
  //     setData(document.querySelectorAll("#market_wrapper tbody tr"));

  //     //chackboxFun();
  // }, [test]);

  // useEffect(() => {
  //   dispatch(getAllWithdrawalsByUserId(id));
  // }, []);
  const requests = useSelector((state) => state.userReducer);
  // Active pagginarion
  activePag.current === 0 && chageData(0, sort);
  // paggination
  // let paggination = Array(Math.ceil(data.length / sort))
  //   .fill()
  //   .map((_, i) => i + 1);

  // Active paggination & chage data
  const onClick = (i) => {
    activePag.current = i;
    chageData(activePag.current * sort, (activePag.current + 1) * sort);
    settest(i);
  };

  const [sortD, setSort] = useState({ columnName: "", sortType: "asc" });

  const onSort = (columnName) => {
    let sortType = "asc";
    if (sortD.columnName === columnName && sortD.sortType === "asc") {
      sortType = "desc";
    }
    setSort({ columnName, sortType });
  };
  const sortData = (rows, columnName, sortType) => {
    return [...rows].sort((a, b) => {
      if (sortType === "asc") {
        if (a[columnName] < b[columnName]) return -1;
        if (a[columnName] > b[columnName]) return 1;
      } else {
        if (a[columnName] < b[columnName]) return 1;
        if (a[columnName] > b[columnName]) return -1;
      }
      return 0;
    });
  };
  const formattedDate = (item) => {
    if (!item) return;
    dayjs.extend(utc);
    dayjs.extend(timezone);
    return dayjs(item).tz(Intl.DateTimeFormat().resolvedOptions().timeZone).format("DD MMM YYYY HH:mm");
  };
  const renderTabel = () => {
    return [
      {
        title: "In Order",
        sortId: "count",
        render: (rowData) => {
          return <span style={{ color: "black" }}>{rowData.count}</span>;
        },
      },
    
   
      {
        title: "Amount",
        sortId: "amount",
        render: (rowData) => {
          return (
            <span style={{ color: "black" }}>
              $
              {rowData.amount?.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }) || 0}
            </span>
          );
        },
      },
      {
        title: "Withdraw Type",
        render: (rowData) => {
          return <span>{rowData.withdraw_type}</span>;
        },
      },
      {
        title: "Status",
        render: (rowData) => {
          return (
            <span style={{ color: "black" }}>
              {rowData.status === "pending" ? (
                <span className="badge badge-warning">Pending</span>
              ) : rowData.status === "approved" ? (
                <span className="badge badge-success">Approved</span>
              ) : (
                <span className="badge badge-danger">Rejected</span>
              )}
            </span>
          );
        },
      },
      {
        title: "Date Time",
        sortId: "requested_at",
        render: (rowData) => {
          return (
            <span style={{ color: "black" }}>
              {formattedDate(rowData.requested_at)}
            </span>
          );
        },
      },
    ];
  };
  return (
    <TabelComponent
      cols={renderTabel()}
      tabeltitle={header}
        data={
          header === "Deposit Requests"
            ? requests?.getAllUserDeposits.map((obj, index) => {
                return {
                  ...obj,
                  count: index + 1,
                  
                };
              })
            : requests?.getAllUserWithdrawals.map((obj, index) => {
                return {
                  ...obj,
                  count: index + 1,
                };
              })
        }
      // data={requests?.transactionHistory?.map((obj, index) => {
      //   return {
      //     ...obj,
      //     count: index + 1,
      //   };
      // })}
      itemsPerPage={10}
    />
  );
};

export default DataTable;
