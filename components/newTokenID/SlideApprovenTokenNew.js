import styles from "../../styles/modules/newTokenID/createAndLoginAccount.module.css";
import { HiOutlineArrowNarrowLeft } from "react-icons/hi";
import { AiOutlineClose } from "react-icons/ai";
import SlidingPane from "react-sliding-pane";
import "react-sliding-pane/dist/react-sliding-pane.css";
import { tokenABI } from "../../utils/ABIs/TokenABI";
import {
  ERC721OrderFeatureAddress,
  TokenAddressList,
  SMARTCONTRACTADDR,
} from "../../utils/constants";
import { useSelector } from "react-redux";
import { NFTabi } from "../../utils/ABIs/NFTabi";
import { isMobile } from "react-device-detect";

const SlideApprovenTokenNew = ({
  approvenTokenNew,
  setApprovenTokenNew,
  selectedCurrency,
  selectedCurrencyInput,
  web3,
}) => {
  const { connectedAddress } = useSelector((state) => state.minting);
  const { web3 } = useSelector((state) => state.minting);

  const approveERC20Token = async () => {
    const tokenInstance = new web3.eth.Contract(tokenABI, TokenAddressList[0]);

    var approvedAmount = await tokenInstance.methods
      .allowance(connectedAddress, ERC721OrderFeatureAddress)
      .call();
    let approve_amount =
      "115792089237316195423570985008687907853269984665640564039457584007913129639935"; //(2^256 - 1 )
    if (parseInt(approvedAmount) < Number(selectedCurrencyInput)) {
      console.log("You need to approve");
      try {
        await tokenInstance.methods
          .approve(ERC721OrderFeatureAddress, approve_amount)
          .send({
            from: connectedAddress,
          })
          .on("sending", function () {
            console.log("sending");
          })
          .on("sent", function () {
            console.log("sent");
          })
          .on("transactionHash", function (transactionHash) {
            console.log("transactionHash", transactionHash);
          })
          .on("receipt", function (receipt) {
            console.log("receipt", receipt);
          })
          .on("confirmation", function (confirmationNumber, receipt) {
            if (confirmationNumber === 1 && receipt.status === true) {
              console.log("confirmed!", confirmationNumber, receipt);
            }
          })
          .on("error", function (error) {
            console.log("error", error);
          });
        console.log("Token is approved!");
        return true;
      } catch (e) {
        console.log("ERROR!", e);
        return false;
      }
    } else {
      console.log("Token is already approved!");
    }
  };

  const approveERC721Token = async () => {
    const NFTInstance = new web3.eth.Contract(NFTabi, SMARTCONTRACTADDR);

    var approveAddress = await NFTInstance.methods.getApproved(number).call();
    console.log("Approved address:", approveAddress);
    if (approveAddress != ERC721OrderFeatureAddress) {
      console.log("You need to approve");
      try {
        await NFTInstance.methods
          .approve(ERC721OrderFeatureAddress, number)
          .send({
            from: connectedAddress,
          });
        return true;
      } catch (e) {
        console.log("ERROR!", e);
        return false;
      }
    } else {
      console.log("NFT already approved!");
      return true;
    }
  };

  return (
    <SlidingPane
      closeIcon={<HiOutlineArrowNarrowLeft />}
      className={styles.newSlideContainer}
      overlayClassName="some-custom-overlay-class"
      isOpen={approvenTokenNew}
      title={
        <div className={styles.newPurchaseTitle}>
          <div style={{ display: "flex" }}>
            <span style={{ color: "#565656" }}>Bid&nbsp;&nbsp;</span>/ Approve
            Token
          </div>
          <AiOutlineClose
            onClick={() => {
              setApprovenTokenNew(false);
            }}
          />
        </div>
      }
       width={isMobile ? "100%" : "30%"}
      onRequestClose={() => {
        setApprovenTokenNew(false);
      }}
    >
      <div className={styles.content}>
        <div className={styles.contentTitle}>
          <h1 className={styles.newDesignHeader}>APPROVE TOKEN </h1>
          <span>TO BID</span>
        </div>
        <button
          className={styles.approvenTokenNewButton}
          onClick={() => approveERC20Token()}
        >
          APPROVE {selectedCurrency}
        </button>
      </div>
    </SlidingPane>
  );
};

export default SlideApprovenTokenNew;
