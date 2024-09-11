import React, { useState } from "react";
import {
  Button,
  ButtonGroup,
  Card,
  Col,
  Modal,
  Row,
  Tab,
} from "react-bootstrap";
import PageTitle from "../../layouts/PageTitle";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import TabelComponent from "../../layouts/TabelComponent";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllDepositRequest,
  updateDepositStatus,
} from "../../../Redux/coins";
import CurrencyFormat from "react-currency-format";
import { Spinner } from "react-bootstrap";

const DepositRequests = () => {
  const [pending, setPending] = useState(false);
  const [accepted, setAccepted] = useState(true);
  const [rejected, setRejected] = useState(false);
  const [largeModal, setLargeModal] = useState(false);
  const [modalCurrentData, setModalCurrentData] = useState();
  const [rejectedReason, setRejectedReason] = useState(
    "Your request is rejected"
  );
  const dispatch = useDispatch();
  const requests = useSelector((state) => state.coinReducer);
  const getData = async () => {
    const res = await dispatch(getAllDepositRequest());
    console.log(res);
  };
  const handleAccept = async (id) => {
    console.log("id from com", id);
    let data = {
      status: "approved",
      status_description: "Your request has been accepted",
      id: id,
    };
    const res = await dispatch(updateDepositStatus(data));
    console.log("res of deposit data", res);
    if (res.payload === "updated") {
      dispatch(getAllDepositRequest()).then((res) => {
        setPending(false);
        setAccepted(true);
      });
    }
  };
  const onRejected = async () => {
    console.log("id from com", modalCurrentData.id);
    let data = {
      status: "rejected",
      status_description: rejectedReason,
      id: modalCurrentData.id,
    };
    const res = await dispatch(updateDepositStatus(data));
    console.log("res of deposit data", res);
    if (res.payload === "updated") {
      dispatch(getAllDepositRequest()).then((res) => {
        setPending(false);
        setRejected(true);
      });
    }
    setLargeModal(false);
  };
  const formattedDate = (item) => {
    if (!item) return;
    dayjs.extend(utc);
    dayjs.extend(timezone);
    return dayjs(item)
      .tz(Intl.DateTimeFormat().resolvedOptions().timeZone)
      .format("DD MMM YYYY HH:mm");
  };

  React.useEffect(() => {
    getData();
  }, []);

  const renderTabelPending = () => {
    return [
      {
        title: "In Order",
        sortId: "id",
        render: (rowData) => {
          return <span>{rowData.count}</span>;
        },
      },
      {
        title: "Name",
        sortId: "user_name",
        render: (rowData) => {
          return <span>{rowData.user_name}</span>;
        },
      },
      {
        title: "Amount",
        sortId: "amount",
        render: (rowData) => {
          return (
            <span>
              {" "}
              {"$" +
                (rowData?.amount?.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }) || 0)}
            </span>
          );
        },
      },
      // {
      //   title: "Status",
      //   render: (rowData) => {
      //     return <span>{rowData.status}</span>;
      //   },
      // },
      {
        title: "Description",
        render: (rowData) => {
          return <span>{rowData.status_description}</span>;
        },
      },

      {
        title: "Date",
        sortId: "requested_at",
        render: (rowData) => {
          return <span>{formattedDate(rowData.requested_at)}</span>;
        },
      },
      {
        title: "Action",
        render: (rowData) => {
          return (
            <div>
              {requests?.isloading && (
                <>
                  {" "}
                  <Button
                    variant="info"
                    style={{ backgroundColor: "#3eacff", color: "white" }}
                    size="sm"
                    onClick={() => handleAccept(rowData.id)}
                  >
                    Accept
                  </Button>
                  <Button
                    variant="danger"
                    className="text-center mx-2 "
                    size="sm"
                    onClick={() => {
                      setLargeModal(true);
                      setModalCurrentData(rowData);
                     // handleReject(rowData)
                    }}
                  >
                    Reject
                  </Button>
                </>
              )}
              {!requests?.isloading && (
                <>
                  {" "}
                  <Button
                    variant="info"
                    style={{ backgroundColor: "#3eacff", color: "white" }}
                    size="sm"
                    onClick={() => handleAccept(rowData.id)}
                  >
                    Accept
                  </Button>
                  <Button
                    variant="danger"
                    className="text-center mx-2 "
                    size="sm"
                    onClick={() => {
                      setLargeModal(true);
                      setModalCurrentData(rowData);
                      //handleReject(rowData)
                    }}
                  >
                    Reject
                  </Button>
                </>
              )}
            </div>
          );
        },
      },
    ];
  };
  const renderTabelAccepted = () => {
    return [
      {
        title: "In Order",
        sortId: "id",
        render: (rowData) => {
          return <span>{rowData.count}</span>;
        },
      },

      {
        title: "Name",
        sortId: "user_name",
        render: (rowData) => {
          return <span>{rowData.user_name}</span>;
        },
      },
      {
        title: "Amount",
        sortId: "amount",
        render: (rowData) => {
          return (
            <span>
              {" "}
              {"$" +
                (rowData?.amount?.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }) || 0)}
            </span>
          );
        },
      },
      {
        title: "Wallet Type",
        sortId: "walletType",
        render: (rowData) => {
          return <span style={{ color: "black" }}>{rowData.walletType}</span>;
        },
      },
      {
        title: "From",
        sortId: "from",
        render: (rowData) => {
          return <span style={{ color: "black" }}>{rowData.from}</span>;
        },
      }, {
        title: "To",
        sortId: "to",
        render: (rowData) => {
          return <span style={{ color: "black" }}>{rowData.to}</span>;
        },
      },
      {
        title: "Tx",
        sortId: "tx_hash",
        render: (rowData) => {
          return <span style={{ color: "black" }}>{rowData.tx_hash}</span>;
        },
      },

      {
        title: "Date",
        sortId: "requested_at",
        render: (rowData) => {
          return <span>{formattedDate(rowData.requested_at)}</span>;
        },
      },
    ];
  };
  const renderTabelRejected = () => {
    return [
      {
        title: "In Order",
        sortId: "id",
        render: (rowData) => {
          return <span>{rowData.count}</span>;
        },
      },
      {
        title: "Name",
        sortId: "user_name",
        render: (rowData) => {
          return <span>{rowData.user_name}</span>;
        },
      },
      {
        title: "Amount",
        sortId: "amount",
        render: (rowData) => {
          return (
            <span>
              {"$" +
                (rowData?.amount?.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }) || 0)}
            </span>
          );
        },
      },
      // {
      //   title: "Status",
      //   render: (rowData) => {
      //     return <span>{rowData.status}</span>;
      //   },
      // },
      {
        title: "Description",
        render: (rowData) => {
          return <span>{rowData.status_description}</span>;
        },
      },

      {
        title: "Date",
        sortId: "requested_at",
        render: (rowData) => {
          return <span>{formattedDate(rowData.requested_at)}</span>;
        },
      },
    ];
  };
  const data = ["", "", ""];
  const rejectedData = requests?.data.filter(
    (obj) => obj.status === "rejected"
  );
  const acceptedData = requests?.data.filter(
    (obj) => obj.status === "accepted"
  );
  const pendingData = requests?.data.filter((obj) => obj.status === "pending");
  return (
    <>
      <PageTitle
        activeMenu="Deposit Requests"
        motherMenu="Dashboard"
        link="admin-dashboard"
      />

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
            setAccepted(false);
            setRejected(false);
            setPending(true);
          }}
          style={{
            backgroundColor: pending ? "#3eacff" : "#fff",
            color: pending ? "#fff" : "#3eacff",
            borderColor: "white",
          }}
          variant="info"
        >
          Pending
        </Button>
        <Button
          onClick={() => {
            setAccepted(true);
            setRejected(false);
            setPending(false);
          }}
          style={{
            backgroundColor: accepted ? "#3eacff" : "#fff",
            color: accepted ? "#fff" : "#3eacff",
            borderColor: "white",
          }}
          variant="info"
        >
          Accepted
        </Button>
        <Button
          onClick={() => {
            setAccepted(false);
            setRejected(true);
            setPending(false);
          }}
          style={{
            backgroundColor: rejected ? "#3eacff" : "#fff",
            color: rejected ? "#fff" : "#3eacff",
            borderColor: "white",
          }}
          variant="info"
        >
          Rejected
        </Button>
      </ButtonGroup> 

      {pending && (
        <TabelComponent
          cols={renderTabelPending()}
          data={requests?.data
            .filter((obj) => obj.status === "pending")
            .map((obj, index) => {
              return {
                ...obj,
                count: index + 1,
                user_name: obj.user.user_name,
              };
            })}
          // tabeltitle={"Deposit Pending Requests"}
          itemsPerPage={8}
          searchKey={"user_name"}
          searchPlaceholder="Search Name"
        />
      )}
      {accepted && (
        <TabelComponent
          cols={renderTabelAccepted()}
          data={requests?.data
            .filter((obj) => obj.status === "approved")
            .map((obj, index) => {
              return {
                ...obj,
                count: index + 1,
                user_name: obj.user.user_name,
              };
            })}
          // tabeltitle={"Deposit accepted Requests"}
          itemsPerPage={8}
          searchKey={"user_name"}
          searchPlaceholder="Search Name"
        />
      )}
      {rejected && (
        <TabelComponent
          cols={renderTabelRejected()}
          data={requests?.data
            .filter((obj) => obj.status === "rejected")
            .map((obj, index) => {
              return {
                ...obj,
                count: index + 1,
                user_name: obj.user.user_name,
              };
            })}
          // tabeltitle={"Deposit Rejected Requests"}
          itemsPerPage={8}
          searchKey={"user_name"}
          searchPlaceholder="Search Name"
        />
      )}

      <Modal className="fade bd-example-modal-lg" show={largeModal} size="lg">
        <Modal.Header>
          <Modal.Title>Reject Requests</Modal.Title>
          <Button
            variant=""
            className="btn-close"
            onClick={() => setLargeModal(false)}
          ></Button>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: "#f1f1f1" }}>
          <Tab.Container defaultActiveKey="Navbuy">
            <div className="">
              <Tab.Content>
                <Tab.Pane eventKey="Navbuy">
                  <Tab.Container defaultActiveKey="Navbuymarket">
                    <Card>
                      <Card.Body>
                        <Row>
                          <Col xl={1}></Col>
                          <Col xl={2}>
                            <h3 className="heading">Reason</h3>
                          </Col>
                          <Col xl={6}>
                            <form style={{ marginTop: "8px" }}>
                              <div className="input-group ">
                                {/* <input type="text" className="form-control" value={inputValue}/> */}
                                <input
                                  type="text"
                                  className="form-control"
                                  // id={inputId}
                                  value={rejectedReason}
                                  onChange={(e) =>
                                    setRejectedReason(e.target.value)
                                  }
                                />
                              </div>
                            </form>
                          </Col>
                          <Col xl={1}></Col>
                        </Row>
                        <Row></Row>
                      </Card.Body>
                    </Card>
                    <Modal.Footer style={{ justifyContent: "center" }}>
                      <Button
                        style={{ backgroundColor: "#3eacff", width: "30%" }}
                        variant="info"
                        onClick={() => onRejected()}
                      >
                        Reject
                      </Button>
                    </Modal.Footer>
                  </Tab.Container>
                </Tab.Pane>
              </Tab.Content>
            </div>
          </Tab.Container>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default DepositRequests;
