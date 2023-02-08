import React, { useEffect, useState } from "react";
import stylesChoose from "../../styles/modules/choose/choose.module.css";
import stylesNav from "../../styles/modules/nav.module.css";
import styles from "../../styles/modules/name/name.module.css";
import { nameJson, colorsJson } from "../../utils/pantone-colors.json";
import coatedNames from "pantoner/json/pantone-coated.json";
import colorOfTheYear from "pantoner/json/pantone-color-of-the-year.json";
import metallicNames from "pantoner/json/pantone-metallic.json";
import pastelsNames from "pantoner/json/pantone-pastels-neons.json";
import skinNames from "pantoner/json/pantone-skin.json";
import uncoatedNames from "pantoner/json/pantone-uncoated.json";
import { useSelector, useDispatch } from "react-redux";
import {
  ColorMintedOff,
  NameChange,
  VioletedOff,
  WarningOff,
} from "../../store/actions/toggle";
import { IoCloseSharp } from "react-icons/io5";

import { BACKEND } from "../../utils/constants";
import { useRouter } from "next/router";
import axios from "axios";
import toast from "react-hot-toast";
const Web3Utils = require("web3-utils");

const Name = () => {
  const {
    choosenColorFinal,
    choosenNameFinal,
    blackListedNAME,
    blackListedHEX,
  } = useSelector((state) => state.minting);
  const { warning, alreadyMintedColors } = useSelector(
    (state) => state.warning
  );
  const [fontSizeAmount, setFontSizeAmount] = useState("32");
  const [fontSizeAmountMobile, setFontSizeAmountMobile] = useState("22");
  useEffect(() => {
    if (choosenNameFinal.length < 20) {
      setFontSizeAmount("32");
      setFontSizeAmountMobile("22");
    } else {
      setFontSizeAmount("26");
      setFontSizeAmountMobile("17");
    }
  }, [choosenNameFinal]);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const indexOfColors = nameJson.indexOf(
      choosenNameFinal
        .trim()
        .replace(/\s+/g, " ")
        .replaceAll(" ", "-")
        .toLowerCase()
    );
    const filteredCoated = coatedNames.filter((item) => {
      return (
        item.pantone.toLowerCase() ===
          choosenNameFinal
            .trim()
            .replace(/\s+/g, " ")
            .replaceAll(" ", "-")
            .toLowerCase() &&
        item.hex.toLowerCase() === choosenColorFinal.toLowerCase()
      );
    });
    const filteredYear = colorOfTheYear.filter((item) => {
      return (
        item.pantone.toLowerCase() ===
          choosenNameFinal
            .trim()
            .replace(/\s+/g, " ")
            .replaceAll(" ", "-")
            .toLowerCase() &&
        item.hex.toLowerCase() === choosenColorFinal.toLowerCase()
      );
    });
    const filteredMetallic = metallicNames.filter((item) => {
      return (
        item.pantone.toLowerCase() ===
          choosenNameFinal
            .trim()
            .replace(/\s+/g, " ")
            .replaceAll(" ", "-")
            .toLowerCase() &&
        item.hex.toLowerCase() === choosenColorFinal.toLowerCase()
      );
    });
    const filteredPastels = pastelsNames.filter((item) => {
      return (
        item.pantone.toLowerCase() ===
          choosenNameFinal
            .trim()
            .replace(/\s+/g, " ")
            .replaceAll(" ", "-")
            .toLowerCase() &&
        item.hex.toLowerCase() === choosenColorFinal.toLowerCase()
      );
    });
    const filteredSkin = skinNames.filter((item) => {
      return (
        item.pantone.toLowerCase() ===
          choosenNameFinal
            .trim()
            .replace(/\s+/g, " ")
            .replaceAll(" ", "-")
            .toLowerCase() &&
        item.hex.toLowerCase() === choosenColorFinal.toLowerCase()
      );
    });
    const filteredUncoated = uncoatedNames.filter((item) => {
      return (
        item.pantone.toLowerCase() ===
          choosenNameFinal
            .trim()
            .replace(/\s+/g, " ")
            .replaceAll(" ", "-")
            .toLowerCase() &&
        item.hex.toLowerCase() === choosenColorFinal.toLowerCase()
      );
    });
    if (!choosenNameFinal) {
      toast((t) => (
        <div className={stylesNav.toastComman}>
          You haven't set a name to your color.
          <IoCloseSharp
            size={25}
            onClick={() => {
              toast.dismiss(t.id);
            }}
          />
        </div>
      ));
      e.preventDefault();
    } else {
      if (blackListedNAME.includes(choosenNameFinal.trim().toLowerCase())) {
        toast((t) => (
          <div className={stylesNav.toastComman}>
            Using this metadata may violate intellectual property rights.
            <IoCloseSharp
              size={25}
              onClick={() => {
                toast.dismiss(t.id);
              }}
            />
          </div>
        ));
        e.preventDefault();
      } else if (
        nameJson.includes(
          choosenNameFinal
            .trim()
            .replace(/\s+/g, " ")
            .replaceAll(" ", "-")
            .toLowerCase()
        ) &&
        colorsJson[indexOfColors].toLowerCase() ===
          choosenColorFinal.toLowerCase()
      ) {
        toast((t) => (
          <div className={stylesNav.toastComman}>
            Using this metadata may violate intellectual property rights.
            <IoCloseSharp
              size={25}
              onClick={() => {
                toast.dismiss(t.id);
              }}
            />
          </div>
        ));
        e.preventDefault();
      } else if (
        filteredCoated.length > 0 ||
        filteredYear.length > 0 ||
        filteredMetallic.length > 0 ||
        filteredPastels.length > 0 ||
        filteredSkin.length > 0 ||
        filteredUncoated.length > 0
      ) {
        toast((t) => (
          <div className={stylesNav.toastComman}>
            Using this metadata may violate intellectual property rights.
            <IoCloseSharp
              size={25}
              onClick={() => {
                toast.dismiss(t.id);
              }}
            />
          </div>
        ));
        e.preventDefault();
      } else {
        e.preventDefault();
        try {
          const result = await axios.get(
            `${BACKEND}/api/v1/image/name-check/${choosenNameFinal.trim()}`
          );
          if (result.data.isNameUsed) {
            e.preventDefault();
            toast((t) => (
              <div className={stylesNav.toastComman}>
                Sorry, this name is already in use by another color.
                <IoCloseSharp
                  size={25}
                  onClick={() => {
                    toast.dismiss(t.id);
                  }}
                />
              </div>
            ));
          } else {
            const profanity_result = await axios.get(
              `${BACKEND}/api/v1/image/clean-check/${choosenNameFinal.trim()}`
            );
            if (profanity_result.data.isClean) {
              e.preventDefault();
              router.push("/describe");
              localStorage.setItem(
                "choosenColor",
                `color: ${choosenColorFinal}, name: ${choosenNameFinal.trim()}`
              );
            } else {
              e.preventDefault();
              toast((t) => (
                <div className={stylesNav.toastComman}>
                  Sorry, profanity is not tolerated. Be more creative.
                  <IoCloseSharp
                    size={25}
                    onClick={() => {
                      toast.dismiss(t.id);
                    }}
                  />
                </div>
              ));
            }
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
  };
  //
  //
  useEffect(() => {
    if (choosenColorFinal) {
      if (blackListedHEX.includes(choosenColorFinal.toUpperCase())) {
        router.push("/choose");
        toast((t) => (
          <div className={stylesNav.toastComman}>
            Using this metadata may violate intellectual property rights.
            <IoCloseSharp
              size={25}
              onClick={() => {
                toast.dismiss(t.id);
              }}
            />
          </div>
        ));
      } else if (alreadyMintedColors) {
        if (
          alreadyMintedColors.includes(
            Web3Utils.hexToNumber(
              `0x${choosenColorFinal.slice(1, choosenColorFinal.length)}`
            )
          )
        ) {
          router.push("/choose");
          toast((t) => (
            <div className={stylesNav.toastComman}>
              Sorry, this color has already been minted.
              <IoCloseSharp
                size={25}
                onClick={() => {
                  toast.dismiss(t.id);
                }}
              />
            </div>
          ));
        }
      } else {
        dispatch(VioletedOff());
        dispatch(ColorMintedOff());
      }
    }
  }, []);
  //
  //
  useEffect(() => {
    if (choosenColorFinal) {
      const fetchData = async () => {
        await axios(`https://api.color.pizza/v1/${choosenColorFinal.slice(1)}`)
          .then((res) => {
            if (res.data.colors.length > 1) {
              return;
            } else {
              dispatch(NameChange(res.data.colors[0].name));
            }
          })
          .catch((err) => console.log(err));
      };
      fetchData();
    }
  }, [choosenColorFinal]);
  return (
    <>
      <article className={styles.text_container}>
        <h1 className={stylesChoose.header}>Name your color</h1>
        <p className={stylesChoose.description}>
          Give your color a name that will echo through eternity.
        </p>
        <div
          className={styles.mobile_picker}
          style={{
            backgroundColor: `${choosenColorFinal}`,
          }}
        >
          <div className={styles.hexidecimal_mobile}>
            <p style={{ fontSize: `${fontSizeAmountMobile}px` }}>
              {choosenNameFinal}
            </p>
            <p
              style={{
                fontSize: `${fontSizeAmountMobile}px`,
                textAlign: "right",
              }}
            >
              {choosenColorFinal}
            </p>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            className={styles.type_input}
            value={choosenNameFinal}
            onChange={(e) => {
              dispatch(NameChange(e.target.value));
              if (warning) {
                dispatch(WarningOff());
              }
            }}
            placeholder="Type it here"
            type="text"
            maxLength="30"
          ></input>
          <div className={styles.flex}>
            <button className={styles.button} type="submit">
              Use this name
            </button>
            <p className={styles.maximum}>30 character maximum</p>
          </div>
        </form>
      </article>
      <div
        className={stylesChoose.color}
        style={{ backgroundColor: `${choosenColorFinal}` }}
      >
        <div className={stylesChoose.hexidecimal}>
          <p style={{ fontSize: `${fontSizeAmount}px` }}>{choosenNameFinal}</p>
          <p style={{ fontSize: `${fontSizeAmount}px` }}>{choosenColorFinal}</p>
        </div>
      </div>
      <div className={stylesChoose.lineSide} />
    </>
  );
};

export default Name;
