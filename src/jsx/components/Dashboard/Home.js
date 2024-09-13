import { useEffect, useState } from "react";
import { Card, Col, Dropdown, Nav, Row, Tab } from "react-bootstrap";
import Cookies from "universal-cookie";
import jwt_decode from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "../CustomComponent/PortFolioComponents/PortfolioTable";
import ReactApexChart from "react-apexcharts";
import WidgetChartIndex3 from "./Index3/WidgetChartIndex3";
import {
  getUserWallet,
  settotalProfitLoss,
  settotalInvestment,
} from "../../../Redux/user";
import { getAllCoin, getAllTrade } from "../../../Redux/coins";
import CurrencyFormat from "react-currency-format";
import { ToastContainer, toast } from "react-toastify";
import cryptoicons from "../../../images/cryptoIcons/cryptoImg";
import { CoinCharts } from "./CoinCharts";
import {getWelcomeMessage} from '../../../utils/welcomeMessage'
const Home = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((store) => store.userReducer.currentUser);
  console.log("🚀 ~ Home ~ currentUser:", currentUser)
  const cookies = new Cookies();
  const token = cookies.get("token");

  // const requests = useSelector((state) => state.userReducer);
  // const [topcoins, setTopCoins] = useState(requestCoin?.coinData);

  // useEffect(() => {
  //   dispatch(getUserWallet(id));
  //   setTopCoins(requestCoin?.coinData);
  //   settopcoinsShow(requestCoin?.coinData.slice(0, 3));
  //   console.log(topcoins, "topcoins");
  // }, [requestCoin?.coinData, requestCoin?.totalProfitLoss]);

  // const [topcoinsShow, settopcoinsShow] = useState(
  //   requestCoin?.coinData.slice(0, 3)
  // );

  const GetColor = (value) => {
    if (value > 0) {
      return "green";
    } else if (value < 0) {
      return "red";
    } else {
      return "black";
    }
  };
  const getTotals = (profitLoss, invest, wallet = 0) => {
    return invest + wallet + profitLoss;
  };

  // useEffect(() => {
  //   let count = 3;
  //   const intervalId = setInterval(() => {
  //     if (count === topcoins.length - 1) {
  //       count = 3;
  //     } else if (topcoinsShow.length > 0) {
  //       settopcoinsShow((topcoinsShow) => [
  //         ...topcoinsShow.slice(1),
  //         topcoins[count],
  //       ]);
  //       count++;
  //     }
  //   }, 4000);

  //   return () => clearInterval(intervalId);
  // }, []);

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

  return (
    <>
      <div className="row">
        <div className="col-xl-12">
          <div className="row">
            <div className="col-xl-12">
              <Card>
                <Card.Body>
                  <div className="bubles-down">
                    <div style={{ width: "100%" }}>
                      <h2>Welcome Back!</h2>
                      <h2>
                        <p style={{ textTransform: "capitalize" }}>{`${
                          currentUser.firstName + " " + currentUser.lastName
                        } , ${getWelcomeMessage()}`}</p>
                      </h2>

                      <h4>
                        <p>Portfolio Value</p>
                      </h4>

                      <h2 className="fs-7">
                        <CurrencyFormat
                          style={{ color: "black !important" }}
                          value={40}
                          displayType={"text"}
                          decimalScale={2}
                          thousandSeparator={true}
                          prefix={"$"}
                          fixedDecimalScale={true}
                          renderText={(value) => <p>{value}</p>}
                        />
                      </h2>
                      {/* <Link to={"/exchange"} className="btn text-white" style={{backgroundColor:'#3eacff'}}>Buy Coin</Link> */}
                    </div>
                  </div>
                  <Row className="mt-3">
                    <Col xl={4} md={4} sm={12}>
                      <Card className="border bg-white" border="info">
                        <Card.Body className="d-flex justify-content-center">
                          <Card.Text>
                            <h4
                              className="pricecard"
                              style={{ fontSize: "25px" }}
                            >
                              <CurrencyFormat
                                style={{ color: "black !important" }}
                                value={40}
                                displayType={"text"}
                                decimalScale={2}
                                thousandSeparator={true}
                                prefix={"$"}
                                fixedDecimalScale={true}
                                renderText={(value) => <p>{value}</p>}
                              />
                            </h4>
                            <p className="Avblprice">
                              Total No. Of Orogram Coins
                            </p>
                          </Card.Text>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col xl={4} md={4} sm={12}>
                      <Card className="border bg-white" border="info">
                        <Card.Body className="d-flex justify-content-center">
                          <Card.Text>
                            <h4
                              className="pricecard"
                              style={{ fontSize: "25px" }}
                            >
                              <CurrencyFormat
                                style={{ color: "black !important" }}
                                value={40}
                                displayType={"text"}
                                decimalScale={2}
                                thousandSeparator={true}
                                prefix={"$"}
                                fixedDecimalScale={true}
                                renderText={(value) => <p>{value}</p>}
                              />
                            </h4>
                            <p className="Avblprice">Admin Holded coins</p>
                          </Card.Text>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col xl={4} md={4} sm={12}>
                      <Card className="border bg-white" border="info">
                        <Card.Body className="d-flex justify-content-center">
                          <Card.Text>
                            <h4
                              className="pricecard"
                              style={{
                                color: "#444",
                                fontSize: "25px",
                              }}
                            >
                              <CurrencyFormat
                                style={{ color: "black !important" }}
                                value={40}
                                displayType={"text"}
                                decimalScale={2}
                                thousandSeparator={true}
                                prefix={"$"}
                                fixedDecimalScale={true}
                                renderText={(value) => <p>{value}</p>}
                              />
                            </h4>
                            <p className="Avblprice">Remaining Coins</p>
                          </Card.Text>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </div>
          </div>
          <div className="row"></div>
          {/* <Row>
            <Col xl="8">
              <DataTable
                header="Portfolio"
                rows={tableData}
                columns={columns}
              />
            </Col>
            <Col xl="4">
              <Card>
                <Card.Body>
                  <div id="chart" className="line-chart-style bar-chart">
                    <ReactApexChart
                      options={state.options}
                      series={state.series}
                      type="bar"
                      height={300}
                    />
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row> */}
        </div>
        <ToastContainer />
      </div>
    </>
  );
};
export default Home;




  //  {
  //    topcoinsShow.map((item, ind) => (
  //      <div className="col-xl-4 col-lg-4 col-sm-12" key={ind}>
  //        <div className={`card border-4 card-box ${item.bgcolor}`}>
  //          <div className="card-header border-0 pb-0">
  //            <div className="chart-num-days  ">
  //              {item.percent_change_30d < 0 ? (
  //                <p className="" style={{ color: "red" }}>
  //                  <i className="fa fa-arrow-down me-2 "></i>
  //                  {item.percent_change_30d.toFixed(2)}
  //                  %(30 Days)
  //                </p>
  //              ) : (
  //                <p style={{ color: "green" }}>
  //                  <i className="fa fa-arrow-up me-2 "></i>
  //                  {item.percent_change_30d.toFixed(2)}
  //                  %(30 Days)
  //                </p>
  //              )}

  //              <h2 className="count-num text-black  ">
  //                <CurrencyFormat
  //                  style={{ color: "black !important" }}
  //                  value={item?.price}
  //                  displayType={"text"}
  //                  decimalScale={2}
  //                  thousandSeparator={true}
  //                  prefix={"$"}
  //                  fixedDecimalScale={true}
  //                  renderText={(value) => <p>{value}</p>}
  //                />
  //                {item.name}
  //              </h2>
  //            </div>
  //            <span className="badge badge-soft-success font-size-12">
  //              <img
  //                loading="lazy"
  //                src={cryptoicons[item?.symbol]}
  //                width="50px"
  //              />
  //            </span>
  //          </div>
  //          <div className="card-body p-0 custome-tooltip">
  //            {/* <div id="widgetChart3" className="chart-primary"></div> */}

  //            <WidgetChartIndex3
  //              name={item.symbol}
  //              price={item.price}
  //              data={[
  //                {
  //                  symbol: item.symbol,
  //                  price: [
  //                    item.percent_change_1h,
  //                    item.percent_change_7d,
  //                    item.percent_change_30d,
  //                  ],
  //                },
  //              ]}
  //            />
  //          </div>
  //        </div>
  //      </div>
  //    ));
  //  }