import React from "react";
import styles from "../../styles/modules/mint/mint.module.css";
import { useWeb3React } from "@web3-react/core";
import { useDispatch } from "react-redux";
import { ConnectAddress, LocalStorage } from "../../store/actions/toggle";

const Disconnect = () => {
  const { deactivate } = useWeb3React();
  const dispatch = useDispatch();

  return (
    <>
      <button
        className={styles.disconnectButton}
        onClick={() => {
          localStorage.clear("connectedAddress");
          deactivate();
          dispatch(LocalStorage());
          dispatch(ConnectAddress(""));
          localStorage.clear("connectedAddress");
          localStorage.clear("color_museum_wallet_type");
          localStorage.clear("color_museum_wallet_expiry");
        }}
      >
        Disconnect
      </button>
    </>
  );
};

export default Disconnect;
