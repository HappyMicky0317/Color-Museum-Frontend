import React from "react";
import { isMobile } from "react-device-detect";
import { IoIosArrowBack } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import SlidingPane from "react-sliding-pane";
import "react-sliding-pane/dist/react-sliding-pane.css";
import { createClient } from "@supabase/supabase-js";
import {
  AddEmailOff,
  AddEmailOn,
  ConnectAddress,
  LogoutOn,
} from "../../store/actions/toggle";
import styles from "../../styles/modules/newTokenID/createAndLoginAccount.module.css";

const AddEmailToAccount = () => {
  const supaAPIUrl = "https://yrjjxjedmscqqzxoxgpk.supabase.co";
  const supaCanon =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlyamp4amVkbXNjcXF6eG94Z3BrIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTAzOTE0MzksImV4cCI6MTk2NTk2NzQzOX0.ooQ9TOcfYe_rbbVrD-L-uVrDaIaS70EGVPpWdlr3w7w";
  const supabase = createClient(supaAPIUrl, supaCanon);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { elements } = e.target;
    let email = elements.email.value;
    let connectedAddress = localStorage.getItem("userWalletAccountData");
    console.log(email);
    const { data, error } = await supabase
      .from("accounts")
      .update({ email: email })
      .contains("connectedAddress", [connectedAddress]);
    if (error) {
    } else {
      console.log("ok");
      localStorage.setItem("userData", JSON.stringify(data[0]));
      setAddEmail(false);
    }
  };
  const dispatch = useDispatch();
  const { addEmail } = useSelector((state) => state.toggle);
  const logout = () => {
    localStorage.removeItem("userData");
    localStorage.removeItem("account");
    dispatch(AddEmailOff());
    dispatch(ConnectAddress(""));
    localStorage.clear("connectedAddress");
    localStorage.clear("color_museum_wallet_type");
    localStorage.clear("color_museum_wallet_expiry");
    dispatch(LogoutOn());
  };

  return (
    <>
      <SlidingPane
        closeIcon={<IoIosArrowBack onClick={() => dispatch(AddEmailOff())} />}
        className={styles.newSlideContainer}
        isOpen={addEmail}
        title={
          <div className={styles.newPurchaseTitle}>
            Add Email
            <IoCloseSharp onClick={() => dispatch(AddEmailOff())} />
          </div>
        }
        width={isMobile ? "100%" : "30%"}
        onRequestClose={() => {
          dispatch(AddEmailOff());
        }}
      >
        <>
          <div className={styles.content}>
            <div className={styles.contentTitle}>
              <h1 className={styles.newDesignHeader}>ADD EMAIL ACCOUNT</h1>
            </div>
            <form
              className={styles.newCreateLoginAccount}
              onSubmit={handleSubmit}
            >
              <label>Email Address:</label>
              <input
                placeholder="Enter an email address"
                type="text"
                name="email"
              />
              <button type="submit" className={`${styles.newWhiteButton} `}>
                proceed
              </button>
            </form>
          </div>
          <div className={styles.leftSmallButton}>
            <button
              className={styles.newBorderButton}
              onClick={() => {
                logout();
              }}
            >
              Logout
            </button>
          </div>
        </>
      </SlidingPane>
    </>
  );
};

export default AddEmailToAccount;
