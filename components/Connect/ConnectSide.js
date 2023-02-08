import { useSelector } from "react-redux";
import styles from "../../styles/modules/connect/connect-side.module.css";
import Connect from "../Mint/Connect";

const ConnectSide = ({ hideModal }) => {
  const { connectedAddress } = useSelector((state) => state.minting);
  return (
    <>
      <section className={styles.Wrapper}>
        <div className={styles.InnerWrapper}>
          {connectedAddress === "" ? (
            <section className={styles.container}>
              <div className={styles.wallet_part}>
                <Connect />
              </div>
              <h3
                className={styles.subHeader}
                style={{ paddingTop: "3rem", textAlign: "center" }}
              >
                On mobile?
              </h3>
              <p
                className={styles.desc}
                style={{ textAlign: "center", margin: "auto" }}
              >
                Visit <b>www.color.museum</b> or <b>www.colormuseum.com</b>{" "}
                using the built-in web browsers of Metamask or Coinbase Wallet.
              </p>
            </section>
          ) : (
            hideModal()
          )}
        </div>
      </section>
    </>
  );
};

export default ConnectSide;
