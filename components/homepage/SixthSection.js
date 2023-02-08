import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import styles from "../../styles/modules/homepage/sixthSection.module.css";
import { BACKEND, DISCOUNT_PRICE } from "../../utils/constants";
import { useSelector } from "react-redux";

export const DataResponse = ({ item, index }) => {
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
        className={styles.nftContainer}
        href={`https://color.museum/gallery/${item.uint256}`}
        target="_blank"
        key={index}
      >
        <div
          className={styles.recentlyContainer}
          style={{ border: "3px solid #1c1c1e" }}
        >
          <div className={styles.containerContent}>
            <div
              className={styles.recentlyHeader}
              style={{
                borderBottom: "3px solid #1c1c1e",
              }}
            >
              <div className={`${styles.logo} ${styles.margin_left}`}>
                <Image
                  src={"/images/logo.png"}
                  alt="logo NFTs"
                  data-atropos-offset="5"
                  layout="fill"
                  objectFit="contain"
                />
              </div>
              <h5 className={`${styles.margin_right} ${styles.address}`}>
                {number}
              </h5>
            </div>
            <div
              className={styles.backgroundContainer}
              style={{ background: `${color}` }}
            ></div>
            <div
              className={styles.recentlyHeader}
              style={{ borderTop: "3px solid #1c1c1e" }}
            >
              <p
                style={{
                  fontSize: `${fontSizeAmount}px`,
                  lineHeight: `${fontSizeAmount}px`,
                }}
                className={`${styles.margin_left} ${styles.recentlyP}`}
              >
                {name}
              </p>
              <p
                style={{
                  textTransform: "uppercase",
                  fontSize: `${fontSizeAmount}px`,
                  lineHeight: `${fontSizeAmount}px`,
                }}
                className={`${styles.margin_left} ${styles.recentlyP}`}
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
        className={styles.nftContainer}
        href={`https://color.museum/gallery/${item.uint256}`}
        target="_blank"
      >
        <div
          className={styles.recentlyContainer}
          style={{ border: `3px solid ${color}` }}
        >
          <div className={styles.containerContent}>
            <div className={styles.recentlyHeader}>
              <div className={`${styles.logo} ${styles.margin_left}`}>
                <Image
                  src={"/images/logo.png"}
                  alt="logo NFTs"
                  data-atropos-offset="5"
                  layout="fill"
                  objectFit="contain"
                />
              </div>
              <h5 className={`${styles.margin_right} ${styles.address}`}>
                {number}
              </h5>
            </div>
            <div
              className={styles.backgroundContainer}
              style={{ background: `${color}` }}
              data-atropos-offset="-0.45"
            ></div>
            <div className={styles.recentlyHeader} data-atropos-offset="5">
              <p
                style={{
                  fontSize: `${fontSizeAmount}px`,
                  lineHeight: `${fontSizeAmount}px`,
                }}
                className={`${styles.margin_left} ${styles.recentlyP}`}
              >
                {name}
              </p>
              <p
                style={{
                  textTransform: "uppercase",
                  fontSize: `${fontSizeAmount}px`,
                  lineHeight: `${fontSizeAmount}px`,
                }}
                className={`${styles.margin_right} ${styles.recentlyP}`}
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

const SixthSection = () => {
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
    <section className={styles.imageContainer}>
      <article className={styles.expand_wrapper}>
        <div className={styles.discount_container}>
          <h2>Guarantee Mint + Expand Your Palette</h2>
          <h1>Skip the line and get {DISCOUNT_PRICE}% off.</h1>
          <p>
            Mint <b>1</b> Color NFT at the priority price and get{" "}
            {DISCOUNT_PRICE}% on your 2nd, 3rd, 4th and 5th colors.
          </p>
          <Link href="/choose">
            <a className={styles.colorChoose}>Mint now</a>
          </Link>
        </div>
      </article>
      <article
        className={`${styles.marqueeContainer} ${
          sliderData && amountofindex(sliderData) > 20
            ? styles.moreThan20
            : amountofindex(sliderData) > 30
            ? styles.moreThan30
            : amountofindex(sliderData) > 40
            ? styles.moreThan40
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
  );
};

export default SixthSection;
