import React, { useRef, useState } from "react";
import styles from "../../styles/modules/collection/collectionSingle.module.css";
import Link from "next/link";

const ChooseBox = () => {
  const mainHeight = useRef(null);
  const scrollDiv1 = useRef(null);
  const scrollDiv2 = useRef(null);
  const scrollDiv4 = useRef(null);

  const [isActive1, setIsActive1] = useState(true);
  const [isActive2, setIsActive2] = useState(true);
  const [isActive4, setIsActive4] = useState(true);

  return (
    <article className={styles.thirdContainer} ref={mainHeight}>
      <div className={styles.colorBox}>
        <div
          className={`${styles.boxItem} ${isActive1 ? styles.active : ""}`}
          ref={scrollDiv1}
        >
          <Link href="/choose" passHref>
            <div className={styles.innerBoxItem}>
              <div className={styles.bgColor}>
                <video
                  autoplay="autoplay"
                  muted
                  loop="true"
                  className={styles.video}
                >
                  <source src={"/images/video/Tt-1.m4v"} type="video/mp4" />
                </video>
              </div>
              <div className={styles.footerPart}>Mint Colors</div>
            </div>
          </Link>
        </div>
        <div
          className={`${styles.boxItem} ${isActive2 ? styles.active : ""}`}
          ref={scrollDiv2}
        >
          <Link href="/choose" passHref>
            <div className={styles.innerBoxItem}>
              <div className={styles.bgColor}></div>
              <div className={styles.footerPart}>Trade Colors</div>
            </div>
          </Link>
        </div>
        <div
          className={`${styles.boxItem} ${isActive4 ? styles.active : ""}`}
          ref={scrollDiv4}
        >
          <Link href="/choose" passHref>
            <div className={styles.innerBoxItem}>
              <div className={styles.bgColor}></div>
              <div className={styles.footerPart}>Earn Yield</div>
            </div>
          </Link>
        </div>
      </div>
    </article>
  );
};

export default ChooseBox;
