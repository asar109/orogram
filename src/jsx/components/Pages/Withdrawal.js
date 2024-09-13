import { Button, Card, Col, Row } from "react-bootstrap";
import PageTitle from "../../layouts/PageTitle";
import WithdrawalOrderForm from "../CustomComponent/WithdrawalOrderForm";
const Withdrawal = () => {
  return (
    <Col>
      <PageTitle activeMenu="Send" motherMenu="Dashboard" link="dashboard" />
      <Row>
        <Col xs={3}></Col>
        <Col xs={12} lg={6}>
          <div className="card h-auto border-1" style={{ marginTop: "7.5rem" }}>
            <div className="card-body ">
              <div className="sell-element ">
                {/* //style={{ marginTop:"2rem", height:'18rem' }} */}
                <WithdrawalOrderForm />
              </div>
            </div>
          </div>
        </Col>
        <Col xs={3}></Col>
      </Row>
    </Col>
  );
};

export default Withdrawal;
