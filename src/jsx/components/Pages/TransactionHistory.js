import { useEffect, useState } from "react";
import { Button, ButtonGroup, Card, Col, Row } from "react-bootstrap";
import PageTitle from "../../layouts/PageTitle";
import DepositDataTable from "../CustomComponent/TransactionDepositHistoryTable";
import WithdrawalDataTable from "../CustomComponent/TransactionWithdrawHistoryTable";
const TransactionHistory = () => {
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
  const [deposit, setDeposit] = useState(true);
  const [withdraw, setWithdraw] = useState(false);

  return (
    <>
      <PageTitle
        activeMenu="Transaction History"
        motherMenu="Dashboard"
        link="dashboard"
      />
      <Row>
        <ButtonGroup
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
              setDeposit(true);
              setWithdraw(false);
            }}
            style={{
              backgroundColor: deposit ? "#3eacff" : "#fff",
              color: deposit ? "#fff" : "#3eacff",
              borderColor: "white",
            }}
            variant="secondary"
          >
            Deposit Logs

          </Button>
          <Button
            onClick={() => {
              setDeposit(false);
              setWithdraw(true);
            }}
            style={{
              backgroundColor: withdraw ? "#3eacff" : "#fff",
              color: withdraw ? "#fff" : "#3eacff",
              borderColor: "white",
            }}
            variant="secondary"
          >
            Withdrawal Logs
          </Button>
        </ButtonGroup>
      </Row>
      {deposit ? (
        <DepositDataTable
          header="Deposit Logs"
          rows={tableData}
          columns={columns}
        />
      ) : (
        <WithdrawalDataTable
          header="Withdrawal Logs"
          rows={tableData}
          columns={columns}
        />
      )}
    </>
  );
};

export default TransactionHistory;
