import React, { useEffect, useRef, useState } from "react";
import styles from "../../styles/modules/gallery/sort.module.css";
import stylesThird from "../../styles/modules/gallery/loadmore.module.css";
import { VscListSelection } from "react-icons/vsc";
import { BsGrid, BsFillTriangleFill } from "react-icons/bs";
import { BiExpand } from "react-icons/bi";
import Link from "next/link";
import Views from "./Views";
import stylesFilter from "../../styles/modules/gallery/filter.module.css";
import { BsSearch, BsChevronDown } from "react-icons/bs";
import { GrFormNext } from "react-icons/gr";
import { IoMdClose } from "react-icons/io";
import { GoPrimitiveDot } from "react-icons/go";
import { useSelector } from "react-redux";
import * as SelectPrimitive from "@radix-ui/react-select";
import { styled } from "@stitches/react";
import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";
import { createClient } from "@supabase/supabase-js";

import {
  StyledTrigger3,
  StyledTrigger2,
  StyledTrigger,
  StyledPrimitiveValue,
  StyledPrimitiveIcon,
  StyledContentFilter,
  StyledViewport,
  StyledItem,
  StyledItemIndicator,
  StyledLabel,
  scrollButtonStyles,
} from "../newTokenID/TokenSelectCss";
import { COLLECTORS } from "../../utils/constants";
import { isMobile } from "react-device-detect";
import axios from "axios";
import SaleView from "./SaleView";
import ActivityView from "./ActivityView";

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
export const SelectTrigger3 = StyledTrigger3;

// Exports
export const Select = SelectPrimitive.Root;
export const SelectTrigger = StyledTrigger3;
export const SelectValue = StyledPrimitiveValue;
export const SelectIcon = StyledPrimitiveIcon;
export const SelectContent = StyledContentFilter;
export const SelectViewport = StyledViewport;
export const SelectGroup = SelectPrimitive.Group;
export const SelectItem = StyledItem;
export const SelectItemText = SelectPrimitive.ItemText;
export const SelectItemIndicator = StyledItemIndicator;
export const SelectLabel = StyledLabel;
export const SelectScrollUpButton = StyledScrollUpButton;
export const SelectScrollDownButton = StyledScrollDownButton;

const Gallery = () => {
  const { allReceivedData } = useSelector((state) => state.data);
  const [baseColor, setBaseColor] = useState();
  const [isLoadingAmount, setIsLoadingAmount] = useState(false);

  const [amountShowed, setAmountShowed] = useState(2);
  const [listView, setListView] = useState();
  useEffect(() => {
    let theme = "false";
    // Access localStorage
    if (localStorage.getItem("view")) {
      theme = localStorage.getItem("view");
    }
    return theme === "true" ? setListView(true) : setListView(false);
  }, []);
  const handleViewList = () => {
    setListView(true);
  };
  const handleViewGrid = () => {
    setListView(false);
  };
  useEffect(() => {
    localStorage.setItem("view", listView);
  }, [listView]);
  useEffect(() => {
    if (isLoadingAmount) {
      setTimeout(() => {
        setIsLoadingAmount(false);
        setAmountShowed((amountShowed) => amountShowed + 2);
      }, 100);
    }
    return () => {};
  }, [isLoadingAmount]);
  //
  //
  const [search, setSearch] = useState("");
  const [filterIsOpen, setFilterIsOpen] = useState(false);
  const [filtered, setFiltered] = useState(false);
  const [value, setValueReceived] = useState({
    min: 0,
    max: 10000,
  });
  const [minValue, setMinValue] = useState(0);
  const [maxValue, setMaxValue] = useState(0);
  const [selectedBaseColors, setSelectedBaseColors] = useState([]);
  //
  //
  useEffect(() => {
    console.log(allReceivedData);
    if (allReceivedData) {
      let newData = [];
      // eslint-disable-next-line
      allReceivedData.map((item) => {
        newData.push(item.base_color_name);
      });
      var uniq = [...new Set(newData)];
      setBaseColor(uniq);
      //
      //
      const smallest = allReceivedData.reduce((acc, loc) =>
        acc.price_in_usd < loc.price_in_usd ? acc : loc
      );
      const greatest = allReceivedData.reduce((acc, loc) =>
        acc.price_in_usd > loc.price_in_usd ? acc : loc
      );
      setMinValue(smallest.price_in_usd ? smallest.price_in_usd : 0.0);
      setMaxValue(greatest.price_in_usd ? greatest.price_in_usd : 0.0);
      setValueReceived({
        min: smallest.price_in_usd ? smallest.price_in_usd.toFixed(2) : 0.0,
        max: greatest.price_in_usd
          ? greatest.price_in_usd.toFixed(2)
          : 0.0
          ? greatest.price_in_usd.toFixed(2)
          : 10000000,
      });
    }
  }, [allReceivedData]);
  //
  //
  //
  useEffect(() => {
    if (search !== "") {
      setAmountShowed(baseColor.length - 1);
    } else {
      setAmountShowed(2);
    }
  }, [search]);
  //
  //
  const options = ["Increasing", "Decreasing", "Random"];

  const [selectedOption, setSelectedOption] = useState("Increasing");

  // const [ownsColors, setOwnsColors] = useState(false);
  const [toggled, setToggled] = useState(true);

  // const { connectedAddress } = useSelector((state) => state.minting);
  // useEffect(() => {
  //   if (allReceivedData) {
  //     allReceivedData.map((item) => {
  //       if (
  //         item.minting_address?.toLowerCase() ===
  //         connectedAddress?.toLowerCase()
  //       ) {
  //         setOwnsColors(true);
  //       }
  //     });
  //   }
  // }, [connectedAddress]);
  const supaAPIUrl = "https://yrjjxjedmscqqzxoxgpk.supabase.co";
  const supaCanon =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlyamp4amVkbXNjcXF6eG94Z3BrIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTAzOTE0MzksImV4cCI6MTk2NTk2NzQzOX0.ooQ9TOcfYe_rbbVrD-L-uVrDaIaS70EGVPpWdlr3w7w";
  const supabase = createClient(supaAPIUrl, supaCanon);

  const saveToDB = async () => {
    const { data, error } = await supabase
      .from("colorNFTSearch")
      .insert([{ query: search }], { upsert: true });
  };
  const dividedBy = isMobile ? 35 : 50;

  const containerContent = useRef();

  return (
    <>
      <section className={styles.wrapper}>
        <div className={styles.flexTitle}>
          <Link href="/">HOME</Link>
          <GrFormNext />
          <p>
            <Link href="/gallery">GALLERY</Link>
          </p>{" "}
          <GrFormNext /> <p>COLOR NFT</p>
        </div>
        <h2 className={styles.subHeader}>TRADE THE</h2>
        <div style={{ display: "flex" }}>
          <h1 className={styles.header}>
            COLOR NFT <span>COLLECTION</span>
          </h1>
          <h1
            className={styles.filterHeaderDeskptop}
            onClick={() => setFilterIsOpen(!filterIsOpen)}
          >
            Filter {!filterIsOpen ? <BsChevronDown /> : <IoMdClose />}
          </h1>
        </div>
        <div className={styles.sort_container}>
          <div
            className={`${styles.filterForm}`}
            style={{ background: search === "" && "#eee" }}
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveToDB();
              }}
            >
              <BsSearch />
              <input
                placeholder="Name, Hex, Category, No."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </form>
          </div>
          <h1
            className={styles.filterHeaderMobile}
            onClick={() => setFilterIsOpen(!filterIsOpen)}
          >
            Filter {!filterIsOpen ? <BsChevronDown /> : <IoMdClose />}
          </h1>
          <div
            className={styles.filterHeaderText}
            ref={containerContent}
            style={{
              paddingRight: `${
                (containerContent.current?.clientWidth / dividedBy) * 2
              }px`,
            }}
          >
            <h2 className={styles.contentFormSide}>
              <span style={{ color: "#0f6", fontFamily: "Plaid" }}>
                <BsFillTriangleFill size={23} /> 0.4{" "}
              </span>
              ETH Floor
            </h2>
            <h3 className={styles.contentFormSideSubMobileId}>
              <div className={styles.dotContent} />
              <span style={{ fontFamily: "Plaid" }}>$380K</span>
              &nbsp;Volume
            </h3>
            <h3 className={styles.contentFormSideSub}>
              <div className={styles.dotContent} />
              <span style={{ fontFamily: "Plaid" }}>
                {allReceivedData && allReceivedData.length}
              </span>
              &nbsp;Colors
            </h3>
            <h3 className={styles.contentFormSideSubMobileId}>
              <div className={styles.dotContent} />
              <span style={{ fontFamily: "Plaid" }}>{COLLECTORS}</span>
              &nbsp;Collectors
            </h3>
          </div>
        </div>
        {/*  */}

        {/*  */}
        <Views
          listView={listView}
          baseColor={baseColor}
          amountShowed={amountShowed}
          filtered={filtered}
          search={search}
          selectedBaseColors={selectedBaseColors}
          setSelectedBaseColors={setSelectedBaseColors}
          value={value}
          selectedOption={selectedOption}
          setToggled={setToggled}
          toggled={toggled}
          setFiltered={setFiltered}
          setSelectedOption={setSelectedOption}
        />

        {/*  */}
        {listView &&
          baseColor &&
          baseColor.length > amountShowed &&
          search === "" && (
            <div
              className={stylesThird.loadMoreContainer}
              style={{ marginBottom: "0", paddingBottom: "2rem" }}
            >
              <div
                onClick={() => {
                  setAmountShowed((amountShowed) => amountShowed + 2);
                }}
              >
                <BiExpand />
                Load More
              </div>
            </div>
          )}
        <SaleView />
        <ActivityView />
        {/* <h2 className={stylesThird.header}>
        Billions of possibilities, but only 10,000 Colors to see the light.
      </h2>
      <p className={stylesThird.desc}>
        Modern screens display tens of millions to billions of colors. From this
        pool the Color Museum website enables anyone to mint a Color NFT on the
        Ethereum Blockchain. The total number of possible Color NFTs are
        algorithmically limited to 10,000—making a Color NFT 1600X rarer than a
        Bitcoin.
      </p>
      <div className={stylesThird.flex}>
        <div>
          <h3 className={stylesThird.timesHeader}>1600X</h3>
          <p className={stylesThird.descTimes}>rarer than Bitcoin.</p>
        </div>
        <div>
          <h3 className={stylesThird.timesHeader}>400X</h3>
          <p className={stylesThird.descTimes}>rarer than ether.</p>
        </div>
      </div> */}
      </section>
    </>
  );
};

export default Gallery;
