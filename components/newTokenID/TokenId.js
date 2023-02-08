import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import styles from "../../styles/modules/newTokenID/tokenID.module.css";
import { hex2lab } from "@csstools/convert-colors";
import colorlab from "colorlab";
import Link from "next/link";
import axios from "axios";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { useDispatch, useSelector } from "react-redux";
import { FiArrowUpRight } from "react-icons/fi";
import { BsChevronDown } from "react-icons/bs";
import { FaLock } from "react-icons/fa";
import { FaLockOpen } from "react-icons/fa";
import { FiChevronRight, FiCheck } from "react-icons/fi";
import { useENSName } from "use-ens-name";
import { format } from "date-fns";
import AcceptOrderStepWizard from "./AcceptOrderStepWizard";
import MakeOrderStepWizard from "./makeOrderStepWizard";
import { useWeb3React } from "@web3-react/core";
import Web3 from "web3";
import { isMobile } from "react-device-detect";
import toast from "react-hot-toast";
import { NFTabi } from "../../utils/ABIs/NFTabi";
import { tokenABI } from "../../utils/ABIs/TokenABI";
import { IoIosArrowUp } from "react-icons/io";
import {
  TokenAddressList,
  SMARTCONTRACTADDR,
  API_URL,
  PROVIDER_FOR_WEB3,
} from "../../utils/constants";
import { Web3Provider } from "../../store/actions/toggle";
import Atropos from "atropos/react";
import "atropos/css";
import moment from "moment";
import "react-tippy/dist/tippy.css";
import { Tooltip } from "react-tippy";
import { ethers } from "ethers";
import InfoStepWizard from "./infoStepWizard";
import CancelOfferSlider from "./CancelOfferSlider";
import { tokensOfOwnerABI } from "../../utils/tokensOfOwnerABI";

const tokenId = ({ data }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { account } = useWeb3React();
  const { library } = useWeb3React(); // the even catch of wallet change

  /*----------- User defined variables ------------------*/
  const number = data.nftNo; //NFT's mint number
  const name = data.name; //name which set by minter
  const color = data.hex; //the color of the NFT as hex data
  const description = data.description; //description which set by minter
  const baseColor = data.base_color_name; //category of the color
  const mintingAddress = data.minting_address; //minter of the NFT
  const price = data.price_in_eth ? `${data.price_in_eth.toFixed(2)}` : "0"; //  the mint price of the NFT
  const date = moment(data.dateMinted).fromNow();
  const dateTooltip =
    format(Date.parse(data.dateMinted), "MM.dd.yyyy HH:mm") + " GMT";
  //  the mint date of the NFT
  const { token } = router.query; //the tokenID of the NFT
  var numberForPassToStepWizard = token; // CHANGE WHEN TESTING! change this to token on mainnet, set number on testnet
  const currencyArrayForPrint = ["ETH", "WETH", "USDC", "DAI", "USDT"]; // token symbol array : for the future this will be in constants or get from server, blockchain
  const decimalForCurrency = [18, 18, 6, 18, 6]; // token decimal array : for the future this will be in constants or get from server, blockchain
  const ensName = useENSName(mintingAddress);

  /*---------- Redux variables --------------- */
  const { connectedAddress } = useSelector((state) => state.minting); //   the address on wallet which connected to site on
  const { web3 } = useSelector((state) => state.minting); // web3provider using selected wallet

  /*------------- useState variables, some are with their code block ------------------------*/
  const [ownerOfNFT, setOwnerOfNFT] = useState("");
  const [currentBuyOrders, setCurrentBuyOrders] = useState([]);
  const [currentSellOrders, setCurrentSellOrders] = useState([]);
  const [bestCurrentBuyOrder, setBestCurrentBuyOrder] = useState({
    erc20TokenAmount: "0",
    fees: [{ amount: "0" }],
  }); // the highest bid
  const [bestCurrentSellOrder, setBestCurrentSellOrder] = useState({
    erc20TokenAmount: "0",
    fees: [{ amount: "0" }],
  }); //  the lowest list
  // console.log('bestCurrentSellOrder',bestCurrentSellOrder.erc20TokenAmount)
  const [highestOffer, setHighestOffer] = useState({
    erc20TokenAmount: "0",
    fees: [{ amount: "0" }],
  });
  const [selectedOffer, setSelectedOffer] = useState(null); //selected order which is on offer tab
  const [acceptOfferNew, setAcceptOfferNew] = useState(false); // accept order slide will appear when true
  const [orderStepWizardOpen, setOrderStepWizardOpen] = useState(false); // making order step will appear when true

  const [isOpenMoobileDropdwon, setIsOpenMoobileDropdwon] = useState(false); // ??? Front-end

  const [tabIndex, setTabIndex] = useState(0); // ??? Front-end
  const [displayCard, setDisplayCard] = useState(false); // ??? Front-end
  const [cardId, setCardId] = useState(); // ??? Front-end
  const [fontSizeAmount, setFontSizeAmount] = useState("28"); // font size of name

  useEffect(async () => {
    //when library(wallet) changes
    if (library) {
      console.log("Library changed!", account);
      const WEB3 = new Web3(library.givenProvider);
      dispatch(Web3Provider(WEB3)); // set web3 with current library
    }
  }, [library]);

  useEffect(() => {
    if (name) {
      if (name.length < 10) {
        setFontSizeAmount("24");
      } else if (name.length > 9 && name.length < 15) {
        setFontSizeAmount("22");
      } else if (name.length > 14 && name.length < 20) {
        setFontSizeAmount("21");
      } else if (name.length > 19 && name.length < 30) {
        setFontSizeAmount("20");
      } else {
        setFontSizeAmount("18");
      }
    }
  }, [name]);

  /* -------------- CODE BLOCK START: getting the nearest colors --------------------*/
  const [nearestColorsFinal, setNearestColors] = useState();
  const [allColorsReceived, setAllColorsReceived] = useState();
  const handleNearestColor = async () => {
    const allColors = await axios(
      `https://metadata.color.museum/api/v1/image/`
    );
    const nearestColors = [];
    setAllColorsReceived(allColors.data.documents);
    const mainColor = hex2lab(color);
    allColors.data.documents.map((item) => {
      const secondaryColor = hex2lab(item.hex);
      const mainColorLab = new colorlab.CIELAB(
        mainColor[0],
        mainColor[1],
        mainColor[2]
      );
      const secondaryColorLab = new colorlab.CIELAB(
        secondaryColor[0],
        secondaryColor[1],
        secondaryColor[2]
      );
      nearestColors.push({
        cielab: colorlab.CIEDE2000(mainColorLab, secondaryColorLab),
        hex: item.hex,
        tokenId: item.uint256,
      });
    });
    nearestColors.sort(function (a, b) {
      if (a.cielab > b.cielab) {
        return 1;
      }
      if (a.cielab < b.cielab) {
        return -1;
      }
      // a must be equal to b
      return 0;
    });
    setNearestColors(nearestColors.slice(1, 4));
  };

  /* ------------------- CODE BLOCK END ------------------------*/

  /*------------------ CODE BLOCK START : get current available orders and past orders which is already accepted when mount*/

  const [currentOffers, setCurrentOffers] = useState([]);
  const [pastOffers, setPastOffers] = useState([]);

  const getPastOrders = async () => {
    var requestURL = `${API_URL}/orders?filterBy=erc721_token&filter={"erc721Token":"${SMARTCONTRACTADDR}","erc721TokenId":${numberForPassToStepWizard},"current":"3"}&sort=created_at&order=-1`;
    var returnOrders;
    try {
      returnOrders = await axios.get(requestURL);
    } catch (e) {
      console.log(e);
      return false;
    }
    console.log(returnOrders);
    if (returnOrders.data.success == true) {
      setPastOffers(returnOrders.data.body);
      console.log("Past Order count", returnOrders.data.body);
    }
  };

  const getAvailableOrders = async () => {
    var requestURL = `${API_URL}/orders?filterBy=erc721_token&filter={"erc721Token":"${SMARTCONTRACTADDR}","erc721TokenId":${numberForPassToStepWizard},"current":"1,4"}&sort=created_at&order=-1`;
    var returnedOrders;

    try {
      returnedOrders = await axios.get(requestURL);
    } catch (e) {
      console.log(e);
      return false;
    }

    const web3 = new Web3(new Web3.providers.HttpProvider(PROVIDER_FOR_WEB3));

    const NFTInstance = new web3.eth.Contract(NFTabi, SMARTCONTRACTADDR);
    var owner = await NFTInstance.methods
      .ownerOf(numberForPassToStepWizard)
      .call();
    setOwnerOfNFT(owner);
    console.log("Owner address of NFT: ", owner);

    if (returnedOrders.data.success == true) {
      var curOffers = returnedOrders.data.body;
      console.log("curOffers", curOffers);
      var availableCurOffers = [],
        cnt = 0;

      for (var i = 0; i < curOffers.length; ++i) {
        const item = curOffers[i];

        const currentDate = new Date();
        const expireDate = new Date(item.expiry_date);
        let diff = expireDate.getTime() - currentDate.getTime();
        diff = diff / (1000 * 3600 * 24);
        if (diff <= 0) {
          continue;
        }
        item.diff = diff;

        const tokenInstance = new web3.eth.Contract(tokenABI, item.erc20Token);
        const ownerOfNFT = await NFTInstance.methods
          .ownerOf(item.erc721TokenId)
          .call();

        if (item.order_direction == 0) {
          if (ownerOfNFT == item.maker) {
            availableCurOffers[cnt++] = item;
            if (
              getBigNumber(item.erc20TokenAmount).gt(
                getBigNumber(highestOffer.erc20TokenAmount)
              )
            )
              setHighestOffer(item);
          }
        } else {
          const balanceOfTokenBig = getBigNumber(
            await tokenInstance.methods.balanceOf(item.maker).call()
          );
          const erc20TokenAmountBig = getBigNumber(item.erc20TokenAmount);
          const feeAmountBig = getBigNumber(item.fees[0].amount);
          if (
            balanceOfTokenBig.gte(erc20TokenAmountBig.add(feeAmountBig)) &&
            ownerOfNFT != item.maker
          ) {
            availableCurOffers[cnt++] = item;
            if (
              getBigNumber(item.erc20TokenAmount).gt(
                getBigNumber(highestOffer.erc20TokenAmount)
              )
            )
              setHighestOffer(item);
          }
        }
      }

      availableCurOffers.sort(function (a, b) {
        if (Number(a.expiry) > Number(b.expiry)) return 1;
        else if (Number(a.expiry) < Number(b.expiry)) return -1;
        return 0;
      });

      setCurrentOffers(availableCurOffers);
      console.log("Available Orders", availableCurOffers);
    }
  };

  useEffect(() => {
    handleNearestColor();
    getPastOrders();
    getAvailableOrders();
  }, []);

  /*------------------- CODE BLOCK END ------------------*/

  /*------------------ CODE BLOCK START : open slides ---------------*/

  const openAcceptOfferSlide = async (item) => {
    if (connectedAddress == "") {
      toast.error("Please connect to wallet!");
      return false;
    }
    console.log("openAcceptOfferSlide", item);
    setSelectedOffer(item);
    setAcceptOfferNew(true);
  };

  const runMakeOffer = async () => {
    if (connectedAddress == "") {
      toast.error("Please connect to wallet!");
      return false;
    }
    setOrderStepWizardOpen(true);
  };

  /*--------- CODE BLOCK END ----------------*/

  const getBigNumber = (input) => {
    if (typeof input === "string") return ethers.utils.parseUnits(input, "wei");
    return ethers.utils.parseUnits(String(input), "wei");
  };

  /* ---- CODE BLOCK START : get buy orders and sell orders separately, get the best buy and sell order when connected -----*/

  useEffect(async () => {
    if (!connectedAddress) return;
    var returnBuyOrders = [];
    var returnSellOrders = [];
    var i = 0;
    for (i = 0; i < currentOffers.length; ++i) {
      const item = currentOffers[i];
      if (item.order_direction == 0) returnSellOrders.push(item);
      else returnBuyOrders.push(item);
    }
    console.log("returnBuyOrders", returnBuyOrders);
    console.log("returnSellOrders", returnSellOrders);
    setCurrentBuyOrders(returnBuyOrders);
    setCurrentSellOrders(returnSellOrders);

    var min = 0,
      max = 0;

    var USDPrice = await axios(
      "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD&api_key=009af5cd91ef9afa8c17ee4a5d4c2f23a81b917f2f4d0d2096a680b6ab7d4b61"
    );
    console.log("USDPrice", USDPrice);
    USDPrice = USDPrice.data.USD;

    for (i = 1; i < returnSellOrders.length; ++i) {
      debugger;
      const item = returnSellOrders[i];
      var iIndexOfToken = TokenAddressList.indexOf(item.erc20Token);
      var iOrderUSDPrice = 0;
      if (iIndexOfToken <= 1) {
        iOrderUSDPrice = getBigNumber(item.erc20TokenAmount)
          .mul(getBigNumber(Math.floor(USDPrice)))
          .div(getBigNumber(Math.pow(10, 18)));
      } else {
        iOrderUSDPrice = getBigNumber(item.erc20TokenAmount).div(
          getBigNumber(Math.pow(10, decimalForCurrency[iIndexOfToken]))
        );
      }

      const MItem = returnSellOrders[min];
      console.log("MItem", MItem);
      var MIndexOfToken = TokenAddressList.indexOf(MItem.erc20Token);
      var MOrderUSDPrice = 0;
      if (MIndexOfToken <= 1) {
        MOrderUSDPrice = getBigNumber(item.erc20TokenAmount)
          .mul(getBigNumber(Math.floor(USDPrice)))
          .div(getBigNumber(Math.pow(10, 18)));
      } else {
        MOrderUSDPrice = getBigNumber(item.erc20TokenAmount).div(
          getBigNumber(Math.pow(10, decimalForCurrency[MIndexOfToken]))
        );
      }

      if (iOrderUSDPrice.lt(MOrderUSDPrice)) min = i;
    }
    console.log(returnSellOrders[min]);
    setBestCurrentSellOrder(returnSellOrders[min]);

    for (i = 1; i < returnBuyOrders.length; ++i) {
      const item = returnBuyOrders[i];
      var iIndexOfToken = TokenAddressList.indexOf(item.erc20Token);
      var iOrderUSDPrice = 0;
      if (iIndexOfToken <= 1) {
        iOrderUSDPrice = getBigNumber(item.erc20TokenAmount)
          .mul(getBigNumber(Math.floor(USDPrice)))
          .div(getBigNumber(Math.pow(10, 18)));
      } else {
        iOrderUSDPrice = getBigNumber(item.erc20TokenAmount).div(
          getBigNumber(Math.pow(10, decimalForCurrency[iIndexOfToken]))
        );
      }

      const MItem = returnBuyOrders[max];
      var MIndexOfToken = TokenAddressList.indexOf(MItem.erc20Token);
      var MOrderUSDPrice = 0;
      if (MIndexOfToken <= 1) {
        MOrderUSDPrice = getBigNumber(item.erc20TokenAmount)
          .mul(getBigNumber(Math.floor(USDPrice)))
          .div(getBigNumber(Math.pow(10, 18)));
      } else {
        MOrderUSDPrice = getBigNumber(item.erc20TokenAmount).div(
          getBigNumber(Math.pow(10, decimalForCurrency[MIndexOfToken]))
        );
      }

      if (iOrderUSDPrice.gt(MOrderUSDPrice)) max = i;
    }
    setBestCurrentBuyOrder(returnBuyOrders[max]);
  }, [connectedAddress, currentOffers]);

  /*----------------- CODE BLOCK END -------------*/

  useEffect(() => {
    // When wallet is changed use this to close step wizard.
  }, [connectedAddress]);

  const TooltipContainer = ({ verboseDate, children, ...rest }) => (
    <Tooltip {...rest} content={verboseDate}>
      {children}
    </Tooltip>
  );

  const [transactionInfo, setTransactionInfo] = useState();
  const [infoStepWizard, setInfoStepWizard] = useState(false);
  const [descriptionShow, setDescriptionShow] = useState(false);

  useEffect(() => {
    let element = document.querySelector(".overlayClass");
    if (element) element.style.backgroundColor = `${color}50`;
  }, [orderStepWizardOpen]);

  const { whiteBorders } = useSelector((state) => state.minting);

  const [cancelOfferSlider, setCancelOfferSlider] = useState(false);

  const [ownerOfToken, setOwnerOfToken] = useState();
  const ensNameToken = useENSName(ownerOfToken);
  useEffect(() => {
    if (token) {
      const options = {
        method: "GET",
        headers: {
          Accept: "application/json",
          "x-api-key": "omarcolormuseu_sk_j2h68noef6sz4lum",
        },
      };
      const handleToken = async () => {
        await axios(
          `https://api.simplehash.com/api/v0/nfts/ethereum/0xcf12413f738ad3a14b9810ba5f86e59fcd9baadf/${token}`,
          options
        ).then((res) =>
          setOwnerOfToken(
            res.data.owners[res.data.owners.length - 1].owner_address
          )
        );
      };
      handleToken();
    }
  }, [token]);

  const [priceMintedUsd, setPriceMintedUsd] = useState(0);
  const handleUsdValue = async (ethValue) => {
    await axios(
      "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD"
    )
      .then((res) => {
        setPriceMintedUsd(res.data.USD);
      })
      .catch((err) => console.log(err));
  };
  handleUsdValue();
  return (
    <>
      <section className={styles.upperContainer}>
        <div className={styles.tokenIdPath}>
          <Link href="/gallery" passHref>
            <a>Gallery</a>
          </Link>
          <FiChevronRight />
          <Link href="/gallery/color-nft" passHref>
            Color NFT
          </Link>{" "}
          <FiChevronRight /> No. {number}
        </div>
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
            <div className={styles.recentlyHeader} style={{ marginTop: "3px" }}>
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
                  fontSize: `24px`,
                }}
                className={`${styles.recentlyP} ${styles.margin_right}`}
                data-atropos-offset="5"
              >
                {color}
              </p>
            </div>
          </div>
        </div>
        {isMobile && (
          <h1
            style={{
              margin: "20px 0px 10px 5px",
              fontSize: name.length > 14 ? "2rem" : "3rem",
              color: "#fff",
              fontFamily: "Plaid-L-Mono",
              letterSpacing: "-.05em",
              textTransform: "uppercase",
              lineHeight: "110%",
              maxWidth: "250px",
            }}
          >
            {name}
          </h1>
        )}
      </section>
      <section className={styles.lowerContainer}>
        <article className={styles.lowerLeftContainer}>
          <div className={styles.allText}>
            {!isMobile && (
              <h1
                style={{
                  marginBottom: name.length > 14 ? "1rem" : "0",
                  fontSize: name.length > 14 ? "2.5rem" : "3rem",
                }}
              >
                {name}
              </h1>
            )}

            <h3>NFT No.</h3>
            <h2>{number}</h2>
            <h3>Hexadecimal</h3>
            <h2 style={{ textTransform: "uppercase" }}>{color}</h2>
            <h3>Token ID</h3>
            <h2>{token}</h2>
            <div className={styles.categoryDiv}>
              <h3>Category&nbsp;</h3>
              <h3 style={{ fontWeight: "400", marginTop: "5px" }}>
                {baseColor}
              </h3>
            </div>
            <h3>Description</h3>
            <p style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
              {description.length > 50 ? (
                <>
                  {description.substring(
                    0,
                    descriptionShow ? description.length : 200
                  ) + "... "}
                  {descriptionShow ? (
                    <span onClick={() => setDescriptionShow(!descriptionShow)}>
                      read less{" "}
                    </span>
                  ) : (
                    <span onClick={() => setDescriptionShow(!descriptionShow)}>
                      read more
                    </span>
                  )}
                </>
              ) : (
                description
              )}
            </p>
            <h3>Nearest Colors</h3>
            <div className={styles.flexNearest}>
              {nearestColorsFinal &&
                nearestColorsFinal.map((item) => {
                  return allColorsReceived.map((i, index) => {
                    if (i.uint256 === item.tokenId) {
                      return (
                        <Link
                          href={`/gallery/color-nft/${item.tokenId}`}
                          passHref
                        >
                          <a
                            className={styles.squareNearest}
                            style={{
                              background: item.hex,
                              borderColor: `${
                                whiteBorders.includes(color) ? "#1c1c1c" : color
                              }`,
                              borderWidth: "1px",
                              borderStyle: "solid",
                            }}
                            onMouseEnter={() => {
                              setDisplayCard(true);
                              setCardId(item.hex.slice(1));
                            }}
                            onMouseLeave={() => {
                              setDisplayCard(false);
                              setCardId("");
                            }}
                          >
                            <NFTCardContainerOnHover
                              id={i.uint256}
                              color={i.hex}
                              name={i.name}
                              number={i.nftNo}
                              displayCard={displayCard}
                              cardId={cardId}
                            />
                          </a>
                        </Link>
                      );
                    }
                  });
                })}
            </div>
            <div className={styles.lineOwner} />
            <h3>Owned By</h3>
            <div className={styles.flexNearest}>
              <h2>
                {ensNameToken
                  ? ensNameToken
                  : ownerOfToken &&
                    ownerOfToken.substring(0, 6) +
                      "..." +
                      ownerOfToken.substring(ownerOfToken.length - 6)}
              </h2>
            </div>
            <Link href={`/change/${token}`} passHref>
              <a className={styles.makeOffer}>Edit</a>
            </Link>
          </div>
          {/* )} */}
        </article>
        <article className={styles.lowerRightContainer}>
          <div className={styles.fixedHeight}>
            <div className={styles.offerFlex}>
              <div className={styles.leftSide}>
                <div className={styles.offerFlex}>
                  <h2 className={styles.lowerRightContainer_listed}>
                    {currentBuyOrders.length > 0 || currentSellOrders.length > 0
                      ? "Listed for"
                      : currentOffers.length == 0 && pastOffers.length == 0
                      ? "Minted for"
                      : currentOffers.length === 0
                      ? "Last Price"
                      : "Listed for"}
                  </h2>
                  <h3 className={styles.expireHours}>
                    {currentOffers.length &&
                    currentOffers[currentOffers.length - 1].diff < 100 / 24
                      ? `${Math.round(
                          (
                            currentOffers[currentOffers.length - 1].diff * 24
                          ).toFixed(2)
                        )}h expire`
                      : null}
                  </h3>
                </div>
                <div className={styles.offerFlex}>
                  <h1 className={styles.price}>
                    {connectedAddress == ownerOfNFT &&
                    currentBuyOrders.length > 0 ? (
                      <span>
                        {(
                          getBigNumber(
                            bestCurrentBuyOrder.erc20TokenAmount
                          ).add(
                            getBigNumber(bestCurrentBuyOrder.fees[0].amount)
                          ) /
                          Math.pow(
                            10,
                            decimalForCurrency[
                              TokenAddressList.indexOf(
                                bestCurrentBuyOrder.erc20Token
                              )
                            ]
                          )
                        ).toFixed(4)}{" "}
                        {
                          currencyArrayForPrint[
                            TokenAddressList.indexOf(
                              bestCurrentBuyOrder.erc20Token
                            )
                          ]
                        }
                      </span>
                    ) : connectedAddress != ownerOfNFT &&
                      currentSellOrders.length > 0 ? (
                      <span>
                        {bestCurrentSellOrder &&
                          (
                            getBigNumber(
                              bestCurrentSellOrder.erc20TokenAmount
                            ).add(
                              getBigNumber(bestCurrentSellOrder.fees[0].amount)
                            ) /
                            Math.pow(
                              10,
                              decimalForCurrency[
                                TokenAddressList.indexOf(
                                  bestCurrentSellOrder.erc20Token
                                )
                              ]
                            )
                          ).toFixed(4)}{" "}
                        {bestCurrentSellOrder &&
                          currencyArrayForPrint[
                            TokenAddressList.indexOf(
                              bestCurrentSellOrder.erc20Token
                            )
                          ]}
                      </span>
                    ) : currentOffers.length === 0 && pastOffers.length == 0 ? (
                      price + " ETH"
                    ) : currentOffers.length === 0 ? (
                      <span>
                        {(
                          getBigNumber(pastOffers[0].erc20TokenAmount).add(
                            getBigNumber(pastOffers[0].fees[0].amount)
                          ) /
                          Math.pow(
                            10,
                            decimalForCurrency[
                              TokenAddressList.indexOf(pastOffers[0].erc20Token)
                            ]
                          )
                        ).toFixed(4)}{" "}
                        {
                          currencyArrayForPrint[
                            TokenAddressList.indexOf(pastOffers[0].erc20Token)
                          ]
                        }
                      </span>
                    ) : (
                      <span>
                        {(
                          getBigNumber(highestOffer.erc20TokenAmount).add(
                            getBigNumber(highestOffer.fees[0].amount)
                          ) /
                          Math.pow(
                            10,
                            decimalForCurrency[
                              TokenAddressList.indexOf(highestOffer.erc20Token)
                            ]
                          )
                        ).toFixed(4)}{" "}
                        {
                          currencyArrayForPrint[
                            TokenAddressList.indexOf(highestOffer.erc20Token)
                          ]
                        }
                      </span>
                    )}{" "}
                  </h1>
                </div>
              </div>
              <div className={styles.rightSide}>
                {connectedAddress === "" ? (
                  currentOffers.length > 0 ? (
                    <button
                      className={styles.offerButton}
                      onClick={() => {
                        toast.error("Please connect to wallet!");
                      }}
                    >
                      BUY NOW
                    </button>
                  ) : (
                    <></>
                  )
                ) : ownerOfNFT == connectedAddress &&
                  currentBuyOrders.length > 0 ? (
                  <button
                    className={styles.offerButton}
                    onClick={() => openAcceptOfferSlide(bestCurrentBuyOrder)}
                  >
                    SELL NOW
                  </button>
                ) : ownerOfNFT != connectedAddress &&
                  currentSellOrders.length > 0 ? (
                  <button
                    className={styles.offerButton}
                    onClick={() => openAcceptOfferSlide(bestCurrentSellOrder)}
                  >
                    BUY NOW
                  </button>
                ) : (
                  <></>
                )}
                <button
                  // className={styles.offerButton}
                  className={
                    connectedAddress === "" && currentOffers.length > 0
                      ? styles.offerButtonWhite
                      : ownerOfNFT == connectedAddress.toLowerCase() &&
                        currentBuyOrders.length > 0
                      ? styles.offerButtonWhite
                      : ownerOfNFT != connectedAddress.toLowerCase() &&
                        currentSellOrders.length > 0
                      ? styles.offerButtonWhite
                      : styles.offerButton
                  }
                  onClick={() => runMakeOffer()}
                  style={{
                    marginLeft: "1rem",
                  }}
                >
                  {connectedAddress && ownerOfNFT == connectedAddress
                    ? `SELL`
                    : "Make Offer"}
                </button>
                {connectedAddress &&
                  currentOffers.length === 0 &&
                  ownerOfToken &&
                  ownerOfToken === connectedAddress &&
                  bestCurrentSellOrder &&
                  bestCurrentSellOrder.erc20TokenAmount == "0" && (
                    <button
                      className={styles.offerButtonWhite}
                      onClick={() => runMakeOffer()}
                      style={{
                        marginLeft: "1rem",
                      }}
                    >
                      New Listing
                    </button>
                  )}
              </div>
            </div>
            <div className={styles.lowerLine} />
          </div>
          <div className={styles.mobileTabs}>
            <Tabs
              className={styles.tab}
              // defaultIndex={1}
              selectedIndex={tabIndex}
              onSelect={(index) => setTabIndex(index)}
            >
              <TabList>
                <Tab selectedClassName={styles.tabActive}>
                  <span className={styles.transactionTab}>Transactions</span>
                  <span className={styles.txTab}>TX</span>
                </Tab>
                <Tab selectedClassName={styles.tabActive} onSelect={tabIndex}>
                  <span style={{ display: "flex", alignItems: "center" }}>
                    Offers{" "}
                    <span
                      className={styles.offersAmount}
                      style={{
                        borderColor:
                          currentOffers.length > 0 ? "#37e800" : "#fff",
                        color: currentOffers.length > 0 ? "#37e800" : "#fff",
                      }}
                    >
                      {currentOffers.length}
                    </span>
                  </span>
                </Tab>
                <Tab selectedClassName={styles.tabActive} disabled>
                  {" "}
                  {tabIndex === 2 ? <FaLockOpen /> : <FaLock />}
                  <span>Yield</span>
                </Tab>
                {/* <div className={styles.dropDown}>
                Latest first{" "}
                <img
                  src={"/images/icon/arrow-bottom.svg"}
                  alt="Sold"
                  className={styles.userAvtar}
                />
              </div> */}
              </TabList>

              <TabPanel>
                <div className={styles.tableMobile}>
                  <div className={styles.tableHeaderMobile}>
                    <h5 className={styles.headerContentMobileFirst}>Buyer</h5>
                    <h5 className={styles.headerContentMobileSecond}>Date</h5>
                    <h5 className={styles.headerContentMobileThrid}>Price</h5>
                  </div>
                  {pastOffers.map((item, index) => {
                    return (
                      <div className={styles.contentDataMobile} key={index}>
                        <div className={styles.contentFirstContainerMobile}>
                          <div className={styles.mobileContent0x}>0x</div>
                          <div className={styles.contentMobileBlock}>
                            <h5>Jace</h5>
                            <p>
                              {item.maker.substring(0, 6)}...
                              {item.maker.substring(item.maker.length - 6)}
                            </p>
                          </div>
                        </div>
                        <h5 className={styles.headerContentMobileSecond}>
                          <Tooltip
                            title={
                              format(
                                new Date(item.createdAt),
                                "MM.dd.yyyy HH:mm"
                              ) + " GMT"
                            }
                            position="top"
                            trigger="mouseenter"
                            arrow
                            size={"big"}
                            interactive={true}
                          >
                            {moment(item.createdAt).fromNow()}
                          </Tooltip>
                        </h5>
                        <div className={styles.headerContentMobileThrid}>
                          <div className={styles.contentMobileBlock}>
                            <h5>
                              {(
                                getBigNumber(item.erc20TokenAmount).add(
                                  getBigNumber(item.fees[0].amount)
                                ) /
                                Math.pow(
                                  10,
                                  decimalForCurrency[
                                    TokenAddressList.indexOf(item.erc20Token)
                                  ]
                                )
                              ).toFixed(4)}{" "}
                              {
                                currencyArrayForPrint[
                                  TokenAddressList.indexOf(item.erc20Token)
                                ]
                              }
                            </h5>
                            <p>
                              $
                              {(
                                priceMintedUsd *
                                (
                                  getBigNumber(item.erc20TokenAmount).add(
                                    getBigNumber(item.fees[0].amount)
                                  ) /
                                  Math.pow(
                                    10,
                                    decimalForCurrency[
                                      TokenAddressList.indexOf(item.erc20Token)
                                    ]
                                  )
                                ).toFixed(4)
                              ).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div className={styles.contentDataMobile}>
                    <div className={styles.contentFirstContainerMobile}>
                      <div className={styles.mobileContent0x}>0x</div>
                      <div className={styles.contentMobileBlock}>
                        <h5>{ensName !== null ? ensName : null}</h5>
                        <p
                          style={{
                            color: ensName !== null ? "#666" : "#fff",
                            fontSize: ensName !== null ? ".7rem" : ".75rem",
                          }}
                        >
                          {mintingAddress
                            ? `${mintingAddress.substring(
                                0,
                                6
                              )}...${mintingAddress.substring(
                                mintingAddress.length - 6
                              )}`
                            : mintingAddress === null
                            ? "Not recorded"
                            : "-"}
                        </p>
                      </div>
                    </div>
                    <h5 className={styles.headerContentMobileSecond}>
                      <Tooltip
                        title={dateTooltip}
                        position="top"
                        trigger="mouseenter"
                        arrow
                        size={"big"}
                        interactive={true}
                      >
                        {date}
                      </Tooltip>
                    </h5>
                    <div className={styles.headerContentMobileThrid}>
                      <div className={styles.contentMobileBlock}>
                        <h5>{price} ETH</h5>
                        <p>${(priceMintedUsd * price).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabPanel>

              <TabPanel className={styles.tabPanel}>
                <div
                  className={`${styles.tableMobile} ${styles.CollectionTable}`}
                >
                  {currentOffers.length == 0 ? (
                    <>
                      <h3>No activity yet recorded</h3>
                    </>
                  ) : currentOffers.length === 0 ? (
                    <>
                      <h3>No open offers at this time.</h3>
                    </>
                  ) : (
                    <>
                      <div className={styles.tableHeaderMobile}>
                        <h5 className={styles.headerContentMobileFirst}>
                          Buyer
                        </h5>
                        <h5 className={styles.headerContentMobileSecond}>
                          Date
                        </h5>
                        <h5 className={styles.headerContentMobileThrid}>
                          Price
                        </h5>
                      </div>
                      {currentOffers.map((item, index) => {
                        // console.log("currentOffers item", item.expiry);
                        const ensNameN = null;
                        // const ensNameN = useENSName(item.maker);
                        return (
                          <div
                            className={styles.CollectionTableBody}
                            onClick={(e) => {
                              if (
                                item.order_direction !== 0 &&
                                connectedAddress != ownerOfNFT
                              ) {
                                window.open(
                                  `https://etherscan.io/tx/${item.makingHash}`,
                                  "_blank"
                                );
                              } else if (
                                (e.target.localName !== "svg" &&
                                  item.maker !== connectedAddress) ||
                                (item.order_direction !== 0 &&
                                  item.maker === connectedAddress)
                              ) {
                                openAcceptOfferSlide(item);
                              } else if (item.maker === connectedAddress) {
                                setCancelOfferSlider(true);
                              }
                            }}
                            key={index}
                          >
                            <div className={styles.bodyAction}>
                              {item.order_direction == 0 ? "List" : "Bid"}
                            </div>
                            <div className={styles.bodyTo}>
                              <div className={styles.userAvtarBg}>
                                <span>0x</span>
                              </div>
                              <span className={styles.Id}>
                                {ensNameN !== null
                                  ? ensNameN
                                  : item.maker
                                  ? `${item.maker.substring(
                                      0,
                                      6
                                    )}...${item.maker.substring(
                                      item.maker.length - 6
                                    )}`
                                  : item.maker === null
                                  ? "Not recorded"
                                  : "-"}
                              </span>
                            </div>

                            <div className={styles.bodyDate}>
                              {/* {format(
                              new Date(item.createdAt),
                              "MM/dd/yyyy HH:mm"
                            ) + " GMT"} */}

                              <Tooltip
                                title={
                                  format(
                                    Date.parse(item.createdAt),
                                    "MM.dd.yyyy HH:mm"
                                  ) + " GMT"
                                }
                                position="top"
                                trigger="mouseenter"
                                arrow
                                size={"big"}
                                interactive={true}
                              >
                                {moment(item.createdAt).fromNow()}
                              </Tooltip>
                            </div>
                            <div className={styles.bodyPrice}>
                              <span>
                                {(
                                  getBigNumber(item.erc20TokenAmount).add(
                                    getBigNumber(item.fees[0].amount)
                                  ) /
                                  Math.pow(
                                    10,
                                    decimalForCurrency[
                                      TokenAddressList.indexOf(item.erc20Token)
                                    ]
                                  )
                                ).toFixed(4)}{" "}
                                {
                                  currencyArrayForPrint[
                                    TokenAddressList.indexOf(item.erc20Token)
                                  ]
                                }
                              </span>
                            </div>
                            <div
                              className={styles.bodyTo}
                              style={{ justifyContent: "space-between" }}
                            >
                              <Tooltip
                                title={
                                  format(
                                    Date.parse(new Date(item.expiry_date)),
                                    "MM.dd.yyyy HH:mm"
                                  ) + " GMT"
                                }
                                position="top"
                                trigger="mouseenter"
                                arrow
                                size={"big"}
                                interactive={true}
                              >
                                {item.diff <= 0
                                  ? "Expired"
                                  : item.diff > 0 && item.diff < 1
                                  ? (item.diff * 24).toFixed(2) + " Hours"
                                  : Math.round(item.diff) + " Days"}
                              </Tooltip>

                              {!connectedAddress ? null : item.maker ===
                                connectedAddress ? (
                                <button
                                  className={styles.expireButtonCancel}
                                  onClick={() => {
                                    setSelectedOffer(item);
                                    setCancelOfferSlider(true);
                                  }}
                                >
                                  Cancel
                                </button>
                              ) : item.order_direction !== 0 &&
                                connectedAddress == ownerOfNFT ? (
                                <button className={styles.expireButton}>
                                  accept
                                </button>
                              ) : item.order_direction !== 0 ? null : (
                                <button className={styles.expireButton}>
                                  accept
                                </button>
                              )}
                            </div>
                            <div className={styles.headLink}>
                              <a
                                href={`https://etherscan.io/tx/${item.makingHash}`}
                                target="_blank"
                                rel="noreferrer"
                              >
                                <FiArrowUpRight />
                              </a>
                            </div>
                          </div>
                        );
                      })}
                    </>
                  )}
                </div>
              </TabPanel>

              <TabPanel className={styles.tabPanel}>
                <h2>TabPanel 3</h2>
              </TabPanel>
            </Tabs>
          </div>
          <div className={styles.desktopTabs}>
            <Tabs
              className={styles.tab}
              // defaultIndex={1}
              selectedIndex={tabIndex}
              onSelect={(index) => setTabIndex(index)}
            >
              <TabList>
                <Tab selectedClassName={styles.tabActive}>
                  <span className={styles.transactionTab}>Transactions</span>
                  <span className={styles.txTab}>TX</span>
                </Tab>
                <Tab selectedClassName={styles.tabActive}>
                  <span style={{ display: "flex", alignItems: "center" }}>
                    Offers{" "}
                    <span
                      className={styles.offersAmount}
                      style={{
                        borderColor:
                          currentOffers.length > 0 ? "#37e800" : "#fff",
                        color: currentOffers.length > 0 ? "#37e800" : "#fff",
                      }}
                    >
                      {currentOffers.length}
                    </span>
                  </span>
                </Tab>
                <Tab selectedClassName={styles.tabActive} disabled>
                  {" "}
                  {tabIndex === 2 ? <FaLockOpen /> : <FaLock />}
                  <span>Yield</span>
                </Tab>
                {/* <div className={styles.dropDown}>
                Latest first{" "}
                <img
                  src={"/images/icon/arrow-bottom.svg"}
                  alt="Sold"
                  className={styles.userAvtar}
                />
              </div> */}
              </TabList>

              <TabPanel>
                <div className={styles.table}>
                  <div className={styles.CollectionTable}>
                    <div className={styles.CollectionTableHead}>
                      <h5 className={styles.headAction}>Action</h5>
                      <h5 className={styles.headFrom}>Seller</h5>
                      <h5 className={styles.headTo}>Buyer</h5>
                      <h5 className={styles.headDate}>Date</h5>
                      <h5 className={styles.headPrice}>Price</h5>
                      <h5 className={styles.headLink}>TX</h5>
                    </div>

                    {pastOffers.map((item, index) => {
                      return (
                        <div
                          className={styles.CollectionTableBody}
                          key={index}
                          onClick={() => {
                            window.open(
                              `https://etherscan.io/tx/${item.acceptingHash}`,
                              "_blank"
                            );
                          }}
                        >
                          <div className={styles.bodyAction}>Sale</div>
                          <div className={styles.bodyTo}>
                            <div className={styles.userAvtarBg}>
                              <span>0x</span>
                            </div>
                            <span className={styles.Id}>
                              {item.order_direction == 1
                                ? item.taker.substring(0, 6) +
                                  "..." +
                                  item.taker.substring(item.taker.length - 6)
                                : item.from_address.substring(0, 6) +
                                  "..." +
                                  item.from_address.substring(
                                    item.taker.length - 6
                                  )}
                              {/*  */}
                            </span>
                          </div>
                          <div className={styles.bodyFrom}>
                            <div className={styles.userAvtarBg}>
                              <span>0x</span>
                            </div>
                            {item.maker.substring(0, 6)}...
                            {item.maker.substring(item.maker.length - 6)}
                          </div>
                          <div className={styles.bodyDate}>
                            <Tooltip
                              title={
                                format(
                                  new Date(item.createdAt),
                                  "MM.dd.yyyy HH:mm"
                                ) + " GMT"
                              }
                              position="top"
                              trigger="mouseenter"
                              arrow
                              size={"big"}
                              interactive={true}
                            >
                              {moment(item.createdAt).fromNow()}
                            </Tooltip>
                          </div>
                          <div className={styles.bodyPrice}>
                            <span>
                              {(
                                getBigNumber(item.erc20TokenAmount).add(
                                  getBigNumber(item.fees[0].amount)
                                ) /
                                Math.pow(
                                  10,
                                  decimalForCurrency[
                                    TokenAddressList.indexOf(item.erc20Token)
                                  ]
                                )
                              ).toFixed(4)}{" "}
                              {
                                currencyArrayForPrint[
                                  TokenAddressList.indexOf(item.erc20Token)
                                ]
                              }
                            </span>
                          </div>
                          <div className={styles.headLink}>
                            <a
                              href={`https://etherscan.io/tx/${item.acceptingHash}`}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <FiArrowUpRight />
                            </a>
                          </div>
                        </div>
                      );
                    })}
                    <div
                      className={styles.CollectionTableBody}
                      onClick={() => {
                        window.open(
                          `https://etherscan.io/tx/${data.transactionHash}`,
                          "_blank"
                        );
                      }}
                    >
                      <div className={styles.bodyAction}>Minted</div>
                      <div className={styles.bodyTo}>
                        <div className={styles.userAvtarBg}>
                          <span>0x</span>
                        </div>
                        <span
                          className={styles.Id}
                          style={{ textTransform: "lowercase" }}
                        >
                          0xcf124...aadf
                          {/* {SMARTCONTRACTADDR
                          ? `${SMARTCONTRACTADDR.substring(
                            0,
                            6
                          )}...${SMARTCONTRACTADDR.substring(
                            SMARTCONTRACTADDR.length - 6
                          )}`
                          : SMARTCONTRACTADDR === null
                            ? "Not recorded"
                            : "-"} */}
                        </span>
                      </div>
                      <div className={styles.bodyFrom}>
                        <div className={styles.userAvtarBg}>
                          <span>0x</span>
                        </div>
                        {ensName !== null
                          ? ensName
                          : mintingAddress
                          ? `${mintingAddress.substring(
                              0,
                              6
                            )}...${mintingAddress.substring(
                              mintingAddress.length - 6
                            )}`
                          : mintingAddress === null
                          ? "Not recorded"
                          : "-"}
                      </div>
                      <div className={styles.bodyDate}>
                        <Tooltip
                          title={dateTooltip}
                          position="top"
                          trigger="mouseenter"
                          arrow
                          size={"big"}
                          interactive={true}
                        >
                          {date}
                        </Tooltip>
                      </div>
                      <div className={styles.bodyPrice}>{price} ETH</div>
                      <div className={styles.headLink}>
                        <a
                          href={`https://etherscan.io/tx/${data.transactionHash}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <FiArrowUpRight />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </TabPanel>

              <TabPanel className={styles.tabPanel}>
                <div className={styles.table}>
                  <div className={styles.CollectionTable}>
                    {currentOffers.length == 0 ? (
                      <>
                        <h3>No activity yet recorded</h3>
                      </>
                    ) : currentOffers.length === 0 ? (
                      <>
                        <h3>No open offers at this time.</h3>
                      </>
                    ) : (
                      <>
                        <div className={styles.CollectionTableHead}>
                          <h5 className={styles.headAction}>Type</h5>
                          <h5 className={styles.headFrom}>By</h5>
                          <h5 className={styles.headDate}>Date</h5>
                          <h5 className={styles.headPrice}>Price</h5>
                          <h5 className={styles.headFrom}>Expire</h5>
                          <h5 className={styles.headLink}>TX</h5>
                        </div>
                        {currentOffers.map((item, index) => {
                          // console.log("currentOffers item", item.expiry);
                          const ensNameN = null;
                          // const ensNameN = useENSName(item.maker);
                          return (
                            <div
                              className={styles.CollectionTableBody}
                              onClick={(e) => {
                                if (
                                  item.order_direction !== 0 &&
                                  connectedAddress != ownerOfNFT
                                ) {
                                  window.open(
                                    `https://etherscan.io/tx/${item.makingHash}`,
                                    "_blank"
                                  );
                                } else if (
                                  (e.target.localName !== "svg" &&
                                    item.maker !== connectedAddress) ||
                                  (item.order_direction !== 0 &&
                                    item.maker === connectedAddress)
                                ) {
                                  openAcceptOfferSlide(item);
                                } else if (item.maker === connectedAddress) {
                                  setCancelOfferSlider(true);
                                }
                              }}
                              key={index}
                            >
                              <div className={styles.bodyAction}>
                                {item.order_direction == 0 ? "List" : "Bid"}
                              </div>
                              <div className={styles.bodyTo}>
                                <div className={styles.userAvtarBg}>
                                  <span>0x</span>
                                </div>
                                <span className={styles.Id}>
                                  {ensNameN !== null
                                    ? ensNameN
                                    : item.maker
                                    ? `${item.maker.substring(
                                        0,
                                        6
                                      )}...${item.maker.substring(
                                        item.maker.length - 6
                                      )}`
                                    : item.maker === null
                                    ? "Not recorded"
                                    : "-"}
                                </span>
                              </div>

                              <div className={styles.bodyDate}>
                                {/* {format(
                              new Date(item.createdAt),
                              "MM/dd/yyyy HH:mm"
                            ) + " GMT"} */}

                                <Tooltip
                                  title={
                                    format(
                                      Date.parse(item.createdAt),
                                      "MM.dd.yyyy HH:mm"
                                    ) + " GMT"
                                  }
                                  position="top"
                                  trigger="mouseenter"
                                  arrow
                                  size={"big"}
                                  interactive={true}
                                >
                                  {moment(item.createdAt).fromNow()}
                                </Tooltip>
                              </div>
                              <div className={styles.bodyPrice}>
                                <span>
                                  {(
                                    getBigNumber(item.erc20TokenAmount).add(
                                      getBigNumber(item.fees[0].amount)
                                    ) /
                                    Math.pow(
                                      10,
                                      decimalForCurrency[
                                        TokenAddressList.indexOf(
                                          item.erc20Token
                                        )
                                      ]
                                    )
                                  ).toFixed(4)}{" "}
                                  {
                                    currencyArrayForPrint[
                                      TokenAddressList.indexOf(item.erc20Token)
                                    ]
                                  }
                                </span>
                              </div>
                              <div
                                className={styles.bodyTo}
                                style={{ justifyContent: "space-between" }}
                              >
                                <Tooltip
                                  title={
                                    format(
                                      Date.parse(new Date(item.expiry_date)),
                                      "MM.dd.yyyy HH:mm"
                                    ) + " GMT"
                                  }
                                  position="top"
                                  trigger="mouseenter"
                                  arrow
                                  size={"big"}
                                  interactive={true}
                                >
                                  {item.diff <= 0
                                    ? "Expired"
                                    : item.diff > 0 && item.diff < 1
                                    ? (item.diff * 24).toFixed(2) + " Hours"
                                    : Math.round(item.diff) + " Days"}
                                </Tooltip>

                                {!connectedAddress ? null : item.maker ===
                                  connectedAddress ? (
                                  <button
                                    className={styles.expireButtonCancel}
                                    onClick={() => {
                                      setSelectedOffer(item);
                                      setCancelOfferSlider(true);
                                    }}
                                  >
                                    Cancel
                                  </button>
                                ) : item.order_direction !== 0 &&
                                  connectedAddress == ownerOfNFT ? (
                                  <button className={styles.expireButton}>
                                    accept
                                  </button>
                                ) : item.order_direction !== 0 ? null : (
                                  <button className={styles.expireButton}>
                                    accept
                                  </button>
                                )}
                              </div>
                              <div className={styles.headLink}>
                                <a
                                  href={`https://etherscan.io/tx/${item.makingHash}`}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  <FiArrowUpRight />
                                </a>
                              </div>
                            </div>
                          );
                        })}
                      </>
                    )}
                  </div>
                </div>
              </TabPanel>

              <TabPanel className={styles.tabPanel}>
                <h2>TabPanel 3</h2>
              </TabPanel>
            </Tabs>
          </div>
        </article>
      </section>
      <MakeOrderStepWizard
        orderStepWizardOpen={orderStepWizardOpen}
        setOrderStepWizardOpen={setOrderStepWizardOpen}
        number={numberForPassToStepWizard}
        data={data}
        getAvailableOrders={getAvailableOrders}
        ownerOfNFT={ownerOfNFT}
      />
      <AcceptOrderStepWizard
        acceptOfferNew={acceptOfferNew}
        setAcceptOfferNew={setAcceptOfferNew}
        item={selectedOffer}
        data={data}
        getPastOrders={getPastOrders}
        getAvailableOrders={getAvailableOrders}
      />
      <InfoStepWizard
        setInfoStepWizard={setInfoStepWizard}
        infoStepWizard={infoStepWizard}
        transactionInfo={transactionInfo}
      />
      <CancelOfferSlider
        setCancelOfferSlider={setCancelOfferSlider}
        cancelOfferSlider={cancelOfferSlider}
        title="Offer"
        item={selectedOffer}
        getAvailableOrders={getAvailableOrders}
      />
    </>
  );
};

export default tokenId;

const NFTCardContainerOnHover = ({
  id,
  name,
  color,
  number,
  displayCard,
  cardId,
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
      } else if (name.length > 15 && name.length < 30) {
        setFontSizeAmount(`${width < 350 ? "10" : "12"}`);
      } else {
        setFontSizeAmount(`${width < 350 ? "12.8" : "12"}`);
      }
    }
    // eslint-disable-next-line
  }, [name]);
  //
  //

  const { whiteBorders } = useSelector((state) => state.minting);
  return (
    <Link href={`/gallery/color-nft/${id}`} passHref>
      <Atropos
        activeOffset={40}
        shadow={false}
        className="right_position"
        style={{ margin: "-12.5px 0 0 -12.5px" }}
      >
        <div
          className="recentlyContainer"
          style={{
            borderColor: `${whiteBorders.includes(color) ? "#1c1c1c" : color}`,
            textDecoration: "none",
            display:
              displayCard && cardId === color.slice(1) ? "block" : "none",
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
