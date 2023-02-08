import styles from "../../styles/modules/newTokenID/createAndLoginAccount.module.css";
import { IoIosArrowBack } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";
import SlidingPane from "react-sliding-pane";
import "react-sliding-pane/dist/react-sliding-pane.css";
import { useEffect, useRef, useState } from "react";
import Switch from "react-switch";
import OtpInput from "react-otp-input";
import { useDispatch, useSelector } from "react-redux";
import { useWeb3React } from "@web3-react/core";
import Web3 from "web3";
import { isMobile } from "react-device-detect";
import {
  injected,
  walletLink,
  walletConnectConnector,
} from "../../utils/connector";
import { ConnectAddress, LocalStorage } from "../../store/actions/toggle";
import { BsCheck2 } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";
import moment from "moment";

const SliderNavigation = ({ openSlider, setOpenSlider }) => {
  const [stage, setStage] = useState(1);
  const [otpInput, setOtpInput] = useState({ otp: "" });
  const [switchList, setSwitchList] = useState({
    order: false,
    offer: false,
    exclusive: false,
    roadmap: false,
  });

  const dispatch = useDispatch();
  const [isMetamask, setIsMetamask] = useState(0);
  const { activate, account, deactivate } = useWeb3React();
  const [onConnect, setOnConnect] = useState(false);
  const [onSuccess, setOnSuccess] = useState(false);

  useEffect(() => {
    if (window.ethereum) setIsMetamask(1);
  }, []);
  const { logout } = useSelector((state) => state.toggle);
  // useEffect(() => {
  //   if (account && !logout) {
  //     dispatch(ConnectAddress(account));
  //   }
  // }, [account, logout]);

  useEffect(() => {
    if (onSuccess == true) {
      setTimeout(() => {
        setOnSuccess(false);
      }, 1000);
    }
  }, [onSuccess]);

  const connectToCoinbaseWallet = async () => {
    console.log("I am in coinbasewallet", isMobile);
    if (isMobile) {
      window.location.href = "https://go.cb-w.com/mtUDhEZPy1";
    } else {
      await activate(walletLink);
      try {
      } catch (error) {
        console.log(error);
      }
    }
  };

  const connectToMetaMask = async () => {
    console.log("I am in metamask!");
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      try {
        setOnConnect(true);
        var accounts;
        try {
          // accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          await activate(injected);
          setOnConnect(false);
          setOnSuccess(true);
        } catch (e) {
          console.log(e);
        }
        const currentChainId = await web3.eth.getChainId();
        if (currentChainId != 3) {
          console.log(web3.eth.getChainId);
          console.log("You are not in correct chain!");
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0x3" }], // chainId must be in hexadecimal numbers
          });
          setOnConnect(false);
          setOnSuccess(true);
          return false;
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      console.log("Please install metamask!");
      window.location.href = "https://metamask.io";
    }
  };

  const connectToWalletConnect = async () => {
    await activate(walletConnectConnector);
  };

  const { connectedAddress } = useSelector((state) => state.minting);
  useEffect(() => {
    if (localStorage.getItem("skipDate")) {
      let newDate = new Date();
      let date = newDate.getDate();
      let month = newDate.getMonth() + 1;
      let year = newDate.getFullYear();
      let hours = newDate.getHours();
      const nextDay = date + "/" + month + "/" + year + " " + hours;
      const day = localStorage.getItem("skipDate");
      let ms = moment(nextDay, "DD/MM/YYYY HH").diff(
        moment(day, "DD/MM/YYYY HH")
      );
      let d = moment.duration(ms);
      let diff = Math.floor(d.asHours()) + moment.utc(ms).format(" ");
      diff = Number(diff);
      if (diff < 24) {
        setStage(3);
      }
    }
  }, []);
  const handleSkip = () => {
    let newDate = new Date();
    let date = newDate.getDate();
    let month = newDate.getMonth() + 1;
    let year = newDate.getFullYear();
    let hours = newDate.getHours();
    const day = date + "/" + month + "/" + year + " " + hours;
    if (localStorage.getItem("skipDate")) {
      localStorage.clear("skipDate");
      localStorage.setItem("skipDate", day);
      dispatch(LocalStorage());
    } else {
      localStorage.setItem("skipDate", day);
      dispatch(LocalStorage());
    }
  };

  const [isVisible, setIsVisible] = useState(false);
  const notifButtonRef = useRef(null);

  useEffect(() => {
    if (openSlider) {
      setTimeout(() => {
        setIsVisible(true);
      }, 100);
    }
  }, [openSlider]);
  return (
    <SlidingPane
      closeIcon={<IoIosArrowBack />}
      className={styles.newSlideContainer}
      overlayClassName="some-custom-overlay-class"
      isOpen={openSlider}
      title={
        <div className={styles.newPurchaseTitle}>
          {stage === 1 ? (
            <span className={styles.headTitleText}>
              Create Account or Login
            </span>
          ) : stage === 3 ? (
            <span className={styles.headTitleText}>Connect Wallet</span>
          ) : (
            <span className={styles.headTitleText}>Testing Slide</span>
          )}
          <div style={{ display: "flex", alignItems: "center" }}>
            <IoCloseSharp
              size={30}
              onClick={() => {
                setOpenSlider(false);
              }}
            />
          </div>
        </div>
      }
      width={isMobile ? "100%" : "30%"}
      onRequestClose={() => {
        setOpenSlider(false);
      }}
    >
      {stage === 1 ? (
        <div className={styles.content}>
          <div className={styles.contentTitle}>
            <h1 className={styles.newDesignHeader}>CREATE ACCOUNT </h1>
            <span>OR LOGIN</span>
          </div>
          <form
            className={styles.newCreateLoginAccount}
            onSubmit={(e) => {
              e.preventDefault();
              setStage(2);
            }}
          >
            <label>Email Address:</label>
            <input
              placeholder="Enter your email to create an account or login"
              type="text"
            />
            <button type="submit" className={styles.newWhiteButton}>
              proceed
            </button>
          </form>
          <div className={styles.switchList}>
            <div className={styles.switchList}>
              <p className={styles.switchListTitle}>
                With an account, you get:
              </p>
              <div className={styles.switchItem}>
                <label htmlFor="small-radius-switch">
                  <Switch
                    checked={switchList.order}
                    onChange={() =>
                      setSwitchList({
                        ...switchList,
                        order: !switchList.order,
                      })
                    }
                    onColor="#000"
                    onHandleColor="#fff"
                    offColor="#fff"
                    offHandleColor="#000"
                    handleDiameter={20}
                    uncheckedIcon={false}
                    checkedIcon={false}
                    boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                    activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                    height={30}
                    width={58}
                    className={styles.react_witch}
                  />
                  <p>Order Notifications</p>
                </label>
              </div>
              <div className={styles.switchItem}>
                <label htmlFor="small-radius-switch">
                  <Switch
                    checked={switchList.offer}
                    onChange={() =>
                      setSwitchList({
                        ...switchList,
                        offer: !switchList.offer,
                      })
                    }
                    onColor="#000"
                    onHandleColor="#fff"
                    offColor="#fff"
                    offHandleColor="#000"
                    handleDiameter={20}
                    uncheckedIcon={false}
                    checkedIcon={false}
                    boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                    activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                    height={30}
                    width={58}
                    className={styles.react_witch}
                  />
                  <p>Offers For Your NFTs</p>
                </label>
              </div>
              <div className={styles.switchItem}>
                <label htmlFor="small-radius-switch">
                  <Switch
                    checked={switchList.exclusive}
                    onChange={() =>
                      setSwitchList({
                        ...switchList,
                        exclusive: !switchList.exclusive,
                      })
                    }
                    onColor="#000"
                    onHandleColor="#fff"
                    offColor="#fff"
                    offHandleColor="#000"
                    handleDiameter={20}
                    uncheckedIcon={false}
                    checkedIcon={false}
                    boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                    activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                    height={30}
                    width={58}
                    className={styles.react_witch}
                  />
                  <p>Exclusive Droplist</p>
                </label>
              </div>
              <div className={styles.switchItem}>
                <label htmlFor="small-radius-switch">
                  <Switch
                    checked={switchList.roadmap}
                    onChange={() =>
                      setSwitchList({
                        ...switchList,
                        roadmap: !switchList.roadmap,
                      })
                    }
                    onColor="#000"
                    onHandleColor="#fff"
                    offColor="#fff"
                    offHandleColor="#000"
                    handleDiameter={20}
                    uncheckedIcon={false}
                    checkedIcon={false}
                    boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                    activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                    height={30}
                    width={58}
                    className={styles.react_witch}
                  />
                  <p>Roadmap Updates</p>
                </label>
              </div>
            </div>
          </div>
        </div>
      ) : stage === 2 ? (
        <div className={styles.content}>
          <div className={styles.contentTitle} style={{ marginBottom: "25px" }}>
            <h1 className={styles.newDesignHeader}>ENTER PIN</h1>
            <span>TO LOGIN</span>
          </div>
          <form className={styles.otpForm} onSubmit={(e) => e.preventDefault()}>
            <p className={styles.formDesc}>
              A 4 digit PIN code has been sent
              <br /> to <b>theemailprovided@gmail.com</b>
            </p>
            <p className={styles.inputCodeTitle}>Input code below to login:</p>
            <OtpInput
              value={otpInput.otp}
              onChange={(otp) => setOtpInput({ otp: otp })}
              numInputs={4}
              className={styles.otpInput}
            />
            <div className={styles.otpButtonList}>
              <button
                type="submit"
                className={styles.newWhiteButton}
                style={{ width: "200px" }}
                onClick={() => setStage(4)}
              >
                AUTHENTICAte
              </button>
              <button type="submit" className={styles.newBorderButton}>
                resend pin
              </button>
            </div>
          </form>
        </div>
      ) : stage === 3 ? (
        <div className={styles.content}>
          <div className={styles.contentTitle}>
            <h1 className={styles.newDesignHeader}>CHOOSE WALLET </h1>
            <span>TO CONNECT</span>
          </div>
          <button
            className={styles.buttonWalletConnect}
            onClick={() => connectToMetaMask()}
          >
            <img src={"/images/metamask.png"} alt="" />
            {isMetamask == 1 ? (
              <span>metamask</span>
            ) : (
              <span>Install MetaMask</span>
            )}
            {/* <span>metamask</span> */}
          </button>
          <button
            className={styles.buttonWalletConnect}
            onClick={() => connectToCoinbaseWallet()}
          >
            <img src={"/images/coinbase.png"} alt="" />
            <span>COINBASE WALLET</span>
          </button>
          <button
            className={styles.buttonWalletConnect}
            onClick={() => connectToWalletConnect()}
          >
            <img src={"/images/coinbase.png"} alt="" />
            <span>WALLET CONNECT</span>
          </button>
        </div>
      ) : null}
      {stage === 1 ? (
        <div className={styles.leftSmallButton}>
          <button
            className={styles.newBorderButton}
            onClick={() => {
              setStage(3);
              handleSkip();
            }}
          >
            Skip
          </button>
        </div>
      ) : stage === 2 ? null : stage === 3 ? (
        <div>
          {connectedAddress ? (
            setStage(4)
          ) : (
            <button
              className={styles.newWhiteButton}
              onClick={() => {
                if (connectedAddress) {
                  setStage(4);
                }
                // setStage(4);
              }}
              style={{ width: "250px" }}
            >
              NEXT
            </button>
          )}
        </div>
      ) : stage === 10 ? (
        <div className={styles.emailLoaderContainer}>
          <BsCheck2 className={styles.approved} />
          <h4 style={{ color: "#00FF0A" }}>Transaction Successfull</h4>
        </div>
      ) : stage === 11 ? (
        <div className={styles.verificationContainer}>
          <IoMdClose style={{ color: "#FF4141", width: "18px" }} />
          <h4 style={{ color: "#FF4141" }}>Denied</h4>
          <div className={styles.verificationContainerLine} />
          <p style={{ width: "60%" }}>
            Seems like you don't have sufficient funds for this transaction,
            please add more funds and try again.
          </p>
          <h3>Get more funds at Coinbase </h3>
        </div>
      ) : null}
    </SlidingPane>
  );
};

export default SliderNavigation;
