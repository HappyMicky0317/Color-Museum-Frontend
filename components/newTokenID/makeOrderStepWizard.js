import styles from "../../styles/modules/newTokenID/createAndLoginAccount.module.css";
import { IoIosArrowBack } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";
import SlidingPane from "react-sliding-pane";
import "react-sliding-pane/dist/react-sliding-pane.css";
import { useEffect, useLayoutEffect, useState } from "react";
import Switch from "react-switch";
import OtpInput from "react-otp-input";
import { useSelector } from "react-redux";
import MakeOfferComponent from "./MakeOfferComponent";
import ApproveTokenComponent from "./ApproveTokenComponent";
import ConfirmOfferComponent from "./ConfirmOfferComponent";
import moment from "moment";
import { NFTabi } from "../../utils/ABIs/NFTabi";
import { SMARTCONTRACTADDR } from "../../utils/constants";
import { isMobile } from "react-device-detect";
import { FiChevronRight } from "react-icons/fi";

const makeOrderStepWizard = ({
  orderStepWizardOpen,
  setOrderStepWizardOpen,
  number,
  data,
  getAvailableOrders,
  ownerOfNFT,
}) => {
  /*-------------------------- Redux variables ----------------------------*/
  const { connectedAddress } = useSelector((state) => state.minting);
  const { web3 } = useSelector((state) => state.minting);

  /*---------------------- useState var --------------------*/
  const [stage, setStage] = useState(1); //  stage of the step wizard
  const [orderDirection, setOrderDirection] = useState(-1); // the direction of the order
  const [selectedCurrency, setSelectedCurrency] = useState(
    orderDirection == 0 ? "ETH" : "WETH"
  );
  const [selectedCurrencyInput, setSelectedCurrencyInput] = useState(
    data.price_in_eth
      ? selectedCurrency === null ||
        selectedCurrency === "WETH" ||
        selectedCurrency === "ETH"
        ? data.price_in_eth.toFixed(2)
        : data.price_in_usd.toFixed(2)
      : "0"
  );

  const [expireDay, setExpireDay] = useState(""); //expiryDat unit is hour

  /*------------------- CODE BLOCK START : start, middle, end of making order step functions are here-----------------------*/

  useEffect(async () => {
    // when slide is open we need to get the order type
    if (connectedAddress == ownerOfNFT) setOrderDirection(0);
    else if (connectedAddress != ownerOfNFT) setOrderDirection(1);
    else setOrderDirection(-1);
  }, [ownerOfNFT]);

  const setOfferInfo = async (
    //after pass the make offer we need to set the order info (selectedCurrencyInput, selectedCurrency, expireDay)
    selectedCurrencyInputFromStepWizard,
    selectedCurrencyFromStepWizard,
    expireDayFromStepWizard
  ) => {
    setSelectedCurrencyInput(selectedCurrencyInputFromStepWizard);
    setSelectedCurrency(selectedCurrencyFromStepWizard);
    setExpireDay(expireDayFromStepWizard);
  };

  const afterOrderConfirmed = async () => {
    //  after the order is created we need to close the step wizard and go to stag 1, and also update the available orders list
    getAvailableOrders();
    setTimeout(() => {
      setOrderStepWizardOpen(false);
      setStage(1);
    }, 5000);
  };
  /*---------------- CODE BLOCK END -------------------------*/

  const [isTokenBack, setIsTokenBack] = useState(false);
  return (
    <SlidingPane
      closeIcon={<IoIosArrowBack />}
      className={styles.newSlideContainer}
      isOpen={orderStepWizardOpen}
      title={
        <div className={styles.newPurchaseTitle}>
          {stage === 1 ? (
            orderDirection == 0 ? (
              "Make a sell order"
            ) : isTokenBack ? (
              <div className={styles.breadcrumb}>
                <span>
                  {connectedAddress &&
                  connectedAddress.toLowerCase() == ownerOfNFT.toLowerCase()
                    ? "List"
                    : "Bid"}
                </span>
                <FiChevronRight
                  className={styles.rightIcon}
                  width={25}
                  height={25}
                />
                <span
                  style={{ color: "#565656", cursor: "pointer" }}
                  onClick={() => setStage(2)}
                >
                  Approve
                </span>
              </div>
            ) : connectedAddress &&
              connectedAddress.toLowerCase() == ownerOfNFT.toLowerCase() ? (
              "List"
            ) : (
              "Bid"
            )
          ) : stage === 3 ? (
            orderDirection == 0 ? (
              "Make sell order"
            ) : (
              "Make a buy order"
            )
          ) : (
            <div className={styles.breadcrumb}>
              <span
                style={{ color: "#565656", cursor: "pointer" }}
                onClick={() => {
                  setStage(1);
                  setIsTokenBack(true);
                }}
              >
                {connectedAddress &&
                connectedAddress.toLowerCase() == ownerOfNFT.toLowerCase()
                  ? "List"
                  : "Bid"}
              </span>
              <FiChevronRight
                className={styles.rightIcon}
                width={25}
                height={25}
              />
              <span>Approve</span>
            </div>
          )}
          <IoCloseSharp
            onClick={() => {
              if (stage === 3) {
                setOrderStepWizardOpen(false);
                setStage(1);
              } else {
                setOrderStepWizardOpen(false);
              }
            }}
          />
        </div>
      }
      width={isMobile ? "100%" : "30%"}
      onRequestClose={() => {
        if (stage === 3) {
          setOrderStepWizardOpen(false);
          setStage(1);
        } else if (stage === 1) {
          setOrderStepWizardOpen(false);
        } else {
          setStage((stage -= 1));
        }
      }}
    >
      {stage === 1 ? (
        <MakeOfferComponent //  set the information of order here
          data={data}
          stage={stage}
          setStage={setStage}
          setOfferInfo={setOfferInfo}
          title={orderDirection == 0 ? "Sell" : "Buy"}
          number={number}
        />
      ) : stage === 2 ? (
        <ApproveTokenComponent //  approve the token if needed
          selectedCurrency={selectedCurrency}
          selectedCurrencyInput={selectedCurrencyInput}
          setStage={setStage}
          stage={stage}
          tokenType={orderDirection == 0 ? "ERC721" : "ERC20"}
          sellOffer={orderDirection == 0 ? true : false}
          number={number}
        />
      ) : (
        <ConfirmOfferComponent // create order
          title={orderDirection == 0 ? "Sell" : "Buy"}
          selectedCurrency={selectedCurrency}
          selectedCurrencyInput={selectedCurrencyInput}
          expireDay={expireDay}
          number={number}
          data={data}
          afterOrderConfirmed={afterOrderConfirmed}
        />
      )}
    </SlidingPane>
  );
};

export default makeOrderStepWizard;
