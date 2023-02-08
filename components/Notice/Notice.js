import { Slide } from "@chakra-ui/transition";
import { useState } from "react";
import styles from "../../styles/modules/notice/notice.module.css";

const Notice = () => {
  const [lastName, setLastName] = useState("");
  const [uniqueId, setUniqueId] = useState("");
  const [digits, setDigits] = useState({
    digit1: "",
    digit2: "",
    digit3: "",
    digit4: "",
  });
  const handleChange = (e) => {
    const { value, name, maxLength } = e.target;
    const [fieldName, fieldIndex] = name.split("-");
    let fieldIntIndex = parseInt(fieldIndex, 10);
    if (e.keyCode && e.keyCode === 37) {
      const prevfield = document.querySelector(
        `input[name=field-${fieldIntIndex - 1}]`
      );
      if (prevfield && prevfield.name === "field-3" && lastName !== "") {
        setLastName("");
      } else {
        if (prevfield !== null) {
          prevfield.focus();
        }
      }
    } else if (value.length >= maxLength) {
      // It should not be last input field
      if (fieldIntIndex < 4) {
        // Get the next input field using it's name
        const nextfield = document.querySelector(
          `input[name=field-${fieldIntIndex + 1}]`
        );
        // If found, focus the next field
        if (nextfield !== null) {
          nextfield.focus();
        }
      } else {
        setLastName(value.slice(1, 2) ? value.slice(1, 2) : value);
      }
    }
  };

  const verifyUniqueId = async (e, unique_id, confirmationPin) => {
    if (e) e.preventDefault();
    try {
      const confirmation_pin =
        digits.digit1 + digits.digit2 + digits.digit3 + digits.digit4;
      const user = await app.logIn(credentials);
      const response = await user.functions.verify_uniqueId({
        unique_id: unique_id ? unique_id : uniqueId,
        confirmation_pin: confirmationPin ? confirmationPin : confirmation_pin,
      });
      if (response.success) {
        // Success logic -> remove Component blocking connect wallet buttons
        setMessageObj({
          headin: "Success",
          text: "Link has been verified",
        });
        setShowSuccess(true);
        setAllowMintAccess(true);
        setPriceToMint(response.mint_price.toString());
        localStorage.setItem(
          "credentials",
          JSON.stringify({
            unique_id: unique_id ? unique_id : uniqueId,
            confirmation_pin: confirmationPin
              ? confirmationPin
              : confirmation_pin,
          })
        );
        if (response.mint_price >= 0.25)
          localStorage.setItem(
            "EspecificAmount",
            response.mint_price.toString()
          );
        setTimeout(() => {
          setShowSuccess(false);
        }, 2000);

        // Set correct minting price for user using leaderboard link
      } else {
        // Error logic, add error messages according to the type of error received.
        setDigits({
          digit1: "",
          digit2: "",
          digit3: "",
          digit4: "",
        });

        if (
          response.error === "unique_id is missing" ||
          response.error === "unique_id not found"
        ) {
          setMessageObj({
            headin: "Error",
            text: "Invalid link",
          });
          setShowError(true);
          setTimeout(() => {
            setShowError(false);
          }, 2000);
        } else if (response.error === "confirmation_pin is missing") {
          setMessageObj({
            headin: "Error",
            text: "Enter a confirmation pin",
          });
          setShowError(true);
          setTimeout(() => {
            setShowError(false);
          }, 2000);
        } else if (response.error === "invite has expired") {
          setMessageObj({
            headin: "Error",
            text: "Mint link expired",
          });
          setShowError(true);
          setTimeout(() => {
            setShowError(false);
          }, 2000);
        } else if (response.success === false) {
          setMessageObj({
            headin: "Error",
            text: "Unauthorized: recheck confirmation pin",
          });
          setShowError(true);
          setTimeout(() => {
            setShowError(false);
          }, 2000);
        } else {
          setShowError(true);
          setTimeout(() => {
            setShowError(false);
          }, 2000);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (query.get("uniqueId") !== undefined) setUniqueId(query.get("uniqueId"));

    if (localStorage.getItem("credentials")) {
      const credential = JSON.parse(localStorage.getItem("credentials"));
      if (credential.unique_id && credential.confirmation_pin) {
        verifyUniqueId(null, credential.unique_id, credential.confirmation_pin);
      }
    }
  }, []);
  return (
    <>
      <Slide
        direction="bottom"
        in={isNoticeOpen}
        unmountOnExit
        className="mint-popup"
        style={{ zIndex: 1000, minHeight: "50vh" }}
      >
        <div className={styles.container}>
          <div
            className={`${styles.expand_wrapper} ${styles.expand_wrapper_larger} ${styles.custom_notice}`}
          >
            <div className={styles.discountContainer}>
              <h2>Guarantee Mint</h2>
              <h1>Skip the line, skip the wait.</h1>
              <p>Mint at the priority price and gurantee your colors.</p>
              <div className={styles.flex_discount}>
                <button
                  className={styles.colorChoose}
                  onClick={() => setAllowMintAccess(true)}
                >
                  Mint
                </button>
              </div>
            </div>
            {uniqueId !== null ? (
              <div className={styles.waitListContainer}>
                <h1>On the waitlist?</h1>
                <form className={styles.unlock_container}>
                  <p>Enter PIN to unlock waitlist price.</p>
                  <div className={styles.lock_container}>
                    <div className={styles.inputs_container}>
                      <input
                        type="number"
                        name="field-1"
                        maxLength="1"
                        value={digits.digit1}
                        onChange={(e) =>
                          setDigits({
                            ...digits,
                            digit1: e.target.value.substring(0, 1),
                          })
                        }
                        onKeyUp={(e) => handleChange(e)}
                      />
                      <input
                        type="number"
                        name="field-2"
                        maxLength="1"
                        value={digits.digit2}
                        onChange={(e) =>
                          setDigits({
                            ...digits,
                            digit2: e.target.value.substring(0, 1),
                          })
                        }
                        onKeyUp={(e) => handleChange(e)}
                      />
                      <input
                        type="number"
                        name="field-3"
                        maxLength="1"
                        value={digits.digit3}
                        onChange={(e) =>
                          setDigits({
                            ...digits,
                            digit3: e.target.value.substring(0, 1),
                          })
                        }
                        onKeyUp={(e) => handleChange(e)}
                      />
                      <input
                        type="number"
                        name="field-4"
                        maxLength="1"
                        value={digits.digit4}
                        onChange={(e) =>
                          setDigits({
                            ...digits,
                            digit4: e.target.value.substring(0, 1),
                          })
                        }
                        onKeyUp={(e) => handleChange(e)}
                        // value={lastName}
                      />
                    </div>
                    <button
                      className={styles.colorChoose}
                      onClick={verifyUniqueId}
                    >
                      Unlock
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className={styles.secondTextSection}>
                <div>
                  <h2>ON THE WAITLIST?</h2>
                  <p>
                    Invitations to mint at the waitlist price of 0.25 ETH are
                    being emailed based on Leaderboard position. There is a
                    delay of 30 seconds between each recipient receiving their
                    email.
                  </p>
                  <a
                    className={styles.colorChoose}
                    target="_blank"
                    href="https://bulletin.color.museum/2022/02/the-color-nft-minting-experience-steps-to-follow/"
                  >
                    Learn More
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </Slide>
    </>
  );
};

export default Notice;
