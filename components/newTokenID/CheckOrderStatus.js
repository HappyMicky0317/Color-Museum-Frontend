import stylesMain from "../../styles/modules/newTokenID/createAndLoginAccount.module.css";
import styles from "../../styles/modules/newTokenID/newTokenID.module.css";
import { HiOutlineArrowNarrowLeft } from "react-icons/hi";
import { AiOutlineClose } from "react-icons/ai";
import SlidingPane from "react-sliding-pane";
import "react-sliding-pane/dist/react-sliding-pane.css";
import { tokenABI } from "../../utils/ABIs/TokenABI";
import {
  ERC721OrderFeatureAddress,
  TokenAddressList,
  SMARTCONTRACTADDR,
  API_URL,
} from "../../utils/constants";
import { useSelector } from "react-redux";
import { NFTabi } from "../../utils/ABIs/NFTabi";
import React, { useEffect, useState } from "react";
import stylesForBottomPart from "../../styles/modules/newTokenID/newTokenID.module.css";
import PuffLoader from "react-spinners/PuffLoader";
import { ethers } from "ethers";
import axios from "axios";
import { useRouter } from "next/router";
import { ERC721OrderFeatureABI } from "../../utils/ABIs/ERC721OrdersFeature";
import toast from "react-hot-toast";

const CheckOrderStatus = ({
  item, // the order item
  setStage,
  stage,
  data,
  afterOrderAccepted,
}) => {
  const { connectedAddress } = useSelector((state) => state.minting);
  const { web3 } = useSelector((state) => state.minting);
  const [onChecking, setOnChecking] = useState(true);
  const [isFail, setIsFail] = useState(false);
  const [errorResult, setErrorResult] = useState(
    "You can not accept this offer"
  );
  const router = useRouter();
  const { token } = router.query;

  useEffect(async () => {
    if (stage != 1)
      //  when not on this stage
      return false;

    setOnChecking(true);

    // check if order is expired
    const currentTime = Math.floor(new Date().getTime() / 1000);
    console.log(currentTime, item);
    if (currentTime > item.expiry) {
      setOnChecking(false);
      console.log("This order is expired!");
      setErrorResult("This order is expired!");
      return false;
    }

    // check if sell order is valid
    if (item.order_direction == 0 && item.maker != connectedAddress) {
      const NFTInstance = new web3.eth.Contract(NFTabi, SMARTCONTRACTADDR);
      var ownerOfNFT = await NFTInstance.methods
        .ownerOf(item.erc721TokenId)
        .call();
      console.log(ownerOfNFT);
      if (ownerOfNFT == item.maker) {
        //  check if NFT is in maker's hand
        if (item.erc20Token != "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee") {
          //  if not native token
          // check if buyer has enough amount of token
          const tokenInstance = new web3.eth.Contract(
            tokenABI,
            item.erc20Token
          ); // get token instance
          var amountOfTaker = await tokenInstance.methods
            .balanceOf(connectedAddress)
            .call();
          console.log(amountOfTaker);

          //check if buyer can pay both the price and fee
          if (
            ethers.utils
              .parseUnits(amountOfTaker, "wei")
              .gte(
                ethers.utils
                  .parseUnits(item.erc20TokenAmount, "wei")
                  .add(ethers.utils.parseUnits(item.fees[0].amount, "wei"))
              )
          ) {
            setErrorResult("You are correct!");
            setOnChecking(false);
            setStage(2);
          } else {
            setOnChecking(false);
            console.log("You don't have enough amount of token!");
            setErrorResult("You don't have enough amount of token!");
          }
        } else {
          // check if buyer has enough amount of eth
          const balanceOfOwner = await web3.eth.getBalance(connectedAddress);
          console.log(balanceOfOwner);
          if (balanceOfOwner < Number(item.erc20TokenAmount)) {
            setOnChecking(false);
            console.log("You don't have enough amount of ether!");
            setErrorResult("You don't have enough amount of ether!");
          } else {
            setOnChecking(false);
            setStage(2);
          }
        }
      } else {
        console.log("Something is wrong! Please contact to server!");
        return false;
      }
    }
    // check if buy order is valid
    else if (item.order_direction == 1 && item.taker == connectedAddress) {
      // check if buyer has enough amount of token
      // token can not be eth when making buy order so don't need to worry about it in this part
      const tokenInstance = new web3.eth.Contract(tokenABI, item.erc20Token);
      var amountOfMaker = await tokenInstance.methods
        .balanceOf(item.maker)
        .call();
      console.log(amountOfMaker);
      if (
        ethers.utils
          .parseUnits(amountOfMaker, "wei")
          .gte(
            ethers.utils
              .parseUnits(item.erc20TokenAmount, "wei")
              .add(ethers.utils.parseUnits(item.fees[0].amount, "wei"))
          )
      ) {
        setErrorResult("You are correct!");
        setOnChecking(false);
        setStage(2);
      } else {
        setOnChecking(false);
        console.log("You don't have enough amount of token!");
        setErrorResult("You don't have enough amount of token!");
      }
    } else {
      console.log("Something is wrong!");
      setErrorResult("Seems like you are the owner of the Order!");
      setOnChecking(false);
      return false;
    }
  }, [stage]);

  const [mintingAddress, setOwner] = useState(data.minting_address);
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

  const acceptSellOffer = async () => {
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
      var valueOfEtherToSend = ethers.utils.parseUnits("0", "wei");

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
            nonce: item.nonce,
            current: 3,
            acceptingHash: transactionHashOfAccept,
          }),
        });
        console.log("currentResult", currentResult);
        afterOrderAccepted();
      } catch (e) {
        console.log("error when set current!", e);
        toast.error("Something is wrong when sending transaction!");
        return false;
      }
    } catch (e) {
      try {
        console.log(transactionHashOfAccept);
        var currentResult = await axios({
          method: "PATCH",
          url: `${API_URL}/sell_orders/current`,
          headers: {
            "Content-Type": "application/json",
          },
          data: JSON.stringify({
            order_id: item._id,
            current: 1,
            current: 3,
            nonce: item.nonce,
          }),
        });
        console.log("currentResult", currentResult);
      } catch (e) {
        console.log("error when set current!", e);
        toast.error("Something is wrong when sending transaction!");
        return false;
      }
    }
  };

  const acceptBuyOffer = async () => {
    console.log(item);
    console.log("I am acceptBuyOffer now with this item", item);

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
        afterOrderAccepted();
      } catch (e) {
        console.log("error when set current!", e);
        toast.error("Something is wrong when sending transaction!");
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
          data: JSON.stringify({
            order_id: item._id,
            current: 1,
            nonce: item.nonce,

            acceptingHash: transactionHashOfAccept,
          }),
        });
        console.log("currentResult", currentResult);
      } catch (e) {
        console.log("error when set current!", e);
        toast.error("Something is wrong when sending transaction!");
        return false;
      }
    }
  };
  return (
    <div className={stylesMain.content}>
      {onChecking ? (
        <div className={stylesForBottomPart.emailLoaderContainer}>
          <PuffLoader size={32} />
          <h4>Checking order status. Please wait...</h4>
        </div>
      ) : (
        <div>
          <h1 className={styles.newDesignHeader}>
            {data.minting_address === connectedAddress
              ? "Accept Offer Now"
              : "Buy Now"}
          </h1>
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
              className={stylesMain.newWhiteButton}
              // disabled={disabled}
              // style={{ cursor: disabled ? "not-allowed" : "pointer" }}
              onClick={() => {
                if (item.order_direction == 0) acceptSellOffer();
                if (item.order_direction == 1) acceptBuyOffer();
              }}
            >
              Confirm
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckOrderStatus;
