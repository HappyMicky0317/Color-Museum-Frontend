import React, { useEffect, useState } from "react";
import styles from "../../styles/modules/position/position.module.css";
import Loader from "../Loader/Loader";
import { app, credentials } from "../../utils/realm-app";

const Position = () => {
  let individualPageDataLS;
  useEffect(() => {
    if (localStorage.getItem("individualPageData")) {
      individualPageDataLS = true;
    }
  }, []);
  const [individualPageData, setIndividualPageData] = useState(
    individualPageDataLS
      ? JSON.parse(individualPageDataLS)
      : {
          email: "",
          rank: 404,
          total: 12503,
          invited: 108,
          uniqueRefCode: "",
        }
  );
  const [copyText, setCopyText] = useState("COPY LINK");
  const [isLoading, setIsLoading] = useState(true);

  const [apiData, setApiData] = useState({
    email:
      individualPageData && individualPageData.email
        ? individualPageData.email
        : "",
  });
  useEffect(() => {
    setIsLoading(true);
    const asyncFunc = async () => {
      try {
        const user = await app.logIn(credentials);
        const response = await user.functions.add_email_function({
          email: apiData.email,
        });
        setApiData({
          email: response.document.email,
          rank: response.document.rank,
          total: response.totalDocs,
          invited: response.document.invitedReferrals,
          uniqueRefCode: response.document.uniqueRefCode,
        });
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    };
    asyncFunc();
    //eslint-disable-next-line
  }, [individualPageData.email]);

  useEffect(() => {
    const asyncFunc = async (uniqueRefCode) => {
      try {
        const user = await app.logIn(credentials);
        const response = await user.functions.get_leaderboard_position({
          uniqueRefCode,
        });
        setApiData({
          email: response.document.email,
          rank: response.document.rank,
          total: response.totalDocs,
          invited: response.document.invitedReferrals,
          uniqueRefCode: response.document.uniqueRefCode,
        });
      } catch (error) {
        console.log(error);
      }
    };
    const query = new URLSearchParams(window.location.search);
    if (query.get("checkPosition") && query.get("checkPosition") !== "")
      asyncFunc(query.get("checkPosition"));
  }, []);

  const copyFunction = () => {
    let text = "";
    if (individualPageData && individualPageData.uniqueRefCode) {
      text = `https://color.museum/?referralCode=${individualPageData.uniqueRefCode}`;
    }
    navigator.clipboard.writeText(text).then(
      function () {
        setCopyText("COPIED");
        console.log(text);
      },
      function (err) {
        console.error("Async: Could not copy text: ", err);
      }
    );
  };

  useEffect(() => {
    setTimeout(() => {
      setCopyText("COPY LINK");
    }, 3000);
    return () => {};
  }, [copyText]);

  const moveToLeaderboard = () => {
    var win = window.open("/leaderboard", "_blank");
    win.focus();
  };
  return (
    <>
      <section className={styles.wrapper}>
        {!isLoading ? (
          <article className={styles.contentContainer}>
            <div className={styles.individual_wrapper}>
              <section className={styles.marginTB100}>
                <h6 className={styles.sec_title}>
                  {apiData && apiData.email ? apiData.email : ""}
                </h6>
                <div className={styles.individual_row}>
                  <div className={styles.individual_box}>
                    <div className={styles.content}>
                      <h4 className={styles.heading}>POSITION</h4>
                      <h3 className={styles.inner_header}>You are</h3>
                      <h2 className={styles.outOfValue}>
                        <b>
                          {" "}
                          {apiData && apiData.rank !== undefined
                            ? `#${apiData.rank}`
                            : ""}{" "}
                        </b>
                        out of <br />
                        <b>
                          {" "}
                          {apiData && apiData.total !== undefined
                            ? apiData.total
                            : ""}
                        </b>
                      </h2>
                      <p className={styles.des}>
                        people on the presale waitlist.
                      </p>
                    </div>
                  </div>
                  <div className={styles.individual_box}>
                    <div className={styles.content}>
                      <div className={styles.content}>
                        <h4 className={styles.heading}>INVITED</h4>
                        <h2 className={styles.outOfValue}>
                          {" "}
                          You have
                          <br /> invited
                          <b>
                            {apiData && apiData.invited !== undefined
                              ? apiData.invited
                              : ""}
                          </b>
                          people.
                        </h2>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  className={styles.colorChoose}
                  onClick={moveToLeaderboard}
                >
                  View leaderboard
                </button>
              </section>
              <section className={styles.marginTB100}>
                <h6 className={styles.sec_title}>
                  Share your unique link to move up the waitlist.
                </h6>
                <form
                  className={`${styles.emailContainer} ${styles.individual_email_wrapper}`}
                  // method='post'
                  // action='https://formspree.io/f/mwkaardj'
                >
                  <input
                    type="text"
                    placeholder={
                      apiData && apiData.uniqueRefCode
                        ? `https://color.museum/?referralCode=${apiData.uniqueRefCode}`
                        : "https://color.museum/"
                    }
                    name="_replyto"
                    id="text"
                    readOnly
                    value={
                      apiData && apiData.uniqueRefCode
                        ? `https://color.museum/?referralCode=${apiData.uniqueRefCode}`
                        : "https://color.museum/"
                    }
                    className={styles.email_input}
                  />
                  <button
                    className={styles.buttonEmailForm}
                    type="button"
                    onClick={copyFunction}
                  >
                    {copyText}
                  </button>
                </form>
              </section>
              <section className={styles.individual_work + styles.marginTB100}>
                <div className={styles.individual_work_box}>
                  <div className={styles.box_inner}>
                    <div className={styles.box_title}>
                      <h5>HOW THE PRESALE WORKS</h5>
                    </div>
                    <h2>Be early or spread the word.</h2>
                    <div className={styles.content}>
                      <p>
                        Invitations to mint Color NFTs during the presale period
                        will be <b>emailed</b> based on waitlist leaderboard
                        position.
                      </p>
                      <p>
                        <b>Example:</b> The 1st person on the waitlist will
                        receive the invitation to mint Color NFTs before the 2nd
                        person, and the 2nd person will receive it before the
                        3rd, and so on; until everyone on the presale waitlist
                        receives their invitation to mint.
                      </p>
                      <p>
                        Leaderboard position is calculated based on two factors:
                        the number of people you invited and the date you
                        registered for the waitlist; with the number of invited
                        people superseding date of registry.{" "}
                      </p>
                      <p>
                        <b>Example:</b> If there are 1,000 people on the
                        waitlist who didn't invite anyone, they will be ranked
                        based on the date and time they registered, with earlier
                        registrants ranking higher than later registrants.
                      </p>
                      <p>
                        However, if the 1001th person registers and invites 1
                        person, he or she will be #1 on the waitlist. This
                        strikes a balance between people being early to the
                        waitlist and not doing anything to grow the community,
                        versus people who join later and put in effort to spread
                        the word about the Color Museum.
                      </p>
                    </div>

                    <div className={styles.box_title}>
                      <h5>QUESTIONS?</h5>
                    </div>
                    <p>
                      Join our Discord or tweet<b> @colordotmuseum.</b>
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </article>
        ) : (
          <div className={styles.individualLoader}>
            <Loader />
          </div>
        )}
      </section>
    </>
  );
};

export default Position;
