import Image from "next/image";
import React from "react";
import styles from "../../styles/modules/homepage/fourthSection.module.css";
import secondStyles from "../../styles/modules/homepage/secondSection.module.css";
import thirdStyles from "../../styles/modules/homepage/thirdSection.module.css";

const FourthSection = () => {
  const transactionFeeData = [
    { color: "#E4E4A8", percentage: "65.47", price: "5,141.83" },
    { color: "#6C6F5F", percentage: "4.71", price: "370.10" },
    { color: "#F5979E", percentage: "5.12", price: "402.42" },
    { color: "#E3C8A1", percentage: "6.01", price: "471.99" },
    { color: "#FFFFFF", percentage: "5.77", price: "453.35" },
  ];
  return (
    <section className={secondStyles.container}>
      <div style={{ width: "90%", margin: "0 auto" }}>
        <div className={styles.colorTable_sec}>
          <div
            className={`${thirdStyles.grid_home_boredApe_container} ${thirdStyles.grid_right_left} ${thirdStyles.stakes_container}`}
          >
            <div className={styles.minHeigth}>
              <h1
                style={{
                  margin: "5rem 0px 1rem",
                  fontWeight: "400",
                }}
                className="plaidFont margin5remTop"
              >
                $7,853.21
              </h1>
              <h2
                className={styles.width60}
                style={{ margin: "0 0 1rem 0", fontWeight: "bold" }}
              >
                in transaction fees to split among Color NFT holders.
              </h2>
              <p>
                Here&apos;s an example of a transaction share split based on the
                current offer of 247.1 <b>ETH</b> for this ape.
              </p>
              {transactionFeeData.map((item, index) => {
                return (
                  <div className={styles.transaction_fee_grid} key={index}>
                    <div
                      className={styles.circle_transaction}
                      style={{ background: item.color }}
                    />
                    <p className={styles.transaction_fee_grid_content}>
                      {item.color}
                    </p>
                    <p
                      className={`${styles.transaction_fee_grid_content} ${styles.transaction_fee_grid_content_center}`}
                    >
                      {item.percentage}%
                    </p>
                    <p
                      className={`${styles.transaction_fee_grid_content} ${styles.transaction_fee_grid_content_right}`}
                    >
                      ${item.price}
                    </p>
                  </div>
                );
              })}
              <p>
                <b>32</b> other colors comprise the remaining <b>12.92</b>% of
                the <b>BAYC 9125</b> and would also be entitled to a share from
                the transaction fee pool in this illustrative example.
              </p>
            </div>
            <div className={`${styles.minHeigth} ${styles.royaltiesContainer}`}>
              <h1
                style={{
                  margin: "5rem 0px 1rem",
                  fontWeight: "400",
                }}
                className="plaidFont margin5remTop"
              >
                1.25%
              </h1>
              <h2 style={{ margin: "0 0 1rem 0", fontWeight: "bold" }}>
                is the transaction fee that our marketplace will charge to the
                buyer and the seller for completed trades.
              </h2>
              <p>
                This is in contrast to the 2.5% that OpenSea charges only to
                sellers.&nbsp;<b>Fair is fair.</b>
              </p>
              <p>
                <b>Note:</b> In the event an NFT uses a color that is not
                available in the Color NFT global palette, the minted colors
                nearest to the colors used in the NFT, as determined by
                Euclidean distance (x and y coordinates on the sRGB colorspace
                grid) will be rewarded the transaction fee share.
              </p>
              <div className={styles.sb_s_bottom_content}>
                <div className={styles.stake_image}>
                  <Image
                    src={"/images/stake-icon.svg"}
                    alt="stake icon"
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
                <div>
                  <h4 className={styles.left_sb_s_inner}>
                    Roadmap
                    <p className={styles.normal_right_sb_s_inner}>Q2 2022</p>
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FourthSection;
