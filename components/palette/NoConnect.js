import Link from "next/link";
import React from "react";
import styles from "../../styles/modules/palette/palette.module.css";
import { FaQuestion } from "react-icons/fa";
import Connect from "../Mint/Connect";

const NoConnect = () => {
  return (
    <>
      <h1 className={styles.header}>Connect to Ethereum</h1>
      <p className={styles.desc}>
        View your Palette by connecting your Ethereum wallet.
      </p>
      <Connect />
      <h2 className={styles.noColors}>
        No Colors? <span>Mint some.</span>
      </h2>
      <div className={styles.buttonContainer}>
        <Link href="/choose" passHref>
          <a className={styles.buttonAnimated}>Mint</a>
        </Link>
      </div>
      <div className={styles.flex}>
        <FaQuestion className={styles.icon_question} />
        <p className={styles.descFlex}>
          Palettes are collections of Color NFTs owned by a specific Ethereum
          address.
        </p>
      </div>
    </>
  );
};

export default NoConnect;
