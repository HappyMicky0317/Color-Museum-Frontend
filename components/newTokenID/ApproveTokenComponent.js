import styles from "../../styles/modules/newTokenID/createAndLoginAccount.module.css";
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
import toast from "react-hot-toast";
import { ethers } from "ethers";
import { BsCheck2 } from "react-icons/bs";

const ApproveTokenComponent = ({
  selectedCurrency, //  the type of currency
  selectedCurrencyInput, //  the amount of currency
  setStage, //  the function which set the stage of the step wizard
  stage, //  the current stage
  tokenType,
  sellOffer,
  //  the allowance token type, this represent the order direction here
}) => {
  console.log(selectedCurrencyInput, selectedCurrency);
  const { connectedAddress } = useSelector((state) => state.minting);
  const { web3 } = useSelector((state) => state.minting);
  const [onChecking, setOnChecking] = useState(true); //  true when checking if user need to approve token
  const [approveStatus, setApproveStatus] = useState(false); //  true when approve is needed
  const [disabled, setDisabled] = useState(false); //  true when button is click so let users don't click it twice
  const [onPending, setOnPending] = useState(false); // true when approve is in pending mode
  const [onSuccess, setOnSuccess] = useState(true); // true when approval is finishes with success

  useEffect(async () => {
    // check if user need to approve token when he/she is on this stage
    if (stage != 2)
      //  when the step wizard in not current stage
      return false;

    setDisabled(true); // disable button while checking
    if (web3 == null) {
      // check if web3 is null, actually this thing needs to be never happen
      console.log("web3 is null");
      return false;
    }

    // when user need to approve ERC20 token which means they need to make buy order
    // we need to check if the user already approve selected currency and also approved enough amount of token
    // if not we need to let users to approve token, and if he approved enough amount of token we need to let users to pass this step
    if (tokenType == "ERC20") {
      //  check if ERC20 token is need to be approved

      // use this method to find the exact currency array
      const currencyArray = ["ETH", "WETH", "USDC", "DAI", "USDT"];
      const indexOfCurrency = currencyArray.indexOf(selectedCurrency); //  indexOfCurrency must not be 0 because users can not make buy order with ETH

      const tokenInstance = new web3.eth.Contract( //  get the ERC20 token instance
        tokenABI,
        TokenAddressList[indexOfCurrency]
      );

      //    get the approved amount of token to ERC721OrderFeatureAddress
      try {
        var approvedAmount = await tokenInstance.methods
          .allowance(connectedAddress, ERC721OrderFeatureAddress)
          .call();
      } catch (e) {
        toast.error("Some went wrong. :(");
        setOnChecking(false);
        return false;
      }

      const decimal = await tokenInstance.methods.decimals().call();
      var erc20AmountBN = ethers.utils.parseUnits(
        selectedCurrencyInput,
        decimal
      );

      if (
        ethers.utils
          .parseUnits(approvedAmount, "wei")
          .lt(erc20AmountBN.div(10000).mul(10125))
      ) {
        //  if approved amount is not more than the price, let users approve the token
        setApproveStatus(true);
      }
      setOnChecking(false);
    }

    // when  users need to approve ERC721 token which means they need to make sell order
    // we need to check if the user already approve selected type of NFT
    // if not we need to let users to approve NFT collection and if yes, we need to let users to pass this step
    if (tokenType == "ERC721") {
      //  check if NFT is need to be approved
      const NFTInstance = new web3.eth.Contract(NFTabi, SMARTCONTRACTADDR);
      var isApproveForAllNFT = await NFTInstance.methods
        .isApprovedForAll(connectedAddress, ERC721OrderFeatureAddress)
        .call();
      console.log("isApproveForAllNFT", isApproveForAllNFT);
      if (isApproveForAllNFT != true)
        //  if nft collection's owner's approve is not true, users need to approve NFT
        setApproveStatus(true);
      setOnChecking(false);
    }

    // let users can press approve button
    // users can press this whe they need to approve token, if not the step will be skipped so they have no chance to press this button
    setDisabled(false);
  }, [stage]);

  // users approve ERC20 token by using this function
  const approveERC20Token = async () => {
    setOnPending(true);

    if (!connectedAddress) {
      //   check if wallet is connected
      console.log("Please connect to wallet!");
      toast.error("Please connect to wallet!");
    }

    const currencyArray = ["ETH", "WETH", "USDC", "DAI", "USDT"];
    const indexOfCurrency = currencyArray.indexOf(selectedCurrency);
    const tokenInstance = new web3.eth.Contract(
      tokenABI,
      TokenAddressList[indexOfCurrency]
    ); //  get the right instance of the token

    var approvedAmount = await tokenInstance.methods
      .allowance(connectedAddress, ERC721OrderFeatureAddress)
      .call();

    let approve_amount =
      "115792089237316195423570985008687907853269984665640564039457584007913129639935"; //(2^256 - 1 ) which means the max integer of solidity

    const decimal = await tokenInstance.methods.decimals().call();
    var erc20AmountBN = ethers.utils.parseUnits(selectedCurrencyInput, decimal);

    if (
      ethers.utils
        .parseUnits(approvedAmount, "wei")
        .lt(erc20AmountBN.div(10000).mul(10125))
    ) {
      //  check if need to approve again
      console.log("You need to approve ERC20");
      try {
        //  approve erc20 token
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
              //  when the transaction is confirmed we need to go to next step
              console.log("confirmed!", confirmationNumber, receipt);
              toast.success("Token is approved!");
              setOnPending(false);
              setOnSuccess(true);
              setStage(3);
            }
          })
          .on("error", function (error) {
            console.log("error", error);
            if (error.code == 4001) {
              // when user reject on wallet
              console.log("Rejected!");
              toast.error("Rejected!");
            }
            setDisabled(false); //  enable button after error so let users to approve again
            setOnPending(false);
            setOnSuccess(false);
          });
        console.log("Token is approved!");
        // toast.success("Token is approved!");
        return true;
      } catch (e) {
        console.log("ERROR!", e);
        return false;
      }
    } else {
      console.log("Token is already approved!");
      toast.success("Token is approved!");
    }
  };

  // users approve ERC721 token by using this function
  const approveERC721Token = async () => {
    setOnPending(true);

    if (!connectedAddress) {
      console.log("Please connect to wallet!");
      toast.error("Please connect to wallet!");
    }

    const NFTInstance = new web3.eth.Contract(NFTabi, SMARTCONTRACTADDR); // get the NFT instance of color museum

    var isApproveForAllNFT = await NFTInstance.methods
      .isApprovedForAll(connectedAddress, ERC721OrderFeatureAddress)
      .call();
    if (isApproveForAllNFT != true) {
      //  check if need to approve again
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
              //  when transaction is confirmed we need to go to next step
              console.log("confirmed!", confirmationNumber, receipt);
              toast.success("NFT is approved!");
              setOnPending(false);
              setOnSuccess(true);
              setStage(3);
            }
          })
          .on("error", function (error) {
            console.log("error", error);
            if (error.code == 4001) {
              //  when user reject the transaction on wallet
              console.log("Rejected!");
              toast.error("Rejected!");
            }
            setDisabled(false); //  enable button after error so let users to approve again
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
      toast.success("NFT is approved!");
      return true;
    }
  };

  return (
    <div className={styles.content}>
      <div className={styles.contentTitle}>
        <h1 className={styles.newDesignHeader}>
          APPROVE {sellOffer ? "NFT" : selectedCurrency}{" "}
        </h1>
        <span>TO {sellOffer ? "SELL" : "BID"}</span>
      </div>
      <p className={styles.enableCurrency}>
        {sellOffer
          ? "Enable approval for this NFT collection."
          : `Enable ${selectedCurrency} bidding with a token approval transaction.`}
      </p>
      <button
        className={styles.approvenTokenNewButton}
        style={{ cursor: disabled ? "not-allowed" : "pointer" }}
        onClick={() => {
          setDisabled(true);
          if (tokenType == "ERC20") approveERC20Token();
          if (tokenType == "ERC721") approveERC721Token();
        }}
      >
        APPROVE
      </button>
      <br />
      <br />
      {onChecking ? (
        <div className={stylesForBottomPart.emailLoaderContainer}>
          <PuffLoader size={32} />
          <h4>Checking if you need to approve token. Please wait...</h4>
        </div>
      ) : approveStatus == true ? (
        <div></div>
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

export default ApproveTokenComponent;
