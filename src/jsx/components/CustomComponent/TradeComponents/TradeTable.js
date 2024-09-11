import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import {
  Button,
  Card,
  Col,
  Dropdown,
  Form,
  Modal,
  Nav,
  Row,
  Spinner,
  Tab,
} from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { Table } from "react-bootstrap";
import cryptoicons from "../../../../images/cryptoIcons/cryptoImg";
import { InfinitySpin } from "react-loader-spinner";
import TabelComponent from "../../../layouts/TabelComponent";

//import bitcoin from "../../../../images/coins/btc.png";
import TradeOrderForm from "./TradeOrderForm";
import { connect, useDispatch, useSelector } from "react-redux";
import {
  addToWatchList,
  createTrade,
  getAllCoin,
  removeFromWatchList,
  getWatchList,
  setWatchList,
} from "../../../../Redux/coins";
import Cookies from "universal-cookie";
import jwt_decode from "jwt-decode";
import axios from "axios";
import { getUserWallet } from "../../../../Redux/user";
import Open from "../../OpenTradeModel/Open";
const DataTable = () => {
  const [data, setData] = useState(
    document.querySelectorAll("#market_wrapper tbody tr")
  );

  const [previousData, setPreviousData] = useState();
  const dispatch = useDispatch();
  const coinReducer = useSelector((store) => store.coinReducer);
  const [percentage, setPercentage] = useState("percent_change_24h");
  const [largeModal, setLargeModal] = useState(false);
  const [modalCurrentData, setModalCurrentData] = useState();
  const [shuldSLDisabled, setShouldSLDisabled] = useState(false);
  const [shuldTPDisabled, setShouldTPDisabled] = useState(false);
  //const [noSl, setNoSl] = useState(true);
  const [inputValue, setInputValue] = useState();
  const [inputId, setInputId] = useState("price");
  const [tPinputId, setTPInputId] = useState("rate");
  const [sLinputId, setSLInputId] = useState("rate");
  const [stopLoss, setStopLoss] = useState();
  const [takeProfit, setTakeProfit] = useState();
  const isloadingUser = useSelector((state) => state.userReducer.isloading);
  const userWallet = useSelector((state) => state.userReducer);
  const [loader, setLoader] = useState(false);
  const requests = useSelector((state) => state.coinReducer);
  useEffect(() => {
    if (isloadingUser) {
      setLoader(true);
    } else {
      setLoader(false);
    }
  }, [isloadingUser]);

  const getData = async () => {
    let body = {
      user_id: id,
    };
    const watchlist = await dispatch(getWatchList(body));
    console.log("watchlist", watchlist);
    let userwatch = watchlist.payload?.map((x) => x.coin_name);
    const filterforuserWatchlist = requests?.coinData.filter((x) =>
      userwatch.includes(x.name)
    );
    dispatch(setWatchList(filterforuserWatchlist));
  };

  useEffect(() => {
    getData();
  }, []);

  const sort = 6;
  const activePag = useRef(0);
  const [test, settest] = useState(0);

  const cookies = new Cookies();
  const token = cookies.get("token");
  const user = jwt_decode(token);
  const id = user.id;

  useEffect(() => {
    dispatch(getUserWallet(id));
  }, []);

  const openTrade = (value) => {
    let body = {
      user_id: id,
      crypto_name: modalCurrentData.name,
      crypto_symbol: modalCurrentData.symbol,
      crypto_purchase_price: getCoinPrice(modalCurrentData?.symbol),
      investment:
        inputId === "price"
          ? parseFloat(inputValue)
          : parseFloat(inputValue * getCoinPrice(modalCurrentData?.symbol)),
      stop_loss:
        sLinputId === "rate"
          ? parseFloat(stopLoss)
          : parseFloat(stopLoss * getCoinPrice(modalCurrentData?.symbol)),
      take_profit:
        tPinputId === "rate"
          ? parseFloat(takeProfit)
          : parseFloat(takeProfit * getCoinPrice(modalCurrentData?.symbol)),
    };
    console.log("body of trade", body);

    const res = dispatch(createTrade(body));
    console.log("res of trade", res);
    setLargeModal(false);
  };

  const watchlist = async (value) => {
    let body = {
      user_id: id,
      coin_name: value.name,
    };
    const res = await dispatch(addToWatchList(body));
    console.log("res of watch", res);
    if (res.payload) {
      // dispatch(getWatchList({ user_id: user.id }));
      getData();
    }
  };

  const removeWatchlist = async (item) => {
    let body = {
      user_id: id,
      coin_name: item.name,
    };
    const res = await dispatch(removeFromWatchList(body));
    // dispatch(getWatchList({ user_id: user.id }));
    if (res.payload) {
      getData();
    }
  };

  const buyNow = (value) => {
    console.log("row clicked", value);
    setModalCurrentData(value);
    setLargeModal(true);
  };
  console.log("modalCurrentData", modalCurrentData);
  // Active data
  const chageData = (frist, sec) => {
    for (var i = 0; i < data.length; ++i) {
      if (i >= frist && i < sec) {
        data[i].classList?.remove("d-none");
      } else {
        data[i].classList?.add("d-none");
      }
    }
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
  const [columnName, setColumnName] = useState("Change 24h");
  const change1h = () => {
    setPercentage("percent_change_1h");
    setColumnName("Change 1h");
  };
  const change24h = () => {
    setPercentage("percent_change_24h");
    setColumnName("Change 24h");
  };
  const change7d = () => {
    setPercentage("percent_change_7d");
    setColumnName("Change 7d");
  };
  const returnValue = (item) => {
    if (percentage === "percent_change_1h") {
      return item.percent_change_1h;
    } else if (percentage === "percent_change_24h") {
      return item.percent_change_24h;
    } else if (percentage === "percent_change_7d") {
      return item.percent_change_7d;
    }
  };
  const returnSortId = () => {
    if (percentage === "percent_change_1h") {
      return "percent_change_1h";
    } else if (percentage === "percent_change_24h") {
      return "percent_change_24h";
    } else if (percentage === "percent_change_7d") {
      return "percent_change_7d";
    }
  };




  const handleClick = () => {
    if (inputId === "price") {
      setInputId("units");
      const newValue = inputValue / getCoinPrice(modalCurrentData?.symbol);
      setInputValue(newValue);
    } else {
      setInputId("price");
      const newValue = inputValue * getCoinPrice(modalCurrentData?.symbol);
      setInputValue(newValue);
    }
  };

  const convertSL = (price) => {
    if (sLinputId === "rate") {
      setSLInputId("units");
      const newValue = stopLoss / getCoinPrice(modalCurrentData?.symbol);
      setStopLoss(newValue);
    } else {
      setSLInputId("rate");
      const newValue = stopLoss * getCoinPrice(modalCurrentData?.symbol);
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

  useEffect(() => {
    if (inputValue <= 0) {
      setInputValue(0);
    }
    if (takeProfit <= 0) {
      setTakeProfit(0);
    }
    if (stopLoss <= 0) {
      setStopLoss(0);
    }
  }, [inputValue, takeProfit, stopLoss]);

  const renderTabel = () => {
    return [
      {
        title: "Assets",
        sortId: "name",
        render: (rowData) => {
          return (
            <div className="market-title d-flex align-items-center ">
              <img
                loading="lazy"
                src={cryptoicons[rowData.symbol]}
                style={{ width: "3rem" }}
              />
              <Col>
                <h4 className="mb-0 ms-2">{rowData.name}</h4>
                <span className="text-muted ms-2">{rowData.symbol}</span>
              </Col>
            </div>
          );
        },
      },
      {
        title: "Price",
        sortId: "price",
        render: (rowData) => {
          return (
            <span>
              $
              {rowData.price?.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }) || 0}
            </span>
          );
        },
      },
      {
        title: (
          <span>
            <Dropdown>
              <Dropdown.Toggle
                variant=""
                className="pb-0"
                style={{ color: "#374557" }}
              >
                {columnName}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item href="#" className="clr" onClick={change1h}>
                  Change 1h
                </Dropdown.Item>
                <Dropdown.Item href="#" className="clr" onClick={change24h}>
                  Change 24h
                </Dropdown.Item>
                <Dropdown.Item href="#" className="clr" onClick={change7d}>
                  Change 7d
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </span>
        ),

        sortId: returnSortId(),
        render: (rowData) => {
          return (
            <span
              style={{
                color:
                  returnValue(rowData) > 0
                    ? "green"
                    : returnValue(rowData) < 0
                      ? "red"
                      : "red",
              }}
            >
              {returnValue(rowData)?.toFixed(2) || 0}%
            </span>
          );
        },
      },
      {
        title: "Invest",

        render: (rowData) => {
          return (
            <span>
              <Button
                style={{ backgroundColor: "#3eacff", color: "white" }}
                variant="info"
                onClick={() => buyNow(rowData)}
              >
                Invest
              </Button>
            </span>
          );
        },
      },
      {
        title: "Watchlist",
        render: (rowData) => {
          return (
            <span>
              {coinReducer.userWatchlist.filter(
                (d) => d.coin_name === rowData.name
              ).length > 0 ? (
                <Button
                  style={{
                    backgroundColor: "black",
                    color: "white",
                    width: "120px",
                  }}
                  variant="light"
                  className="removebtn"
                  onClick={() => removeWatchlist(rowData)}
                >
                  Remove
                </Button>
              ) : (
                <Button
                  style={{
                    backgroundColor: "black",
                    color: "white",
                    width: "120px",
                  }}
                  variant="light"
                  className="removebtn"
                  onClick={() => watchlist(rowData)}
                >
                  Add
                </Button>
              )}
            </span>
          );
        },
      },
    ];
  };
  // create a function to recived the coin symbol and return the coin price form the coinData of redux
  const getCoinPrice = (symbol) => {
    if (symbol) {
      const coin = requests.coinData.filter((d) => d.symbol === symbol);
      return parseFloat(coin[0].price);
    }
    return 0;
  };
  const tableData = () => {
    return requests?.coinData
      .filter((d) => d.allow === true)
      .map((obj, index) => {
        return {
          ...obj,
          change: returnValue(obj),
        };
      })
  }



  return (
    <div className="col-xl-12">
      <ToastContainer />
      <TabelComponent
        cols={renderTabel()}
        data={tableData()}
        tabeltitle={""}
        itemsPerPage={8}
        searchKey={"name"}
        searchKey2={"symbol"}
        searchPlaceholder={"Search Assets"}
      />

      <Open
        largeModal={largeModal}
        setLargeModal={setLargeModal}
        modalCurrentData={modalCurrentData}
      ></Open>
    </div>
  );
};

export default DataTable;
