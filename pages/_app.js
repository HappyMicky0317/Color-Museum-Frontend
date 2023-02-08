import "../styles/globals.css";
import Nav from "../components/navbar";
import { storeWrapper } from "../store";
import { Dock } from "../components/navbar/Dock/Dock";
import Footer from "../components/footer/Footer";
import Web3 from "web3";
import { Web3ReactProvider } from "@web3-react/core";
import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  BlacklistedHex,
  BlacklistedName,
  ColorChange,
  ColorsAlreadyMinted,
  DescriptionChange,
  GasPrice,
  HexToNumber,
  NameChange,
} from "../store/actions/toggle";
import { randomHexColor } from "random-hex-color-generator";
import Loader from "../components/Loader/Loader";
import Router from "next/router";
import styles from "../styles/modules/homepage/firstSection.module.css";
import Head from "next/head";
import TagManager from "react-gtm-module";
import Gleap from "gleap";
import { Toaster } from "react-hot-toast";

const Web3Utils = require("web3-utils");

const getLibrary = (provider) => {
  return new Web3(provider);
};

function MyApp({ Component, pageProps, data }) {
  useEffect(() => {
    TagManager.initialize({ gtmId: "GTM-PB9P7KR" });
  }, []);

  const { choosenColorFinal } = useSelector((state) => state.minting);
  const { fullWidthPage } = useSelector((state) => state.toggle);

  const dispatch = useDispatch();
  useEffect(() => {
    const handleColors = async () => {
      var data;
      try {
        data = await axios("https://metadata.color.museum/api/v1/image/");
      } catch (e) {}
      dispatch(ColorsAlreadyMinted(data.data.array));
    };
    handleColors();
    dispatch(BlacklistedHex());
    dispatch(BlacklistedName());
    //
    //
    const handleGas = async () => {
      await axios("https://api.gasprice.io/v1/estimates").then((res) => {
        dispatch(
          GasPrice((res.data.result.instant.feeCap * 1000000000).toFixed(0))
        );
      });
    };
    handleGas();
    //
    //
    if (localStorage.getItem("choosenColor")) {
      let value = localStorage.getItem("choosenColor").split(", ");
      dispatch(ColorChange(value[0].slice(7, 14)));
      if (value[1]) {
        dispatch(NameChange(value[1].slice(6)));
      }
      if (value[2]) {
        dispatch(DescriptionChange(value[2].slice(13)));
      }
    } else if (choosenColorFinal.length === 0) {
      const color = randomHexColor();
      dispatch(ColorChange(color));
    }
  }, []);
  //
  //
  useEffect(() => {
    if (choosenColorFinal !== "") {
      let color = choosenColorFinal.slice(1, choosenColorFinal.length);
      color = Web3Utils.hexToNumber(`0x${color}`);
      dispatch(HexToNumber(color));
    }
  }, [choosenColorFinal]);

  const [pageLoading, setPageLoading] = useState(false);

  useEffect(() => {
    Router.onRouteChangeStart = (url) => {
      // Some page has started loading
      setPageLoading(true);
    };

    Router.onRouteChangeComplete = (url) => {
      // Some page has finished loading
      setPageLoading(false);
    };

    Router.onRouteChangeError = (err, url) => {
      // an error occurred.
      setPageLoading(true);
    };
  }, []);

  useEffect(() => {
    // Run within useEffect to execute this code on the frontend.
    Gleap.initialize("hjFQgtr4guUqv8p9TLyiyF24mu3Ou3l3");
  }, []);

  useEffect(() => {
    Router.pathname === "/trade" && Router.push("/gallery/color-nft");
    Router.pathname === "/mint-colors" && Router.push("/choose");
  }, []);

  return (
    <>
      <Head>
        <meta charset="utf-8" />
        <link rel="icon" href="%PUBLIC_URL%/favicon.ico" type="image/x-icon" />
        <link
          rel="shortcut icon"
          type="image/x-icon"
          href="%PUBLIC_URL%/favicon.ico"
        />
        <link rel="icon" href="/favicon-16x16.png" sizes="16x16" />
        <link rel="icon" href="/favicon-32x32.png" sizes="32x32" />
        <link rel="icon" href="/favicon-150x150.png" sizes="150x150" />
        <link rel="icon" href="/favicon-192x192.png" sizes="192x192" />
        <link rel="icon" href="/favicon-512x512.png" sizes="512x512" />

        <link rel="apple-touch-icon" href="apple-touch-icon.png" />
        <link href="%PUBLIC_URL%/colorMuseumMetaImage.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
        <title data-react-helmet="true">
          Color Museum | NFT Marketplace and Launchpad
        </title>
        <meta
          name="title"
          content="Color NFT by Color Museum"
          data-react-helmet="true"
        />
        <meta
          name="description"
          content="Own and earn royalties from color on the Ethereum blockchain."
          data-react-helmet="true"
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.color.museum" />
        <meta
          property="og:title"
          content="Color NFT by Color Museum"
          data-react-helmet="true"
        />
        <meta
          property="og:description"
          content="Own and earn royalties from color on the Ethereum blockchain."
          data-react-helmet="true"
        />
        <meta
          property="og:image"
          content="https://color.museum/colorMuseumMetaImage.png"
          data-react-helmet="true"
        />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://www.color.museum" />
        <meta
          property="twitter:title"
          content="Color NFT by Color Museum"
          data-react-helmet="true"
        />
        <meta
          property="twitter:description"
          content="Own and earn royalties from color on the Ethereum blockchain."
          data-react-helmet="true"
        />
        <meta
          property="twitter:image"
          content="https://color.museum/colorMuseumMetaImage.png"
          data-react-helmet="true"
        />
      </Head>
      <>
        {
          // isMobile ? (
          //   <>
          //     {/* <Nav /> */}
          //     <section>
          //       <MobileOnly />
          //     </section>
          //     {/* <Footer /> */}
          //   </>
          // ) :
          !pageLoading ? (
            <Web3ReactProvider getLibrary={getLibrary}>
              <Nav />
              {fullWidthPage ? (
                <>
                  <section className="fullwrapper">
                    <Component {...pageProps} />
                    <Dock />
                  </section>
                  <Footer />
                </>
              ) : (
                <>
                  <section className="wrapper">
                    <Component {...pageProps} />
                    <Dock />
                    <div className="overflow_modal" id="overflow_modal" />
                  </section>
                  <Footer />
                </>
              )}
            </Web3ReactProvider>
          ) : (
            <div className={styles.fullPageLoader}>
              <Loader />
            </div>
          )
        }
        <Toaster position="top-center" />
      </>
    </>
  );
}

export default storeWrapper.withRedux(MyApp);
