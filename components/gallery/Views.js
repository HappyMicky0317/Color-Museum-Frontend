import Link from "next/link";
import { useRouter } from "next/router";
import React, { createRef, useEffect, useRef, useState } from "react";
import stylesSecond from "../../styles/modules/gallery/view.module.css";
import styles from "../../styles/modules/gallery/sort.module.css";
import DataTable from "react-data-table-component";
import Atropos from "atropos/react";
import { GoPlus } from "react-icons/go";
import { FcMinus } from "react-icons/fc";
import "atropos/css";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import stylesFilter from "../../styles/modules/gallery/filter.module.css";
import { FiMinus } from "react-icons/fi";
import { BsPlusLg } from "react-icons/bs";
import { IoCloseSharp } from "react-icons/io5";
import {
  COLLECTORS,
  MINTED_SQUARE,
  PROVIDER,
  SMARTCONTRACTADDR,
} from "../../utils/constants";
import Web3 from "web3";
import { tokensOfOwnerABI } from "../../utils/tokensOfOwnerABI.js";
import hexRgb from "hex-rgb";
import { ReceivedData } from "../../store/actions/data";
import { isMobile } from "react-device-detect";
import Toggle from "react-toggle";
import toast from "react-hot-toast";
import { Switch, SwitchThumb } from "./StyledSwitch";

const Views = ({
  listView,
  baseColor,
  amountShowed,
  amountShowedGrid,
  search,
  filtered,
  selectedBaseColors,
  value,
  selectedOption,
  setToggled,
  toggled,
  setSelectedBaseColors,
  setFiltered,
  setSelectedOption,
}) => {
  let history = useRouter();
  const [displayCard, setDisplayCard] = useState(false);
  const [cardId, setCardId] = useState();
  const { allReceivedData } = useSelector((state) => state.data);

  const dispatch = useDispatch();

  useEffect(() => {
    if (selectedOption === "Increasing") {
      const sorted =
        allReceivedData &&
        allReceivedData.sort(function (a, b) {
          if (a.nftNo > b.nftNo) {
            return 1;
          }
          if (a.nftNo < b.nftNo) {
            return -1;
          }
          // a must be equal to b
          return 0;
        });
      dispatch(ReceivedData(sorted));
    } else if (selectedOption === "Decreasing") {
      const sorted =
        allReceivedData &&
        allReceivedData.sort(function (a, b) {
          if (a.nftNo < b.nftNo) {
            return 1;
          }
          if (a.nftNo > b.nftNo) {
            return -1;
          }
          // a must be equal to b
          return 0;
        });
      dispatch(ReceivedData(sorted));
    } else if (selectedOption === "Random") {
      const sorted =
        allReceivedData && allReceivedData.sort(() => Math.random() - 0.5);
      dispatch(ReceivedData(sorted));
    }
  }, [selectedOption]);

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
    if (refOverflow.current?.clientWidth < refOverflow.current?.scrollWidth) {
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
  const [showToggle, setShowToggle] = useState(false);
  const [nfts, setNfts] = useState();
  useEffect(() => {
    console.log("view_nfts",  listView,
    baseColor,
    amountShowed,
    amountShowedGrid,
    search,
    filtered,
    selectedBaseColors,
    value,
    selectedOption,
    setToggled,
    toggled,allReceivedData,'haha',connectedAddress);
    if (allReceivedData && connectedAddress !== "") {
      console.log("connect address");
      let nfts;
      const handleNfts = async () => {
        nfts = await contract.methods.tokensOfOwner(connectedAddress).call();

        const filteredDataIsTrue = allReceivedData.filter((item) => {
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
  }, [allReceivedData, connectedAddress]);

  const opacityAmount = "0.15";
  const [selectCardIdOnHover, setSelectCardIdOnHover] = useState(null);
  const changeOpacityAmount = (cardId) => {
    if (cardId) {
      setSelectCardIdOnHover(cardId);
    } else {
      setSelectCardIdOnHover(null);
    }
  };

  const [openedFilter, setOpenedFilter] = useState({
    view: false,
    status: false,
    group: false,
    price: false,
  });
  return (
    <div className={styles.wrapperContainer}>
      <div className={styles.stickyFilter}>
        <div className={styles.containerContent}>
          <div className={styles.flexContent}>
            <h3>My Palette</h3>
            <Switch
              defaultChecked
              checked={toggled}
              onCheckedChange={() => {
                if (connectedAddress === "") {
                  toast((t) => (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "15px",
                      }}
                    >
                      Connect Your Wallet
                      <IoCloseSharp
                        size={20}
                        onClick={() => {
                          toast.dismiss(t.id);
                        }}
                      />
                    </div>
                  ));
                } else if (!showToggle) {
                  toast((t) => (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "15px",
                      }}
                    >
                      You do not own any colors.
                      <IoCloseSharp
                        size={25}
                        onClick={() => {
                          toast.dismiss(t.id);
                        }}
                      />
                    </div>
                  ));
                } else {
                  setToggled(!toggled);
                }
              }}
              id="s1"
            >
              <SwitchThumb />
            </Switch>
          </div>
        </div>
        <div className={styles.containerContent}>
          <div className={styles.flexContent}>
            <h3>View</h3>
            {openedFilter.view ? (
              <FiMinus
                onClick={() =>
                  setOpenedFilter({
                    view: false,
                    status: openedFilter.status,
                    group: openedFilter.group,
                    price: openedFilter.price,
                  })
                }
              />
            ) : (
              <BsPlusLg
                onClick={() =>
                  setOpenedFilter({
                    view: true,
                    status: openedFilter.status,
                    group: openedFilter.group,
                    price: openedFilter.price,
                  })
                }
              />
            )}
          </div>
          <div
            className={styles.gridContent}
            style={{ display: openedFilter.view ? "block" : "none" }}
          >
            <h4>Grid</h4>
            <h4>List</h4>
            <h4>Card</h4>
          </div>
        </div>
        <div className={styles.containerContent}>
          <div className={styles.flexContent}>
            <h3>Status</h3>
            {openedFilter.status ? (
              <FiMinus
                onClick={() =>
                  setOpenedFilter({
                    view: openedFilter.view,
                    status: false,
                    group: openedFilter.group,
                    price: openedFilter.price,
                  })
                }
              />
            ) : (
              <BsPlusLg
                onClick={() =>
                  setOpenedFilter({
                    view: openedFilter.view,
                    status: true,
                    group: openedFilter.group,
                    price: openedFilter.price,
                  })
                }
              />
            )}
          </div>
          <div
            className={styles.gridContent}
            style={{ display: openedFilter.status ? "block" : "none" }}
          >
            <h4>For Sale</h4>
          </div>
        </div>
        <div className={styles.containerContent}>
          <div className={styles.flexContent}>
            <h3>Color Group</h3>
            {openedFilter.group ? (
              <FiMinus
                onClick={() =>
                  setOpenedFilter({
                    view: openedFilter.view,
                    status: openedFilter.status,
                    group: false,
                    price: openedFilter.price,
                  })
                }
              />
            ) : (
              <BsPlusLg
                onClick={() =>
                  setOpenedFilter({
                    view: openedFilter.view,
                    status: openedFilter.status,
                    group: true,
                    price: openedFilter.price,
                  })
                }
              />
            )}
          </div>
          <div
            className={styles.gridContent}
            style={{ display: openedFilter.group ? "block" : "none" }}
          >
            {baseColor &&
              baseColor.map((item, index) => {
                let amountOfColors = 0;
                allReceivedData.map((i) => {
                  if (item === i.base_color_name) {
                    amountOfColors = amountOfColors += 1;
                  }
                });
                return (
                  <h4
                    key={index}
                    onClick={() => {
                      if (selectedBaseColors.includes(item)) {
                        setSelectedBaseColors((color) =>
                          color.filter((i) => i !== item)
                        );
                      } else {
                        setSelectedBaseColors((prevState) => [
                          ...prevState,
                          item,
                        ]);
                      }
                      setFiltered(true);
                    }}
                    style={{
                      background: selectedBaseColors.includes(item)
                        ? "#fff"
                        : "#100f0f",
                    }}
                    onMouseOver={(e) => {
                      if (item === "black") {
                        e.target.style.color = "#fff";
                      }
                      e.target.style.background = item;
                    }}
                    onMouseOut={(e) => (e.target.style.background = "#100f0f")}
                  >
                    {item}
                  </h4>
                );
              })}
          </div>
        </div>
        <div className={styles.containerContent}>
          <div className={styles.flexContent}>
            <h3>Mint Price</h3>
            {openedFilter.price ? (
              <FiMinus
                onClick={() =>
                  setOpenedFilter({
                    view: openedFilter.view,
                    status: openedFilter.status,
                    group: openedFilter.group,
                    price: false,
                  })
                }
              />
            ) : (
              <BsPlusLg
                onClick={() =>
                  setOpenedFilter({
                    view: openedFilter.view,
                    status: openedFilter.status,
                    group: openedFilter.group,
                    price: true,
                  })
                }
              />
            )}
          </div>
          <div
            className={styles.gridContent}
            style={{ display: openedFilter.price ? "block" : "none" }}
          >
            <h4 onClick={() => setSelectedOption("Increasing")}>Increasing</h4>
            <h4 onClick={() => setSelectedOption("Decreasing")}>Decreasing</h4>
            <h4 onClick={() => setSelectedOption("Random")}>Random</h4>
          </div>
        </div>
      </div>
      {listView ? (
        baseColor ? (
          selectedBaseColors.length > 0 ? (
            baseColor.map((item, index) => {
              if (selectedBaseColors.includes(item)) {
                let arr = [];
                // eslint-disable-next-line
                allReceivedData.map((data) => {
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
                      <Link href={`/gallery/color-nft/${i.uint256}`} passHref>
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
                              {i.price_in_eth
                                ? i.price_in_eth.toFixed(3)
                                : null}{" "}
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
                        history.push(`/gallery/color-nft/${row.tokenID}`);
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
              allReceivedData.map((data) => {
                if (data.base_color_name === item) {
                  arr.push(data);
                }
              });
              const dataContent = [];
              // eslint-disable-next-line
              arr.map((i, index) => {
                if (
                  (search !== "" &&
                    i.hex.toLowerCase().startsWith(search.toLowerCase())) ||
                  i.name.toLowerCase().startsWith(search.toLowerCase()) ||
                  i.nftNo.toString().startsWith(search) ||
                  i.base_color_name
                    .toLowerCase()
                    .startsWith(search.toLowerCase()) ||
                  i.uint256.toString().startsWith(search)
                ) {
                  dataContent.push({
                    id: index,
                    color: (
                      <Link href={`/gallery/color-nft/${i.uint256}`} passHref>
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
                      <Link href={`/gallery/color-nft/${i.uint256}`}>
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
                        <Link href={`/gallery/color-nft/${i.uint256}`} passHref>
                          <div>
                            <span>
                              {i.price_in_eth
                                ? i.price_in_eth.toFixed(3)
                                : null}{" "}
                              ETH{" "}
                            </span>
                            &nbsp; {i?.price_in_usd && "$"}{" "}
                            {i?.price_in_usd?.toFixed(2)}
                          </div>
                        </Link>
                      </div>
                    ),
                  });
                }
              });
              return (
                <div className={stylesSecond.dataTableContainer} key={index}>
                  {dataContent.length > 0 && (
                    <>
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
                          history.push(`/gallery/color-nft/${row.tokenID}`);
                        }}
                      />
                    </>
                  )}
                </div>
              );
            })
          )
        ) : null
      ) : baseColor ? (
        filtered ? (
          selectedBaseColors.length > 0 ? (
            <div className={styles.filteredMore}>
              {" "}
              {selectedBaseColors.map((item, index) => {
                let arr = [];
                // eslint-disable-next-line
                allReceivedData.map((data) => {
                  if (data.base_color_name === item) {
                    arr.push(data);
                  }
                });
                let containsColor = [];
                arr.map((item) => {
                  if (
                    item.price_in_usd >= Number(value.min) &&
                    item.price_in_usd <= Number(value.max)
                  ) {
                    containsColor.push(item);
                  }
                });
                if (containsColor.length > 0) {
                  return (
                    <div
                      className={stylesSecond.dataTableContainer}
                      key={index}
                      ref={refOverflow}
                      style={{ width: "100%" }}
                    >
                      <div className={stylesSecond.layout}>
                        <h1>{item}</h1>
                        <h2>
                          {containsColor.length}&nbsp;
                          {containsColor.length > 1 ? "Shades" : "Shade"}
                        </h2>
                      </div>
                      <article
                        className={stylesSecond.mainGrid}
                        style={{ minHeight: "15vh" }}
                      >
                        {arr.map((item, index) => {
                          const color = `rgb(${
                            hexRgb(item.hex, { format: "css" })[0]
                          }, ${hexRgb(item.hex, { format: "css" })[1]}, ${
                            hexRgb(item.hex, { format: "css" })[2]
                          })`;
                          if (
                            item.price_in_usd >= Number(value.min) &&
                            item.price_in_usd <= Number(value.max)
                          ) {
                            if (
                              item.minting_address === connectedAddress &&
                              toggled
                            ) {
                              return (
                                <Link
                                  href={`/gallery/color-nft/${item.uint256}`}
                                  key={index}
                                >
                                  <a
                                    className={stylesSecond.gridItem}
                                    style={{ background: color }}
                                    onMouseEnter={() => {
                                      handleShow();
                                      setDisplayCard(true);
                                      setCardId(item.name + item.hex.slice(1));
                                    }}
                                    onMouseLeave={() => {
                                      setDisplayCard(false);
                                      setCardId("");
                                    }}
                                    onTouchStart={() => {
                                      setTimeout(() => {
                                        handleShow();
                                        setDisplayCard(true);
                                        setCardId(
                                          item.name + item.hex.slice(1)
                                        );
                                        changeOpacityAmount(item.uint256);
                                      }, 300);
                                    }}
                                    onTouchEnd={() => {
                                      setDisplayCard(false);
                                      setCardId("");
                                      changeOpacityAmount(null);
                                    }}
                                    onTouchEndCapture={() => {
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
                            } else if (!toggled || !showToggle) {
                              return (
                                <Link
                                  href={`/gallery/color-nft/${item.uint256}`}
                                  key={index}
                                >
                                  <a
                                    className={stylesSecond.gridItem}
                                    style={{ background: color }}
                                    onMouseEnter={() => {
                                      handleShow();
                                      setDisplayCard(true);
                                      setCardId(item.name + item.hex.slice(1));
                                    }}
                                    onMouseLeave={() => {
                                      setDisplayCard(false);
                                      setCardId("");
                                    }}
                                    onTouchStart={() => {
                                      setTimeout(() => {
                                        handleShow();
                                        setDisplayCard(true);
                                        setCardId(
                                          item.name + item.hex.slice(1)
                                        );
                                        changeOpacityAmount(item.uint256);
                                      }, 300);
                                    }}
                                    onTouchEnd={() => {
                                      setDisplayCard(false);
                                      setCardId("");
                                      changeOpacityAmount(null);
                                    }}
                                    onTouchEndCapture={() => {
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
                            } else {
                              return (
                                <Link
                                  href={`/gallery/color-nft/${item.uint256}`}
                                  key={index}
                                >
                                  <a
                                    className={stylesSecond.gridItem}
                                    style={{
                                      background: color,
                                      opacity:
                                        nfts.includes(
                                          item.uint256.toString()
                                        ) || selectCardIdOnHover == item.uint256
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
                                    onTouchStart={() => {
                                      setTimeout(() => {
                                        handleShow();
                                        setDisplayCard(true);
                                        setCardId(
                                          item.name + item.hex.slice(1)
                                        );
                                        changeOpacityAmount(item.uint256);
                                      }, 300);
                                    }}
                                    onTouchEnd={() => {
                                      setDisplayCard(false);
                                      setCardId("");
                                      changeOpacityAmount(null);
                                    }}
                                    onTouchEndCapture={() => {
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
                          }
                        })}
                      </article>
                    </div>
                  );
                }
              })}
            </div>
          ) : (
            <GridAllColors
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
              search={search}
              filteredValue={true}
              value={value}
            />
          )
        ) : (
          <GridAllColors
            amountShowedGrid={amountShowedGrid}
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
            search={search}
            value={value}
            selectedOption={selectedOption}
          />
        )
      ) : null}
    </div>
  );
};

export default Views;

const GridAllColors = ({
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
  nfts,
  search,
  value,
  selectedOption,
  setToggled,
}) => {
  const { allReceivedData } = useSelector((state) => state.data);
  const dividedBy = isMobile ? 35 : 50;
  const { connectedAddress } = useSelector((state) => state.minting);

  let faucetArr = [];
  if (allReceivedData.length < 10000) {

    for (var i = 0; i < MINTED_SQUARE - allReceivedData.length; i++) {
      faucetArr.push(i);
    }
  }

  const containerWidthRef = useRef();
  const containerContent = useRef();

  const [loadMore, setLoadMore] = useState(
    (containerWidthRef.current?.clientWidth / dividedBy) * 3
  );

  useEffect(() => {
    if (containerWidthRef) {
      setLoadMore((containerWidthRef.current?.clientWidth / dividedBy) * 3);
    }
  }, [containerWidthRef]);

  useEffect(() => {
    if (loadMore) {
      setLoadMore(loadMore);
    }
  }, [loadMore]);

  const dispatch = useDispatch();

  useEffect(() => {
    if (selectedOption === "Increasing") {
      const sorted = allReceivedData.sort(function (a, b) {
        if (a.nftNo > b.nftNo) {
          return 1;
        }
        if (a.nftNo < b.nftNo) {
          return -1;
        }
        // a must be equal to b
        return 0;
      });
      dispatch(ReceivedData(sorted));
    } else if (selectedOption === "Decreasing") {
      const sorted = allReceivedData.sort(function (a, b) {
        if (a.nftNo < b.nftNo) {
          return 1;
        }
        if (a.nftNo > b.nftNo) {
          return -1;
        }
        // a must be equal to b
        return 0;
      });
      dispatch(ReceivedData(sorted));
    } else if (selectedOption === "Random") {
      const sorted = allReceivedData.sort(() => Math.random() - 0.5);
      dispatch(ReceivedData(sorted));
    }
  }, [selectedOption]);
  //
  //
  useEffect(() => {
    if (search !== "") {
      setLoadMore((containerWidthRef.current?.clientWidth / dividedBy) * 50);
    } else {
      setLoadMore((containerWidthRef.current?.clientWidth / dividedBy) * 3);
    }
  }, [search]);
  //
  //
  useEffect(() => {
    if (toggled && showToggle) {
      setLoadMore((containerWidthRef.current?.clientWidth / dividedBy) * 50);
    } else {
      setLoadMore((containerWidthRef.current?.clientWidth / dividedBy) * 3);
    }
  }, [toggled, showToggle]);

  const handleClick = (e) => {
    var myLocation = e.changedTouches[0];
    const received = document.elementFromPoint(
      myLocation.clientX,
      myLocation.clientY
    );
    handleShow();
    setDisplayCard(true);
    setCardId(received.id);
  };
  const handleClickLeave = () => {
    setDisplayCard(false);
    setCardId("");
  };
  let history = useRouter();

  const handleSide = () => {
    return containerWidthRef.current?.clientWidth / dividedBy / 2;
  };

  const handleSideReturn = (number) => {
    const amount = Math.ceil(allReceivedData.length / (handleSide() * 2));
    for (let i = 0; i < amount * 2; i += 2) {
      if (
        number >= Math.ceil(handleSide() * i) &&
        number < Math.ceil(handleSide() * (i + 1))
      ) {
        return true;
      }
    }
  };

  return (
    <div className={stylesSecond.dataTableContainer} ref={refOverflow}>
      {isMobile ? (
        <article
          className={stylesSecond.mainGrid}
          ref={containerWidthRef}
          onTouchMove={handleClick}
          onTouchStart={handleClick}
          onTouchEnd={handleClickLeave}
        >
          {allReceivedData.map((item, index) => {
            const color = `rgb(${hexRgb(item.hex, { format: "css" })[0]}, ${
              hexRgb(item.hex, { format: "css" })[1]
            }, ${hexRgb(item.hex, { format: "css" })[2]})`;
            if (
              item.price_in_usd >= Number(value.min) &&
              item.price_in_usd <= Number(value.max)
            ) {
              if (
                (search !== "" &&
                  item.hex.toLowerCase().startsWith(search.toLowerCase())) ||
                item.name.toLowerCase().startsWith(search.toLowerCase()) ||
                item.nftNo.toString().startsWith(search) ||
                item.base_color_name
                  .toLowerCase()
                  .startsWith(search.toLowerCase()) ||
                item.uint256.toString().startsWith(search)
              ) {
                if (index === allReceivedData.length - 1) {
                  if (item.minting_address === walletAddress && toggled) {
                    return (
                      <div
                        className={stylesSecond.gridItem}
                        style={{ background: color }}
                        id={item.name + item.hex.slice(1)}
                        onClick={() =>
                          history.push(`/gallery/color-nft/${item.uint256}`)
                        }
                      >
                        <NFTCardContainerOnHover
                          id={item.uint256}
                          color={item.hex}
                          name={item.name}
                          number={item.nftNo}
                          displayCard={displayCard}
                          cardId={cardId}
                          handleShow={handleShow}
                          showOnLeft={handleSideReturn(item.nftNo)}
                        />
                      </div>
                    );
                  } else if (!toggled || !showToggle) {
                    return (
                      <div
                        className={stylesSecond.gridItem}
                        style={{ background: color }}
                        id={item.name + item.hex.slice(1)}
                        onClick={() =>
                          history.push(`/gallery/color-nft/${item.uint256}`)
                        }
                      >
                        <NFTCardContainerOnHover
                          id={item.uint256}
                          color={item.hex}
                          name={item.name}
                          number={item.nftNo}
                          displayCard={displayCard}
                          cardId={cardId}
                          handleShow={handleShow}
                          showOnLeft={handleSideReturn(item.nftNo)}
                        />
                      </div>
                    );
                  } else {
                    return (
                      <div
                        className={stylesSecond.gridItem}
                        style={{
                          background: color,
                          opacity:
                            nfts.includes(item.uint256.toString()) ||
                            selectCardIdOnHover == item.uint256
                              ? "1"
                              : opacityAmount,
                        }}
                        id={item.name + item.hex.slice(1)}
                        onClick={() =>
                          history.push(`/gallery/color-nft/${item.uint256}`)
                        }
                      >
                        <NFTCardContainerOnHover
                          id={item.uint256}
                          color={item.hex}
                          name={item.name}
                          number={item.nftNo}
                          displayCard={displayCard}
                          cardId={cardId}
                          handleShow={handleShow}
                          showOnLeft={handleSideReturn(item.nftNo)}
                        />
                      </div>
                      // </Link>
                    );
                  }
                } else if (item.minting_address === walletAddress && toggled) {
                  return (
                    <div
                      className={stylesSecond.gridItem}
                      style={{ background: color }}
                      id={item.name + item.hex.slice(1)}
                      onClick={() =>
                        history.push(`/gallery/color-nft/${item.uint256}`)
                      }
                    >
                      <NFTCardContainerOnHover
                        id={item.uint256}
                        color={item.hex}
                        name={item.name}
                        number={item.nftNo}
                        displayCard={displayCard}
                        cardId={cardId}
                        handleShow={handleShow}
                        showOnLeft={handleSideReturn(item.nftNo)}
                      />
                    </div>
                  );
                } else if (!toggled || !showToggle) {
                  return (
                    <div
                      className={stylesSecond.gridItem}
                      style={{ background: color }}
                      id={item.name + item.hex.slice(1)}
                      onClick={() =>
                        history.push(`/gallery/color-nft/${item.uint256}`)
                      }
                    >
                      <NFTCardContainerOnHover
                        id={item.uint256}
                        color={item.hex}
                        name={item.name}
                        number={item.nftNo}
                        displayCard={displayCard}
                        cardId={cardId}
                        handleShow={handleShow}
                        showOnLeft={handleSideReturn(item.nftNo)}
                      />
                    </div>
                  );
                } else {
                  return (
                    <div
                      className={stylesSecond.gridItem}
                      style={{
                        background: color,
                        opacity:
                          nfts.includes(item.uint256.toString()) ||
                          selectCardIdOnHover == item.uint256
                            ? "1"
                            : opacityAmount,
                      }}
                      id={item.name + item.hex.slice(1)}
                      onClick={() =>
                        history.push(`/gallery/color-nft/${item.uint256}`)
                      }
                    >
                      <NFTCardContainerOnHover
                        id={item.uint256}
                        color={item.hex}
                        name={item.name}
                        number={item.nftNo}
                        displayCard={displayCard}
                        cardId={cardId}
                        handleShow={handleShow}
                        showOnLeft={handleSideReturn(item.nftNo)}
                      />
                    </div>
                    // </Link>
                  );
                }
              }
            }
          })}
        </article>
      ) : (
        <article
          className={stylesSecond.mainGrid}
          ref={containerWidthRef}
          // style={{ minHeight: `${containerWidthRef.current?.clientHeight - 50}px` }}
        >
          {allReceivedData.map((item, index) => {
            const color = `rgb(${hexRgb(item.hex, { format: "css" })[0]}, ${
              hexRgb(item.hex, { format: "css" })[1]
            }, ${hexRgb(item.hex, { format: "css" })[2]})`;
            if (
              item.price_in_usd >= Number(value.min) &&
              item.price_in_usd <= Number(value.max)
            ) {
              if (
                (search !== "" &&
                  item.hex.toLowerCase().startsWith(search.toLowerCase())) ||
                item.name.toLowerCase().startsWith(search.toLowerCase()) ||
                item.nftNo.toString().startsWith(search) ||
                item.base_color_name
                  .toLowerCase()
                  .startsWith(search.toLowerCase()) ||
                item.uint256.toString().startsWith(search)
              ) {
                if (index === allReceivedData.length - 1) {
                  if (item.minting_address === walletAddress && toggled) {
                    return (
                      <Link
                        href={`/gallery/color-nft/${item.uint256}`}
                        key={index}
                      >
                        <a
                          className={stylesSecond.gridItem}
                          style={{ background: color }}
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
                            showOnLeft={handleSideReturn(item.nftNo)}
                          />
                        </a>
                      </Link>
                    );
                  } else if (!toggled || !showToggle) {
                    return (
                      <Link
                        href={`/gallery/color-nft/${item.uint256}`}
                        key={index}
                      >
                        <a
                          className={stylesSecond.gridItem}
                          style={{ background: color }}
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
                            showOnLeft={handleSideReturn(item.nftNo)}
                          />
                        </a>
                      </Link>
                    );
                  } else {
                    return (
                      <Link
                        href={`/gallery/color-nft/${item.uint256}`}
                        key={index}
                      >
                        <a
                          className={stylesSecond.gridItem}
                          style={{
                            background: color,
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
                        >
                          <NFTCardContainerOnHover
                            id={item.uint256}
                            color={item.hex}
                            name={item.name}
                            number={item.nftNo}
                            displayCard={displayCard}
                            cardId={cardId}
                            handleShow={handleShow}
                            showOnLeft={handleSideReturn(item.nftNo)}
                          />
                        </a>
                      </Link>
                    );
                  }
                } else if (item.minting_address === walletAddress && toggled) {
                  return (
                    <Link
                      href={`/gallery/color-nft/${item.uint256}`}
                      key={index}
                    >
                      <a
                        className={stylesSecond.gridItem}
                        style={{ background: color }}
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
                          showOnLeft={handleSideReturn(item.nftNo)}
                        />
                      </a>
                    </Link>
                  );
                } else if (!toggled || !showToggle) {
                  return (
                    <Link
                      href={`/gallery/color-nft/${item.uint256}`}
                      key={index}
                    >
                      <a
                        className={stylesSecond.gridItem}
                        style={{ background: color }}
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
                          showOnLeft={handleSideReturn(item.nftNo)}
                        />
                      </a>
                    </Link>
                  );
                } else {
                  return (
                    <Link
                      href={`/gallery/color-nft/${item.uint256}`}
                      key={index}
                    >
                      <a
                        className={stylesSecond.gridItem}
                        style={{
                          background: color,
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
                          showOnLeft={handleSideReturn(item.nftNo)}
                        />
                      </a>
                    </Link>
                  );
                }
              }
            }
          })}
        </article>
      )}

      <div
        ref={containerContent}
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "1rem",
          paddingRight: `${
            (containerContent.current?.clientWidth / dividedBy) * 2
          }px`,
        }}
      >
        <h3 className={styles.contentFormSideSubMobileIdMobile}>
          <span style={{ fontFamily: "Plaid" }}>{COLLECTORS}</span>
          &nbsp;Collectors
        </h3>
        <h3 className={styles.contentFormSideSubMobileIdMobile}>
          <span style={{ fontFamily: "Plaid" }}>$380K</span>
          &nbsp;Volume
        </h3>
      </div>
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
    <Link href={`/gallery/color-nft/${id}`} passHref>
      <Atropos
        activeOffset={40}
        shadow={false}
        className={`${!showOnLeft ? "left_position" : "right_position"}`}
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
