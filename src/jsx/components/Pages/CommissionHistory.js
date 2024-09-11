import React, { useState } from "react";
import {
  Button,
  ButtonGroup,
  Card,
  Col,
  Modal,
  Row,
  Tab,
} from "react-bootstrap";
import PageTitle from "../../layouts/PageTitle";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import TabelComponent from "../../layouts/TabelComponent";
import { useDispatch, useSelector } from "react-redux";
import cryptoicons from "../../../images/cryptoIcons/cryptoImg";

import {
  getAllWithDrawRequest,
  updateWithdrawStatus,
  getAllTradeHistory,
} from "../../../Redux/coins";
import CurrencyFormat from "react-currency-format";
import { AllInclusiveTwoTone } from "@mui/icons-material";

const CommissionHistory = () => {
  const [all, setAll] = useState(true);
  const [daily, setDaily] = useState(false);
  const [weekly, setweekly] = useState(false);
  const [monthly, setMonthly] = useState(false);
  const [largeModal, setLargeModal] = useState(false);
  const [modalCurrentData, setModalCurrentData] = useState();
  const [rejectedReason, setRejectedReason] = useState(
    "Your request is rejected"
  );
  const dispatch = useDispatch();
  const requests = useSelector((state) => state.coinReducer);
  const [cardData, setCardData] = useState(requests?.allTradeHistory);

  const getData = async () => {
    const res = await dispatch(getAllWithDrawRequest());
    console.log(res);
  };

  const formattedDate = (item) => {
    if (!item) return;
    dayjs.extend(utc);
    dayjs.extend(timezone);
    return dayjs(item).tz(Intl.DateTimeFormat().resolvedOptions().timeZone).format("DD MMM YYYY HH:mm");
  };
  const profitLossAmount = (profit, loss, open, close) => {
    let ProfitLoss = 0;
    ProfitLoss = profit + loss;
    //ProfitLoss = ProfitLoss - (open + close);
    console.log(ProfitLoss, "ProfitLoss");
    return ProfitLoss || 0;
  };
  const profitLossPercentage = (profit, loss, trade, open, close) => {
    let ProfitLoss = 0;
    let profitLossPercent = 0;
    ProfitLoss = profit + loss;
    // ProfitLoss = ProfitLoss - (open + close);
    profitLossPercent = (ProfitLoss / trade) * 100;

    console.log(ProfitLoss, "ProfitLoss%");
    return profitLossPercent || 0;
  };

  React.useEffect(() => {
    getData();
    dispatch(getAllTradeHistory());
  }, []);
  React.useEffect(() => {
    setCardData(requests?.allTradeHistory);
  }, [requests?.allTradeHistory]);
  const renderTabelAll = () => {
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

            < span style={{ color: "black" }
            }>
              {" "}
              $
              {
                (rowData.crypto_sale_price
                )?.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }) || "Active Trade"
              }
            </span >
          );
        },
      },
      {
        title: "Date Closed",
        sortId: "closed_at",
        render: (rowData) => {
          return (
            <span style={{ color: "black" }}>
              {formattedDate(rowData.closed_at) || "Trade Active"}
            </span>
          );
        },
      },
      {
        title: "Admin Commission",
        sortId: "open_admin_profit",
        render: (rowData) => {
          return (
            <span style={{ color: "black" }}>
              $
              {

                rowData.open_admin_profit

                  ?.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }) || 0}
            </span>
          );
        }
      },
      {
        title: "P/L($)",
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
                    rowData.close_admin_profit,
                  ) > 0
                    ? "green"
                    : "red",
              }}
            >
              $
              {(
                Math.round(
                  profitLossAmount(
                    rowData.actual_loss,
                    rowData.actual_profit,
                    rowData.open_admin_profit,
                    rowData.close_admin_profit,
                  ) * 1000
                ) / 1000
              )?.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }) || 0}
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
                  ) > 0
                    ? "green"
                    : "red",
              }}
            >
              {
                profitLossPercentage(
                  rowData.actual_loss,
                  rowData.actual_profit,
                  rowData.investment,
                  rowData.open_admin_profit,
                  rowData.close_admin_profit,
                )

                  ?.toLocaleString("en-US", {
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

  const data = ["", "", ""];
  // filer data of requests.allTradeHistor to current week
  const currentWeek = () => {
    let today = new Date();
    // let first = today.getDate() - today.getDay();
    // let last = first + 6;
    let firstday = new Date(today.setDate(today.getDate() - today.getDay()));
    let lastday = new Date(today.setDate(today.getDate() - today.getDay() + 6));
    let firstday1 = firstday.toISOString().split("T")[0];
    let lastday1 = lastday.toISOString().split("T")[0];
    const filterData = requests.allTradeHistory.filter((item) => {
      return (
        new Date(item.open_at).toISOString().split("T")[0] >= firstday1 &&
        new Date(item.open_at).toISOString().split("T")[0] <= lastday1
      );
    });
    return filterData;
  };

  const currentmonth = () => {
    const today = new Date();
    const firstday = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastday = new Date(today.getFullYear(), today.getMonth() + 2, 0);
    const firstday1 = firstday.toISOString().split("T")[0];

    const lastday1 = lastday.toISOString().split("T")[0];
    const filterData = requests.allTradeHistory.filter((item) => {
      return (
        new Date(item.open_at).toISOString().split("T")[0] >= firstday1 &&
        new Date(item.open_at).toISOString().split("T")[0] <= lastday1
      );
    });

    return filterData;
  };
  // get the current day
  const currentDay = () => {
    const today = new Date();
    const firstday = today.toISOString().split("T")[0];
    const filterData = requests.allTradeHistory.filter((item) => {
      return new Date(item.open_at).toISOString().split("T")[0] === firstday;
    });
    return filterData;
  };

  const allData = () => {
    return requests.allTradeHistory;
  };
  function calculatePercentage(number, percentage) {
    return (number * percentage) / 100;
  }
  return (
    <>
      <PageTitle
        activeMenu="Commission History"
        motherMenu="Dashboard"
        link="admin-dashboard"
      />

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
            setweekly(false);
            setMonthly(false);
            setDaily(false);
            setAll(true);
            setCardData(allData);
          }}
          style={{
            backgroundColor: all ? "#3eacff" : "#fff",
            color: all ? "#fff" : "#3eacff",
            borderColor: "white",
          }}
          variant="infor"
        >
          All
        </Button>
        <Button
          onClick={() => {
            setweekly(false);
            setMonthly(false);
            setDaily(true);
            setAll(false);
            setCardData(currentDay);
          }}
          style={{
            backgroundColor: daily ? "#3eacff" : "#fff",
            color: daily ? "#fff" : "#3eacff",
            borderColor: "white",
          }}
          variant="info"
        >
          Daily
        </Button>
        <Button
          onClick={() => {
            setweekly(true);
            setMonthly(false);
            setDaily(false);
            setAll(false);
            setCardData(currentWeek);
          }}
          style={{
            backgroundColor: weekly ? "#3eacff" : "#fff",
            color: weekly ? "#fff" : "#3eacff",
            borderColor: "white",
          }}
          variant="info"
        >
          Weekly
        </Button>
        <Button
          onClick={() => {
            setweekly(false);
            setMonthly(true);
            setDaily(false);
            setAll(false);
            setCardData(currentmonth);
          }}
          style={{
            backgroundColor: monthly ? "#3eacff" : "#fff",
            color: monthly ? "#fff" : "#3eacff",
            borderColor: "white",
          }}
          variant="info"
        >
          Monthly
        </Button>
      </ButtonGroup>

      {all && (
        <TabelComponent
          cols={renderTabelAll()}
          data={allData()?.map((obj, index) => {
            return {
              ...obj,
              count: index + 1,
              user_name: obj.user.user_name,
              commission: obj.open_admin_profit + obj.close_admin_profit,
            };
          })}
          // tabeltitle={"All"}
          itemsPerPage={8}
          searchKey={"crypto_name"}
          searchKey2={"crypto_symbol"}
          searchPlaceholder="Search Markets"
        />
      )}

      {daily && (
        <TabelComponent
          cols={renderTabelAll()}
          data={currentDay()?.map((obj, index) => {
            return {
              ...obj,
              count: index + 1,
              user_name: obj.user.user_name,
              commission: (
                obj.open_admin_profit + obj.close_admin_profit
              )?.toFixed(2),
            };
          })}
          // tabeltitle={"Daily"}
          itemsPerPage={8}
          searchKey={"crypto_name"}
          searchKey2={"crypto_symbol"}
          searchPlaceholder="Search by Markets"
        />
      )}
      {weekly && (
        <TabelComponent
          cols={renderTabelAll()}
          data={currentWeek()?.map((obj, index) => {
            return {
              ...obj,
              count: index + 1,
              user_name: obj.user.user_name,
              commission: obj.open_admin_profit + obj.close_admin_profit,
            };
          })}
          // tabeltitle={"Weekly"}
          itemsPerPage={8}
          searchKey={"crypto_name"}
          searchKey2={"crypto_symbol"}
          searchPlaceholder="Search by Markets"

        />
      )}
      {monthly && (
        <TabelComponent
          cols={renderTabelAll()}
          data={currentmonth()?.map((obj, index) => {
            return {
              ...obj,
              count: index + 1,
              user_name: obj.user.user_name,
              commission: obj.open_admin_profit + obj.close_admin_profit,
            };
          })}
          // tabeltitle={"Monthly"}
          itemsPerPage={8}
          searchKey={"crypto_name"}
          searchKey2={"crypto_symbol"}
          searchPlaceholder="Search by Markets"
        />
      )}

      <Card>
        <Card.Body>
          <Row
            style={{ fontSize: "20px ", color: "black", marginLeft: "1rem" }}
          >
            <Col xs={12} sm={6} lg={6} xl={3}>
              <Card.Text>
                $
                {cardData
                  ?.reduce(function (acc, obj) {
                    if (obj.partial_user_value) {
                      return acc + obj.partial_user_value

                    }
                    else {
                      return acc + obj.investment
                    }

                  }, 0)
                  ?.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }) || 0}
              </Card.Text>
              <Card.Text className="fw-bold">Total Invested</Card.Text>
            </Col>
            <Col xs={12} sm={6} lg={6} xl={3}>
              <Card.Text>
                $
                {cardData
                  ?.reduce(function (acc, obj) {
                    return (
                      acc += obj.open_admin_profit
                    );
                  }, 0)
                  ?.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }) || 0}
              </Card.Text>
              <Card.Text className="fw-bold">Total Commission</Card.Text>
            </Col>
            {/* <Col xs={12} sm={6} lg={6} xl={3}>
              <Card.Text>
                $
                {calculatePercentage(cardData
                  ?.reduce(function (acc, obj) {
                    if (obj.partial_user_value) {
                      return acc + obj.partial_user_value

                    }
                    else {
                      return acc + obj.investment
                    }

                  }, 0), 98.5).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2, }) || 0}
              </Card.Text>
              <Card.Text className="fw-bold">Total Trade</Card.Text>
            </Col> */}
            {/* <Col xs={12} sm={6} lg={6} xl={3}>
              <Card.Text>
                ${" "}
                {cardData
                  ?.reduce(function (acc, obj) {
                    return (
                      acc +
                      Math.round(
                        profitLossAmount(
                          obj.actual_loss,
                          obj.actual_profit,
                          obj.open_admin_profit,
                          obj.close_admin_profit,
                        ) * 1000
                      ) /
                      1000
                    );
                  }, 0)
                  ?.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }) || 0}
              </Card.Text>
              <Card.Text className="fw-bold">Profit/Loss</Card.Text>
            </Col> */}
          </Row>
        </Card.Body>
      </Card>
    </>
  );
};

export default CommissionHistory;
