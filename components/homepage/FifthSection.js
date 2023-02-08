import React from "react";
import secondStyles from "../../styles/modules/homepage/secondSection.module.css";
import thirdStyles from "../../styles/modules/homepage/fourthSection.module.css";
import styles from "../../styles/modules/homepage/fifthSection.module.css";

const FifthSection = () => {
  return (
    <section className={secondStyles.container}>
      <div className={styles.launch_pad}>
        <div className={styles.options_wrapper}>
          <h2 className={styles.launching_text}>We are also launching a</h2>
          <h1>LAUNCH PAD.</h1>
          <p className={styles.custom_width1}>
            The Color Museum team plans to partner with new and established
            brands and creators to release derivative NFTs that use the ten
            thousand minted colors in composition.
          </p>
          <div className={`${styles.new} ${styles.one}`}>
            <p>NEW</p>
            <h2>Profile photo collections.</h2>
          </div>
          <div className={`${styles.new} ${styles.two}`}>
            <p> NEW</p>
            <h2>Physical + metaverse merchandise and items.</h2>
          </div>
          <div className={`${styles.new} ${styles.three}`}>
            <p>NEW</p>
            <h2>Artist collections + 1 of 1s.</h2>
          </div>

          <div className={styles.changeOrder}>
            <div
              className={`${thirdStyles.sb_s_bottom_content} ${styles.order1}`}
            >
              <img
                className={thirdStyles.stake_image}
                src={"/images/stake-icon.svg"}
                alt="stake icon"
              />
              <div className={thirdStyles.sb_s_bottom_inner}>
                <h4 className={thirdStyles.left_sb_s_inner}>
                  Roadmap
                  <p className={thirdStyles.normal_right_sb_s_inner}>Q1 2022</p>
                </h4>
              </div>
            </div>

            {/* <p className={`${styles.custom_width2} ${styles.order2}`}>
              <b>Note:</b> Royalty sharing for Color NFT holders will be paid on
              both the initial mint of derivative NFTs, and from transaction
              fees from trades on our marketplace.
            </p> */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FifthSection;
