import { Box, Button, Grid, Paper, TextField, Typography } from "@mui/material";
import { Contract, ethers, providers } from "ethers";
import BigNumber from "bignumber.js";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { contractAddress } from "../../constants";
import ThreeBricks from "../../artifacts/contracts/ThreeBricks.sol/ThreeBricks.json";
import DoneAllIcon from "@mui/icons-material/DoneAll";

import { db } from "../../config/firebase";
import { doc, updateDoc } from "firebase/firestore";

const provider = new providers.Web3Provider(window.ethereum);
// get the end user
const signer = provider.getSigner();
// get the smart contract
const contract = new Contract(contractAddress, ThreeBricks.abi, signer);

const ListingSellerItem = (props) => {
    const {
        ownerId,
        name,
        images,
        purchaseRequests,
        titleDeed,
        tokenID,
        id,
        authorizeToSell,
        authorize,
        alreadySold,
    } = props;
    const navigate = useNavigate();

    const [token, setToken] = useState(0.001);
    const [price, setPrice] = useState(0.01);
    const [authorizeToSellState, setAuthorizeToSellState] =
        useState(authorizeToSell);

    const [showPurchaseRequests, setShowPurchaseRequests] = useState(true);

    const listPropertyForSale = async () => {
        // take these values
        const depositAmt = ethers.utils.parseUnits(token.toString(), 18);
        const sellingPrice = ethers.utils.parseUnits(price.toString(), 18);

        // get these values from firebase
        const tokenIdOfThisProperty = tokenID;

        if (window.ethereum) {
            await window.ethereum.enable();
            console.log(contract);

            // call the pay to mint method on the smart contract
            const result = await contract.createPropertyListing(
                tokenIdOfThisProperty,
                sellingPrice,
                depositAmt
            );

            result.wait();

            console.log("result", result);
            const propertyRef = doc(db, "ListedProperties", id);

            await updateDoc(propertyRef, {
                authorizeToSell: true,
                downPaymentPrice: token,
                price: price,
                alreadySold: false,
            });
            setAuthorizeToSellState(true);
        }
    };

    const sell = async (buyerAddress, buyerUid) => {
        if (window.ethereum) {
            await window.ethereum.enable();
            // call the pay to mint method on the smart contract
            const result = await contract.NFTOwnerStartEscrow(
                tokenID,
                buyerAddress
            );

            result.wait();

            // console.log(purchaseRequests)
            let tData = [];
            for (let i = 0; i < purchaseRequests.length; i++) {
                // console.log(purchaseRequests[i].walletAddress,buyerAddress)
                if (purchaseRequests[i].walletAddress === buyerAddress) {
                    tData.push({
                        uid: buyerUid,
                        walletAddress: buyerAddress,
                        approved: true,
                    });
                } else {
                    tData.push({
                        ...purchaseRequests[i],
                    });
                }
            }

            // update owner ID in firebase
            await updateDoc(doc(db, "ListedProperties", id), {
                // ownerId: buyerUid,

                // TODO: make a copy of them in another collection
                // and mark the winner ---- maybe

                // // clears all other requests
                purchaseRequests: tData,

                // remove property from listing
                alreadySold: true,
            });

            setShowPurchaseRequests(false);
        }
    };

    return (
        <Paper
            elevation={12}
            m={5}
            sx={{
                padding: 4,
                my: 3,
                maxWidth: "23vw",
                paddingBottom: "20px",
                borderRadius: "15px",
                // cursor: "pointer",
                "&:hover": {
                    // transitionDelay: "2s",
                    // boxShadow: "-2px 6px 20px 5px rgba(0,0,0,0.3)",
                },
            }}
            onClick={() => {
                // navigate(`/property/${id}`);
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                }}
                // my={4}
            >
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Box
                        sx={{
                            marginBottom: "-25px",
                            // marginTop: "-22px",
                        }}
                    >
                        <img
                            src={images}
                            alt={name}
                            width={"95%"}
                            height={"185px"}
                            style={{
                                borderRadius: "5px",
                                objectFit: "contain",
                                alignSelf: "center",
                                marginLeft: "2.5%",
                                marginRight: "2.5%",
                                objectFit: "contain",
                            }}
                        />
                    </Box>
                    <Box component={Paper} m={3} width={"100%"}>
                        {showPurchaseRequests === true &&
                            purchaseRequests &&
                            alreadySold === false &&
                            purchaseRequests.map((item, i) => (
                                <Box
                                    key={item.uid + i}
                                    display={"flex"}
                                    justifyContent="space-between"
                                    alignItems={"center"}
                                    width={"90%"}
                                    p={2}
                                >
                                    <Typography>{item.name}</Typography>
                                    <Button
                                        onClick={() => {
                                            sell(item.walletAddress, item.uid);
                                        }}
                                        variant="contained"
                                    >
                                        Sell
                                    </Button>
                                </Box>
                            ))}
                    </Box>
                </Box>
                <Box width={"100%"} sx={{ paddingLeft: "7px" }}>
                    <Typography variant="h3">{name}</Typography>

                    <Box
                        sx={{
                            display: "flex",
                            marginY: 3,
                            flexDirection: "row",
                            justifyContent: "space-between",
                            width: "100%",
                        }}
                    >
                        <a href={titleDeed.fileAddress} target="_blank">
                            <Button variant="contained">title deed</Button>
                        </a>
                    </Box>
                    {authorize === true && authorizeToSellState === false && (
                        <Box
                            sx={{
                                marginX: 2,
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-around",
                                textAlign: "left",
                            }}
                        >
                            <TextField
                                value={token}
                                onChange={(e) => setToken(e.target.value)}
                                label="Token Amount"
                                sx={{
                                    marginBottom: "14px",
                                }}
                            >
                                {" "}
                            </TextField>
                            <TextField
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                label="Selling Price"
                                sx={{
                                    marginBottom: "20px",
                                }}
                            >
                                {" "}
                            </TextField>
                        </Box>
                    )}
                </Box>
                {authorize === true && authorizeToSellState === false && (
                    <Box>
                        <Button
                            variant="contained"
                            onClick={listPropertyForSale}
                        >
                            List Property
                        </Button>
                    </Box>
                )}
            </Box>
        </Paper>
    );
};

export default ListingSellerItem;
