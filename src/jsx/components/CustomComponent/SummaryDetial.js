import React, { useEffect } from "react";
import { Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
    getAllActiveTradeAdmin
} from "../../../Redux/coins";
import cryptoicons from "../../../images/cryptoIcons/cryptoImg";
import { ProfitLossAmount } from "../../../services/DataService";
import TabelComponent from "../../layouts/TabelComponent";

const SummaryDetial = (props) => {
    const dispatch = useDispatch();
    const coinReducer = useSelector((store) => store.coinReducer);

  

    useEffect(() => {
        dispatch(getAllActiveTradeAdmin());
       
    }, []);

    const renderTabelActiveTrade = () => {
        return [
            {
                title: "Sr.No",
                render: (rowData) => {
                    return <span>{rowData?.count}</span>;
                },
            },

            {
                title: "Markets",
                sortId: "crypto_name",
                render: (rowData) => {
                    return (
                        <div className=" d-flex align-items-center">
                            <img loading="lazy"
                                src={cryptoicons[rowData?.crypto_symbol]}
                                style={{ width: "3rem" }}
                            />

                            <Col>
                                <h4 className="mb-0 ms-2">{rowData?.crypto_name}</h4>
                                <span className="text-muted ms-2">{rowData?.crypto_symbol}</span>
                            </Col>
                        </div>
                    );
                },
            },
            {
                title: "User Name",
                sortId: "user_name",
                render: (rowData) => {
                    return <span>{rowData?.user_name}</span>;
                },
            },
            {
                title: "Amount",
                sortId: "trade",
                render: (rowData) => {
                    return (
                        <span>
                            $
                            {rowData?.trade?.toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            })}
                        </span>
                    );
                },
            },
            {
                title: "Units",
                sortId: "purchase_units",
                render: (rowData) => {
                    return (
                        <span>
                            {rowData?.purchase_units?.toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            })}
                        </span>
                    );
                },
            },
            {
                title: "Open",
                sortId: "trade",
                render: (rowData) => {
                    return (
                        <span>
                            {"$" +
                                rowData?.crypto_purchase_price?.toLocaleString("en-US", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })}
                        </span>
                    );
                },
            },
            {
                title: "P/L($)",
                sortId: "profit_loss",
                render: (rowData) => {
                    return (
                        <span
                            style={{
                                color:
                                    ProfitLossAmount(
                                        rowData?.purchase_units,
                                        rowData?.crypto_purchase_price,
                                        rowData?.crypto_symbol,
                                        rowData?.trade,
                                        coinReducer

                                    ) > 0
                                        ? "green"
                                        : "red",
                            }}
                        >
                            {"$" +
                                ProfitLossAmount(
                                    rowData?.purchase_units,
                                    rowData?.crypto_purchase_price,
                                    rowData?.crypto_symbol,
                                    rowData?.trade,
                                    coinReducer

                                )?.toLocaleString("en-US", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })}
                        </span>
                    );
                },
            },
        ];
    };

    return (
        <>

            <TabelComponent
                cols={renderTabelActiveTrade()}
                data={coinReducer.allActiveTradeAdmin.filter(
                    (obj) => obj.crypto_symbol === props.symbol
                ).map((obj, index) => {
                    return {
                        ...obj,
                        count: index + 1,
                        profit_loss: ProfitLossAmount(
                            obj?.purchase_units,
                            obj?.crypto_purchase_price,
                            obj?.crypto_symbol,
                            obj?.trade,
                            coinReducer

                        ),
                        user_name: obj.user.user_name,
                    };
                })
                }
                tabeltitle={"Active Trades"}
                itemsPerPage={8}
                searchKey={"crypto_name"}
                searchKey2={"crypto_symbol"}
                searchPlaceholder="Search Markets"
            />

        </>
    );
};
export default SummaryDetial;
