import { useSelector } from "react-redux";
import React, { useState, useEffect } from 'react';
import styles from "../../styles/modules/connect/connect.module.css";
import Button from '@mui/material/Button';
import { NFTabi } from "../../utils/ABIs/NFTabi";
import { tokenABI } from "../../utils/ABIs/TokenABI";
import {
  ERC721OrderFeatureAddress,
  TokenAddressList,
  SMARTCONTRACTADDR,
} from "../../utils/constants";
import Web3 from "web3";
import axios from "axios";
import { ERC721OrderFeatureABI } from "../../utils/ABIs/ERC721OrdersFeature";

const AcceptOrderBox = ({hideModal, item,color}) => {
    const { connectedAddress } = useSelector((state) => state.minting);
    const [erc20TokenAmount, setErc20TokenAmount] = useState(0);
    const [maker, setMaker] = useState('');
    const [taker, setTaker] = useState('');
    useEffect(() => {
        if(item){
            var temp_tokenAmount = item.erc20TokenAmount / 1000000000000000000;
            setErc20TokenAmount(temp_tokenAmount);
            var temp_maker = item.maker.slice(0,5) + "..." + item.maker.slice(-4);
            setMaker(temp_maker);
            var temp_taker = item.taker.slice(0,5) + "..." + item.taker.slice(-4);
            setTaker(temp_taker);
        }
    }, [item]);

    const approveNFT = async () => {
        if(connectedAddress == "")
        {
            console.log("You need to connect to wallet!");
            return;
        }
        var web3 = new Web3(window.ethereum);
        const NFTInstance = new web3.eth.Contract(NFTabi, SMARTCONTRACTADDR);

        var ownerOfToken = await NFTInstance.methods.ownerOf(item.erc721TokenId).call();
        if(connectedAddress.toLowerCase() != ownerOfToken.toLowerCase())
        {
            console.log("Only owner can accept the NFT!", ownerOfToken);
            return;
        }

        var isNFTApprovedForAll = await NFTInstance.methods.isApprovedForAll(ownerOfToken, ERC721OrderFeatureAddress).call();
        if (isNFTApprovedForAll == false) {
            console.log("You need to approve");
            try {
                await NFTInstance.methods
                .setApprovalForAll(ERC721OrderFeatureAddress, true)
                .send({
                    from: connectedAddress,
                });
                return true;
            } catch (e) {
                console.log("ERROR!", e);
                return false;
            }
        }
        else
        {
            console.log("NFT already approved!");
        }
    }

    const acceptBuyOrder = async() => {
        var web3 = new Web3(window.ethereum);
        const marketPlaceInstance = new web3.eth.Contract(
            ERC721OrderFeatureABI,
            ERC721OrderFeatureAddress
            );

        var signature = item.signature;
        const buyOrder = {
            direction: 1,
          maker: item.maker,
          taker: item.taker,
          expiry: item.expiry,
          nonce: item.nonce,
          erc20Token: item.erc20Token,
          erc20TokenAmount: item.erc20TokenAmount,
          fees: item.fees,
          erc721Token: item.erc721Token,
          erc721TokenId: item.erc721TokenId,
          erc721TokenProperties: item.erc721TokenProperties,
        };
        console.log("buyOrder:", buyOrder);
    
        try{
            var currentResult = await axios({
                method: "PATCH",
                url: "http://localhost:3001/api/v1/buy_orders/current",
                headers: {
                "Content-Type": "application/json",
                },
                data: JSON.stringify({ order_id: item._id, current: 2 }),
            });
            console.log("currentResult", currentResult);
        }catch (e) {
            console.log("error when set current!", e);
            return false;
        }

        try {
            await marketPlaceInstance.methods
            .sellERC721(buyOrder, signature, buyOrder.erc721TokenId, false, "0x")
            .send({
                from: connectedAddress,
            });
            try{
                var currentResult = await axios({
                    method: "PATCH",
                    url: "http://localhost:3001/api/v1/buy_orders/current",
                    headers: {
                    "Content-Type": "application/json",
                    },
                    data: JSON.stringify({ order_id: item._id, current: 3 }),
                });
                console.log("currentResult", currentResult);
            } catch (e) {
                console.log("error when set current!", e);
                return false;
            }
        } catch(e) {
            try{
                var currentResult = await axios({
                    method: "PATCH",
                    url: "http://localhost:3001/api/v1/buy_orders/current",
                    headers: {
                    "Content-Type": "application/json",
                    },
                    data: JSON.stringify({ order_id: item._id, current: 1 }),
                });
                console.log("currentResult", currentResult);
            } catch (e) {
                console.log("error when set current!", e);
                return false;
            }
        }
    }

    const approveToken = async () => {
        var web3 = new Web3(window.ethereum);
        const tokenInstance = new web3.eth.Contract(tokenABI, TokenAddressList[0]);
    
        var approvedAmount = await tokenInstance.methods
          .allowance(connectedAddress, ERC721OrderFeatureAddress)
          .call();
        let approve_amount =
          "115792089237316195423570985008687907853269984665640564039457584007913129639935"; //(2^256 - 1 )
        if (parseInt(approvedAmount) == 0) {
          console.log("You need to approve");
          try {
            await tokenInstance.methods
              .approve(ERC721OrderFeatureAddress, approve_amount)
              .send({
                from: connectedAddress,
              });
            console.log("Token is approved!");
            return true;
          } catch (e) {
            console.log("ERROR!", e);
            return false;
          }
        }
        else
        {
          console.log("Token is already approved!");
        }
    }

    const acceptSellOrder = async () => {
        var web3 = new Web3(window.ethereum);
        const marketPlaceInstance = new web3.eth.Contract(
            ERC721OrderFeatureABI,
            ERC721OrderFeatureAddress
            );
            
        var signature = item.signature;
        const sellOrder = {
            direction: item.order_direction,
            maker: item.maker,
            taker: item.taker,
            expiry: item.expiry,
            nonce: item.nonce,
            erc20Token: item.erc20Token,
            erc20TokenAmount: item.erc20TokenAmount,
            fees: item.fees,
            erc721Token: item.erc721Token,
            erc721TokenId: item.erc721TokenId,
            erc721TokenProperties: item.erc721TokenProperties,
        };
        console.log("sellOrder:", sellOrder);
    
        await marketPlaceInstance.methods
          .buyERC721(sellOrder, signature, "0x")
          .send({
            from: connectedAddress,
        });
    }

    const approve = async () => {
        // approveToken();
        approveNFT();
    };

    const acceptOrder = async () => {
        // acceptSellOrder();
        acceptBuyOrder();
    };

    return (
    <>
    {item == null?"":(
        <section className={styles.Wrapper}>
            <p onClick={hideModal} style={{color:'white',float:'right',cursor:'pointer',fontSize:'20px'}}>close</p>
            <div className={styles.InnerWrapper}>
                <section className={styles.container}>
                    <div className={styles.InnerWrapper}>
                        <p>createdAt:{item.createdAt}</p>
                        <p>erc20TokenAmount:{erc20TokenAmount}</p>
                        <p>erc20Token:{item.erc20Token}</p>
                        <p>maker:{maker}</p>
                        <p>taker:{taker}</p>
                        <p>erc721TokenId:{item.erc721TokenId}</p>
                        <p>expiry_date:{item.expiry_date}</p>
                        <p>fees:{item.fees.length}</p>
                        <p>nonce:{item.nonce}</p>
                        <p>color:<a style={{ textTransform: "uppercase" }}>{color}</a></p>
                        <p>onChain:{item.onChain == true ? "TRUE" : "FALSE"}</p>
                    </div>
                    {
                        item.order_direction == 1 ?
                        item.taker.toLowerCase() == connectedAddress.toLowerCase() ? (
                            <div>
                                <Button variant="contained" color="primary" onClick={() => approve()}>
                                    Approve
                                </Button>
                                <Button variant="contained" color="success" style={{marginLeft:'30px'}} onClick={() => acceptOrder()}>
                                    Accept order
                                </Button>
                            </div>
                        ): "You are not the owner so you can just see order detail."
                        :
                        item.taker.toLowerCase() != connectedAddress.toLowerCase() ? (
                            <div>
                                <Button variant="contained" color="primary" onClick={() => approve()}>
                                    Approve
                                </Button>
                                <Button variant="contained" color="success" style={{marginLeft:'30px'}} onClick={() => acceptOrder()}>
                                    Accept order
                                </Button>
                            </div>
                        ) : "You are owner so you can just see order detail. You can cancel this in the future."
                    }
                </section>
            </div>
        </section>)}
    </>
    );
};

export default AcceptOrderBox;
