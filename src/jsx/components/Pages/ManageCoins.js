import React, { useEffect, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { Button, ButtonGroup, Col, Dropdown } from "react-bootstrap";
import PageTitle from "../../layouts/PageTitle";
import TabelComponent from "../../layouts/TabelComponent";
import { getAllCoin, getAdminWatchList } from "../../../Redux/coins";
import cryptoicons from "../../../images/cryptoIcons/cryptoImg";
import {
  addToAdminWatchlist,
  getAllAdminWatchlist,
  removeFromAdminWatchlist,
} from "../../../Redux/user";
import { ToastContainer } from "react-toastify";

const ManageCoins = () => {
  const [previousData, setPreviousData] = useState();
  const [watchlist, setWatchlist] = useState(false);
  const [coinList, setCoinList] = useState(true);
  const dispatch = useDispatch();
  const [percentage, setPercentage] = useState("percent_change_24h");
  const [columnName, setColumnName] = useState("Change 24h");
  const [inputValue, setInputValue] = useState();

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

  const requests = useSelector((state) => state.coinReducer);
  const userRequests = useSelector((state) => state.userReducer);
  const getWatchListData = async () => {
    const res = await dispatch(getAllAdminWatchlist());
    console.log(res, "res");
  };

  const handleAdd = async (name) => {
    let body = {
      coin_name: name,
    };
    const res = await dispatch(addToAdminWatchlist(body));
    console.log("response===", res);
    if (res.payload) {
      dispatch(getAdminWatchList());
    }
    //console.log(res, "res of add");
  };
  const handleRemove = async (id) => {
    let body = {
      watchlist_item_id: id,
    };
    const res = await dispatch(removeFromAdminWatchlist(body));
    if (res.payload) {
      dispatch(getAdminWatchList());
    }
    //console.log(res, "res of remove");
    getWatchListData();
  };

  useEffect(() => {
    dispatch(getAdminWatchList());
    getWatchListData();
  }, []);

  const TableCoinMarket = () => {
    return [
      {
        title: "Markets",
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
            <span
            // style={{
            //   color: GetColor(rowData.id, rowData.price),
            // }}
            >
              $
              {rowData.price.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
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
                <Dropdown.Item href="#" onClick={change1h} className="clr">
                  Change 1h
                </Dropdown.Item>
                <Dropdown.Item href="#" onClick={change24h} className="clr">
                  Change 24h
                </Dropdown.Item>
                <Dropdown.Item href="#" onClick={change7d} className="clr">
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
                      ? "#ff5b5b"
                      : "#374557",
              }}
            >
              {returnValue(rowData)?.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }) || 0}
              %
            </span>
          );
        },
      },
      {
        title: "Action",
        render: (rowData) => {
          return (
            <div>
              {requests.adminWatchList.filter(
                (d) => d.coin_name === rowData.name
              ).length > 0 ? (
                <Button
                  variant="info"
                  style={{ backgroundColor: "#3eacffb5", color: "white" }}
                  size="sm"
                  onClick={() =>
                    handleRemove(
                      requests.adminWatchList.filter(
                        (d) => d.coin_name === rowData.name
                      )[0].id
                    )
                  }
                >
                  Enable
                </Button>
              ) : (
                <Button
                  variant="info"
                  style={{
                    backgroundColor: "#80808045",
                    color: "black",
                    border: "none",
                  }}
                  size="sm"
                  onClick={() => handleAdd(rowData.name)}
                >
                  Disable
                </Button>
              )}

              {/* <Button
            variant="danger"
            className="text-center mx-2 "
            size="sm"
            // onClick={() => {
            //   setLargeModal(true);
            //   setModalCurrentData(rowData);
            //   //handleReject(rowData)
            // }}
          >
            Remove
          </Button> */}
            </div>
          );
        },
      },
    ];
  };
  const TableCoinWatchList = () => {
    return [
      {
        title: "ID",
        render: (rowData) => {
          return <span>{rowData.id}</span>;
        },
      },
      {
        title: "Name",
        render: (rowData) => {
          return <span>{rowData.coin_name}</span>;
        },
      },
      {
        title: "Action",
        render: (rowData) => {
          return (
            <div>
              {/* <Button
            variant="primary"
            className="btn-sm mx-2 "
            size="sm"
            //onClick={() => handleAccept(rowData.id)}
          >
            Show
          </Button> */}
              <Button
                variant="danger"
                className="text-center mx-2 "
                size="sm"
                onClick={() => {
                  handleRemove(rowData.id);
                }}
              >
                Show
              </Button>
            </div>
          );
        },
      },
    ];
  };
  const data = ["", "", ""];

  return (
    <>
      <ToastContainer />
      <PageTitle
        activeMenu="Manage Coins"
        motherMenu="Dashboard"
        link="admin-dashboard"
      />

      {/* <ButtonGroup
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
            setCoinList(true);
            setWatchlist(false);
          }}
          style={{
            backgroundColor: coinList ? "#3eacff" : "#fff",
            color: coinList ? "#fff" : "#3eacff",
            borderColor: "white",
          }}
          variant="info"
        >
          Coin Market
        </Button>
        <Button
          onClick={() => {
            setWatchlist(true);
            setCoinList(false);
          }}
          style={{
            backgroundColor: watchlist ? "#3eacff" : "#fff",
            color: watchlist ? "#fff" : "#3eacff",
            borderColor: "white",
          }}
          variant="info"
        >
          Watch List
        </Button>
      </ButtonGroup> */}
      {/* {coinList && ( */}
      <TabelComponent
        cols={TableCoinMarket()}
        data={requests?.coinData.map((obj, index) => {
          return {
            ...obj,

            change: returnValue(obj),
          };
        })}
        itemsPerPage={8}
        searchKey={"name"}
        searchKey2={"symbol"}
        searchPlaceholder="Search Markets"
      />
      {/* )} */}
      {/* {watchlist && (
        <TabelComponent
          cols={TableCoinWatchList()}
          data={userRequests?.getAllAdminWatchlist}
          tabeltitle={"Coins watchlist"}
          itemsPerPage={8}
        />
      )} */}
    </>
  );
};

export default ManageCoins;
