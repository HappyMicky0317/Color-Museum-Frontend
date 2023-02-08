import { useSelector } from "react-redux";
import React, { useState, useEffect } from 'react';
import styles from "../../styles/modules/connect/connect.module.css";
import Button from '@mui/material/Button';
import Web3 from "web3";
import { tokenABI } from "../../utils/ABIs/TokenABI";
import { NFTabi } from "../../utils/ABIs/NFTabi";
import { ERC721OrderFeatureABI } from "../../utils/ABIs/ERC721OrdersFeature";
import axios from "axios";
import {
    ERC721OrderFeatureAddress,
    TokenAddressList,
    SMARTCONTRACTADDR,
  } from "../../utils/constants";
import { ethers } from 'ethers';

const BidModal = ({hideModal, selectedCurrencyInput, selectedCurrency, expireDay, number, color}) => {
    const { connectedAddress } = useSelector((state) => state.minting);

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
    };

    const signBuyOrder = async () => {
        var web3 = new Web3(window.ethereum);
    
        const marketPlaceInstance = new web3.eth.Contract(
          ERC721OrderFeatureABI,
          ERC721OrderFeatureAddress
        );
    
        var latestNonce = await axios.get("http://localhost:3001/api/v1/nonce");
        if (latestNonce.data.success == false) {
          console.log(
            "Something is wrong with server. Please check network connection or contact to us."
          );
          return false;
        }
        console.log("LatestNonce:", latestNonce);
        var expireTime =
          expireDay == "24H"
            ? 60 * 60 * 24
            : expireDay == "72H"
            ? 60 * 60 * 24
            : expireDay == "7D"
            ? 60 * 60 * 24 * 7
            : expireDay == "30D"
            ? 60 * 60 * 24 * 30
            : 0;
        const NFTInstance = new web3.eth.Contract(NFTabi, SMARTCONTRACTADDR);

        const NFTTaker = await NFTInstance.methods.ownerOf(number).call();

        if(connectedAddress == NFTTaker)
        {
          console.log("Owner can not make offer!");
          return false;
        }

        var erc20AmountBN = ethers.utils.parseEther(selectedCurrencyInput);
        const order = {
          direction: 1,
          maker: connectedAddress,
          taker: NFTTaker,
          expiry: Math.floor(new Date().getTime() / 1000) + expireTime,
          nonce: latestNonce.data.nonce + 1,
          erc20Token: TokenAddressList[0],
          erc20TokenAmount: erc20AmountBN.div(10000).mul(9875).toString(),
          fees: [
            {
              recipient: "0x0148bE2b36E7Ff2F86E2b6c41554379921312902",
              amount: erc20AmountBN.mul(25).div(1000).toString(),
              feeData: "0x",
            }
          ],
          erc721Token: SMARTCONTRACTADDR,
          erc721TokenId: Number(number),
          erc721TokenProperties: [],
        };
        console.log("Order:", order);

        var isOrderCorrect = false;
        while (!isOrderCorrect) {
          try {
            await marketPlaceInstance.methods.getERC721OrderStatus(order).call();
            isOrderCorrect = true;
          } catch (e) {
            console.log(e);
            order.nonce += 1;
          }
        }

        try {
          var fetchResult;
          try {
            var fetchData = order;
            fetchData.nft_color_id = "62ec1da706ff5da975b9c1bf";
            const signature = {
              signatureType: 4,
              v: 0,
              r: "0x0000000000000000000000000000000000000000000000000000006d6168616d",
              s: "0x0000000000000000000000000000000000000000000000000000006d6168616d",
            };
            fetchData.signature = signature;
            console.log("fetchData:", fetchData);
            fetchResult = await axios({
              // Enter your IP address here
              method: "POST",
              url: "http://localhost:3001/api/v1/buy_orders",
              headers: {
                "Content-Type": "application/json",
              },
              data: JSON.stringify(fetchData), // body data type must match "Content-Type" header
            });
            if (fetchResult.data.success == true) console.log("Order added!");
            else {
              console.log(
                "Something is wrong with server!\nPlease contact with server side!"
              );
              return false;
            }
          } catch (e) {
            console.log("Error when connecting db:", e);
            return false;
          }

          await marketPlaceInstance.methods.preSignERC721Order(order).send({
            from: connectedAddress,
          });
    
          try {
            var currentResult = await axios({
              method: "PATCH",
              url: "http://localhost:3001/api/v1/buy_orders/current",
              headers: {
                "Content-Type": "application/json",
              },
              data: JSON.stringify({ order_id: fetchResult.data.body._id, current: 1}),
            });
            console.log("currentResult", currentResult);
          } catch (e) {
            console.log("error when set current to 1!", e);
            return false;
          }
        } catch (e) {
          console.log("Error while signing!", e);
          return false;
        }
        return true;
      };


    const approveNFT = async () => {
        var web3 = new Web3(window.ethereum);
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
        }
        else
        {
            console.log("NFT already approved!");
            return true;
        }
    };

    const signSellOrder = async () => {
        var web3 = new Web3(window.ethereum);

        const marketPlaceInstance = new web3.eth.Contract(
            ERC721OrderFeatureABI,
            ERC721OrderFeatureAddress
        );
        console.log(marketPlaceInstance);
        var latestNonce = await axios.get("http://localhost:3001/api/v1/nonce");
        if (latestNonce.data.success == false) {
            console.log(
            "Something is wrong with server. Please check network connection or contact to us."
            );
            return false;
        }

        var expireTime =
            expireDay == "24H"
            ? 60 * 60 * 24
            : expireDay == "72H"
            ? 60 * 60 * 24
            : expireDay == "7D"
            ? 60 * 60 * 24 * 7
            : expireDay == "30D"
            ? 60 * 60 * 24 * 30
            : 0;
        const order = {
            direction: 0,
            maker: connectedAddress,
            taker: "0x0000000000000000000000000000000000000000",
            expiry: Math.floor(new Date().getTime() / 1000 + expireTime),
            nonce: latestNonce.data.nonce + 1,
            erc20Token: TokenAddressList[0],
            erc20TokenAmount: web3.utils.toWei(selectedCurrencyInput, "ether"),
            fees: [],
            erc721Token: SMARTCONTRACTADDR,
            erc721TokenId: number,
            erc721TokenProperties: [],
        };
        console.log(order);
        console.log(JSON.stringify(order));

        var isOrderCorrect = false;
        while (!isOrderCorrect) {
            try {
            await marketPlaceInstance.methods.getERC721OrderStatus(order).call();
            isOrderCorrect = true;
            } catch (e) {
            console.log(e);
            order.nonce += 1;
            }
        }

        try {
            var fetchResult;
            try {
            var fetchData = order;
            fetchData.erc20TokenAmount = 1;
            fetchData.nft_color_id = "62ec1da706ff5da975b9c1bf";
            const signature = {
                signatureType: 4,
                v: 0,
                r: "0x0000000000000000000000000000000000000000000000000000006d6168616d",
                s: "0x0000000000000000000000000000000000000000000000000000006d6168616d",
            };
            fetchData.signature = signature;
            fetchData.onChain = true;
            fetchResult = await axios({
                method: "POST",
                url: "http://localhost:3001/api/v1/sell_orders",
                headers: {
                "Content-Type": "application/json",
                },
                data: JSON.stringify(fetchData), // body data type must match "Content-Type" header
            });
            console.log(fetchResult);
            if (fetchResult.data.success == true) console.log("Signed Success!");
            else
                console.log(
                "Something is wrong with server!\nPlease contact with server side!"
                );
            } catch (e) {
            console.log("Error when connecting db:", e);
            return false;
            }

            await marketPlaceInstance.methods.preSignERC721Order(order).send({
            from: connectedAddress,
            });

            try {
              var currentResult = await axios({
                  method: "PATCH",
                  url: "http://localhost:3001/api/v1/sell_orders/current",
                  headers: {
                  "Content-Type": "application/json",
                  },
                  data: JSON.stringify({ order_id: fetchResult.data.body._id, current: 1 }),
              });
              console.log(currentResult);
            } catch (e) {
              console.log("error when set current!", e);
              return false;
            }
            return true;
        } catch (e) {
            console.log("Error!", e);
            return false;
        }
    };

    const acceptBuyOffer = async (item) => {
        var web3 = new Web3(window.ethereum);
        const marketPlaceInstance = new web3.eth.Contract(
            ERC721OrderFeatureABI,
            ERC721OrderFeatureAddress
        );

        var signature = item.signature;
        var order = {
            direction: 1,
            maker: item.buyOrderMaker,
            taker: item.account,
            expiry: item.expiry,
            nonce: item.nonce,
            erc20Token: item.erc20Token,
            erc20TokenAmount: item.erc20TokenAmount,
            fees: item.fee,
            erc721Token: item.erc721Token,
            erc721TokenId: item.erc721TokenId,
            erc721TokenProperties: item.erc721TokenProperties,
        };

        await marketPlaceInstance.methods
            .sellERC721(order, signature, order.erc721TokenId, false, "0x")
            .send({
            from: connectedAddress,
            });
    };

    const approve = () => {
      approveToken();
      // approveNFT();
    }

    const makeOrder = () => {
      signBuyOrder();
      // signSellOrder();
    }

    return (
    <>
    {selectedCurrencyInput == null?"":(
        <section className={styles.Wrapper}>
            <p onClick={hideModal} style={{color:'white',float:'right',cursor:'pointer',fontSize:'20px'}}>close</p>
            <div className={styles.InnerWrapper}>
                <section className={styles.container}>
                    <div className={styles.InnerWrapper}>
                        <p style={{color:'white'}}>Trading type : Bid</p>
                        <p style={{color:'white'}}>selectedCurrencyInput : {selectedCurrencyInput}</p>
                        <p style={{color:'white'}}>selectedCurrency : {selectedCurrency}</p>
                        <p style={{color:'white'}}>expireDay : {expireDay}</p>
                        <p style={{color:'white'}}>NFT No : {number}</p>
                        <p style={{color:'white'}}>color : {color}</p>
                        <div style={{textAlign:'center',marginTop:'30px'}}>
                        <Button variant="contained" color="primary" onClick={() => approve()}>
                            Approve
                        </Button>
                        <Button variant="contained" color="success" style={{marginLeft:'30px'}} onClick={() => makeOrder()}>
                            Make order
                        </Button>
                        </div>
                    </div>
                </section>
            </div>
        </section>)}
    </>
    );
};

export default BidModal;
