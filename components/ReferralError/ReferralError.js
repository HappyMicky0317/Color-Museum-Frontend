import React from "react";
import styles from "../../styles/modules/referralError/referralError.module.css";

const ReferralError = () => {
  return (
    <>
      <section className={styles.referralWrapper}>
        <article className={styles.contentContainer}>
          <div className={styles.referral_error_wrapper}>
            <div className={styles.box_inner}>
              <h5 className={styles.title}>MANUAL ENTRY REQUIRED.</h5>
              <h2>There was an error.</h2>
              <p>
                The connection timed out between our server and your device due
                to a third party, external error.{" "}
                <b>
                  To register for the waitlist, send an email at
                  hello@color.museum
                </b>
                and we will send you a verification email. Thank you. You can
                also try registering from another device.
              </p>
            </div>
          </div>
        </article>
      </section>
    </>
  );
};

export default ReferralError;
