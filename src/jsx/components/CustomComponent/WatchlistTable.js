import jwt_decode from "jwt-decode";
import { useEffect, useRef, useState } from "react";
import { Button, Col, Dropdown } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import Cookies from "universal-cookie";
import {
  createTrade,
  getWatchList,
  removeFromWatchList,
  setWatchList
} from "../../../Redux/coins";
import cryptoicons from "../../../images/cryptoIcons/cryptoImg";
import TabelComponent from "../../layouts/TabelComponent";
import Open from "../OpenTradeModel/Open";

let columns = [
  { label: "Markets", columnName: "markets", sort: true },
  { label: "Price", columnName: "price", sort: true },
  { label: "Change 24h", columnName: "change", sort: false },
  { label: "Invest", columnName: "invest", sort: false },
  { label: "Action", columnName: "action", sort: false },
];
const DataTable = () => {
  const [data, setData] = useState(
    document.querySelectorAll("#market_wrapper tbody tr")
  );

  const coinReducer = useSelector((state) => state.coinReducer);
  const [previousData, setPreviousData] = useState(
    coinReducer?.watchlist || []
  );
  const dispatch = useDispatch();
  const [percentage, setPercentage] = useState("percent_change_24h");
  const [largeModal, setLargeModal] = useState(false);
  const [modalCurrentData, setModalCurrentData] = useState();
  const [inputValue, setInputValue] = useState();
  const [inputId, setInputId] = useState("price");
  const [stopLoss, setStopLoss] = useState(0);
  const [takeProfit, setTakeProfit] = useState(0);
  const sort = 6;
  const activePag = useRef(0);
  const [test, settest] = useState(0);

  const cookies = new Cookies();
  const token = cookies.get("token");
  const user = jwt_decode(token);
  const id = user.id;
  const openTrade = (value) => {
    let body = {
      user_id: id,
      crypto_name: modalCurrentData.name,
      crypto_symbol: modalCurrentData.symbol,
      crypto_purchase_price: modalCurrentData.price,
      investment:
        inputId === "price"
          ? parseFloat(inputValue)
          : parseFloat(inputValue * modalCurrentData.price),
      stop_loss: stopLoss,
      take_profit: takeProfit,
    };
    console.log("body of trade", body);
    const res = dispatch(createTrade(body));
    console.log("res of trade", res);
    setLargeModal(false);
  };

  const buyNow = (value) => {
    console.log("row clicked", value);
    // navigate("/coin-details")
    setModalCurrentData(value);
    setLargeModal(true);
  };
  console.log("modalCurrentData", modalCurrentData);
  const chageData = (frist, sec) => {
    for (var i = 0; i < data.length; ++i) {
      if (i >= frist && i < sec) {
        data[i].classList.remove("d-none");
      } else {
        data[i].classList.add("d-none");
      }
    }
  };
  useEffect(() => {
    setPreviousData(coinReducer?.watchlist);
  }, [coinReducer.coinData]);

  activePag.current === 0 && chageData(0, sort);
  let paggination = Array(Math.ceil(data.length / sort))
    .fill()
    .map((_, i) => i + 1);
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

  const removeWatchlist = (item) => {
    let body = {
      user_id: id,
      coin_name: item.name,
    };
    dispatch(removeFromWatchList(body));
    getData();
  };

  const getData = async () => {
    let body = {
      user_id: id,
    };
    const watchlist = await dispatch(getWatchList(body));
    console.log("watchlist", watchlist);
    let userwatch = watchlist.payload?.map((x) => x.coin_name);
    const filterforuserWatchlist = coinReducer.coinData.filter((x) =>
      userwatch.includes(x.name)
    );
    console.log("filterforuserWatchlist", filterforuserWatchlist);
    setPreviousData(filterforuserWatchlist);
    dispatch(setWatchList(filterforuserWatchlist));
  };

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };
  const handleClick = (price) => {
    if (inputId === "price") {
      setInputId("units");
      const newValue = inputValue / price;
      setInputValue(newValue);
    } else {
      setInputId("price");
      const newValue = inputValue * price;
      setInputValue(newValue);
    }
  };

  useEffect(() => {
    getData();
  }, []);
  useEffect(() => {
    getData();
  }, [coinReducer?.coinDataOld]);
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
                maximumFractionDigits: 2,
                minimumFractionDigits: 2,
              })}
            </span>
          );
        },
      },
      {
        title: (
          <Dropdown>
            <Dropdown.Toggle variant="" className="pb-0 clr">
              {columnName}
            </Dropdown.Toggle>
            <Dropdown.Menu className="clr">
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
        ),
        sortId: "change",
        render: (rowData) => {
          return (
            <span
              style={{
                color:
                  returnValue(rowData) > 0
                    ? "green"
                    : returnValue(rowData) < 0
                    ? "#ff5b5b"
                    : "#374557",
              }}
            >
              {returnValue(rowData).toFixed(2) || 0}%
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
                style={{ backgroundColor: "#3eacff" }}
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
        title: "Action",
        render: (rowData) => {
          return (
            <span>
              <Button
                style={{ backgroundColor: "black" }}
                variant="dark"
                onClick={() => removeWatchlist(rowData)}
              >
                Remove
              </Button>
            </span>
          );
        },
      },
    ];
  };

  return (
    <div className="col-xl-12">
      <ToastContainer />
      <TabelComponent
        cols={renderTabel()}
        data={previousData.map((obj, index) => {
          return {
            ...obj,

            change: returnValue(obj),
          };
        })}
        itemsPerPage={8}
        searchKey={"name"}
        searchKey2={"symbol"}
        searchPlaceholder="Search Assets"
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
