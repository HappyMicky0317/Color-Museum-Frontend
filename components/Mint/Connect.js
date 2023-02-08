import React, { useState } from "react";
import styles from "../../styles/modules/mint/mint.module.css";
import SlideConnectWallet from "../newTokenID/SlideConnectWallet";
import PuffLoader from "react-spinners/PuffLoader";

const Connect = ({ loader }) => {
  const [connectWallet, setConnectWallet] = useState(false);
  return (
    <>
      <button
        className={styles.walletContainer}
        onClick={() => setConnectWallet(true)}
      >
        {loader ? (
          <PuffLoader color="#000" size={25} />
        ) : (
          <h4>Connect Wallet</h4>
        )}
      </button>
      <SlideConnectWallet
        connectWallet={connectWallet}
        setConnectWallet={setConnectWallet}
      />
    </>
  );
};

export default Connect;
