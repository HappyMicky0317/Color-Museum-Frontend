import Link from "next/link";
import { useRouter } from "next/router";
import React, { createRef, useEffect, useState } from "react";
import stylesSecond from "../../styles/modules/gallery/view.module.css";
import styles from "../../styles/modules/uiconcept/uiconcept.module.css";
import DataTable from "react-data-table-component";


const UiConceptListViews = ({
    dataReceived,
    amountShowedList
}) => {
    let history = useRouter();

    const [finalTableDate, setFinalTableDate] = useState()

    useEffect(() => {
        if (dataReceived) {
            const dataContent = [];
            dataReceived.slice(0, amountShowedList).map((i, index) => {
                const object = {
                    id: index,
                    color: (
                        <Link href={`/gallery/color-nft/${i.uint256}`} passHref>
                            <div
                                className={stylesSecond.square}
                                style={{
                                    border: i === "black" && "1px solid #fff",
                                    background: i.hex,
                                }}
                            />
                        </Link>
                    ),
                    name: i.name,
                    hexadecimal: (
                        <Link
                            href={`/gallery/color-nft/${i.uint256}`}
                            style={{
                                textTransform: "uppercase",
                                textDecoration: "none",
                                color: "#fff",
                            }}
                        >
                            {i.hex}
                        </Link>
                    ),
                    tokenID: i.uint256,
                    nftnumber: i.nftNo,
                    lastprice: (
                        <div className={stylesSecond.priceShowed}>
                            <Link href={`/gallery/color-nft/${i.uint256}`} passHref>
                                <div>
                                    <span>
                                        {i.price_in_eth ? i.price_in_eth.toFixed(3) : null}{" "}
                                        ETH{" "}
                                    </span>
                                    &nbsp; {i?.price_in_usd && "$"}{" "}
                                    {i?.price_in_usd?.toFixed(2)}
                                </div>
                            </Link>
                        </div>
                    ),
                }
                dataContent.push(object);
            });
            setFinalTableDate(dataContent)
        }
    }, [amountShowedList])


    const columns = [
        {
            name: "Color",
            selector: (row) => row.color,
        },
        {
            name: "Name",
            selector: (row) => row.name,
        },
        {
            name: "Hexadecimal",
            selector: (row) => row.hexadecimal,
            className: "testing",
        },
        {
            name: "TokenID",
            selector: (row) => row.tokenID,
        },
        {
            name: "NFT No.",
            selector: (row) => row.nftnumber,
        },
        {
            name: "Mint Price",
            selector: (row) => row.lastprice,
        },
    ];

    const customStyles = {
        rows: {
            style: {
                minHeight: "55px", // override the row height
                background: "#000",
                color: "#fff",
                borderBottom: "2px solid #1B1B1D",
                borderTop: "2px solid #1B1B1D",
                fontSize: "1.7rem",
                display: "grid",
                gridTemplateColumns: ".6fr 1.75fr repeat(2, 1fr) .75fr 1.4fr",
                gridTemplateRows: "1fr",
                transition: "all 0.3s else",
                "&:hover": {
                    background: "#100F0F",
                },
            },
        },
        headCells: {
            style: {
                paddingLeft: "8px", // override the cell padding for head cells
                paddingRight: "8px",
                background: "#100F0F",
                border: "none",
                color: "#fff",
                fontSize: "1.309rem",
            },
        },
        cells: {
            style: {
                paddingLeft: "8px", // override the cell padding for data cells
                paddingRight: "8px",
                border: "none",
            },
        },
        headRow: {
            style: {
                border: "none",
                minHeight: "52.5px",
                display: "grid",
                gridTemplateColumns: ".6fr 1.75fr repeat(2, 1fr) .75fr 1.4fr",
                gridTemplateRows: "1fr",
            },
        },
    };

    console.log(finalTableDate)

    return (
        <>

            <div className={styles.dataTableListContainer}>
                <DataTable
                    columns={columns}
                    data={finalTableDate && finalTableDate}
                    customStyles={customStyles}
                    pointerOnHover={true}
                    onRowClicked={(row) => {
                        history.push(`/gallery/${row.tokenID}`);
                    }}
                />
            </div>
        </>
    );
};

export default UiConceptListViews;
