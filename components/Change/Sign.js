import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import stylesChoose from "../../styles/modules/choose/choose.module.css";
import styles from "../../styles/modules/name/name.module.css";
import Update from "./Update";
import Connect from "../Mint/Connect";
import Disconnect from "../Mint/Disconnect";
import SignRequest from "./SignRequest";

const Sign = ({
  receivedColorName,
  receivedColor,
  receivedColorNameDesc,
  tokenId,
}) => {
  const { connectedAddress } = useSelector((state) => state.minting);
  const [fontSizeAmount, setFontSizeAmount] = useState("32");
  const [fontSizeAmountMobile, setFontSizeAmountMobile] = useState("22");
  useEffect(() => {
    if (receivedColorName.length < 20) {
      setFontSizeAmount("32");
      setFontSizeAmountMobile("22");
    } else {
      setFontSizeAmount("26");
      setFontSizeAmountMobile("17");
    }
  }, [receivedColorName]);
  //
  //
  const [allowAPI, setAllowAPI] = useState(false);
  return (
    <>
      <article className={styles.text_container}>
        <h1 className={stylesChoose.header}>Prove ownership</h1>
        <p className={stylesChoose.description}>
          To submit the changes, complete a signature request with the wallet
          that holds this Color NFT. <b>This does not cost ETH.</b>
        </p>
        <div className="mint-button-hidden">
          {connectedAddress === "" ? (
            <Connect />
          ) : allowAPI ? (
            <>
              <Update
                receivedColor={receivedColor}
                receivedColorName={receivedColorName}
                receivedColorNameDesc={receivedColorNameDesc}
                tokenId={tokenId}
              />
            </>
          ) : (
            <>
              <SignRequest setAllowAPI={setAllowAPI} tokenId={tokenId} />
              <Disconnect />
            </>
          )}
        </div>
      </article>
      <div
        className={stylesChoose.color}
        style={{ backgroundColor: `${receivedColor}` }}
      >
        <div className={stylesChoose.hexidecimal}>
          <p style={{ fontSize: `${fontSizeAmount}px` }}>{receivedColorName}</p>
          <p style={{ fontSize: `${fontSizeAmount}px` }}>{receivedColor}</p>
        </div>
      </div>
      <div
        className={styles.mobile_picker}
        style={{
          backgroundColor: `${receivedColor}`,
        }}
      >
        <div className={styles.hexidecimal_mobile}>
          <p style={{ fontSize: `${fontSizeAmountMobile}px` }}>
            {receivedColorName}
          </p>
          <p style={{ fontSize: `${fontSizeAmountMobile}px` }}>
            {receivedColor}
          </p>
        </div>
      </div>
      <div className={stylesChoose.lineSide} />
    </>
  );
};

export default Sign;
