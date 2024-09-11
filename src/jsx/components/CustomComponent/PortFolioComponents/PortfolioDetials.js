import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Col, Row } from "react-bootstrap";
import TabelComponent from "../../../layouts/TabelComponent";
import cryptoicons from "../../../../images/cryptoIcons/cryptoImg";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import {
  AddCommissionFee,
  ProfitLossAmount,
  ProfitLossPercentage,
} from "../../../../services/DataService";

const PortfolioDetials = ({ symbol, handleShow, buyNow }) => {
  const requests = useSelector((store) => store.coinReducer);
  const filterDataForCoin = (symbol) => {
    const filteredData = requests?.tradeData?.filter(
      (item) => item.crypto_symbol === symbol
    );
    console.log(filteredData, "filteredDataForCoin");
    return filteredData;
  };
  const formattedDate = (item) => {
    if (!item) return;
    dayjs.extend(utc);
    dayjs.extend(timezone);
    return dayjs(item).tz(Intl.DateTimeFormat().resolvedOptions().timeZone).format("DD MMM YYYY HH:mm");
  };

  const renderTabel2 = () => {
    return [
      {
        title: "In Order",
        sortId: "count",
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
        title: "Opened Date",
        sortId: "invested_date",
        render: (rowData) => {
          return (
            <span style={{ color: "black" }}>
              {formattedDate(rowData.invested_date)}
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

  return (
    <>
      <TabelComponent
        cols={renderTabel2()}
        data={filterDataForCoin(symbol).map((obj, index) => {
          return {
            ...obj,
            count: index + 1,
            profitloss_$: ProfitLossAmount(
              obj.purchase_units,
              obj.crypto_purchase_price,
              obj.crypto_symbol,
              obj.trade,
              requests
            ),

            profitloss_p: ProfitLossPercentage(
              obj.purchase_units,
              obj.crypto_purchase_price,
              obj.crypto_symbol,
              obj.trade,
              requests
            ),
          };
        })}
        tabeltitle={""}
        itemsPerPage={10}
        searchKey={"crypto_name"}
        searchKey2={"crypto_symbol"}
        searchPlaceholder="Search Asset"
      />
    </>
  );
};
export default PortfolioDetials;
