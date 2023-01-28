import React from "react";
import { Paper, Typography } from "@mui/material";
import { Box } from "@mui/system";
import ListingItem from "../../components/property/ListingItem";
import { db } from "../../config/firebase.js";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";

const Properties = () => {
	const [data, setData] = useState([]);

	useEffect(() => {
		const getProperties = async () => {
			const snapshot = await getDocs(collection(db, "ListedProperties"));
			let tData = [];
			snapshot.forEach((doc) => {
				// console.log(doc.id, " => ", doc.data());
				let temp = doc.data();

				if (
					temp.authorize !== false &&
					temp.authorizeToSell !== false &&
					temp.alreadySold !== true
				) {
					tData.push({ ...doc.data(), id: doc.id });
				}
			});
			setData(tData);
		};
		getProperties();
	}, []);

	return (
		<Box m={5}>
			<Box
				component={Paper}
				sx={{
					width: "80%",
					textAlign: "center",
					borderRadius: "8px",
					paddingY: "2px",
					backgroundColor: "white",
				}}
			>
				<Typography variant="h2" sx={{ margin: "5px" }}>
					Availabe Properties
				</Typography>
			</Box>
			<Box
				width={"76vw"}
				sx={{
					display: "grid",
					marginTop: "30px",
					gridColumn: "3",
					// gridGap: "10px",
					gridTemplateColumns: "1fr 1fr 1fr",
					// paddingX:"3%",
					marginLeft: "-25px",
				}}
			>
				{data.map((item) => (
					<ListingItem {...item} key={item.id} />
				))}
			</Box>
		</Box>
	);
};

export default Properties;
