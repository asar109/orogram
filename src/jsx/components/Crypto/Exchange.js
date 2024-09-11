import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import React, { useEffect, useState } from "react";
import { Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllActiveTradeAdmin,
  getAllDepositRequest,
  getAllWithDrawRequest
} from "../../../Redux/coins";
import { getAllUsers } from "../../../Redux/user";
import cryptoicons from "../../../images/cryptoIcons/cryptoImg";
import axiosInstance from "../../../services/AxiosInstance";
import {
  ProfitLossAmount
} from "../../../services/DataService";
import TabelComponent from "../../layouts/TabelComponent";
const options = [
  { value: "1", label: "BTC" },
  { value: "2", label: "Ethereum" },
  { value: "3", label: "Ripple" },
  { value: "4", label: "Bitcoin Cash" },
  { value: "5", label: "Cardano" },
  { value: "6", label: "Litecoin" },
  { value: "7", label: "NEO" },
  { value: "8", label: "Stellar" },
  { value: "9", label: "EOS" },
  { value: "10", label: "NEM" },
];

const options2 = [
  { value: "1", label: "INR" },
  { value: "2", label: "POUND" },
  { value: "3", label: "USD" },
  { value: "4", label: "EURO" },
];

const sellOrderTable = [
  { price: "33", amount: "0.32", total: "$ 33,568" },
  { price: "74", amount: "0.12", total: "$ 34,128" },
  { price: "41", amount: "0.22", total: "$ 26,568" },
  { price: "55", amount: "0.37", total: "$ 31,568" },
  { price: "42", amount: "0.11", total: "$ 19,999" },
  { price: "35", amount: "0.32", total: "$ 39,110" },
  { price: "33", amount: "0.35", total: "$ 20,321" },
];

const tableData = [
  {
    tabid: "#TCK-01-12344",
    maintitle: "BTC",
    title: "Samanta William",
    mailid: "samantha@mail.com",
    price: "$75,00",
    status: "Paid",
  },
  {
    tabid: "#TCK-01-12345",
    maintitle: "XRP",
    title: "Tony Soap",
    mailid: "demo@mail.com",
    price: "$80,00",
    status: "Unpaid",
  },
  {
    tabid: "#TCK-01-12346",
    maintitle: "DOT",
    title: "Nela Vita",
    mailid: "nela@mail.com",
    price: "$84,00",
    status: "Pending",
  },
  {
    tabid: "#TCK-01-12347",
    maintitle: "ETH",
    title: "Nadia Edja",
    mailid: "edja@mail.com",
    price: "$90,00",
    status: "Paid",
  },
];

const Exchange = () => {
  const dispatch = useDispatch();
  const coinReducer = useSelector((store) => store.coinReducer);
  const userReducer = useSelector((store) => store.userReducer);
  const [totalcommission, setTotalCommission] = useState(0);
  const filterData = (data, type) => {
    const filteredData = data?.filter((item) => item.status === type);
    return filteredData;
  };
  const formattedDate = (item) => {
    if (!item) return;
    dayjs.extend(utc);
    dayjs.extend(timezone);
    return dayjs(item)
      .tz(Intl.DateTimeFormat().resolvedOptions().timeZone)
      .format("DD MMM YYYY HH:mm");
  };

  useEffect(() => {
    axiosInstance.get("/api/tradehistory/admincommission").then((res) => {
      setTotalCommission(
        res.data.totalCommission?.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      );
    });
  }, []);
  const chartGroup = [
    {
      title: "Users",
      number: `${userReducer.allUsers.length}`,

      // chartstatus: <LitecoinBarChart value={userReducer.allUsers.length} />,
    },
    {
      title: "Active Trades",
      number: `${coinReducer.allActiveTradeAdmin.length}`,
      //icon: "up",
      // chartstatus: <ExchangeLineChart />,
    },
    {
      title: "Total Commission",
      number: `${"$" + totalcommission}`,
      // icon: "down",
      // chartstatus: <ExchangeLineChart2 />,
    },
  ];

  useEffect(() => {
    dispatch(getAllActiveTradeAdmin());
    dispatch(getAllUsers());
    dispatch(getAllWithDrawRequest());
    dispatch(getAllDepositRequest());
    //dispatch(getAllCoin());
  }, []);

  const checkboxFun = (type) => {
    setTimeout(() => {
      const checkbox = document.querySelectorAll(".exchange-history input");
      const motherCheckBox = document.querySelector(".sorting_select input");
      for (let i = 0; i < checkbox.length; i++) {
        const element = checkbox[i];
        if (type === "all") {
          if (motherCheckBox.checked) {
            element.checked = true;
          } else {
            element.checked = false;
          }
        } else {
          if (!element.checked) {
            motherCheckBox.checked = false;
            break;
          } else {
            motherCheckBox.checked = true;
          }
        }
      }
    }, 200);
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
        title: "Markets",
        sortId: "crypto_name",
        render: (rowData) => {
          return (
            <div className=" d-flex align-items-center">
              <img
                loading="lazy"
                src={cryptoicons[rowData.crypto_symbol]}
                style={{ width: "3rem" }}
              />

              <Col>
                <h4 className="mb-0 ms-2">{rowData.crypto_name}</h4>
                <span className="text-muted ms-2">{rowData.crypto_symbol}</span>
              </Col>
            </div>
          );
        },
      },
      {
        title: "User Name",
        sortId: "user_name",
        render: (rowData) => {
          return <span>{rowData.user.user_name}</span>;
        },
      },
      {
        title: "Amount",
        sortId: "trade",
        render: (rowData) => {
          return (
            <span>
              $
              {rowData?.trade?.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          );
        },
      },
      {
        title: "Units",
        sortId: "purchase_units",
        render: (rowData) => {
          return (
            <span>
              {rowData.purchase_units.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          );
        },
      },
      {
        title: "Open",
        sortId: "trade",
        render: (rowData) => {
          return (
            <span>
              {"$" +
                rowData.crypto_purchase_price.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
            </span>
          );
        },
      },
      {
        title: "P/L($)",
        sortId: "profit_loss",
        render: (rowData) => {
          return (
            <span
              style={{
                color:
                  ProfitLossAmount(
                    rowData.purchase_units,
                    rowData.crypto_purchase_price,
                    rowData.crypto_symbol,
                    rowData.trade,
                    coinReducer
                  ) > 0
                    ? "green"
                    : "red",
              }}
            >
              {"$" +
                rowData.profit_loss.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
            </span>
          );
        },
      },
    ];
  };

  const renderTabel2 = () => {
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
        render: (rowData) => {
          return <span>{rowData?.user?.user_name}</span>;
        },
      },
      {
        title: "Amount",
        sortId: "amount",
        render: (rowData) => {
          return (
            <span>
              {" "}
              {"$" +
                (rowData?.amount?.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }) || 0)}
            </span>
          );
        },
      },
      {
        title: "Date",
        sortId: "requested_at",
        render: (rowData) => {
          return <span>{formattedDate(rowData.requested_at)}</span>;
        },
      },
    ];
  };
  const renderTabel3 = () => {
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
        render: (rowData) => {
          return <span>{rowData?.user?.user_name}</span>;
        },
      },
      {
        title: "Amount",
        sortId: "amount",
        render: (rowData) => {
          return (
            <span>
              {" "}
              {"$" +
                (rowData?.amount?.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }) || 0)}
            </span>
          );
        },
      },
      {
        title: "Date",
        sortId: "requested_at",
        render: (rowData) => {
          return <span>{formattedDate(rowData.requested_at)}</span>;
        },
      },
    ];
  };

  return (
    <>
      <div className="row">
        
        <div className="col-xl-12">
          <div className="row">
            {userReducer.allUsers.length &&
              chartGroup.map((item, i) => (
                <div className="col-lg-6 col-xl-4 col-md-6" key={i}>
                  <div className="card overflow-hidden">
                    <div className="card-body  pt-4 pd-4 pl-4 pr-4 flex align-items-center justify-content-between user_board">
                      <div className="d-flex align-items-center justify-content-between deshboard_box">
                        <h4 className="fs-18 font-w400 mb-0">{item.title}</h4>
                        <div className="d-flex align-items-center">
                          <h2 className="count-num" style={{ color: "black" }}>
                            {item.number}
                          </h2>
                          <span
                            className={`fs-16 font-w500  ps-2 ${
                              i === 1 ? "text-danger" : "text-success"
                            }`}
                          >
                            <i className={`bi pe-2 ${item.icon}-fill`}></i>
                          </span>
                        </div>
                      </div>

                      {item.chartstatus}
                    </div>
                  </div>
                </div>
              ))}
            
          </div>
        </div>

        <div className="col-xl-12">
          <div className="row">
            <div className="col-xl-12 col-lg-12">
             
              <TabelComponent
                cols={renderTabel()}
                data={coinReducer?.allActiveTradeAdmin.map((obj, index) => {
                  return {
                    ...obj,
                    count: index + 1,
                    profit_loss: ProfitLossAmount(
                      obj.purchase_units,
                      obj.crypto_purchase_price,
                      obj.crypto_symbol,
                      obj.trade,
                      coinReducer
                    ),
                    user_name: obj.user.user_name,
                  };
                })}
                tabeltitle={"Active Trades"}
                itemsPerPage={8}
                searchKey={"crypto_name"}
                searchKey2={"crypto_symbol"}
                searchPlaceholder="Search Markets"
              />
              
            </div>
           
          </div>
        </div>

        <div className="col-xl-12">
          <div className="row">
            <div className="col-xl-6 col-lg-12">
              <TabelComponent
                minHeight={"40vh"}
                cols={renderTabel2()}
                data={filterData(coinReducer?.data, "approved").map(
                  (obj, index) => {
                    return {
                      ...obj,
                      count: index + 1,
                    };
                  }
                )}
                tabeltitle={"Deposits"}
                itemsPerPage={5}
              />
            </div>
            <div className="col-xl-6 col-lg-12">
              <TabelComponent
                minHeight={"40vh"}
                cols={renderTabel3()}
                data={filterData(coinReducer?.withdrawRequest, "approved").map(
                  (obj, index) => {
                    return {
                      ...obj,
                      count: index + 1,
                    };
                  }
                )}
                tabeltitle={"Withdrawal"}
                itemsPerPage={5}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Exchange;
