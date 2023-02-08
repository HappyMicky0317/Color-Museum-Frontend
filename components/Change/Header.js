import React, { useEffect, useState } from "react";
import styles from "../../styles/modules/header/header.module.css";

const Header = ({
  name,
  description,
  sign,
  setName,
  setDescription,
  setSign,
}) => {
  const [width, setWidth] = useState();
  useEffect(() => {
    setWidth(window.innerWidth);
  }, []);
  useEffect(() => {
    const handleResize = () => {
      let widthDimension = window.innerWidth;
      setWidth(widthDimension);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  //
  //
  useEffect(() => {
    if (name) {
      setNamePosition(true);
      setDescribePosition(false);
      setMintPosition(false);
    }
    if (description) {
      setNamePosition(false);
      setDescribePosition(true);
      setMintPosition(false);
    }
    if (sign) {
      setNamePosition(false);
      setDescribePosition(false);
      setMintPosition(true);
    }
  }, [name, description, sign]);
  const [namePosition, setNamePosition] = useState(false);
  const [describePosition, setDescribePosition] = useState(false);
  const [mintPosition, setMintPosition] = useState(false);
  const [position, setPosition] = useState("3%");
  //
  //
  useEffect(() => {
    if (width > 1000 && width < 2499) {
      if (namePosition) {
        setPosition("3%");
      }
      if (describePosition) {
        setPosition("50%");
      }
      if (mintPosition) {
        setPosition("97%");
      }
    } else if (width > 2499 && width < 3249) {
      if (namePosition) {
        setPosition("3%");
      }
      if (describePosition) {
        setPosition("50%");
      }
      if (mintPosition) {
        setPosition("97%");
      }
    } else if (width < 1000) {
      if (namePosition) {
        setPosition("6%");
      }
      if (describePosition) {
        setPosition("50%");
      }
      if (mintPosition) {
        setPosition("93%");
      }
    } else if (width > 3249) {
      if (namePosition) {
        setPosition("5%");
      }
      if (describePosition) {
        setPosition("50%");
      }
      if (mintPosition) {
        setPosition("97.5%");
      }
    }
  }, [namePosition, describePosition, mintPosition]);
  //
  //
  //
  const handleMouseEnter = (e) => {
    if (width > 1000 && width < 2499) {
      if (e.target.innerHTML === "Name") {
        setPosition("3%");
      }
      if (e.target.innerHTML === "Describe") {
        setPosition("50%");
      }
      if (e.target.innerHTML === "Sign") {
        setPosition("96%");
      }
    } else if (width > 2499 && width < 3249) {
      if (e.target.innerHTML === "Name") {
        setPosition("3%");
      }
      if (e.target.innerHTML === "Describe") {
        setPosition("50%");
      }
      if (e.target.innerHTML === "Sign") {
        setPosition("97.5%");
      }
    } else if (width > 3249) {
      if (namePosition) {
        setPosition("3%");
      }
      if (describePosition) {
        setPosition("50%");
      }
      if (mintPosition) {
        setPosition("97.5%");
      }
    }
  };
  //
  //
  const handleMouseLeave = () => {
    if (width > 1000 && width < 2499) {
      if (namePosition) {
        setPosition("3%");
      }
      if (describePosition) {
        setPosition("50%");
      }
      if (mintPosition) {
        setPosition("96%");
      }
    } else if (width > 2499 && width < 3249) {
      if (namePosition) {
        setPosition("3%");
      }
      if (describePosition) {
        setPosition("50%");
      }
      if (mintPosition) {
        setPosition("96.5%");
      }
    } else if (width > 3249) {
      if (namePosition) {
        setPosition("4.5%");
      }
      if (describePosition) {
        setPosition("50%");
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
          <button
            onClick={() => {
              setName(true);
              setDescription(false);
              setSign(false);
            }}
            className={styles.link}
            style={{ fontWeight: name && "bolder" }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            Name
          </button>
          <button
            onClick={() => {
              setName(false);
              setDescription(true);
              setSign(false);
            }}
            className={styles.link}
            style={{ fontWeight: description && "bolder" }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            Describe
          </button>
          <button
            onClick={() => {
              setName(false);
              setDescription(false);
              setSign(true);
            }}
            className={styles.link}
            style={{ fontWeight: sign && "bolder" }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            Sign
          </button>
        </div>
      </header>
      <div className={styles.line} />
    </>
  );
};

export default Header;
