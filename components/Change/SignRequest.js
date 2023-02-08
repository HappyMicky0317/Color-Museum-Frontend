import { useSelector, useDispatch } from "react-redux";
import Web3 from "web3";
import styles from "../../styles/modules/mint/mint.module.css";
import { MESSAGE, SMARTCONTRACTADDR } from "../../utils/constants";
import { ErrorOn, MessageObj } from "../../store/actions/updateMint";
import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import toast from "react-hot-toast";
import { IoCloseSharp } from "react-icons/io5";

const SignRequest = ({ setAllowAPI, tokenId }) => {
  const { connectedAddress } = useSelector((state) => state.minting);
  const dispatch = useDispatch();
  const [web3, setWeb3] = useState(null);
  const { account, library } = useWeb3React();
  useEffect(() => {
    if (account && library) {
      setWeb3(new Web3(library.givenProvider));
    }
  }, [library]);
  const signTransaction = async () => {
    try {
      const contract = new web3.eth.Contract(
        [
          {
            inputs: [
              {
                internalType: "uint256",
                name: "tokenId",
                type: "uint256",
              },
            ],
            name: "ownerOf",
            outputs: [
              {
                internalType: "address",
                name: "",
                type: "address",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
        ],
        SMARTCONTRACTADDR
      );
      const ownerAddress = await contract.methods.ownerOf(tokenId).call();
      // const message = web3.utils.sha3("Hello World");
      const message = MESSAGE;
      const signature = await web3.eth.personal.sign(message, connectedAddress);
      const signer = await web3.eth.personal.ecRecover(message, signature);
      if (ownerAddress.toLowerCase() === signer.toLowerCase())
        setAllowAPI(true);
      else {
        toast(
          (t) => (
            <div className={styles.toastComman}>
              You are not the owner
              <IoCloseSharp
                size={25}
                onClick={() => {
                  toast.dismiss(t.id);
                }}
              />
            </div>
          ),
          {
            position: "top-center",
          }
        );
        dispatch(
          MessageObj({
            heading: "Error",
            text: "You are not the owner",
          })
        );
        dispatch(ErrorOn());
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <button
        className={styles.disconnectButton}
        onClick={() => signTransaction()}
      >
        Sign
      </button>
    </>
  );
};

export default SignRequest;
