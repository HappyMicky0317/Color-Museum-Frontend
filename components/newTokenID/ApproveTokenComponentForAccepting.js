import styles from "../../styles/modules/newTokenID/createAndLoginAccount.module.css";
import { HiOutlineArrowNarrowLeft } from "react-icons/hi";
import { AiOutlineClose } from "react-icons/ai";
import SlidingPane from "react-sliding-pane";
import "react-sliding-pane/dist/react-sliding-pane.css";
import { tokenABI } from "../../utils/ABIs/TokenABI";
import {
  ERC721OrderFeatureAddress,
  TokenAddressList,
  SMARTCONTRACTADDR,
} from "../../utils/constants";
import { useSelector } from "react-redux";
import { NFTabi } from "../../utils/ABIs/NFTabi";
import React, { useEffect, useState } from "react";
import stylesForBottomPart from "../../styles/modules/newTokenID/newTokenID.module.css";
import PuffLoader from "react-spinners/PuffLoader";
import { BsCheck2 } from "react-icons/bs";

const ApproveTokenComponentForAccepting = ({ setStage, stage, item }) => {
  const { connectedAddress } = useSelector((state) => state.minting);
  const { web3 } = useSelector((state) => state.minting);
  const [onChecking, setOnChecking] = useState(true);
  const [approveStatus, setApproveStatus] = useState(0);
  const [ onPending, setOnPending ] = useState(false);        // true when approve is in pending mode
  const [ onSuccess, setOnSuccess ] = useState(true);        // true when approval is finishes with success

  useEffect(async () => {
    if(stage != 2) return false;
    setDisabled(true);
    if(web3 == null) {
      console.log("web3 is null");
      return false;
    }

    // check when sell order
    if(item.order_direction == 0) {

      // only token needs to be approved so we don't need to do it with ether
      if(item.erc20Token != "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee") {
        const tokenInstance = new web3.eth.Contract(tokenABI, item.erc20Token);

        var approvedAmount = await tokenInstance.methods
          .allowance(connectedAddress, ERC721OrderFeatureAddress)
          .call();
          console.log("token is already approved!");
          if (parseInt(approvedAmount) < (Number(item.erc20TokenAmount) + Number(item.fees[0].amount))) {
            setApproveStatus(1);
          }
      } else {    // for ether
      }
      setOnChecking(false);
    }
    if(item.order_direction == 1) {
      const NFTInstance = new web3.eth.Contract(NFTabi, SMARTCONTRACTADDR);
      var isApproveForAllNFT = await NFTInstance.methods.isApprovedForAll(connectedAddress, ERC721OrderFeatureAddress).call();
      console.log("NFT is already approved!");
      if (isApproveForAllNFT != true)
        setApproveStatus(1);
      setOnChecking(false);
    }
    setDisabled(false);
  },[stage])

  /************ These part are similar on makeOrderStepWizard's ApproveTokenComponent ***********/
  const approveERC20Token = async () => {
    setOnPending(true);
    if (disabled) return false;
    const tokenInstance = new web3.eth.Contract(tokenABI, item.erc20Token);

    var approvedAmount = await tokenInstance.methods
      .allowance(connectedAddress, ERC721OrderFeatureAddress)
      .call();
    let approve_amount =
      "115792089237316195423570985008687907853269984665640564039457584007913129639935"; //(2^256 - 1 )
    if (parseInt(approvedAmount) < (Number(item.erc20TokenAmount) + Number(item.fees[0].amount))) {
      console.log("You need to approve ERC20");
      try {
        await tokenInstance.methods
          .approve(ERC721OrderFeatureAddress, approve_amount)
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
          })
          .on("receipt", function (receipt) {
            console.log("receipt", receipt);
          })
          .on("confirmation", function (confirmationNumber, receipt) {
            if (confirmationNumber === 1 && receipt.status === true) {
              console.log("confirmed!", confirmationNumber, receipt);
              setOnPending(false);
              setOnSuccess(true);
              setStage(3);
            }
          })
          .on("error", function (error) {
            console.log("error", error);
            if (error.code == 4001) console.log("Rejected!");
            setDisabled(false);
            setOnPending(false);
            setOnSuccess(false);
          });
        console.log("Token is approved!");
        return true;
      } catch (e) {
        console.log("ERROR!", e);
        return false;
      }
    } else {
      console.log("Token is already approved!");
    }
  };

  const approveERC721Token = async () => {
    setOnPending(true);
    const NFTInstance = new web3.eth.Contract(NFTabi, SMARTCONTRACTADDR);

    var isApproveForAllNFT = await NFTInstance.methods
      .isApprovedForAll(connectedAddress, ERC721OrderFeatureAddress)
      .call();
    if (isApproveForAllNFT != true) {
      console.log("You need to approve ERC721");
      try {
        await NFTInstance.methods
          .setApprovalForAll(ERC721OrderFeatureAddress, true)
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
          })
          .on("receipt", function (receipt) {
            console.log("receipt", receipt);
          })
          .on("confirmation", function (confirmationNumber, receipt) {
            if (confirmationNumber === 1 && receipt.status === true) {
              console.log("confirmed!", confirmationNumber, receipt);
              setOnPending(false);
              setOnSuccess(true);
              setStage(3);
            }
          })
          .on("error", function (error) {
            console.log("error", error);
            if (error.code == 4001) console.log("Rejected!");
            setDisabled(false);
            setOnPending(false);
            setOnSuccess(false);
          });
        return true;
      } catch (e) {
        console.log("ERROR!", e);
        return false;
      }
    } else {
      console.log("NFT already approved!");
      return true;
    }
  };
  const [disabled, setDisabled] = useState(false);
  return (
    <div className={styles.content}>
      <div className={styles.contentTitle}>
        <h1 className={styles.newDesignHeader}>APPROVE TOKEN </h1>
        <span>TO BID</span>
      </div>
      <button
        className={styles.approvenTokenNewButton}
        style={{ cursor: disabled ? "not-allowed" : "pointer" }}
        onClick={() => {
          setDisabled(true);
          if (item.order_direction == 0) approveERC20Token();
          if (item.order_direction == 1) approveERC721Token();
        }}
      >
        APPROVE
      </button>
      {onChecking ? (
        <div className={stylesForBottomPart.emailLoaderContainer}>
          <PuffLoader size={32} />
          <h4>Checking if you need to approve token. Please wait...</h4>
        </div>
      ) : approveStatus == 1 ? (
        <div>
          <br />
          You need to approve token or you are out of ether
        </div>
      ) : (
        setStage(3)
      )}
      <br />
      {onPending ? (
        <div className={stylesForBottomPart.emailLoaderContainer}>
          <PuffLoader size={32} />
          <h4>
            Pending
            <br />
            Please don't go anywhere else
          </h4>
        </div>
      ) : !onSuccess ? (
        <div className={styles.emailLoaderContainer}>
          {/* <BsCheck2 className={styles.approved} /> */}
          <h4 style={{ color: "#FF000A" }}>Finishes with error!</h4>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default ApproveTokenComponentForAccepting;
