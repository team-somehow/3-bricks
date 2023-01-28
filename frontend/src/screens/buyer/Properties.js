import React from "react";
import { Paper, Typography } from "@mui/material";
import { Box } from "@mui/system";
import ListingItem from "../../components/property/ListingItem";
import { db } from "../../config/firebase.js";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import SearchInput from "../../components/property/SearchInput";

const Properties = () => {
    const [data, setData] = useState([]);
    const [tempData, setTempData] = useState([]);

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
            setTempData(tData);
        };
        getProperties();
    }, []);
    const updateProperties = (e) => {
        const searchQuery = e.target.value;
        if (searchQuery.trim().length == 0) setData(tempData);
        else
            setData(
                tempData.filter((element) => element.name.includes(searchQuery))
            );
    };
    return (
        <Box m={5}>
            <Box
                component={Paper}
                sx={{
                    width: "100%",
                    textAlign: "center",
                    borderRadius: "8px",
                    paddingY: "2px",
                    backgroundColor: "white",
                }}
            >
                <Typography variant="h2" sx={{ margin: "5px" }}>
                    Browse Properties
                </Typography>
            </Box>
            <SearchInput updateProperties={updateProperties} />
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
