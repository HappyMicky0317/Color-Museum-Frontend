import Atropos from "atropos/react";
import "atropos/css";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { isMobile } from "react-device-detect";
import styles from "../../styles/modules/gallery/single.module.css";
import stylesForModal from "../../styles/modules/nav.module.css";
import { GrFormNext } from "react-icons/gr";
import { FiArrowUpRight } from "react-icons/fi";
import { useRouter } from "next/router";
import Image from "next/image";
import NumberFormat from "react-number-format";
import Web3 from "web3";
import { useSelector, useDispatch } from "react-redux";
import { ERC721OrderFeatureAddress } from "../../utils/constants";
import { ERC721OrderFeatureABI } from "../../utils/ABIs/ERC721OrdersFeature";
import Toggle from "react-toggle";
import { OnChainToggle } from "../../store/actions/toggle/index";
import { styled } from "@stitches/react";
import { violet, mauve, blackA } from "@radix-ui/colors";
import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";
import * as SelectPrimitive from "@radix-ui/react-select";
import axios from "axios";
import AcceptOrderBox from "./AcceptOrderBox";
import BidModal from "./BidModal";
import { ImFacebook2 } from "react-icons/im";
import { MdLocationPin, AiFillTwitterCircle } from "react-icons/ai";

const pant = require("nearest-pantone");

const StyledTrigger = styled(SelectPrimitive.SelectTrigger, {
  all: "unset",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "start",
  borderRadius: 4,
  padding: "0 15px",
  fontSize: 13,
  lineHeight: 1,
  height: 30,
  margin: 0,
  gap: 5,
  backgroundColor: "white",
  color: "#000000",
  boxShadow: `0 2px 10px ${blackA.blackA7}`,
  "&:hover": { backgroundColor: mauve.mauve3 },
  "&:focus": { boxShadow: `0 0 0 2px black` },
});

const StyledContent = styled(SelectPrimitive.Content, {
  overflow: "hidden",
  backgroundColor: "#000",
  borderRadius: 6,
  border: "2px solid #fff",
  boxShadow:
    "0px 10px 38px -10px rgba(22, 23, 24, 0.35), 0px 10px 20px -15px rgba(22, 23, 24, 0.2)",
});

const StyledViewport = styled(SelectPrimitive.Viewport, {
  padding: 5,
});

const StyledItem = styled(SelectPrimitive.Item, {
  all: "unset",
  fontSize: 13,
  lineHeight: "30px",
  color: "#fff",
  borderRadius: 0,
  display: "flex",
  alignItems: "center",
  height: 35,
  width: "100%",
  padding: "0 35px 0 30px",
  position: "relative",
  userSelect: "none",
  fontFamily: "Sen",
  cursor: "pointer",
  // borderTop: '1px solid #fff',
  "&[data-disabled]": {
    color: mauve.mauve8,
    pointerEvents: "none",
  },
  "&:focus": {
    backgroundColor: "#fff",
    color: "#000",
  },
});

const StyledLabel = styled(SelectPrimitive.Label, {
  padding: "0 10px",
  fontSize: 11,
  textTransform: "uppercase",
  lineHeight: "25px",
  color: "#fff",
  marginBottom: "5px",
  fontFamily: "Plaid",
});
const StyledPrimitiveValue = styled(SelectPrimitive.Value, {
  marginTop: "3px",
});
const StyledPrimitiveIcon = styled(SelectPrimitive.Icon, {
  marginTop: "0px",
});

const StyledItemIndicator = styled(SelectPrimitive.ItemIndicator, {
  position: "absolute",
  left: 0,
  width: 25,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
});

const scrollButtonStyles = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: 25,
  backgroundColor: "white",
  color: violet.violet11,
  cursor: "default",
};

const StyledScrollUpButton = styled(
  SelectPrimitive.ScrollUpButton,
  scrollButtonStyles
);

const StyledScrollDownButton = styled(
  SelectPrimitive.ScrollDownButton,
  scrollButtonStyles
);

// Exports
export const Select = SelectPrimitive.Root;
export const SelectTrigger = StyledTrigger;
export const SelectValue = StyledPrimitiveValue;
export const SelectIcon = StyledPrimitiveIcon;
export const SelectContent = StyledContent;
export const SelectViewport = StyledViewport;
export const SelectGroup = SelectPrimitive.Group;
export const SelectItem = StyledItem;
export const SelectItemText = SelectPrimitive.ItemText;
export const SelectItemIndicator = StyledItemIndicator;
export const SelectLabel = StyledLabel;
export const SelectScrollUpButton = StyledScrollUpButton;
export const SelectScrollDownButton = StyledScrollDownButton;

const SinglePage = ({ data }) => {
  const { connectedAddress, onChainOrder } = useSelector(
    (state) => state.minting
  );

  const [number, setNumber] = useState(data.nftNo);
  const [name, setName] = useState(data.name);
  const [color, setColor] = useState(data.hex);
  const [description, setDescription] = useState(data.description);
  const [mintingAddress, setOwner] = useState(data.minting_address);
  const [price, setPrice] = useState(
    data.price_in_eth
      ? `${data.price_in_eth.toFixed(2)} WETH | ${data.price_in_usd.toFixed(
          2
        )} USD`
      : "0"
  );
  const [date, setDate] = useState(data.dateMinted);
  const [transactionHash, setTransationHash] = useState(data.transactionHash);
  const router = useRouter();
  const { token } = router.query;
  const [fontSizeAmount, setFontSizeAmount] = useState("28");
  useEffect(() => {
    if (name) {
      if (name.length < 15) {
        setFontSizeAmount("22");
      } else {
        setFontSizeAmount("20");
      }
    }
  }, [name]);
  //
  //
  const [selectedCurrency, setSelectedCurrency] = useState("WETH");
  const [selectedCurrencyInput, setSelectedCurrencyInput] = useState(
    data.price_in_eth
      ? selectedCurrency === null || selectedCurrency === "WETH"
        ? data.price_in_eth.toFixed(2)
        : data.price_in_usd.toFixed(2)
      : "0"
  );
  // console.log(selectedCurrency);
  useEffect(() => {
    setSelectedCurrencyInput(
      data.price_in_eth
        ? selectedCurrency === null || selectedCurrency === "WETH"
          ? data.price_in_eth.toFixed(2)
          : data.price_in_usd.toFixed(2)
        : "0"
    );
  }, [selectedCurrency]);
  const [currencyArray, setCurrencyArray] = useState([
    { logo: "/images/currency/eth.png", currency: "WETH" },
    { logo: "/images/currency/usdc.png", currency: "USDC" },
    { logo: "/images/currency/dai.png", currency: "DAI" },
    { logo: "/images/currency/usdt.png", currency: "USDT" },
  ]);

  const [modalOrderBoxShowFlag, setModalOrderBoxShowFlag] = useState("none");
  const [bidModalFlag, setBidModalFlag] = useState("none");
  const [itemForAcceptBox, setItemForAcceptBox] = useState(null);

  const showAcceptOrderModal = (item) => {
    console.log("here is single page", item);
    if (connectedAddress == "") {
      console.log("You need to connect to wallet!");
      return;
    }
    if (item.current == 3) {
      console.log("This order is already accepted!");
      return;
    }
    setItemForAcceptBox(item);
    setModalOrderBoxShowFlag("block");
    document.body.style.overflow = "hidden";
    console.log("show Order Box Modal");
  };

  const hiddenAcceptOrderModal = () => {
    setModalOrderBoxShowFlag("none");
    document.body.style.overflow = "scroll";
    console.log("Hide Accept Order Box Modal");
  };
  const showBidModal = (e) => {
    // console.log("here is single page", item);
    e.preventDefault();
    if (connectedAddress == "") {
      console.log("You need to connect to wallet!");
      return;
    }
    setBidModalFlag("block");
    document.body.style.overflow = "hidden";
    // console.log("show Order Box Modal");
  };

  const hiddenBidModal = () => {
    setBidModalFlag("none");
    document.body.style.overflow = "scroll";
    console.log("Hide Bid Order Box Modal");
  };

  //
  //
  const [expireDayArray, setExpireDayArray] = useState([
    "24H",
    "72H",
    "7D",
    "30D",
  ]);
  const [expireDay, setExpireDay] = useState("24H");

  const [currentNFTBuyOrders, setCurrentNFTBuyOrders] = useState([]);

  const cancelOrder = async (item) => {
    var web3 = new Web3(window.ethereum);
    const marketPlaceInstance = new web3.eth.Contract(
      ERC721OrderFeatureABI,
      ERC721OrderFeatureAddress
    );

    await marketPlaceInstance.methods.cancelERC721Order(item.nonce).send({
      from: connectedAddress,
    });
  };

  const [value, setValue] = useState("france");
  const pantoneColor = pant.getClosestColor(color);
  const dispatch = useDispatch();

  const handleDownload = () => {
    fetch(data.imageSocial, {
      method: "GET",
      headers: {},
    })
      .then((response) => {
        response.arrayBuffer().then(function (buffer) {
          const url = window.URL.createObjectURL(new Blob([buffer]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", `${name}.png`); //or any other extension
          document.body.appendChild(link);
          link.click();
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <section className={`single_page_wrapper single-gallery ${styles.wrapper}`}>
      <div
        className={stylesForModal.modal}
        style={{ display: modalOrderBoxShowFlag }}
      >
        <div className={stylesForModal.modal_main}>
          <AcceptOrderBox
            hideModal={() => hiddenAcceptOrderModal()}
            item={itemForAcceptBox}
            color={color}
          />
        </div>
      </div>
      <div className={stylesForModal.modal} style={{ display: bidModalFlag }}>
        <div className={stylesForModal.modal_main}>
          <BidModal
            hideModal={() => hiddenBidModal()}
            selectedCurrencyInput={selectedCurrencyInput}
            selectedCurrency={selectedCurrency}
            expireDay={expireDay}
            number={token}
            color={color}
          />
        </div>
      </div>
      <article>
        {isMobile ? (
          <Link href="/">
            <a className={styles.early_access}>Early Access</a>
          </Link>
        ) : null}
        <div className={styles.flexTitle}>
          <Link href="/gallery">Gallery</Link>
          <GrFormNext />
          <p>Color NFT</p> <GrFormNext /> <p> No. {number}</p>
        </div>
        {color === "#000000" ? (
          <Atropos activeOffset={40} shadow={false}>
            <div
              className={styles.recentlyContainer}
              style={{ borderColor: "#1c1c1e" }}
            >
              <div className={styles.containerContent}>
                <div
                  className={styles.recentlyHeader}
                  style={{
                    borderBottom: "3px solid #1c1c1e",
                  }}
                >
                  <div className={`${styles.flex} ${styles.margin_left}`}>
                    <div className={styles.logo}>
                      <Image
                        src={"/images/logo.png"}
                        alt="logo NFTs"
                        data-atropos-offset="5"
                        layout="fill"
                        objectFit="contain"
                      />
                    </div>
                  </div>
                  <div
                    className={`${styles.address} ${styles.margin_right}`}
                    data-atropos-offset="5"
                  >
                    {number}
                  </div>
                </div>
                <div
                  className={styles.backgroundContainer}
                  style={{ background: `${color}` }}
                  data-atropos-offset="-0.45"
                ></div>
                <div
                  className={styles.recentlyHeader}
                  style={{ borderTop: "3px solid #c1c1e", marginTop: "3px" }}
                >
                  <p
                    className={`${styles.recentlyP} ${styles.margin_left}`}
                    data-atropos-offset="5"
                    style={{ fontSize: `${fontSizeAmount}px` }}
                  >
                    {name}
                  </p>
                  <p
                    style={{
                      textTransform: "uppercase",
                      fontSize: `${fontSizeAmount}px`,
                    }}
                    className={`${styles.recentlyP} ${styles.margin_right}`}
                    data-atropos-offset="5"
                  >
                    {color}
                  </p>
                </div>
              </div>
            </div>
          </Atropos>
        ) : (
          <Atropos activeOffset={40} shadow={false}>
            <div
              className={styles.recentlyContainer}
              style={{ borderColor: color }}
            >
              <div className={styles.containerContent}>
                <div className={styles.recentlyHeader}>
                  <div className={`${styles.flex} ${styles.margin_left}`}>
                    <div className={styles.logo}>
                      <Image
                        src={"/images/logo.png"}
                        alt="logo NFTs"
                        data-atropos-offset="5"
                        layout="fill"
                        objectFit="contain"
                      />
                    </div>
                  </div>
                  <div
                    className={`${styles.address} ${styles.margin_right}`}
                    data-atropos-offset="5"
                  >
                    {number}
                  </div>
                </div>
                <div
                  className={styles.backgroundContainer}
                  style={{ background: `${color}` }}
                  data-atropos-offset="-0.45"
                ></div>
                <div
                  className={styles.recentlyHeader}
                  style={{ marginTop: "3px" }}
                >
                  <p
                    className={`${styles.recentlyP} ${styles.margin_left}`}
                    data-atropos-offset="5"
                    style={{ fontSize: `${fontSizeAmount}px` }}
                  >
                    {name}
                  </p>
                  <p
                    style={{
                      textTransform: "uppercase",
                      fontSize: `${fontSizeAmount}px`,
                    }}
                    className={`${styles.recentlyP} ${styles.margin_right}`}
                    data-atropos-offset="5"
                  >
                    {color}
                  </p>
                </div>
              </div>
            </div>
          </Atropos>
        )}
        <form className={styles.flex} onSubmit={(e) => showBidModal(e)}>
          <div className={styles.dropdown}>
            <div
              className={styles.iconDiv}
              style={{
                fontFamily: `${
                  selectedCurrency !== "WETH" ? "Plaid" : "inherit"
                }`,
                lineHeight: `${selectedCurrency === "WETH" ? "34px" : "30px"}`,
              }}
            >
              {selectedCurrency === "WETH" ? "Ξ" : "$"}
            </div>

            <NumberFormat
              thousandsGroupStyle="thousand"
              thousandSeparator={true}
              value={selectedCurrencyInput}
              inputMode="numeric"
              className={styles.number}
              onChange={(e) => {
                setSelectedCurrencyInput(e.target.value.replace(",", ""));
              }}
            />
            <div style={{ marginRight: "1rem" }}>
              <Select
                defaultValue={selectedCurrency}
                value={selectedCurrency}
                onValueChange={setSelectedCurrency}
              >
                <SelectTrigger aria-label={selectedCurrency}>
                  <SelectValue aria-label={selectedCurrency} />
                  <SelectIcon>
                    <ChevronDownIcon />
                  </SelectIcon>
                </SelectTrigger>
                <SelectContent>
                  <SelectScrollUpButton>
                    <ChevronUpIcon />
                  </SelectScrollUpButton>
                  <SelectViewport>
                    <SelectGroup>
                      <SelectLabel>currency</SelectLabel>
                      {currencyArray.map((item, index) => {
                        return (
                          <SelectItem value={item.currency}>
                            <SelectItemText>{item.currency}</SelectItemText>
                            <div
                              className={styles.currencyLogo}
                              style={{ position: "absolute", left: "8px" }}
                            >
                              {/* <CheckIcon item={item} /> */}
                              <Image
                                src={item.logo}
                                alt={item.currency}
                                width={"12px"}
                                height={"12px"}
                              />
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectGroup>
                  </SelectViewport>
                  <SelectScrollDownButton>
                    <ChevronDownIcon />
                  </SelectScrollDownButton>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select
                defaultValue={expireDay}
                value={expireDay}
                onValueChange={setExpireDay}
              >
                <SelectTrigger aria-label={expireDay}>
                  <SelectValue aria-label={expireDay} />
                  <SelectIcon>
                    <ChevronDownIcon />
                  </SelectIcon>
                </SelectTrigger>
                <SelectContent>
                  <SelectScrollUpButton>
                    <ChevronUpIcon />
                  </SelectScrollUpButton>
                  <SelectViewport>
                    <SelectGroup>
                      <SelectLabel>deadline</SelectLabel>
                      {expireDayArray.map((item) => {
                        return (
                          <SelectItem value={item}>
                            <SelectItemText>{item} Expiry</SelectItemText>
                          </SelectItem>
                        );
                      })}
                    </SelectGroup>
                  </SelectViewport>
                  <SelectScrollDownButton>
                    <ChevronDownIcon />
                  </SelectScrollDownButton>
                </SelectContent>
              </Select>
            </div>
          </div>
          <button type="submit" className={styles.statusContainer}>
            {data.minting_address === connectedAddress ? "LIST" : "BID"}
          </button>
        </form>
        <div className={styles.toggleChain}>
          <label className="toggle-icon">
            <Toggle
              value={onChainOrder}
              icons={false}
              onChange={() => {
                dispatch(OnChainToggle());
              }}
            />
          </label>
          <h3>{onChainOrder ? "On-chain" : "Off-chain"}</h3>
        </div>
        <h2 className={styles.descHeader}>NFT No.</h2>
        <p className={styles.descLarge}>{number}</p>
        <h2 className={styles.descHeader}>Description</h2>
        <p className={styles.desc}>{description}</p>
        <h2 className={styles.descHeader}>Hexadecimal</h2>
        <p className={styles.descLarge} style={{ textTransform: "uppercase" }}>
          {color}
        </p>
        <h2 className={styles.descHeader}>Color Category</h2>
        <p className={styles.descLarge}>{data.base_color}</p>
        {pantoneColor && (
          <>
            <h2 className={styles.descHeader}>PANTONE&copy; Match</h2>
            <div className={styles.flexPantone}>
              <div
                style={{
                  marginRight: "1rem",
                  width: "50px",
                  height: "50px",
                  background: pantoneColor ? pantoneColor.hex : "#000",
                }}
              />
              <p
                className={styles.descLarge}
                style={{ textTransform: "uppercase", marginLeft: "0" }}
              >
                {pantoneColor && pantoneColor.pantone}
              </p>
            </div>
          </>
        )}
        <h2 className={styles.descHeader}>TokenID</h2>
        <p className={styles.descLarge}>
          {token}
          <a
            href={`https://etherscan.io/token/0xcf12413f738ad3a14b9810ba5f86e59fcd9baadf?a=${token}`}
            target="_blank"
            rel="noreferrer"
          >
            <FiArrowUpRight />
          </a>
        </p>
        <h2 className={styles.descHeader}>Minted by</h2>
        <p className={styles.descLarge}>
          {mintingAddress
            ? `${mintingAddress.substring(0, 6)}...${mintingAddress.substring(
                mintingAddress.length - 6
              )}`
            : mintingAddress === null
            ? "Not recorded"
            : "-"}
          <a
            href={`https://etherscan.io/tx/${transactionHash}`}
            target="_blank"
            rel="noreferrer"
          >
            <FiArrowUpRight />
          </a>
        </p>
        <h2 className={styles.descHeader}>Mint Price</h2>
        <p className={styles.descLarge}>
          {price}
          <a
            href={`https://etherscan.io/tx/${transactionHash}`}
            target="_blank"
            rel="noreferrer"
          >
            <FiArrowUpRight />
          </a>
        </p>
        <h2 className={styles.descHeader}>Date Minted</h2>
        <p className={styles.descLarge}>
          {date}
          <a
            href={`https://etherscan.io/tx/${transactionHash}`}
            target="_blank"
            rel="noreferrer"
          >
            <FiArrowUpRight />
          </a>
        </p>
        <div className={styles.buttonsContainer}>
          <Link href={`/change/${token}`} passHref>
            <a className={styles.buttonsEdit}>Edit</a>
          </Link>
          <a
            onClick={(e) => handleDownload(e)}
            href={data.imageSocial}
            target="_blank"
            style={{ marginLeft: "1rem" }}
            className={styles.buttonsEdit}
          >
            Download
          </a>
        </div>
        <div className={styles.buttonsContainer}>
          <Link
            href={`https://www.facebook.com/sharer/sharer.php?u=color.museum/gallery/${token}`}
            passHref
            target="_blank"
          >
            <a className={styles.buttonsEdit} target="_blank">
              Facebook {ImFacebook2}
            </a>
          </Link>
          <Link
            href={`https://twitter.com/intent/tweet?text=${token}`}
            passHref
            target="_blank"
          >
            <a className={styles.buttonsEdit} target="_blank">
              twitter {AiFillTwitterCircle}
            </a>
          </Link>
          <Link
            href={`https://bulletin.color.museum/${token}`}
            passHref
            target="_blank"
          >
            <a className={styles.buttonsEdit} target="_blank">
              Bulletin {MdLocationPin}
            </a>
          </Link>
        </div>
      </article>
      <article className={styles.secondContainer}>
        <div className={styles.flexSecondContainer}>
          <h1>trade history</h1>
        </div>
        {currentNFTBuyOrders.map((item, index) => {
          return (
            <div
              className={styles.statusPrice}
              onClick={() => showAcceptOrderModal(item)}
              key={index}
            >
              <img src={"/images/bidIcon.png"} alt="bid" />
              <b className={styles.tredeName}>
                {item.order_direction == 0 ? "Auction" : "Bid"}
              </b>
              <span className={styles.trede}>
                <b className={styles.tredePrice}>
                  {Web3.utils
                    .fromWei(item.erc20TokenAmount, "ether")
                    .toString()}
                </b>
                ETH
              </span>
              <span className={styles.tredeMainPrice}> $1267.54 </span>
              <span className={styles.tredeDate}> {item.createdAt} </span>
              <b className={styles.tredeEth}>{`${item.maker.substring(
                0,
                6
              )}...${item.maker.substring(item.maker.length - 6)}`}</b>
              <span className={styles.fixText}>
                <img src={"/images/priceIsUp.png"} alt="Sold" />
                40%
              </span>
            </div>
          );
        })}
        <div className={styles.statusPrice}>
          <img src={"/images/mintedIcon.png"} alt="Minted" />
          <b className={styles.tredeName}>Minted</b>
          <span className={styles.trede}>
            <b className={styles.tredePrice}>
              {" "}
              {data.price_in_eth && data.price_in_eth.toFixed(2)}
            </b>{" "}
            ETH
          </span>
          <span className={styles.tredeMainPrice}>
            {" "}
            ${data.price_in_usd && data.price_in_usd.toFixed(2)}{" "}
          </span>
          <span className={styles.tredeDate}>2.23.2022 12:15 GMT </span>
          <b className={styles.tredeEth}>caeser.eth</b>
        </div>
        {/* <div className={styles.containerChart}>
          <ChartSingle />
        </div> */}
      </article>
    </section>
  );
};

export default SinglePage;
