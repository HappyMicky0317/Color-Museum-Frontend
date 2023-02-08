import axios from "axios";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import {
  ErrorOff,
  ErrorOn,
  MessageObj,
  SuccessOff,
  SuccessOn,
} from "../../store/actions/updateMint";
import styles from "../../styles/modules/mint/mint.module.css";
import { BACKEND } from "../../utils/constants";

const Update = ({ tokenId, receivedColorName, receivedColorNameDesc }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const updateNameAndDesc = async () => {
    try {
      const response = await axios.patch(
        `${BACKEND}/api/v1/image/change/${tokenId}`,
        {
          type: "both",
          name: receivedColorName,
          description: receivedColorNameDesc,
        }
      );
      if (response.data.success) {
        dispatch(
          MessageObj({
            heading: "Success",
            text: "Nft successfully updated",
          })
        );
        dispatch(SuccessOn());
        setTimeout(() => {
          dispatch(SuccessOff());
          router.push(`/gallery/${tokenId}`);
        }, 2500);
      } else {
        dispatch(
          MessageObj({
            heading: "Error",
            text: response.data.error ? response.data.error : "Nft not upated",
          })
        );
        dispatch(ErrorOn());

        setTimeout(() => {
          dispatch(ErrorOff());

          router.push(`/change/${tokenId}`);
        }, 2500);
      }
    } catch (error) {
      dispatch(
        MessageObj({
          heading: "Error",
          text: error.response.data.error
            ? error.response.data.error
            : "Nft not upated",
        })
      );
      dispatch(ErrorOn());

      setTimeout(() => {
        dispatch(ErrorOff());
        window.location.reload();
      }, 2500);
    }
  };
  return (
    <button
      className={styles.disconnectButton}
      onClick={() => updateNameAndDesc()}
    >
      Update
    </button>
  );
};

export default Update;
