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
import { tokenABI } from "../../utils/ABIs/TokenABI";
import toast from "react-hot-toast";
import stylesForBottomPart from "../../styles/modules/newTokenID/newTokenID.module.css";
import { BsCheck2 } from "react-icons/bs";
import PuffLoader from "react-spinners/PuffLoader";

const ConfirmOfferComponent = ({
  title, //  the title of the button, it represent the order direction here
  selectedCurrency, //  the type of currency
  selectedCurrencyInput, //  the amount of currency
  expireDay, //  the expiryDay as hour
  number, //  the tokenID of NFT
  data, //  the data of the NFT which contains the minter, color etc...
  afterOrderConfirmed, //  the functions which handle things after order confirmed
}) => {
  const router = useRouter();
  const { connectedAddress } = useSelector((state) => state.minting);
  const { web3 } = useSelector((state) => state.minting);
  const mintingAddress = data.minting_address;
  const { token } = router.query;

  // users make buy order here
  const makeBuyOrder = async () => {
    setDisabled(true); // disable button
    setOnPending(true); // and show users pending alert
    console.log("You are in makeBuyOrder function.");
    if (connectedAddress == "") {
      console.log("Please connect to wallet!");
      toast.error("Please connect to wallet!");
      return false;
    }

    const marketPlaceInstance = new web3.eth.Contract( //  get marketplace instance
      ERC721OrderFeatureABI,
      ERC721OrderFeatureAddress
    );

    // get the latestNonce from db, we need to use latestNonce + 1
    var latestNonce = await axios.get(`${API_URL}/nonce`);
    if (latestNonce.data.success == false) {
      console.log(
        "Something is wrong. Please check network connection or contact to us."
      );
      toast.error(
        "Something is wrong. Please check network connection or contact to us."
      );
      return false;
    }

    console.log("LatestNonce:", latestNonce);
    var expireTime = expireDay * 60 * 60; //  calc exact expire time left in seconds

    const NFTInstance = new web3.eth.Contract(NFTabi, SMARTCONTRACTADDR); //  get color NFT instance

    // get NFT owner
    var NFTTaker;
    try {
      NFTTaker = await NFTInstance.methods.ownerOf(number).call();
    } catch (e) {
      console.log("Something is wrong with: ", e);
      return false;
    }
    if (connectedAddress == NFTTaker) {
      console.log("Owner can not make offer!");
      toast.error("Owner can not make offer!");
      return false;
    }

    // get selected token instance
    const currencyArray = ["ETH", "WETH", "USDC", "DAI", "USDT"];
    const indexOfCurrency = currencyArray.indexOf(selectedCurrency);
    console.log(indexOfCurrency);
    const tokenInstance = new web3.eth.Contract(
      tokenABI,
      TokenAddressList[indexOfCurrency]
    );

    // calc exact amount of erc20 token amount with decimals
    const decimal = await tokenInstance.methods.decimals().call();
    var erc20AmountBN = ethers.utils.parseEther(selectedCurrencyInput);
    erc20AmountBN = erc20AmountBN.div(Math.pow(10, 18 - decimal));

    //build order
    const order = {
      direction: 1, // 1 for buy order
      maker: connectedAddress, // maker is connectedAddress when making buy order
      taker: NFTTaker, // taker is ownerOf NFT
      expiry: Math.floor(new Date().getTime() / 1000) + expireTime, // expire time + current time
      nonce: latestNonce.data.nonce + 1, // the right nonce = latestNonce + 1
      erc20Token: TokenAddressList[indexOfCurrency], // the selected token address
      erc20TokenAmount: erc20AmountBN.div(10000).mul(9875).toString(), // exact amount of token which owner will receive
      fees: [
        // exact amount of token which owner of marketplace will receive
        {
          recipient: "0x0148bE2b36E7Ff2F86E2b6c41554379921312902",
          amount: erc20AmountBN.mul(25).div(1000).toString(),
          feeData: "0x",
        },
      ],
      erc721Token: SMARTCONTRACTADDR, // color NFT address
      erc721TokenId: Number(number), // exact tokenID
      erc721TokenProperties: [], // no property for now
    };

    // There can be orders which is not in db so nonce can be wrong.
    // So we need to check order status by increasing it's nonce
    var isOrderCorrect = false;
    while (!isOrderCorrect) {
      try {
        await marketPlaceInstance.methods.getERC721OrderStatus(order).call();
        isOrderCorrect = true;
      } catch (e) {
        console.log(e);
        order.nonce += 1;
      }
    }

    try {
      // First add order to database, current is 0 for now
      var fetchResult;
      try {
        var fetchData = order;
        fetchData.nft_color_id = "62ec1da706ff5da975b9c1bf";
        const signature = {
          signatureType: 4,
          v: 0,
          r: "0x0000000000000000000000000000000000000000000000000000006d6168616d",
          s: "0x0000000000000000000000000000000000000000000000000000006d6168616d",
        };
        fetchData.signature = signature;
        console.log("fetchData:", fetchData);
        fetchResult = await axios({
          // Enter your IP address here
          method: "POST",
          url: `${API_URL}/buy_orders`,
          headers: {
            "Content-Type": "application/json",
          },
          data: JSON.stringify(fetchData), // body data type must match "Content-Type" header
        });
        if (fetchResult.data.success == true) console.log("Order added!");
        else {
          console.log(
            "Something is wrong. Please check network connection or contact to us."
          );
          toast.error(
            "Something is wrong. Please check network connection or contact to us."
          );
          return false;
        }
      } catch (e) {
        console.log("Error when connecting db:", e);
        return false;
      }

      // Second confirm transaction
      var transactionHashOfMake;
      await marketPlaceInstance.methods
        .preSignERC721Order(order)
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
            console.log("confirmed!", receipt);
            toast.success("Transaction confirmed successfully!");
          }
        })
        .on("error", function (error) {
          console.log("error", error);
          toast.error("Error when sending transaction.");
          setDisabled(false);
          setOnPending(false);
          return false;
        });

      // Third set the current value as 1 when order is successfully presigned
      try {
        console.log(`${API_URL}/buy_orders/current`, fetchResult.data.body.nonce, typeof fetchResult.data.body.nonce, transactionHashOfMake, typeof transactionHashOfMake);
        var currentResult = await axios({
          method: "PATCH",
          url: `${API_URL}/buy_orders/current`,
          headers: {
            "Content-Type": "application/json",
          },
          data: JSON.stringify({
            nonce: fetchResult.data.body.nonce,
            current: 1,
            makingHash: transactionHashOfMake,
          }),
        });
        console.log("currentResult", currentResult);
        setOnPending(false);
        setOnSuccess(true);
        afterOrderConfirmed();
      } catch (e) {
        console.log("error when set current to 1!", e);
        return false;
      }
    } catch (e) {
      console.log("Error while signing!", e);
      return false;
    }
    return true;
  };

  const makeSellOffer = async () => {
    setDisabled(true);
    setOnPending(true);
    console.log("You are in makeSellOffer function.");
    if (connectedAddress == "") {
      console.log("Please connected to wallet!");
      toast.error("Please connect to wallet!");
      return false;
    }

    const marketPlaceInstance = new web3.eth.Contract(
      ERC721OrderFeatureABI,
      ERC721OrderFeatureAddress
    );

    var latestNonce = await axios.get(`${API_URL}/nonce`);
    if (latestNonce.data.success == false) {
      console.log(
        "Something is wrong. Please check network connection or contact to us."
      );
      toast.error(
        "Something is wrong. Please check network connection or contact to us."
      );
      return false;
    }
    console.log("LatestNonce:", latestNonce);
    var expireTime = expireDay * 60 * 60; //  calc exact expire time left in seconds
    const NFTInstance = new web3.eth.Contract(NFTabi, SMARTCONTRACTADDR);

    var NFTTaker;
    try {
      NFTTaker = await NFTInstance.methods.ownerOf(number).call();
    } catch (e) {
      console.log("Something is wrong with: ", e);
      return false;
    }
    if (connectedAddress != NFTTaker) {
      console.log("Only owner can make offer!");
      toast.error("Only owner can make offer!");
      return false;
    }

    const currencyArray = ["ETH", "WETH", "USDC", "DAI", "USDT"];
    const indexOfCurrency = currencyArray.indexOf(selectedCurrency);
    console.log(indexOfCurrency);

    var erc20AmountBN = ethers.utils.parseEther(selectedCurrencyInput);
    if (indexOfCurrency != 0) {
      const tokenInstance = new web3.eth.Contract(
        tokenABI,
        TokenAddressList[indexOfCurrency]
      );
      const decimal = await tokenInstance.methods.decimals().call();
      erc20AmountBN = erc20AmountBN.div(Math.pow(10, 18 - decimal));
    }

    const order = {
      direction: 0,
      maker: connectedAddress,
      taker: "0x0000000000000000000000000000000000000000",
      expiry: Math.floor(new Date().getTime() / 1000) + expireTime,
      nonce: latestNonce.data.nonce + 1,
      erc20Token: TokenAddressList[indexOfCurrency],
      erc20TokenAmount: erc20AmountBN.div(10000).mul(9875).toString(),
      fees: [
        {
          recipient: "0x0148bE2b36E7Ff2F86E2b6c41554379921312902",
          amount: erc20AmountBN.mul(25).div(1000).toString(),
          feeData: "0x",
        },
      ],
      erc721Token: SMARTCONTRACTADDR,
      erc721TokenId: Number(number),
      erc721TokenProperties: [],
    };

    var isOrderCorrect = false;
    while (!isOrderCorrect) {
      try {
        await marketPlaceInstance.methods.getERC721OrderStatus(order).call();
        isOrderCorrect = true;
      } catch (e) {
        console.log(e);
        order.nonce += 1;
      }
    }

    try {
      var fetchResult;
      try {
        var fetchData = order;
        fetchData.nft_color_id = "62ec1da706ff5da975b9c1bf";
        const signature = {
          signatureType: 4,
          v: 0,
          r: "0x0000000000000000000000000000000000000000000000000000006d6168616d",
          s: "0x0000000000000000000000000000000000000000000000000000006d6168616d",
        };
        fetchData.signature = signature;
        console.log("fetchData:", fetchData);
        fetchResult = await axios({
          // Enter your IP address here
          method: "POST",
          url: `${API_URL}/sell_orders`,
          headers: {
            "Content-Type": "application/json",
          },
          data: JSON.stringify(fetchData), // body data type must match "Content-Type" header
        });
        if (fetchResult.data.success == true) console.log("Order added!");
        else {
          console.log(
            "Something is wrong. Please check your network or contact with server side!"
          );
          toast.error(
            "Something is wrong. Please check your network or contact with server side!"
          );
          return false;
        }
      } catch (e) {
        console.log("Error when connecting db:", e);
        return false;
      }

      var transactionHashOfMake;
      await marketPlaceInstance.methods
        .preSignERC721Order(order)
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
        })
        .on("confirmation", function (confirmationNumber, receipt) {
          if (confirmationNumber === 1 && receipt.status === true) {
            console.log("confirmed!", confirmationNumber, receipt);
            toast.success("Success!");
          }
        })
        .on("error", function (error) {
          console.log("error", error);
          toast.error("Error when sending transaction.");
          setDisabled(false);
          setOnPending(false);
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
            nonce: fetchResult.data.body.nonce,
            current: 1,
            makingHash: transactionHashOfMake,
          }),
        });
        console.log("currentResult", currentResult);
        setOnPending(false);
        setOnSuccess(true);
        afterOrderConfirmed();
      } catch (e) {
        console.log("error when set current to 1!", e);
        return false;
      }
    } catch (e) {
      console.log("Error while signing!", e);
      toast.error("Error while signing!");
      return false;
    }
    return true;
  };

  const [disabled, setDisabled] = useState(false);
  const [onPending, setOnPending] = useState(false);
  const [onSuccess, setOnSuccess] = useState(false);

  const [finalUsdValue, setFinalUsdValue] = useState(0);
  const [finalUsdTotal, setFinalUsdTotal] = useState(0);

  useEffect(() => {
    const handlePrice = async () => {
      await axios(
        "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD"
      ).then((res) => {
        const currency =
          selectedCurrency === "WETH" || selectedCurrency === "ETH"
            ? res.data.USD
            : 1;
        setFinalUsdValue(
          Number(selectedCurrencyInput.replace(",", ".")) * currency
        );
        if (title == "Buy") {
          const buyValue = (
            (Number(selectedCurrencyInput.replace(",", ".")) * 101.25) /
            100
          ).toFixed(6);
          setFinalUsdTotal(Number(buyValue) * currency);
        } else {
          const sellValue = (
            (Number(selectedCurrencyInput.replace(",", ".")) * (100 - 1.25)) /
            100
          ).toFixed(6);
          setFinalUsdTotal(Number(sellValue) * currency);
        }
      });
    };
    handlePrice();
  }, []);

  return (
    <div>
      <h1 className={styles.newDesignHeader}>Make {title} Offer Now</h1>
      <h3 className={styles.buyNowHeader}>{data.name}</h3>
      <div className={styles.newDesignFlex}>
        <h3 className={styles.buyItNowMain}>Collection</h3>
        <h3 className={styles.buyItNowMain}>{data.base_color_name}</h3>
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
          <div
            src={"/images/Depredation.jpg"}
            alt=""
            className={styles.newPersonImage}
          >
            0x
          </div>
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
          {selectedCurrencyInput} {selectedCurrency}
        </h3>
      </div>
      <div className={styles.newDesignFlex}>
        <h3 className={styles.buyItNowMainSub}>USD value</h3>
        <h3 className={styles.buyItNowMainSub}>
          {finalUsdValue.toFixed(2)} USD
        </h3>
      </div>
      <div className={styles.newDesignFlex}>
        <h3 className={styles.buyItNowMainSub} style={{ margin: "0" }}>
          Fee
        </h3>
        <h3 className={styles.buyItNowMainSub} style={{ margin: "0" }}>
          1.25%{" "}
          {(
            (Number(selectedCurrencyInput.replace(",", ".")) * 1.25) /
            100
          ).toFixed(5)}{" "}
          {selectedCurrency}
        </h3>
      </div>
      <div className={styles.offerLine} />
      <div className={styles.newDesignFlex}>
        <h3 className={styles.buyNowHeader} style={{ margin: "0" }}>
          Total
        </h3>
        <h3 className={styles.buyNowHeader} style={{ margin: "0" }}>
          {title == "Buy"
            ? (
                (Number(selectedCurrencyInput.replace(",", ".")) * 101.25) /
                100
              ).toFixed(6)
            : (
                (Number(selectedCurrencyInput.replace(",", ".")) *
                  (100 - 1.25)) /
                100
              ).toFixed(6)}
          &nbsp;{selectedCurrency}
        </h3>
      </div>
      <div className={styles.newDesignFlex}>
        <h3 className={styles.buyItNowMainSub}>USD value</h3>
        <h3 className={styles.buyItNowMainSub}>
          {finalUsdTotal.toFixed(2)} USD
        </h3>
      </div>
      <div>
        <button
          className={stylesNewTokenId.newWhiteButton}
          disabled={disabled}
          style={{ cursor: disabled ? "not-allowed" : "pointer" }}
          onClick={() => {
            if (title == "Buy") makeBuyOrder();
            if (title == "Sell") makeSellOffer();
          }}
        >
          Confirm
        </button>
      </div>
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

export default ConfirmOfferComponent;
