import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import {
  Button,
  Card,
  Col,
  Form,
  Modal,
  Nav,
  Row,
  Spinner,
  Tab,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { Table } from "react-bootstrap";
import jwt_decode from "jwt-decode";

import bitcoin from "../../../../images/coins/btc.png";
import Cookies from "universal-cookie";
import {
  getAllCoin,
  getAllTrade,
  partialTradeClose,
  tradeClose,
  updateTradeProfitLoss,
} from "../../../../Redux/coins";
import { useDispatch, useSelector } from "react-redux";
import cryptoicons from "../../../../images/cryptoIcons/cryptoImg";
import { ToastContainer } from "react-toastify";
import TabelComponent from "../../../layouts/TabelComponent";
import { PortableWifiOff, TrendingUpTwoTone } from "@mui/icons-material";
import { getUserWallet } from "../../../../Redux/user";
import CurrencyFormat from "react-currency-format";
import { errorMessage } from "../../../../utils/message";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import {
  AddCommissionFee,
  ProfitLossAmount,
  ProfitLossPercentage,
} from "../../../../services/DataService";
import PortfolioDetials from "./PortfolioDetials";
const DataTable = ({ header, description, rows, columns, trade = false }) => {
  const [data, setData] = useState(
    document.querySelectorAll("#market_wrapper tbody tr")
  );
  const requests = useSelector((state) => state.coinReducer);
  const [show, setShow] = useState(false);
  const [largeModal, setLargeModal] = useState(false);
  const [inputValue, setInputValue] = useState();
  const [inputId, setInputId] = useState("price");
  const [tPinputId, setTPInputId] = useState("rate");
  const [sLinputId, setSLInputId] = useState("rate");
  const [modalCurrentData, setModalCurrentData] = useState();
  const [currentPLAmount, setCurrentPLAmount] = useState();
  const [clicked, setClicked] = useState(false);
  const [symbol, setSymbol] = useState("");
  const [reduceData, setReduceData] = useState([]);
  const [stopLoss, setStopLoss] = useState(modalCurrentData?.stop_loss);
  const [takeProfit, setTakeProfit] = useState(modalCurrentData?.take_profit);
  const navigate = useNavigate();
  const sort = 6;
  const activePag = useRef(0);
  const [test, settest] = useState(0);
  const [activeCoin, setactiveCoin] = useState();
  const [plCopy, setplCopy] = useState();

  const convertSL = (price) => {
    if (sLinputId === "rate") {
      setSLInputId("units");
      const newValue = stopLoss / price;
      setStopLoss(newValue);
    } else {
      setSLInputId("rate");
      const newValue = stopLoss * price;
      setStopLoss(newValue);
    }
  };

  const convertTP = (price) => {
    if (tPinputId === "rate") {
      setTPInputId("units");
      const newValue = takeProfit / price;
      setTakeProfit(newValue);
    } else {
      setTPInputId("rate");
      const newValue = takeProfit * price;
      setTakeProfit(newValue);
    }
  };

  const buyNow = (value, pl) => {
    console.log("row clicked", value);
    let symbol = requests.coinData?.filter(
      (item) => item.symbol === value?.crypto_symbol
    );

    const temp = { ...value, price: symbol[0].price };
    setModalCurrentData(temp);
    setCurrentPLAmount(pl);
    setactiveCoin(value);
    setplCopy(pl);
    // navigate("/coin-details")
    setLargeModal(true);
  };

  const refresh = () => {
    if (activeCoin) {
      requests?.coinData?.map((item) => {
        if (item.symbol === activeCoin.crypto_symbol) {
          const temp = { ...activeCoin, price: item.price };
          setModalCurrentData(temp);
          setCurrentPLAmount(
            ProfitLossAmount(
              activeCoin.purchase_units,
              activeCoin.crypto_purchase_price,
              activeCoin.crypto_symbol,
              activeCoin.trade,
              requests
            )
          );
        }
      });
    }
  };

  const handleClose = () => {
    setInputValue();
    setLargeModal(false);
    setIsChecked(false);

    dispatch(getUserWallet(id));

  };
  const handleCloseUpdate = () => {
    setInputId("price");
    setTPInputId("rate");
    setSLInputId("rate");
    setIsChecked(false);
    setShow(false);
    dispatch(getUserWallet(id));

  };

  const handleShow = (value) => {
    setStopLoss(value?.stop_loss);
    setTakeProfit(value?.take_profit);
    setModalCurrentData(value);

    setShow(true);
  };
  console.log(modalCurrentData, "modal current data");

  const UpdateTrade = () => {
    let loss = modalCurrentData?.stop_loss,
      profit = modalCurrentData?.take_profit;
    if (sLinputId === "rate") {
      loss = parseFloat(stopLoss);
    } else {
      loss = parseFloat(stopLoss) * modalCurrentData.crypto_purchase_price;
    }
    if (tPinputId === "rate") {
      profit = parseFloat(takeProfit);
    } else {
      profit = parseFloat(takeProfit) * modalCurrentData.crypto_purchase_price;
    }

    let body = {
      id: modalCurrentData?.id,
      stop_loss: loss ? loss : 0,
      take_profit: profit ? profit : 0,
    };
    console.log("body from update", body);

    const tenPercentInvestment = modalCurrentData.trade * 0.1;
    if (body.stop_loss !== 0) {
      if (body.stop_loss < tenPercentInvestment) {
        errorMessage(
          "Stop loss value should be greater then 10% of the investment amount."
        );
        return;
      }
    }
    if (body.take_profit !== 0) {
      if (body.take_profit < tenPercentInvestment) {
        errorMessage(
          "Take profit value should be greater then 10% of the investment amount."
        );
        return;
      }
    }

    dispatch(updateTradeProfitLoss(body)).then((res) => {
      if (res.payload?.status === 200) {
        handleCloseUpdate();
      }
    });
  };
  console.log("modalCurrentData", modalCurrentData);
  console.log("currentPLAmount", currentPLAmount);

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

  useEffect(() => {
    if (inputValue <= 0) {
      setInputValue();
    }
    if (takeProfit <= 0) {
      setTakeProfit();
    }
    if (stopLoss <= 0) {
      setStopLoss();
    }
  }, [inputValue, takeProfit, stopLoss]);

  const dispatch = useDispatch();
  const cookies = new Cookies();
  const token = cookies.get("token");
  const user = jwt_decode(token);
  const id = user.id;

  useEffect(() => {
    dispatch(getUserWallet(id));
  }, []);

  const userWallet = useSelector((state) => state.userReducer);
  const load = () => {

    let body = {
      user_id: id,
    };

    dispatch(getAllTrade(body)).then((tradeDataAction) => {
      const coinData = requests.coinData;
      const tradeData = tradeDataAction.payload;

      console.log(coinData, "coinData from reducer");
      console.log(tradeData, "tradeData from reducer");

      const result = Object.values(
        tradeData.reduce((acc, cur) => {
          let previousPrice = coinData.find(
            (item) => item.symbol === cur.crypto_symbol
          );
          console.log(previousPrice, "previousPrice from reducer");

          const key = cur.crypto_symbol;
          if (!acc[key]) {
            acc[key] = {
              crypto_symbol: cur.crypto_symbol,
              trade: cur.trade,
              Count: 1,
              total_trade: cur.trade,
              admin_profit: cur.admin_profit,
              crypto_name: cur.crypto_name,
              crypto_purchase_price: cur.crypto_purchase_price,
              total_crypto_purchase_price: cur.crypto_purchase_price,
              id: cur.id,
              invested_date: cur.invested_date,
              trade: cur.trade,
              purchase_units: cur.purchase_units,
              stop_loss: cur.stop_loss,
              take_profit: cur.take_profit,
              user_id: cur.user_id,
              profitLoss:
                (previousPrice?.price - cur.crypto_purchase_price) *
                cur.purchase_units,
            };
          } else {
            acc[key].trade += cur.trade;
            acc[key].purchase_units += cur.purchase_units;
            acc[key].Count++;
            acc[key].total_trade += cur.trade;
            acc[key].crypto_purchase_price += cur.crypto_purchase_price;
            acc[key].profitLoss +=
              (previousPrice?.price - cur.crypto_purchase_price) *
              cur.purchase_units;
          }
          return acc;
        }, {})
      ).map((obj) => {
        obj.trade = obj.total_trade;
        // obj.trade = obj.total_trade / obj.Count;

        obj.crypto_purchase_price = obj.crypto_purchase_price / obj.Count;
        // obj.profitLoss =
        //   obj.profitLoss - obj.investment * (requests.commissionFee / 100);
        obj.price = coinData.find(
          (item) => item.symbol === obj.crypto_symbol
        )?.price;
        delete obj.total_trade;
        delete obj.total_crypto_purchase_price;
        delete obj.Count;
        return obj;
      });
      setReduceData(result);
    });
    refresh();
  }

  useEffect(() => {
    load();
  }, []);
  useEffect(() => {
    load();
  }, [largeModal, userWallet.totalProfitLoss, requests.coinData]);

  useEffect(() => {

    load();
  }, [clicked]);

  const ConvertAmount = (price) => {
    if (inputId === "price") {
      setInputId("units");
      const newValue = inputValue / price;
      setInputValue(newValue.toFixed(2));
    } else {
      setInputId("price");
      const newValue = inputValue * price;
      setInputValue(newValue.toFixed(2));
    }
  };

  const handleClick = (item) => {
    setSymbol(item.crypto_symbol);
    setClicked(true);
  };
  const filterDataForCoin = () => {
    const filteredData = requests?.tradeData?.filter(
      (item) => item.crypto_symbol === symbol
    );
    console.log(filteredData, "filteredDataForCoin");
    return filteredData;
  };

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

  const closetrade = () => {

    console.log("checking close trade");
    if (requests?.coinData) {
      let previousPrice = requests.coinData.find(
        (item) => item.symbol === modalCurrentData?.crypto_symbol
      );
      console.log(previousPrice, "previousPrice from closetrade");
      if (isChecked) {
        let P_value = 0;
        if (inputId === "price") {
          P_value = parseFloat(inputValue);
        } else {
          P_value =
            parseFloat(inputValue) * modalCurrentData?.crypto_purchase_price;
        }

        if (inputValue > 0) {
          let body = {
            user_id: id,
            trade_id: modalCurrentData?.id,
            partial_trade_close_amount: P_value,
            crypto_sale_price: modalCurrentData?.crypto_Original_price,
            trade_type: "partial",
            crypto_Original_price: getCoinPrice(
              modalCurrentData?.crypto_symbol
            ),
          };
          console.log(body, "body of partial close trade");

          dispatch(partialTradeClose(body)).then((res) => {
            if (res?.payload?.status === 200) {
              handleClose();
              setTimeout(() => {
                setClicked(false);
              }, 1000);

            }
          });
        } else {
          return alert("Please enter amount");
        }
      } else {
        let body = {
          id: modalCurrentData?.id,
          crypto_sale_price: modalCurrentData?.crypto_Original_price,
          crypto_Original_price: getCoinPrice(modalCurrentData?.crypto_symbol),
        };
        console.log(body, "body of close trade");
        const res = dispatch(tradeClose(body)).then((res) => {
          console.log(res, "res of partial close trade");
          handleClose();
          setTimeout(() => {
            setClicked(false);
          }, 1000);

        });
        console.log(res, "res of close trade");
      }
    }
  };
  const [isChecked, setIsChecked] = useState(false);

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
            <span>
              <div className="market-title d-flex align-items-center ">
                <img loading="lazy"
                  src={cryptoicons[rowData.crypto_symbol]}
                  style={{
                    textAlign: "left",
                    width: "3rem",
                    cursor: "pointer",
                  }}
                  onClick={() => handleClick(rowData)}
                />
                <Col>
                  <h4 className="mb-0 ms-2">{rowData.crypto_name}</h4>
                  <span className="text-muted ms-2">
                    {rowData.crypto_symbol}
                  </span>
                </Col>
              </div>
            </span>
          );
        },
      },

      {
        title: "Amount",
        sortId: "trade",
        render: (rowData) => {
          return (
            <span style={{ color: "black" }}>
              $
              {rowData.trade?.toLocaleString("en-US", {
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
            <span style={{ color: rowData.change > 0 ? "black" : "black" }}>
              {" "}
              {rowData.purchase_units?.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          );
        },
      },
      {
        title: " Current Price",
        sortId: "coin_price",
        render: (rowData) => {
          return (
            <span style={{ color: "black" }}>
              $
              {getCoinPrice(rowData.crypto_symbol)?.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          );
        },
      },
      {
        title: "Avg. Open Price",
        sortId: "crypto_purchase_price",
        render: (rowData) => {
          return (
            <span style={{ color: "black" }}>
              {" "}
              $
              {rowData.crypto_purchase_price?.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          );
        },
      },
      {
        title: "P/L($)",
        sortId: "profitLoss",
        render: (rowData) => {
          return (
            <span
              style={{
                color: rowData.profitLoss > 0 ? "green" : "red",
              }}
            >
              $
              {rowData.profitLoss?.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          );
        },
      },
      {
        title: "Detail",
        render: (rowData) => {
          return (
            <span
              color="primary"
              onClick={() => handleClick(rowData)}
              style={{ cursor: "pointer" }}
            >
              <i className="fa fa-eye" />
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
          return <span style={{ color: "black" }}>{rowData.count}</span>;
        },
      },
      {
        title: "Assets",
        sortId: "crypto_symbol",
        render: (rowData) => {
          return (
            <div className="market-title d-flex align-items-center">
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
        title: "Amount",
        sortId: "trade",
        render: (rowData) => {
          return (
            <span style={{ color: "black" }}>
              $
              {rowData.trade?.toLocaleString("en-US", {
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
            <span style={{ color: rowData.change > 0 ? "black" : "black" }}>
              {rowData.purchase_units?.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          );
        },
      },
      {
        title: "Open",
        sortId: "crypto_purchase_price",
        render: (rowData) => {
          return (
            <span style={{ color: "black" }}>
              {" "}
              $
              {rowData.crypto_purchase_price?.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          );
        },
      },
      {
        title: "SL",
        sortId: "stop_loss",
        render: (rowData) => {
          const sl = rowData.stop_loss;
          return (
            <span
              className="text-center"
              style={{
                border: "1px solid #D3D3D3",
                padding: "6px 18px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
              onClick={() => handleShow(rowData)}
            >
              {sl
                ? sl.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
                : "----"}
            </span>
          );
        },
      },
      {
        title: "TP",
        sortId: "take_profit",
        render: (rowData) => {
          const tp = rowData.take_profit;
          return (
            <span
              className="text-center"
              style={{
                border: "1px solid #D3D3D3",
                padding: "6px 18px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
              onClick={() => handleShow(rowData)}
            >
              {tp
                ? tp.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
                : "----"}
            </span>
          );
        },
      },
      {
        title: "P/L($)",
        sortId: "profitloss_$",
        render: (rowData) => {
          return (
            <span
              style={{
                color: rowData.profitloss_$ > 0 ? "green" : "red",
              }}
            >
              ${" "}
              {rowData.profitloss_$?.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
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
                  ProfitLossPercentage(
                    rowData.purchase_units,
                    rowData.crypto_purchase_price,
                    rowData.crypto_symbol,
                    rowData.trade,
                    requests
                  ) > 0
                    ? "green"
                    : "red",
              }}
            >
              {ProfitLossPercentage(
                rowData.purchase_units,
                rowData.crypto_purchase_price,
                rowData.crypto_symbol,
                rowData.trade,
                requests
              ).toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
              %
            </span>
          );
        },
      },
      {
        title: "Action",
        render: (rowData) => {
          return (
            <span>
              <Button
                variant="outline-danger"
                style={{
                  borderRadius: "50px ",
                  padding: "5px 15px",
                  fontSize: "10px bold",
                  //   '&:hover': {
                  //     backgroundColor: 'red',
                  //     color: 'black',
                  //   }
                }}
                onClick={() =>
                  buyNow(
                    rowData,
                    ProfitLossAmount(
                      rowData.purchase_units,
                      rowData.crypto_purchase_price,
                      rowData.crypto_symbol,
                      rowData.trade,
                      requests
                    )
                  )
                }
              >
                Close
              </Button>
            </span>
          );
        },
      },
    ];
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
  const getCoinPrice = (symbol) => {
    if (symbol) {
      const coin = requests.coinData.filter((d) => d.symbol === symbol);
      return parseFloat(coin[0]?.price);
    }
    return 0;
  };

  return (
    <>
      <ToastContainer />
      {clicked && (
        <Button
          onClick={() => setClicked(false)}
          variant="link"
          size="lg"
          className="colorprimary"
        >
          Back
        </Button>
      )}
      <div className="col-xl-12">
        {clicked === false ? (
          <>
            <TabelComponent
              cols={renderTabel()}
              data={reduceData.map((obj, index) => {
                return {
                  ...obj,
                  count: index + 1,
                  coin_price: getCoinPrice(obj.crypto_symbol),
                };
              })}
              tabeltitle={""}
              itemsPerPage={10}
              searchKey={"crypto_name"}
              searchKey2={"crypto_symbol"}
              searchPlaceholder="Search Assets"
            />
          </>
        ) : (
          <PortfolioDetials
            symbol={symbol}
            handleShow={handleShow}
            buyNow={buyNow}


          ></PortfolioDetials>
        )}
      </div>

      <Modal className="fade bd-example-modal-lg" show={largeModal} size="lg">
        <Modal.Header>
          <Modal.Title>Close Trade</Modal.Title>
          <Button
            variant=""
            className="btn-close"
            onHide={() => handleClose()}
            onClick={() => {
              handleClose();
            }}
          ></Button>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: "#f1f1f1" }}>
          <Tab.Container defaultActiveKey="Navbuy">
            <div className="">
              <Tab.Content>
                <Tab.Pane eventKey="Navbuy">
                  <Tab.Container defaultActiveKey="Navbuymarket">
                    <Row>
                      <Col xl={2} xs={4}>
                        <img loading="lazy"
                          src={cryptoicons[modalCurrentData?.crypto_symbol]}
                          width="100%"
                        />
                      </Col>
                      <Col>
                        <h4 className="mb-0"></h4>
                        <Row>
                          <div style={{ flexDirection: "column" }}>
                            <p className="mb-0" style={{ fontSize: "20px" }}>
                              <h3
                                className="mb-0 text-[black]"
                                style={{ color: "black" }}
                              >
                                {modalCurrentData?.crypto_name}
                              </h3>
                            </p>
                            <span
                              style={{
                                marginTop: "0.4rem",
                                flexDirection: "column",
                                color: "black",
                              }}
                              className="text-[black] mb-0"
                            >
                              {"$ " +
                                getCoinPrice(
                                  modalCurrentData?.crypto_symbol
                                )?.toLocaleString("us-US", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                            </span>
                          </div>
                        </Row>
                      </Col>
                      <Col
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "end",
                        }}
                      ></Col>
                    </Row>
                    <Card style={{ marginTop: "1rem" }}>
                      <Card.Header
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "start",
                        }}
                      >
                        <Row
                          style={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "larger",
                              fontWeight: "700",
                              color: "black",
                              width: "50%",
                            }}
                          >
                            Amount
                          </div>
                          <div
                            style={{
                              color: "black",
                              fontWeight: "700",
                              width: "50%",
                              display: "flex",
                              justifyContent: "end",
                              alignItems: "center",
                            }}
                          >
                            $ {modalCurrentData?.trade?.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }) || 0}{" "}

                          </div>
                        </Row>
                        <Row
                          style={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "larger",
                              fontWeight: "700",
                              color: "black",
                              width: "50%",
                            }}
                          >

                          </div>
                          <div
                            style={{
                              color: "black",
                              fontWeight: "700",
                              width: "50%",
                              display: "flex",
                              justifyContent: "end",
                              alignItems: "center",
                            }}
                          >
                            {modalCurrentData?.purchase_units?.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }) || 0}{" Units"}

                          </div>
                        </Row>
                        <Row
                          style={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginTop: "3rem",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "larger",
                              fontWeight: "700",
                              color: "black",
                              width: "50%",
                            }}
                          >
                            Current P/L
                          </div>
                          <div
                            style={{
                              color: currentPLAmount > 0 ? "green" : "red",
                              fontWeight: "700",
                              width: "50%",
                              display: "flex",
                              justifyContent: "end",
                              alignItems: "center",
                            }}
                          >
                            <span>
                              $
                              {currentPLAmount?.toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }) || 0}
                            </span>
                          </div>
                        </Row>

                        <Row
                          style={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginTop: "3rem",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "larger",
                              fontWeight: "700",
                              color: "black",
                              width: "50%",
                            }}
                          >
                            Total
                          </div>
                          <div
                            style={{
                              color: "black",
                              fontWeight: "700",
                              width: "50%",
                              display: "flex",
                              justifyContent: "end",
                              alignItems: "center",
                            }}
                          >
                            $  {(
                              modalCurrentData?.trade + currentPLAmount
                            )?.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }) || 0}{" "}

                          </div>
                        </Row>
                      </Card.Header>
                    </Card>
                    <Form.Check
                      inline
                      label="Only Close Part of the Trade"
                      style={{ color: "black" }}
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => setIsChecked(!isChecked)}
                    />
                    {isChecked && (
                      <div>
                        <Row>
                          <Col xl={1}></Col>
                          <Col xl={2}>
                            <h3
                              style={{
                                color: "rgb(62, 172, 255)",
                                fontSize: "large",
                                fontWeight: "600",
                                marginTop: "1rem",
                              }}
                            >
                              {inputId === "price" ? <>Price</> : <>Units</>}
                            </h3>
                          </Col>
                          <Col xl={6}>
                            <form style={{ marginTop: "8px" }}>
                              <div className="input-group ">
                                <span
                                  className="input-group-text text-black"
                                  onClick={() => {
                                    if (inputValue <= 0) {
                                      setInputValue();
                                    } else {
                                      setInputValue(inputValue - 1);
                                    }
                                  }}
                                >
                                  -
                                </span>
                                {/* <input type="text" className="form-control" value={inputValue}/> */}
                                <input
                                  type="number"
                                  step="any"
                                  className="form-control"
                                  value={inputValue}
                                  id={inputId}
                                  onChange={(e) =>
                                    setInputValue(e.target.value)
                                  }
                                />
                                <span
                                  className="input-group-text text-black"
                                  onClick={() => setInputValue(inputValue + 1)}
                                >
                                  +
                                </span>
                              </div>
                            </form>
                          </Col>
                          <Col className="unitbtn">
                            <Button
                              variant="info"
                              className="bttn"
                              onClick={() =>
                                ConvertAmount(
                                  getCoinPrice(modalCurrentData?.crypto_symbol)
                                )
                              }
                            >
                              <i className="material-icons">swap_horiz</i>
                              {inputId === "price" ? <>Units</> : <>Price</>}
                            </Button>
                          </Col>
                        </Row>
                      </div>
                    )}
                    {/* <Card.Text>
                      <h6
                        className="mb-0"
                        style={{ textAlign: "center", marginTop: "10px" }}
                      >
                        Note: 3% of coin price has been added as commission fee
                      </h6>
                    </Card.Text> */}
                    <Modal.Footer style={{ justifyContent: "center" }}>
                      {!loader && (
                        <Button
                          className="tradebtn"
                          style={{ backgroundColor: "red", width: "30%" }}
                          variant="danger"
                          onClick={() => closetrade()}
                        >
                          Close Trade
                        </Button>
                      )}
                      {loader && (
                        <Button
                          style={{ backgroundColor: "red", width: "30%" }}
                          variant="danger"

                        >
                          <Spinner></Spinner>
                        </Button>
                      )}
                    </Modal.Footer>
                  </Tab.Container>
                </Tab.Pane>
              </Tab.Content>
            </div>
          </Tab.Container>
        </Modal.Body>
      </Modal >
      {/* Update Trade Modal */}
      < Modal className="fade bd-example-modal-lg" show={show} size="lg" >
        <Modal.Header>
          <Modal.Title>Update Trade</Modal.Title>
          <Button
            variant=""
            className="btn-close"
            onHide={() => handleCloseUpdate()}
            onClick={() => {
              handleCloseUpdate();
            }}
          ></Button>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: "#f1f1f1" }}>
          <Tab.Container defaultActiveKey="Navbuy">
            <div className="">
              <Tab.Content>
                <Tab.Pane eventKey="Navbuy">
                  <Tab.Container defaultActiveKey="Navbuymarket">
                    <Card>
                      <Card.Header>
                        <Row>
                          <Col xl={4} xs={4} md={4}>
                            <img loading="lazy"
                              src={cryptoicons[modalCurrentData?.crypto_symbol]}
                              width="100%"
                            />
                          </Col>

                          <Col>
                            <h4 className="mb-0">
                              {modalCurrentData?.crypto_name}
                            </h4>
                            <Row>
                              <div className="d-flex justify-content-start mb-0">
                                <p
                                  className="mb-0"
                                  style={{ fontSize: "20px" }}
                                >
                                  <h3 className="mb-0">
                                    {"$ " +
                                      getCoinPrice(
                                        modalCurrentData?.crypto_symbol
                                      )?.toLocaleString("us-US", {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                      })}
                                  </h3>
                                </p>
                              </div>
                            </Row>
                          </Col>
                        </Row>
                      </Card.Header>
                      <Card.Body>
                        <div className="custom-tab-1">
                          <Tab.Container defaultActiveKey="Posts">
                            <Nav
                              as="ul"
                              style={{ justifyContent: "space-around" }}
                            >
                              <Nav.Item as="li" className="nav-item">
                                <Nav.Link
                                  to="#nosl"
                                  eventKey="NoSl"
                                  style={{ color: "red" }}
                                >
                                  Stop Loss
                                </Nav.Link>
                                {/* <Link style={{ color: "rgb(62, 172, 255)" }}>
                                  No SL
                                </Link> */}
                              </Nav.Item>
                              {/* <Nav.Item as="li" i className="nav-item">
                                  <Nav.Link
                                    to="#take-profit"
                                    eventKey="TakeProfit" >
                                    X1
                                  </Nav.Link>
                                  <Link style={{color:"rgb(62, 172, 255)"}}
                                    onClick={() =>
                                      onClick()
                                    }
                                  >
                                    Leverage
                                  </Link>
                                </Nav.Item> */}
                              <Nav.Item as="li" i className="nav-item">
                                <Nav.Link
                                  to="#take-profit"
                                  eventKey="TakeProfit"
                                  style={{ color: "green" }}
                                >
                                  Take Profit
                                </Nav.Link>
                                {/* <Link
                                  style={{
                                    color: "rgb(62, 172, 255)",
                                    marginLeft: "2rem",
                                  }}
                                  onClick={() => onClick()}
                                >
                                  No TP
                                </Link> */}
                              </Nav.Item>
                            </Nav>
                            <Tab.Content>
                              <Tab.Pane id="nosl" eventKey="NoSl">
                                <div className="sell-element">
                                  <div className="">
                                    <Row>
                                      <Col xl={1}></Col>
                                      <Col xl={2}>
                                        <h3
                                          style={{
                                            color: "#3eacff",
                                            marginTop: "10px",
                                          }}
                                        >
                                          {sLinputId === "rate" ? (
                                            <>Rate</>
                                          ) : (
                                            <>Unit</>
                                          )}
                                        </h3>
                                      </Col>
                                      <Col xl={6}>
                                        <form style={{ marginTop: "8px" }}>
                                          <div className="input-group ">
                                            <span
                                              className="input-group-text text-black"
                                              onClick={() => {
                                                if (stopLoss <= 0) {
                                                  setStopLoss();
                                                } else {
                                                  setStopLoss(stopLoss - 1);
                                                }
                                              }}
                                            >
                                              -
                                            </span>
                                            <input
                                              type="number"
                                              step="any"
                                              className="form-control"
                                              id={sLinputId}
                                              value={stopLoss}
                                              onChange={(e) =>
                                                setStopLoss(e.target.value)
                                              }
                                            />
                                            <span
                                              className="input-group-text text-black"
                                              onClick={() =>
                                                setStopLoss(
                                                  parseFloat(stopLoss) + 1
                                                )
                                              }
                                            >
                                              +
                                            </span>
                                          </div>
                                        </form>
                                      </Col>
                                      <Col className="unitbtn">
                                        <Button
                                          variant="info"
                                          className="bttn"
                                          onClick={() =>
                                            convertSL(
                                              modalCurrentData?.crypto_purchase_price
                                            )
                                          }
                                        >
                                          <i className="material-icons">
                                            swap_horiz
                                          </i>
                                          {sLinputId === "rate" ? (
                                            <>Units</>
                                          ) : (
                                            <>Rate</>
                                          )}
                                        </Button>
                                      </Col>
                                      <Col xl={1}></Col>
                                    </Row>
                                    <Row>
                                      <div className="text-center mb-0">
                                        {sLinputId === "rate" ? (
                                          <p>
                                            {" "}
                                            {stopLoss ? (
                                              <>
                                                {(
                                                  (stopLoss /
                                                    modalCurrentData?.trade) *
                                                  100
                                                ).toFixed(2)}
                                                % of the Position Amount
                                              </>
                                            ) : (
                                              <>0% of the Position Amount</>
                                            )}{" "}
                                          </p>
                                        ) : (
                                          <p>
                                            {" "}
                                            {stopLoss ? (
                                              <>
                                                {(
                                                  ((stopLoss *
                                                    modalCurrentData.crypto_purchase_price) /
                                                    modalCurrentData?.trade) *
                                                  100
                                                ).toFixed(2)}
                                                % of the Position Amount
                                              </>
                                            ) : (
                                              <>0% of the Position Amount</>
                                            )}{" "}
                                          </p>
                                        )}
                                      </div>
                                    </Row>
                                  </div>
                                </div>
                              </Tab.Pane>

                              <Tab.Pane id="take-profit" eventKey="TakeProfit">
                                <div className="sell-element">
                                  <div className="">
                                    <Row>
                                      <Col xl={1}></Col>
                                      <Col xl={2}>
                                        <h3
                                          style={{
                                            color: "#3eacff",
                                            marginTop: "10px",
                                          }}
                                        >
                                          {tPinputId === "rate" ? (
                                            <>Rate</>
                                          ) : (
                                            <>Unit</>
                                          )}
                                        </h3>
                                      </Col>
                                      <Col xl={6}>
                                        <form style={{ marginTop: "8px" }}>
                                          <div className="input-group ">
                                            <span
                                              className="input-group-text text-black"
                                              onClick={() => {
                                                if (takeProfit <= 0) {
                                                  setTakeProfit();
                                                } else {
                                                  setTakeProfit(takeProfit - 1);
                                                }
                                              }}
                                            >
                                              -
                                            </span>
                                            <input
                                              type="number"
                                              step="any"
                                              className="form-control"
                                              id={tPinputId}
                                              value={takeProfit}
                                              onChange={(e) =>
                                                setTakeProfit(e.target.value)
                                              }
                                            />
                                            <span
                                              className="input-group-text text-black"
                                              onClick={() =>
                                                setTakeProfit(
                                                  parseFloat(takeProfit) + 1
                                                )
                                              }
                                            >
                                              +
                                            </span>
                                          </div>
                                        </form>
                                      </Col>
                                      <Col className="unitbtn">
                                        <Button
                                          variant="info"
                                          className="bttn"
                                          onClick={() =>
                                            convertTP(
                                              modalCurrentData?.crypto_purchase_price
                                            )
                                          }
                                        >
                                          <i className="material-icons">
                                            swap_horiz
                                          </i>
                                          {tPinputId === "rate" ? (
                                            <>Units</>
                                          ) : (
                                            <>Rate</>
                                          )}
                                        </Button>
                                      </Col>
                                      <Col xl={1}></Col>
                                    </Row>
                                    <Row>
                                      <div className="text-center mb-0">
                                        {tPinputId === "rate" ? (
                                          <p>
                                            {takeProfit ? (
                                              <>
                                                {(
                                                  (takeProfit /
                                                    modalCurrentData?.trade) *
                                                  100
                                                ).toFixed(2)}
                                                % of the Position Amount
                                              </>
                                            ) : (
                                              <>0% of the Position Amount</>
                                            )}
                                          </p>
                                        ) : (
                                          <p>
                                            {takeProfit ? (
                                              <>
                                                {(
                                                  ((takeProfit *
                                                    modalCurrentData.crypto_purchase_price) /
                                                    modalCurrentData?.trade) *
                                                  100
                                                ).toFixed(2)}
                                                % of the Position Amount
                                              </>
                                            ) : (
                                              <>0% of the Position Amount</>
                                            )}
                                          </p>
                                        )}
                                      </div>
                                    </Row>
                                  </div>
                                </div>
                              </Tab.Pane>
                            </Tab.Content>
                          </Tab.Container>
                        </div>
                      </Card.Body>
                    </Card>
                    <Modal.Footer style={{ justifyContent: "center" }}>
                      {!loader && (
                        <Button
                          className="open tradebtn"
                          variant="info"
                          onClick={() => UpdateTrade()}
                        >
                          Update Trade
                        </Button>
                      )}
                      {loader && (
                        <Button
                          className="open"
                          variant="info"
                          onClick={() => UpdateTrade()}
                        >
                          <Spinner></Spinner>
                        </Button>
                      )}
                    </Modal.Footer>
                    <p style={{ textAlign: "center" }}>
                      By the Crytocurrencies your Accepting Our
                      <Link style={{ color: "rgb(62, 172, 255)" }}>
                        Crytocurrencies Addendum
                      </Link>
                    </p>
                  </Tab.Container>
                </Tab.Pane>
              </Tab.Content>
            </div>
          </Tab.Container>
        </Modal.Body>
      </Modal >
    </>
  );
};

export default DataTable;
