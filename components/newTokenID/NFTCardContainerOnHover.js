import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import Atropos from "atropos/react";
import "atropos/css";

const NFTCardContainerOnHover = ({
    id,
    name,
    color,
    number,
    displayCard,
    cardId,
  }) => {
    const [fontSizeAmount, setFontSizeAmount] = useState("25");
    const [width, setWidth] = useState(window.innerWidth);
    useEffect(() => {
      const handleResize = () => {
        let widthDimension = window.innerWidth;
        setWidth(widthDimension);
      };
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);
    useEffect(() => {
      if (name) {
        if (name.length < 10) {
          setFontSizeAmount(`${width < 350 ? "17.6" : "20"}`);
        } else if (name.length > 9 && name.length < 15) {
          setFontSizeAmount(`${width < 350 ? "16" : "17"}`);
        } else {
          setFontSizeAmount(`${width < 350 ? "12.8" : "12"}`);
        }
      }
      // eslint-disable-next-line
    }, [name]);
    //
    //
  
    const { whiteBorders } = useSelector((state) => state.minting);
    return (
      <Link href={`/gallery/color-nft/${id}`} passHref>
        <Atropos
          activeOffset={40}
          shadow={false}
          className="right_position"
          style={{ margin: "-12.5px 0 0 -12.5px" }}
        >
          <div
            className="recentlyContainer"
            style={{
              borderColor: `${whiteBorders.includes(color) ? "#1c1c1c" : color}`,
              textDecoration: "none",
              display:
                displayCard && cardId === color.slice(1) ? "block" : "none",
              background: "#000",
            }}
          >
            <div className="containerContent">
              <div
                className="recentlyHeader"
                style={{
                  borderBottom: `${
                    whiteBorders.includes(color) ? "3px solid #1c1c1e" : "none"
                  }`,
                }}
              >
                <div className="flex_cardContainer">
                  <div className="logo_cardImage">
                    <Image
                      src={"/images/logo.png"}
                      alt="logo NFTs"
                      data-atropos-offset="5"
                      layout="fill"
                      objectFit="contain"
                    />
                  </div>
                </div>
                <div className="address" data-atropos-offset="5">
                  {number}
                </div>
              </div>
              <div
                className="backgroundContainer"
                style={{ background: `${color}` }}
              ></div>
              <div
                className="recentlyHeader"
                style={{
                  borderTop: `${
                    whiteBorders.includes(color) ? "3px solid #1c1c1e" : "none"
                  }`,
                  marginTop: "3px",
                }}
              >
                <div
                  className="recentlyP"
                  style={{
                    fontSize: `${fontSizeAmount}px`,
                  }}
                >
                  {name}
                </div>
                <div
                  className="recentlyP margin_right"
                  style={{
                    textTransform: "uppercase",
                    fontSize: `${fontSizeAmount}px`,
                    color: "#fff",
                  }}
                >
                  {color}
                </div>
              </div>
            </div>
          </div>
        </Atropos>
      </Link>
    );
  };
  
  export default NFTCardContainerOnHover;