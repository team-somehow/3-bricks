import React, { useRef, useState, useEffect } from "react";

import { Box, Typography } from "@mui/material";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "../../config/firebase";
import ListingSellerItem from "../../components/property/ListingSellerItem";


function SellerPropertyDetails() {
    const [data, setData] = useState([]);

    useEffect(() => {
        const getProperties = async () => {
            const snapshot = await getDocs(collection(db, "ListedProperties"));
            let tData = [];
            snapshot.forEach((doc) => {
                // console.log(doc.id, " => ", doc.data());
                let temp = doc.data();
                // console.log(temp.ownerId,auth.currentUser.uid)

                if (temp.ownerId === auth.currentUser.uid) {
                    tData.push({ ...doc.data(), id: doc.id });
                }
            });
            setData(tData);
            console.log(tData);
        };
        getProperties();
    }, []);

    return (
        <Box m={5}>
            <Box 
            sx={{
                    width: "70vw",
                    textAlign: "center",
                    borderRadius: "8px",
                    paddingY: "2px",
                    backgroundColor: "white",
                }}>
                <Typography variant="h2">My Property Listings</Typography>
            </Box>
            <Box width={"76vw"}
                sx={{
                    display: "grid",
                    marginTop: "30px",
                    gridColumn: "3",
                    // gridGap: "10px",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    // paddingX:"3%",
                    marginLeft: "-30px"
                }}>
                {data.map((item) => (
                    <ListingSellerItem key={item.id} {...item} />
                ))}
            </Box>
        </Box>
    );
}

export default SellerPropertyDetails;
