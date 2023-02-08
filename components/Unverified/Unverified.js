import styles from "../../styles/modules/unverified/unverified.module.css";
import { app, credentials } from "../../utils/realm-app";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { WarningOn } from "../../store/actions/toggle";

// import TagManager from "react-gtm-module";

// TagManager.dataLayer({
//   dataLayer: {
//     event: "pageview",
//     pagePath: "/thankyou",
//     pageTitle: "ThankYou",
//     conversionId: "AW-307464140",
//     conversionLable: "yReICJP_k44DEMyPzpIB",
//   },
// });

const Unverified = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const { individualPage } = useSelector((state) => state.emailForm);
  const showWarning = async () => {
    debugger;
    const user = await app.logIn(credentials);
    await user.functions.add_email_function({
      email: individualPage
        ? individualPage.email
        : {
            email: "",
            rank: 404,
            total: 12503,
            invited: 108,
            uniqueRefCode: "",
          },
      type: "remail",
    });
    // dispatch(WarningOn(true));
    // setUnverifiedPage(true);
    // window.plausible("failedMint");
    router.push("/");
  };

  return (
    <>
      <section className={styles.unverifiedWrapperMain}>
        <div className={styles.Container}>
          <div className={styles.unverifiedWrapper}>
            <section className={styles.unverifiedBox}>
              <div className={styles.boxInner}>
                <h5 className={styles.title}>HOLD ON.</h5>
                <h2>You haven’t verified your email address yet.</h2>
                <p>
                  A verification email has been <br />
                  sent to{" "}
                  <b>
                    {individualPage && individualPage.email
                      ? individualPage.email
                      : "mrsatoshi@nakamoto.com"}
                    .
                  </b>
                </p>
              </div>
              <a className={styles.colorChooseA} onClick={showWarning}>
                Send again
              </a>
            </section>
          </div>
        </div>
      </section>
    </>
  );
};

export default Unverified;
