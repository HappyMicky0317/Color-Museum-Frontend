import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import styles from "../../styles/modules/nav.module.css";
import Navigationbutton from "./navigationbutton";
import {
  ConnectAddress,
  LocalStorage,
  LoginOff,
  LoginOn,
  Toggle,
  WarningOff,
} from "../../store/actions/toggle";
import {
  MINT_LINK,
  MINT_STATUS,
  PROVIDER,
  REAL_MODE,
  WALLET_EXPIRY_TIME,
} from "../../utils/constants";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";
import ConnectPage from "../Connect/Connect";
import toast from "react-hot-toast";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { GrConnect } from "react-icons/gr";
import { IoCloseSharp } from "react-icons/io5";
import { useENSName } from "use-ens-name";
import SliderNavigation from "./SliderNavigation";
import SlideConnectWallet from "../newTokenID/SlideConnectWallet";
import { isMobile } from "react-device-detect";
import LoginComponent from "./LoginComponent";
import { RiWallet3Fill } from "react-icons/ri";
import {
  injected,
  walletLink,
  walletConnectConnector,
} from "../../utils/connector";
import AddEmailToAccount from "./AddEmailToAccount";

const Index = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { deactivate, account, activate } = useWeb3React();
  const { fullWidthPage, warning, logout } = useSelector(
    (state) => state.toggle
  );
  // useEffect(async () => {
  //   if (account !== undefined && !logout) {
  //     dispatch(ConnectAddress(account));
  //   }
  // }, [account, logout]);

  const [name, setName] = useState("/");

  const unverifiedPage = false;
  const { library } = useWeb3React();

  const {
    choosenColorFinal,
    choosenNameFinal,
    connectedAddress,
    choosenDescriptionFinal,
  } = useSelector((state) => state.minting);
  const { colorAlreadyMinted, violeted, isNameClean, nameUsed, subscribed } =
    useSelector((state) => state.warning);

  useEffect(async () => {
    if (window.location.pathname) {
      setName(window.location.pathname);
    } else setName("/");
  }, []);

  useEffect(async () => {
    console.log(
      "connectedAddress",
      connectedAddress,
      typeof connectedAddress,
      library
    );
    if (connectedAddress != "" || library != null) return;
    const wallet_type = localStorage.getItem("color_museum_wallet_type");
    const wallet_expiry = localStorage.getItem("color_museum_wallet_expiry");
    console.log("wallet_type", wallet_type, "wallet_expiry", wallet_expiry, Number(wallet_expiry) < Math.floor(new Date().getTime() / 1000));

    if (wallet_type == null) return;
    if (
      wallet_expiry == null ||
      Number(wallet_expiry) < Math.floor(new Date().getTime() / 1000)
    )
      return;

    switch (Number(wallet_type)) {
      case 1: // metamask
        connectToMetaMask();
        break;
      case 2: // coinbase
        connectToCoinbaseWallet();
        break;
      case 3: // walletConnect
        connectToWalletConnect();
        break;
    }
  });

  // Set wallet type and expiry time on local for use this on refresh
  const setWalletInfoOnLocal = (type) => {
    localStorage.setItem("color_museum_wallet_type", type); //  1 for metamask, 2 for coinbase, 3 for walletConnect
    localStorage.setItem(
      "color_museum_wallet_expiry",
      Math.floor(new Date().getTime() / 1000) + 60 * WALLET_EXPIRY_TIME
    );
  };

  const connectToCoinbaseWallet = async () => {
    console.log("I am in coinbasewallet", isMobile);
    if (isMobile) {
      window.location.href = "https://go.cb-w.com/mtUDhEZPy1";
    } else {
      try {
        await activate(walletLink);
        setWalletInfoOnLocal(2);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const connectToMetaMask = async () => {
    try {
      await activate(injected);
      setWalletInfoOnLocal(1);
    } catch (error) {
      console.error(error);
    }
  };

  const connectToWalletConnect = async () => {
    try {
      await activate(walletConnectConnector);
      setWalletInfoOnLocal(3);
    } catch (e) {
      console.log(e);
    }
  };
  /*
  useEffect(() => {
    if (localStorage.getItem("connectedAddress")) {
      let connected = localStorage.getItem("connectedAddress");
      connected = connected.slice(17, connected.length);
      dispatch(ConnectAddress(connected));
    }
  }, [localStorageChange]);
*/
  const [warningPlace, setWarningPlace] = useState(false);
  useEffect(() => {
    if (
      name === "/choose" ||
      name === "/name" ||
      name === "/describe" ||
      name === "/mint" ||
      name.slice(0, 7) === "/change" ||
      name.slice(0, 5) === "/mint"
    ) {
      setWarningPlace(true);
    } else {
      setWarningPlace(false);
    }
  }, [name]);

  const isDescriptionClean = false;
  //
  //
  const web3 = new Web3(new Web3.providers.HttpProvider(PROVIDER));
  const [balance, setBalance] = useState("");
  useEffect(() => {
    if (connectedAddress !== "") {
      web3.eth
        .getBalance(connectedAddress)
        .then((res) => setBalance(web3.utils.fromWei(res).slice(0, 4)));
    }
  }, [connectedAddress]);

  const showModal = () => {
    setModalShowFlag("block");
    document.body.style.overflow = "hidden";
    console.log("show Modal");
  };

  const hiddenModal = () => {
    // setModalShowFlag("none");
    // document.body.style.overflow = "scroll";
    // console.log("hide modal");
    // const ownWeb3 = new Web3(window.ethereum);
    // console.log(ownWeb3);
    // window.ethereum
    //   .request({ method: "eth_requestAccounts" })
    //   .then((accounts) => {
    //     if (accounts[0] != connectedAddress && connectedAddress != "") {
    //       dispatch(ConnectAddress(accounts[0]));
    //       localStorage.setItem(
    //         "connectedAddress",
    //         `connectedAddress:${accounts[0]}`
    //       );
    //     }
    //   });
  };

  const [modalShowFlag, setModalShowFlag] = useState("none");
  const [show, setShow] = useState(false);
  const [copyText, setCopyText] = useState(false);
  const [pending, setPending] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  const percentage = 66;

  const copyFunction = () => {
    setCopyText(true);
    setTimeout(() => {
      setCopyText(false);
    }, 3000);
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const utm_source = queryParams.get("utm_source");
    const utm_medium = queryParams.get("utm_medium");
    const utm_campaign = queryParams.get("utm_campaign");
    const utm_term = queryParams.get("utm_term");
    const utm_content = queryParams.get("utm_content");
    const utm_id = queryParams.get("utm_id");
    if (utm_source) {
      localStorage.setItem("utm_source", utm_source);
    }
    if (utm_medium) {
      localStorage.setItem("utm_medium", utm_medium);
    }
    if (utm_campaign) {
      localStorage.setItem("utm_campaign", utm_campaign);
    }
    if (utm_term) {
      localStorage.setItem("utm_term", utm_term);
    }
    if (utm_content) {
      localStorage.setItem("utm_content", utm_content);
    }
    if (utm_id) {
      localStorage.setItem("utm_id", utm_id);
    }

    let userData = localStorage.getItem("userData");
    if (userData == "undefined") {
      localStorage.removeItem("userData");
    }
    userData = localStorage.getItem("userData");
    if (userData) {
      userData = JSON.parse(userData);

      if (userData.id) {
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }
    }

    setShow(show);
  }, [show]);

  const closeHandler = (e) => {
    setShow(false);
  };
  const openHandler = (e) => {
    setShow(true);
  };
  //
  //
  const [ethValue, setEthValue] = useState(false);
  const [ensNameFinal, setEnsNameFinal] = useState("");

  useEffect(async () => {
    if (account) {
      let value = await web3.eth.getBalance(account);
      value = web3.utils.fromWei(value, "ether");
      setEthValue(value.slice(0, 4));
    }
  }, [account]);

  const ens = useENSName(connectedAddress);
  useEffect(() => {
    if (ens !== null) {
      setEnsNameFinal(ens);
    }
  }, [ens]);

  //
  //
  const [openSlider, setOpenSlider] = useState(false);

  const [connectWallet, setConnectWallet] = useState(false);
  useEffect(() => {
    console.log("warning", warning);
  }, [warning]);
  const { toggle } = useSelector((state) => state.toggle);

  const [flegValue, setFlegValue] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (toggle && e.keyCode === 27) {
        dispatch(Toggle());
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => removeEventListener("keydown", handleKeyDown);
  }, [toggle]);

  const [addEmail, setAddEmail] = useState(false);
  const { localStorageChange } = useSelector((state) => state.toggle);
  const [isSkipped, setIsSkipped] = useState(false);
  useEffect(() => {
    if (localStorage.getItem("skipDate") && isMobile) setIsSkipped(true);
  }, [localStorageChange]);
  return (
    <>
      <div
        style={{
          visibility: show ? "visible" : "hidden",
          opacity: show ? "1" : "0",
          display: show ? "flex" : "none",
        }}
        className={styles.overlay}
        onKeyDown={(e) => console.log(e.key)}
      >
        <div className={styles.popup}>
          <div className={styles.popup_account_div}>
            <h2>accounts</h2>
            <span className={styles.close} onClick={closeHandler}>
              &times;
            </span>
          </div>
          <div className={styles.popup_button}>
            <div className={styles.popup_change}>
              <spna>Connected with MetaMask</spna>
              <button className={styles.popup_change_btn}>change</button>
            </div>
            <button className={styles.connectButton} onClick={openHandler}>
              {connectedAddress.substring(0, 6)}...
              {connectedAddress.substring(connectedAddress.length - 6)}
              <div className={styles.greenConnected} />
            </button>

            <div className={styles.popup_link}>
              <CopyToClipboard
                text={connectedAddress}
                className={styles.popup_copy_id}
                onCopy={copyFunction}
              >
                <span>{copyText ? "Copied!" : "Copy Address"}</span>
              </CopyToClipboard>
              <a href={""} target="_blank">
                View on Explorer
              </a>
            </div>
          </div>

          <div className={styles.popup_footer}>
            Your transactions will appear here...
          </div>
        </div>
      </div>
      <div className={styles.modal} style={{ display: modalShowFlag }}>
        <div className={styles.modal_main}>
          <ConnectPage hideModal={() => hiddenModal()} />
        </div>
      </div>
      {/* {warningPlace && (
        <a
          href={MINT_LINK}
          target="_blank"
          style={{ textDecoration: "none" }}
          rel="noreferrer"
        >
          <div className={styles.mint_warn} style={{ zIndex: "10" }}>
            <div className={styles.mint_content}>
              <div className={styles.mint}>
                <h1>{MINT_STATUS}</h1>
                <p>
                  For your safety, make sure you are on{" "}
                  <b>https://color.museum</b> and that to complete mint
                  transactions you transfer Ether only to <b>0xcf12</b>....
                  <b>BAADF</b>
                </p>
                <h3>INFO</h3>
              </div>
            </div>
          </div>
        </a>
      )} */}
      <nav
        className={`${
          fullWidthPage ? styles.nav_container : styles.nav_container
        }`}
        style={{ zIndex: "20" }}
      >
        <div className={styles.nav_wrapper}>
          <div className={styles.nav_inner_wrapper}>
            <Link href="/" className={styles.logo_container} passHref>
              <div className={styles.logo}>
                <Image
                  src={"/images/logo.png"}
                  alt="logo"
                  layout="fill"
                  objectFit="contain"
                />
              </div>
            </Link>
            <div className={styles.flex} style={{ marginLeft: "20px" }}>
              <Navigationbutton />
            </div>
            {/* </>
            )} */}
          </div>

          {router.pathname === "/gallery/color-nft/[token]" && isMobile && (
            <div
              className={`${styles.buyButton} ${styles.mobileIcon}`}
              onClick={() => setConnectWallet(true)}
            >
              <GrConnect color="#fff" />
            </div>
          )}

          <div className={styles.connectedAddress}>
            <div className={styles.connected_content}>
              {connectedAddress !== "" ? (
                <>
                  {isMobile ? (
                    <div className={styles.flexConnected}>
                      <RiWallet3Fill
                        size="20px"
                        className={styles.wallet}
                        onClick={(toggled) => {
                          if (loggedIn && !connectedAddress) {
                            setConnectWallet(true);
                          } else if (toggled) {
                            dispatch(LoginOn());
                          } else {
                            dispatch(LoginOff());
                          }
                        }}
                      />
                    </div>
                  ) : (
                    <div className={styles.flexConnected}>
                      <div className={styles.userInfo}>
                        <div className={styles.square0x}>0x</div>
                        <span className={styles.greenCircle} />
                        <h5>
                          {ensNameFinal !== ""
                            ? ensNameFinal
                            : `${connectedAddress.substring(0, 6)}
                      ...
                      ${connectedAddress.substring(
                        connectedAddress.length - 6
                      )}`}
                        </h5>
                        <h3>
                          {ethValue !== null || ethValue !== "" ? ethValue : 0}{" "}
                          ETH
                        </h3>
                      </div>
                      <div className={styles.dotContainer}>
                        <div
                          style={{
                            padding: "5px",
                            width: "30px",
                            height: "30px",
                          }}
                        >
                          <RiWallet3Fill
                            size="20px"
                            className={styles.wallet}
                            onClick={(toggled) => {
                              if (loggedIn && !connectedAddress) {
                                setConnectWallet(true);
                              } else if (toggled) {
                                dispatch(LoginOn());
                              } else {
                                dispatch(LoginOff());
                              }
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <>
                    <button
                      className={styles.buyButton}
                      onClick={() => setConnectWallet(true)}
                    >
                      Connect
                    </button>
                    <div
                      style={{
                        marginLeft: "25px",
                        width: "25px",
                        height: "25px",
                      }}
                    >
                      <RiWallet3Fill
                        size="25px"
                        className={styles.wallet}
                        onClick={(toggled) => {
                          console.log(isSkipped);
                          if ((loggedIn && !connectedAddress) || isSkipped) {
                            setConnectWallet(true);
                          } else if (toggled) {
                            dispatch(LoginOn());
                          } else {
                            dispatch(LoginOff());
                          }
                        }}
                      />
                    </div>
                  </>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
      <div className={styles.firstSideline} />
      <div className={styles.secondSideline} />
      <SliderNavigation openSlider={openSlider} setOpenSlider={setOpenSlider} />
      <SlideConnectWallet
        connectWallet={connectWallet}
        setConnectWallet={setConnectWallet}
      />
      <LoginComponent setAddEmail={setAddEmail} />
      <AddEmailToAccount setAddEmail={setAddEmail} addEmail={addEmail} />
    </>
  );
};

export default Index;
