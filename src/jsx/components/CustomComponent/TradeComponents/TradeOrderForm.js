import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import ReactSlider from 'react-slider'
import Nouislider from "nouislider-react";
import { Button, Card, Col, Row } from 'react-bootstrap';

const TradeOrderForm = (noSl, flag) => {
   
    return (
        <>
            <form>
                {flag ? <h1>true</h1>: <h1>false</h1>}
                {noSl ?
                    <div className="sell-blance">
                        <h1>no sl</h1>

                        <Row>
                            <Col xl={1}></Col>
                            <Col xl={2}>
                                <h3 style={{ color: '#3eacff', }}>Rate</h3>
                            </Col>
                            <Col xl={6}>
                                <form>
                                    <div className="input-group ">
                                        <span className="input-group-text" >-</span>
                                        <input type="text" className="form-control" />
                                        <span className="input-group-text">+</span>
                                    </div>
                                </form>
                            </Col>
                            <Col><Button style={{ backgroundColor: '#3eacff', }}>Converter</Button>
                            </Col>
                            <Col xl={1}></Col>
                        </Row>
                        <Row>
                            <div className="text-center mb-0">
                                <p> 100% of the Position Amount </p>
                            </div>
                        </Row>
                    </div>
                    : <div className="sell-blance">
                        <h1>hsdlfskjf</h1>
                        <Card>
                        <Row>
                            <Col xl={1}></Col>
                            <Col xl={2}>
                                <h3 style={{ color: '#3eacff', }}>Rate</h3>
                            </Col>
                            <Col xl={6}>
                                <form>
                                    <div className="input-group ">
                                        <span className="input-group-text" >-</span>
                                        <input type="text" className="form-control" />
                                        <span className="input-group-text">+</span>
                                    </div>
                                </form>
                            </Col>
                            <Col><Button style={{ backgroundColor: '#3eacff', }}>Converter</Button>
                            </Col>
                            <Col xl={1}></Col>
                        </Row>
                        <Row>
                            <div className="text-center mb-0">
                                <p> 100% of the Position Amount </p>
                            </div>
                        </Row>
                        <Card.Body></Card.Body>
                        </Card>
                    </div>
                }


            </form>
        </>
    )
}
export default TradeOrderForm;