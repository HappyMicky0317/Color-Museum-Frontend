import { IoIosArrowBack } from "react-icons/io";
import styles from "../../styles/modules/newTokenID/createAndLoginAccount.module.css";
import SlidingPane from "react-sliding-pane";
import "react-sliding-pane/dist/react-sliding-pane.css";
import { IoCloseSharp } from "react-icons/io5";
import { isMobile } from "react-device-detect";
import stylesNewTokenId from "../../styles/modules/newTokenID/newTokenID.module.css";

const infoStepWizard = ({
  data,
  setInfoStepWizard,
  infoStepWizard,
  transactionInfo,
}) => {
  if (transactionInfo) {
    return (
      <SlidingPane
        closeIcon={<IoIosArrowBack />}
        className={styles.newSlideContainer}
        isOpen={infoStepWizard}
        title={
          <div className={styles.newPurchaseTitle}>
            Transaction Info
            <IoCloseSharp
              size={30}
              onClick={() => {
                setInfoStepWizard(false);
              }}
            />
          </div>
        }
        width={isMobile ? "100%" : "30%"}
        onRequestClose={() => {
          setInfoStepWizard(false);
        }}
      >
        <div>
          <h1 className={styles.newDesignHeader}>{transactionInfo.title}</h1>
          <div className={styles.newDesignFlex}>
            <h3 className={styles.buyItNowMain}>Name</h3>
            <h3 className={styles.buyItNowMain}>{transactionInfo.name}</h3>
          </div>
          <div className={styles.newDesignFlex}>
            <h3 className={styles.buyItNowMain}>Owner</h3>
            <div className={styles.newDesignOwnerFlex}>
              <h3 className={styles.buyItNowMain}>{transactionInfo.id}</h3>
            </div>
          </div>
          <div className={styles.offerLine} />
          <div className={styles.newDesignFlex}>
            <h3 className={styles.buyNowHeader} style={{ margin: "0" }}>
              Price
            </h3>
            <h3 className={styles.buyNowHeader} style={{ margin: "0" }}>
              {transactionInfo.price}
            </h3>
          </div>
          <div className={styles.newDesignFlex}>
            <h3 className={styles.buyItNowMainSub}>Date</h3>
            <h3 className={styles.buyItNowMainSub}>{transactionInfo.date}</h3>
          </div>
          <br />
          <div>
            <a
              href={transactionInfo.tx}
              target="_blank"
              className={stylesNewTokenId.newWhiteButton}
            >
              HASH
            </a>
          </div>
        </div>
      </SlidingPane>
    );
  } else {
    return null;
  }
};

export default infoStepWizard;
