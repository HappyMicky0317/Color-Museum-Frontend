import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import styles from "../../styles/modules/earn/earn.module.css";
import { FiChevronRight } from "react-icons/fi";

import { useRouter } from "next/router";
import Typed from "react-typed";
import useIntersection from "./useIntersection";
import { isMobile } from "react-device-detect";

const Earn = () => {
  // scroll
  const [showOne, setShowOne] = useState("choose");
  const router = useRouter();

  const section1 = useRef();
  const section2 = useRef();
  const section3 = useRef();
  const section4 = useRef();
  const section5 = useRef();

  const section1Port = useIntersection(section1, isMobile ? "-150px" : "0px");
  const section2Port = useIntersection(
    section2,
    isMobile ? "-200px" : "-200px"
  );
  const section3Port = useIntersection(
    section3,
    isMobile ? "-250px" : "-300px"
  );
  const section4Port = useIntersection(
    section4,
    isMobile ? "-300px" : "-400px"
  );
  const section5Port = useIntersection(
    section5,
    isMobile ? "-350px" : "-500px"
  );

  const handleShowOne = () => {
    if (
      section1Port &&
      !section2Port &&
      !section3Port &&
      !section4Port &&
      !section5Port
    ) {
      setShowOne("section1");
    } else if (
      section2Port &&
      !section3Port &&
      !section4Port &&
      !section5Port
    ) {
      setShowOne("section2");
    } else if (section3Port && !section4Port && !section5Port) {
      setShowOne("section3");
    } else if (section4Port && !section5Port) {
      setShowOne("section4");
    } else if (section5Port) {
      setShowOne("section5");
    }
  };
  useEffect(() => {
    handleShowOne();
  }, [section1Port, section2Port, section3Port, section4Port, section5Port]);

  const textLines = [
    "This is my purple. There are some like it, but none exactly like mine.",
  ];

  return (
    <>
      <section className={styles.wrapper}>
        <div className={styles.breadcrumbPath}>
          <Link href="/" passHref>
            <a>Home</a>
          </Link>
          <FiChevronRight />
          Earn Color Yield
        </div>
        <article className={styles.bannerFirst}>
          <div>
            <h1 className={styles.bannerTitle}>
              Earn <br />
              COLOR YIELD
            </h1>
          </div>
          <div className={styles.bannerBtnList}>
            <button
              className={styles.whiteButton}
              onClick={() => router.push("/choose")}
            >
              Mint A Color
            </button>
            <button className={styles.borderButton}>Trade Tokens</button>
          </div>
        </article>
        <div className={styles.scrollToShowDiv}>
          <article
            className={styles.containerSteps}
            ref={section1}
            onMouseEnter={() => setShowOne("section1")}
            onMouseLeave={() => handleShowOne()}
          >
            <div className={styles.wrapperSteps}>
              <div
                className={styles.containerStepLeft}
                style={{ opacity: showOne === "section1" ? "1" : "0.3" }}
              >
                <h1
                  style={{ margin: showOne === "section1" ? "0 0 16px" : "0" }}
                >
                  Marketplace fees paid out as Color Yield.
                </h1>
                <h2
                  style={{ display: showOne === "section1" ? "flex" : "none" }}
                >
                  You choose the color that is the apple of your eye. No
                  algorithm involved, for machines cannot see.
                </h2>
                <p
                  style={{ display: showOne === "section1" ? "flex" : "none" }}
                >
                  Out of 16.7 million available in the sRGB color space, only
                  10,000 colors will become a Color NFT. Just so you know, the
                  human eye can see about 2.3 million colors*.
                </p>
              </div>
            </div>
          </article>
          <article
            className={styles.containerSteps}
            ref={section2}
            onMouseEnter={() => setShowOne("section2")}
            onMouseLeave={() => handleShowOne()}
          >
            <div className={styles.wrapperSteps}>
              <div
                className={styles.containerStepLeft}
                style={{ opacity: showOne === "section2" ? "1" : "0.3" }}
              >
                <h1
                  style={{ margin: showOne === "section2" ? "0 0 16px" : "0" }}
                >
                  Color Yield paid out based on proportional use of color.
                </h1>
                <h2
                  style={{ display: showOne === "section2" ? "flex" : "none" }}
                >
                  Every color has a personality. Go beyond the hexadecimal, give
                  your color a name to remember.
                </h2>
                <p
                  style={{ display: showOne === "section2" ? "flex" : "none" }}
                >
                  Please, no profanity. Children like colors too.
                </p>
              </div>
            </div>
          </article>
          <article
            className={styles.containerSteps}
            ref={section3}
            onMouseEnter={() => setShowOne("section3")}
            onMouseLeave={() => handleShowOne()}
          >
            <div className={styles.wrapperSteps}>
              <div
                className={styles.containerStepLeft}
                style={{ opacity: showOne === "section3" ? "1" : "0.3" }}
              >
                <h1
                  style={{ margin: showOne === "section3" ? "0 0 16px" : "0" }}
                >
                  Beyond 10,000 colors, color distance.
                </h1>
                <h2
                  style={{ display: showOne === "section3" ? "flex" : "none" }}
                >
                  <Typed
                    strings={textLines}
                    typeSpeed={35}
                    loop={true}
                    backSpeed={70}
                  />
                </h2>
                <p
                  style={{ display: showOne === "section3" ? "flex" : "none" }}
                >
                  Your color deserves a few words (or an essay) to be said about
                  it. Tell the universe what your color means.
                </p>
              </div>
            </div>
          </article>
          <article
            className={styles.containerSteps}
            ref={section4}
            onMouseEnter={() => setShowOne("section4")}
            onMouseLeave={() => handleShowOne()}
          >
            <div className={styles.wrapperSteps}>
              <div
                className={styles.containerStepLeft}
                style={{ opacity: showOne === "section4" ? "1" : "0.3" }}
              >
                <h1
                  style={{ margin: showOne === "section4" ? "0 0 16px" : "0" }}
                >
                  Enforced by smart contract.
                </h1>
                <h2
                  style={{ display: showOne === "section4" ? "flex" : "none" }}
                >
                  Every color has a personality. Go beyond the hexadecimal, give
                  your color a name to remember.
                </h2>
                <p
                  style={{ display: showOne === "section4" ? "flex" : "none" }}
                >
                  Please, no profanity. Children like colors too.
                </p>
              </div>
            </div>
          </article>
          <article
            className={styles.containerSteps}
            ref={section5}
            onMouseEnter={() => setShowOne("section5")}
            onMouseLeave={() => handleShowOne()}
          >
            <div className={styles.wrapperSteps}>
              <div
                className={styles.containerStepLeft}
                style={{ opacity: showOne === "section5" ? "1" : "0.3" }}
              >
                <h1
                  style={{ margin: showOne === "section5" ? "0 0 16px" : "0" }}
                >
                  Start earning yield now.
                </h1>
                <h2
                  style={{ display: showOne === "section5" ? "flex" : "none" }}
                >
                  Every color has a personality. Go beyond the hexadecimal, give
                  your color a name to remember.
                </h2>
                <p
                  style={{ display: showOne === "section5" ? "flex" : "none" }}
                >
                  Please, no profanity. Children like colors too.
                </p>
              </div>
            </div>
          </article>
          <article className={styles.containerLearnMore}>
            <div className={styles.learnMoreCard}>
              <div>
                <h1>Mint Colors</h1>
                <h3>
                  This refers to minting (paying for) a Color NFT starting at
                  https://color.museum/choose
                </h3>
              </div>
              <button onClick={() => router.push("/mint-colors")}>
                Learn More
              </button>
            </div>
            <div className={styles.learnMoreCard}>
              <div>
                <h1>Trade NFTs</h1>
                <h3>
                  This refers to minting (paying for) a Color NFT starting at
                  https://color.museum/choose
                </h3>
              </div>
              <button onClick={() => router.push("/trade")}>Learn More</button>
            </div>
          </article>
        </div>
      </section>
    </>
  );
};

export default Earn;
