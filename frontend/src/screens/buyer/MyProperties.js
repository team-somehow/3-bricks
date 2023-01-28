import React from "react";
import { auth } from "../../config/firebase";
import { Box, Typography } from "@mui/material";
import ListingMyItem from "../../components/property/ListingMyItem";
import { db } from "../../config/firebase.js";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";

const MyProperties = () => {
    const [data, setData] = useState([]);
    useEffect(() => {
        const getProperties = async () => {
            const snapshot = await getDocs(collection(db, "ListedProperties"));
            let tData = [];
            snapshot.forEach((doc) => {
                console.log(doc.data());
                if (doc.data().ownerId === auth.currentUser.uid) {
                    tData.push({ ...doc.data(), id: doc.id });
                } else {
                    for (
                        let i = 0;
                        i < doc.data().purchaseRequests.length;
                        i++
                    ) {
                        let temp = doc.data().purchaseRequests[i];
                        if (
                            // temp.approved === true &&
                            temp.uid === auth.currentUser.uid
                        ) {
                            tData.push({
                                ...doc.data(),
                                id: doc.id,
                                maiKhareedSakta:
                                    temp.approved === true ? true : false,
                            });
                        }
                    }
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
                    width: "80%",
                    textAlign: "center",
                    borderRadius: "8px",
                    paddingY: "2px",
                    backgroundColor: "white",
                }}
            >
                <Typography variant="h2">My Properties</Typography>
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
                    <ListingMyItem {...item} key={item.id} />
                ))}
            </Box>
        </Box>
    );
};

export default MyProperties;
