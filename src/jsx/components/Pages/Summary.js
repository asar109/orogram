import React, { useEffect, useState } from "react";
import PageTitle from "../../layouts/PageTitle";
import { Link } from "react-router-dom";
import { Button, Col, Row } from "react-bootstrap";
import TabelComponent from "../../layouts/TabelComponent";
import {
  getAllActiveTradeAdmin,
  getAllWithDrawRequest,
  getAllDepositRequest,
  getAllCoin,
} from "../../../Redux/coins";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers, getTradeSummary } from "../../../Redux/user";
import cryptoicons from "../../../images/cryptoIcons/cryptoImg";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import axiosInstance from "../../../services/AxiosInstance";
import CurrencyFormat from "react-currency-format";
import SummaryDetial from "../CustomComponent/SummaryDetial";

const Summary = () => {
  const dispatch = useDispatch();
  const userReducer = useSelector((store) => store.userReducer);
  const [clicked, setClicked] = useState(false);
  const [symbol, setSymbol] = useState("");
  useEffect(() => {
    dispatch(getAllActiveTradeAdmin());
    dispatch(getAllUsers());
    dispatch(getTradeSummary()).then((res) => {
      console.log(res, "res of trade summary");
    });
    //dispatch(getAllCoin());
  }, []);

  const renderTabel = () => {
    return [
      {
        title: "In Order",
        sortId: "count",
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
        title: "No. Trades",
        sortId: "total_trades",
        render: (rowData) => {
          return <span>{rowData.total_trades.toLocaleString("en-US")}</span>;
        },
      },
      {
        title: "Amount",
        sortId: "sum_of_trades",
        render: (rowData) => {
          return (
            <span>
              $
              {rowData?.sum_of_trades?.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          );
        },
      },
      {
        title: "Units",
        sortId: "sum_of_units",
        render: (rowData) => {
          return (
            <span>
              {rowData.sum_of_units?.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          );
        },
      },
      {
        title: "No. Users",
        sortId: "total_users",
        render: (rowData) => {
          return <span>{rowData.total_users?.toLocaleString("en-US")}</span>;
        },
      },
      {
        title: "Details",
        render: (rowData) => {
          return (
            <div>
              <>
                <Button
                  onClick={() => handleClick(rowData)}
                  //className="open2"
                  variant="info"
                  style={{ backgroundColor: "#3eacff", color: "white", }}>
                  Detail
                </Button>
              </>
            </div>
          );
        },
      },
    ];
  };

  const handleClick = (item) => {
    setClicked(true);
    setSymbol(item.crypto_symbol);
  };
  return (
    <>
      <PageTitle
        activeMenu="Summary"
        motherMenu="Dashboard"
        link="admin-dashboard"
      />
      {clicked && (
        <Button
          onClick={() => setClicked(false)}
          variant="link"
          size="lg"
        // style={
        //   {
        //     //make it into left
        //     // marginLeft: "-45%",
        //   }
        // }
        >
          Back
        </Button>
      )}
      <div className="col-xl-12">
        {clicked === false ? (
          <>
            <TabelComponent
              cols={renderTabel()}
              data={userReducer?.tradeSummary.map((obj, index) => {
                return {
                  ...obj,
                  count: index + 1,
                };
              })}
              tabeltitle={"Active Trades"}
              itemsPerPage={8}
              searchKey={"crypto_name"}
              searchKey2={"crypto_symbol"}
              searchPlaceholder="Search Markets"
            />
          </>
        ) : (
          <SummaryDetial symbol={symbol} setClicked={setClicked}></SummaryDetial>
        )}
      </div>

    </>
  );
};
export default Summary;
