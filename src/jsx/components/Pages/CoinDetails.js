import React from 'react';
import { Tab, Nav, Dropdown, Row, Card, Col, Button, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Icons } from 'react-toastify';
import PageTitle from '../../layouts/PageTitle';


import QuickTrade from "../CustomComponent/QuickTrade"
import CoinChart from '../CustomComponent/TradeComponents/CoinChart';

const tabHeading = [
    { title: 'Bitcoin', keytype: 'bitcoin', changelog: 'bitcoin ms-0' },
    { title: 'Ethereum', keytype: 'ethereum', changelog: 'etherum' },
    { title: 'Dash', keytype: 'dash', changelog: 'dash' },
    { title: 'Litecoin', keytype: 'litecoin', changelog: 'litcoin' },
    { title: 'Ripple', keytype: 'ripple', changelog: 'ripple' },
];

const DropdownBlog = () => {
    return (
        <>
            <Dropdown className="custom-dropdown mb-0 tbl-orders-style">
                <Dropdown.Toggle className="btn sharp tp-btn i-false" as="div">
                    <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12.0335 13C12.5854 13 13.0328 12.5523 13.0328 12C13.0328 11.4477 12.5854 11 12.0335 11C11.4816 11 11.0342 11.4477 11.0342 12C11.0342 12.5523 11.4816 13 12.0335 13Z" stroke="#342E59" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12.0335 6C12.5854 6 13.0328 5.55228 13.0328 5C13.0328 4.44772 12.5854 4 12.0335 4C11.4816 4 11.0342 4.44772 11.0342 5C11.0342 5.55228 11.4816 6 12.0335 6Z" stroke="#342E59" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12.0335 20C12.5854 20 13.0328 19.5523 13.0328 19C13.0328 18.4477 12.5854 18 12.0335 18C11.4816 18 11.0342 18.4477 11.0342 19C11.0342 19.5523 11.4816 20 12.0335 20Z" stroke="#342E59" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </Dropdown.Toggle>
                <Dropdown.Menu className=" dropdown-menu-end" align="end">
                    <Dropdown.Item>Details</Dropdown.Item>
                    <Dropdown.Item className="text-danger">Cancel</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </>
    )
}

const CoinDetails = () => {
    return (
        <>
            <div className="row" breakpoints={['xxxl', 'xxl', 'xl', 'lg', 'md', 'sm', 'xs', 'xxs']}>
                <PageTitle activeMenu="Coin Details" motherMenu="Trade" />
                <div className="col-xl-12">
                    <Row>
                        <Card>
                            <Card.Body>
                                <Row >
                                    <Col xl={1} >
                                        <svg width="80" height="100" viewBox="0 0 126 126" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M64.9961 72.8351C63.7146 73.2618 62.2869 73.2618 61.0053 72.8351L47.2507 68.25L63.0007 94.5L78.7507 68.25L64.9961 72.8351Z" fill="#00ADA3" />
                                            <path d="M63.0007 63L78.7507 56.7003L63.0007 31.5L47.2507 56.7003L63.0007 63Z" fill="#00ADA3" />
                                            <path d="M63.0004 0C28.2065 0 0.000366211 28.2061 0.000366211 63C0.000366211 97.7938 28.2065 126 63.0004 126C97.7942 126 126 97.7938 126 63C125.962 28.2226 97.7777 0.0384523 63.0004 0V0ZM89.5256 60.513L67.0255 105.513C65.9145 107.737 63.2105 108.637 60.9885 107.526C60.1164 107.091 59.4106 106.385 58.9752 105.513L36.4751 60.513C35.7761 59.1094 35.8558 57.4436 36.6852 56.1129L59.1853 20.1133C60.6809 18.0067 63.5991 17.5095 65.7058 19.0051C66.1356 19.3099 66.5105 19.6835 66.8154 20.1133L89.3141 56.1129C90.145 57.4436 90.2246 59.1094 89.5256 60.513V60.513Z" fill="#00ADA3" />
                                        </svg>
                                    </Col>
                                    <Col className='mt-3' xl={7} xs={3} >

                                        <Row>
                                            <div className='d-flex align-items-start'>
                                                <h5 >Eth </h5>
                                                <p> - </p>
                                                <p > Ethereum</p>
                                            </div>
                                        </Row>
                                        <Row>
                                            <div className='d-flex align-items-start ' style={{ marginTop: '-1rem' }}>
                                                <h2 >212488.9  </h2>
                                                <p style={{ marginTop: '1rem', marginLeft: '0.5rem' }} className="text-red">-29.99[1.38]%</p>
                                            </div>
                                        </Row>
                                    </Col>
                                    <Col style={{ marginTop: "2rem" }}>
                                        <Button style={{ backgroundColor: 'white' }} className='text-black'> Add to WatchList</Button>
                                        <Button style={{ backgroundColor: '#3eacff', marginLeft: '1rem' }}> Invest</Button>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Row>
                    <Row>
                        <Col xl={9}>
                            <Card>
                                <Card.Body>
                                    <CoinChart />
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xl={3}>
                            <div className="card  digital-cash">
                                <div className="card-body py-0">
                                    <div className="text-center">
                                        <div className="media d-block">
                                            <svg width="80" height="100" viewBox="0 0 126 126" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M64.9961 72.8351C63.7146 73.2618 62.2869 73.2618 61.0053 72.8351L47.2507 68.25L63.0007 94.5L78.7507 68.25L64.9961 72.8351Z" fill="#00ADA3" />
                                                <path d="M63.0007 63L78.7507 56.7003L63.0007 31.5L47.2507 56.7003L63.0007 63Z" fill="#00ADA3" />
                                                <path d="M63.0004 0C28.2065 0 0.000366211 28.2061 0.000366211 63C0.000366211 97.7938 28.2065 126 63.0004 126C97.7942 126 126 97.7938 126 63C125.962 28.2226 97.7777 0.0384523 63.0004 0V0ZM89.5256 60.513L67.0255 105.513C65.9145 107.737 63.2105 108.637 60.9885 107.526C60.1164 107.091 59.4106 106.385 58.9752 105.513L36.4751 60.513C35.7761 59.1094 35.8558 57.4436 36.6852 56.1129L59.1853 20.1133C60.6809 18.0067 63.5991 17.5095 65.7058 19.0051C66.1356 19.3099 66.5105 19.6835 66.8154 20.1133L89.3141 56.1129C90.145 57.4436 90.2246 59.1094 89.5256 60.513V60.513Z" fill="#00ADA3" />
                                            </svg>
                                            <div className="media-content">
                                                <h4 className="mt-0 mt-md-4 fs-20 font-w700 text-black mb-0">Digital Cash</h4>
                                                <span className="font-w600 text-black">Bitcoin</span>
                                                <span className="my-4 fs-16 font-w600 d-block">1 BITCOIN = 43,474.50 USD</span>
                                                <p className="text-start">Dash is an open source cryptocurrency. It is an altcoin that was forked from the Bitcoin protocol. It is also a decentralized autonomous organization (DAO)...</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-footer p-2 border-0">
                                    <Link to={"#"} className="btn btn-link text-primary">Read more</Link>
                                </div>
                            </div>
                        </Col>


                    </Row>
                    {/* <Modal
                        className="fade bd-example-modal-lg"
                        show={largeModal}
                        size="lg"
                    >
                        <Modal.Header>
                            <Modal.Title>Modal title</Modal.Title>
                            <Button
                                variant=""
                                className="btn-close"
                                onClick={() => setLargeModal(false)}
                            >

                            </Button>
                        </Modal.Header>
                        <Modal.Body>Modal body text goes here.</Modal.Body>
                        <Modal.Footer>
                            <Button
                                variant="danger light"
                                onClick={() => setLargeModal(false)}
                            >
                                Close
                            </Button>
                            <Button
                                variant=""
                                type="button"
                                className="btn btn-primary"
                            >
                                Save changes
                            </Button>
                        </Modal.Footer>
                    </Modal> */}
                    {/* <div className="row">

                        <div className="col-xl-4 col-xxl-4 col-sm-6 ">
                            <div className="card  digital-cash">
                                <div className="card-header border-0">
                                    <h4 className="mb-0 heading">About</h4>
                                    <DropdownBlog />
                                </div>
                                <div className="card-body py-0">
                                    <div className="text-center">
                                        <div className="media d-block">
                                            <svg width="126" height="126" viewBox="0 0 126 126" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M64.9961 72.8351C63.7146 73.2618 62.2869 73.2618 61.0053 72.8351L47.2507 68.25L63.0007 94.5L78.7507 68.25L64.9961 72.8351Z" fill="#00ADA3" />
                                                <path d="M63.0007 63L78.7507 56.7003L63.0007 31.5L47.2507 56.7003L63.0007 63Z" fill="#00ADA3" />
                                                <path d="M63.0004 0C28.2065 0 0.000366211 28.2061 0.000366211 63C0.000366211 97.7938 28.2065 126 63.0004 126C97.7942 126 126 97.7938 126 63C125.962 28.2226 97.7777 0.0384523 63.0004 0V0ZM89.5256 60.513L67.0255 105.513C65.9145 107.737 63.2105 108.637 60.9885 107.526C60.1164 107.091 59.4106 106.385 58.9752 105.513L36.4751 60.513C35.7761 59.1094 35.8558 57.4436 36.6852 56.1129L59.1853 20.1133C60.6809 18.0067 63.5991 17.5095 65.7058 19.0051C66.1356 19.3099 66.5105 19.6835 66.8154 20.1133L89.3141 56.1129C90.145 57.4436 90.2246 59.1094 89.5256 60.513V60.513Z" fill="#00ADA3" />
                                            </svg>
                                            <div className="media-content">
                                                <h4 className="mt-4 fs-20 font-w700 text-black mb-0">Digital Cash</h4>
                                                <span className="font-w600 text-black">Ethereum</span>
                                                <span className="my-4 fs-16 font-w600 d-block">1 ETHEREUM = 3,219.89 USD</span>
                                                <p className="text-start">Ethereum is an open source cryptocurrency. It is an altcoin that was forked from the Bitcoin protocol. It is also a decentralized autonomous organization (DAO)...</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-footer p-2 border-0">
                                    <Link to={"#"} className="btn btn-link text-primary">Read more</Link>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-8 col-sm-8">
                            <QuickTrade />
                        </div>
                    </div> */}
                </div>
            </div>
        </>
    )
}
export default CoinDetails;