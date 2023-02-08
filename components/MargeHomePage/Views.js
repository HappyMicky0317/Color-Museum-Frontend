import Link from "next/link";
import { useRouter } from "next/router";
import React, { createRef, useEffect, useState } from "react";
import stylesSecond from "../../styles/modules/margehomepage/views.module.css";
import DataTable from "react-data-table-component";
import { AiFillPlusCircle } from "react-icons/ai";
import randomColor from "randomcolor";
import Atropos from "atropos/react";
import "atropos/css";
import Image from "next/image";
import { useSelector } from "react-redux";
import {
  MINTED_SQUARE,
  PROVIDER,
  SMARTCONTRACTADDR,
} from "../../utils/constants";
import Toggle from "react-toggle";
import Web3 from "web3";
import { tokensOfOwnerABI } from "../../utils/tokensOfOwnerABI.js";

const Views = ({
  listView,
  baseColor,
  selectedColor,
  dataReceived,
  amountShowed,
}) => {
  let history = useRouter();
  const [displayCard, setDisplayCard] = useState(false);
  const [cardId, setCardId] = useState();

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
  const [showOnLeft, setShowOnLeft] = useState(false);
  const refOverflow = createRef();
  function handleShow() {
    if (refOverflow.current.clientWidth < refOverflow.current.scrollWidth) {
      setShowOnLeft(true);
    } else {
      setShowOnLeft(false);
    }
  }
  //
  //
  const { connectedAddress } = useSelector((state) => state.minting);
  const web3 = new Web3(new Web3.providers.HttpProvider(PROVIDER));
  const contract = new web3.eth.Contract([tokensOfOwnerABI], SMARTCONTRACTADDR);
  const [toggled, setToggled] = useState(true);
  const [showToggle, setShowToggle] = useState(false);
  const [nfts, setNfts] = useState();
  useEffect(() => {
    if (dataReceived && connectedAddress !== "") {
      let nfts;
      const handleNfts = async () => {
        nfts = await contract.methods.tokensOfOwner(connectedAddress).call();
        const filteredDataIsTrue = dataReceived.filter((item) => {
          return nfts.includes(item.uint256.toString());
        });
        setNfts(nfts);
        if (filteredDataIsTrue.length > 0) {
          setShowToggle(true);
        } else {
          setShowToggle(false);
        }
      };
      handleNfts();
    }
  }, [dataReceived, connectedAddress]);

  const opacityAmount = "0.15";
  const [selectCardIdOnHover, setSelectCardIdOnHover] = useState(null);
  const changeOpacityAmount = (cardId) => {
    if (cardId) {
      setSelectCardIdOnHover(cardId);
    } else {
      setSelectCardIdOnHover(null);
    }
  };

  return (
    <>
      {listView ? (
        baseColor ? (
          selectedColor.name !== "All" ? (
            // eslint-disable-next-line
            baseColor.map((item, index) => {
              let arr = [];
              // eslint-disable-next-line
              dataReceived.map((data) => {
                if (data.base_color_name === item) {
                  arr.push(data);
                }
              });
              const dataContent = [];
              // eslint-disable-next-line
              arr.map((i, index) => {
                dataContent.push({
                  id: index,
                  color: (
                    <Link href={`/gallery/${i.uint256}`} passHref>
                      <div
                        className={stylesSecond.square}
                        style={{
                          border: item === "black" && "1px solid #fff",
                          background: i.hex,
                        }}
                      />
                    </Link>
                  ),
                  name: i.name,
                  hexadecimal: (
                    <Link
                      href={`/gallery/${i.uint256}`}
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
                      <Link href={`/gallery/${i.uint256}`} passHref>
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
                });
              });
              if (item === selectedColor.name) {
                return (
                  <div className={stylesSecond.dataTableContainer} key={index}>
                    <div className={stylesSecond.layout}>
                      <h1>{item}</h1>
                      <h2>
                        {dataContent.length}{" "}
                        {dataContent.length > 1 ? "Shades" : "Shade"}
                      </h2>
                    </div>
                    <DataTable
                      columns={columns}
                      data={dataContent}
                      customStyles={customStyles}
                      pointerOnHover={true}
                      onRowClicked={(row) => {
                        history.push(`/gallery/${row.tokenID}`);
                      }}
                    />
                  </div>
                );
              }
            })
          ) : (
            baseColor.slice(0, amountShowed).map((item, index) => {
              let arr = [];
              // eslint-disable-next-line
              dataReceived.map((data) => {
                if (data.base_color_name === item) {
                  arr.push(data);
                }
              });
              const dataContent = [];
              // eslint-disable-next-line
              arr.map((i, index) => {
                dataContent.push({
                  id: index,
                  color: (
                    <Link href={`/gallery/${i.uint256}`} passHref>
                      <div
                        className={stylesSecond.square}
                        style={{
                          border: item === "black" && "1px solid #fff",
                          background: i.hex,
                        }}
                      />
                    </Link>
                  ),
                  name: i.name,
                  hexadecimal: (
                    <Link href={`/gallery/${i.uint256}`}>
                      <a
                        style={{
                          textTransform: "uppercase",
                          textDecoration: "none",
                          color: "#fff",
                        }}
                      >
                        {i.hex}
                      </a>
                    </Link>
                  ),
                  tokenID: i.uint256,
                  nftnumber: i.nftNo,
                  lastprice: (
                    <div className={stylesSecond.priceShowed}>
                      <Link href={`/gallery/${i.uint256}`} passHref>
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
                });
              });
              return (
                <div className={stylesSecond.dataTableContainer} key={index}>
                  <div className={stylesSecond.layout}>
                    <h1>{item}</h1>
                    <h2>
                      {dataContent.length}{" "}
                      {dataContent.length > 1 ? "Shades" : "Shade"}
                    </h2>
                  </div>
                  <DataTable
                    columns={columns}
                    data={dataContent}
                    customStyles={customStyles}
                    pointerOnHover={true}
                    onRowClicked={(row) => {
                      history.push(`/gallery/${row.tokenID}`);
                    }}
                  />
                </div>
              );
            })
          )
        ) : null
      ) : baseColor ? (
        selectedColor.name !== "All" ? (
          // eslint-disable-next-line
          baseColor.map((item, index) => {
            let arr = [];
            // eslint-disable-next-line
            dataReceived.map((data) => {
              if (data.base_color_name === item) {
                arr.push(data);
              }
            });
            let faucetArr = [];
            for (var i = 0; i < MINTED_SQUARE - arr.length; i++) {
              faucetArr.push(i);
            }
            if (item === selectedColor.name) {
              return (
                <div
                  className={stylesSecond.dataTableContainer}
                  key={index}
                  ref={refOverflow}
                >
                  <div className={stylesSecond.layout}>
                    <h1>{item}</h1>
                    <h2>
                      {arr.length} {arr.length > 1 ? "Shades" : "Shade"}
                    </h2>
                  </div>
                  <article className={stylesSecond.mainGrid}>
                    {arr.map((item, index) => {
                      if (
                        item.minting_address === connectedAddress &&
                        toggled
                      ) {
                        return (
                          <Link href={`/gallery/${item.uint256}`} key={index}>
                            <a
                              className={stylesSecond.gridItem}
                              style={{ background: item.hex }}
                              onMouseEnter={() => {
                                handleShow();
                                setDisplayCard(true);
                                setCardId(item.name + item.hex.slice(1));
                              }}
                              onMouseLeave={() => {
                                setDisplayCard(false);
                                setCardId("");
                              }}
                            >
                              <NFTCardContainerOnHover
                                id={item.uint256}
                                color={item.hex}
                                name={item.name}
                                number={item.nftNo}
                                displayCard={displayCard}
                                cardId={cardId}
                                handleShow={handleShow}
                                showOnLeft={showOnLeft}
                              />
                            </a>
                          </Link>
                        );
                      } else if (!toggled || !showToggle) {
                        return (
                          <Link href={`/gallery/${item.uint256}`} key={index}>
                            <a
                              className={stylesSecond.gridItem}
                              style={{ background: item.hex }}
                              onMouseEnter={() => {
                                handleShow();
                                setDisplayCard(true);
                                setCardId(item.name + item.hex.slice(1));
                              }}
                              onMouseLeave={() => {
                                setDisplayCard(false);
                                setCardId("");
                              }}
                            >
                              <NFTCardContainerOnHover
                                id={item.uint256}
                                color={item.hex}
                                name={item.name}
                                number={item.nftNo}
                                displayCard={displayCard}
                                cardId={cardId}
                                handleShow={handleShow}
                                showOnLeft={showOnLeft}
                              />
                            </a>
                          </Link>
                        );
                      } else {
                        return (
                          <Link href={`/gallery/${item.uint256}`} key={index}>
                            <a
                              className={stylesSecond.gridItem}
                              style={{
                                background: item.hex,
                                opacity:
                                  nfts.includes(item.uint256.toString()) ||
                                  selectCardIdOnHover == item.uint256
                                    ? "1"
                                    : opacityAmount,
                              }}
                              onMouseEnter={() => {
                                handleShow();
                                setDisplayCard(true);
                                setCardId(item.name + item.hex.slice(1));
                                changeOpacityAmount(item.uint256);
                              }}
                              onMouseLeave={() => {
                                setDisplayCard(false);
                                setCardId("");
                                changeOpacityAmount(null);
                              }}
                            >
                              <NFTCardContainerOnHover
                                id={item.uint256}
                                color={item.hex}
                                name={item.name}
                                number={item.nftNo}
                                displayCard={displayCard}
                                cardId={cardId}
                                handleShow={handleShow}
                                showOnLeft={showOnLeft}
                              />
                            </a>
                          </Link>
                        );
                      }
                    })}
                    {faucetArr.map((item) => {
                      return (
                        <div
                          className={stylesSecond.gridComplementItem}
                          key={item}
                        ></div>
                      );
                    })}
                  </article>
                </div>
              );
            }
          })
        ) : (
          <GridAllColors
            data={dataReceived}
            displayCard={displayCard}
            cardId={cardId}
            setDisplayCard={setDisplayCard}
            setCardId={setCardId}
            refOverflow={refOverflow}
            handleShow={handleShow}
            showOnLeft={showOnLeft}
            changeOpacityAmount={changeOpacityAmount}
            selectCardIdOnHover={selectCardIdOnHover}
            nfts={nfts}
            opacityAmount={opacityAmount}
            walletAddress={connectedAddress}
            toggled={toggled}
            showToggle={showToggle}
            setToggled={setToggled}
          />
        )
      ) : null}
    </>
  );
};

export default Views;

const GridAllColors = ({
  data,
  displayCard,
  cardId,
  setDisplayCard,
  setCardId,
  refOverflow,
  handleShow,
  showOnLeft,
  changeOpacityAmount,
  selectCardIdOnHover,
  opacityAmount,
  walletAddress,
  toggled,
  showToggle,
  setToggled,
  nfts,
}) => {
  let faucetArr = [];
  if (data.length < 10000) {
    for (var i = 0; i < MINTED_SQUARE - data.length; i++) {
      faucetArr.push(i);
    }
  }
  const [randomColorPicker, setRandomColorPicker] = useState("#ffffff");
  return (
    <div className={stylesSecond.dataTableContainer} ref={refOverflow}>
      {/* <div className={stylesSecond.layout}>
        <h1>
          <span className="plaidFont">{data.length}</span> Minted Colors{" "}
        </h1>
        {showToggle && (
          <div className="show-toggled">
            <label className="toggle-icon">
              <Toggle
                value={toggled}
                icons={false}
                onChange={() => {
                  setToggled(!toggled);
                }}
              />
            </label>
            <span className="toggled-name">My Palette</span>
          </div>
        )}
      </div> */}
      <article className={stylesSecond.mainGrid}>
        {data.map((item, index) => {
          if (index === data.length - 1) {
            if (item.minting_address === walletAddress && toggled) {
              return (
                <Link href={`/gallery/${item.uint256}`} key={index}>
                  <a
                    className={stylesSecond.gridItem}
                    style={{ background: item.hex }}
                    onMouseEnter={() => {
                      handleShow();
                      setDisplayCard(true);
                      setCardId(item.name + item.hex.slice(1));
                    }}
                    onMouseLeave={() => {
                      setDisplayCard(false);
                      setCardId("");
                    }}
                  >
                    <NFTCardContainerOnHover
                      id={item.uint256}
                      color={item.hex}
                      name={item.name}
                      number={item.nftNo}
                      displayCard={displayCard}
                      cardId={cardId}
                      handleShow={handleShow}
                      showOnLeft={showOnLeft}
                    />
                  </a>
                </Link>
              );
            } else if (!toggled || !showToggle) {
              return (
                <Link href={`/gallery/${item.uint256}`} key={index}>
                  <a
                    className={stylesSecond.gridItem}
                    style={{ background: item.hex }}
                    onMouseEnter={() => {
                      handleShow();
                      setDisplayCard(true);
                      setCardId(item.name + item.hex.slice(1));
                    }}
                    onMouseLeave={() => {
                      setDisplayCard(false);
                      setCardId("");
                    }}
                  >
                    <NFTCardContainerOnHover
                      id={item.uint256}
                      color={item.hex}
                      name={item.name}
                      number={item.nftNo}
                      displayCard={displayCard}
                      cardId={cardId}
                      handleShow={handleShow}
                      showOnLeft={showOnLeft}
                    />
                  </a>
                </Link>
              );
            } else {
              return (
                <Link href={`/gallery/${item.uint256}`} key={index}>
                  <a
                    className={stylesSecond.gridItem}
                    style={{
                      background: item.hex,
                      opacity:
                        nfts.includes(item.uint256.toString()) ||
                        selectCardIdOnHover == item.uint256
                          ? "1"
                          : opacityAmount,
                    }}
                    onMouseEnter={() => {
                      handleShow();
                      setDisplayCard(true);
                      setCardId(item.name + item.hex.slice(1));
                      changeOpacityAmount(item.uint256);
                    }}
                    onMouseLeave={() => {
                      setDisplayCard(false);
                      setCardId("");
                      changeOpacityAmount(null);
                    }}
                  >
                    <NFTCardContainerOnHover
                      id={item.uint256}
                      color={item.hex}
                      name={item.name}
                      number={item.nftNo}
                      displayCard={displayCard}
                      cardId={cardId}
                      handleShow={handleShow}
                      showOnLeft={showOnLeft}
                    />
                  </a>
                </Link>
              );
            }
          } else if (item.minting_address === walletAddress && toggled) {
            return (
              <Link href={`/gallery/${item.uint256}`} key={index}>
                <a
                  className={stylesSecond.gridItem}
                  style={{ background: item.hex }}
                  onMouseEnter={() => {
                    handleShow();
                    setDisplayCard(true);
                    setCardId(item.name + item.hex.slice(1));
                  }}
                  onMouseLeave={() => {
                    setDisplayCard(false);
                    setCardId("");
                  }}
                >
                  <NFTCardContainerOnHover
                    id={item.uint256}
                    color={item.hex}
                    name={item.name}
                    number={item.nftNo}
                    displayCard={displayCard}
                    cardId={cardId}
                    handleShow={handleShow}
                    showOnLeft={showOnLeft}
                  />
                </a>
              </Link>
            );
          } else if (!toggled || !showToggle) {
            return (
              <Link href={`/gallery/${item.uint256}`} key={index}>
                <a
                  className={stylesSecond.gridItem}
                  style={{ background: item.hex }}
                  onMouseEnter={() => {
                    handleShow();
                    setDisplayCard(true);
                    setCardId(item.name + item.hex.slice(1));
                  }}
                  onMouseLeave={() => {
                    setDisplayCard(false);
                    setCardId("");
                  }}
                >
                  <NFTCardContainerOnHover
                    id={item.uint256}
                    color={item.hex}
                    name={item.name}
                    number={item.nftNo}
                    displayCard={displayCard}
                    cardId={cardId}
                    handleShow={handleShow}
                    showOnLeft={showOnLeft}
                  />
                </a>
              </Link>
            );
          } else {
            return (
              <Link href={`/gallery/${item.uint256}`} key={index}>
                <a
                  className={stylesSecond.gridItem}
                  style={{
                    background: item.hex,
                    opacity:
                      nfts.includes(item.uint256.toString()) ||
                      selectCardIdOnHover == item.uint256
                        ? "1"
                        : opacityAmount,
                  }}
                  onMouseEnter={() => {
                    handleShow();
                    setDisplayCard(true);
                    setCardId(item.name + item.hex.slice(1));
                    changeOpacityAmount(item.uint256);
                  }}
                  onMouseLeave={() => {
                    setDisplayCard(false);
                    setCardId("");
                    changeOpacityAmount(null);
                  }}
                >
                  <NFTCardContainerOnHover
                    id={item.uint256}
                    color={item.hex}
                    name={item.name}
                    number={item.nftNo}
                    displayCard={displayCard}
                    cardId={cardId}
                    handleShow={handleShow}
                    showOnLeft={showOnLeft}
                  />
                </a>
              </Link>
            );
          }
        })}
        {faucetArr.map((item, index) => {
          return (
            <Link href="/choose" key={index}>
              <a className={stylesSecond.gridComplementItem}>
                <div
                  key={item}
                  onMouseEnter={() => {
                    setRandomColorPicker(randomColor());
                  }}
                >
                  <AiFillPlusCircle style={{ color: randomColorPicker }} />
                </div>
              </a>
            </Link>
          );
        })}
      </article>
    </div>
  );
};

const NFTCardContainerOnHover = ({
  id,
  name,
  color,
  number,
  displayCard,
  cardId,
  handleShow,
  showOnLeft,
}) => {
  const [fontSizeAmount, setFontSizeAmount] = useState("25");
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => {
      let widthDimension = window.innerWidth;
      setWidth(widthDimension);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  useEffect(() => {
    if (name) {
      if (name.length < 10) {
        setFontSizeAmount(`${width < 350 ? "17.6" : "20"}`);
      } else if (name.length > 9 && name.length < 15) {
        setFontSizeAmount(`${width < 350 ? "16" : "17"}`);
      } else {
        setFontSizeAmount(`${width < 350 ? "12.8" : "12"}`);
      }
    }
    // eslint-disable-next-line
  }, [name]);
  //
  //
  useEffect(() => {
    handleShow();
  }, [cardId]);
  const { whiteBorders } = useSelector((state) => state.minting);
  return (
    <Link href={`/gallery/${id}`} passHref>
      <Atropos
        activeOffset={40}
        shadow={false}
        className={`${showOnLeft ? "left_position" : "right_position"}`}
      >
        <div
          className="recentlyContainer"
          style={{
            borderColor: `${whiteBorders.includes(color) ? "#1c1c1c" : color}`,
            textDecoration: "none",
            display:
              displayCard && cardId === name + color.slice(1)
                ? "block"
                : "none",
            background: "#000",
          }}
        >
          <div className="containerContent">
            <div
              className="recentlyHeader"
              style={{
                borderBottom: `${
                  whiteBorders.includes(color) ? "3px solid #1c1c1e" : "none"
                }`,
              }}
            >
              <div className="flex_cardContainer">
                <div className="logo_cardImage">
                  <Image
                    src={"/images/logo.png"}
                    alt="logo NFTs"
                    data-atropos-offset="5"
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
              </div>
              <div className="address" data-atropos-offset="5">
                {number}
              </div>
            </div>
            <div
              className="backgroundContainer"
              style={{ background: `${color}` }}
            ></div>
            <div
              className="recentlyHeader"
              style={{
                borderTop: `${
                  whiteBorders.includes(color) ? "3px solid #1c1c1e" : "none"
                }`,
                marginTop: "3px",
              }}
            >
              <div
                className="recentlyP"
                style={{
                  fontSize: `${fontSizeAmount}px`,
                }}
              >
                {name}
              </div>
              <div
                className="recentlyP margin_right"
                style={{
                  textTransform: "uppercase",
                  fontSize: `${fontSizeAmount}px`,
                  color: "#fff",
                }}
              >
                {color}
              </div>
            </div>
          </div>
        </div>
      </Atropos>
    </Link>
  );
};
