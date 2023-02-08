import React, { useEffect, useRef, useState } from "react";
import styles from "../../styles/modules/uiconcept/uiconcept.module.css";
import LogoSlicksilder from "./LogoSlicksilder";
import randomColor from "randomcolor";
import { format, getMonth, parseISO } from "date-fns";
import Loader from "../Loader/Loader";
import useIntersection from "./useIntersection";
import stylesSix from "../../styles/modules/homepage/sixthSection.module.css";
import { AiFillPlusCircle } from "react-icons/ai";
import { BsDiscord, BsTwitter } from "react-icons/bs";
import { SiEthereum } from "react-icons/si";
import { MdAllInclusive } from "react-icons/md";
import { useMotionValue } from "framer-motion";
import { DockItem } from "./DockItem";
import { useDispatch, useSelector } from "react-redux";
import { isMobile } from "react-device-detect";
import TopBlog from "./TopBlog";
import { BACKEND } from "../../utils/constants";
import Link from "next/link";
import axios from "axios";
import Image from "next/image";
import stylesSimplified from "../../styles/modules/simplified/simplified.module.css";
import BounceLoader from "react-spinners/BounceLoader";
import { useRouter } from "next/router";
import { useWeb3React } from "@web3-react/core";
import { ConnectAddress, LocalStorage } from "../../store/actions/toggle";
import toast from "react-hot-toast";
import SlideConnectWallet from "../newTokenID/SlideConnectWallet";
import ReactPlayer from "react-player/lazy";

const DataResponse = ({ item, index }) => {
  const [fontSizeAmount, setFontSizeAmount] = useState("25");
  // Screen Width to set the style in properties
  const [width, setWidth] = useState(window.innerWidth);
  let name = item.name;
  let color = item.hex;
  let number = item.nftNo;
  useEffect(() => {
    const handleResize = () => {
      let widthDimension = window.innerWidth;
      setWidth(widthDimension);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  // Screen Width to set the style in properties
  useEffect(() => {
    if (item.name) {
      if (item.name.length < 10) {
        setFontSizeAmount(`${width < 1440 ? "17" : "25"}`);
      } else if (item.name.length > 9 && item.name.length < 15) {
        setFontSizeAmount(`${width < 1440 ? "14.5" : "22"}`);
      } else {
        setFontSizeAmount(`${width < 1440 ? "12.5" : "18"}`);
      }
    }
    // eslint-disable-next-line
  }, [item.name]);
  const { whiteBorders } = useSelector((state) => state.minting);

  if (whiteBorders.includes(color.toUpperCase())) {
    return (
      <Link
        href={`/gallery/color-nft/${item.uint256}`}
        className={styles.logo_container}
        passHref
      >
        <a
          className={stylesSix.nftContainer}
          // href={`https://color.museum/gallery/${item.uint256}`}
          target="_blank"
          key={index}
        >
          <div
            className={stylesSix.recentlyContainer}
            style={{ border: "3px solid #1c1c1e" }}
          >
            <div className={stylesSix.containerContent}>
              <div
                className={stylesSix.recentlyHeader}
                style={{
                  borderBottom: "3px solid #1c1c1e",
                }}
              >
                <div className={`${stylesSix.logo} ${stylesSix.margin_left}`}>
                  <Image
                    src={"/images/logo.png"}
                    alt="logo NFTs"
                    data-atropos-offset="5"
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
                <h5
                  className={`${stylesSix.margin_right} ${stylesSix.address}`}
                >
                  {number}
                </h5>
              </div>
              <div
                className={stylesSix.backgroundContainer}
                style={{ background: `${color}` }}
              ></div>
              <div
                className={stylesSix.recentlyHeader}
                style={{ borderTop: "3px solid #1c1c1e" }}
              >
                <p
                  style={{
                    fontSize: `${fontSizeAmount}px`,
                    lineHeight: `${fontSizeAmount}px`,
                  }}
                  className={`${stylesSix.margin_left} ${stylesSix.recentlyP}`}
                >
                  {name}
                </p>
                <p
                  style={{
                    textTransform: "uppercase",
                    fontSize: `${fontSizeAmount}px`,
                    lineHeight: `${fontSizeAmount}px`,
                  }}
                  className={`${stylesSix.margin_left} ${stylesSix.recentlyP}`}
                >
                  {color}
                </p>
              </div>
            </div>
          </div>
        </a>
      </Link>
    );
  } else {
    return (
      <Link
        href={`/gallery/color-nft/${item.uint256}`}
        className={styles.logo_container}
        passHref
      >
        <a
          className={stylesSix.nftContainer}
          // href={`https://color.museum/gallery/${item.uint256}`}
          target="_blank"
        >
          <div
            className={stylesSix.recentlyContainer}
            style={{ border: `3px solid ${color}` }}
          >
            <div className={stylesSix.containerContent}>
              <div className={stylesSix.recentlyHeader}>
                <div className={`${stylesSix.logo} ${stylesSix.margin_left}`}>
                  <Image
                    src={"/images/logo.png"}
                    alt="logo NFTs"
                    data-atropos-offset="5"
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
                <h5
                  className={`${stylesSix.margin_right} ${stylesSix.address}`}
                >
                  {number}
                </h5>
              </div>
              <div
                className={stylesSix.backgroundContainer}
                style={{ background: `${color}` }}
                data-atropos-offset="-0.45"
              ></div>
              <div className={stylesSix.recentlyHeader} data-atropos-offset="5">
                <p
                  style={{
                    fontSize: `${fontSizeAmount}px`,
                    lineHeight: `${fontSizeAmount}px`,
                  }}
                  className={`${stylesSix.margin_left} ${stylesSix.recentlyP}`}
                >
                  {name}
                </p>
                <p
                  style={{
                    textTransform: "uppercase",
                    fontSize: `${fontSizeAmount}px`,
                    lineHeight: `${fontSizeAmount}px`,
                  }}
                  className={`${stylesSix.margin_right} ${stylesSix.recentlyP}`}
                >
                  {color}
                </p>
              </div>
            </div>
          </div>
        </a>
      </Link>
    );
  }
};

const isSafari = () => {
  const ua = navigator.userAgent.toLowerCase();
  return ua.indexOf("safari") > -1 && ua.indexOf("chrome") < 0;
};

const mainVideo = "/images/video/bg-uiConcept.m4v";
const boxVideo1URl = "/images/video/mint-color-box1.m4v";
const boxVideo2URl = "/images/video/mint-color-box2.m4v";
const boxVideo3URl = "/images/video/mint-color-box3.m4v";

const UiConcept = ({ data }) => {
  const router = useRouter();
  const [randomColorPicker, setRandomColorPicker] = useState(randomColor());
  const [dataReceived, setData] = useState(data.documents);
  const [baseColor, setBaseColor] = useState();
  const [isLoadingAmount, setIsLoadingAmount] = useState(false);

  const [amountShowed, setAmountShowed] = useState(8);
  const [amountShowedList, setAmountShowedList] = useState(20);
  const [listView, setListView] = useState();
  const [selectedColor, setSelectedColor] = useState({
    color: "",
    name: "All",
  });

  // video
  const videoParentRef = useRef();

  const [shouldUseImage, setShouldUseImage] = useState(false);

  useEffect(() => {
    // check if user agent is safari and we have the ref to the container <div />
    if (isSafari() && videoParentRef.current) {
      // obtain reference to the video element
      const player = videoParentRef.current.children[0];

      // if the reference to video player has been obtained
      if (player) {
        // set the video attributes using javascript as per the
        // webkit Policy
        player.controls = false;
        player.playsinline = true;
        player.muted = true;
        player.setAttribute("muted", ""); // leave no stones unturned :)
        player.autoplay = true;

        // Let's wait for an event loop tick and be async.
        setTimeout(() => {
          // player.play() might return a promise but it's not guaranteed crossbrowser.
          const promise = player.play();
          // let's play safe to ensure that if we do have a promise
          if (promise.then) {
            promise
              .then(() => { })
              .catch(() => {
                // if promise fails, hide the video and fallback to <img> tag
                videoParentRef.current.style.display = "none";
                setShouldUseImage(true);
              });
          }
        }, 0);
      }
    }
  }, []);

  useEffect(() => {
    let theme = "false";
    // Access localStorage
    if (localStorage.getItem("view")) {
      theme = localStorage.getItem("view");
    }
    return theme === "true" ? setListView(true) : setListView(false);
  }, []);
  const handleViewList = () => {
    setListView(true);
  };
  const handleViewGrid = () => {
    setListView(false);
  };
  useEffect(() => {
    localStorage.setItem("view", listView);
  }, [listView]);

  useEffect(() => {
    if (isLoadingAmount) {
      setTimeout(() => {
        setAmountShowed((amountShowed) => amountShowed + 4);
        setIsLoadingAmount(false);
      }, 2000);
    }
    return () => { };
  }, [isLoadingAmount]);

  useEffect(() => {
    if (isLoadingAmount) {
      setTimeout(() => {
        setAmountShowedList((amountShowedList) => amountShowedList + 10);
        setIsLoadingAmount(false);
      }, 2000);
    }
    return () => { };
  }, [isLoadingAmount]);

  useEffect(() => {
    if (dataReceived) {
      let newData = [];
      // eslint-disable-next-line
      dataReceived.map((item) => {
        newData.push(item.base_color_name);
      });
      var uniq = [...new Set(newData)];
      setBaseColor(uniq);
    }
  }, [dataReceived]);

  // post data
  const finalData = data.documents.sort(function (a, b) {
    if (a.created_at.slice(0, 10) > b.created_at.slice(0, 10)) {
      return 1;
    }
    if (a.created_at.slice(0, 10) < b.created_at.slice(0, 10)) {
      return -1;
    }
    // a must be equal to b
    return 0;
  });

  const [Bulletin, setBulletin] = useState([]);
  useEffect(() => {
    if (finalData && Array.isArray(finalData) && finalData.length > 0) {
      const data = [];
      finalData.forEach((element) => {
        const { created_at } = element;
        const month = format(parseISO(created_at), "MMM");
        const monthNo = getMonth(new Date(created_at)) + 1;
        const index = data.findIndex((x) => {
          return x.month === month;
        });
        if (index > -1) {
          data[index].data = [...data[index].data, element];
        } else {
          data.push({
            month: month,
            monthNo,
            data: [element],
          });
        }
      });
      data.sort(sortMonth);
      setBulletin(data);
    }
    return () => { };
  }, []);

  const sortMonth = (a, b) => {
    return b.monthNo - a.monthNo;
  };

  const getBlogUrl = (created_at, slug) => {
    return `/${format(new Date(created_at), "yyyy/MM")}/${slug.current || slug
      }/`;
  };

  //dock

  const ref = useRef(null);
  const animation = useIntersection(ref, "50px");
  const animationSecond = useIntersection(ref, isMobile ? "-120px" : "-200px");

  const handleScrollToExploreSection = () => {
    ref.current.scrollIntoView({ behavior: "smooth" });
  };

  const dockItems = {
    mint: {
      appName: "Mint",
      icon: AiFillPlusCircle,
      path: "/choose",
    },
    // leaderboard: {
    //   appName: "Leaderboard",
    //   icon: MdLeaderboard,
    //   path: "/leaderboard",
    // },
    trade: {
      appName: "Trade",
      icon: SiEthereum,
      path: "/gallery/color-nft",
    },
    earn: {
      appName: "Earn",
      icon: MdAllInclusive,
      path: "/earn",
    },
    twitter: {
      appName: "Twitter",
      icon: BsTwitter,
      external: true,
      path: "https://twitter.com/colordotmuseum",
    },
    discord: {
      appName: "Discord",
      icon: BsDiscord,
      external: true,
      path: "https://discord.gg/colormuseum",
    },
  };

  const [scroll, setScroll] = useState(false);
  useEffect(() => {
    window.addEventListener("scroll", () => {
      setScroll(window.scrollY > 100);
    });
  }, []);

  const { toggle } = useSelector((state) => state.toggle);
  const dispatch = useDispatch();
  const mouseX = useMotionValue(null);
  const dockItemsKeys = Object.keys(dockItems);
  const wrapperRef = useRef(null);
  if (isMobile) {
    useOutsideAlerter(wrapperRef);
  }
  function useOutsideAlerter(ref) {
    useEffect(() => {
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          dispatch(Toggle());
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }

  const [sliderData, setSliderData] = useState();
  useEffect(() => {
    const asyncFunc = async () => {
      try {
        const response = await axios.get(`${BACKEND}/api/v1/image`);
        let finalArr = [];
        let i = 0,
          j = 0;
        while (i < 25) {
          if (Math.random() > 0.5) {
            finalArr.push(response.data.documents[j]);
            response.data.documents.splice(j, 1);
            i++;
            j--;
          }
          j++;
          if (j >= response.data.documents.length) j = 0;
        }
        setSliderData(finalArr);
      } catch (error) {
        console.log(error);
      }
    };
    asyncFunc();
  }, []);
  const amountofindex = (data) => {
    let arr = [];
    // eslint-disable-next-line
    if (data) {
      data.map((item, index) => {
        if (item !== undefined) {
          arr.push(index);
        }
      });
    }
    return arr.length - 1;
  };

  const [connectWallet, setConnectWallet] = useState(false);
  const { deactivate } = useWeb3React();
  const handleDisconnect = () => {
    localStorage.clear("connectedAddress");
    localStorage.clear("color_museum_wallet_type");
    localStorage.clear("color_museum_wallet_expiry");
    deactivate();
    dispatch(LocalStorage());
    dispatch(ConnectAddress(""));
    toast("Wallet Disconnected");
  };

  const { connectedAddress } = useSelector((state) => state.minting);

  return (
    <>
      {isLoadingAmount && (
        <div className={styles.fullPageLoader}>
          <Loader />
        </div>
      )}
      <div className={styles.positioningVideo}>
        <div className={styles.bgvideo}>
          {/* <ReactPlayer
            playing={true}
            muted={true}
            width="100%"
            height="100%"
            className={styles.bgvideo}
            url="/images/video/bg-uiConcept.mp4"
          /> */}
          {shouldUseImage ? (
            <img src={mainVideo} alt="Muted Video" />
          ) : (
            <div
              ref={videoParentRef}
              dangerouslySetInnerHTML={{
                __html: `<video
                        loop
                        muted
                        autoplay
                        playsinline 
                        src="${mainVideo}"
                        class="${styles.video}"
                      />,
                    `,
              }}
              className={styles.videoDiv}
            ></div>
          )}

          {/* <video autoplay="autoplay" muted loop="true" className={styles.video}>
            <source src={"/images/video/bg-uiConcept.mp4"} type="video/mp4" />
          </video> */}
        </div>
        <section className={styles.wrapper}>
          <div className={styles.bannerDiv}>
            <div className={styles.middleBlock}>
              <TopBlog />
            </div>
            <div className={styles.middleBlock}>
              <h1 className={styles.middleBlockHeader}>
                NEW NFT
                <br /> MARKET AND
                <br /> LAUNCHPAD
              </h1>
            </div>

            {/* <div className={styles.middleBlock}>
            <button className={styles.white_button}>mint tokens</button>
          </div> */}
          </div>
        </section>
        <div className={styles.containerBottom}>
          <div className={styles.flexDiv}>
            <div className={styles.leftBtn}>
              <div className={styles.IconList}>
                <div
                  className={styles.dockElement}
                  onMouseMove={(event) => mouseX.set(event.nativeEvent.x)}
                  onMouseLeave={() => mouseX.set(null)}
                >
                  {dockItemsKeys.map((dockTitle) => {
                    return [
                      <DockItem
                        key={dockTitle}
                        mouseX={mouseX}
                        {...dockItems[dockTitle]}
                      />,
                    ];
                  })}
                </div>
              </div>
            </div>
            <div className={styles.rightBtn}>
              {connectedAddress !== "" ? (
                <button
                  onClick={() => handleDisconnect()}
                  className={styles.green_button}
                >
                  Disconnect
                </button>
              ) : (
                <button
                  className={styles.green_button}
                  onClick={() => setConnectWallet(true)}
                >
                  Connect
                </button>
              )}
            </div>
          </div>
        </div>
        <section className={styles.wrapper}>
          <div className={styles.formDiv}>
            <div className={styles.formDivBlock}>
              <h1 className={styles.middleBlockHeader}>
                <span
                  className={styles.lightColor}
                  style={{
                    opacity: !animation ? "1" : "0.3",
                  }}
                >
                  BASED ON <br />
                  <span className={styles.animatedColorText}>COLOR</span>
                </span>
                <br />
                <span
                  className={styles.lightColor}
                  style={{
                    opacity: animationSecond ? "0.3" : animation ? "1" : "0.3",
                  }}
                >
                  COMMUNITY
                </span>
                <span
                  className={styles.lightColor}
                  style={{
                    opacity: animationSecond ? "1" : "0.3",
                  }}
                >
                  <br />
                  CAPITALISM
                </span>
              </h1>
            </div>
            {/* <form className={styles.joinForm}>
              <input placeholder="Enter your email" type="text" />
              <button type="submit" className={styles.formBtn}>
                JOIN 20.8K DROPLIST
              </button>
            </form> */}
            {/* <LogoSlicksilder /> */}
          </div>
          <div className={styles.colorBoxDiv} ref={ref}>
            <div className={styles.box}>
              <div
                className={styles.innerBox}
                style={{ background: randomColorPicker }}
              >
                <div className={styles.firstBox}>
                  <h2>Mint Colors</h2>
                  <p>
                    Choose your color with hexadecimal precision and then give
                    it a name to remember.
                  </p>
                </div>
                {!isMobile && (
                  <div
                    className={styles.boxVideo}
                    dangerouslySetInnerHTML={{
                      __html: `<video
                        loop
                        muted
                        autoplay
                        playsinline
                        // src="/images/video/mint-color-box1.m4v"
                        src="${boxVideo1URl}"
                        class="${styles.video}"
                      />,
                    `,
                    }}
                  />
                )}
                <div>
                  <button
                    className={styles.white_button}
                    onClick={() => router.push("/choose")}
                  >
                    Start minting
                  </button>
                </div>
              </div>
              <div
                className={styles.innerBox}
                style={{ background: randomColorPicker }}
              >
                <div className={styles.firstBox}>
                  <div style={{ display: "flex", alignItems: "flex-start" }}>
                    <h2>Trade NFTs</h2>
                    <button className={styles.buttonAlphaMobile} style={{ marginTop: '3px' }}>Alpha</button>
                  </div>
                  <p>
                    Exchange ERC-721 and ERC-1155 tokens, peer to peer with
                    onchain order security.
                  </p>
                </div>
                {!isMobile && (
                  <div
                    className={styles.boxVideo}
                    dangerouslySetInnerHTML={{
                      __html: `<video
                        loop
                        muted
                        autoplay
                        playsinline 
                        src="${boxVideo2URl}"
                        class="${styles.video}"
                      />,
                    `,
                    }}
                  />
                )}

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                    maxWidth: "100%",
                  }}
                >
                  <button
                    className={styles.white_button}
                    onClick={() => router.push("/gallery/color-nft")}
                  >
                    START TRADING
                  </button>
                  {/* <button className={styles.buttonAlpha}>Alpha</button> */}
                </div>
              </div>
              <div
                className={styles.innerBox}
                style={{ background: randomColorPicker }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "flex-start" }}>
                    <h2>Earn Yield</h2>
                    <button className={styles.buttonAlphaMobile} style={{ marginTop: '3px' }}>
                      Early Q3
                    </button>
                  </div>
                  <p>
                    Own a Color NFT and earn royalties from our 2.5% transaction
                    fee: based on color usage.
                  </p>
                </div>
                {!isMobile && (
                  <div
                    className={styles.boxVideo}
                    dangerouslySetInnerHTML={{
                      __html: `<video
                        loop
                        muted
                        autoplay
                        playsinline 
                        src="${boxVideo3URl}"
                        class="${styles.video}"
                      />,
                    `,
                    }}
                  />
                )}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                    maxWidth: "100%",
                  }}
                >
                  <button
                    className={styles.white_button}
                    onClick={() => router.push("/earn")}
                  >
                    Learn more
                  </button>
                  {/* <button className={styles.buttonAlpha}>Early Q3</button> */}
                </div>
              </div>
            </div>
          </div>
          <div className={styles.staticLogo}>
            <LogoSlicksilder />
          </div>
          {/* <div className={styles.explore_color}>
            <div className={styles.title}>
              <h1 className={styles.middleBlockHeader}>
                <BounceLoader size={25} color={"#00FF0A"} />
                LIVE MARKETS
              </h1>
            </div>
            <section
              className={`${stylesSix.imageContainer} ${stylesSimplified.container}`}
            >
              <article className={stylesSix.expand_wrapper}>
                <div
                  className={`${stylesSix.discount_container} ${stylesSimplified.discount_container}`}
                >
                  <div className={stylesSimplified.priceH2}>
                    <h2>
                      {" "}
                      <b>515</b> Colors
                    </h2>
                    <h2>
                      {" "}
                      <b>$380K</b> Volume
                    </h2>
                    <h2>
                      {" "}
                      <b>311</b> Collectors
                    </h2>
                    <h2>
                      <span style={{ color: "#0f6", fontFamily: "Plaid" }}>
                        0.4{" "}
                      </span>
                      ETH Floor
                    </h2>
                    <h3>
                      <img src={"/images/priceIsUpGreen.svg"} alt="" />
                      <span style={{ color: "#0f6" }}> +60% </span>
                      from base mint price.
                    </h3>
                  </div>
                  <div className={stylesSimplified.containerNFT}>
                    <h1 className={stylesSix.largeH1}>
                      Color NFT<p>COLLECTION</p>
                    </h1>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-around",
                        marginBottom: "12px",
                        marginLeft: "1rem",
                      }}
                    >
                      <Link href="/gallery" passHref>
                        <a className={styles.white_button}>EXPLORE</a>
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
              <article
                style={{ animationDuration: "55s" }}
                className={`${stylesSix.marqueeContainer} ${
                  sliderData && amountofindex(sliderData) > 20
                    ? stylesSix.moreThan20
                    : amountofindex(sliderData) > 30
                    ? stylesSix.moreThan30
                    : amountofindex(sliderData) > 40
                    ? stylesSix.moreThan40
                    : ""
                }`}
              >
                {sliderData &&
                  sliderData.map((item, index) => {
                    if (item === undefined || item.name === "Unnamed") {
                      return null;
                    }
                    return (
                      <DataResponse item={item} key={index} index={index} />
                    );
                  })}
              </article>
            </section>
          </div> */}
        </section>
      </div>
      <SlideConnectWallet
        connectWallet={connectWallet}
        setConnectWallet={setConnectWallet}
      />
    </>
  );
};

export default UiConcept;
