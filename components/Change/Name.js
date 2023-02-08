import { useEffect, useState } from "react";
import stylesChoose from "../../styles/modules/choose/choose.module.css";
import styles from "../../styles/modules/name/name.module.css";
import { nameJson, colorsJson } from "../../utils/pantone-colors.json";
import coatedNames from "pantoner/json/pantone-coated.json";
import colorOfTheYear from "pantoner/json/pantone-color-of-the-year.json";
import metallicNames from "pantoner/json/pantone-metallic.json";
import pastelsNames from "pantoner/json/pantone-pastels-neons.json";
import skinNames from "pantoner/json/pantone-skin.json";
import uncoatedNames from "pantoner/json/pantone-uncoated.json";
import { useSelector, useDispatch } from "react-redux";
import { VioletedOff, WarningOff } from "../../store/actions/toggle";
import axios from "axios";
import { BACKEND } from "../../utils/constants";
import toast from "react-hot-toast";
import { IoCloseSharp } from "react-icons/io5";
import stylesNav from "../../styles/modules/nav.module.css";

const Name = ({
  receivedColorName,
  receivedColor,
  setDescription,
  setName,
  setReceivedColorName,
}) => {
  const [inputName, setInputName] = useState(receivedColorName);
  const [fontSizeAmount, setFontSizeAmount] = useState("32");
  const [fontSizeAmountMobile, setFontSizeAmountMobile] = useState("22");

  useEffect(() => {
    if (inputName.length < 20) {
      setFontSizeAmount("32");
      setFontSizeAmountMobile("22");
    } else {
      setFontSizeAmount("26");
      setFontSizeAmountMobile("17");
    }
  }, [inputName]);
  //
  //
  const { blackListedNAME } = useSelector((state) => state.minting);
  const dispatch = useDispatch();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const indexOfColors = nameJson.indexOf(
      inputName.trim().replace(/\s+/g, " ").replaceAll(" ", "-").toLowerCase()
    );
    const filteredCoated = coatedNames.filter((item) => {
      return (
        item.pantone.toLowerCase() ===
        inputName
          .trim()
          .replace(/\s+/g, " ")
          .replaceAll(" ", "-")
          .toLowerCase() &&
        item.hex.toLowerCase() === receivedColor.toLowerCase()
      );
    });
    const filteredYear = colorOfTheYear.filter((item) => {
      return (
        item.pantone.toLowerCase() ===
        inputName
          .trim()
          .replace(/\s+/g, " ")
          .replaceAll(" ", "-")
          .toLowerCase() &&
        item.hex.toLowerCase() === receivedColor.toLowerCase()
      );
    });
    const filteredMetallic = metallicNames.filter((item) => {
      return (
        item.pantone.toLowerCase() ===
        inputName
          .trim()
          .replace(/\s+/g, " ")
          .replaceAll(" ", "-")
          .toLowerCase() &&
        item.hex.toLowerCase() === receivedColor.toLowerCase()
      );
    });
    const filteredPastels = pastelsNames.filter((item) => {
      return (
        item.pantone.toLowerCase() ===
        inputName
          .trim()
          .replace(/\s+/g, " ")
          .replaceAll(" ", "-")
          .toLowerCase() &&
        item.hex.toLowerCase() === receivedColor.toLowerCase()
      );
    });
    const filteredSkin = skinNames.filter((item) => {
      return (
        item.pantone.toLowerCase() ===
        inputName
          .trim()
          .replace(/\s+/g, " ")
          .replaceAll(" ", "-")
          .toLowerCase() &&
        item.hex.toLowerCase() === receivedColor.toLowerCase()
      );
    });
    const filteredUncoated = uncoatedNames.filter((item) => {
      return (
        item.pantone.toLowerCase() ===
        inputName
          .trim()
          .replace(/\s+/g, " ")
          .replaceAll(" ", "-")
          .toLowerCase() &&
        item.hex.toLowerCase() === receivedColor.toLowerCase()
      );
    });
    if (!inputName) {
      toast((t) => (
        <div className={stylesNav.toastComman}>
          You haven't set a name to your color.
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
      if (receivedColorName === inputName) {
        dispatch(VioletedOff());
        dispatch(WarningOff());
        setReceivedColorName(inputName);
        setDescription(true);
        setName(false);
        e.preventDefault();
      } else if (blackListedNAME.includes(inputName.trim().toLowerCase())) {
        e.preventDefault();
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
        nameJson.includes(
          inputName
            .trim()
            .replace(/\s+/g, " ")
            .replaceAll(" ", "-")
            .toLowerCase()
        ) &&
        colorsJson[indexOfColors].toLowerCase() === inputName.toLowerCase()
      ) {
        e.preventDefault();
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
        filteredCoated.length > 0 ||
        filteredYear.length > 0 ||
        filteredMetallic.length > 0 ||
        filteredPastels.length > 0 ||
        filteredSkin.length > 0 ||
        filteredUncoated.length > 0
      ) {
        e.preventDefault();
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
      } else {
        e.preventDefault();
        try {
          const result = await axios.get(
            `${BACKEND}/api/v1/image/name-check/${inputName.trim()}`
          );
          if (result.data.isNameUsed) {
            toast((t) => (
              <div className={stylesNav.toastComman}>
                Sorry, this name is already in use by another color.
                <IoCloseSharp
                  size={25}
                  onClick={() => {
                    toast.dismiss(t.id);
                  }}
                />
              </div>
            ));
          } else {
            const profanity_result = await axios.get(
              `${BACKEND}/api/v1/image/clean-check/${inputName.trim()}`
            );
            if (profanity_result.data.isClean) {
              dispatch(VioletedOff());
              dispatch(WarningOff());
              setReceivedColorName(inputName);
              setDescription(true);
              setName(false);
              e.preventDefault();
            } else {
              toast((t) => (
                <div className={stylesNav.toastComman}>
                  Sorry, profanity is not tolerated. Be more creative.
                  <IoCloseSharp
                    size={25}
                    onClick={() => {
                      toast.dismiss(t.id);
                    }}
                  />
                </div>
              ));
            }
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
  };
  //
  //
  useEffect(() => {
    setInputName(receivedColorName);
    dispatch(VioletedOff());
    dispatch(WarningOff());
  }, [receivedColorName]);
  return (
    <>
      <article className={styles.text_container}>
        <h1 className={stylesChoose.header}>Name your color</h1>
        <p className={stylesChoose.description}>
          Give your color a name that will echo through eternity.
        </p>
        <div
          className={styles.mobile_picker}
          style={{
            backgroundColor: `${receivedColor}`,
          }}
        >
          <div className={styles.hexidecimal_mobile}>
            <p style={{ fontSize: `${fontSizeAmountMobile}px` }}>{inputName}</p>
            <p style={{ fontSize: `${fontSizeAmountMobile}px`, textAlign: 'right' }}>
              {receivedColor}
            </p>
          </div>
        </div>
        <form onSubmit={(e) => handleSubmit(e)}>
          <input
            className={styles.type_input}
            value={inputName}
            onChange={(e) => {
              setInputName(e.target.value);
              dispatch(WarningOff());
            }}
            placeholder="Type it here"
            type="text"
            maxLength="30"
          ></input>
          <div className={styles.flex}>
            <button className={styles.button} type="submit">
              Use this name
            </button>
            <p className={styles.maximum}>30 character maximum</p>
          </div>
        </form>
      </article>
      <div
        className={stylesChoose.color}
        style={{ backgroundColor: `${receivedColor}` }}
      >
        <div className={stylesChoose.hexidecimal}>
          <p style={{ fontSize: `${fontSizeAmount}px` }}>{inputName}</p>
          <p style={{ fontSize: `${fontSizeAmount}px` }}>{receivedColor}</p>
        </div>
      </div>
      <div className={stylesChoose.lineSide} />
    </>
  );
};

export default Name;
