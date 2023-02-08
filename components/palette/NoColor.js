import Link from "next/link";
import React from "react";
import styles from "../../styles/modules/palette/palette.module.css";
import Disconnect from "../Mint/Disconnect";

const NoColor = ({ address }) => {
  return (
    <>
      <h1 className={styles.header}>No Colors found</h1>
      <div className={styles.flex}>
        <p className={styles.desc} style={{ fontSize: "20px", width: "auto" }}>
          The Ethereum address {address && address.slice(0, 10)} does not own
          any Color NFTs.
        </p>
        <Disconnect />
      </div>
      <h2 className={styles.noColors}>No Colors? Mint some.</h2>
      <div className={styles.buttonContainer}>
        <Link href="/choose" passHref>
          <a className={styles.buttonAnimated}>Mint</a>
        </Link>
      </div>
    </>
  );
};

export default NoColor;
