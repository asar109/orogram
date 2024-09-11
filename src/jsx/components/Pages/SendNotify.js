import React from "react";
import { Button, Card, Form, Modal, Spinner, Tab } from "react-bootstrap";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import { Col, Row } from "react-bootstrap";
import PageTitle from "../../layouts/PageTitle";
import axiosInstance from "../../../services/AxiosInstance";
import { errorMessage, successMessage } from "../../../utils/message";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
function SendNotify() {
  const [contant, setContant] = React.useState("");
  const semdNotify = async () => {
    setLoader(true);
    try {
      const res = await axiosInstance
        .post(`/api/admin/notification/`, { content: contant })
        .catch((err) => {
          console.log(err.response.data, "err.response.data");
        });
      if (res.status === 200) {
        setLoader(false);
        console.log(res.data, "notification send successfully");
        successMessage("Notification Sent Successfully");
        return res.data;
      }
    } catch (err) {
      setLoader(false);
      errorMessage(err.response.data || err.message);
      console.log(err);
    }
  };
  const [loader, setLoader] = useState(false);

  return (
    <>
      <PageTitle
        activeMenu="Notification"
        motherMenu="Dashboard"
        link="admin-dashboard"
      />
      <Modal.Body>
        <Tab.Container defaultActiveKey="Navbuy">
          <Tab.Content>
            <Tab.Pane eventKey="Navbuy">
              <Tab.Container defaultActiveKey="Navbuymarket">
                <Card>
                  <Card.Header className="headernotify">
                    Manage Notification
                  </Card.Header>
                  <Card.Body>
                    <div>
                      <p style={{ color: "black" }}>Write a Notification </p>
                    </div>

                    <div className="textarea">
                      <FloatingLabel
                        controlId="floatingTextarea2"
                        label="Write a Notification here"
                        className="textarea2"
                      >
                        <Form.Control
                          onChange={(e) => setContant(e.target.value)}
                          as="textarea"
                          placeholder="Leave a comment here"
                          style={{ height: "100px" }}
                        />
                      </FloatingLabel>
                    </div>
                    <div className="open2">
                      {!loader && (
                        <Button
                          onClick={semdNotify}
                          className="open2"
                          variant="info"
                          style={{ backgroundColor: "#3eacff", color: "white" }}
                        >
                          Send
                        </Button>
                      )}
                      {loader && (
                        <div
                          className="open2"
                          variant="info"
                          style={{ backgroundColor: "#3eacff", color: "white" }}
                        >
                          <Spinner></Spinner>
                        </div>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              </Tab.Container>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </Modal.Body>
    </>
  );
}
export default SendNotify;
