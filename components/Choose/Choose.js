import { useEffect, useState } from "react";
import stylesNav from "../../styles/modules/nav.module.css";
import styles from "../../styles/modules/choose/choose.module.css";
import { useSelector, useDispatch } from "react-redux";
import { ColorChange, WarningOff } from "../../store/actions/toggle";
import ColorPicker from "./ColorPicker";
import { useRouter } from "next/router";
import { IoCloseSharp } from "react-icons/io5";
import toast from "react-hot-toast";
const Web3Utils = require("web3-utils");

const { randomHexColor } = require("random-hex-color-generator");

const Choose = () => {
  const { choosenColorFinal, choosenNameFinal, blackListedHEX } = useSelector(
    (state) => state.minting
  );
  const { alreadyMintedColors } = useSelector((state) => state.warning);
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const handleClickChangeColor = (e) => {
    if (open) {
      if (e.target.type === "submit") {
        setOpen(false);
      } else {
        setOpen(true);
        dispatch(WarningOff());
      }
    } else {
      if (
        e.target.innerHTML === "Choose this color" ||
        e.target.innerHTML === "Name" ||
        e.target.innerHTML === "Describe" ||
        e.target.innerHTML === "Mint" ||
        e.target.innerHTML === "Open color picker" ||
        e.target.innerHTML === "Close color picker" ||
        e.target.className === "" ||
        e.target.localName === "svg" ||
        e.target.innerHTML === ""
      ) {
        return null;
      } else {
        const color = randomHexColor();
        dispatch(ColorChange(color));
      }
    }
  };
  const handleSpaceBarChangeColor = (e) => {
    if (e.keyCode === 32) {
      const color = randomHexColor();
      dispatch(ColorChange(color));
      dispatch(WarningOff());
    }
  };
  //
  //
  //
  const [fontSizeAmount, setFontSizeAmount] = useState("32");
  const [fontSizeAmountMobile, setFontSizeAmountMobile] = useState("22");
  useEffect(() => {
    if (choosenNameFinal.length < 20) {
      setFontSizeAmount("32");
      setFontSizeAmountMobile("22");
    } else {
      setFontSizeAmount("26");
      setFontSizeAmountMobile("17");
    }
  }, [choosenNameFinal]);
  //
  //
  const router = useRouter();
  const handleSubmit = (e) => {
    if (choosenColorFinal.length === 0) {
      toast((t) => (
        <div className={stylesNav.toastComman}>
          Please choose a color to continue to naming.
          <IoCloseSharp
            size={25}
            onClick={() => {
              toast.dismiss(t.id);
            }}
          />
        </div>
      ));
      e.preventDefault();
    } else {
      if (blackListedHEX.includes(choosenColorFinal.toLowerCase())) {
        toast((t) => (
          <div className={stylesNav.toastComman}>
            Using this metadata may violate intellectual property rights.
            <IoCloseSharp
              size={25}
              onClick={() => {
                toast.dismiss(t.id);
              }}
            />
          </div>
        ));
      } else if (
        alreadyMintedColors.includes(
          Web3Utils.hexToNumber(
            `0x${choosenColorFinal.slice(1, choosenColorFinal.length)}`
          )
        )
      ) {
        toast((t) => (
          <div className={stylesNav.toastComman}>
            Sorry, this color has already been minted.
            <IoCloseSharp
              size={25}
              onClick={() => {
                toast.dismiss(t.id);
              }}
            />
          </div>
        ));
      } else {
        router.push("/name");
        localStorage.setItem(
          "choosenColor",
          `color: ${choosenColorFinal.toUpperCase()}`
        );
      }
    }
  };
  return (
    <>
      <article
        onClick={handleClickChangeColor}
        onKeyDown={handleSpaceBarChangeColor}
        tabIndex="0"
        style={{ outline: "none" }}
      >
        <div className={styles.container}>
          <div className={styles.containerWrapper}>
            <h1 className={styles.header}>Choose a color</h1>
            <p className={styles.description}>
              Tap the screen or press your spacebar to generate a random color
              out of the 16.7 million possibilities of the sRGB color spectrum.
            </p>
            <div
              className={styles.mobilePicker}
              style={{
                backgroundColor: `${choosenColorFinal}`,
              }}
            >
              <div className={styles.hexidecimalMobile}>
                <p style={{ fontSize: `${fontSizeAmountMobile}px` }}>
                  {choosenNameFinal}
                </p>
                <p
                  style={{
                    fontSize: `${fontSizeAmountMobile}px`,
                    textAlign: "right",
                  }}
                >
                  {choosenColorFinal}
                </p>
              </div>
            </div>
            <button className={styles.colorChooseMobile} onClick={handleSubmit}>
              Choose this color
            </button>
            <p className={styles.description}>
              Or open the color picker to precisely pick the color you want.
            </p>
            <ColorPicker
              open={open}
              onTogglePicker={() => {
                setOpen(!open);
              }}
            />
          </div>
          <div className={styles.containerButton}>
            <button className={styles.colorChoose} onClick={handleSubmit}>
              Choose this color
            </button>
          </div>
          <div
            className={styles.color}
            style={{ backgroundColor: `${choosenColorFinal}` }}
          >
            <div className={styles.hexidecimal}>
              <p style={{ fontSize: `${fontSizeAmount}px` }}>
                {choosenNameFinal}
              </p>
              <p style={{ fontSize: `${fontSizeAmount}px` }}>
                {choosenColorFinal}
              </p>
            </div>
          </div>
        </div>
      </article>
      <div className={styles.lineSide} />
    </>
  );
};

export default Choose;
