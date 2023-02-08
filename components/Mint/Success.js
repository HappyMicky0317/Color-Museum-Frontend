import React, { useEffect, useState } from "react";
import styles from "../../styles/modules/mint/success.module.css";
import stylesName from "../../styles/modules/name/name.module.css";
import stylesChoose from "../../styles/modules/choose/choose.module.css";
import stylesMint from "../../styles/modules/mint/mintPage.module.css";
import stylesPending from "../../styles/modules/mint/pending.module.css";
import { useSelector } from "react-redux";
import Link from "next/link";
import { FaGasPump } from "react-icons/fa";
import axios from "axios";
import { BACKEND, TOKEN } from "../../utils/constants";

const Success = () => {
  const {
    choosenColorFinal,
    choosenNameFinal,
    gasPrice,
    transactionHash,
    hexToNumber,
    connectedAddress,
    choosenDescriptionFinal,
  } = useSelector((state) => state.minting);
  //
  //
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
  //
  //
  const mintAnother = () => {
    localStorage.removeItem("choosenColor");
  };
  //
  //
  const [nftNumber, setNftNumber] = useState();
  useEffect(() => {
    const handleData = async () => {
      await axios(`${BACKEND}/api/v1/image/nft/no`).then((res) =>
        setNftNumber(res.data.nftNo)
      );
    };
    handleData();
  }, []);
  const postColor = async (body) => {
    try {
      await axios.post(`${BACKEND}/api/v1/image/confirmed`, body, {
        headers: {
          "auth-token": TOKEN,
        },
      });
      localStorage.clear("mintingAddress");
      localStorage.clear("mintingTransactionHash");
      localStorage.clear("mintingName");
      localStorage.clear("mintingColor");
      localStorage.clear("mintingDescription");
      localStorage.clear("mintingHexToNumber");
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (nftNumber) {
      const handleData = async () => {
        const formdata = new FormData();
        try {
          const response = await axios.post(
            "https://api.bannerbear.com/v2/collections",
            {
              template_set: "w5vyp8rbOqPzPmQaDK",
              modifications: [
                {
                  name: "BottomBg",
                  color: null,
                },
                {
                  name: "TopBgPatch",
                  color: null,
                },
                {
                  name: "TopBg",
                  color: null,
                },
                {
                  name: "HEX",
                  text: choosenColorFinal
                    ? choosenColorFinal
                    : localStorage.getItem("mintingColor")
                    ? localStorage.getItem("mintingColor")
                    : null,
                  color: null,
                  background: null,
                },
                {
                  name: "CardName",
                  text: choosenNameFinal
                    ? choosenNameFinal
                    : localStorage.getItem("mintingName")
                    ? localStorage.getItem("mintingName")
                    : null,
                  color: null,
                  background: null,
                },
                {
                  name: "chosenColorBlock",
                  color: choosenColorFinal
                    ? choosenColorFinal
                    : localStorage.getItem("mintingColor")
                    ? localStorage.getItem("mintingColor")
                    : null,
                },
                {
                  name: "CardNo",
                  text: nftNumber,
                  color: null,
                  background: null,
                },
                {
                  name: "backgroundRoundCorners",
                  color: null,
                },
                {
                  name: "borderColor",
                  color: choosenColorFinal
                    ? choosenColorFinal
                    : localStorage.getItem("mintingColor")
                    ? localStorage.getItem("mintingColor")
                    : null,
                },
                {
                  name: "borderColorFiller",
                  color: null,
                },
                {
                  name: "nftNo",
                  text: nftNumber,
                  color: null,
                  background: null,
                },
                {
                  name: "colorName",
                  text: choosenNameFinal
                    ? choosenNameFinal
                    : localStorage.getItem("mintingName")
                    ? localStorage.getItem("mintingName")
                    : null,
                  color: null,
                  background: null,
                },
                {
                  name: "colorHexidecimal",
                  text: choosenColorFinal
                    ? choosenColorFinal
                    : localStorage.getItem("mintingColor")
                    ? localStorage.getItem("mintingColor")
                    : null,
                  color: null,
                  background: null,
                },
              ],
              webhook_url: `${BACKEND}/api/v1/image/bannerbear/webhook`,
              metadata: null,
            },
            {
              headers: {
                Authorization: "Bearer nqng9EAoa8B9jQmU1m4QEwtt",
              },
            }
          );
          formdata.append("image", response.data.uid);
          formdata.append(
            "name",
            choosenNameFinal
              ? choosenNameFinal
              : localStorage.getItem("mintingName")
              ? localStorage.getItem("mintingName")
              : null
          );
          formdata.append(
            "external_url",
            `https://color.museum/gallery/${
              hexToNumber
                ? hexToNumber
                : localStorage.getItem("mintingHexToNumber")
                ? localStorage.getItem("mintingHexToNumber")
                : null
            }`
          );
          formdata.append("imageSocial", "test");
          formdata.append(
            "hex",
            choosenColorFinal
              ? choosenColorFinal
              : localStorage.getItem("mintingColor")
              ? localStorage.getItem("mintingColor")
              : null
          );
          formdata.append(
            "uint256",
            hexToNumber
              ? hexToNumber
              : localStorage.getItem("mintingHexToNumber")
              ? localStorage.getItem("mintingHexToNumber")
              : null
          );
          // formdata.append('internalNo', 45);
          formdata.append(
            "description",
            choosenDescriptionFinal
              ? choosenDescriptionFinal
              : localStorage.getItem("mintingDescription")
              ? localStorage.getItem("mintingDescription")
              : null
          );
          formdata.append(
            "transactionHash",
            transactionHash
              ? transactionHash
              : localStorage.getItem("mintingTransactionHash")
              ? localStorage.getItem("mintingTransactionHash")
              : null
          );
          formdata.append(
            "connectedAddress",
            connectedAddress
              ? connectedAddress
              : localStorage.getItem("mintingAddress")
              ? localStorage.getItem("mintingAddress")
              : null
          );
          postColor(formdata);
        } catch (error) {
          console.log(error);
        }
        localStorage.setItem(
          "choosenColor",
          `color: ${choosenColorFinal}, name: ${choosenNameFinal}, description: ${choosenDescriptionFinal}, svg: <svg width='300' height='300' xmlns='http://www.w3.org/2000/svg'><rect width='300' height='300' rx='20' style={{ fill: '${choosenColorFinal}' }}/></svg>, hexToNumber: ${hexToNumber}`
        );
      };
      handleData();
    }
  }, [nftNumber]);
  return (
    <>
      <div className={stylesName.text_container}>
        <h1 className={stylesChoose.header}>
          Because of you a new color is born.
        </h1>
        <p className={stylesChoose.description}>
          We thank you for minting Color {choosenColorFinal}: {choosenNameFinal}
        </p>
        <a
          className={styles.button}
          target="_blank"
          href={`https://etherscan.io/tx/${transactionHash}`}
        >
          View on Etherscan
        </a>
        <Link href={`/gallery/${hexToNumber}`} passHref>
          <a className={styles.button}>View Color</a>
        </Link>
        <Link href={"/choose"} onClick={mintAnother} passHref>
          <a className={styles.button}>Mint another</a>
        </Link>
        <div className={stylesMint.gasContainer}>
          <FaGasPump />
          <p>Gas Price</p>
          <span>{(Number(gasPrice) / 1000000000).toFixed(0)}</span>
          <p>GWEI</p>
        </div>
      </div>
      <div
        className={stylesChoose.color}
        style={{
          backgroundColor: `${choosenColorFinal}`,
        }}
      >
        <div className={stylesChoose.hexidecimal}>
          <p style={{ fontSize: `${fontSizeAmount}px` }}>{choosenNameFinal}</p>
          <p style={{ fontSize: `${fontSizeAmount}px` }}>{choosenColorFinal}</p>
        </div>
      </div>
      {/* Mobile */}
      <div className={stylesPending.gasContainerMobile}>
        <FaGasPump />
        <p>Gas Price</p>
        <span>{(Number(gasPrice) / 1000000000).toFixed(0)}</span>
        <p>GWEI</p>
      </div>
      <div
        className={stylesName.mobile_picker}
        style={{
          backgroundColor: `${choosenColorFinal}`,
        }}
      >
        <div className={stylesName.hexidecimal_mobile}>
          <p style={{ fontSize: `${fontSizeAmountMobile}px` }}>
            {choosenNameFinal}
          </p>
          <p style={{ fontSize: `${fontSizeAmountMobile}px` }}>
            {choosenColorFinal}
          </p>
        </div>
      </div>
      <div className={stylesChoose.lineSide} />
    </>
  );
};

export default Success;
