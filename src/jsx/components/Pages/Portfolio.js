import { Card, Col, Row } from "react-bootstrap";
import PageTitle from "../../layouts/PageTitle";
import DataTable from "../CustomComponent/PortFolioComponents/PortfolioTable";
import TabelComponent from "../../layouts/TabelComponent";
import Cookies from "universal-cookie";
import { useDispatch, useSelector } from "react-redux";
import jwt_decode from "jwt-decode";
import { getUserWallet } from "../../../Redux/user";
import { useEffect, useState } from "react";
import { getAllCoin, getAllTrade } from "../../../Redux/coins";
const Portfolio = () => {
  const tableData = [
    {
      title: "ZEC",
      markets: "ZCash",
      price: "$0.9632",
      change: "-9",
      open: "yes",
      pl: "3.49",
    },
    {
      title: "AUD",
      markets: "Australian Doller",
      price: "$0.6932",
      change: "+22",
      open: "yes",
      pl: "-0.15",
    },
  ];
  let columns = [
    { label: "Available Assets", columnName: "available_assets", sort: true },
    { label: "Amount", columnName: "amount", sort: true },
    { label: "Units", columnName: "sort", sort: false },
    { label: "Open", columnName: "open", sort: true },
    { label: "P/L($)", columnName: "pl", sort: false },
  ];

  const cookies = new Cookies();
  const dispatch = useDispatch();
  const token = cookies.get("token");
  const user = jwt_decode(token);
  const id = user.id;
  //use s
  const requests = useSelector((state) => state.userReducer);
  const coinReducer = useSelector((state) => state.coinReducer);
  //console.log(requests, "requests");

  useEffect(() => {
    dispatch(getUserWallet(id));
  }, []);

  const GetColor = (value) => {
    if (value > 0) {
      return "green";
    } else if (value < 0) {
      return "red";
    } else {
      return "black";
    }
  };
  const getTotals = (profitLoss = 0, invest = 0, wallet = 0) => {
    return invest + wallet + profitLoss;
  };

  return (
    <>
      <PageTitle
        activeMenu="Portfolio"
        motherMenu="Dashboard"
        link="dashboard"
      />

      <DataTable header="" rows={tableData} columns={columns} />
      <Card>
        <Card.Body>
          <Row
            style={{ fontSize: "20px ", color: "black", marginLeft: "1rem" }}
          >
            <Col xs={6} sm={6} lg={6} xl={3} style={{ marginBottom: "5px" }}>
              <Card.Text className="portfolio-value">
                $
                {requests.getUserWallet?.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Card.Text>
              <Card.Text className="fw-bold">Available</Card.Text>
            </Col>
            <Col xs={6} sm={6} lg={6} xl={3}>
              <Card.Text className="portfolio-value">
                $
                {requests?.totalInvestment.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Card.Text>
              <Card.Text className="fw-bold">Total Invested</Card.Text>
            </Col>
            <Col xs={6} sm={6} lg={6} xl={3}>
              <Card.Text
                className="portfolio-value"
                style={{ color: GetColor(requests?.totalProfitLoss) }}
              >
                ${" "}
                {(
                  Math.round(requests?.totalProfitLoss * 100) / 100
                )?.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Card.Text>
              <Card.Text className="fw-bold">Profit/Loss</Card.Text>
            </Col>
            <Col xs={6} sm={6} lg={6} xl={3}>
              <Card.Text className="portfolio-value">
                $
                {getTotals(
                  requests?.totalProfitLoss,
                  requests?.totalInvestment,
                  requests?.getUserWallet
                )?.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }) || 0}
              </Card.Text>
              <Card.Text className="fw-bold">Portfolio Value</Card.Text>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </>
  );
};

export default Portfolio;
