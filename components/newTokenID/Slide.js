import SlidingPane from "react-sliding-pane";
import "react-sliding-pane/dist/react-sliding-pane.css";
import { IoIosArrowBack } from "react-icons/hi";
import { IoCloseSharp } from "react-icons/io5";
import styles from "../../styles/modules/newTokenID/tokenID.module.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as EmailValidator from "email-validator";
import { customAlphabet } from "nanoid";
import { EmailForm, Individual } from "../../store/actions/emailFrom";
import { app, credentials } from "../../utils/realm-app.js";
import Web3 from "web3";
import { tokenABI } from "../../utils/ABIs/TokenABI";
import {
  ERC721OrderFeatureAddress,
  TokenAddressList,
} from "../../utils/constants";
import { SlideOff } from "../../store/actions/updateMint";
import {
  IoIosCheckmarkCircleOutline,
  IoIosCloseCircleOutline,
} from "react-icons/io";
import { BsArrowRight } from "react-icons/bs";
import { ConnectAddress } from "../../store/actions/toggle";
import { isMobile } from "react-device-detect";

const Slide = ({ name, number, token, color, baseColor }) => {
  const dispatch = useDispatch();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [tokenApproval, setTokenApproval] = useState("error");
  //
  //
  useEffect(() => {
    if (localStorage.getItem("isLoggedIn")) {
      setIsLoggedIn(
        localStorage.getItem("isLoggedIn") === "false" ? false : true
      );
    } else {
      localStorage.setItem("isLoggedIn", false);
    }
  }, []);

  // Connect Functionalities
  //

  const [emailValueMain, setEmailValueMain] = useState("");
  const [emailValueExpand, setEmailValueExpand] = useState("");
  const [isEmailError, setIsEmailError] = useState({
    email1: null,
    email2: null,
  });
  const [individualPageData, setIndividualPageData] = useState();

  const handleEmail = async (e) => {
    try {
      e.preventDefault();
      if (
        EmailValidator.validate(emailValueMain) ||
        EmailValidator.validate(emailValueExpand)
      ) {
        const hash = emailValueMain;
        // Nanoid
        const alphabet =
          "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        const emailNanoid = customAlphabet(alphabet, 21);
        const refCodeNanoid = customAlphabet(alphabet, 9);

        const time = new Date();
        const query = new URLSearchParams(window.location.search);
        const referredBy = query.get("referralCode")
          ? query.get("referralCode")
          : "";
        const utm_source = query.get("utm_source")
          ? query.get("utm_source")
          : undefined;
        const utm_medium = query.get("utm_medium")
          ? query.get("utm_medium")
          : undefined;
        const utm_campaign = query.get("utm_campaign")
          ? query.get("utm_campaign")
          : undefined;
        const utm_content = query.get("utm_content")
          ? query.get("utm_content")
          : undefined;
        const bodyObj = {
          email: emailValueMain ? emailValueMain : emailValueExpand,
          encryptedEmail: hash,
          emailVerificationCode: emailNanoid(),
          uniqueRefCode: refCodeNanoid(),
          time,
          referredBy,
          invitedReferrals: 0,
          utm_source,
          utm_medium,
          utm_campaign,
          utm_content,
        };
        dispatch(EmailForm(bodyObj));
        const user = await app.logIn(credentials);
        const response = await user.functions.add_email_function(bodyObj);
        if (response.error) {
          window.open("http://localhost:3000/referralError", "_ blank");
        } else {
          if (response.type === "notVerified") {
            // Go to prompt verification page
            setIndividualPageData({
              email: emailValueMain ? emailValueMain : emailValueExpand,
            });

            localStorage.setItem(
              "individualPageData",
              JSON.stringify({
                email: emailValueMain ? emailValueMain : emailValueExpand,
              })
            );
            dispatch(
              Individual({
                email: emailValueMain ? emailValueMain : emailValueExpand,
              })
            );
            window.open("http://localhost:3000/unverified", "_ blank");
          } else if (response.type === "insertNew") {
            setIndividualPageData({
              email: emailValueMain ? emailValueMain : emailValueExpand,
            });

            localStorage.setItem(
              "individualPageData",
              JSON.stringify({
                email: emailValueMain ? emailValueMain : emailValueExpand,
              })
            );
            dispatch(
              Individual({
                email: emailValueMain ? emailValueMain : emailValueExpand,
              })
            );
            window.open("http://localhost:3000/thankyou", "_ blank");
          } else if (response.type === "exists") {
            // Send to individualPage
            setIndividualPageData({
              email: response.document.email,
              rank: response.document.rank,
              total: response.totalDocs,
              invited: response.document.invitedReferrals,
              uniqueRefCode: response.document.uniqueRefCode,
            });
            localStorage.setItem(
              "individualPageData",
              JSON.stringify({
                email: response.document.email,
                rank: response.document.rank,
                total: response.totalDocs,
                invited: response.document.invitedReferrals,
                uniqueRefCode: response.document.uniqueRefCode,
              })
            );
            dispatch(
              Individual({
                email: response.document.email,
                rank: response.document.rank,
                total: response.totalDocs,
                invited: response.document.invitedReferrals,
                uniqueRefCode: response.document.uniqueRefCode,
              })
            );
            setIsLoggedIn(true);
            localStorage.setItem("isLoggedIn", true);
            window.open("http://localhost:3000/position", "_ blank");
          } else {
            window.open("http://localhost:3000/referralError", "_ blank");
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  //

  //
  const approveToken = async () => {
    var web3 = new Web3(window.ethereum);
    const tokenInstance = new web3.eth.Contract(tokenABI, TokenAddressList[0]);
    var approvedAmount = await tokenInstance.methods.allowance(
      connectedAddress,
      ERC721OrderFeatureAddress
    );
    let approve_amount =
      "115792089237316195423570985008687907853269984665640564039457584007913129639935"; //(2^256 - 1 )
    if (parseInt(approvedAmount) == 0) {
      console.log("You need to approve");
      try {
        await tokenInstance.methods
          .approve(ERC721OrderFeatureAddress, approve_amount)
          .send({
            from: connectedAddress,
          });
        console.log("Token is approved!");
        setTokenApproval("success");
        return true;
      } catch (e) {
        setTokenApproval("error");
        console.log("ERROR!", e);
        return false;
      }
    } else {
      setTokenApproval("success");

      console.log("Token is already approved!");
    }
  };

  const { slide } = useSelector((state) => state.updateMint);
  const { connectedAddress } = useSelector((state) => state.minting);
  const { web3 } = useSelector((state) => state.minting);
  const connectToMetaMask = async () => {
    console.log("I am in metamask!");
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      try {
        setOnConnect(true);
        try {
          await activate(injected);
          setOnConnect(false);
          setOnSuccess(true);
        } catch (e) {
          console.log(e);
        }
        const currentChainId = await web3.eth.getChainId();
        if (currentChainId != 1) {
          console.log(web3.eth.getChainId);
          console.log("You are not in correct chain!");
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0x1" }], // chainId must be in hexadecimal numbers
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
  return (
    <SlidingPane
      closeIcon={<IoIosArrowBack />}
      overlayClassName="some-custom-overlay-class"
      className={styles.slideContainer}
      isOpen={slide}
      title={
        !isLoggedIn ? (
          <div className={styles.purchaseTitle}>
            Get Started
            <IoCloseSharp
              size={30}
              onClick={() => {
                dispatch(SlideOff());
                setStage(1);
              }}
            />
          </div>
        ) : connectedAddress === "" ? (
          <div className={styles.purchaseTitle}>
            <div style={{ justifyContent: "flex-start" }}>
              <span
              // style={{ color: "rgba(0, 0, 0, 0.4)" }}
              >
                Connect Wallet&nbsp;&nbsp;
              </span>
              / Add Wallet
            </div>
            <IoCloseSharp
              size={30}
              onClick={() => {
                dispatch(SlideOff());
                setStage(1);
              }}
            />
          </div>
        ) : tokenApproval !== "done" ? (
          <div className={styles.purchaseTitle}>
            <div style={{ justifyContent: "flex-start" }}>
              <span
              // style={{ color: "rgba(0, 0, 0, 0.4)" }}
              >
                Connect Wallet&nbsp;&nbsp;
              </span>
              / Token Approval
            </div>
            <IoCloseSharp
              size={30}
              onClick={() => {
                dispatch(SlideOff());
                setStage(1);
              }}
            />
          </div>
        ) : (
          <div className={styles.purchaseTitle}>
            Buy It Now{" "}
            <IoCloseSharp
              size={30}
              onClick={() => {
                dispatch(SlideOff());
                setStage(1);
              }}
            />
          </div>
        )
      }
       width={isMobile ? "100%" : "30%"}
      onRequestClose={() => {
        isLoggedIn ? setIsLoggedIn(false) : dispatch(SlideOff());
      }}
    >
      {!isLoggedIn ? (
        <>
          <div>
            <h1
              className={styles.buyNowHeader}
              style={{ marginBottom: "26px" }}
            >
              Create account
            </h1>
            <p className={styles.fontFix}>
              By creating an account you will be able to get:
            </p>
            <ul>
              <li className={styles.fontFix}>
                Your own color.museum/username and profile for your NFT
                portfolio to accept bids as as collector or artist
              </li>
              <li className={styles.fontFix}>Order Notification</li>
              <li className={styles.fontFix}>
                Exclusive Color Museum droplist{" "}
              </li>
              <li className={styles.fontFix}>
                Roadmap updates for the Color Museum
              </li>
              <li className={styles.fontFix}>
                Offers for your existing NFTs from our 20.8K droplist
              </li>
              <li className={styles.fontFix}>
                Access to mint Color by importing your NFT portfolio
              </li>
              <li className={styles.fontFix}>
                Ability to post requests for NFTs that you want
              </li>
              <li className={styles.fontFix}>
                Invitations to exclusive auctions
              </li>
            </ul>
            <form
              className={styles.tokenIdForm}
              onSubmit={(e) => handleEmail(e)}
            >
              <label>Email Address</label>
              <input
                placeholder="Type your email"
                value={emailValueMain}
                onChange={(e) => {
                  setEmailValueMain(e.target.value);
                  if (EmailValidator.validate(e.target.value)) {
                    setIsEmailError({ ...isEmailError, email1: false });
                  } else {
                    setIsEmailError({ ...isEmailError, email1: true });
                  }
                }}
                type="email"
              />
            </form>
            <p className={styles.fontFix}>No password required.</p>
          </div>
          <div>
            <button
              className={styles.whiteButton}
              onClick={(e) => handleEmail(e)}
            >
              Proceed
            </button>
            <button
              className={styles.borderButton}
              onClick={() => setIsLoggedIn(true)}
            >
              Skip
            </button>
          </div>
        </>
      ) : connectedAddress === "" ? (
        <div>
          <h1 className={styles.buyNowHeader} style={{ marginTop: "26px" }}>
            Connect your wallet
          </h1>
          <button className={styles.connectButton} onClick={connectToMetaMask}>
            <img src={"/images/metamaskIcon.png"} alt="metamask" />
            <span>Connect Metamask</span>
          </button>
          <button
            className={styles.connectButton}
            // onClick={walletLinkConnector}
          >
            <img src={"/images/coinbaseWalletIcon.png"} alt="metamask" />
            <span>Connect Coinbase Wallet</span>
          </button>
        </div>
      ) : tokenApproval !== "done" ? (
        <>
          <div>
            <h1
              className={styles.buyNowHeader}
              style={{ marginBottom: "18px" }}
            >
              Token Approval
            </h1>
            <p className={styles.fontFixApproval}>
              This step is needed to verify that you have sufficient funds to be
              able to purchase the NFT.
            </p>
            <button
              className={styles.approveTokenButton}
              // onClick={() => approveToken(connectedAddress)}
              onClick={() => setTokenApproval("done")}
            >
              Approve WETH
            </button>
          </div>
          <div
            className={styles.panelModalStatus}
            style={{
              display:
                tokenApproval === "success"
                  ? "flex"
                  : tokenApproval == "error"
                  ? "block"
                  : "none",
            }}
          >
            {tokenApproval === "success" ? (
              <>
                <>Status: Approved</>
                <>
                  <IoIosCheckmarkCircleOutline />
                </>
              </>
            ) : tokenApproval == "error" ? (
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <>Status: Denied</>
                  <>
                    <IoIosCloseCircleOutline />
                  </>
                </div>
                <h3>
                  Seems like you don’t have sufficient funds for this
                  transaction, please add more funds and try again.
                </h3>
                <h2>
                  Get more funds at Coinbase <BsArrowRight />
                </h2>
              </>
            ) : (
              ""
            )}
          </div>
        </>
      ) : (
        <>
          <div className={styles.sideTopContent}>
            <h1 className={styles.buyNowHeader}>Buy It Now</h1>
            <h3 className={styles.panelHeader}>{name}</h3>
            <div className={styles.flexPanel}>
              <p>NFT No.</p>
              <p>{number}</p>
            </div>
            <div className={styles.flexPanel}>
              <p>Hex Value</p>
              <p>{color}</p>
            </div>
            <div className={styles.flexPanel}>
              <p>Token ID</p>
              <p>{token}</p>
            </div>
            <div className={styles.flexPanel}>
              <p>Collection</p>
              <p>{baseColor}</p>
            </div>
            <div className={styles.flexPanel}>
              <p>Owner</p>
              <p></p>
              <div style={{ display: "flex", alignItems: "center" }}>
                <img
                  src={"/images/Depredation.jpg"}
                  alt=""
                  className={styles.personImage}
                />
                <p>Jonh.eth</p>
              </div>
            </div>
            <div className={styles.linePanel} />
            <div className={styles.flexPanel}>
              <h3
                className={styles.panelHeader}
                style={{ fontWeight: "bolder", marginBottom: "0" }}
              >
                Price
              </h3>
              <h3
                className={styles.panelHeader}
                style={{ fontWeight: "bolder", marginBottom: "0" }}
              >
                1.5 ETH
              </h3>
            </div>
            <div className={styles.flexPanel}>
              <p>USD Value</p>
              <p>$4,583.40 USD</p>
            </div>
            <div className={styles.flexPanel}>
              <p>Fees</p>
              <p></p>
              <div style={{ display: "flex", alignItems: "center" }}>
                <p style={{ fontWeight: "400" }}>
                  <span style={{ fontWeight: "bolder" }}>10% </span>
                  (0.15 ETH)
                </p>
              </div>
            </div>
            <div className={styles.flexPanel}>
              <p>Price difference</p>
              <p></p>
              <div style={{ display: "flex", alignItems: "center" }}>
                <p style={{ fontWeight: "400" }}>
                  <span style={{ fontWeight: "bolder" }}>Up 50% </span>
                  (From previous price)
                </p>
              </div>
            </div>
            <div className={styles.linePanel} />
            <div className={styles.flexPanel}>
              <h1 className={styles.totalPanel}>Total</h1>
              <h1 className={styles.totalPanel}>1.65 ETH</h1>
            </div>
            <div className={styles.flexPanel}>
              <p>USD Value</p>
              <p>$4,800.00 USD</p>
            </div>
          </div>
          <div className={styles.sideBottomFixButton}>
            <button className={styles.whiteButton}>Buy It Now</button>
            <button className={styles.borderButton}>transaction funds</button>
          </div>
        </>
      )}
    </SlidingPane>
  );
};

export default Slide;
