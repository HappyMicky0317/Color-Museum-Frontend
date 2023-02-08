import { useWeb3React } from "@web3-react/core";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Web3 from "web3";
import {
  IsMintingOn,
  PriceToMint,
  TransactionHash,
} from "../../store/actions/toggle";
import styles from "../../styles/modules/mint/mint.module.css";
import {
  DISCOUNT_PRICE,
  PROVIDER,
  SMARTCONTRACTADDR,
} from "../../utils/constants";

const MintButton = () => {
  const dispatch = useDispatch();
  const priceToMint = 0.4;
  const [tokenId, setTokenId] = useState("");

  useEffect(() => {
    if (hexToNumber) {
      if (hexToNumber === 0) {
        setTokenId(1000000);
      } else {
        setTokenId(hexToNumber);
      }
    }
  }, [hexToNumber]);
  //
  //
  // const { library } = useWeb3React();
  // useEffect(() => {
  //   if (library) {
  //     setWeb3(new Web3(library.givenProvider));
  //   } else {
  //     setWeb3(new Web3(new Web3.providers.HttpProvider(PROVIDER)));
  //   }
  // }, [library]);
  //
  //
  const checkDiscountApplicable = async (address, contract) => {
    const isWhiteList = await contract.methods.isWhiteList(address).call();
    return isWhiteList;
  };
  const router = useRouter();
  const handleRedirect = () => {
    router.push("/mint-pending");
  };
  const handleRedirectSuccess = () => {
    dispatch(IsMintingOn());
    router.push("/mint-success");
  };
  const handleRedirectFail = () => {
    dispatch(IsMintingOn());
    router.push("/mint-failed");
  };

  //
  const {
    choosenColorFinal,
    choosenNameFinal,
    choosenDescriptionFinal,
    connectedAddress,
    hexToNumber,
    gasPrice,
    transactionHash,
    web3,
  } = useSelector((state) => state.minting);
  const sendMint = async () => {
    console.log(DISCOUNT_PRICE);
    if (connectedAddress === "") {
      alert("Try Wallet Connection!");
    } else if (hexToNumber === "") {
      alert("Insert Token Id!");
    } else {
      const contract_address = SMARTCONTRACTADDR;
      const abi = [
        {
          inputs: [],
          name: "name",
          outputs: [
            {
              internalType: "string",
              name: "",
              type: "string",
            },
          ],
          stateMutability: "view",
          type: "function",
          constant: true,
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "_to",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "_tokenId",
              type: "uint256",
            },
          ],
          name: "mint",
          outputs: [],
          stateMutability: "payable",
          type: "function",
          payable: true,
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "user",
              type: "address",
            },
          ],
          name: "isWhiteList",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
      ];
      const thisAddress = connectedAddress;
      const thisGasPrice = gasPrice !== 0 && gasPrice ? gasPrice : 60000000000;
      let value = web3.utils.toWei(
        localStorage.getItem("EspecificAmount")
          ? localStorage.getItem("EspecificAmount")
          : priceToMint.toString(),
        "ether"
      );
      const contract = new web3.eth.Contract(abi, contract_address);
      const isDiscountApplicable = await checkDiscountApplicable(
        thisAddress,
        contract
      );
      if (isDiscountApplicable) {
        value = value * ((100 - DISCOUNT_PRICE) * 0.01);
        const ethToUsdPrice = async () => {
          let usdPrice = 0;
          await axios(
            "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD"
          ).then((res) => (usdPrice = res.data.USD));
          let ethPrice = Number(priceToMint);
          ethPrice = ethPrice * ((100 - DISCOUNT_PRICE) * 0.01);
          dispatch(PriceToMint(usdPrice * ethPrice));
        };
        ethToUsdPrice();
      } else {
        const ethToUsdPrice = async () => {
          let usdPrice = 0;
          await axios(
            "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD"
          ).then((res) => (usdPrice = res.data.USD));
          let ethPrice = Number(priceToMint);
          dispatch(PriceToMint(usdPrice * ethPrice));
        };
        ethToUsdPrice();
      }
      await contract.methods
        .mint(thisAddress, tokenId)
        .send({
          from: thisAddress,
          value,
          gas: 220000,
          maxFeePerGas: thisGasPrice,
          maxPriorityFeePerGas: 2000000000,
        })
        .on("transactionHash", function (hash) {
          dispatch(TransactionHash(hash));
          localStorage.setItem("mintingAddress", connectedAddress);
          localStorage.setItem("mintingTransactionHash", hash);
          localStorage.setItem("mintingName", choosenNameFinal);
          localStorage.setItem("mintingColor", choosenColorFinal);
          localStorage.setItem("mintingDescription", choosenDescriptionFinal);
          localStorage.setItem("mintingHexToNumber", hexToNumber);
          handleRedirect();
        })
        .on("confirmation", function (confirmationNumber, receipt) {
          if (confirmationNumber === 1 && receipt.status === true) {
            handleRedirectSuccess();
          }
        })
        .on("failed", function (a) {
          console.log(a);
        })
        .on("receipt", function (receipt) {
          console.log(receipt);
        })
        .on("error", function (error, receipt) {
          console.log(error);
          if (error.message.includes("not mined within 50 blocks")) {
            const handle = setInterval(() => {
              web3.eth.getTransactionReceipt(transactionHash).then((resp) => {
                if (resp != null && resp.blockNumber > 0) {
                  clearInterval(handle);
                  handleRedirectSuccess();
                }
              });
            });
          } else if (
            error.message.includes("User denied transaction signature")
          ) {
            console.log("keep on mint page");
            null;
          } else {
            handleRedirectFail();
          }
        });
    }
  };
  return (
    <button className={styles.disconnectButton} onClick={() => sendMint()}>
      Mint
    </button>
  );
};

export default MintButton;
