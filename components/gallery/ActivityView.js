import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { useTable } from "react-table";
import styles from "../../styles/modules/gallery/ActivityView.module.css";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import moment from "moment";
import { Tooltip } from "react-tippy";
import PuffLoader from "react-spinners/PuffLoader";
import randomColor from "randomcolor";

const Article = styled.section`
  padding: 60px 40px;
  color: #fff;
  .table-main-div {
    border: 10px solid #171717;
    p {
      margin: 0;
      font-family: "Sen", sans-serif;
      font-display: swap;
      font-weight: 400;
      font-style: normal;
      font-size: 24px;
      line-height: 100%;
      color: #fff;
      @media (max-width: 1000px) {
        font-size: 14px;
      }
    }
    .ActivityView_tablePriceETH__5wy96 img{
      width:20px;
    }
    .ActivityView_backgroundColor__1Cz_a{
      width:50px !important;
      height:35px !important;
    }
    .both-table-div {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      align-items: self-start;
      position: relative;
      :before {
        content: "";
        position: absolute;
        width: 5px;
        height: 100%;
        top: 0;
        right: 50%;
        bottom: 0;
        z-index: 999;
        background: #100f0f;
        @media (max-width: 1000px) {
          display: none;
        }
      }
      tbody tr td:last-of-type div p {
        font-size: 0.6rem !important;
      }
      table:nth-child(1) {
        border-right: 0;
      }
      @media (max-width: 1000px) {
        grid-template-columns: repeat(1, 1fr);
        gap: 0;
      }
    }
    table {
      width: 100%;
      border-spacing: 0;
      @media (max-width: 1000px) {
        display: block;
        overflow: auto;
      }
    }
    thead tr:nth-child(1) th {
      border-bottom: 0;
    }

    tbody tr:hover {
      background: #1b1b1b;
    }

    tr:nth-child(1) th {
      background: #1b1b1b;
      padding: 15px 30px 20px !important;
      text-align: start;
      @media (max-width: 1000px) {
        padding: 10px;
      }
    }
    tr:nth-child(2) th:nth-child(1) {
      width:6%;
    }
    tr:nth-child(2) th:nth-child(2) {
      width:20%;
    }
    tr:nth-child(2) th:nth-child(3) {
      width:10%;
    }
    tr:nth-child(2) th:nth-child(4) {
      width:10%;
    }
    tr:nth-child(2) th:nth-child(5) {
      width:7%;
    }
    tr:nth-child(2) th:nth-child(6) {
      width:12%;
    }
    tr:nth-child(2) th:nth-child(7) {
      width:16%;
    }
    tr:nth-child(2) th:nth-child(8) {
      width:26%;
    }
    tr:nth-child(2) th:nth-child(9) {
      width:3%;
    }
    th {
      padding-top:15px !important;
      padding-bottom:15px !important;
      text-align: left;
      font-family: Sen, sans-serif !important;
      font-display: swap;
      font-size: 1rem;
      line-height: 100%;
      color: #fff;
      margin: 0;
      font-weight: 400;
      min-width: 10%;
      width: 10%;
      text-transform: capitalize;
    }
    tr:first-of-type th {
      font-family: "Plaid" !important ;
      font-weight: 400;
    }
    th,
    td {
      margin: 0;
      border-bottom: 2px solid #100f0f;
      :last-child {
        border-right: 0;
        text-align: right;
      }
      @media (max-width: 1920px) {
        padding: 0px 5px;

      }
      @media (max-width: 1000px) {
        padding: 10px;
        font-size: 20px;
      }
    }
  }
  @media (max-width: 1000px) {
    padding: 50px calc(7.5% - 10px);
  }
`;

function Table({ columns, data }) {
  // Use the state and functions returned from useTable to build your UI
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data,
    });

  // Render the UI for your table
  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps()}>{column.render("Header")}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => {
                return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

const TableColor = ({ value }) => {
  return (
    <div className={styles.tableColorDiv}>
      <div style={{ background: value }} className={styles.backgroundColor} />
      <p>{value}</p>
    </div>
  );
};
const TableHex = ({ value }) => {
  return (
    <div className={styles.tableColorDiv}>
      <p>{value}</p>
    </div>
  );
};
const TableColorNotext = ({ value }) => {
  return (
    <div className={styles.tableColorDiv}>
      <div style={{ background: value }} className={styles.backgroundColor} />
    </div>
  );
};
const TableName = ({ value }) => {
  return (
    <div className={styles.tableNameDiv}>
      <p>{value}</p>
    </div>
  );
};
const TablePrice = ({ value }) => {
  return (
    <div className={styles.tablePriceDiv}>
      <p> {value.toFixed(2)}</p>
      <img src={"/images/icon/WETH.svg"} alt="Sold" />
    </div>
  );
};
const TablePriceETH = ({ value }) => {
  return (
    <div className={styles.tablePriceETH}>
      <img src={"/images/uparrow.png"} alt="Sold" />
      {/* <p> {value.toFixed(2)}</p> */}
      <p>+2.5%</p>
    </div>
  );
};
const TablePriceDoller = ({ value }) => {
  return (
    <div className={styles.tablePriceDiv}>
      <p> <span>$</span>{value.toFixed(2)}</p>
    </div>
  );
};
const TableDate = ({ value }) => {
  return (
    <div className={styles.tableDateDiv}>
      <p className={styles.dateFontSize}>{format(Date.parse(value), "MM.dd.yyyy HH:mm") + " GMT"}</p> 
      {/* <Tooltip
                title={
                    format(
                        new Date(value),
                        "MM.dd.yyyy HH:mm"
                    ) + " GMT"
                }
                position="top"
                trigger="mouseenter"
                arrow
                size={"big"}
                interactive={true}
            >
      <p>{moment(value).fromNow()}</p>
      {/* </Tooltip> */}
    </div>
  );
};

const token = "0xd9c022AEe4004C29720A87aB617D3670874c0fFb";

const TableBuyer = ({ value }) => {
  return (
    <div className={styles.tableBuyerDiv}>
      {/* <div className={styles.userAvtarBg}>
        <span>0x</span>
      </div> */}
      <p>
        {/* {token.substring(0, 6)}...
        {token.substring(token.length - 6)} */}
        morgan.eth
      </p>
    </div>
  );
};
const TableSeller = ({ value }) => {
  return (
    <div className={styles.tableBuyerDiv}>
      {/* <div className={styles.userAvtarBg}>
        <span>0x</span>
      </div> */}
      <p>
        {token.substring(0, 6)}...
        {token.substring(token.length - 6)}
      </p>
    </div>
  );
};
const TableLink = ({ value }) => {
  return (
    <div className={styles.tableLink}>
      <div className={styles.colorTx}>
        <img src={"/images/arrow.png"} alt="Sold" />
      </div>
    </div>
  );
};

const ActivityView = () => {
  const { allReceivedData } = useSelector((state) => state.data);
  const [amountShowed, setAmountShowed] = useState(3);

  const columns = useMemo(
    () => [
      {
        Header: "SALES",
        columns: [
          {
            Header: "Color",
            accessor: "hex",
            Cell: TableColor,
          },
          {
            Header: "Name",
            accessor: "name",
            Cell: TableName,
          },
          {
            Header: "Price",
            accessor: "price_in_eth",
            Cell: TablePrice,
          },
          {
            Header: "Buyer",
            accessor: "base_color_distance",
            Cell: TableBuyer,
          },
          {
            Header: "Seller",
            accessor: "uint256",
            Cell: TableSeller,
          },
          {
            Header: "Date",
            accessor: "created_at",
            Cell: TableDate,
          },
        ],
      },
    ],
    []
  );
  const columnsOld = useMemo(
    () => [
      {
        Header: "Recent Trades",
        columns: [
          {
            Header: "Color",
            accessor: "hex",
            Cell: TableColorNotext,
            columnld: 0,
          },
          {
            Header: "Name",
            accessor: "name",
            Cell: TableName,
            columnld: 1,
          },
          {
            Header: "Hexadecimal",
            // Cell: TableHex,
            Cell: (props) => (
              <>
                <p className="item title">{props.row.original.hex}</p>
              </>
            ),
            columnld: 2,
          },
          {
            Header: "Last Price",
            accessor: "price_in_eth",
            Cell: TablePriceDoller,
            columnld: 3,
          },
          {
            Header: "$ | ETH",
            accessor: "price_in_usd",
            Cell: TablePriceETH,
            columnld: 4,
          },
          {
            Header: "Buyer",
            accessor: "base_color_distance",
            Cell: TableBuyer,
            columnld: 5,
          },
          {
            Header: "Seller",
            // accessor: "uint256",
            Cell: TableSeller,
            columnld: 6,
          },
          {
            Header: "Date",
            accessor: "created_at",
            Cell: TableDate,
            columnld: 7,
          },
          {
            Header: "TX",
            accessor: "uint256",
            Cell: TableLink,
            columnld: 8,
          },
        ],
      },
    ],
    []
  );
  const columns2 = useMemo(
    () => [
      {
        Header: "BIDS",
        columns: [
          {
            Header: "Color",
            accessor: "hex",
            Cell: TableColor,
          },
          {
            Header: "Name",
            accessor: "name",
            Cell: TableName,
          },
          {
            Header: "Price",
            accessor: "price_in_eth",
            Cell: TablePrice,
          },
          {
            Header: "By",
            accessor: "base_color_distance",
            Cell: TableBuyer,
          },
          {
            Header: "Date",
            accessor: "created_at",
            Cell: TableDate,
          },
        ],
      },
    ],
    []
  );
  const columns3 = useMemo(
    () => [
      {
        Header: "ASKS",
        columns: [
          {
            Header: "Color",
            accessor: "hex",
            Cell: TableColor,
          },
          {
            Header: "Name",
            accessor: "name",
            Cell: TableName,
          },
          {
            Header: "Price",
            accessor: "price_in_eth",
            Cell: TablePrice,
          },
          {
            Header: "By",
            accessor: "base_color_distance",
            Cell: TableBuyer,
          },
          {
            Header: "Date",
            accessor: "created_at",
            Cell: TableDate,
          },
        ],
      },
    ],
    []
  );
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(5);
  const [amount, setAmount] = useState(10);
  const randomItems =
    allReceivedData && allReceivedData.slice(0, amount).reverse();
  const [isOnHover, setIsOnHover] = useState(false);
  useEffect(()=>{
    console.log("start_drawing table!",allReceivedData);
  },[]);
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isOnHover && amount < 100) {
        setAmount((amount += 1));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isOnHover]);

  // const getRandomItems = () => {
  //   let allItems = allReceivedData;
  //   if (!allItems) {
  //     setRandomItems([]);
  //     return;
  //   }
  //   const datarandomItems = allItems.splice(startIndex, endIndex);
  //   if (endIndex < allReceivedData.length - 5) {
  //     setStartIndex(startIndex + 5);
  //     setEndIndex(endIndex + 5);
  //   } else {
  //     setStartIndex(0);
  //     setEndIndex(5);
  //   }
  //   setRandomItems(datarandomItems);
  //   setLoader(false);
  // };

  // useEffect(() => {
  //   if (allReceivedData)
  //     setInterval(() => {
  //       console.log(allReceivedData);
  //       getRandomItems();
  //     }, 3000);
  // }, [allReceivedData]);

  return (
    allReceivedData && (
      <Article>
        <div className={styles.tableTopText}>
          <h2>ACTIVITY</h2>
          <h3>Realtime stream. No need to refresh.</h3>
        </div>
        <div className="table-main-div">
          <div
            className={styles.tableMainDiv}
            onMouseEnter={() => {
              console.log("first");
              setIsOnHover(true);
            }}
            onMouseLeave={() => setIsOnHover(false)}
          >
            {!randomItems ? (
              <div className={styles.tablePuffLoader}>
                <PuffLoader color={randomColor()} size={50} />
              </div>
            ) : (
              <Table columns={columnsOld} data={randomItems} />
            )}
            {/* <div className={styles.tableLoadMore}>LOAD MORE</div> */}
          </div>
          <div
            className={styles.tableMainDiv}
            onMouseEnter={() => {
              setIsOnHover(true);
            }}
            onMouseLeave={() => setIsOnHover(false)}
          >
            {!randomItems ? (
              <div className={styles.tablePuffLoader}>
                <PuffLoader color={randomColor()} size={50} />
              </div>
            ) : (
              <Table columns={columns} data={randomItems} />
            )}
            {/* <div className={styles.tableLoadMore}>LOAD MORE</div> */}
          </div>
          <div className="both-table-div">
            <div className={styles.tableMainDiv}>
              {!randomItems ? (
                <div className={styles.tablePuffLoader}>
                  <PuffLoader color={randomColor()} size={50} />
                </div>
              ) : (
                <Table columns={columns2} data={randomItems} />
              )}
              {/* <div className={styles.tableLoadMore}>LOAD MORE</div> */}
            </div>
            <div className={styles.tableMainDiv}>
              {!randomItems ? (
                <div className={styles.tablePuffLoader}>
                  <PuffLoader color={randomColor()} size={50} />
                </div>
              ) : (
                <Table columns={columns3} data={randomItems} />
              )}
              {/* <div className={styles.tableLoadMore}>LOAD MORE</div> */}
            </div>
          </div>
        </div>
      </Article>
    )
  );
};

export default ActivityView;
