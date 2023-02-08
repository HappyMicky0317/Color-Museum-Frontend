import React, { useEffect, useState } from "react";
import stylesName from "../../styles/modules/name/name.module.css";
import stylesChoose from "../../styles/modules/choose/choose.module.css";
import stylesSuccess from "../../styles/modules/mint/success.module.css";
import stylesMint from "../../styles/modules/mint/mintPage.module.css";
import stylesPending from "../../styles/modules/mint/pending.module.css";
import { useSelector } from "react-redux";
import Link from "next/link";
import { FaGasPump } from "react-icons/fa";
import { useRouter } from "next/router";
import Web3 from "web3";
import { tokensOfOwnerABI } from "../../utils/tokensOfOwnerABI";
import { PROVIDER, SMARTCONTRACTADDR } from "../../utils/constants";

const Fail = () => {
  const {
    choosenNameFinal,
    gasPrice,
    choosenColorFinal,
    connectedAddress,
    hexToNumber,
  } = useSelector((state) => state.minting);
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
  const router = useRouter();
  const web3 = new Web3(new Web3.providers.HttpProvider(PROVIDER));
  const contract = new web3.eth.Contract([tokensOfOwnerABI], SMARTCONTRACTADDR);
  useEffect(() => {
    const handle = async () => {
      if (connectedAddress || localStorage.getItem("mintingAddress")) {
        const nfts = await contract.methods
          .tokensOfOwner(
            connectedAddress
              ? connectedAddress
              : localStorage.getItem("mintingAddress")
              ? localStorage.getItem("mintingAddress")
              : null
          )
          .call();
        if (
          nfts.includes(
            hexToNumber
              ? hexToNumber
              : localStorage.getItem("mintingHexToNumber")
              ? localStorage.getItem("mintingHexToNumber")
              : null
          )
        ) {
          router.push("/mint-success");
        }
        localStorage.clear("mintingAddress");
        localStorage.clear("mintingTransactionHash");
        localStorage.clear("mintingName");
        localStorage.clear("mintingColor");
        localStorage.clear("mintingDescription");
        localStorage.clear("mintingHexToNumber");
      }
    };
    handle();
  }, [connectedAddress]);
  return (
    <>
      <div className={stylesName.text_container}>
        <h1 className={stylesChoose.header}>Your color wasn't minted.</h1>
        <p className={stylesChoose.description}>
          Sorry, there was an issue that prevented your color from being minted.
        </p>
        <Link href="mint" passHref>
          <a className={stylesSuccess.button}>Try again</a>
        </Link>
        <div className={`${stylesMint.gasContainer} ${stylesMint.hideMobile}`}>
          <FaGasPump />
          <p>Gas Price</p>
          <span>{(Number(gasPrice) / 1000000000).toFixed(0)}</span>
          <p>GWEI</p>
        </div>
      </div>
      <div
        className={stylesChoose.color}
        style={{ backgroundColor: `${choosenColorFinal}` }}
      >
        <div className={stylesChoose.hexidecimal}>
          <p style={{ fontSize: `${fontSizeAmount}px` }}>{choosenNameFinal}</p>
          <p style={{ fontSize: `${fontSizeAmount}px` }}>{choosenColorFinal}</p>
        </div>
      </div>
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

export default Fail;
