import styles from "../../styles/modules/thankyou/thankYou.module.css";

import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";


const ThankYou = () => {
  const wrapperRef = useRef(null);
  const [skipTheLine, setSkipTheLine] = useState(false);
  const [skipWaitList, setSkipWaitList] = useState();

  const {
    individualPage
  } = useSelector((state) => state.emailForm);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (query.get("skipTheLine") === "true") setSkipTheLine(true);
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "subscription_confirmed" });
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <div className={styles.thankWrapperMain} >
        <div className={styles.contentContainer} ref={wrapperRef}>
          <div className={`${styles.thankWrapper} ${styles.thankLeftZero}`}>
            <section className={styles.thankBox}>
              <div className={styles.boxInner}>
                <h5 className={styles.title}>THANK YOU.</h5>
                <h2>
                  {skipTheLine
                    ? "Your request to skip the line has been received."
                    : "Verify email to get mint access."}
                </h2>
                {skipTheLine ? (
                  <>
                    <p>
                      We will follow up with you at the provided email address.
                    </p>
                    <p style={{ fontWeight: 700 }}>{skipWaitList}.</p>
                  </>
                ) : (
                  <p>
                    A verification email has been sent
                    <br />
                    to{" "}
                    <b>
                      {individualPage && individualPage.email
                        ? individualPage.email
                        : "mrsatoshi@nakamoto.com"}
                    </b>
                    .
                  </p>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default ThankYou;