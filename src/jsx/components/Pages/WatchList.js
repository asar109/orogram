import { Col, Row } from "react-bootstrap";
import PageTitle from "../../layouts/PageTitle";
import DataTable from "../CustomComponent/WatchlistTable";
const WatchList = () => {
  const tableData = [
    { title: "ZEC", markets: "ZCash", price: "0.9632", change: "+9" },
    {
      title: "AUD",
      markets: "Australian Doller",
      price: "0.6932",
      change: "+22",
    },
    {
      title: "ETH",
      markets: "Etherium Classic",
      price: "0.6258",
      change: "+40",
    },
    { title: "XRP", markets: "Ripplecoin", price: "0.6258", change: "-11" },
    { title: "XMR", markets: "Monero", price: "0.3685", change: "-8" },
    { title: "Dash", markets: "Dash", price: "0.1478", change: "11" },
  ];

  return (
    <>
      <Col xl="12">
        <PageTitle activeMenu="Watchlist" motherMenu="Dashboard" link="dashboard" />
        <Row>
          <DataTable />
        </Row>
      </Col>
    </>
  );
};

export default WatchList;
