import React from "react";
import TextLoop from "react-text-loop/lib/components/TextLoop";
import styles from "../../styles/modules/homepage/firstSection.module.css";

function ArtNftComponent() {
  return (
    <div className={styles.animate_text}>
      <TextLoop>
        <span className={`${styles.one_text} ${styles.text}`}>new art.</span>
        <span className={`${styles.second_text} ${styles.text}`}>
          the metaverse.
        </span>
        <span className={`${styles.three_text} ${styles.text}`}>
          the future.
        </span>
      </TextLoop>
    </div>
  );
}

export default ArtNftComponent;
