import { Paper, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { Outlet } from "react-router-dom";
import metamaskLogo from "../../assets/metamaskLogo.png";

const Wrapper = () => {
    if (typeof window.ethereum != "undefined") {
        return <Outlet />;
    } else {
        return (
            <Box
                sx={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap:5,
                    flexDirection:{xs:'column',md:"row"}
                }}
            >
                <img
                    src={metamaskLogo}
                    style={{
                        width: "20%",
                    }}
                />
                <Typography sx={{
                    fontSize:{xs:"1rem",md:"2rem"}
                }}>Please install Metamask</Typography>
            </Box>
        );
    }
};

export default Wrapper;
