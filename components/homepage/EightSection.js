import React, { useEffect, useRef, useState } from "react";
import { BsDiscord } from "react-icons/bs";
import { AiFillTwitterCircle } from "react-icons/ai";
import styles from "../../styles/modules/homepage/eightSection.module.css";
import Toggle from "react-toggle";
import { useInViewport } from "react-in-viewport";
import { randomHexColor } from "random-hex-color-generator";
import CountTo from "react-count-to";
import { GLOBAL_NFT_USD_VOLUME } from "../../utils/constants";
import axios from "axios";

const EightSection = () => {
  const [isToggled, setIsToggled] = useState(true);
  const volumeRef = useRef();
  const { inViewport } = useInViewport(volumeRef);
  const [ethUSD, setEthUSD] = useState();
  const [ethVolume, setEthVolume] = useState();
  const [ethUSDPrice, setEthUSDPrice] = useState();
  useEffect(() => {
    const fetchData = async () => {
      await axios(
        "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD"
      )
        .then((res) => {
          setEthUSD(res.data.USD);
          let fixEthPrice = (res.data.USD * 6.1775) / 2;
          setEthUSDPrice(fixEthPrice.toFixed(2));
        })
        .catch((err) => console.log(err));
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (ethUSD) {
      console.log(ethUSD);
      const value = ethUSD;
      const nft = parseInt(GLOBAL_NFT_USD_VOLUME);
      let finalInfo = nft / value;
      finalInfo = Math.floor(finalInfo);
      setEthVolume(finalInfo);
    }
  }, [ethUSD]);
  const USDVOLUME = (GLOBAL_NFT_USD_VOLUME) => {
    const finalColor = GLOBAL_NFT_USD_VOLUME.replace(
      /\B(?=(\d{3})+(?!\d))/g,
      ","
    ).split("");
    return (
      <span>
        {finalColor.map((i, index) => {
          return (
            <span key={index} style={{ color: randomHexColor() }}>
              {i}
            </span>
          );
        })}
      </span>
    );
  };
  const ETHVOLUME = (ethVolume) => {
    const finalColor = ethVolume
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      .split("");
    return (
      <span>
        {" "}
        {finalColor.map((i, index) => {
          return (
            <span key={index} style={{ color: randomHexColor() }}>
              {i}
            </span>
          );
        })}
      </span>
    );
  };
  return (
    <>
      <div className={styles.openSea_wrapper}>
        <section className={styles.openSea}>
          <div className={styles.community_connect_socials_flex}>
            <a
              target="_blank"
              href="https://discord.gg/colormuseum"
              rel="noreferrer"
            >
              <BsDiscord />
              Join Discord
            </a>
            <a
              target="_blank"
              href="https://twitter.com/colordotmuseum"
              rel="noreferrer"
            >
              <AiFillTwitterCircle />
              Follow on Twitter
            </a>
          </div>
          {/* <div className={styles.openSea_box}>
            <div className={styles.box_inner}>
              <h1>Let's build a better OpenSea, together.</h1>
              <p>Connect with the team and work with us. </p>
              <p>
                Mint a Color NFT and you’ll get access to the exclusive
                #collectors channel on Discord where you’ll help drive the
                design, development and marketing for the Color Museum project.
              </p>
              <p>
                <b>Contribute user research.</b> Tell us what you like and don’t
                like about OpenSea and your current NFT collecting and trading
                experience.
              </p>
              <p>
                You speak, we act. You tell, we learn. We develop prototypes,
                you test and have your feedback incorporated into our processes
                so we can ship a next generation NFT platform.
              </p>
              <p>
                Plus, get constant updates on the roadmap direct from the team.
              </p>
              <h1>We build in public for the public.</h1>
              <p style={{ marginBottom: "0" }}>
                <b>New to crypto or NFTs?</b> No worries, we’ll help you get up
                to speed. Your beginner’s mind will help inform our strategy and
                product to onboard new collectors and traders and grow the
                market.
              </p>
            </div>
          </div> */}
        </section>
      </div>
      <section className={styles.slice_image_container}>
        <article>
          <div className={styles.slice_flex}>
            <p>24 HOUR GLOBAL NFT VOLUME</p>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Toggle
                defaultChecked={isToggled}
                icons={false}
                onChange={() => setIsToggled(!isToggled)}
              />
              {isToggled ? <p>USD VOLUME</p> : <p>ETH VOLUME</p>}
            </div>
          </div>

          {isToggled ? (
            <h1 className={styles.plaidFont} ref={volumeRef}>
              {inViewport && (
                <>
                  <span style={{ color: randomHexColor() }}>$</span>
                  <CountTo to={parseInt(GLOBAL_NFT_USD_VOLUME)} speed={1000}>
                    {USDVOLUME}
                  </CountTo>
                </>
              )}
            </h1>
          ) : (
            ethVolume && (
              <h1 className={styles.plaidFont} ref={volumeRef}>
                {inViewport && (
                  <>
                    <CountTo to={ethVolume} speed={1000}>
                      {ETHVOLUME}
                    </CountTo>
                    &nbsp;
                    <span style={{ color: randomHexColor() }}>E</span>
                    <span style={{ color: randomHexColor() }}>t</span>
                    <span style={{ color: randomHexColor() }}>h</span>
                    <span style={{ color: randomHexColor() }}>e</span>
                    <span style={{ color: randomHexColor() }}>r</span>
                  </>
                )}
              </h1>
            )
          )}
          <h2>LET'S GET OUR SLICE.</h2>
        </article>
      </section>
    </>
  );
};

export default EightSection;
