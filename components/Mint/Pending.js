import styles from "../../styles/modules/mint/pending.module.css";
import stylesName from "../../styles/modules/name/name.module.css";
import stylesChoose from "../../styles/modules/choose/choose.module.css";
import stylesMint from "../../styles/modules/mint/mintPage.module.css";
import { FaGasPump } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  BACKEND,
  PROVIDER,
  SMARTCONTRACTADDR,
  TOKEN,
} from "../../utils/constants";
import { tokensOfOwnerABI } from "../../utils/tokensOfOwnerABI";
import Web3 from "web3";
import { useRouter } from "next/router";

const Pending = () => {
  const {
    choosenColorFinal,
    choosenNameFinal,
    gasPrice,
    connectedAddress,
    hexToNumber,
    choosenDescriptionFinal,
    transactionHash,
  } = useSelector((state) => state.minting);

  const router = useRouter();
  const web3 = new Web3(new Web3.providers.HttpProvider(PROVIDER));
  const contract = new web3.eth.Contract([tokensOfOwnerABI], SMARTCONTRACTADDR);
  useEffect(() => {
    const interval = setInterval(() => {
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
        }
      };
      handle();
    }, 1000);
    return () => clearInterval(interval);
  }, [connectedAddress]);
  //
  //
  const [randomDuration, setRandomDuration] = useState(1);
  useEffect(() => {
    let number = Math.random().toFixed(2) * 2.5;
    if (number < 0.5) {
      number = Math.random().toFixed(2) * 2.5;
    } else if (number > 4) {
      number = Math.random().toFixed(2) * 2.5;
    } else {
      setRandomDuration(number);
    }
  }, [randomDuration]);
  //
  //
  const postColor = async (body) => {
    try {
      await axios.post(`${BACKEND}/api/v1/image/pending`, body, {
        headers: {
          "auth-token": TOKEN,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const handleForm = async () => {
      const formdata = new FormData();
      try {
        // formdata.append("image", response.data.uid);
        formdata.append(
          "name",
          choosenNameFinal
            ? choosenNameFinal
            : localStorage.getItem("mintingName")
              ? localStorage.getItem("mintingName")
              : null
        );
        formdata.append("external_url", "test");
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
    };
    handleForm();
  }, []);
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
  const [closePopUp, setClosePopUp] = useState(true);

  useEffect(() => {
    if (closePopUp) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "initial"
    }

  }, [closePopUp])



  return (
    <>
      <div
        className={styles.popUp}
        style={{ display: closePopUp ? "flex" : "none" }}
      >
        <div className={styles.modal}>
          <h1>DO NOT LEAVE THIS PAGE OR ALTER YOUR PENDING TRANSACTION.</h1>
          <p>
            Your mint is now pending. To prevent minting issues, do not navigate
            away from this page or alter your pending Ethereum transaction while
            the transaction is pending.
          </p>
          <button onClick={() => setClosePopUp(false)}>
            Yes, I understand!
          </button>
        </div>
      </div>
      <div className={stylesName.text_container}>
        <h1 className={stylesChoose.header}>Mint in progress</h1>
        <p className={stylesChoose.description}>
          Just a moment while {choosenNameFinal} comes to life on Ethereum.
        </p>
      </div>
      <div className={styles.colorUnder} />
      <div className={`${stylesMint.gasContainer} ${stylesMint.hideMobile}`}> 
        <FaGasPump />
        <p>Gas Price</p>
        <span>{(Number(gasPrice) / 1000000000).toFixed(0)}</span>
        <p>GWEI</p>
      </div>
      <div
        className={`${stylesChoose.color} ${styles.opacityAnimation}`}
        style={{
          backgroundColor: `${choosenColorFinal}`,
          animationDuration: `${randomDuration}s`,
        }}
      >
        <div className={stylesChoose.hexidecimal}>
          <p style={{ fontSize: `${fontSizeAmount}px` }}>{choosenNameFinal}</p>
          <p style={{ fontSize: `${fontSizeAmount}px` }}>{choosenColorFinal}</p>
        </div>
      </div>
      <div className={styles.gasContainerMobile}>
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
        <div className={styles.mobilePickerUnder} />
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

export default Pending;
