import React, { useEffect, useRef, useState } from "react";
import styles from "../../styles/modules/gallery/sort.module.css";
import stylesThird from "../../styles/modules/gallery/loadmore.module.css";
import { VscListSelection } from "react-icons/vsc";
import { GoChevronDown } from "react-icons/go";
import { useClickAway } from "react-use";
import { BsGrid } from "react-icons/bs";
import { AiFillPlusCircle } from "react-icons/ai";
import { BiExpand } from "react-icons/bi";
import Link from "next/link";
import Views from "../TheBlockStaging/Views";
import Image from "next/image";

const TheBlockStaging = ({ data }) => {
  const [open, setOpen] = useState(false);
  const [dataReceived, setData] = useState(data.documents);
  const [baseColor, setBaseColor] = useState();
  const [isLoadingAmount, setIsLoadingAmount] = useState(false);
  // const [isLoading, setIsLoading] = useState(false);
  const ref = useRef(null);
  useClickAway(ref, () => {
    setOpen(false);
  });

  const [selectedColor, setSelectedColor] = useState({
    color: "",
    name: "All",
  });
  const [amountShowed, setAmountShowed] = useState(2);
  const [listView, setListView] = useState();
  useEffect(() => {
    let theme = "true";
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
      }, 2000);
    }
    return () => {};
  }, [isLoadingAmount]);
  useEffect(() => {
    if (dataReceived) {
      let newData = [];
      // eslint-disable-next-line
      dataReceived.map((item) => {
        newData.push(item.base_color_name);
      });
      var uniq = [...new Set(newData)];
      setBaseColor(uniq);
    }
  }, [dataReceived]);
  //
  //
  //

  return (
    <section className={styles.wrapper}>
      <h1 className={styles.header}>Gallery</h1>
      <div className={styles.sort_container}>
        <div
          className={styles.sort_container_item}
          style={{
            borderBottom: listView ? "3px solid #fff" : null,
            fontWeight: "bolder",
          }}
          onClick={() => handleViewList()}
        >
          <VscListSelection />
          <h3 style={{ fontWeight: listView ? "bold" : "400" }}>List</h3>
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
          <h3 style={{ fontWeight: !listView ? "bold" : "400" }}>Grid</h3>
        </div>
        <div className={styles.sort_container_select_container} ref={ref}>
          <div
            className={`${styles.sort_container_select_wrapper} ${
              open ? styles.is_open : ""
            }`}
            onClick={() => setOpen(!open)}
            style={{ textTransform: "capitalize" }}
          >
            <div className={styles.custom_scroll}>
              <div className={`${styles.sort_container_select_wrapper_select}`}>
                {selectedColor.name === "All" ? (
                  <span>
                    <div className={styles.color_wheel}>
                      <Image
                        src={"/images/color-wheel.png"}
                        alt="color wheel"
                        layout="fill"
                        objectFit="contain"
                      />
                    </div>
                  </span>
                ) : (
                  <span
                    className={styles.circle}
                    style={{
                      background: selectedColor.color,
                      border:
                        selectedColor.color === "black" && "1px solid #fff",
                    }}
                  ></span>
                )}
                {selectedColor.name}
                <GoChevronDown />
              </div>
              {open && (
                <div className={styles.dropdownGallery} open={open}>
                  {selectedColor.name !== "All" && (
                    <div
                      className={styles.flex_gallery}
                      onClick={() => {
                        setSelectedColor({
                          color: "",
                          name: "All",
                        });
                        setOpen(false);
                        setAmountShowed(2);
                      }}
                    >
                      <span>
                        <div className={styles.color_wheel}>
                          <Image
                            src={"/images/color-wheel.png"}
                            alt="color wheel"
                            layout="fill"
                            objectFit="contain"
                          />
                        </div>
                      </span>
                      All
                    </div>
                  )}
                  {baseColor &&
                    baseColor.map((item, index) => {
                      if (selectedColor.name === item) {
                        return null;
                      }
                      return (
                        <div
                          className={styles.flex_gallery}
                          key={index}
                          onClick={() => {
                            setSelectedColor({ color: item, name: item });
                            setOpen(false);
                            setAmountShowed(2);
                          }}
                        >
                          <span
                            className={styles.circle}
                            style={{
                              background: item,
                              border: item === "black" && "1px solid #fff",
                            }}
                          ></span>{" "}
                          {item}
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/*  */}
      <Views
        listView={listView}
        baseColor={baseColor}
        selectedColor={selectedColor}
        dataReceived={dataReceived}
        amountShowed={amountShowed}
      />
      {/*  */}
      <div className={stylesThird.loadMoreContainer}>
        {listView && baseColor && baseColor.length > amountShowed && (
          <div
            onClick={() => {
              setIsLoadingAmount(true);
            }}
          >
            <BiExpand />
            Load More
          </div>
        )}
        <Link href="/choose" passHref>
          <div>
            <AiFillPlusCircle />
            <strong>Mint</strong>&nbsp;a color
          </div>
        </Link>
      </div>
      <h2 className={stylesThird.header}>
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
      </div>
    </section>
  );
};

export default TheBlockStaging;
