import { Button, Typography, Paper, Grid } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useState } from "react";

import { providers, Contract, utils } from "ethers";
import { contractAddress } from "../../constants";
import NFTMinter from "../../artifacts/contracts/NFTMinter.sol/NFTMinter.json";
import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../config/firebase";
import { useSnackbar } from "notistack";

const provider = new providers.Web3Provider(window.ethereum);
// get the end user
const signer = provider.getSigner();
// get the smart contract
const contract = new Contract(contractAddress, NFTMinter.abi, signer);

const PropertyDetails = () => {
    const { propertyID } = useParams();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({});
    const {
        id,
        name,
        price,
        images,
        city,
        address,
        type,
        amenities,
        ownerId,
        deposit,
        monthly,
        purchaseRequests,
    } = data;

    const { enqueueSnackbar } = useSnackbar();

    const [allowRequestPurchase, setAllowRequestPurchase] = useState(false);
    const [walletAddress, setWalletAddress] = useState(null);

    useEffect(() => {
        handleConnect();
    }, []);

    useEffect(() => {
        console.log(propertyID);
        const getData = async () => {
            setLoading(true);
            const docRef = doc(db, "ListedProperties", propertyID);
            const docSnap = await getDoc(docRef);
            setData({ ...docSnap.data(), id: docSnap.id });
            setLoading(false);
        };
        getData();
    }, [propertyID]);

    useEffect(() => {
        setAllowRequestPurchase(true);

        if (!purchaseRequests) return;
        purchaseRequests.forEach((request) => {
            if (request.uid === auth.currentUser.uid) {
                setAllowRequestPurchase(false);
            }
        });
    }, [purchaseRequests]);

    const makeDeposit = async () => {
        const tokenId = data.tokenID;
        const downPayment = data.downPaymentPrice;
        console.log(tokenId, downPayment);

        if (!walletAddress) {
            console.log("wallet address nahi hai");
            return;
        }

        if (window.ethereum) {
            await window.ethereum.enable();
            // Convert the amount to wei
            const amountInWei = utils.parseUnits(downPayment.toString(), 18);

            if (window.ethereum) {
                await window.ethereum.enable();

                const result = await contract.makeDownPayment(
                    tokenId,
                    walletAddress,
                    {
                        value: amountInWei,
                    }
                );

                result.wait();

                const propertyRef = doc(db, "ListedProperties", id);

                await updateDoc(propertyRef, {
                    purchaseRequests: arrayUnion({
                        name: auth.currentUser.displayName,
                        uid: auth.currentUser.uid,
                        walletAddress: walletAddress,
                        approved: false,
                    }),
                });

                enqueueSnackbar("Purchase Made", {
                    variant: "success",
                });

                setAllowRequestPurchase(false);

                console.log("result", result);
            }
        }
    };

    const handleConnect = () => {
        window.ethereum
            .request({ method: "eth_requestAccounts" })
            .then((res) => {
                setWalletAddress(res[0]);
            });
    };

    if (
        !loading &&
        (data.authorize === false ||
            data.authorizeToSell === false ||
            data.alreadySold === true)
    ) {
        return (
            <Box p={5} display="flex">
                <Typography variant="h2">
                    Property listing does not exist OR is already sold
                </Typography>
            </Box>
        );
    }

    return (
        <Box p={5} display="flex">
            {loading && <Typography variant="h2">Loading...</Typography>}
            {!loading && (
                <>
                    <Box>
                        <img width={350} src={images[0]} alt={name} />
                    </Box>
                    <Box mx={10}>
                        <Typography variant="h1" my={4}>
                            {name}
                        </Typography>

                        <Typography variant="h4" my={4}>
                            Rs.{price}
                        </Typography>
                        <Box>
                            {allowRequestPurchase && (
                                <Button
                                    variant="contained"
                                    onClick={makeDeposit}
                                    disabled={loading}
                                >
                                    Request Purchase
                                </Button>
                            )}

                            <Button
                                variant="outlined"
                                component={Link}
                                to={`/chat/${ownerId}`}
                                sx={{ marginX: 4 }}
                            >
                                Chat with Owner
                            </Button>
                        </Box>
                        <Typography variant="body1" my={4}>
                            <LocationOnIcon />
                            {city}
                        </Typography>
                        <Typography variant="body1" my={4}>
                            <strong>Address:</strong> {address}
                        </Typography>

                        <Typography variant="h4">Amenities</Typography>
                        <Grid container>
                            {amenities.map((item) => (
                                <Grid item xs={6}>
                                    <Paper
                                        sx={{
                                            padding: 2,
                                            marginX: 3,
                                            marginY: 1,
                                        }}
                                    >
                                        <Typography
                                            sx={{ width: "fit-content" }}
                                        >
                                            {item}
                                        </Typography>
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </>
            )}
        </Box>
    );
};

export default PropertyDetails;
