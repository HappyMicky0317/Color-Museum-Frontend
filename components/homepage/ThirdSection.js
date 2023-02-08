import React from "react";
import styles from "../../styles/modules/homepage/thirdSection.module.css";
import secondStyles from "../../styles/modules/homepage/secondSection.module.css";
import Chart from "./Chart";
import Image from "next/image";

const ThirdSection = () => {
  return (
    <>
      <section className={secondStyles.container}>
        <article style={{ width: "90%", margin: "0 auto" }}>
          <div
            className={`${secondStyles.options_wrapper} ${styles.stakes_container} ${styles.highlight_text}`}
            data-aos="fade-up"
          >
            <h1>Earn royalties from your colors.</h1>
            <svg
              xmlns="//www.w3.org/2000/svg"
              version="1.1"
              className="svg-filters"
              style={{ display: "none" }}
            >
              <defs>
                <filter id="marker_shape">
                  <feTurbulence
                    type="fractalNoise"
                    baseFrequency="0 0.15"
                    numOctaves="1"
                    result="warp"
                  />
                  <feDisplacementMap
                    xChannelSelector="R"
                    yChannelSelector="G"
                    scale="30"
                    in="SourceGraphic"
                    in2="warp"
                  />
                </filter>
              </defs>
            </svg>
            <p style={{ margin: "1rem 0" }}>
              We are&nbsp;
              <span className="highlightedText">
                building an OpenSea competitor
              </span>
              &nbsp;in which
              <span className="highlightedText">
                transaction fees are shared with Color NFT owners
              </span>
              &nbsp; based on the{" "}
              <span className="highlightedText">
                proportional use of their colors
              </span>{" "}
              in traded NFTs.
            </p>
          </div>
        </article>
      </section>
      <section className={styles.canvas_relative}>
        <article className={styles.container}>
          <div
            className={`${styles.new_homepage_container} ${styles.stakes_container}`}
          >
            <h2 style={{ fontWeight: "bold" }}>
              Let’s take this
              <br /> Bored Ape as
              <br /> an example.
            </h2>
            <div
              className={`${styles.grid_home_boredApe_container} ${styles.grid_right_left}`}
            >
              <div className={styles.containerBoredApe}>
                <div>
                  <div className={styles.boredApeImage}>
                    <img
                      src={"/images/boredApe.png"}
                      alt="bored ape"
                    />
                  </div>
                  <aside className="plaidFont">BORED APE YACHT CLUB 9245</aside>
                </div>
                <h3>
                  There are <span className="plaidFont">398,161</span> pixels in
                  the above NFT.
                </h3>
                <p className={styles.contentP}>
                  The percentage <br /> breakdown sorted <br /> by mosted
                  dominant <br />
                  color to least. 8 colors <br />
                  were included because
                  <br /> they fell below the <br />
                  inclusion threshold <br />
                  of 0.1%.
                </p>
                <p className={styles.p_mobile_only}>
                  The percentage breakdown sorted by mosted dominant color to
                  least.
                </p>
              </div>
              <div className={styles.containerChart}>
                <Chart />
                <p className={styles.p_mobile_only}>
                  and 8 colors were included because they fell below the
                  inclusion threshold of 0.1%
                </p>
              </div>
              <div className={styles.donutArrow}>
                <div>
                  <img
                    src={"/images/donutArrow.png"}
                    alt="donutArrow"
                  />
                </div>
              </div>
            </div>
          </div>
        </article>
      </section>
    </>
  );
};

export default ThirdSection;
