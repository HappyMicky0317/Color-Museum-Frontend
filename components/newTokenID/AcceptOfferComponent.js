import styles from "../../styles/modules/newTokenID/newTokenID.module.css";
import stylesNewTokenId from "../../styles/modules/newTokenID/newTokenID.module.css";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ERC721OrderFeatureABI } from "../../utils/ABIs/ERC721OrdersFeature";
import { NFTabi } from "../../utils/ABIs/NFTabi";
import {
  ERC721OrderFeatureAddress,
  TokenAddressList,
  SMARTCONTRACTADDR,
  API_URL,
} from "../../utils/constants";
import axios from "axios";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import stylesForBottomPart from "../../styles/modules/newTokenID/newTokenID.module.css";
import { BsCheck2 } from "react-icons/bs";
import MoonLoader from "react-spinners/MoonLoader";
import toast from "react-hot-toast";
import { capitalize } from "@mui/material";

const AcceptOfferComponent = ({ item, data, afterOrderAccepted }) => {
  const { connectedAddress } = useSelector((state) => state.minting);
  const { web3 } = useSelector((state) => state.minting);
  const [mintingAddress, setOwner] = useState(data.minting_address);

  const [disabled, setDisabled] = useState(false);

  // accept buy offer
  const acceptBuyOffer = async () => {
    console.log("I am acceptBuyOffer now with this item", item);
    setDisabled(true);
    setOnPending(true);

    const marketPlaceInstance = new web3.eth.Contract( //  get marketplace instance
      ERC721OrderFeatureABI,
      ERC721OrderFeatureAddress
    );

    var signature = item.signature;
    const buyOrder = {
      // build buy order from item, just copy paste
      direction: 1,
      maker: item.maker,
      taker: item.taker,
      expiry: item.expiry,
      nonce: item.nonce,
      erc20Token: item.erc20Token,
      erc20TokenAmount: item.erc20TokenAmount,
      fees: item.fees,
      erc721Token: item.erc721Token,
      erc721TokenId: item.erc721TokenId,
      erc721TokenProperties: item.erc721TokenProperties,
    };
    console.log("buyOrder:", buyOrder);

    // check if order is valid, must pass. if not it means something is wrong
    try {
      await marketPlaceInstance.methods
        .validateERC721OrderSignature(buyOrder, signature)
        .call();
      console.log("Order validate Success!");
    } catch (e) {
      console.log(e);
      return false;
    }

    try {
      // confirm accept order transaction
      var transactionHashOfAccept;
      await marketPlaceInstance.methods
        .sellERC721(buyOrder, signature, buyOrder.erc721TokenId, false, "0x")
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
          transactionHashOfAccept = transactionHash;
        })
        .on("receipt", function (receipt) {
          console.log("receipt", receipt);
        })
        .on("confirmation", function (confirmationNumber, receipt) {
          if (confirmationNumber === 1 && receipt.status === true) {
            console.log("confirmed!", confirmationNumber, receipt);
          }
        })
        .on("error", function (error) {
          console.log("error", error);
          setOnPending(false);
          setDisabled(false);
          toast.error("Something is wrong when sending transaction!");
          return false;
        });

      // After confirm, set the current value as 3.
      // So the the current value of other orders which current value is 1 and tokenID is same as accepted token will be set as 4
      try {
        var currentResult = await axios({
          method: "PATCH",
          url: `${API_URL}/buy_orders/current`,
          headers: {
            "Content-Type": "application/json",
          },
          data: JSON.stringify({
            nonce: item.nonce,
            current: 3,
            acceptingHash: transactionHashOfAccept,
          }),
        });
        console.log("currentResult", currentResult);
        setOnPending(false);
        setOnSuccess(true);
        afterOrderAccepted();
      } catch (e) {
        console.log("error when set current!", e);
        return false;
      }
    } catch (e) {
      try {
        var currentResult = await axios({
          method: "PATCH",
          url: `${API_URL}/buy_orders/current`,
          headers: {
            "Content-Type": "application/json",
          },
          data: JSON.stringify({ order_id: item._id, current: 1 }),
        });
        console.log("currentResult", currentResult);
      } catch (e) {
        console.log("error when set current!", e);
        return false;
      }
    }
  };

  // Accept sell offer
  // Most of things are same except ether part
  const acceptSellOffer = async () => {
    setDisabled(true);
    setOnPending(true);
    console.log(item);
    const marketPlaceInstance = new web3.eth.Contract(
      ERC721OrderFeatureABI,
      ERC721OrderFeatureAddress
    );

    var signature = item.signature;
    const sellOrder = {
      direction: 0,
      maker: item.maker,
      taker: item.taker,
      expiry: item.expiry,
      nonce: item.nonce,
      erc20Token: item.erc20Token,
      erc20TokenAmount: item.erc20TokenAmount,
      fees: item.fees,
      erc721Token: item.erc721Token,
      erc721TokenId: item.erc721TokenId,
      erc721TokenProperties: item.erc721TokenProperties,
    };
    console.log("SellOrder:", sellOrder);

    // try {
    //   var currentResult = await axios({
    //     method: "PATCH",
    //     url: `${API_URL}/sell_orders/current`,
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     data: JSON.stringify({ order_id: item._id, current: 2 }),
    //   });
    //   console.log("currentResult", currentResult);
    // } catch (e) {
    //   console.log("error when set current!", e);
    //   return false;
    // }

    try {
      await marketPlaceInstance.methods
        .validateERC721OrderSignature(sellOrder, signature)
        .call();
    } catch (e) {
      console.log("Something is wrong with validate order!");
      return false;
    }

    var transactionHashOfAccept;
    try {
      var valueOfEtherToSend = ethers.utils.parseUnits('0','wei');

      // If token is ether, we need to calc the value of ether to send.
      // Other wise value is 0
      if (item.erc20Token == "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee")
        valueOfEtherToSend = ethers.utils
          .parseUnits(String(item.erc20TokenAmount), "wei")
          .add(ethers.utils.parseUnits(String(item.fees[0].amount), "wei"));
      console.log(valueOfEtherToSend.toNumber());

      // confirm transaction with value
      await marketPlaceInstance.methods
        .buyERC721(sellOrder, signature, "0x")
        .send({
          from: connectedAddress,
          value: valueOfEtherToSend,
        })
        .on("sending", function () {
          console.log("sending");
        })
        .on("sent", function () {
          console.log("sent");
        })
        .on("transactionHash", function (transactionHash) {
          console.log("transactionHash", transactionHash);
          transactionHashOfAccept = transactionHash;
        })
        .on("receipt", function (receipt) {
          console.log("receipt", receipt);
          if (receipt.status === true) {
            toast.success("Transaction confirmed Successfully!");
          }
        })
        .on("error", function (error) {
          console.log("error", error);
          setOnPending(false);
          setDisabled(false);
          toast.error("Something is wrong when sending transaction!");
          return false;
        });
      try {
        var currentResult = await axios({
          method: "PATCH",
          url: `${API_URL}/sell_orders/current`,
          headers: {
            "Content-Type": "application/json",
          },
          data: JSON.stringify({
            order_id: item._id,
            current: 3,
            acceptingHash: transactionHashOfAccept,
          }),
        });
        console.log("currentResult", currentResult);
        setOnPending(false);
        setOnSuccess(true);
        afterOrderAccepted();
      } catch (e) {
        console.log("error when set current!", e);
        return false;
      }
    } catch (e) {
      try {
        var currentResult = await axios({
          method: "PATCH",
          url: `${API_URL}/sell_orders/current`,
          headers: {
            "Content-Type": "application/json",
          },
          data: JSON.stringify({ order_id: item._id, current: 1 }),
        });
        console.log("currentResult", currentResult);
      } catch (e) {
        console.log("error when set current!", e);
        return false;
      }
    }
  };

  const [onPending, setOnPending] = useState(false);
  const [onSuccess, setOnSuccess] = useState(false);

  const router = useRouter();
  const { token } = router.query;
  const [finalUsdValue, setFinalUsdValue] = useState(0);
  const [finalUsdTotal, setFinalUsdTotal] = useState(0);

  useEffect(() => {
    const handlePrice = async () => {
      await axios(
        "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD"
      ).then((res) => {
        setFinalUsdValue(
          Number(item.erc20TokenAmount) * 0.000000000000000001 * res.data.USD
        );
        setFinalUsdTotal(
          (Number(item.erc20TokenAmount) * 0.000000000000000001 +
            Number(item.fees[0].amount) * 0.000000000000000001) *
            res.data.USD
        );
      });
    };
    handlePrice();
  }, []);

  return (
    <div>
      <h1 className={styles.newDesignHeader}>Accept Offer Now</h1>
      <h3 className={styles.buyNowHeader}>{data.name}</h3>
      <div className={styles.newDesignFlex}>
        <h3 className={styles.buyItNowMain}>Collection</h3>
        <h3
          className={styles.buyItNowMain}
          style={{ textTransform: "capitalize" }}
        >
          {data.collection}
        </h3>
      </div>
      <div className={styles.newDesignFlex}>
        <h3 className={styles.buyItNowMain}>NFT No.</h3>
        <h3 className={styles.buyItNowMain}>{data.nftNo}</h3>
      </div>
      <div className={styles.newDesignFlex}>
        <h3 className={styles.buyItNowMain}>Rarity</h3>
        <h3 className={styles.buyItNowMain}>1 of 1</h3>
      </div>
      <div className={styles.newDesignFlex}>
        <h3 className={styles.buyItNowMain}>Token ID</h3>
        <h3 className={styles.buyItNowMain}>{token}</h3>
      </div>
      <div className={styles.newDesignFlex}>
        <h3 className={styles.buyItNowMain}>Owner</h3>
        <div className={styles.newDesignOwnerFlex}>
          <img
            src={"/images/Depredation.jpg"}
            alt=""
            className={styles.newPersonImage}
          />
          <h3 className={styles.buyItNowMain}>
            {mintingAddress.substring(0, 6)}...
            {mintingAddress.substring(mintingAddress.length - 6)}
          </h3>
        </div>
      </div>
      <div className={styles.offerLine} />
      <div className={styles.newDesignFlex}>
        <h3 className={styles.buyNowHeader} style={{ margin: "0" }}>
          Price
        </h3>
        <h3 className={styles.buyNowHeader} style={{ margin: "0" }}>
          {Number(item.erc20TokenAmount) * 0.000000000000000001} ETH
        </h3>
      </div>
      <div className={styles.newDesignFlex}>
        <h3 className={styles.buyItNowMainSub}>USD value</h3>
        <h3 className={styles.buyItNowMainSub}>{finalUsdValue} USD</h3>
      </div>
      <div className={styles.newDesignFlex}>
        <h3 className={styles.buyItNowMainSub} style={{ margin: "0" }}>
          Fee
        </h3>
        <h3 className={styles.buyItNowMainSub} style={{ margin: "0" }}>
          {Number(item.fees[0].amount) * 0.000000000000000001}
        </h3>
      </div>
      <div className={styles.offerLine} />
      <div className={styles.newDesignFlex}>
        <h3 className={styles.buyNowHeader} style={{ margin: "0" }}>
          Total
        </h3>
        <h3 className={styles.buyNowHeader} style={{ margin: "0" }}>
          {Number(item.erc20TokenAmount) * 0.000000000000000001 +
            Number(item.fees[0].amount) * 0.000000000000000001}{" "}
          ETH
        </h3>
      </div>
      <div className={styles.newDesignFlex}>
        <h3 className={styles.buyItNowMainSub}>USD value</h3>
        <h3 className={styles.buyItNowMainSub}>{finalUsdTotal} USD</h3>
      </div>
      <div>
        <button
          className={stylesNewTokenId.newWhiteButton}
          disabled={disabled}
          style={{ cursor: disabled ? "not-allowed" : "pointer" }}
          onClick={() => {
            if (item.order_direction == 0) acceptSellOffer();
            if (item.order_direction == 1) acceptBuyOffer();
          }}
        >
          Confirm
        </button>
      </div>
      <br />
      {onPending ? (
        <div className={stylesForBottomPart.emailLoaderContainer}>
          <MoonLoader size={32} />
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
    </div>
  );
};

export default AcceptOfferComponent;
