import React, { useState, useEffect } from "react";
import styles from "../../styles/modules/gallery/single.module.css";
import { BACKEND } from "../../utils/constants";
const { randomHexColor } = require("random-hex-color-generator");

import axios from "axios";
import Loader from "../Loader/Loader";
import { useRouter } from "next/router";
import Web3 from "web3";
const { contrastColor } = require("contrast-color");

const TheBlockStaging = (data) => {
  const router = useRouter();
  const { token } = router.query;
  // const [getData, setGetData] = useState([])
  const [nftNumber, setNftNumber] = useState([]);
  const [nftNumberWhite, setNftNumberWhite] = useState([]);
  const [nftNumberContrast, setNftNumberContrast] = useState([]);
  const [nftNumberContrastWhite, setNftNumberContrastWhite] = useState([]);

  const web3Number = Web3.utils.numberToHex(token);

  useEffect(async () => {
    debugger;
    if (nftNumber) {
      try {
        const response = await axios.post(
          "https://sync.api.bannerbear.com/v2/images",
          {
            template: "YJBpekZXmGd52XPnOA",
            modifications: [
              {
                name: "BottomText",
                text: "You can change this text",
                color: null,
                background: null,
              },
              {
                name: "LeftText",
                color: null,
                text: "You can change this text",
                background: null,
              },
              {
                name: "TopBg",
                text: "The Times",
                color: null,
                background: null,
              },
              {
                name: "BGcolor",
                color: null,
              },
              {
                name: "StrokeText",
                color: null,
              },
              {
                name: "ChosenColorBlock",
                color: data?.data?.hex
                  ? data?.data?.hex
                  : data?.data?.base_color,
              },
              {
                name: "Date",
                text: "03/Jan/2009",
                color: null,
                background: null,
              },
              {
                name: "MiddleText",
                text: "Chancellor on brink of second bailout for banks",
                color: null,
                background: null,
              },
              {
                name: "Title",
                text: "The Times",
                color: null,
                background: null,
              },
            ],
            webhook_url: `${BACKEND}/api/v1/image/bannerbear/image`,
            transparent: false,
            metadata: null,
          },
          {
            headers: {
              Authorization: "Bearer nqng9EAoa8B9jQmU1m4QEwtt",
            },
          }
        );
        setNftNumber(response);
      } catch (error) {
        console.log(error);
      }
    }
  }, []);
  //
  const receivedColorContrast = contrastColor({ bgColor: data.data.hex });
  useEffect(async () => {
    debugger;
    if (nftNumberContrast) {
      try {
        const response = await axios.post(
          "https://sync.api.bannerbear.com/v2/images",
          {
            template: "YJBpekZXmGd52XPnOA",
            modifications: [
              {
                name: "BottomText",
                text: "You can change this text",
                color: null,
                background: null,
              },
              {
                name: "LeftText",
                color: null,
                text: "You can change this text",
                background: null,
              },
              {
                name: "TopBg",
                text: "The Times",
                color: null,
                background: null,
              },
              {
                name: "BGcolor",
                color: null,
              },
              {
                name: "StrokeText",
                color: "#fff",
              },
              {
                name: "ChosenColorBlock",
                color: data?.data?.hex
                  ? data?.data?.hex
                  : data?.data?.base_color,
              },
              {
                name: "Date",
                text: "03/Jan/2009",
                color: receivedColorContrast,
                background: null,
              },
              {
                name: "MiddleText",
                text: "Chancellor on brink of second bailout for banks",
                color: receivedColorContrast,
                background: null,
              },
              {
                name: "Title",
                text: "The Times",
                color: receivedColorContrast,
                background: null,
              },
            ],
            webhook_url: `${BACKEND}/api/v1/image/bannerbear/image`,
            transparent: false,
            metadata: null,
          },
          {
            headers: {
              Authorization: "Bearer nqng9EAoa8B9jQmU1m4QEwtt",
            },
          }
        );
        setNftNumberContrast(response);
      } catch (error) {
        console.log(error);
      }
    }
  }, []);
  // black border with white background
  useEffect(async () => {
    debugger;
    if (nftNumber) {
      try {
        const response = await axios.post(
          "https://sync.api.bannerbear.com/v2/images",
          {
            template: "YJBpekZXmGd52XPnOA",
            modifications: [
              {
                name: "BottomText",
                text: "You can change this text",
                color: null,
                background: null,
              },
              {
                name: "LeftText",
                color: null,
                text: "You can change this text",
                background: null,
              },
              {
                name: "TopBg",
                text: "The Times",
                color: null,
                background: null,
              },
              {
                name: "BGcolor",
                color: "#fff",
              },
              {
                name: "StrokeText",
                color: "#000",
              },
              {
                name: "ChosenColorBlock",
                color: data?.data?.hex
                  ? data?.data?.hex
                  : data?.data?.base_color,
              },
              {
                name: "Date",
                text: "03/Jan/2009",
                color: null,
                background: null,
              },
              {
                name: "MiddleText",
                text: "Chancellor on brink of second bailout for banks",
                color: null,
                background: null,
              },
              {
                name: "Title",
                text: "The Times",
                color: null,
                background: null,
              },
            ],
            webhook_url: `${BACKEND}/api/v1/image/bannerbear/image`,
            transparent: false,
            metadata: null,
          },
          {
            headers: {
              Authorization: "Bearer nqng9EAoa8B9jQmU1m4QEwtt",
            },
          }
        );
        setNftNumberWhite(response);
      } catch (error) {
        console.log(error);
      }
    }
  }, []);
  useEffect(async () => {
    debugger;
    if (nftNumberContrast) {
      try {
        const response = await axios.post(
          "https://sync.api.bannerbear.com/v2/images",
          {
            template: "YJBpekZXmGd52XPnOA",
            modifications: [
              {
                name: "BottomText",
                text: "You can change this text",
                color: null,
                background: null,
              },
              {
                name: "LeftText",
                color: null,
                text: "You can change this text",
                background: null,
              },
              {
                name: "TopBg",
                text: "The Times",
                color: null,
                background: null,
              },
              {
                name: "BGcolor",
                color: "#fff",
              },
              {
                name: "StrokeText",
                color: "#000",
              },
              {
                name: "ChosenColorBlock",
                color: data?.data?.hex
                  ? data?.data?.hex
                  : data?.data?.base_color,
              },
              {
                name: "Date",
                text: "03/Jan/2009",
                color: receivedColorContrast,
                background: null,
              },
              {
                name: "MiddleText",
                text: "Chancellor on brink of second bailout for banks",
                color: receivedColorContrast,
                background: null,
              },
              {
                name: "Title",
                text: "The Times",
                color: receivedColorContrast,
                background: null,
              },
            ],
            webhook_url: `${BACKEND}/api/v1/image/bannerbear/image`,
            transparent: false,
            metadata: null,
          },
          {
            headers: {
              Authorization: "Bearer nqng9EAoa8B9jQmU1m4QEwtt",
            },
          }
        );
        setNftNumberContrastWhite(response);
      } catch (error) {
        console.log(error);
      }
    }
  }, []);
  return (
    <>
      <section
        className={`single_page_wrapper single-gallery ${styles.wrapper}`}
      >
        <article
          style={{
            width: "100%",
            position: "relative",
            display: "flex",
            flexWrap: "wrap",
          }}
        >
          {!nftNumber?.data?.image_url_png && (
            <div
              style={{
                position: "absolute",
                width: "100%",
                height: "80vh",
                right: "0",
                left: "0",
                background: "#000000",
              }}
            >
              <Loader />
            </div>
          )}
          <div
            style={{
              minHeight: "100vh",
              display: "block",
              width: "50%",
              padding: "2rem 0",
            }}
          >
            <div style={{ maxWidth: "400px", margin: "0 auto" }}>
              <h1 className={styles.blockHeader}>ORIGINAL</h1>
              <img
                src={
                  nftNumber?.data?.image_url_png
                    ? nftNumber?.data?.image_url_png
                    : null
                }
                alt={""}
                style={{ width: "100%" }}
              />
            </div>
            <div style={{ maxWidth: "400px", margin: "0 auto" }}>
              <h1 className={styles.blockHeader}>CONSTRAST-COLOR</h1>
              <img
                src={
                  nftNumberContrast?.data?.image_url_png
                    ? nftNumberContrast?.data?.image_url_png
                    : null
                }
                alt={""}
                style={{ width: "100%" }}
              />
            </div>
          </div>
          <div
            style={{
              minHeight: "100vh",
              display: "block",
              width: "50%",
              background: "#fff",
              padding: "2rem 0",
            }}
          >
            <div style={{ maxWidth: "400px", margin: "0 auto" }}>
              <h1 className={styles.blockHeader} style={{ color: "#000" }}>
                ORIGINAL
              </h1>
              <img
                src={
                  nftNumberWhite?.data?.image_url_png
                    ? nftNumberWhite?.data?.image_url_png
                    : null
                }
                alt={""}
                style={{ width: "100%" }}
              />
            </div>
            <div style={{ maxWidth: "400px", margin: "0 auto" }}>
              <h1 className={styles.blockHeader} style={{ color: "#000" }}>
                CONSTRAST-COLOR
              </h1>
              <img
                src={
                  nftNumberContrastWhite?.data?.image_url_png
                    ? nftNumberContrastWhite?.data?.image_url_png
                    : null
                }
                alt={""}
                style={{ width: "100%" }}
              />
            </div>
          </div>
        </article>
      </section>
    </>
  );
};

export default TheBlockStaging;
