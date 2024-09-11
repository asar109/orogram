import jwt_decode from "jwt-decode";
import { useEffect, useRef, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";

//import bitcoin from "../../../images/coins/btc.png";
import cryptoicons from "../../../images/cryptoIcons/cryptoImg";

import Cookies from "universal-cookie";

import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { getTradeHistory } from "../../../Redux/coins";
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
  useEffect(() => {
    setData(document.querySelectorAll("#market_wrapper tbody tr"));
    //chackboxFun();
  }, [test]);

  // Active pagginarion
  activePag.current === 0 && chageData(0, sort);
  // paggination
  let paggination = Array(Math.ceil(data.length / sort))
    .fill()
    .map((_, i) => i + 1);

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
  const cookies = new Cookies();
  const token = cookies.get("token");
  const user = jwt_decode(token);
  const id = user.id;
  const dispatch = useDispatch();

  const requests = useSelector((state) => state.coinReducer);
  const [tradeHistory, setTradeHistory] = useState(requests?.tradeHistory);

  //create varibale that calculate the sum of all tradeHistory investment and profit loss amount
  const totalInvestment = requests?.tradeHistory
    .reduce((accumulator, trade) => {
      return accumulator + trade.investment
    }, 0)


  const totalProfitLossAmount = requests?.tradeHistory
    .reduce((accumulator, trade) => {
      return accumulator + trade.actual_loss + trade.actual_profit;
    }, 0)


  console.log("requests", requests);
  let body = {
    user_id: id,
  };

  useEffect(() => {
    dispatch(getTradeHistory(body));
    // const interval = setInterval(() => {
    //   const res = dispatch(getTradeHistory(body));
    // }, 5000);

    // return () => {
    //   clearInterval(interval);
    // };
  }, []);
  const profitLossAmount = (profit, loss, open, close) => {

    let ProfitLoss = 0;
    ProfitLoss = profit + loss;
    // ProfitLoss = ProfitLoss - (open + close);
    console.log(ProfitLoss, "ProfitLoss");
    return ProfitLoss || 0;
  };
  // create function that calculate the profit loss percentage
  const PercentageCal = (first, secound) => {
    let percentage = 0;
    percentage = (first / secound) * 100;
    return percentage || 0;

  }



  const profitLossPercentage = (profit, loss, trade, open, close) => {
    let ProfitLoss = 0;
    let profitLossPercent = 0;
    ProfitLoss = profit + loss;
    // ProfitLoss = ProfitLoss - (open + close);
    profitLossPercent = (ProfitLoss / trade) * 100;

    console.log(ProfitLoss, "ProfitLoss%");
    return profitLossPercent || 0;
  };
  const renderTabel = () => {
    return [
      {
        title: "In Order",
        sortId: "id",
        render: (rowData) => {
          return <span style={{ color: "black" }}>{rowData.count}</span>;
        },
      },
      {
        title: "Assets",
        sortId: "crypto_name",
        render: (rowData) => {
          return (
            <div className="market-title d-flex align-items-center ">
              <img loading="lazy"
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
        title: "Invested",
        sortId: "investment",
        render: (rowData) => {
          return (
            <span style={{ color: "black" }}>
              $
              {(rowData.investment
                ? rowData.investment
                : rowData.investment
              ).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || 0}
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
              {rowData.purchase_units?.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }) || 0}
            </span>
          );
        },
      },
      {
        title: "Open",
        sortId: "crypto_purchase_price",
        render: (rowData) => {
          return (
            <span>
              {" "}
              $
              {rowData.crypto_purchase_price?.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }) || 0}
            </span>
          );
        },
      },
      {
        title: "Date Opened",
        sortId: "open_at",
        render: (rowData) => {
          return (
            <span style={{ color: "black" }}>
              {formattedDate(rowData.open_at)}
            </span>
          );
        },
      },
      {
        title: "Close",
        sortId: "crypto_sale_price",
        render: (rowData) => {
          return (
            <span style={{ color: "black" }}>
              {" "}
              $
              {(rowData.crypto_sale_price
              )?.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }) || 0}
            </span>
          );
        },
      },
      {
        title: "Date Closed",
        sortId: "closed_at",
        render: (rowData) => {
          return (
            <span style={{ color: "black" }}>
              {formattedDate(rowData.closed_at)}
            </span>
          );
        },
      },
      {
        title: "P/L($) ",
        sortId: "profitloss_$",
        render: (rowData) => {
          return (
            <span
              style={{
                color:
                  profitLossAmount(
                    rowData.actual_loss,
                    rowData.actual_profit,
                    rowData.open_admin_profit,
                    rowData.close_admin_profit
                  ) > 0
                    ? "green"
                    : "red",
              }}
            >
              $
              {rowData.profitloss_$?.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }) || 0
              }
            </span>
          );
        },
      },
      {
        title: "P/L(%)",
        sortId: "profitloss_p",
        render: (rowData) => {
          return (
            <span
              style={{
                color:
                  profitLossPercentage(
                    rowData.actual_loss,
                    rowData.actual_profit,
                    rowData.investment,
                    rowData.open_admin_profit,
                    rowData.close_admin_profit,
                  )

                    > 0
                    ? "green"
                    : "red",
              }}
            >
              {(

                profitLossPercentage(
                  rowData.actual_loss,
                  rowData.actual_profit,
                  rowData.investment,
                  rowData.open_admin_profit,
                  rowData.close_admin_profit,
                )

              )?.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }) || 0}
              %
            </span>
          );
        },
      },
    ];
  };
  // formattedDate function
  const formattedDate = (item) => {
    if (!item) return;
    dayjs.extend(utc);
    dayjs.extend(timezone);
    return dayjs(item).tz(Intl.DateTimeFormat().resolvedOptions().timeZone).format("DD MMM YYYY HH:mm");
  };
  return (
    <>
      <ToastContainer />
      <TabelComponent
        cols={renderTabel()}
        data={requests?.tradeHistory.map((obj, index) => {
          return {
            ...obj,
            count: index + 1,
            profitloss_$: (obj.actual_loss + obj.actual_profit),
            profitloss_p: obj.actual_loss / 100 * (obj.investment - obj.partialy_closed),
          };
        })}
        tabeltitle={""}
        itemsPerPage={5}
        searchKey="crypto_name"
        searchKey2={"crypto_symbol"}
        searchPlaceholder="Search Asset"
      />
      <Card>
        <Card.Body>
          <Row
            style={{ fontSize: "20px ", color: "black", marginLeft: "1rem" }}
          >
            <Col xs={12} sm={12} lg={4} xl={4}>
              <Card.Text>
                $
                {totalInvestment?.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }) || 0}
              </Card.Text>
              <Card.Text className="fw-bold">Total Invested</Card.Text>
            </Col>
            <Col xs={12} sm={12} lg={4} xl={4}>
              <Card.Text
                style={{
                  color: totalProfitLossAmount > 0 ? "green" : "red",
                }}
              >
                $
                {(
                  Math.round(totalProfitLossAmount * 100) / 100
                )?.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }) || 0}
              </Card.Text>
              <Card.Text className="fw-bold">Profit/Loss $</Card.Text>
            </Col>
            <Col xs={12} sm={12} lg={4} xl={4} >
              <Card.Text
                style={{
                  color:
                    PercentageCal(totalProfitLossAmount, totalInvestment) > 0
                      ? "green"
                      : "red",
                }}
              >
                {(
                  PercentageCal(totalProfitLossAmount, totalInvestment)
                )?.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }) + "%" || 0}
              </Card.Text>
              <Card.Text className="fw-bold">Profit/Loss %</Card.Text>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </>
  );
};

export default DataTable;
