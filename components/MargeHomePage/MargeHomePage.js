import React, { useEffect, useRef, useState } from "react";
import styles from "../../styles/modules/margehomepage/margeHomePage.module.css";
import stylesThird from "../../styles/modules/margehomepage/loadmore.module.css";
import ChooseBox from "../../styles/modules/margehomepage/collectionSingle.module.css";
import NumberFormat from "react-number-format";
import Views from "./Views";
import { useClickAway } from "react-use";
import { AiFillPlusCircle } from "react-icons/ai";
import { BiExpand } from "react-icons/bi";
import * as EmailValidator from "email-validator";
import Link from "next/link";
import LogoSlicksilder from "./LogoSlicksilder";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { useForm } from "@formspree/react";
import Loader from "../../components/Loader/Loader";
import { customAlphabet } from "nanoid";
import { EmailForm, Individual } from "../../store/actions/emailFrom";
import { app, credentials } from "../../utils/realm-app.js";

const MargeHomePage = ({ data }) => {
  const [open, setOpen] = useState(false);
  const [dataReceived, setData] = useState(data.documents);
  const [baseColor, setBaseColor] = useState();
  const [isLoadingAmount, setIsLoadingAmount] = useState(false);
  // const [isLoading, setIsLoading] = useState(false);
  const ref = useRef(null);
  useClickAway(ref, () => {
    setOpen(false);
  });

  const [selectedColor, setSelectedColor] = useState({
    color: "",
    name: "All",
  });
  const [amountShowed, setAmountShowed] = useState(2);
  const [listView, setListView] = useState();
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
        setIsLoadingAmount(false);
        setAmountShowed((amountShowed) => amountShowed + 2);
      }, 2000);
    }
    return () => {};
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

  // form
  const router = useRouter();
  const dispatch = useDispatch();

  const [emailValue, setEmailValue] = useState("");
  const [emailValueMain, setEmailValueMain] = useState("");
  const [emailValueExpand, setEmailValueExpand] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const [isEmailError, setIsEmailError] = useState({
    email1: null,
    email2: null,
  });

  const [individualPageData, setIndividualPageData] = useState();

  const handleWarning = () => {
    setEmailValue("");
  };
  const [state, handleSubmit] = useForm("mwkaardj");

  const handleEmailSubmit = async (e) => {
    debugger;
    if (buttonDisabled) return;
    try {
      e.preventDefault();
      setButtonDisabled(true);
      setTimeout(() => {
        setButtonDisabled(false);
      }, 5000);
      if (
        EmailValidator.validate(emailValueMain) ||
        EmailValidator.validate(emailValueExpand)
      ) {
        // // Encoding the email
        // const encode = new JSEncrypt();
        // const publicKey = encode.getPublicKey();
        // encode.setPublicKey(publicKey);
        // const hash = encode.encrypt(
        //   emailValueMain ? emailValueMain : emailValueExpand
        // );

        // Nanoid
        const alphabet =
          "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        const emailNanoid = customAlphabet(alphabet, 21);
        const refCodeNanoid = customAlphabet(alphabet, 9);

        // Getting Time
        const time = new Date();
        // Getting Referral code if present
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

        // For fingerprint.js
        // const botd = await fpPromise;
        // const fingerprintResult = await botd.get({ extendedResult: true });

        // Final obj sent to function
        const bodyObj = {
          email: emailValueMain ? emailValueMain : emailValueExpand,
          // encryptedEmail: hash,
          emailVerificationCode: emailNanoid(),
          uniqueRefCode: refCodeNanoid(),
          time,
          // flagged: fingerprintResult,
          referredBy,
          invitedReferrals: 0,
          utm_source,
          utm_medium,
          utm_campaign,
          utm_content,
          // country: fingerprintResult.ipLocation.country,
        };
        dispatch(EmailForm(bodyObj));
        const user = await app.logIn(credentials);
        const response = await user.functions.add_email_function(bodyObj);
        if (response.error) {
          // Error output to the user
          router.push("/referralError");
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
            router.push("/unverified");
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
            router.push("/thankyou");
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
            router.push("/position");
          } else {
            // Go to 'An Unexpected Error occured' Page
            router.push("/referralError");
          }
        }
      }
      setFormLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  //
  //
  const [count, setCount] = useState();
  useEffect(() => {
    const asyncFunc = async () => {
      try {
        const user = await app.logIn(credentials);
        const response = await user.functions.get_leaderboard({});
        setCount(response.count);
      } catch (error) {
        console.log(error);
      }
    };
    asyncFunc();
  }, []);

  return (
    <>
      <section className={styles.Wrapper}>
        {formLoading && (
          <div className={styles.fullPageLoader}>
            <Loader />
          </div>
        )}
        <div className={styles.InnerWrapper}>
          <div className={styles.HeaderContainer}>
            <div className={styles.leftText}>
              <h1 className={styles.header}>Color NFT by Color Museum </h1>
              <h4 className={styles.headerSmall}> COLLECTION</h4>
            </div>
            <div className={styles.rightText}>
              <h4 className={styles.headerSmall}>
                <NumberFormat
                  value={380865}
                  className="foo"
                  displayType={"text"}
                  thousandSeparator={true}
                  // prefix={'$'}
                  renderText={(value, props) => (
                    <b {...props}>
                      <span className={styles.doller}>$</span>
                      {value}{" "}
                    </b>
                  )}
                />
                Total Volume &nbsp;&nbsp; <b>{dataReceived.length} </b>Colors{" "}
                <b>309</b> Owners
              </h4>
            </div>
          </div>

          <Views
            listView={listView}
            baseColor={baseColor}
            selectedColor={selectedColor}
            dataReceived={dataReceived}
            amountShowed={amountShowed}
          />
          {/*  */}
          <div className={stylesThird.loadMoreContainer}>
            {listView && baseColor && baseColor.length > amountShowed && (
              <div
                onClick={() => {
                  setIsLoadingAmount(true);
                }}
              >
                <BiExpand />
                Load More
              </div>
            )}
            <Link href="/choose" passHref>
              <div>
                <AiFillPlusCircle />
                <strong>Mint</strong>&nbsp;a color
              </div>
            </Link>
          </div>
        </div>

        <div className={styles.recentMainDiv}>
          <div className={ChooseBox.colorBox}>
            <div className={ChooseBox.boxItem}>
              <Link href="/choose" passHref>
                <div className={ChooseBox.innerBoxItem}>
                  <div className={ChooseBox.bgColor}>
                    <video
                      autoplay="autoplay"
                      muted
                      loop="true"
                      className={ChooseBox.video}
                    >
                      <source src={"/images/video/Tt-1.m4v"} type="video/mp4" />
                    </video>
                  </div>
                  <div className={ChooseBox.footerPart}>Mint Colors</div>
                </div>
              </Link>
            </div>
          </div>
          <div className={styles.recentTrade}>
            <LogoSlicksilder />
            <article className={styles.secondContainer}>
              <div className={styles.flexSecondContainer}>
                <h1>Recent Trades</h1>
              </div>
              <div className={styles.CollectionTable}>
                <div className={styles.CollectionTableHead}>
                  <h5 className={styles.headBox}>COLOR</h5>
                  <h5 className={styles.headName}>NAME</h5>
                  <h5 className={styles.headCode}>HEXADECIMAL</h5>
                  <h5 className={styles.headLastPrice}>LAST PRICE</h5>
                  <h5 className={styles.headETH}>
                    <b>$ |</b>
                    <span> ETH </span>
                  </h5>
                  <h5 className={styles.headBuyer}>BUYER</h5>
                  <h5 className={styles.headSeller}>SELLER</h5>
                  <h5 className={styles.headDate}>DATE</h5>
                  <h5 className={styles.headTx}>TX</h5>
                </div>
                <div className={styles.CollectionTableBody}>
                  <div className={styles.colorBox}>
                    <div
                      className={styles.box}
                      style={{ background: "#BADA55" }}
                    ></div>
                  </div>
                  <div className={styles.colorName}>BADASS</div>
                  <div className={styles.colorCode}>#BADA55</div>
                  <div className={styles.colorLastPrice}>
                    <b>$682.23</b>
                  </div>
                  <div className={styles.colorETH}>
                    <img src={"/images/uparrow.png"} alt="Sold" />
                    +2.5%
                  </div>
                  <div className={styles.colorBuyer}>morgan.eth</div>
                  <div className={styles.colorSeller}>0x87aa...ba42</div>
                  <div className={styles.colorDate}>2.22.2022 12:12 GMT</div>
                  <div className={styles.colorTx}>
                    <img src={"/images/arrow.png"} alt="Sold" />
                  </div>
                </div>
                <div className={styles.CollectionTableBody}>
                  <div className={styles.colorBox}>
                    <div
                      className={styles.box}
                      style={{ background: "#20C0BC" }}
                    ></div>
                  </div>
                  <div className={styles.colorName}>
                    Mediterranean Turquoise
                  </div>
                  <div className={styles.colorCode}>#20C0BC</div>
                  <div className={styles.colorLastPrice}>
                    <b>$723.57</b>
                  </div>
                  <div className={styles.colorETH}>
                    <img src={"/images/uparrow.png"} alt="Sold" />
                    +2.5%
                  </div>
                  <div className={styles.colorBuyer}>morgan.eth</div>
                  <div className={styles.colorSeller}>0x87aa...ba42</div>
                  <div className={styles.colorDate}>2.22.2022 12:16 GMT</div>
                  <div className={styles.colorTx}>
                    <img src={"/images/arrow.png"} alt="Sold" />
                  </div>
                </div>
                <div className={styles.CollectionTableBody}>
                  <div className={styles.colorBox}>
                    <div
                      className={styles.box}
                      style={{ background: "#DE1DE9" }}
                    ></div>
                  </div>
                  <div className={styles.colorName}>Purple Nurple</div>
                  <div className={styles.colorCode}>#DE1DE9</div>
                  <div className={styles.colorLastPrice}>
                    <b>$1295.69</b>
                  </div>
                  <div className={styles.colorETH}>
                    <img src={"/images/uparrow.png"} alt="Sold" />
                    +2.5%
                  </div>
                  <div className={styles.colorBuyer}>morgan.eth</div>
                  <div className={styles.colorSeller}>0x87aa...ba42</div>
                  <div className={styles.colorDate}>2.22.2022 12:15 GMT</div>
                  <div className={styles.colorTx}>
                    <img src={"/images/arrow.png"} alt="Sold" />
                  </div>
                </div>
                <div className={styles.CollectionTableBody}>
                  <div className={styles.colorBox}>
                    <div
                      className={styles.box}
                      style={{ background: "#FAEBD7" }}
                    ></div>
                  </div>
                  <div className={styles.colorName}>milk tooth</div>
                  <div className={styles.colorCode}>#FEBD7</div>
                  <div className={styles.colorLastPrice}>
                    <b>$708.21</b>
                  </div>
                  <div className={styles.colorETH}>
                    <img src={"/images/uparrow.png"} alt="Sold" />
                    +2.5%
                  </div>
                  <div className={styles.colorBuyer}>morgan.eth</div>
                  <div className={styles.colorSeller}>0x87aa...ba42</div>
                  <div className={styles.colorDate}>2.22.2022 12:14 GMT</div>
                  <div className={styles.colorTx}>
                    <img src={"/images/arrow.png"} alt="Sold" />
                  </div>
                </div>
                <div className={styles.CollectionTableBody}>
                  <div className={styles.colorBox}>
                    <div
                      className={styles.box}
                      style={{ background: "#D20000" }}
                    ></div>
                  </div>
                  <div className={styles.colorName}>Kout Rogue</div>
                  <div className={styles.colorCode}>#D20000</div>
                  <div className={styles.colorLastPrice}>
                    <b>$1249.73</b>
                  </div>
                  <div className={styles.colorETH}>
                    <img src={"/images/uparrow.png"} alt="Sold" />
                    +2.5%
                  </div>
                  <div className={styles.colorBuyer}>morgan.eth</div>
                  <div className={styles.colorSeller}>0x87aa...ba42</div>
                  <div className={styles.colorDate}>2.22.2022 12:13 GMT</div>
                  <div className={styles.colorTx}>
                    <img src={"/images/arrow.png"} alt="Sold" />
                  </div>
                </div>
                <div className={styles.CollectionTableBody}>
                  <div className={styles.colorBox}>
                    <div
                      className={styles.box}
                      style={{ background: "#D20000" }}
                    ></div>
                  </div>
                  <div className={styles.colorName}>LUCID DREAM</div>
                  <div className={styles.colorCode}>#D20000</div>
                  <div className={styles.colorLastPrice}>
                    <b>$781.08</b>
                  </div>
                  <div className={styles.colorETH}>
                    <img src={"/images/uparrow.png"} alt="Sold" />
                    +2.5%
                  </div>
                  <div className={styles.colorBuyer}>morgan.eth</div>
                  <div className={styles.colorSeller}>0x87aa...ba42</div>
                  <div className={styles.colorDate}>2.22.2022 12:11 GMT</div>
                  <div className={styles.colorTx}>
                    <img src={"/images/arrow.png"} alt="Sold" />
                  </div>
                </div>
                <div className={styles.CollectionTableBody}>
                  <div className={styles.colorBox}>
                    <div
                      className={styles.box}
                      style={{ background: "#00FF00" }}
                    ></div>
                  </div>
                  <div className={styles.colorName}>RGB Green</div>
                  <div className={styles.colorCode}>#00FF00</div>
                  <div className={styles.colorLastPrice}>
                    <b>$777.92</b>
                  </div>
                  <div className={styles.colorETH}>
                    <img src={"/images/uparrow.png"} alt="Sold" />
                    +2.5%
                  </div>
                  <div className={styles.colorBuyer}>morgan.eth</div>
                  <div className={styles.colorSeller}>0x87aa...ba42</div>
                  <div className={styles.colorDate}>2.22.2022 12:10 GMT</div>
                  <div className={styles.colorTx}>
                    <img src={"/images/arrow.png"} alt="Sold" />
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
        <section className={styles.combineDiv}>
          {/* <ChooseBox /> */}
          <div className={styles.rightTextSection}>
            <h2 className={styles.header}>
              Ten thousand immutable colors, chosen by you.
            </h2>
            <p className={styles.desc}>
              Modern screens display tens of millions to billions of colors.
              From this pool the Color Museum website enables anyone to mint a
              Color NFT on the Ethereum Blockchain. The total number of possible
              Color NFTs are algorithmically limited to 10,000—making a Color
              NFT 1600X rarer than a Bitcoin.
            </p>
            <div className={styles.flex}>
              <div className={styles.div}>
                <h3 className={styles.timesHeader}>1600X</h3>
                <p className={styles.descTimes}>rarer than Bitcoin</p>
              </div>
              <div className={styles.div}>
                <h3 className={styles.timesHeader}>400X</h3>
                <p className={styles.descTimes}>rarer than ether</p>
              </div>
            </div>
            <div>
              <form
                className={`${styles.emailContainer} ${
                  isEmailError.email1 === true
                    ? styles.email_error
                    : isEmailError.email1 === false
                    ? styles.success_email
                    : ""
                }`}
                onSubmit={(e) => {
                  e.preventDefault();
                  handleEmailSubmit(e);
                  handleWarning();
                  setFormLoading(true);
                }}
              >
                <input
                  type="email"
                  placeholder="Enter your email"
                  name="_replyto"
                  id="email-main"
                  value={emailValueMain}
                  className={styles.email_input}
                  onChange={(e) => {
                    setEmailValueMain(e.target.value);
                    if (EmailValidator.validate(e.target.value)) {
                      setIsEmailError({ ...isEmailError, email1: false });
                    } else {
                      setIsEmailError({ ...isEmailError, email1: true });
                    }
                  }}
                  required
                />
                <button
                  type="submit"
                  className={styles.buttonEmailForm}
                  disabled={state.submitting}
                  onSubmit={handleEmailSubmit}
                >
                  JOIN PRESALE
                </button>
              </form>
              <div className={styles.after_button_content}>
                <div className={styles.option_flex}>
                  <b>Already on the waitlist? </b>
                  Enter your email above to check your position.
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>
    </>
  );
};

export default MargeHomePage;
