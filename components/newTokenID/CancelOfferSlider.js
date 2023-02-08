import styles from "../../styles/modules/newTokenID/createAndLoginAccount.module.css";
import stylesNew from "../../styles/modules/newTokenID/newTokenID.module.css";
import stylesButton from "../../styles/modules/newTokenID/tokenID.module.css";
import { IoIosArrowBack } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";
import SlidingPane from "react-sliding-pane";
import "react-sliding-pane/dist/react-sliding-pane.css";
import { isMobile } from "react-device-detect";
import { useSelector } from "react-redux";
import { ERC721OrderFeatureABI } from "../../utils/ABIs/ERC721OrdersFeature";
import { NFTabi } from "../../utils/ABIs/NFTabi";
import {
  ERC721OrderFeatureAddress,
  API_URL,
} from "../../utils/constants";
import axios from "axios";
import {toast} from "react-hot-toast";
import React, { useEffect, useState } from "react";
import stylesForBottomPart from "../../styles/modules/newTokenID/newTokenID.module.css";
import { BsCheck2 } from "react-icons/bs";
import PuffLoader from "react-spinners/PuffLoader";

const CancelOfferSlider = ({
  setCancelOfferSlider,
  cancelOfferSlider,
  title,
  item,
  getAvailableOrders,
}) => {
  console.log(item);
  const { connectedAddress } = useSelector((state) => state.minting);
  const { web3 } = useSelector((state) => state.minting);

  const [onPending, setOnPending] = useState(false);
  const [onSuccess, setOnSuccess] = useState(false);

  useEffect(() => {
    if(!cancelOfferSlider)
      return false;
    setOnPending(false);
    setOnSuccess(false);
  }, [cancelOfferSlider])

  const cancelOrder = async () => {
    console.log(item);
    setOnPending(true);
    if(item.maker != connectedAddress) {
      console.log("Something is wrong.");
    }
    const marketPlaceInstance = new web3.eth.Contract(          //  get marketplace instance
      ERC721OrderFeatureABI,
      ERC721OrderFeatureAddress
    );

    var transactionHashOfMake;
    await marketPlaceInstance.methods
      .cancelERC721Order(item.nonce)
      .send({
        from: connectedAddress,
      })
      .on("sending", function () {
        console.log("sending");
      })
      .on("sent", function () {
        console.log("sent");
      })
      .on("transactionHash", function (transactionHash) {
        console.log("transactionHash", transactionHash);
        transactionHashOfMake = transactionHash;
      })
      .on("receipt", function (receipt) {
        console.log("receipt", receipt);
        if(receipt.status === true) {
          toast.success("Transaction is successfully confirmed!");
        }
      })
      .on("error", function (error) {
        console.log("error", error);
        toast.error("Error when sending transaction.");
        setOnPending(false);
        return false;
      });

    try {

      var currentResult = await axios({
        method: "PATCH",
        url: `${API_URL}/orders/cancel`,
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify({
          nonce: item.nonce,
          cancelHash: transactionHashOfMake,
        }),
      });
      getAvailableOrders();
      setOnPending(false);
      setOnSuccess(true);
      setTimeout(() => {
        setCancelOfferSlider(false);
      }, 3000);
      console.log("currentResult", currentResult);
    } catch (e) {
      console.log("error when set current to 5!", e);
      return false;
    }
  };

  return (
    <SlidingPane
      closeIcon={<IoIosArrowBack />}
      className={styles.newSlideContainer}
      isOpen={cancelOfferSlider}
      title={
        <div className={styles.newPurchaseTitle}>
          <span>Cancel</span>
          <IoCloseSharp
            onClick={() => {
              setCancelOfferSlider(false);
            }}
          />
        </div>
      }
      width={isMobile ? "100%" : "30%"}
      onRequestClose={() => {
        setCancelOfferSlider(false);
      }}
    >
      <div className={styles.content}>
        <h1
          className={stylesNew.newDesignHeader}
          style={{ textTransform: "uppercase" }}
        >
          Cancel {title}
        </h1>
        <button
          className={stylesButton.makeOffer}
          style={{
            background: "transparent",
            color: "#fff",
            marginTop: "1.5rem",
          }}
          onClick = {() => cancelOrder()}
        >
          Cancel
        </button>
      </div>
      {onPending ? (
        <div className={stylesForBottomPart.emailLoaderContainer}>
          <PuffLoader size={32} />
          <h4>
            Pending
            <br />
            Please don't go anywhere else
          </h4>
        </div>
      ) : onSuccess ? (
        <div className={styles.emailLoaderContainer}>
          <BsCheck2 className={styles.approved} />
          <h4 style={{ color: "#00FF0A" }}>Success!</h4>
        </div>
      ) : (
        ""
      )}
    </SlidingPane>
  );
};

export default CancelOfferSlider;
