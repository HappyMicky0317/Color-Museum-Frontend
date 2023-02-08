import styles from "../../styles/modules/newTokenID/createAndLoginAccount.module.css";
import { IoIosArrowBack } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";
import SlidingPane from "react-sliding-pane";
import "react-sliding-pane/dist/react-sliding-pane.css";
import { useState } from "react";
import Switch from "react-switch";
import OtpInput from "react-otp-input";
import { isMobile } from "react-device-detect";

const SlideCreateAndLoginAccount = ({
  createAndLoginAccount,
  setCreateAndLoginAccount,
}) => {
  const [stage, setStage] = useState(1);
  const [otpInput, setOtpInput] = useState({ otp: "" });
  const [switchList, setSwitchList] = useState({
    order: false,
    offer: false,
    exclusive: false,
    roadmap: false,
  });

  return (
    <SlidingPane
      closeIcon={<IoIosArrowBack />}
      className={styles.newSlideContainer}
      overlayClassName="some-custom-overlay-class"
      isOpen={createAndLoginAccount}
      title={
        <div className={styles.newPurchaseTitle}>
          {stage === 1 ? "Create Account or Login" : "Login"}
          <IoCloseSharp
            size={30}
            onClick={() => {
              setCreateAndLoginAccount(false);
              setStage(1);
            }}
          />
        </div>
      }
       width={isMobile ? "100%" : "30%"}
      onRequestClose={() => {
        setCreateAndLoginAccount(false);
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
            onSubmit={(e) => e.preventDefault()}
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
              >
                AUTHENTICAte
              </button>
              <button type="submit" className={styles.newBorderButton}>
                resend pin
              </button>
            </div>
          </form>
        </div>
      ) : (
        stage === 3 && (
          <div className={styles.content}>
            <div
              className={styles.contentTitle}
              style={{ marginBottom: "24px" }}
            >
              <h1 className={styles.newDesignHeader}>VERIFY EMAIL</h1>
              <span>TO CONTINUE</span>
            </div>
            <form
              className={styles.otpForm}
              onSubmit={(e) => e.preventDefault()}
            >
              <div className={styles.formDesc}>
                <p>
                  A verification link has been sent
                  <br /> to <b>theemailprovided@gmail.com</b>
                </p>
              </div>
              <div className={styles.otpButtonList}>
                <button
                  type="submit"
                  className={styles.newWhiteButton}
                  onClick={() => setCreateAndLoginAccount(false)}
                  style={{ width: "200px" }}
                >
                  GO TO GMAIL
                </button>
              </div>
            </form>
          </div>
        )
      )}
      {stage === 1 ? (
        <div className={styles.leftSmallButton}>
          <button
            className={styles.newBorderButton}
            onClick={() => setStage(2)}
          >
            Skip
          </button>
        </div>
      ) : stage === 2 ? (
        <div>
          <button
            className={styles.newWhiteButton}
            onClick={() => {
              setStage(3);
            }}
          >
            Skip
          </button>
        </div>
      ) : (
        stage === 3 && (
          <div>
            <button
              className={styles.newWhiteButton}
              onClick={() => setStage(1)}
              style={{ width: "250px" }}
            >
              Go To First step
            </button>
          </div>
        )
      )}
    </SlidingPane>
  );
};

export default SlideCreateAndLoginAccount;
