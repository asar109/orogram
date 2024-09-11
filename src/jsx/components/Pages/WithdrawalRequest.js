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
  getAllWithDrawRequest,
  updateWithdrawStatus,
} from "../../../Redux/coins";
import CurrencyFormat from "react-currency-format";
import { errorMessage } from "../../../utils/message";
import axiosInstance from "../../../services/AxiosInstance";

const WithdrawalRequest = () => {
  const [bankData, setBankData] = useState(null);
  const [bankmodel, setBankModel] = useState(false);
  const [pending, setPending] = useState(true);
  const [accepted, setAccepted] = useState(false);
  const [rejected, setRejected] = useState(false);
  const [largeModal, setLargeModal] = useState(false);
  const [modalCurrentData, setModalCurrentData] = useState();
  const [rejectedReason, setRejectedReason] = useState(
    "Your request is rejected"
  );
  const dispatch = useDispatch();
  const requests = useSelector((state) => state.coinReducer);
  const getData = async () => {
    const res = await dispatch(getAllWithDrawRequest());
    console.log(res);
  };
  const filterData = (data, type) => {
    const filteredData = data?.filter((item) => item.status === type);
    return filteredData;
  };
  const handleAccept = async (id) => {
    console.log("id from com", id);
    let data = {
      status: "approved",
      status_description: "Your request has been accepted",
      id: id,
    };
    const res = await dispatch(updateWithdrawStatus(data));
    console.log("res of deposit data", res);
    if (res.payload === "updated") {
      dispatch(getAllWithDrawRequest()).then((res) => {
        debugger;
        setPending(false);
        setAccepted(true);
      });
    }
  };
  const onRejected = async () => {
    console.log("id from com", modalCurrentData.id);
    let data = {
      status: "canceled",
      status_description: rejectedReason,
      id: modalCurrentData.id,
    };
    const res = await dispatch(updateWithdrawStatus(data));
    console.log("res of deposit data", res);
    if (res.payload === "updated") {
      dispatch(getAllWithDrawRequest()).then((res) => {
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

  const viewBankDetails = (data) => {
    axiosInstance
      .get(`api/bankdetail/${data.user_id}`)
      .then((res) => {
        debugger;
        setBankData(
          res.data === null
            ? {
                bank_name: "Not Available",
                account_number: "Not Available",
                routing_number: "Not Available",
                bank_address: "Not Available",
                bank_city: "Not Available",
                bank_state: "Not Available",
                bank_zipcode: "Not Available",
                user_id: data.user_id,
              }
            : res.data
        );
        setBankModel(true);
      })
      .catch((err) => {
        errorMessage(err.response.data || err.message);
      });
  };

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
      {
        title: "Withdraw Type",
        render: (rowData) => {
          return <span>{rowData.withdraw_type}</span>;
        },
      },
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
        title: "BANK DETAILS",
        sortId: "requested_at",
        render: (rowData) => {
          return (
            <div
              className="text-center"
              style={{ cursor: "pointer", color: "#3eacff" }}
              onClick={() => viewBankDetails(rowData)}
            >
              View
            </div>
          );
        },
      },
      {
        title: "Action",
        render: (rowData) => {
          return (
            <div>
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
        title: "Withdraw Type",
        render: (rowData) => {
          return <span>{rowData.withdraw_type}</span>;
        },
      },
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
        title: "Withdraw Type",
        render: (rowData) => {
          return <span>{rowData.withdraw_type}</span>;
        },
      },
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
  return (
    <>
      <PageTitle
        activeMenu="Withdrawal Requests"
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
          variant="infor"
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
          data={filterData(requests?.withdrawRequest, "pending").map(
            (obj, index) => {
              return {
                ...obj,
                count: index + 1,
                user_name: obj.user.user_name,
              };
            }
          )}
          tabeltitle={"Withdrawal Pending Requests"}
          itemsPerPage={8}
          searchKey={"user_name"}
          searchPlaceholder="Search Name"
        />
      )}
      {accepted && (
        <TabelComponent
          cols={renderTabelAccepted()}
          data={filterData(requests?.withdrawRequest, "approved").map(
            (obj, index) => {
              return {
                ...obj,
                count: index + 1,
                user_name: obj.user.user_name,
              };
            }
          )}
          tabeltitle={"Withdrawal Accepted Requests"}
          itemsPerPage={8}
          searchKey={"user_name"}
          searchPlaceholder="Search Name"
        />
      )}
      {rejected && (
        <TabelComponent
          cols={renderTabelRejected()}
          data={filterData(requests?.withdrawRequest, "canceled").map(
            (obj, index) => {
              return {
                ...obj,
                count: index + 1,
                user_name: obj.user.user_name,
              };
            }
          )}
          tabeltitle={"Withdrawal Rejected Requests"}
          itemsPerPage={8}
          searchKey={"user_name"}
          searchPlaceholder="Search Name"
        />
      )}

      <Modal className="fade bd-example-modal-lg" show={largeModal} size="lg">
        <Modal.Header>
          <Modal.Title>Reject Request</Modal.Title>
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
      <Modal className="fade" show={bankmodel}>
        <Modal.Header>
          <Modal.Title>User Bank Details</Modal.Title>
          <Button
            variant=""
            className="btn-close"
            onClick={() => setBankModel(false)}
          ></Button>
        </Modal.Header>
        <Modal.Body>
          <div class="form-group">
            <div className="d-flex justify-content-center align-items-center p-3">
              <div
                className="d-flex  align-items-center justify-content-start text-uppercase fw-bold"
                style={{ flex: 3 }}
              >
                User Id
              </div>
              <div
                className="d-flex  align-items-center justify-content-center "
                style={{ flex: 3 }}
              >
                {bankData?.user_id}
              </div>
            </div>
            <div className="d-flex justify-content-center align-items-center p-3">
              <div
                style={{ flex: 3 }}
                className="d-flex  align-items-center justify-content-start text-uppercase fw-bold"
              >
                USER EMAIL
              </div>
              <div
                style={{ flex: 3 }}
                className="d-flex  align-items-center justify-content-center "
              >
                {bankData?.user?.email || "No Email Found"}
                {console.log("bankData", bankData)}
              </div>
            </div>
            <div className="d-flex justify-content-center align-items-center p-3">
              <div
                style={{ flex: 3 }}
                className="d-flex  align-items-center justify-content-start text-uppercase fw-bold"
              >
                Bank Name
              </div>
              <div
                style={{ flex: 3 }}
                className="d-flex  align-items-center justify-content-center "
              >
                {bankData?.bank_name || "No Bank Name Found"}
              </div>
            </div>
            <div className="d-flex justify-content-center align-items-center p-3">
              <div
                style={{ flex: 3 }}
                className="d-flex  align-items-center justify-content-start text-uppercase fw-bold"
              >
                Bank Account No
              </div>
              <div
                style={{ flex: 3 }}
                className="d-flex  align-items-center justify-content-center "
              >
                {bankData?.account_number || "No Account Number Found"}
              </div>
            </div>
            <div className="d-flex justify-content-center align-items-center p-3">
              <div
                style={{ flex: 3 }}
                className="d-flex  align-items-center justify-content-start text-uppercase fw-bold"
              >
                Account Holder
              </div>
              <div
                style={{ flex: 3 }}
                className="d-flex  align-items-center justify-content-center "
              >
                {bankData?.account_name || "No Account Holder Name"}
              </div>
            </div>
            <div className="d-flex justify-content-center align-items-center p-3">
              <div
                style={{ flex: 3 }}
                className="d-flex  align-items-center justify-content-start text-uppercase fw-bold"
              >
                BIC or SWIFT
              </div>
              <div
                style={{ flex: 3 }}
                className="d-flex  align-items-center justify-content-center "
              >
                {bankData?.bic_swift || "No BIC or SWIFT Found"}
              </div>
            </div>
            <div className="d-flex justify-content-center align-items-center p-3">
              <div
                style={{ flex: 3 }}
                className="d-flex  align-items-center justify-content-start text-uppercase fw-bold"
              >
                USDT Adress
              </div>
              <div
                style={{ flex: 3 }}
                className="d-flex  align-items-center justify-content-center "
              >
                {bankData?.usdt_payout || "No USDT Adress Found"}
              </div>
            </div>
            <div className="d-flex justify-content-center align-items-center p-3">
              <div
                style={{ flex: 3 }}
                className="d-flex  align-items-center justify-content-start text-uppercase fw-bold"
              >
                Network
              </div>
              <div
                style={{ flex: 3 }}
                className="d-flex  align-items-center justify-content-center "
              >
                {bankData?.network || "No Network Found"}
              </div>
            </div>
          </div>
        </Modal.Body>
        {/* <Modal.Footer>
          <Button
            // onClick={() => setBasicModal(false)}
            variant="danger light"
          >
            Close
          </Button>
          <Button variant="primary">Save changes</Button>
        </Modal.Footer> */}
      </Modal>
    </>
  );
};

export default WithdrawalRequest;
