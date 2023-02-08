import React, { useEffect, useState } from "react";
import stylesWrapper from "../../styles/modules/gallery/sort.module.css";
import stylesThird from "../../styles/modules/gallery/loadmore.module.css";
import stylesForm from "../../styles/modules/homepage/firstSection.module.css";
import styles from "../../styles/modules/simplified/simplified.module.css";
import Marquee from "react-fast-marquee";
import { Logos } from "../homepage/logos";
import { useSelector } from "react-redux";
import { BACKEND } from "../../utils/constants";
import Link from "next/link";
import stylesSix from "../../styles/modules/homepage/sixthSection.module.css";
import axios from "axios";
import Image from "next/image";
import { ChevronUpIcon } from "@radix-ui/react-icons";

const DataResponse = ({ item, index }) => {
  const [fontSizeAmount, setFontSizeAmount] = useState("25");
  // Screen Width to set the style in properties
  const [width, setWidth] = useState(window.innerWidth);
  let name = item.name;
  let color = item.hex;
  let number = item.nftNo;
  useEffect(() => {
    const handleResize = () => {
      let widthDimension = window.innerWidth;
      setWidth(widthDimension);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  // Screen Width to set the style in properties
  useEffect(() => {
    if (item.name) {
      if (item.name.length < 10) {
        setFontSizeAmount(`${width < 1440 ? "17" : "25"}`);
      } else if (item.name.length > 9 && item.name.length < 15) {
        setFontSizeAmount(`${width < 1440 ? "14.5" : "22"}`);
      } else {
        setFontSizeAmount(`${width < 1440 ? "12.5" : "18"}`);
      }
    }
    // eslint-disable-next-line
  }, [item.name]);
  const { whiteBorders } = useSelector((state) => state.minting);
  if (whiteBorders.includes(color.toUpperCase())) {
    return (
      <a
        className={stylesSix.nftContainer}
        href={`https://color.museum/gallery/${item.uint256}`}
        target="_blank"
        key={index}
      >
        <div
          className={stylesSix.recentlyContainer}
          style={{ border: "3px solid #1c1c1e" }}
        >
          <div className={stylesSix.containerContent}>
            <div
              className={stylesSix.recentlyHeader}
              style={{
                borderBottom: "3px solid #1c1c1e",
              }}
            >
              <div className={`${stylesSix.logo} ${stylesSix.margin_left}`}>
                <Image
                  src={"/images/logo.png"}
                  alt="logo NFTs"
                  data-atropos-offset="5"
                  layout="fill"
                  objectFit="contain"
                />
              </div>
              <h5 className={`${stylesSix.margin_right} ${stylesSix.address}`}>
                {number}
              </h5>
            </div>
            <div
              className={stylesSix.backgroundContainer}
              style={{ background: `${color}` }}
            ></div>
            <div
              className={stylesSix.recentlyHeader}
              style={{ borderTop: "3px solid #1c1c1e" }}
            >
              <p
                style={{
                  fontSize: `${fontSizeAmount}px`,
                  lineHeight: `${fontSizeAmount}px`,
                }}
                className={`${stylesSix.margin_left} ${stylesSix.recentlyP}`}
              >
                {name}
              </p>
              <p
                style={{
                  textTransform: "uppercase",
                  fontSize: `${fontSizeAmount}px`,
                  lineHeight: `${fontSizeAmount}px`,
                }}
                className={`${stylesSix.margin_left} ${stylesSix.recentlyP}`}
              >
                {color}
              </p>
            </div>
          </div>
        </div>
      </a>
    );
  } else {
    return (
      <a
        className={stylesSix.nftContainer}
        href={`https://color.museum/gallery/${item.uint256}`}
        target="_blank"
      >
        <div
          className={stylesSix.recentlyContainer}
          style={{ border: `3px solid ${color}` }}
        >
          <div className={stylesSix.containerContent}>
            <div className={stylesSix.recentlyHeader}>
              <div className={`${stylesSix.logo} ${stylesSix.margin_left}`}>
                <Image
                  src={"/images/logo.png"}
                  alt="logo NFTs"
                  data-atropos-offset="5"
                  layout="fill"
                  objectFit="contain"
                />
              </div>
              <h5 className={`${stylesSix.margin_right} ${stylesSix.address}`}>
                {number}
              </h5>
            </div>
            <div
              className={stylesSix.backgroundContainer}
              style={{ background: `${color}` }}
              data-atropos-offset="-0.45"
            ></div>
            <div className={stylesSix.recentlyHeader} data-atropos-offset="5">
              <p
                style={{
                  fontSize: `${fontSizeAmount}px`,
                  lineHeight: `${fontSizeAmount}px`,
                }}
                className={`${stylesSix.margin_left} ${stylesSix.recentlyP}`}
              >
                {name}
              </p>
              <p
                style={{
                  textTransform: "uppercase",
                  fontSize: `${fontSizeAmount}px`,
                  lineHeight: `${fontSizeAmount}px`,
                }}
                className={`${stylesSix.margin_right} ${stylesSix.recentlyP}`}
              >
                {color}
              </p>
            </div>
          </div>
        </div>
      </a>
    );
  }
};

const Simplified = () => {
  const [sliderData, setSliderData] = useState();
  useEffect(() => {
    const asyncFunc = async () => {
      try {
        const response = await axios.get(`${BACKEND}/api/v1/image`);
        const finalArr = [];
        let i = 0,
          j = 0;
        while (i < 25) {
          if (Math.random() > 0.5) {
            finalArr.push(response.data.documents[j]);
            response.data.documents.splice(j, 1);
            i++;
            j--;
          }
          j++;
          if (j >= response.data.documents.length) j = 0;
        }
        setSliderData(finalArr);
      } catch (error) {
        console.log(error);
      }
    };
    asyncFunc();
  }, []);
  const amountofindex = (data) => {
    let arr = [];
    // eslint-disable-next-line
    if (data) {
      data.map((item, index) => {
        if (item !== undefined) {
          arr.push(index);
        }
      });
    }
    return arr.length - 1;
  };
  return (
    <>
      <section className={stylesWrapper.wrapper}>
        <section className={`${stylesSix.imageContainer} ${styles.container}`}>
          <article className={stylesSix.expand_wrapper}>
            <div
              className={`${stylesSix.discount_container} ${styles.discount_container}`}
            >
              <div>
                <h2>515 Colors.</h2>
                <h2>380k Vol.</h2>
                <h2>311 Collectors</h2>
                <h1>
                  <span style={{ color: "#0f6" }}>0.4 </span>
                  ETH Floor
                </h1>
                <h3>
                  <img src={"/images/priceIsUpGreen.svg"} alt="" />
                  <span style={{ color: "#0f6" }}> +60% </span>
                  from base mint price.
                </h3>
              </div>
              <div className={styles.containerNFT}>
                <h1>Color NFT</h1>
                <h2>COLLECTION</h2>
                <div
                  style={{ display: "flex", justifyContent: "space-around" }}
                >
                  <Link href="/gallery" passHref>
                    <a className={styles.button}>TRADE</a>
                  </Link>
                  <Link href="/choose" passHref>
                    <a className={styles.button}>MINT</a>
                  </Link>
                  <Link href="/gallery" passHref>
                    <a className={styles.button}>TRADE</a>
                  </Link>
                </div>
              </div>
            </div>
          </article>
          <article
            className={`${stylesSix.marqueeContainer} ${
              sliderData && amountofindex(sliderData) > 20
                ? stylesSix.moreThan20
                : amountofindex(sliderData) > 30
                ? stylesSix.moreThan30
                : amountofindex(sliderData) > 40
                ? stylesSix.moreThan40
                : null
            }`}
          >
            {sliderData &&
              sliderData.map((item, index) => {
                if (item === undefined) {
                  return null;
                }
                return <DataResponse item={item} key={index} index={index} />;
              })}
          </article>
        </section>
        <h2 className={stylesThird.header}>
          Billions of possibilities, but only 10,000 Colors to see the light.
        </h2>
        <p className={stylesThird.desc}>
          Modern screens display tens of millions to billions of colors. From
          this pool the Color Museum website enables anyone to mint a Color NFT
          on the Ethereum Blockchain. The total number of possible Color NFTs
          are algorithmically limited to 10,000—making a Color NFT 1600X rarer
          than a Bitcoin.
        </p>
        <div className={stylesThird.flex} style={{ marginBottom: "0" }}>
          <div>
            <h3 className={stylesThird.timesHeader}>1600X</h3>
            <p className={stylesThird.descTimes}>rarer than Bitcoin.</p>
          </div>
          <div>
            <h3 className={stylesThird.timesHeader}>400X</h3>
            <p className={stylesThird.descTimes}>rarer than ether.</p>
          </div>
        </div>
        <form
          className={`${stylesForm.emailContainer} ${styles.marginForm}`}
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <input
            type="email"
            placeholder="Enter your email"
            name="_replyto"
            id="email-main"
            className={stylesForm.email_input}
            required
          />
          <button type="submit" className={stylesForm.buttonEmailForm}>
            SUBSCRIBE
          </button>
        </form>
        <p className={stylesThird.desc}>
          By entering your email address, you will be registered for the Color
          Museum Market waitlist.
        </p>
        <div className={stylesForm.logo_slider}>
          <Marquee
            speed={140}
            gradient={false}
            pauseOnHover={true}
            className={stylesForm.marquee_border}
          >
            {Logos.map((item, index) => {
              return (
                <div key={index} className={stylesForm.logo_item}>
                  <a href={item.redirect} target="_blank" rel="noreferrer">
                    <img src={item.src} alt={item.name} />
                  </a>
                </div>
              );
            })}
          </Marquee>
        </div>
      </section>
    </>
  );
};

export default Simplified;
