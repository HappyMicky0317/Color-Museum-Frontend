import React, { useEffect, useState } from "react";
import styles from "../../styles/modules/newhomepage/firstSection.module.css";
import Link from "next/link";
import { BACKEND } from "../../utils/constants";
import axios from "axios";
import { useSelector } from "react-redux";

var RetinaImage = require("react-retina-image");

// import Loader from "../../components/Loader/Loader";
// import { useRouter } from "next/router";
// import { useDispatch } from "react-redux";

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
        setFontSizeAmount(`${width < 1440 ? "14.5" : "20"}`);
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
        className={styles.NFTContainer}
        href={`https://color.museum/gallery/${item.uint256}`}
        target="_blank"
        key={index}
      >
        <div
          className={styles.RecentlyContainer}
          style={{ border: "3px solid #1c1c1e" }}
        >
          <div className={styles.ContainerContent}>
            <div
              className={styles.RecentlyHeader}
              style={{
                borderBottom: "3px solid #1c1c1e",
              }}
            >
              <div className={`${styles.flex}${styles.margin_left}`}>
                <RetinaImage
                  src={"/images/logo.png"}
                  className={styles.logo}
                  alt="logo NFTs"
                  data-atropos-offset="5"
                />
              </div>
              <h5 className={styles.margin_right}>{number}</h5>
            </div>
            <div
              className={styles.BackgroundContainer}
              style={{ background: `${color}` }}
            ></div>
            <div
              className={styles.RecentlyHeader}
              style={{ borderTop: "3px solid #1c1c1e" }}
            >
              <p
                style={{
                  fontSize: `${fontSizeAmount}px`,
                  lineHeight: `${fontSizeAmount}px`,
                }}
                className={styles.margin_left}
              >
                {name}
              </p>
              <p
                style={{
                  textTransform: "uppercase",
                  fontSize: `${fontSizeAmount}px`,
                  lineHeight: `${fontSizeAmount}px`,
                }}
                className={styles.margin_right}
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
      <div
        className={styles.NFTContainer}
        href={`https://color.museum/gallery/${item.uint256}`}
        target="_blank"
        key={index}
      >
        <div
          className={styles.RecentlyContainer}
          style={{ border: `3px solid ${color}` }}
        >
          <div className={styles.ContainerContent}>
            <div className={styles.RecentlyHeader}>
              <div className={`${styles.flex}${styles.margin_left}`}>
                <RetinaImage
                  src={"/images/logo.png"}
                  className={styles.logo}
                  alt="logo NFTs"
                  data-atropos-offset="5"
                />
              </div>
              <h5 className={styles.margin_right}>{number}</h5>
            </div>
            <div
              className={styles.BackgroundContainer}
              style={{ background: `${color}` }}
              data-atropos-offset="-0.45"
            ></div>
            <div className={styles.RecentlyHeader} data-atropos-offset="5">
              <p
                style={{
                  fontSize: `${fontSizeAmount}px`,
                  lineHeight: `${fontSizeAmount}px`,
                }}
                className={styles.margin_right}
              >
                {name}
              </p>
              <p
                style={{
                  textTransform: "uppercase",
                  fontSize: `${fontSizeAmount}px`,
                  lineHeight: `${fontSizeAmount}px`,
                }}
                className={styles.margin_right}
              >
                {color}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

const FirstSection = () => {
  // const router = useRouter();
  // const dispatch = useDispatch();

  const amountofindex = (data) => {
    let arr = [];
    // eslint-disable-next-line
    data.map((item, index) => {
      if (item !== undefined) {
        arr.push(index);
      }
    });
    return arr.length - 1;
  };

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

    const query = new URLSearchParams(window.location.search);
    if (query.get("utm_source"))
      sessionStorage.setItem("utm_source", query.get("utm_source"));
    if (query.get("utm_medium"))
      sessionStorage.setItem("utm_medium", query.get("utm_medium"));
    if (query.get("utm_campaign"))
      sessionStorage.setItem("utm_campaign", query.get("utm_campaign"));
    if (query.get("utm_content"))
      sessionStorage.setItem("utm_content", query.get("utm_content"));
  }, []);

  return (
    <>
      <section className={styles.wrapper}>
        <article className={styles.container}>
          <div className={styles.DiscountContainer}>
            <h1>Trade Colors.</h1>
            <div className={styles.mainDiv}>
              <h2>
                Color NFT by Color Museum. <b>511</b> Minted Colors.
              </h2>
              <div className={styles.innerDiv}>
                <p>24 HOUR VOL. </p> &nbsp;&nbsp;<h3> $100,000</h3>
              </div>
            </div>
          </div>
          <div
            className={styles.MarqueeContainer}
            index={sliderData && amountofindex(sliderData)}
            // style={
            //     sliderData && amountofindex(sliderData) &&
            //     `animation: transformAnimation calc(${sliderData && amountofindex(sliderData)} * 1.3s) linear infinite alternate`}
          >
            {sliderData &&
              sliderData.map((item, index) => {
                if (item === undefined) {
                  return null;
                }
                return <DataResponse item={item} key={index} index={index} />;
              })}
          </div>
          <div className={styles.ChooseContainer}>
            <Link
              href="/choose"
              onClick={() => {
                if (localStorage.getItem("mintClicked")) {
                  localStorage.clear("mintClicked");
                  localStorage.setItem("mintClicked", true);
                } else {
                  localStorage.setItem("mintClicked", true);
                }
              }}
            >
              <a className={styles.earlyAccess}>View Gallery</a>
            </Link>
            <Link
              href="/mint"
              onClick={() => {
                if (localStorage.getItem("mintClicked")) {
                  localStorage.clear("mintClicked");
                  localStorage.setItem("mintClicked", true);
                } else {
                  localStorage.setItem("mintClicked", true);
                }
              }}
            >
              <a className={styles.earlyAccess}>Mint a color</a>
            </Link>
          </div>
          <div className={styles.ethMainDiv}>
            <div>
              <h1>Earn ETH.</h1>
              <p>Earn ETH from color royalties. </p>
            </div>
            <div>
              <h1>Mint Colors.</h1>
              <p>Only 490 colors available to mint. </p>
            </div>
          </div>
        </article>
      </section>
    </>
  );
};

export default FirstSection;
