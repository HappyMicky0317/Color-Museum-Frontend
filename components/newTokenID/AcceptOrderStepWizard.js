import styles from "../../styles/modules/newTokenID/createAndLoginAccount.module.css";
import { IoIosArrowBack } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";
import SlidingPane from "react-sliding-pane";
import "react-sliding-pane/dist/react-sliding-pane.css";
import React, { useState, useEffect, useLayoutEffect } from "react";
import OtpInput from "react-otp-input";
import { useDispatch, useSelector } from "react-redux";
import Web3 from "web3";
import { ConnectAddress } from "../../store/actions/toggle";
import Switch from "react-switch";
import CheckOrderStatus from "./CheckOrderStatus";
import ApproveTokenComponentForAccepting from "./ApproveTokenComponentForAccepting";
import AcceptOfferComponent from "./AcceptOfferComponent";
import moment from "moment";
import { isMobile } from "react-device-detect";

const AcceptOrderStepWizard = ({
  acceptOfferNew,
  setAcceptOfferNew,
  item,
  data,
  getPastOrders,
  getAvailableOrders,
}) => {
  const [stage, setStage] = useState(1);

  const afterOrderAccepted = () => {
    getAvailableOrders();
    getPastOrders();
    setTimeout(() => {
      setAcceptOfferNew(false);
      setStage(1);
    }, 5000);
  };

  return (
    <SlidingPane
      closeIcon={<IoIosArrowBack />}
      className={styles.newSlideContainer}
      isOpen={acceptOfferNew}
      title={
        <div className={styles.newPurchaseTitle}>
          Accept Offer
          <IoCloseSharp
            size={30}
            onClick={() => {
              setAcceptOfferNew(false);
              setStage(1);
            }}
          />
        </div>
      }
      width={isMobile ? "100%" : "30%"}
      onRequestClose={() => {
        setAcceptOfferNew(false);
        setStage(1);
      }}
    >
      {stage === 1 ? (
        <>
          <CheckOrderStatus //  check if order is valid and accepted
            item={item}
            data={data}
            setStage={setStage}
            stage={stage}
            afterOrderAccepted={afterOrderAccepted}
          />
        </>
      ) : stage === 2 ? (
        <>
          <ApproveTokenComponentForAccepting // approve token if needed
            setStage={setStage}
            stage={stage}
            item={item}
          />
        </>
      ) : stage == 3 ? (
        <AcceptOfferComponent
          stage={stage}
          item={item}
          data={data}
          afterOrderAccepted={afterOrderAccepted}
        />
      ) : null}
    </SlidingPane>
  );
};

export default AcceptOrderStepWizard;
