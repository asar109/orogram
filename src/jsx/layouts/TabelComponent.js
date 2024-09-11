import React, { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import { Card, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import moment from "moment";
const TabelComponent = ({
  cols,
  data,
  tabeltitle,
  itemsPerPage,
  minHeight,
  searchKey,
  searchKey2,
  searchPlaceholder = "Search",
  subTitle = null
}) => {
  console.log("tabel list data==", data);
  const [alldata, setalldata] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const coinDataOld = useSelector((store) => store.coinReducer.coinDataOld);
  const [currentItems, setCurrentItems] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const [olditems, setolditems] = useState();
  const [sort, setSort] = useState("desc");
  const [sortField, setSortField] = useState();
  const [title, setTitle] = useState('');
  var endOffset = itemOffset + itemsPerPage;
  const dispatch = useDispatch();

  useEffect(() => {

    console.log(`Loading items from ======${itemOffset} to ${endOffset}`);
    setCurrentItems(alldata?.slice(itemOffset, endOffset));
    // if (sortField) {
    //   setCurrentItems(alldata?.slice(itemOffset, endOffset));
    // } else {
    //   setCurrentItems(data?.slice(itemOffset, endOffset));
    // }
    setPageCount(Math.ceil(alldata?.length / itemsPerPage));
    if (!sortField) handlePageClick();

  }, [alldata]);

  useEffect(() => {

    setalldata(data);


  }, [data]);

  useEffect(() => {

    console.log(`Loading items from ======${itemOffset} to ${endOffset}`);
    if (alldata?.length > 0) {
      setCurrentItems(alldata?.slice(itemOffset, endOffset));
      setPageCount(Math.ceil(alldata?.length / itemsPerPage));
    } else {
      // setCurrentItems(data?.slice(itemOffset, endOffset));
      // setPageCount(Math.ceil(data?.length / itemsPerPage));
    }
  }, [itemOffset]);




  const handlePageClick = (event) => {
    const page = event?.selected || 0;
    setCurrentPage(page);
    const newOffset2 = (page * itemsPerPage) % alldata?.length;
    console.log(
      `User requested page number ${page}, which is offset ${newOffset2}`
    );
    setItemOffset(newOffset2);
  };
  // create a funtion recieve the string in % and return the positive value or negative value
  const returnPositiveValue = (value) => {
    console.log(value, "value");
  };

  //create an function
  const returnColor = (item) => {
    let color = "";

    const localCoinData = JSON.parse(localStorage.getItem("coinDataOld"));
    if (coinDataOld?.length > 0) {
      coinDataOld.map((coin) => {
        if (coin.name === item.name) {
          if (coin.price > item.price) {
            color = "red";
          } else if (coin.price < item.price) {
            color = "green";
          } else {
            color = "black";
          }
        }
      });
    } else if (localCoinData) {
      localCoinData.map((coin) => {
        if (coin.name === item.name) {
          if (coin.price > item.price) {
            color = "red";
          } else if (coin.price < item.price) {
            color = "green";
          } else {
            color = "black";
          }
        }
      });
    }

    return color;
  };
  console.log("new look", itemOffset, endOffset);
  // create a function recived data , columns , column name , sort type and return the sorted data
  const sortData = (dataRef, columnName, sortType) => {
    let title = columnName.title;
    columnName = columnName.sortId;
    if (columnName) {
      let sortedData = [];
      if (columnName.includes("date") || columnName.includes("Date")) {
        if (sortType === "asc") {
          sortedData = dataRef.sort((a, b) => {
            if (
              moment(a[columnName]).format() < moment(b[columnName]).format()
            ) {
              return -1;
            }
            if (
              moment().format(a[columnName]) > moment(b[columnName]).format()
            ) {
              return 1;
            }
            return 0;
          });
        } else {
          sortedData = dataRef.sort((a, b) => {
            if (
              moment(a[columnName]).format() > moment(b[columnName]).format()
            ) {
              return -1;
            }
            if (
              moment(a[columnName]).format() < moment(b[columnName]).format()
            ) {
              return 1;
            }
            return 0;
          });
        }
      }
      //
      else {
        if (sortType === "asc") {
          sortedData = dataRef.slice().sort((a, b) => {
            // check if the value is number or string
            if (typeof a[columnName] === "string" && typeof b[columnName] === "string" && a[columnName] !== null && b[columnName] !== null) {
              if (a[columnName].toLowerCase() < b[columnName].toLowerCase()) {
                return -1;
              }
              if (a[columnName].toLowerCase() > b[columnName].toLowerCase()) {
                return 1;
              }
              return 0;
            }
            else if (typeof a[columnName] === "number" && typeof b[columnName] === "number" || a[columnName] === null || b[columnName] === null) {

              if (a[columnName] < b[columnName]) {
                return -1;
              }
              if (a[columnName] > b[columnName]) {
                return 1;
              }
              return 0;
            }
          }
          );
        } else {
          sortedData = dataRef.slice().sort((a, b) => {
            // check if the value is number or string
            if (typeof a[columnName] === "string" && typeof b[columnName] === "string" && a[columnName] !== null && b[columnName] !== null) {
              if (a[columnName].toLowerCase() > b[columnName].toLowerCase()) {
                return -1;
              }
              if (a[columnName].toLowerCase() < b[columnName].toLowerCase()) {
                return 1;
              }
              return 0;
            }
            else if (typeof a[columnName] === "number" && typeof b[columnName] === "number" || a[columnName] === null || b[columnName] === null) {

              if (a[columnName] > b[columnName]) {
                return -1;
              }
              if (a[columnName] < b[columnName]) {
                return 1;
              }
              return 0;
            }
          }
          );
        }
      }
      console.log(sortedData, "sortedData");
      if (sortType === "asc") {
        setSort("desc");
        setSortField(columnName);
        setTitle(title);
      } else {
        setSort("asc");
        setSortField(columnName);
        setTitle(title);
      }
      endOffset = itemsPerPage;
      console.log("new look", itemOffset, endOffset);
      setalldata(sortedData);
    } else {
      setalldata(data);

    }
  };
  const handleChange = (e) => {

    setSortField('');
    setTitle('');
    let value = e.target.value.toLowerCase();
    if (!!value.trim()) {
      let result = [];
      result = data.filter((data) => {
        if (!!searchKey2) {
          return data[searchKey].toLowerCase().search(value) !== -1 || data[searchKey2].toLowerCase().search(value) !== -1;

        }
        else {
          return data[searchKey].toLowerCase().search(value) !== -1;
        }
      });
      setalldata(result);
    } else {
      setalldata(data);
    }

  }
  return (
    <>
      <Card>
        <Card.Header>
          <Card.Title>
            {tabeltitle}
            {subTitle &&
              <p style={{fontSize:"14px",textTransform: "none"}}>{subTitle}</p>

            }
          </Card.Title>
          {searchKey && <> <div class="form-group has-search">

            <input type="text" class="form-control" placeholder={searchPlaceholder} onChange={handleChange} />
          </div> </>}
        </Card.Header>
        <Card.Body>
          <div
            id="job_data"
            className="dataTables_wrapper"
            style={{ minHeight: minHeight ? minHeight : "" }}
          >
            <Table responsive className="table dataTable  shadow-hover display">
              <thead>
                <tr>
                  {cols.map((headerItem, index) => {
                    if (
                      headerItem?.title === "Markets" ||
                      headerItem?.title === "Available Assets" ||
                      headerItem?.title === "Assets"
                    ) {
                      return (
                        <th key={index} style={{ textAlign: "left", }} >
                          {headerItem.title}
                          {sort === "asc" && headerItem?.sortId ? (
                            <i
                              onClick={() => {
                                sortData(alldata, headerItem, sort);
                              }}
                              class="fa-solid fa-sort"
                              style={{ cursor: "pointer", color: title === headerItem?.title ? "#3eacff" : "black", marginLeft: "5px" }}
                            ></i>
                          ) : sort === "desc" && headerItem?.sortId ? (
                            <i
                              onClick={() => {
                                sortData(alldata, headerItem, sort);
                              }}
                              class="fa-solid fa-sort"
                              style={{ cursor: "pointer", color: title === headerItem?.title ? "#3eacff" : "black", marginLeft: "5px" }}
                            ></i>
                          ) : (
                            ""
                          )}
                        </th>
                      );
                    } else if (typeof headerItem?.title !== "string") {
                      {
                        return (
                          <th
                            key={index}
                            style={{
                              textAlign: "center",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            {headerItem.title}
                            {sort === "asc" && headerItem?.sortId ? (
                              <i
                                onClick={() => {
                                  sortData(alldata, headerItem, sort);
                                }}
                                class="fa-solid fa-sort"
                                style={{ cursor: "pointer", color: title === headerItem?.title ? "#3eacff" : "black", marginTop: "9px" }}
                              ></i>
                            ) : sort === "desc" && headerItem?.sortId ? (
                              <i
                                onClick={() => {
                                  sortData(alldata, headerItem, sort);
                                }}
                                class="fa-solid fa-sort"
                                style={{ cursor: "pointer", color: title === headerItem?.title ? "#3eacff" : "black", marginTop: "9px" }}
                              ></i>
                            ) : (
                              ""
                            )}
                          </th>
                        );
                      }
                    } else {
                      return (
                        <th key={index} style={{ textAlign: "center" }}>
                          {headerItem.title}
                          {sort === "asc" && headerItem?.sortId ? (
                            <i
                              onClick={() => {
                                sortData(
                                  alldata,

                                  headerItem,
                                  sort
                                );
                              }}
                              class="fa-solid fa-sort"
                              style={{ cursor: "pointer", color: title === headerItem?.title ? "#3eacff" : "black", marginLeft: "5px" }}
                            ></i>
                          ) : sort === "desc" && headerItem?.sortId ? (
                            <i
                              onClick={() => {
                                sortData(
                                  alldata,

                                  headerItem,
                                  sort
                                );
                              }}
                              class="fa-solid fa-sort"
                              style={{ cursor: "pointer", color: title === headerItem?.title ? "#3eacff" : "black", marginLeft: "5px" }}
                            ></i>
                          ) : (
                            ""
                          )}
                        </th>
                      );
                    }
                  })}
                </tr>
              </thead>
              <tbody className="clr">
                {currentItems &&
                  currentItems?.map((item, index) => (
                    <tr key={index}>
                      {cols.map((col, key) => {
                        if (
                          col?.title === "Markets" ||
                          col?.title === "Available Assets" ||
                          col?.title === "Assets"
                        ) {
                          return <td key={key}>{col?.render(item)}</td>;
                        } else if (col?.title === "Price") {
                          return (
                            <td
                              key={key}
                              className=" text-center"
                              style={{ color: returnColor(item) }}
                            >
                              {returnColor(item) === "red" ? (
                                <i className="fa-solid fa-arrow-down"></i>
                              ) : returnColor(item) === "green" ? (
                                <i className="fa-solid fa-arrow-up me-2 "></i>
                              ) : (
                                ""
                              )}{" "}
                              <span style={{ color: returnColor(item) }}>
                                {col?.render(item)}
                              </span>
                            </td>
                          );
                        } else {
                          return (
                            <td key={key} className="text-center ">
                              {col?.render(item)}
                            </td>
                          );
                        }
                      })}
                    </tr>
                  ))}
              </tbody>
            </Table>
          </div>
          <div className="d-sm-flex text-center justify-content-between align-items-center mt-4">
            <div className="dataTables_info">
              {data?.length > 0 && (
                <span>
                  Showing {itemOffset + 1} to
                  <span className="mx-1">
                    {data?.length < itemsPerPage
                      ? currentItems?.length
                      : endOffset > data?.length
                        ? data?.length
                        : endOffset}
                  </span>
                  of {data?.length} entries
                </span>
              )}
            </div>
            <ReactPaginate
              nextLabel=">"
              onPageChange={handlePageClick}
              forcePage={currentPage}
              pageRangeDisplayed={3}
              marginPagesDisplayed={2}
              pageCount={pageCount}
              previousLabel="<"
              pageClassName="page-item"
              pageLinkClassName="page-link"
              previousClassName="page-item"
              previousLinkClassName="page-link"
              nextClassName="page-item"
              nextLinkClassName="page-link"
              breakLabel="..."
              breakClassName="page-item"
              breakLinkClassName="page-link"
              containerClassName="pagination"
              activeClassName="active"
              renderOnZeroPageCount={null}
            />
          </div>
          <ToastContainer />
        </Card.Body>
      </Card>
    </>
  );
};

export default TabelComponent;
