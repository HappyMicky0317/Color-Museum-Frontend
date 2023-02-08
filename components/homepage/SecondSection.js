import React from "react";
import styles from "../../styles/modules/homepage/secondSection.module.css";
import { FiArrowUpRight } from "react-icons/fi";
import Typed from "react-typed";
import Image from "next/image";

const SecondSection = () => {
  const textLines = [
    "This is my purple. There are some like it, but none exactly like mine.",
  ];

  return (
    <section className={styles.container}>
      <article>
        <div className={styles.single_option_box}>
          <div className={`${styles.single_option} ${styles.choose_content}`}>
            <h2 className={styles.option_heading}>Choose.</h2>

            <h3 className={styles.option_des}>
              You choose the color that is the apple of your eye. No algorithm
              involved, for machines cannot see.
            </h3>

            <p className={styles.option_p}>
              Out of 16.7 million available in the sRGB color space, only 10,000
              colors will become a Color NFT. Just so you know, the human eye
              can see about 2.3 million colors*.
            </p>

            <div className={styles.option_flex}>
              *Who said that? Scientists.
              <a href="https://www.pnas.org/content/96/9/4743">
                <FiArrowUpRight />
              </a>
            </div>
          </div>
          <div
            className={`${styles.box_option} ${styles.choose_content_image}`}
          >
            <img
              src="/images/choose.gif"
              alt="choose NFT"
              className={styles.img_fluid}
            />
          </div>
        </div>
        <div className={styles.single_option_box}>
          <div className={`${styles.single_option} ${styles.choose_content}`}>
            <h2 className={styles.option_heading}>Name.</h2>
            <h3 className={styles.option_des}>
              Every color has a personality. Go beyond the hexadecimal, give
              your color a name to remember.
            </h3>
            <p className={styles.option_p}>
              Please, no profanity. Children like colors too.
            </p>
          </div>
          <div
            className={`${styles.box_option} ${styles.choose_content_image}`}
          >
            <img
              className={styles.img_fluid}
              src={"/images/name.gif"}
              alt="name nft card"
            />
          </div>
        </div>

        <div className={styles.single_option_box}>
          <div className={`${styles.single_option} ${styles.choose_content}`}>
            <h2 className={styles.option_heading}>Describe.</h2>
            <h3 className={styles.option_des}>
              <Typed
                strings={textLines}
                typeSpeed={35}
                loop={true}
                backSpeed={70}
              />
            </h3>

            <p className={styles.option_p}>
              Your color deserves a few words (or an essay) to be said about it.
              Tell the universe what your color means.
            </p>
          </div>
          <div className={styles.box_option}>
            <img
              className={styles.img_fluid}
              src={"/images/describeNFT.png"}
              alt="describe nft card"
            />
          </div>
        </div>
        <div className={styles.options_wrapper}>
          <div
            className={`${styles.single_option_box} ${styles.single_option_box_own}`}
          >
            <div className={styles.single_option_second}>
              <div className={styles.box_option}>
                <h2 className={`${styles.option_heading} ${styles.option_own}`}>
                  Own.
                </h2>
                <video
                  className={`${styles.box2_image} ${styles.desktop_video}`}
                  autoPlay
                  loop
                  muted
                  playsInline
                >
                  <source
                    className={styles.img_fluid}
                    src={"/images/own-video.mp4"}
                    type="video/mp4"
                  />
                </video>
              </div>
              <h3 className={styles.option_des}>
                Own your color for eternity—or as long as Ethereum exists*. As a
                new primitive, the tokenID associated with your color resolves
                completely on-chain, now and forever.
              </h3>
              <p className={styles.option_p}>
                *And as long as you (and your heirs) exist. You can also trade
                your Color NFT on any open NFT marketplace that supports the
                ERC-721 standard, such as OpenSea.
              </p>
            </div>
          </div>
        </div>
      </article>
    </section>
  );
};

export default SecondSection;
