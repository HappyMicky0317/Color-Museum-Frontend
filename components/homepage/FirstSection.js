import React, { useEffect, useState } from "react";
import styles from "../../styles/modules/homepage/firstSection.module.css";
import Link from "next/link";
import { isMobile } from "react-device-detect";
import ArtNftComponent from "./ArtNftComponent";
import { useForm } from "@formspree/react";
import * as EmailValidator from "email-validator";
import { FaYoutube } from "react-icons/fa";
import Marquee from "react-fast-marquee";
import { Logos } from "./logos";
import { app, credentials } from "../../utils/realm-app.js";
import NumberFormat from "react-number-format";
import Loader from "../../components/Loader/Loader";
import TopBlog from "./topBlog";
import { customAlphabet } from "nanoid";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { EmailForm, Individual } from "../../store/actions/emailFrom";

const FirstSection = () => {
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

  console.log(individualPageData);
  const handleWarning = () => {
    setEmailValue("");
  };
  const [state, handleSubmit] = useForm("mwkaardj");

  const handleEmailSubmit = async (e) => {
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
          encryptedEmail: hash,
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
      <section className={styles.wrapper}>
        {formLoading && (
          <div className={styles.fullPageLoader}>
            <Loader />
          </div>
        )}
        <article
          className={styles.container}
          style={{
            overflowX: "hidden",
            overflowY: "visible",
          }}
        >
          <div style={{ width: "90%", margin: "0 auto" }}>
            <video autoPlay loop muted playsInline className={styles.videoTag}>
              <source
                src={"/images/ethereum_first_video.mp4"}
                type="video/mp4"
              />
            </video>
            <div className={styles.contentContainer}>
              {isMobile ? (
                <Link href="/">
                  <a className={styles.earlyAccess}>Early Access</a>
                </Link>
              ) : null}
              <TopBlog />
              <h1>
                Own the building <br />
                blocks of <ArtNftComponent />
              </h1>
              <h2>
                <span>Behold the</span>
                Color NFT.
              </h2>
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

          <div className={styles.logo_slider}>
            <Marquee
              speed={140}
              gradient={false}
              pauseOnHover={true}
              className={styles.marquee_border}
            >
              {Logos.map((item, index) => {
                return (
                  <div key={index} className={styles.logo_item}>
                    <a href={item.redirect} target="_blank" rel="noreferrer">
                      <img src={item.src} alt={item.name} />
                    </a>
                  </div>
                );
              })}
            </Marquee>
          </div>
          <div style={{ width: "90%", margin: "0 auto", height: "100px" }}>
            <div className={styles.watch_livestrem_container}>
              <h3>
                There are&nbsp;
                {count ? (
                  <span>
                    <NumberFormat
                      thousandsGroupStyle="thousand"
                      thousandSeparator={true}
                      value={count}
                      displayType="text"
                    />
                  </span>
                ) : (
                  <Loader small />
                )}
                &nbsp;people on the presale waitlist from&nbsp;<span>102</span>
                &nbsp;countries.
              </h3>
              <a
                target="_blank"
                href="https://www.youtube.com/watch?v=oWIHAAatR4M"
                className={styles.youtube_container}
                rel="noreferrer"
              >
                <FaYoutube />
                <h3>watch livestream</h3>
              </a>
            </div>
          </div>
        </article>
      </section>
    </>
  );
};

export default FirstSection;
