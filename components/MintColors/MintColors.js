import { Link } from "@mui/material";
import styles from "../../styles/modules/mintcolors/mintcolors.module.css";
import { BsArrowRight } from "react-icons/bs";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
// import { useInViewport } from "react-in-viewport";
import Typed from "react-typed";
import { FiChevronRight } from "react-icons/fi";
import { COLLECTORS } from "../../utils/constants";
import useIntersection from "./useIntersection";
import { isMobile } from "react-device-detect";

const MintColors = ({ data }) => {
  const router = useRouter();
  const [scrollPosition, setScrollPosition] = useState(0);
  const handleScroll = () => {
    const position = window.pageYOffset;
    setScrollPosition(position);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const [animationCard, setAnimationCard] = useState(0);
  useEffect(() => {
    if (scrollPosition < 75) {
      setAnimationCard(1);
    } else if (scrollPosition >= 75 && scrollPosition < 150) {
      setAnimationCard(2);
    } else if (scrollPosition >= 150 && scrollPosition < 225) {
      setAnimationCard(3);
    } else if (scrollPosition >= 225 && scrollPosition < 320) {
      setAnimationCard(4);
    } else {
      setAnimationCard(5);
    }
  }, [scrollPosition]);

  const textLines = [
    "  This is my purple. There are some like it, but none exactly like mine.",
  ];

  const [showOne, setShowOne] = useState("choose");

  const chooseRef = useRef();
  const nameRef = useRef();
  const describeRef = useRef();
  const chooseViewPort = useIntersection(chooseRef, "0px");
  const nameViewPort = useIntersection(nameRef, isMobile ? "-100px" : "-350px");
  const describeViewPort = useIntersection(
    describeRef,
    isMobile ? "-175px" : "-400px"
  );
  const handleShowOne = () => {
    if (chooseViewPort && nameViewPort && !describeViewPort) {
      setShowOne("name");
    } else if (describeViewPort && nameViewPort && chooseViewPort) {
      setShowOne("describe");
    } else if (chooseViewPort && !nameViewPort && !describeViewPort) {
      setShowOne("choose");
    }
  };
  useEffect(() => {
    handleShowOne();
  }, [chooseViewPort, nameViewPort, describeViewPort]);

  return (
    <section className={styles.wrapper}>
      <div className={styles.breadcrumbPath}>
        <Link href="/" passHref>
          <a>Home</a>
        </Link>
        <FiChevronRight />
        Mint Colors
      </div>
      <article className={styles.containerCards}>
        <div
          className={styles.cardWrapper}
          style={{
            background: "#FCF300",
            minHeight:
              animationCard === 1 ? (isMobile ? "70px" : "144px") : "0",
          }}
          onMouseEnter={() => setAnimationCard(1)}
          onMouseLeave={() => setAnimationCard(0)}
        >
          <h1 style={{ color: "#000" }}>{data.array.length} Colors</h1>
        </div>
        <div
          className={styles.cardWrapper}
          style={{
            background: "#0A78FF",
            minHeight:
              animationCard === 2 ? (isMobile ? "70px" : "144px") : "0",
          }}
          onMouseEnter={() => setAnimationCard(2)}
          onMouseLeave={() => setAnimationCard(0)}
        >
          <h1>380K Vol.</h1>
        </div>
        <div
          className={styles.cardWrapper}
          style={{
            background: "#F3752B",
            minHeight:
              animationCard === 3 ? (isMobile ? "110px" : "144px") : "0",
          }}
          onMouseEnter={() => setAnimationCard(3)}
          onMouseLeave={() => setAnimationCard(0)}
        >
          <h1>{COLLECTORS} Collectors</h1>
        </div>
        <div
          className={styles.cardWrapper}
          style={{
            background: "#B82F4C",
            minHeight:
              animationCard === 4 ? (isMobile ? "110px" : "144px") : "0",
          }}
          onMouseEnter={() => setAnimationCard(4)}
          onMouseLeave={() => setAnimationCard(0)}
        >
          <h1>0.4 ETH FLOOR</h1>
        </div>
        <div
          className={styles.cardWrapper}
          style={{
            background: "#0A78FF",
            minHeight:
              animationCard === 5 ? (isMobile ? "110px" : "144px") : "0",
          }}
          onMouseEnter={() => setAnimationCard(5)}
          onMouseLeave={() => setAnimationCard(0)}
        >
          <h1>10K SUPPLY MAX</h1>
        </div>
      </article>
      <h1 className={styles.header}>COLOR NFT COLLECTION</h1>
      <article className={styles.containerButtons}>
        <button
          className={styles.mintButton}
          onClick={() => router.push("/choose")}
        >
          MINT A COLOR
        </button>
        <button
          className={styles.viewButton}
          onClick={() => router.push("/gallery")}
        >
          BROWSE COLLECTION
        </button>
      </article>

      <article
        className={styles.containerSteps}
        ref={chooseRef}
        onMouseEnter={() => setShowOne("choose")}
        onMouseLeave={() => handleShowOne()}
      >
        <div className={styles.wrapperSteps}>
          <div
            className={styles.containerStepLeft}
            style={{ opacity: showOne === "choose" ? "1" : "0.3" }}
          >
            <h1 style={{ margin: showOne === "choose" ? "0 0 16px" : "0" }}>
              Choose.
            </h1>
            <h2 style={{ display: showOne === "choose" ? "flex" : "none" }}>
              You choose the color that is the apple of your eye. No algorithm
              involved, for machines cannot see.
            </h2>
            <p style={{ display: showOne === "choose" ? "flex" : "none" }}>
              Out of 16.7 million available in the sRGB color space, only 10,000
              colors will become a Color NFT. Just so you know, the human eye
              can see about 2.3 million colors*.
            </p>
            {/* <Link href="/" passHref>
              <a
                className={styles.leftLink}
                style={{ display: showOne === "choose" ? "flex" : "none" }}
              >
                Link <BsArrowRight />
              </a>
            </Link> */}
            <div style={{ display: showOne === "choose" ? "flex" : "none" }}>
              <button
                className={styles.colorButton}
                onClick={() => router.push("/choose")}
              >
                Mint A Color
              </button>
            </div>
          </div>
          <img
            src="/images/choose.gif"
            className={styles.imageRight}
            style={{ display: showOne === "choose" ? "flex" : "none" }}
          />
        </div>
      </article>
      <article
        className={styles.containerSteps}
        ref={nameRef}
        onMouseEnter={() => setShowOne("name")}
        onMouseLeave={() => handleShowOne()}
      >
        <div className={styles.wrapperSteps}>
          <div
            className={styles.containerStepLeft}
            style={{ opacity: showOne === "name" ? "1" : "0.3" }}
          >
            <h1 style={{ margin: showOne === "name" ? "0 0 16px" : "0" }}>
              Name.
            </h1>
            <h2 style={{ display: showOne === "name" ? "flex" : "none" }}>
              Every color has a personality. Go beyond the hexadecimal, give
              your color a name to remember.
            </h2>
            <p style={{ display: showOne === "name" ? "flex" : "none" }}>
              Please, no profanity. Children like colors too.
            </p>
            <div style={{ display: showOne === "name" ? "flex" : "none" }}>
              <button
                className={styles.colorButton}
                onClick={() => router.push("/choose")}
              >
                Mint A Color
              </button>
            </div>
          </div>
          <img
            src="/images/name.gif"
            className={styles.imageRight}
            style={{ display: showOne === "name" ? "flex" : "none" }}
          />
        </div>
      </article>
      <article
        className={styles.containerSteps}
        ref={describeRef}
        onMouseEnter={() => setShowOne("describe")}
        onMouseLeave={() => handleShowOne()}
      >
        <div className={styles.wrapperSteps}>
          <div
            className={styles.containerStepLeft}
            style={{ opacity: showOne === "describe" ? "1" : "0.3" }}
          >
            <h1 style={{ margin: showOne === "describe" ? "0 0 16px" : "0" }}>
              Describe.
            </h1>
            <h2 style={{ display: showOne === "describe" ? "flex" : "none" }}>
              <Typed
                strings={textLines}
                typeSpeed={35}
                loop={true}
                backSpeed={70}
              />
            </h2>
            <p style={{ display: showOne === "describe" ? "flex" : "none" }}>
              Your color deserves a few words (or an essay) to be said about it.
              Tell the universe what your color means.
            </p>
            <div style={{ display: showOne === "describe" ? "flex" : "none" }}>
              <button
                className={styles.colorButton}
                onClick={() => router.push("/choose")}
              >
                Mint A Color
              </button>
            </div>
          </div>
          <img
            src="/images/describeNFT.png"
            className={styles.imageRight}
            style={{ display: showOne === "describe" ? "flex" : "none" }}
          />
        </div>
      </article>
      {/* <article
        className={styles.containerSteps}
      >
        <div className={styles.wrapperSteps}>
          <div
            className={styles.containerStepItem}
          >
            <h1 >
              Name.
            </h1>
            <h2 >
              Every color has a personality. Go beyond the hexadecimal, give
              your color a name to remember.
            </h2>
            <p >
              Please, no profanity. Children like colors too.
            </p>
            <div >
              <button
                className={styles.colorButton}
                onClick={() => router.push("/choose")}
              >
                Mint A Color
              </button>
            </div>
          </div>
          <img
            src="/images/name.gif"
            className={styles.imageRight}
          />
        </div>
      </article>
      <article
        className={styles.containerSteps}
      >
        <div className={styles.wrapperSteps}>
          <div
            className={styles.containerStepItem}
          >
            <h1 >
              Describe.
            </h1>
            <h2 >
              <Typed
                strings={textLines}
                typeSpeed={35}
                loop={true}
                backSpeed={70}
              />
            </h2>
            <p  >
              Your color deserves a few words (or an essay) to be said about it.
              Tell the universe what your color means.
            </p>
            <div>
              <button
                className={styles.colorButton}
                onClick={() => router.push("/choose")}
              >
                Mint A Color
              </button>
            </div>
          </div>
          <img
            src="/images/describeNFT.png"
            className={styles.imageRight}
          />
        </div>
      </article> */}
      <article className={styles.containerLearnMore}>
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
        <div className={styles.learnMoreCard}>
          <div>
            <h1>Earn Yield</h1>
            <h3>
              This refers to minting (paying for) a Color NFT starting at
              https://color.museum/choose
            </h3>
          </div>
          <button onClick={() => router.push("/earn")}>Learn More</button>
        </div>
      </article>
    </section>
  );
};

export default MintColors;
