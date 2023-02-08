import styles from "../../styles/modules/newTokenID/createAndLoginAccount.module.css";
import { HiOutlineArrowNarrowLeft } from "react-icons/hi";
import { AiOutlineClose } from "react-icons/ai";
import SlidingPane from "react-sliding-pane";
import "react-sliding-pane/dist/react-sliding-pane.css";
import { styled } from "@stitches/react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { violet, mauve, blackA } from "@radix-ui/colors";
import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";
import { ethers } from 'ethers';
import Web3 from "web3";
import { tokenABI } from "../../utils/ABIs/TokenABI";
import { NFTabi } from "../../utils/ABIs/NFTabi";
import { ERC721OrderFeatureABI } from "../../utils/ABIs/ERC721OrdersFeature";
import axios from "axios";
import {
    ERC721OrderFeatureAddress,
    TokenAddressList,
    SMARTCONTRACTADDR,
    API_URL,
  } from "../../utils/constants";
import { useSelector } from "react-redux";
import React, { useState, useEffect } from 'react';
import { isMobile } from "react-device-detect";

const StyledTrigger = styled(SelectPrimitive.SelectTrigger, {
  all: "unset",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "start",
  borderRadius: 4,
  padding: "0 0px 0 15px",
  fontSize: 13,
  lineHeight: 1,
  height: 25,
  margin: 0,
  paddingBottom: "2px",
  gap: 5,
  backgroundColor: "#000",
  color: "#fff",
  border: "2px solid #fff",
  cursor: "pointer",
  minWidth: "70px",
  boxShadow: `0 2px 10px ${blackA.blackA7}`,
  "&:focus": { boxShadow: `0 0 0 2px black` },
});

const StyledTrigger2 = styled(SelectPrimitive.SelectTrigger, {
  all: "unset",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "start",
  borderRadius: 4,
  padding: "0 0px 0 15px",
  fontSize: 13,
  lineHeight: 1,
  height: 25,
  margin: 0,
  paddingBottom: "2px",
  gap: 5,
  backgroundColor: "#000",
  color: "#fff",
  border: "2px solid #fff",
  cursor: "pointer",
  boxShadow: `0 2px 10px ${blackA.blackA7}`,
  "&:focus": { boxShadow: `0 0 0 2px black` },
});

const StyledContent = styled(SelectPrimitive.Content, {
  overflow: "hidden",
  backgroundColor: "#000",
  borderRadius: 6,
  border: "2px solid #fff",
  marginLeft: "-5px",
  padding: 0,
  boxShadow:
    "0px 10px 38px -10px rgba(22, 23, 24, 0.35), 0px 10px 20px -15px rgba(22, 23, 24, 0.2)",
});

const StyledViewport = styled(SelectPrimitive.Viewport, {
  padding: 0,
});

const StyledItem = styled(SelectPrimitive.Item, {
  all: "unset",
  fontSize: 13,
  lineHeight: "30px",
  color: "#fff",
  borderRadius: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
  height: 35,
  width: "100%",
  padding: "0 0 0 10px",
  position: "relative",
  userSelect: "none",
  fontFamily: "Sen",
  cursor: "pointer",
  // borderTop: '1px solid #fff',
  "&[data-disabled]": {
    color: mauve.mauve8,
    pointerEvents: "none",
  },
  "&:focus": {
    backgroundColor: "#fff",
    color: "#000",
  },
});

const StyledLabel = styled(SelectPrimitive.Label, {
  padding: "5px 10px",
  fontSize: 11,
  textTransform: "uppercase",
  lineHeight: "25px",
  color: "#fff",
  marginBottom: "5px",
  fontFamily: "Plaid",
});
const StyledPrimitiveValue = styled(SelectPrimitive.Value, {
  marginTop: "3px",
  fontFamily: "Plaid-L-Mono",
});
const StyledPrimitiveIcon = styled(SelectPrimitive.Icon, {
  marginTop: "0px",
});

const StyledItemIndicator = styled(SelectPrimitive.ItemIndicator, {
  position: "absolute",
  left: 0,
  width: 25,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
});

const scrollButtonStyles = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: 25,
  backgroundColor: "white",
  color: violet.violet11,
  cursor: "default",
};

const StyledScrollUpButton = styled(
  SelectPrimitive.ScrollUpButton,
  scrollButtonStyles
);

const StyledScrollDownButton = styled(
  SelectPrimitive.ScrollDownButton,
  scrollButtonStyles
);

// select 2
export const SelectTrigger2 = StyledTrigger2;

// Exports
export const Select = SelectPrimitive.Root;
export const SelectTrigger = StyledTrigger;
export const SelectValue = StyledPrimitiveValue;
export const SelectIcon = StyledPrimitiveIcon;
export const SelectContent = StyledContent;
export const SelectViewport = StyledViewport;
export const SelectGroup = SelectPrimitive.Group;
export const SelectItem = StyledItem;
export const SelectItemText = SelectPrimitive.ItemText;
export const SelectItemIndicator = StyledItemIndicator;
export const SelectLabel = StyledLabel;
export const SelectScrollUpButton = StyledScrollUpButton;
export const SelectScrollDownButton = StyledScrollDownButton;

const SlideMakeOfferNew = ({ makeOfferNew, setMakeOfferNew , number, data, web3}) => {
  const { connectedAddress } = useSelector((state) => state.minting);
  const { web3 } = useSelector((state) => state.minting);
  const [selectedCurrency, setSelectedCurrency] = useState("WETH");
  const [selectedCurrencyInput, setSelectedCurrencyInput] = useState(
    data.price_in_eth
      ? selectedCurrency === null || selectedCurrency === "WETH"
        ? data.price_in_eth.toFixed(2)
        : data.price_in_usd.toFixed(2)
      : "0"
  );
  
  useEffect(() => {
    setSelectedCurrencyInput(
      data.price_in_eth
        ? selectedCurrency === null || selectedCurrency === "WETH"
          ? data.price_in_eth.toFixed(2)
          : data.price_in_usd.toFixed(2)
        : "0"
    );
  }, [selectedCurrency]);

  const [currencyArray, setCurrencyArray] = useState([
    { currency: "WETH" },
    { currency: "USDC" },
    { currency: "DAI" },
    { currency: "USDT" },
  ]);
  const [expireDayArray, setExpireDayArray] = useState([
    "24H",
    "72H",
    "7D",
    "30D",
  ]);
  const [expireDay, setExpireDay] = useState("24H");

  const makeBuyOffer = async () => {
    console.log("You are in makeBuyOffer function.");
    if(connectedAddress == "")
    {
      console.log("Please connected to wallet!");
      return false;
    }
    
    const marketPlaceInstance = new web3.eth.Contract(
      ERC721OrderFeatureABI,
      ERC721OrderFeatureAddress
    );

    var latestNonce = await axios.get(`${API_URL}/nonce`);
    if (latestNonce.data.success == false) {
      console.log(
        "Something is wrong with server. Please check network connection or contact to us."
      );
      return false;
    }
    console.log("LatestNonce:", latestNonce);
    var expireTime =
      expireDay == "24H"
        ? 60 * 60 * 24
        : expireDay == "72H"
        ? 60 * 60 * 24
        : expireDay == "7D"
        ? 60 * 60 * 24 * 7
        : expireDay == "30D"
        ? 60 * 60 * 24 * 30
        : 0;
    const NFTInstance = new web3.eth.Contract(NFTabi, SMARTCONTRACTADDR);

    const NFTTaker = await NFTInstance.methods.ownerOf(number).call();

    if(connectedAddress == NFTTaker)
    {
      console.log("Owner can not make offer!");
      return false;
    }

    console.log(1);
    var erc20AmountBN = ethers.utils.parseEther(selectedCurrencyInput);
    const order = {
      direction: 1,
      maker: connectedAddress,
      taker: NFTTaker,
      expiry: Math.floor(new Date().getTime() / 1000) + expireTime,
      nonce: latestNonce.data.nonce + 1,
      erc20Token: TokenAddressList[0],
      erc20TokenAmount: erc20AmountBN.div(10000).mul(9875).toString(),
      fees: [
        {
          recipient: "0x0148bE2b36E7Ff2F86E2b6c41554379921312902",
          amount: erc20AmountBN.mul(25).div(1000).toString(),
          feeData: "0x",
        }
      ],
      erc721Token: SMARTCONTRACTADDR,
      erc721TokenId: Number(number),
      erc721TokenProperties: [],
    };
    console.log("Order:", order);

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
          url: `${API_URL}/buy_orders`,
          headers: {
            "Content-Type": "application/json",
          },
          data: JSON.stringify(fetchData), // body data type must match "Content-Type" header
        });
        if (fetchResult.data.success == true) console.log("Order added!");
        else {
          console.log(
            "Something is wrong with server!\nPlease contact with server side!"
          );
          return false;
        }
      } catch (e) {
        console.log("Error when connecting db:", e);
        return false;
      }

      await marketPlaceInstance.methods.preSignERC721Order(order).send({
        from: connectedAddress,
      }).on("sending", function(){
        console.log("sending");
      })
      .on("sent", function(){
        console.log("sent");
      })
      .on("transactionHash", function(transactionHash){
        console.log("transactionHash", transactionHash);
      })
      .on("receipt", function(receipt){
        console.log("receipt", receipt);
      })
      .on("confirmation", function (confirmationNumber, receipt) {
        if (confirmationNumber === 1 && receipt.status === true) {
          console.log("confirmed!", confirmationNumber, receipt);
        }
      })
      .on("error", function(error){
        console.log("error", error);
      });

      try {
        var currentResult = await axios({
          method: "PATCH",
          url: `${API_URL}/buy_orders/current`,
          headers: {
            "Content-Type": "application/json",
          },
          data: JSON.stringify({ order_id: fetchResult.data.body._id, current: 1}),
        });
        console.log("currentResult", currentResult);
      } catch (e) {
        console.log("error when set current to 1!", e);
        return false;
      }
    } catch (e) {
      console.log("Error while signing!", e);
      return false;
    }
    return true;
  }

  const makeSellOffer = async () => {
    console.log("You are in makeSellOffer function.");
    if(connectedAddress == "")
    {
      console.log("Please connected to wallet!");
      return false;
    }

    const marketPlaceInstance = new web3.eth.Contract(
      ERC721OrderFeatureABI,
      ERC721OrderFeatureAddress
    );

    var latestNonce = await axios.get(`${API_URL}/nonce`);
    if (latestNonce.data.success == false) {
      console.log(
        "Something is wrong with server. Please check network connection or contact to us."
      );
      return false;
    }
    console.log("LatestNonce:", latestNonce);
    var expireTime =
      expireDay == "24H"
        ? 60 * 60 * 24
        : expireDay == "72H"
        ? 60 * 60 * 24
        : expireDay == "7D"
        ? 60 * 60 * 24 * 7
        : expireDay == "30D"
        ? 60 * 60 * 24 * 30
        : 0;
    const NFTInstance = new web3.eth.Contract(NFTabi, SMARTCONTRACTADDR);

    const NFTTaker = await NFTInstance.methods.ownerOf(number).call();

    if(connectedAddress != NFTTaker)
    {
      console.log("Only Owner can make offer!");
      return false;
    }

    var erc20AmountBN = ethers.utils.parseEther(selectedCurrencyInput);
    const order = {
      direction: 1,
      maker: connectedAddress,
      taker: "0x0000000000000000000000000000000000000000",
      expiry: Math.floor(new Date().getTime() / 1000) + expireTime,
      nonce: latestNonce.data.nonce + 1,
      erc20Token: TokenAddressList[0],
      erc20TokenAmount: erc20AmountBN.div(10000).mul(9875).toString(),
      fees: [
        {
          recipient: "0x0148bE2b36E7Ff2F86E2b6c41554379921312902",
          amount: erc20AmountBN.mul(25).div(1000).toString(),
          feeData: "0x",
        }
      ],
      erc721Token: SMARTCONTRACTADDR,
      erc721TokenId: Number(number),
      erc721TokenProperties: [],
    };
    console.log("Order:", order);

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
            "Something is wrong with server!\nPlease contact with server side!"
          );
          return false;
        }
      } catch (e) {
        console.log("Error when connecting db:", e);
        return false;
      }

      await marketPlaceInstance.methods.preSignERC721Order(order).send({
        from: connectedAddress,
      }).on("sending", function(){
        console.log("sending");
      })
      .on("sent", function(){
        console.log("sent");
      })
      .on("transactionHash", function(transactionHash){
        console.log("transactionHash", transactionHash);
      })
      .on("receipt", function(receipt){
        console.log("receipt", receipt);
      })
      .on("confirmation", function (confirmationNumber, receipt) {
        if (confirmationNumber === 1 && receipt.status === true) {
          console.log("confirmed!", confirmationNumber, receipt);
        }
      })
      .on("error", function(error){
        console.log("error", error);
      });

      try {
        var currentResult = await axios({
          method: "PATCH",
          url: `${API_URL}/sell_orders/current`,
          headers: {
            "Content-Type": "application/json",
          },
          data: JSON.stringify({ order_id: fetchResult.data.body._id, current: 1}),
        });
        console.log("currentResult", currentResult);
      } catch (e) {
        console.log("error when set current to 1!", e);
        return false;
      }
    } catch (e) {
      console.log("Error while signing!", e);
      return false;
    }
    return true;
  }

  return (
    <SlidingPane
      closeIcon={<HiOutlineArrowNarrowLeft />}
      className={styles.newSlideContainer}
      overlayClassName="some-custom-overlay-class"
      isOpen={makeOfferNew}
      title={
        <div className={styles.newPurchaseTitle}>
          Make Offer
          <AiOutlineClose
            onClick={() => {
              setMakeOfferNew(false);
            }}
          />
        </div>
      }
       width={isMobile ? "100%" : "30%"}
      onRequestClose={() => {
        setMakeOfferNew(false);
      }}
    >
      <div className={styles.content}>
        <div className={styles.contentTitle}>
          <h1 className={styles.newDesignHeader}>MAKE OFFER </h1>
          <span>ON-CHAIN</span>
        </div>
        <form
          className={styles.makeOfferForm}
          onSubmit={(e) => e.preventDefault()}
        >
          <label>Bid:</label>
          <input
            type="number"
            style={{ padding: "20px 120px 20px 20px" }}
            value={selectedCurrencyInput}
            onChange={(e) => {
              setSelectedCurrencyInput(
                e.target.value.replace(",", "")
              );
            }}
          />
          <div className={styles.selectValueDropdown}>
            <Select
              defaultValue={selectedCurrency}
              value={selectedCurrency}
              onValueChange={setSelectedCurrency}
            >
              <SelectTrigger aria-label={selectedCurrency}>
                <SelectValue aria-label={selectedCurrency} />
                <SelectIcon>
                  <ChevronDownIcon />
                </SelectIcon>
              </SelectTrigger>
              <SelectContent>
                <SelectScrollUpButton>
                  <ChevronUpIcon />
                </SelectScrollUpButton>
                <SelectViewport>
                  <SelectGroup>
                    <SelectLabel>currency</SelectLabel>
                    {currencyArray.map((item, index) => {
                      return (
                        <SelectItem value={item.currency}>
                          <SelectItemText>{item.currency}</SelectItemText>
                        </SelectItem>
                      );
                    })}
                  </SelectGroup>
                </SelectViewport>
                <SelectScrollDownButton>
                  <ChevronDownIcon />
                </SelectScrollDownButton>
              </SelectContent>
            </Select>
          </div>
        </form>
        <form
          className={styles.makeOfferForm}
          onSubmit={(e) => e.preventDefault()}
        >
          <label>Deadline:</label>
          <input type="number" placeholder="Custom" />
          <div className={styles.selectValueDropdownLeft}>
            <Select
              defaultValue={expireDay}
              value={expireDay}
              onValueChange={setExpireDay}
            >
              <SelectTrigger2 aria-label={expireDay}>
                <SelectValue aria-label={expireDay} />
                <SelectIcon>
                  <ChevronDownIcon />
                </SelectIcon>
              </SelectTrigger2>
              <SelectContent>
                <SelectScrollUpButton>
                  <ChevronUpIcon />
                </SelectScrollUpButton>
                <SelectViewport>
                  <SelectGroup>
                    <SelectLabel>deadline</SelectLabel>
                    {expireDayArray.map((item) => {
                      return (
                        <SelectItem value={item}>
                          <SelectItemText>{item} Expiry</SelectItemText>
                        </SelectItem>
                      );
                    })}
                  </SelectGroup>
                </SelectViewport>
                <SelectScrollDownButton>
                  <ChevronDownIcon />
                </SelectScrollDownButton>
              </SelectContent>
            </Select>
          </div>
        </form>
        <button
          className={styles.newWhiteButton}
          style={{ width: "136px", padding: "0" }}
          onClick= {() => makeBuyOffer()}
        >
          MAKE
        </button>
      </div>
    </SlidingPane>
  );
};

export default SlideMakeOfferNew;
