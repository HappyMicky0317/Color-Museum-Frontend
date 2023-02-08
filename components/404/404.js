import React from "react";
import styles from "../../styles/modules/error/error.module.css";
import stylesButton from "../../styles/modules/nav.module.css";

const Error = () => {
  return (
    <article className={styles.container}>
      <div>
        <h1 className={styles.header}>404</h1>
        <p className={styles.desc}>
          The page you were looking for could not be found. It might have been
          removed, renamed, or did not exist in the first place.
        </p>
        <button className={stylesButton.walletContainer}>
          <div className={stylesButton.animatedButton}>Home Page</div>
        </button>
      </div>
    </article>
  );
};

export default Error;
