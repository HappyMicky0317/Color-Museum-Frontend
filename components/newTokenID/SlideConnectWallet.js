import styles from "../../styles/modules/newTokenID/createAndLoginAccount.module.css";
import stylesForBottomPart from "../../styles/modules/newTokenID/newTokenID.module.css";
import PuffLoader from "react-spinners/PuffLoader";
import { IoIosArrowBack } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";
import SlidingPane from "react-sliding-pane";
import "react-sliding-pane/dist/react-sliding-pane.css";
import Web3 from "web3";
import { useDispatch, useSelector } from "react-redux";
import {
  ConnectAddress,
  LocalStorage,
  Web3Provider,
} from "../../store/actions/toggle";
import React, { useState, useEffect } from "react";
import { isMobile } from "react-device-detect";
import { useWeb3React } from "@web3-react/core";
import {
  injected,
  walletLink,
  walletConnectConnector,
} from "../../utils/connector";
import { BsCheck2 } from "react-icons/bs";
import { createClient } from "@supabase/supabase-js";
import { REAL_MODE, WALLET_EXPIRY_TIME } from "../../utils/constants";
import toast from "react-hot-toast";
import stylesNav from "../../styles/modules/nav.module.css";

const SlideConnectWallet = ({ connectWallet, setConnectWallet }) => {
  const dispatch = useDispatch();
  const [isMetamask, setIsMetamask] = useState(0);
  const { activate, account, deactivate } = useWeb3React();
  const [onConnect, setOnConnect] = useState(false);
  const [onSuccess, setOnSuccess] = useState(false);
  const { library } = useWeb3React();
  const { connectedAddress } = useSelector((state) => state.minting);

  const supaAPIUrl = "https://yrjjxjedmscqqzxoxgpk.supabase.co";
  const supaCanon =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlyamp4amVkbXNjcXF6eG94Z3BrIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTAzOTE0MzksImV4cCI6MTk2NTk2NzQzOX0.ooQ9TOcfYe_rbbVrD-L-uVrDaIaS70EGVPpWdlr3w7w";
  const supabase = createClient(supaAPIUrl, supaCanon);

  useEffect(async () => {
    if (window.ethereum) setIsMetamask(1);
  }, []);
  const { logout } = useSelector((state) => state.toggle);
  useEffect(async () => {
    if (!account || !library) return false;

    var chainID = await library.eth.getChainId();
    console.log("await library.eth.getChainId()", chainID, REAL_MODE ? 1 : 3);
    if (!(chainID == (REAL_MODE ? 1 : 3))) {
      if (connectedAddress) {
        // toast.error("You changed the chain so we remove your wallet from our platform.");
        dispatch(ConnectAddress(""));
      }
      return false;
    }
    console.log("await library.eth.getChainId() passed");

    const utm_source = localStorage.getItem("utm_source");
    const utm_medium = localStorage.getItem("utm_medium");
    const utm_campaign = localStorage.getItem("utm_campaign");
    const utm_term = localStorage.getItem("utm_term");
    const utm_content = localStorage.getItem("utm_content");
    const utm_id = localStorage.getItem("utm_id");
    if (account !== undefined && !logout) {
      dispatch(ConnectAddress(account));
      let { data: accounts, error } = await supabase
        .from("accounts")
        .select("*")

        // Filters
        .cs("connectedAddress", [account]);

      if (accounts.length > 0) {
        localStorage.setItem("userData", JSON.stringify(accounts[0]));
        localStorage.setItem("userWalletAccountData", account);
        dispatch(LocalStorage());
      } else {
        let insertObject = {};
        insertObject["connectedAddress"] = [account];
        if (utm_medium !== "null" && utm_medium !== "undefined") {
          insertObject["utm_medium"] = utm_medium;
        }
        if (utm_campaign !== "null" && utm_campaign !== "undefined") {
          insertObject["utm_campaign"] = utm_campaign;
        }
        if (utm_term !== "null" && utm_term !== "undefined") {
          insertObject["utm_term"] = utm_term;
        }
        if (utm_source !== "null" && utm_source !== "undefined") {
          insertObject["utm_source"] = utm_source;
        }
        if (utm_content !== "null" && utm_content !== "undefined") {
          insertObject["utm_content"] = utm_content;
        }
        if (utm_id !== "null" && utm_id !== "undefined") {
          insertObject["utm_id"] = utm_id;
        }

        const { data1, error1 } = await supabase
          .from("accounts")
          .insert([insertObject]);

        if (error1) {
          console.log(error1);
        } else {
          localStorage.setItem("userWalletAccountData", account);

          localStorage.removeItem("userData");
        }
      }
    }
  }, [account, library, logout]);

  useEffect(() => {
    if (onSuccess == true) {
      setTimeout(() => {
        setOnSuccess(false);
      }, 5000);
    }
  }, [onSuccess]);

  useEffect(async () => {
    //when library(wallet) changes
    if (library) {
      console.log("Library changed!", account, library);
      if ((await library.eth.getChainId()) == (REAL_MODE ? 1 : 3)) {
        const WEB3 = new Web3(library.givenProvider);
        dispatch(Web3Provider(WEB3)); // set web3 with current library
      }
    }
  }, [library]);

  // Set wallet type and expiry time on local for use this on refresh0
  const setWalletInfoOnLocal = async (type) => {
    localStorage.setItem("color_museum_wallet_type", type); //  1 for metamask, 2 for coinbase, 3 for walletConnect
    localStorage.setItem(
      "color_museum_wallet_expiry",
      Math.floor(new Date().getTime() / 1000) + 60 * WALLET_EXPIRY_TIME
    );

    if (library && !((await library.eth.getChainId()) == (REAL_MODE ? 1 : 3))) {
      toast.error(
        `You are not in correct chain. Please change your chain to Number ${
          REAL_MODE ? 1 : 3
        }.`
      );
      return false;
    }
    toast((t) => (
      <div className={stylesNav.toastComman}>
        Wallet is connected
        <IoCloseSharp
          size={25}
          onClick={() => {
            toast.dismiss(t.id);
          }}
        />
      </div>
    ));
  };

  const connectToCoinbaseWallet = async () => {
    console.log("I am in coinbasewallet", isMobile);
    if (isMobile) {
      window.location.href = "https://go.cb-w.com/mtUDhEZPy1";
    } else {
      try {
        await activate(walletLink);
        setWalletInfoOnLocal(2);
        setConnectWallet(false);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const connectToMetaMask = async () => {
    console.log("I am in metamask!");
    if (window.ethereum) {
      try {
        setOnConnect(true);
        await activate(injected);
        setWalletInfoOnLocal(1);
        setOnConnect(false);
        setOnSuccess(true);
        // setConnectWallet(false);
        // setOnConnect(false);
        // setOnSuccess(true);

        // const currentChainId = await web3.eth.getChainId();
        // if (currentChainId != REAL_MODE ? 1 : 3) {
        //   console.log(web3.eth.getChainId);
        //   console.log("You are not in correct chain!");
        //   try {
        //     await window.ethereum.request({
        //       method: "wallet_switchEthereumChain",
        //       params: [{ chainId: REAL_MODE ? "0x1" : "0x3" }], // chainId must be in hexadecimal numbers
        //     });
        //     setOnConnect(false);
        //     setOnSuccess(true);
        //   } catch(e) {
        //     setOnConnect(false);
        //   }
        //   return false;
        // }
      } catch (error) {
        console.error(error);
      }
    } else {
      console.log("Please install metamask!");
      window.location.href = "https://metamask.io";
    }
  };

  const connectToWalletConnect = async () => {
    try {
      await activate(walletConnectConnector);
      setWalletInfoOnLocal(3);
      setConnectWallet(false);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <SlidingPane
      closeIcon={<IoIosArrowBack />}
      className={styles.newSlideContainer}
      isOpen={connectWallet}
      overlayClassName="some-custom-overlay-class"
      title={
        <div className={styles.newPurchaseTitle}>
          Connect Wallet
          <IoCloseSharp
            size={30}
            onClick={() => {
              setConnectWallet(false);
            }}
          />
        </div>
      }
      width={isMobile ? "100%" : "30%"}
      onRequestClose={() => {
        setConnectWallet(false);
      }}
    >
      <div className={styles.content}>
        <div className={styles.contentTitle}>
          <h1 className={styles.newDesignHeader}>CHOOSE WALLET </h1>
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
          <img src={"/images/walletConnectIcon.png"} alt="" />
          <span>WALLET CONNECT</span>
        </button>
      </div>
      {onConnect ? (
        <div className={stylesForBottomPart.emailLoaderContainer}>
          <PuffLoader size={32} />
          <h4>Pending</h4>
        </div>
      ) : onSuccess ? (
        <div className={styles.emailLoaderContainer}>
          <BsCheck2 className={styles.approved} />
          <h4 style={{ color: "#00FF0A" }}>Success!</h4>
        </div>
      ) : (
        ""
      )}
    </SlidingPane>
  );
};

export default SlideConnectWallet;
