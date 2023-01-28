import { Button, Typography, Paper } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DoneAllRoundedIcon from "@mui/icons-material/DoneAllRounded";
import { auth, db } from "../../config/firebase";
import { providers, Contract, utils } from "ethers";
import { contractAddress } from "../../constants";
import NFTMinter from "../../artifacts/contracts/NFTMinter.sol/NFTMinter.json";
import { doc, updateDoc } from "firebase/firestore";

const provider = new providers.Web3Provider(window.ethereum);
// get the end user
const signer = provider.getSigner();
// get the smart contract
const contract = new Contract(contractAddress, NFTMinter.abi, signer);

const ListingItem = (props) => {
	const navigate = useNavigate();
	const {
		name,
		images,
		id,
		ownerId,
		price,
		downPaymentPrice,
		tokenID,
		maiKhareedSakta,
	} = props;

	const [paymentMade, setPaymentMade] = useState(false);

	const makePayment = async () => {
		// get these values from firebase
		const remainingAmountFromFb = price - downPaymentPrice;
		const tokenIdOfThisProperty = tokenID;

		if (window.ethereum) {
			await window.ethereum.enable();

			const amountInWei = utils.parseUnits(
				remainingAmountFromFb.toString(),
				18
			);

			// call the pay to mint method on the smart contract
			const result = await contract.completePaymentAndEsrow(
				tokenIdOfThisProperty,
				{
					value: amountInWei,
				}
			);

			result.wait();

			// update ownerId
			const propertyRef = doc(db, "ListedProperties", id);

			await updateDoc(propertyRef, {
				ownerId: auth.currentUser.uid,
				purchaseRequests: [],
				authorizeToSell: false,
			});

			setPaymentMade(true);
			// console.log("result", result);
		}
	};

	return (
		<Paper
			elevation={10}
			sx={{
				padding: 4,
				my: 3,
				maxWidth: "23vw",
				borderRadius: "15px",
				paddingBottom: "5px",
				cursor: "pointer",
				"&:hover": {
					boxShadow: "-2px 6px 20px 5px rgba(0,0,0,0.3)",
				},
			}}
			onClick={() => {
				navigate(`/property/${id}`);
			}}
		>
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
				}}
				my={4}
			>
				<Box sx={{ display: "flex", flexDirection: "column" }}>
					<Box
						sx={{
							marginTop: "-22px",
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
					<Box
						sx={{
							marginX: 2,
							display: "flex",
							flexDirection: "column",
							justifyContent: "space-around",
							textAlign: "left",
						}}
					>
						<Typography
							fontSize={"2.5rem"}
							component={Link}
							sx={{ marginBottom: "25px" }}
						>
							{name}
						</Typography>
						<Typography
							variant="h5"
							component={Link}
							sx={{ marginBottom: "20px" }}
						>
							Matic {price}
						</Typography>
						{
							(auth.currentUser.uid !== ownerId,
							price,
							downPaymentPrice && (
								<>
									{maiKhareedSakta && (
										<Button
											variant="outlined"
											startIcon={<DoneAllRoundedIcon />}
											disableRipple={true}
											disableFocusRipple={true}
										>
											Approved
										</Button>
									)}
									{!maiKhareedSakta && !paymentMade && (
										<Button
											variant="outlined"
											startIcon={<AccessTimeIcon />}
											disableRipple={true}
											disableFocusRipple={true}
										>
											Waiting For Approval / Not Approved
										</Button>
									)}
								</>
							))
						}
					</Box>
				</Box>
				<Box>
					{paymentMade ? (
						<Typography>You own this property now</Typography>
					) : (
						<>
							{maiKhareedSakta && (
								<Button variant="outlined" onClick={makePayment}>
									Complete payment and own house
								</Button>
							)}
						</>
					)}
				</Box>
			</Box>
		</Paper>

		// <Paper
		// sx={{
		//     padding: 4,
		//     my: 3,
		//     maxWidth: "23vw",
		//     borderRadius: "15px",
		//     cursor: "pointer",
		//     "&:hover": {
		//         // transitionDelay: "2s",
		//         boxShadow: "-2px 6px 20px 5px rgba(0,0,0,0.3)",
		//     },
		// }}
		// onClick={() => {
		//     navigate(`/property/${id}`);
		// }}
		// >
		//     <Box
		//         sx={{
		//             display: "flex",
		//             justifyContent: "space-between",
		//         }}
		//         my={4}
		//     >
		//         <Box sx={{ display: "flex", flexDirection: "column" }}>
		//             <Box
		//                 sx={{
		//                     marginBottom: "20px",
		//                     marginTop: "-22px",
		//                 }}
		//             >
		//                 <img
		//                     src={images}
		//                     alt={name}
		//                     width={"95%"}
		//                     height={"185px"}
		//                     style={{
		//                         borderRadius: "5px",
		//                         objectFit: "contain",
		//                         alignSelf:"center",
		//                         marginLeft: "2.5%",
		//                         marginRight: "2.5%",
		//                         objectFit: "contain"
		//                     }}
		//                 />
		//             </Box>
		//             <Box
		//                 sx={{
		//                     marginX: 2,
		//                     display: "flex",
		//                     flexDirection: "column",
		//                     justifyContent: "space-around",
		//                     textAlign: "left",
		//                 }}
		//             >
		//                 <Typography fontSize={"2.3rem"}>{name}</Typography>
		//                 <Typography
		//                     fontSize={"1.1rem"}
		//                     sx={{ marginBottom: "12px" }}
		//                 >
		//                     {propertyType}
		//                 </Typography>

		//                 <Typography variant="h5" sx={{ marginBottom: "10px" }}>
		//                     Matic {price}
		//                 </Typography>

		//                 <Typography variant="body">
		//                     {/* <LocationOnIcon /> */}
		//                     <img
		//                         src="/location.png"
		//                         style={{ width: "20px", marginRight: "5px" }}
		//                     />
		//                     {city}
		//                 </Typography>
		//             </Box>
		//         </Box>
		//     </Box>
		// </Paper>
	);
};

export default ListingItem;
