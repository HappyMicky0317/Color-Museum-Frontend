import React, { useEffect, useState } from "react";
import Link from "next/link";
import styles from "../../styles/modules/header/header.module.css";

const Header = ({ choose, name, describe, mint }) => {
  //Check Width For Animation
  const [width, setWidth] = useState();
  useEffect(() => {
    let widthDimension = window.innerWidth;
    setWidth(widthDimension);
  }, []);
  useEffect(() => {
    const handleResize = () => {
      let widthDimension = window.innerWidth;
      setWidth(widthDimension);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
    // eslint-disable-next-line
  }, []);
  //
  //
  let chooseValue;
  if (choose) {
    chooseValue = "true";
  } else {
    chooseValue = "false";
  }

  const [choosePosition, setChoosePosition] = useState(true);
  const [namePosition, setNamePosition] = useState(false);
  const [describePosition, setDescribePosition] = useState(false);
  const [mintPosition, setMintPosition] = useState(false);
  const [position, setPosition] = useState("6%");
  //
  //
  //
  useEffect(() => {
    if (choose) {
      setChoosePosition(true);
      setNamePosition(false);
      setDescribePosition(false);
      setMintPosition(false);
    }
    if (name) {
      setChoosePosition(false);
      setNamePosition(true);
      setDescribePosition(false);
      setMintPosition(false);
    }
    if (describe) {
      setChoosePosition(false);
      setNamePosition(false);
      setDescribePosition(true);
      setMintPosition(false);
    }
    if (mint) {
      setChoosePosition(false);
      setNamePosition(false);
      setDescribePosition(false);
      setMintPosition(true);
    }
  }, [choose, name, describe, mint]);
  //
  //
  //
  useEffect(() => {
    if (width > 1000 && width < 2499) {
      if (choosePosition) {
        setPosition("6%");
      }
      if (namePosition) {
        setPosition("36%");
      }
      if (describePosition) {
        setPosition("66%");
      }
      if (mintPosition) {
        setPosition("94.5%");
      }
    } else if (width > 2499 && width < 3249) {
      if (choosePosition) {
        setPosition("4%");
      }
      if (namePosition) {
        setPosition("34.5%");
      }
      if (describePosition) {
        setPosition("66%");
      }
      if (mintPosition) {
        setPosition("96.5%");
      }
    } else if (width < 1000) {
      if (choosePosition) {
        setPosition("9%");
      }
      if (namePosition) {
        setPosition("36%");
      }
      if (describePosition) {
        setPosition("64%");
      }
      if (mintPosition) {
        setPosition("91%");
      }
    } else if (width > 3249) {
      if (choosePosition) {
        setPosition("2.5%");
      }
      if (namePosition) {
        setPosition("34%");
      }
      if (describePosition) {
        setPosition("66%");
      }
      if (mintPosition) {
        setPosition("97.5%");
      }
    }
    // eslint-disable-next-line
  }, [choosePosition, namePosition, describePosition, mintPosition]);
  //
  //
  //
  const handleMouseEnter = (e) => {
    if (width > 1000 && width < 2499) {
      if (e.target.innerHTML === "Choose") {
        setPosition("6%");
      }
      if (e.target.innerHTML === "Name") {
        setPosition("36%");
      }
      if (e.target.innerHTML === "Describe") {
        setPosition("66%");
      }
      if (e.target.innerHTML === "Mint") {
        setPosition("94.5%");
      }
    } else if (width > 2499 && width < 3249) {
      if (e.target.innerHTML === "Choose") {
        setPosition("4%");
      }
      if (e.target.innerHTML === "Name") {
        setPosition("34.5%");
      }
      if (e.target.innerHTML === "Describe") {
        setPosition("66%");
      }
      if (e.target.innerHTML === "Mint") {
        setPosition("96.5%");
      }
    } else if (width > 3249) {
      if (choosePosition) {
        setPosition("2.5%");
      }
      if (namePosition) {
        setPosition("34%");
      }
      if (describePosition) {
        setPosition("66%");
      }
      if (mintPosition) {
        setPosition("97.5%");
      }
    }
  };
  //
  //
  //
  const handleMouseLeave = () => {
    if (width > 1000 && width < 2499) {
      if (choosePosition) {
        setPosition("6%");
      }
      if (namePosition) {
        setPosition("36%");
      }
      if (describePosition) {
        setPosition("66%");
      }
      if (mintPosition) {
        setPosition("94.5%");
      }
    } else if (width > 2499 && width < 3249) {
      if (choosePosition) {
        setPosition("4%");
      }
      if (namePosition) {
        setPosition("34.5%");
      }
      if (describePosition) {
        setPosition("66%");
      }
      if (mintPosition) {
        setPosition("96.5%");
      }
    } else if (width > 3249) {
      if (choosePosition) {
        setPosition("2.5%");
      }
      if (namePosition) {
        setPosition("34%");
      }
      if (describePosition) {
        setPosition("66%");
      }
      if (mintPosition) {
        setPosition("97.5%");
      }
    }
  };
  //
  //
  return (
    <>
      <header className={styles.headerContainer}>
        <div className={styles.linksContainer}>
          <img
            src={"/images/triangle.png"}
            alt="triangle"
            className={styles.circle}
            style={{ left: `${position}` }}
          />
          <Link href="/choose" passHref>
            <a
              className={styles.link}
              style={{ fontWeight: choose && "bolder" }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              Choose
            </a>
          </Link>
          <Link href="/name" passHref>
            <a
              className={styles.link}
              style={{ fontWeight: name && "bolder" }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              Name
            </a>
          </Link>
          <Link href="/describe" passHref>
            <a
              className={styles.link}
              style={{ fontWeight: describe && "bolder" }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              Describe
            </a>
          </Link>
          <Link href="/mint" passHref>
            <a
              className={styles.link}
              style={{ fontWeight: mint && "bolder" }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              Mint
            </a>
          </Link>
        </div>
      </header>
      <div className={styles.line} />
    </>
  );
};

export default Header;
