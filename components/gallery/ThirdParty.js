import React, { useEffect, useRef, useState } from "react";
import styles from "../../styles/modules/gallery/sort.module.css";
import stylesThird from "../../styles/modules/gallery/loadmore.module.css";
import { VscListSelection } from "react-icons/vsc";
import { BsGrid } from "react-icons/bs";
import { BiExpand } from "react-icons/bi";
import Link from "next/link";
import Views from "./ViewNfts";
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
        newData.push(item.collection.base_color_name);
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

  useEffect(() => {
    if (search !== "") {
      setAmountShowed(baseColor.length - 1);
    } else {
      setAmountShowed(2);
    }
  }, [search]);

  const options = ["Increasing", "Decreasing", "Random"];

  const [selectedOption, setSelectedOption] = useState("Increasing");

  const [toggled, setToggled] = useState(true);
  // const supaAPIUrl = "https://yrjjxjedmscqqzxoxgpk.supabase.co";
  // const supaCanon =
  //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlyamp4amVkbXNjcXF6eG94Z3BrIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTAzOTE0MzksImV4cCI6MTk2NTk2NzQzOX0.ooQ9TOcfYe_rbbVrD-L-uVrDaIaS70EGVPpWdlr3w7w";
  // const supabase = createClient(supaAPIUrl, supaCanon);

  // const saveToDB = async () => {
  //   const { data, error } = await supabase
  //     .from('colorNFTSearch')
  //     .insert([
  //       { query: search}
  //     ],
  //     { upsert: true });
  // }

  const dividedBy = isMobile ? 36 : 50;

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
          <GrFormNext /> <p>DOUR DARCELS NFT</p>
        </div>
        <h2 className={styles.subHeader}>TRADE THE</h2>
        <div style={{ display: "flex" }}>
          <h1 className={styles.header}>
            Dour DARCELS NFT <span>COLLECTION</span>
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
            <form onSubmit={e => {e.preventDefault(); }}>
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
              <span style={{ color: "#0f6", fontFamily: "Plaid" }}>0.4 </span>
              ETH Floor
            </h2>
            <h3 className={styles.contentFormSideSub}>
              <GoPrimitiveDot className={styles.dotContent} />
              <span style={{ fontFamily: "Plaid" }}>
                {allReceivedData && allReceivedData.length}
              </span>
              &nbsp;Colors
            </h3>
            <h3 className={styles.contentFormSideSubMobileId}>
              <GoPrimitiveDot className={styles.dotContent} />
              <span style={{ fontFamily: "Plaid" }}>{COLLECTORS}</span>
              &nbsp;Collectors
            </h3>
            <h3 className={styles.contentFormSideSubMobileId}>
              <GoPrimitiveDot className={styles.dotContent} />
              <span style={{ fontFamily: "Plaid" }}>$380K</span>
              &nbsp;Volume
            </h3>
          </div>
          <div
            style={{
              display: filtered ? "flex" : "none",
              paddingBottom: filtered ? "20px 0" : "0",
              overflowY: filtered ? "auto" : "hidden",
              width: filtered && "100%",
              margin: "10px 0 0",
            }}
            className={stylesFilter.filteredContainer}
          >
            <button
              className={stylesFilter.buttonFilter}
              onClick={() => {
                setSelectedBaseColors([]);
                setValueReceived({
                  min: minValue.toFixed(2),
                  max: maxValue.toFixed(2),
                });
                setFilterIsOpen(false);
                setFiltered(false);
              }}
            >
              clear all filters
            </button>
            {selectedBaseColors.length > 0 &&
              selectedBaseColors.map((item, index) => {
                return (
                  <button className={stylesFilter.buttonWhite} key={index}>
                    {item}
                    <IoMdClose
                      onClick={() => {
                        if (
                          selectedBaseColors.length === 1 &&
                          minValue.toFixed(2) === value.min &&
                          maxValue.toFixed(2) === value.max
                        ) {
                          setSelectedBaseColors([]);
                          setValueReceived({
                            min: minValue.toFixed(2),
                            max: maxValue.toFixed(2),
                          });
                          setFilterIsOpen(false);
                          setFiltered(false);
                        } else {
                          setSelectedBaseColors((color) =>
                            color.filter((i) => i !== item)
                          );
                        }
                      }}
                    />
                  </button>
                );
              })}
          </div>
        </div>
        {/*  */}
        <article className={stylesFilter.filterContainer}>
          <div
            style={{
              minHeight: filterIsOpen ? "450px" : "0",
              height: !filterIsOpen && "0",
              visibility: filterIsOpen ? "visible" : "hidden",
              display: filterIsOpen ? "block" : "none",
              opacity: filterIsOpen ? "1" : "0",
              transition: "300ms ease",
            }}
          >
            <div className={stylesFilter.filterDiv}>
              <div style={{ position: "relative" }}>
                <Select
                  defaultValue={selectedOption}
                  value={selectedOption}
                  onValueChange={setSelectedOption}
                >
                  <SelectTrigger3 aria-label={selectedOption}>
                    <SelectValue aria-label={selectedOption} />
                    <SelectIcon>
                      <ChevronDownIcon className={styles.icon} />
                    </SelectIcon>
                  </SelectTrigger3>
                  <SelectContent>
                    <SelectScrollUpButton>
                      <ChevronUpIcon />
                    </SelectScrollUpButton>
                    <SelectViewport>
                      <SelectGroup>
                        <SelectLabel>Sort By</SelectLabel>
                        {options.map((item) => {
                          return (
                            <SelectItem value={item}>
                              <SelectItemText>{item}</SelectItemText>
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
              </div>
              {!isMobile && (
                <>
                  <div
                    className={styles.sort_container_item}
                    style={{
                      borderBottom: listView ? "3px solid #fff" : null,
                      fontWeight: "bolder",
                    }}
                    onClick={() => handleViewList()}
                  >
                    <VscListSelection />
                    <h3
                      style={{
                        fontWeight: listView ? "bold" : "400",
                        marginLeft: ".5rem",
                      }}
                    >
                      List
                    </h3>
                  </div>
                  <div
                    className={styles.sort_container_item}
                    style={{
                      borderBottom: !listView ? "3px solid #fff" : null,
                      fontWeight: "bolder",
                    }}
                    onClick={() => handleViewGrid()}
                  >
                    <BsGrid />
                    <h3
                      style={{
                        fontWeight: !listView ? "bold" : "400",
                        marginLeft: ".5rem",
                      }}
                    >
                      Grid
                    </h3>
                  </div>
                </>
              )}
            </div>
            <div className={stylesFilter.filterLowerContainer}>
              <h1>Categories</h1>
              <div className={stylesFilter.wrapperCategories}>
                {baseColor &&
                  baseColor.map((item, index) => {
                    let amountOfColors = 0;
                    allReceivedData.map((i) => {
                      if (item === i.base_color_name) {
                        amountOfColors = amountOfColors += 1;
                      }
                    });
                    return (
                      <div
                        key={index}
                        className={stylesFilter.baseColor}
                        onClick={() => {
                          if (selectedBaseColors.includes(item)) {
                            setSelectedBaseColors((color) =>
                              color.filter((i) => i !== item)
                            );
                          } else {
                            setSelectedBaseColors((prevState) => [
                              ...prevState,
                              item,
                            ]);
                          }
                        }}
                      >
                        <div
                          className={stylesFilter.baseColorSquare}
                          style={{
                            background: item,
                            border: selectedBaseColors.includes(item)
                              ? "2px solid #fff"
                              : "3px solid #202020",
                            outline: selectedBaseColors.includes(item)
                              ? "2px solid #fff"
                              : "none",
                            opacity:
                              selectedBaseColors.length > 0 &&
                              !selectedBaseColors.includes(item)
                                ? "0.3"
                                : "1",
                          }}
                        />
                        <h1>{item}</h1>
                        <p>{amountOfColors} Colors</p>
                      </div>
                    );
                  })}
              </div>
            </div>
            <div
              className={stylesFilter.filterLowerContainer}
              style={{ borderBottom: "0" }}
            >
              <div className={stylesFilter.flexLowerContainer}>
                <div className={stylesFilter.rangeWidth}>
                </div>
                <button
                  className={stylesFilter.button}
                  onClick={() => {
                    setFiltered(true);
                    setFilterIsOpen(false);
                  }}
                >
                  apply&nbsp;
                  {selectedBaseColors.length > 0 && selectedBaseColors.length}
                </button>
              </div>
            </div>
          </div>
        </article>
        {/*  */}
        <Views
          listView={listView}
          baseColor={baseColor}
          amountShowed={amountShowed}
          filtered={filtered}
          search={search}
          selectedBaseColors={selectedBaseColors}
          value={value}
          selectedOption={selectedOption}
          setToggled={setToggled}
          toggled={toggled}
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
      </section>
    </>
  );
};

export default Gallery;
