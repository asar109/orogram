

import { useEffect, useRef, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";


const DataTable = ({ header, description, rows, columns, trade = false }) => {
    const [data, setData] = useState(
        document.querySelectorAll("#market_wrapper tbody tr")
    );
    const [largeModal, setLargeModal] = useState(false)
    const [noSl, setNoSl] = useState(true)
    const navigate = useNavigate();
    const sort = 6;
    const activePag = useRef(0);
    const [test, settest] = useState(0);

    const buyNow = (value) => {
        console.log("row clicked", value)
        // navigate("/coin-details")
        setLargeModal(true)
    }

    // Active data
    const chageData = (frist, sec) => {
        for (var i = 0; i < data.length; ++i) {
            if (i >= frist && i < sec) {
                data[i].classList.remove("d-none");
            } else {
                data[i].classList.add("d-none");
            }
        }
    };
    // use effect
    useEffect(() => {
        setData(document.querySelectorAll("#market_wrapper tbody tr"));
        //chackboxFun();
    }, [test]);


    // Active pagginarion
    activePag.current === 0 && chageData(0, sort);
    // paggination
    let paggination = Array(Math.ceil(data.length / sort))
        .fill()
        .map((_, i) => i + 1);

    // Active paggination & chage data
    const onClick = (i) => {
        activePag.current = i;
        chageData(activePag.current * sort, (activePag.current + 1) * sort);
        settest(i);
    };

    const [sortD, setSort] = useState({ columnName: '', sortType: 'asc' });

    const onSort = (columnName) => {
        let sortType = 'asc';
        if (sortD.columnName === columnName && sortD.sortType === 'asc') {
            sortType = 'desc';
        }
        setSort({ columnName, sortType });
    };
    const sortData = (rows, columnName, sortType) => {
        return [...rows].sort((a, b) => {
            if (sortType === 'asc') {
                if (a[columnName] < b[columnName]) return -1;
                if (a[columnName] > b[columnName]) return 1;
            } else {
                if (a[columnName] < b[columnName]) return 1;
                if (a[columnName] > b[columnName]) return -1;
            }
            return 0;
        });
    };
    return (
        <div className="col-xl-12">
            <div className="card">
                <div className="card-header border-0">
                    <Col xl={12}>
                        <Row><h3>{header}</h3></Row>
                        <Row>
                            <p className="">{description}</p>
                        </Row>
                    </Col>
                </div>
                <div className="card-body pt-0">
                    <div className="table-responsive dataTablemarket">
                        <div id="market_wrapper" className="dataTables_wrapper no-footer">
                            <table className="table dataTable  shadow-hover display" style={{ minWidth: "845px" }}>
                                <thead>
                                    <tr >
                                        {columns.map((column, index) => (
                                            <th key={index} style={{ textAlign:  "center" }} >
                                                {column.label}
                                                {column.sort ? (
                                                    <span type='button' onClick={() => column.sort ? onSort(column.columnName) : ''}>
                                                        {sortD.columnName === column.columnName && sortD.sortType === 'asc'
                                                            ? <i className="fa fa-arrow-down ms-2 fs-14" style={{ opacity: '0.7', }} />
                                                            :
                                                            <i className="fa fa-arrow-up ms-2 fs-14" style={{ opacity: '0.7', }} />
                                                        }
                                                    </span>
                                                ) : null}

                                            </th>

                                        ))}

                                    </tr>

                                </thead>
                                <tbody >
                                    {sortData(rows, sortD.columnName, sortD.sortType).map((item, index) => (
                                        <tr key={index} >
                                            <td className="text-center">
                                               {item.sno}
                                            </td>
                                            <td className="text-center">{item.datetime}</td>
                                            <td className="text-center">{item.status}</td>
                                            <td className="text-center">{item.type}</td>
                                            <td className="text-center">{item.amount}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="d-sm-flex text-center justify-content-between align-items-center mt-3 mb-3">
                                <div className="dataTables_info">
                                    Showing {activePag.current * sort + 1} to{" "}
                                    {data.length > (activePag.current + 1) * sort
                                        ? (activePag.current + 1) * sort
                                        : data.length}{" "}
                                    of {data.length} entries
                                </div>
                                <div
                                    className="dataTables_paginate paging_simple_numbers mb-0"
                                    id="application-tbl1_paginate"
                                >
                                    <Link
                                        className="paginate_button previous "
                                        onClick={() =>
                                            activePag.current > 0 &&
                                            onClick(activePag.current - 1)
                                        }
                                    >
                                        <i className="fa fa-angle-double-left" ></i>
                                    </Link>
                                    <span>
                                        {paggination.map((number, i) => (
                                            <Link
                                                key={i}

                                                className={`paginate_button  ${activePag.current === i ? "current" : ""
                                                    } `}
                                                onClick={() => onClick(i)}
                                            >
                                                {number}
                                            </Link>
                                        ))}
                                    </span>

                                    <Link
                                        className="paginate_button next"
                                        onClick={() =>
                                            activePag.current + 1 < paggination.length &&
                                            onClick(activePag.current + 1)
                                        }
                                    >
                                        <i className="fa fa-angle-double-right" ></i>
                                    </Link>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default DataTable;