import styles from "../../styles/modules/newTokenID/createAndLoginAccount.module.css";
import { IoIosArrowBack } from "react-icons/hi";
import { IoCloseSharp } from "react-icons/io5";
import SlidingPane from "react-sliding-pane";
import "react-sliding-pane/dist/react-sliding-pane.css";
import { useState } from "react";
import PuffLoader from "react-spinners/PuffLoader";
import { MdOutlineMailOutline } from "react-icons/md";
import Switch from "react-switch";
import OtpInput from "react-otp-input";
import { isMobile } from "react-device-detect";
import { LocalStorage } from "../../store/actions/toggle";

const SlideAddress = ({ slideAddress, setSlideAddress }) => {
  const [emailLoader, setEmailLoader] = useState(false);
  const [verification, setVerification] = useState(false);
  const handleEmail = (e) => {
    e.preventDefault();
    setEmailLoader(true);
    setTimeout(() => {
      setEmailLoader(false);
      setVerification(true);
    }, 3000);
  };
  const [stage, setStage] = useState(1);
  const [otpInput, setOtpInput] = useState({ otp: "" });
  const [switchList, setSwitchList] = useState({
    order: false,
    offer: false,
    exclusive: false,
    roadmap: false,
  });
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
  return (
    <SlidingPane
      closeIcon={<IoIosArrowBack />}
      className={styles.newSlideContainer}
      overlayClassName="some-custom-overlay-class"
      isOpen={slideAddress}
      title={
        <div className={styles.newPurchaseTitle}>
          <div style={{ justifyContent: "flex-start" }}>
            <span style={{ color: "rgba(255, 255, 255, 0.4)" }}>
              Connect Wallet&nbsp;&nbsp;
            </span>
            / Add Email Address
          </div>
          <IoCloseSharp
            size={30}
            onClick={() => {
              setSlideAddress(false);
              setStage(1);
            }}
          />
        </div>
      }
      width={isMobile ? "100%" : "30%"}
      onRequestClose={() => {
        setSlideAddress(false);
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
      ) : (
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
      )}

      {stage === 1 && (
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
      )}
      {/* <div className={styles.verificationContainer}>
        <MdOutlineMailOutline />
        <h4>Pending</h4>
        <div className={styles.verificationContainerLine} />
        <p>Check your email address for the verification link.</p>
        <h3>GO TO GMAIL</h3>
      </div>
      <div className={styles.emailLoaderContainer}>
        <PuffLoader size={32} />
        <h4>Pending</h4>
      </div> */}
    </SlidingPane>
  );
};

export default SlideAddress;
