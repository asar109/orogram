

import { useEffect, useRef, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";


const DataWithdrawTable = ({ header, description, rows, columns, trade = false }) => {
    const [data, setData] = useState(
        document.querySelectorAll("#market_wrapper tbody tr")
    );
    const [status , setStatus] = useState("pending")
    const [statusDescription , setStatusDescription] = useState("Wait while we process your request")
    
    const [largeModal, setLargeModal] = useState(false)
    const [noSl, setNoSl] = useState(true)
    const navigate = useNavigate();
    const sort = 6;
    const activePag = useRef(0);
    const [test, settest] = useState(0);
    const dispatch = useDispatch();

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
    // const handleAccept = async (id) => {
    //     console.log("id from com", id)
    //    // setStatus("accepted")
    //    // setStatusDescription("Your request has been accepted")
    //     let data = {
    //         status: "approved",
    //         status_description:"Your request has been accepted",
    //         id: id
    //     }
    //   const res = await dispatch(updateDepositStatus(data))
    //     console.log("res of deposit data", res)
    //     if(res.payload=== "updated"){
    //         dispatch(getAllDepositRequest());
    //     }

    //     //getData()
    // }

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
                                            </th>

                                        ))}

                                    </tr>

                                </thead>
                                <tbody >
                                   { rows.map((item, index) => (
                                        <tr key={index} >
                                            <td className="text-center">
                                               {index+1}
                                            </td>
                                            <td className="text-center">{item.amount}</td>
                                            <td className="text-center">{item.status}</td>
                                            <td className="text-center">{item.status_description}</td>
                                            <td className="text-center">{item.requested_at}</td>
                                            {/* <td className="text-center"><Button variant="primary" className="btn-sm mx-2 " size="sm" onClick={()=> handleAccept(item.id)} >Accept</Button> */}
                                            <td className="text-center"><Button variant="primary" className="btn-sm mx-2 " size="sm" >Accept</Button>
                                            <Button variant="danger" className="text-center mx-2 " size="sm">Reject</Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default DataWithdrawTable;