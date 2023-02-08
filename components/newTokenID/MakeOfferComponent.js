import styles from "../../styles/modules/newTokenID/createAndLoginAccount.module.css";
import { IoLogoUsd } from "react-icons/io";
import { styled } from "@stitches/react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { violet, mauve, blackA } from "@radix-ui/colors";
import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";
import { NFTabi } from "../../utils/ABIs/NFTabi";
import { tokenABI } from "../../utils/ABIs/TokenABI";
import { SMARTCONTRACTADDR, TokenAddressList } from "../../utils/constants";
import { useSelector } from "react-redux";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { IoMdLock } from "react-icons/io";

import NumberFormat from "react-number-format";
import { format } from "date-fns";

import {
  StyledTrigger2,
  StyledTrigger,
  StyledPrimitiveValue,
  StyledPrimitiveIcon,
  StyledContent,
  StyledViewport,
  StyledItem,
  StyledItemIndicator,
  StyledLabel,
  scrollButtonStyles,
} from "./TokenSelectCss";

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

const MakeOfferComponent = ({
  data, //  the NFT data which contains name, minter etc...
  setStage, //  the function which set the stage of the step wizard
  title, //  the direction of the order
  setOfferInfo, //  the function which set order info after this stage
  number, //  the NFT tokenID
  stage, //  the current stage
}) => {
  console.log("title", title);
  const { connectedAddress } = useSelector((state) => state.minting);
  const { web3 } = useSelector((state) => state.minting);
  const [selectedCurrency, setSelectedCurrency] = useState(
    title == "Sell" ? "ETH" : "WETH"
  ); //  the currency type which users select
  const [selectedCurrencyInput, setSelectedCurrencyInput] = useState(
    //  the amount of currency
    data.price_in_eth
      ? selectedCurrency === null ||
        selectedCurrency === "WETH" ||
        selectedCurrency === "ETH"
        ? data.price_in_eth.toFixed(2)
        : data.price_in_usd.toFixed(2)
      : "0"
  );

  const [ownerOfNFT, setOwnerOfNFT] = useState(""); //  owner of the NFT
  const currencyArray = [
    { currency: "ETH" },
    { currency: "WETH" },
    { currency: "USDC" },
    { currency: "DAI" },
    { currency: "USDT" },
  ]; // the array of currency
  const expireDayArray = ["24", "48", "72"]; //  the array of expiry
  const [expireDay, setExpireDay] = useState("24"); //  current expiry day ***will modified soon***
  const [customExpireDay, setCustomExpireDay] = useState(0);

  useEffect(async () => {
    //  get NFT owner when on this stage
    if (stage != 1) return false; //when step wizard is not on this stage
    const NFTInstance = new web3.eth.Contract(NFTabi, SMARTCONTRACTADDR);
    var owner = await NFTInstance.methods.ownerOf(number).call();
    console.log("owner", owner);
    setOwnerOfNFT(owner);

    if (title == "Buy") {
      var maxTokenAmount = 0,
        max = 1;
      for (var i = 1; i < TokenAddressList.length; ++i) {
        const tokenInstance = new web3.eth.Contract(
          tokenABI,
          TokenAddressList[i]
        );
        const tokenAmount = tokenInstance.methods
          .balanceOf(connectedAddress)
          .call();
        if (i == 1 && tokenAmount != 0) return;
        if (tokenAmount > maxTokenAmount) max = i;
      }
      console.log("max", max);
      setSelectedCurrency(currencyArray[max].currency);
    }
  }, [stage]);

  useEffect(() => {
    // when selected currency type is changed, the amount of currency is also change
    setSelectedCurrencyInput(
      data.price_in_eth
        ? selectedCurrency === null ||
          selectedCurrency === "WETH" ||
          selectedCurrency === "ETH"
          ? data.price_in_eth.toFixed(2)
          : data.price_in_usd.toFixed(2)
        : "0"
    );
  }, [selectedCurrency]);

  // const [buttonDisabled, setButtonDisabled] = useState(false);
  const [finalDay, setFinalDay] = useState();
  useEffect(() => {
    function addDays(date, hours) {
      var result = new Date(date);
      result.setHours(result.getHours() + hours);
      return result;
    }
    const date = new Date();

    if (Number(customExpireDay)) {
      setFinalDay(
        format(addDays(date, Number(customExpireDay)), "LLLL d, yyyy") +
          " at " +
          format(addDays(date, Number(customExpireDay)), "p O")
      );
      console.log(
        format(addDays(date, Number(customExpireDay)), "LLLL d, yyyy") +
          " at " +
          format(addDays(date, Number(customExpireDay)), "p O")
      );
    } else {
      setFinalDay(
        format(addDays(date, Number(expireDay)), "LLLL d, yyyy") +
          " at " +
          format(addDays(date, Number(expireDay)), "p O")
      );
    }
  }, [customExpireDay, expireDay]);
  return (
    <div className={styles.content}>
      <div className={styles.contentTitle}>
        <h1 className={styles.newDesignHeader}>{title} Offer </h1>
        <span>ON-CHAIN</span>
      </div>
      <form
        className={styles.makeOfferForm}
        onSubmit={(e) => e.preventDefault()}
      >
        <label>BID:</label>

        {selectedCurrency === "WETH" ? (
          <img
            src={"/images/icon/WETH.svg"}
            className={styles.usd}
            alt="Sold"
          />
        ) : selectedCurrency === "ETH" ? (
          <img src={"/images/icon/ETH.svg"} className={styles.usd} alt="Sold" />
        ) : selectedCurrency === "USDC" ||
          selectedCurrency === "USDT" ||
          selectedCurrency === "DAI" ? (
          <IoLogoUsd
            className={styles.usd}
            style={{
              display:
                selectedCurrency === "USDC" ||
                selectedCurrency === "USDT" ||
                selectedCurrency === "DAI"
                  ? "flex"
                  : "none",
            }}
          />
        ) : null}
        <NumberFormat
          value={selectedCurrencyInput}
          displayType="input"
          // thousandSeparator={true}
          decimalSeparator="."
          style={{ padding: "20px 120px 20px 50px" }}
          onValueChange={(value) => {
            setSelectedCurrencyInput(value.formattedValue);
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
                <ChevronDownIcon className={styles.icon} />
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
                    return index != 0 || ownerOfNFT == connectedAddress ? ( //  Add ETH only sell order, which means when owner of NFT and connected address is same
                      <SelectItem value={item.currency}>
                        <SelectItemText>{item.currency}</SelectItemText>
                      </SelectItem>
                    ) : (
                      <></>
                    );
                  })}
                </SelectGroup>
              </SelectViewport>
              <SelectScrollDownButton>
                <ChevronDownIcon className={styles.icon} />
              </SelectScrollDownButton>
            </SelectContent>
          </Select>
        </div>
      </form>
      <form
        className={styles.makeOfferForm}
        onSubmit={(e) => e.preventDefault()}
      >
        <label>DEADLINE:</label>
        <input
          type="text"
          placeholder="CUSTOM EXPIRY"
          style={{
            fontSize: customExpireDay ? "1.35rem" : "0.9rem",
            padding: customExpireDay
              ? "20px 80px 20px 170px"
              : "20px 20px 20px 148px",
          }}
          value={customExpireDay ? customExpireDay : ""}
          onChange={(e) => {
            setCustomExpireDay(e.target.value);
          }}
        />
        <h1
          className={styles.hours}
          style={{ display: customExpireDay ? "flex" : "none" }}
        >
          {customExpireDay > 1 ? "Hours" : "Hour"}
        </h1>
        <div
          className={styles.selectValueDropdownLeft}
          style={{
            display: customExpireDay ? "flex" : "block",
            width: customExpireDay ? "auto" : "100px",
            alignItems: "center",
          }}
        >
          {customExpireDay ? (
            <h3 className={styles.expireText}>Withdraw offer in:</h3>
          ) : (
            <Select
              defaultValue={expireDay}
              value={expireDay}
              onValueChange={setExpireDay}
            >
              <SelectTrigger2 aria-label={expireDay}>
                <SelectValue aria-label={expireDay} />
                <SelectIcon>
                  <ChevronDownIcon className={styles.icon} />
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
                          <SelectItemText>{item} Hours</SelectItemText>
                        </SelectItem>
                      );
                    })}
                  </SelectGroup>
                </SelectViewport>
                <SelectScrollDownButton>
                  <ChevronDownIcon className={styles.icon} />
                </SelectScrollDownButton>
              </SelectContent>
            </Select>
          )}
        </div>
      </form>
      <button
        className={styles.newWhiteButton}
        style={{
          width: "136px",
          padding: "0",
          cursor: "pointer",
        }}
        onClick={async () => {
          if (connectedAddress != ownerOfNFT && selectedCurrency == "ETH") {
            toast.error("You can select ETH when only make sell order!");
          } else {
            setStage(2);
            setOfferInfo(
              selectedCurrencyInput,
              selectedCurrency,
              customExpireDay
                ? customExpireDay
                : Number(expireDay.slice(0, expireDay.length))
            ); //  set variables in makeOrderSTepWizard by calling this function
          }
        }}
        disabled={false}
      >
        MAKE
      </button>

      <div className={styles.textDes}>
        {customExpireDay && !Number(customExpireDay) ? (
          <p>Add a valid hour.</p>
        ) : (
          <p>
            {title === "Sell" ? "Listing" : "Offer"} will automatically expire
            on {finalDay}.
          </p>
        )}
        <p>
          You can manually cancel an open{" "}
          {title === "Sell" ? "listing" : "buy offer"} at any time.
        </p>
      </div>
      <div className={`${styles.textDes} ${styles.lightSection}`}>
        <IoMdLock className={styles.iconClose} width="25" height="25" />
        <p>
          {" "}
          All orders are matched on Ethereum via a gas optimized, Etherscan
          verified, and third party audited smart contract.
        </p>
        <p>Your assets are always under your control.</p>
        {/* <p>learn more</p> */}
      </div>
      {/* <div className={`${styles.textDes} ${styles.bottomText}`}>
        <p>64 GWEI.</p>
      </div> */}
    </div>
  );
};

export default MakeOfferComponent;
