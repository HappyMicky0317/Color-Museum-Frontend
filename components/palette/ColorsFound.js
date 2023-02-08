import React, { useCallback, useEffect, useState } from "react";
import styles from "../../styles/modules/palette/palette.module.css";
import Disconnect from "../Mint/Disconnect";
import Link from "next/link";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Atropos from "atropos/react";
import "atropos/atropos.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import axios from "axios";
import { useSelector } from "react-redux";
import Image from "next/image";
import Loader from "../Loader/Loader";
import { BACKEND } from "../../utils/constants";
const Web3Utils = require("web3-utils");

const ColorsFound = ({ address, singleNFTsAmount, singleNFTs }) => {
  const responsive = {
    desktop: {
      breakpoint: { max: 4001, min: 1024 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  return (
    <>
      <h1 className={styles.header}>Your Palette</h1>
      <div className={styles.flex}>
        <p className={styles.desc} style={{ width: "auto" }}>
          {address ? address.slice(0, 10) : null} owns {singleNFTsAmount} Color{" "}
          {singleNFTsAmount > 1 ? "NFTs." : "NFT."}
        </p>
        <Disconnect />
      </div>
      <div className={styles.container}>
        {singleNFTsAmount > 3 ? (
          <Carousel
            swipeable={true}
            draggable={false}
            responsive={responsive}
            infinite={true}
            autoPlay={true}
            autoPlaySpeed={3000}
            customTransition="all 0.5s ease"
            transitionDuration={500}
            // containerClass="carousel-container"
            arrows={false}
            renderButtonGroupOutside={true}
            customButtonGroup={<CustomButtonGroupAsArrows />}
          >
            {singleNFTs.map((item, index) => {
              return (
                <Atropos>
                  <ContainerNFT id={item.nftNo} key={index} />
                </Atropos>
              );
            })}
          </Carousel>
        ) : (
          singleNFTs.map((item, index) => {
            return (
              <Atropos>
                <ContainerNFT id={item.nftNo} key={index} />
              </Atropos>
            );
          })
        )}
      </div>
      <div className={styles.buttonContainer}>
        <Link href="/choose" passHref>
          <a className={styles.buttonAnimated}>Mint More</a>
        </Link>
      </div>
    </>
  );
};

export default ColorsFound;

export const CustomButtonGroupAsArrows = ({ next, previous }) => {
  const moveSlider = useCallback((event) => {
    if (event.keyCode === 39) {
      next();
    }
    if (event.keyCode === 37) {
      previous();
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", moveSlider, false);
    return () => {
      document.removeEventListener("keydown", moveSlider, false);
    };
    // eslint-disable-next-line
  }, []);
  return (
    <div className={styles.position}>
      <FaChevronLeft className={styles.chevron_slider} onClick={previous} />
      <FaChevronRight className={styles.chevron_slider} onClick={next} />
    </div>
  );
};

export const ContainerNFT = ({ id, marginRight }) => {
  const [name, setName] = useState();
  const [color, setColor] = useState();
  const [number, setNumber] = useState();
  const [path, setPath] = useState();
  const [isLoaderColor, setIsLoaderColor] = useState(false);
  const handleData = async () => {
    setIsLoaderColor(true);
    await axios(`${BACKEND}/api/v1/image/${id}`).then((res) => {
      setName(res.data.name);
      setColor(res.data.hex);
      setNumber(res.data.nftNo);
      setPath(
        res.data.hex
          ? Web3Utils.hexToNumber(
              `0x${res.data.hex.slice(1, res.data.hex.length)}`
            )
          : 0
      );
    });
    setIsLoaderColor(false);
  };
  useEffect(() => {
    handleData();
    return () => {};
  }, [id]);

  const [fontSizeAmount, setFontSizeAmount] = useState("28");
  useEffect(() => {
    if (name) {
      if (name.length < 15) {
        setFontSizeAmount("22");
      } else {
        setFontSizeAmount("20");
      }
    }
  }, [name]);

  const { whiteBorders } = useSelector((state) => state.minting);
  if (color && whiteBorders.includes(color.toUpperCase())) {
    return (
      <Link
        href={`/gallery/${path}`}
        style={{
          textDecoration: "none",
          marginRight: marginRight ? "2rem" : null,
        }}
      >
        <div
          className={styles.recentlyContainer}
          style={{
            borderColor: "#1c1c1e",
            marginRight: marginRight ? "2rem" : null,
          }}
        >
          <div className={styles.containerContent}>
            <div
              className={styles.recentlyHeader}
              style={{
                borderBottom: "3px solid #1c1c1e",
              }}
            >
              <div className={styles.flexContent}>
                <div className={styles.logo}>
                  <Image
                    src={"/images/logo.png"}
                    alt="logo NFTs"
                    data-atropos-offset="5"
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
              </div>
              <div
                className={`${styles.address} ${styles.margin_right}`}
                data-atropos-offset="5"
              >
                {number}
              </div>
            </div>
            <div
              className={styles.backgroundContainer}
              style={{ background: `${color}` }}
              data-atropos-offset="-0.5"
            ></div>
            <div
              className={styles.recentlyHeader}
              style={{ borderTop: "3px solid #1c1c1e" }}
            >
              <p
                className={styles.recentlyP}
                style={{
                  fontSize: `${fontSizeAmount}px`,
                }}
                data-atropos-offset="5"
              >
                {name}
              </p>
              <p
                className={styles.recentlyP}
                style={{
                  textTransform: "uppercase",
                  fontSize: `${fontSizeAmount}px`,
                }}
                data-atropos-offset="5"
              >
                {color}
              </p>
            </div>
          </div>
        </div>
      </Link>
    );
  } else {
    return (
      <>
        {isLoaderColor ? (
          <Loader />
        ) : (
          <Link
            href={`/gallery/${path}`}
            style={{
              textDecoration: "none",
              marginRight: marginRight ? "2rem" : null,
            }}
          >
            <div
              className={styles.recentlyContainer}
              style={{
                borderColor: `${color}`,
                marginRight: marginRight ? "2rem" : null,
              }}
            >
              <div className={styles.containerContent}>
                <div className={styles.recentlyHeader}>
                  <div className={styles.flexContent}>
                    <div className={styles.logo}>
                      <Image
                        src={"/images/logo.png"}
                        alt="logo NFTs"
                        data-atropos-offset="5"
                        layout="fill"
                        objectFit="contain"
                      />
                    </div>
                  </div>
                  <div className={styles.address} data-atropos-offset="5">
                    {number}
                  </div>
                </div>
                <div
                  className={styles.backgroundContainer}
                  style={{ background: `${color}` }}
                  data-atropos-offset="-0.5"
                ></div>
                <div className={styles.recentlyHeader}>
                  <p
                    className={styles.recentlyP}
                    style={{
                      fontSize: `${fontSizeAmount}px`,
                    }}
                    data-atropos-offset="5"
                  >
                    {name}
                  </p>
                  <p
                    className={styles.recentlyP}
                    style={{
                      textTransform: "uppercase",
                      fontSize: `${fontSizeAmount}px`,
                    }}
                    data-atropos-offset="5"
                  >
                    {color}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        )}
      </>
    );
  }
};
