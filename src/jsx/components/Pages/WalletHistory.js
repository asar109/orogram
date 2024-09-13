import { useState } from "react";
import { Button, ButtonGroup, Row } from "react-bootstrap";
import PageTitle from "../../layouts/PageTitle";
import TradeHistory from "../CustomComponent/TradeHistory";
const WalletHistory = () => {
  const tableData = [
    {
      sno: "abc",
      datetime: Date.now(),
      status: "up",
      type: "abc",
      amount: 123,
    },
    {
      sno: "abc",
      datetime: Date.now(),
      status: "up",
      type: "abc",
      amount: 124,
    },
    {
      sno: "abc",
      datetime: Date.now(),
      status: "up",
      type: "abc",
      amount: 125,
    },
    {
      sno: "abc",
      datetime: Date.now(),
      status: "up",
      type: "abc",
      amount: 126,
    },
    {
      sno: "abc",
      datetime: Date.now(),
      status: "up",
      type: "abc",
      amount: 127,
    },
  ];
  let columns = [
    { label: "Sr.No", columnName: "sno", sort: false },
    { label: "Date Time", columnName: "datetime", sort: true },
    { label: "Status", columnName: "status", sort: true },
    //{ label: 'Type', columnName: 'type', sort: true },
    { label: "Amount", columnName: "amount", sort: true },
  ];
  const [contractHistory, setContractHistory] = useState(true);
  const [trade, setTrade] = useState(false);
  const [landHistory, setLandHistory] = useState(false);
  const [pContractHistory, setPContractHistory] = useState(false);

  return (
    <>
      <PageTitle
        activeMenu="Wallet History"
        motherMenu="Dashboard"
        link="dashboard"
      />
      <Row>
        <ButtonGroup
          style={{
            width: "96%",
            marginBottom: "30px",
            "@media (maxWidth: 575px)": {
              marginTop: "50%",
            },
          }}
          aria-label="Basic example"
        >
          <Button
            onClick={() => {
              setTrade(true);
              setLandHistory(false);
              setPContractHistory(false);
              setContractHistory(false);
            }}
            style={{
              backgroundColor: trade ? "#3eacff" : "#fff",
              color: trade ? "#fff" : "#3eacff",
              borderColor: "white",
            }}
            variant="secondary"
          >
            Trade History
          </Button>
          <Button
            onClick={() => {
              setTrade(false);
              setLandHistory(false);
              setPContractHistory(false);
              setContractHistory(true);
            }}
            style={{
              backgroundColor: contractHistory ? "#3eacff" : "#fff",
              color: contractHistory ? "#fff" : "#3eacff",
              borderColor: "white",
            }}
            variant="secondary"
          >
            Contract History
          </Button>
          <Button
            onClick={() => {
              setTrade(false);
              setLandHistory(false);
              setPContractHistory(true);
              setContractHistory(false);
            }}
            style={{
              backgroundColor: pContractHistory ? "#3eacff" : "#fff",
              color: pContractHistory ? "#fff" : "#3eacff",
              borderColor: "white",
            }}
            variant="secondary"
          >
            Private contract history
          </Button>
          <Button
            onClick={() => {
              setTrade(false);
              setLandHistory(true);
              setPContractHistory(false);
              setContractHistory(false);
            }}
            style={{
              backgroundColor: landHistory ? "#3eacff" : "#fff",
              color: landHistory ? "#fff" : "#3eacff",
              borderColor: "white",
            }}
            variant="secondary"
          >
            Land contract history
          </Button>
        </ButtonGroup>
      </Row>
      {trade && (
        <TradeHistory header="Trade History" rows={tableData} columns={columns} />
      )}
      {landHistory && (
        <TradeHistory header="Deposit Logs" rows={tableData} columns={columns} />
      )}
      {contractHistory && (
        <TradeHistory header="Deposit Logs" rows={tableData} columns={columns} />
      )}
      {pContractHistory && (
        <TradeHistory header="Deposit Logs" rows={tableData} columns={columns} />
      )}
    </>
  );
};

export default WalletHistory;
