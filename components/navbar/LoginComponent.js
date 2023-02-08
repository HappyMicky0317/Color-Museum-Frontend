import styles from "../../styles/modules/newTokenID/createAndLoginAccount.module.css";
import { IoIosArrowBack } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";
import SlidingPane from "react-sliding-pane";
import "react-sliding-pane/dist/react-sliding-pane.css";
import { useState, useEffect, useRef } from "react";
import moment from "moment";
import { Magic } from "magic-sdk";
import { createClient } from "@supabase/supabase-js";
import { isMobile } from "react-device-detect";
import { useDispatch, useSelector } from "react-redux";
import {
  AddEmailOn,
  ConnectAddress,
  LocalStorage,
  LoginOff,
  LogoutOn,
} from "../../store/actions/toggle";
import PuffLoader from "react-spinners/PuffLoader";
import SlideConnectWallet from "../newTokenID/SlideConnectWallet";
import { useWeb3React } from "@web3-react/core";
import {
  KnockFeedProvider,
  NotificationIconButton,
  NotificationFeedPopover,
} from "@knocklabs/react-notification-feed";

// Required CSS import, unless you're overriding the styling
import "@knocklabs/react-notification-feed/dist/index.css";
import { Knock } from "@knocklabs/node";
const knockClient = new Knock(
  "sk_test_a-hDdEvgURNe2BIUC2ddoeBuq9NI6eyiINWDXx5DK0s"
);

const LoginComponent = ({ setAddEmail }) => {
  const [token, setToken] = useState(null);
  const [createAccountError, setCreateAccountError] = useState("");
  const supaAPIUrl = "https://yrjjxjedmscqqzxoxgpk.supabase.co";
  const supaCanon =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlyamp4amVkbXNjcXF6eG94Z3BrIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTAzOTE0MzksImV4cCI6MTk2NTk2NzQzOX0.ooQ9TOcfYe_rbbVrD-L-uVrDaIaS70EGVPpWdlr3w7w";
  const supabase = createClient(supaAPIUrl, supaCanon);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(false);

  const { connectedAddress } = useSelector((state) => state.minting);
  const { localStorageChange } = useSelector((state) => state.toggle);

  useEffect(() => {
    let userData = localStorage.getItem("userData");
    if (userData == undefined) {
      localStorage.removeItem("userData");
    }
    userData = localStorage.getItem("userData");
    if (userData) {
      userData = JSON.parse(userData);
      setUserData(userData);
      if (userData.id) {
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }
    }
  }, [localStorageChange]);

  const logout = () => {
    localStorage.removeItem("userData");
    localStorage.removeItem("account");
    setLoggedIn(false);
    dispatch(ConnectAddress(""));
    localStorage.clear("connectedAddress");
    localStorage.clear("color_museum_wallet_type");
    localStorage.clear("color_museum_wallet_expiry");
    dispatch(LogoutOn());
  };

  const getAccount = async (email) => {
    return await supabase
      .from("accounts")
      .select("*")

      // Filters
      .eq("email", email);
  };
  const [connectWallet, setConnectWallet] = useState(false);

  const checkConectedAddress = () => {
    if (connectedAddress) null;
    else setConnectWallet(true);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let connectedAddress = localStorage.getItem("account");
    console.log(connectedAddress);
    const { elements } = event.target;
    console.log(process.env.NEXT_PUBLIC_MAGIC_PUB_KEY);

    // the Magic code
    const did = await new Magic(
      "pk_live_7437D653549954B9"
    ).auth.loginWithMagicLink({ email: elements.email.value });

    if (did) {
      setToken(did);

      let { data: accounts, error } = await getAccount(elements.email.value);
      let insertObject = { email: elements.email.value };

      if (connectedAddress) {
        insertObject[connectedAddress] = [connectedAddress];
      }

      console.log(`Accounts`);
      console.log(accounts);

      if (accounts.length < 1) {
        const { data1, error1 } = await supabase
          .from("accounts")
          .insert([insertObject]);
        console.log(data1, error1);

        if (error1) {
          console.log(error1);
          setCreateAccountError("Something went wrong");
        } else {
          let { data: accounts, error } = await getAccount(
            elements.email.value
          );
          localStorage.setItem("userData", JSON.stringify(accounts[0]));

          dispatch(LoginOff());
        }
      } else {
        // update connected wallet address
        let updateAcount = false;
        if (connectedAddress) {
          updateAcount = true;
        }
        if (updateAcount) {
          let newAddresses = Array.from(
            new Set([...accounts[0].connectedAddress, connectedAddress])
          );
          const { data1, error1 } = await supabase
            .from("accounts")
            .update([{ connectedAddress: newAddresses }])
            .match({ email: elements.email.value });
          if (error1) {
            console.log(error1);
            setCreateAccountError("Something went wrong");
          } else {
            localStorage.setItem("userData", JSON.stringify(accounts[0]));
            checkConectedAddress();
            dispatch(LoginOff());
          }
        }
      }
    }
    setLoading(false);

    // Once we have the token from magic,
    // update our own database
    // const authRequest = await fetch()

    // if (authRequest.ok) {
    // We successfully logged in, our API
    // set authorization cookies and now we
    // can redirect to the dashboard!
    // router.push('/dashboard')
    // } else { /* handle errors */ }
  };
  //
  const dispatch = useDispatch();
  const { loginComponent } = useSelector((state) => state.toggle);

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
    dispatch(LocalStorage());
  };
  const [isVisible, setIsVisible] = useState(false);
  const notifButtonRef = useRef(null);
  // generate random string for using knock ID
  const makeid = (length) => {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  const random_id = makeid(30);
  useEffect(() => {
    const handle = async () => {
      await knockClient.users.identify(random_id, {
        name: random_id,
        // email: elements.email.value,
      });
    };
    handle();
  });
  return (
    <>
      <SlidingPane
        closeIcon={<IoIosArrowBack onClick={() => dispatch(LoginOff())} />}
        className={styles.newSlideContainer}
        isOpen={loginComponent}
        title={
          <div className={styles.newPurchaseTitle}>
            {loggedIn ? "Account" : "Login"}
            <span style={{ display: "flex", alignItems: "center" }}>
              <KnockFeedProvider
                apiKey={process.env.KNOCK_PUBLIC_API_KEY}
                feedId={process.env.KNOCK_FEED_ID}
                userId={random_id}
                // Optional in non production environments
                // userToken={currentUser.knockUserToken}
                // Optionally you can scope the feed in a particular manner
                // tenant={currentWorkspace.id}
                // Optionally you can stop the provider rendering any markup and use `KnockFeedContainer` to wrap components
                // rootless
              >
                <NotificationIconButton
                  ref={notifButtonRef}
                  onClick={(e) => setIsVisible(!isVisible)}
                />
                <NotificationFeedPopover
                  buttonRef={notifButtonRef}
                  isVisible={isVisible}
                  onClose={() => setIsVisible(false)}
                />
              </KnockFeedProvider>
              <IoCloseSharp onClick={() => dispatch(LoginOff())} />
            </span>
          </div>
        }
        width={isMobile ? "100%" : "30%"}
        onRequestClose={() => {
          dispatch(LoginOff());
        }}
      >
        {loggedIn ? (
          <>
            <div className={styles.content}>
              <h5 className={styles.newDesignHeader}>
                ACCOUNT {userData.email}
              </h5>
              {(userData.email === null || userData.email == "") && (
                <button
                  className={styles.newWhiteButton}
                  onClick={() => {
                    dispatch(AddEmailOn());
                    dispatch(LoginOff());
                  }}
                  style={{ marginTop: "1rem" }}
                >
                  ADD EMAIL
                </button>
              )}
            </div>
            <div className={styles.leftSmallButton} style={{ opacity: "1" }}>
              <button
                className={styles.newWhiteButton}
                onClick={logout}
                style={{ opacity: "1" }}
              >
                Logout
              </button>
            </div>
          </>
        ) : (
          <>
            <div className={styles.content}>
              <div className={styles.contentTitle}>
                <h1 className={styles.newDesignHeader}>CREATE ACCOUNT </h1>
                <span>OR LOGIN</span>
              </div>
              <form
                className={styles.newCreateLoginAccount}
                onSubmit={handleSubmit}
              >
                <label>Email Address:</label>
                <input
                  placeholder="Enter your email to create an account or login"
                  type="text"
                  name="email"
                />
                <button
                  type="submit"
                  className={`${styles.newWhiteButton} ${
                    loading && styles.loadButton
                  }`}
                >
                  {loading && (
                    <PuffLoader
                      className={styles.BtnPuffLoader}
                      color="#000"
                      size={30}
                    />
                  )}
                  proceed
                </button>
              </form>
            </div>
            <div className={styles.leftSmallButton}>
              <button
                className={styles.newBorderButton}
                onClick={() => {
                  dispatch(LoginOff());
                  handleSkip();
                  dispatch(LocalStorage());
                }}
              >
                Skip
              </button>
            </div>
          </>
        )}
      </SlidingPane>
      <SlideConnectWallet
        connectWallet={connectWallet}
        setConnectWallet={setConnectWallet}
      />
    </>
  );
};

export default LoginComponent;
