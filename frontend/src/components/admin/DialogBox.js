import * as React from "react";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
// import IconButton from "@mui/material/IconButton";
// import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";

import Stepper from "@mui/material/Stepper";
import { Box, LinearProgress, Step, StepLabel } from "@mui/material";
import SuccessTick from "../Lottie/SuccessTick";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
        padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
        padding: theme.spacing(1),
    },
}));

function BootstrapDialogTitle(props) {
    const { children, onClose, ...other } = props;

    return (
        <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
            {children}
            {/* {onClose ? (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            ) : null} */}
        </DialogTitle>
    );
}

BootstrapDialogTitle.propTypes = {
    children: PropTypes.node,
    onClose: PropTypes.func.isRequired,
};

const steps = [
    "Uploading Title Deed to IPFS",
    "Transacting with 3 Bricks smart contract",
    "Minting NFT",
    "Success",
];

export default function CustomizedDialogs(props) {
    // const [open, setOpen] = React.useState(props.open);

    const handleClose = (_event, reason) => {
        if (reason && reason === "backdropClick") return;
        props.setOpen(false);
    };

    return (
        <div>
            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={props.open}
            >
                <BootstrapDialogTitle
                    id="customized-dialog-title"
                    onClose={handleClose}
                >
                    <Typography
                        sx={{ textAlign: "center", mb: 4 }}
                        variant="h4"
                    >
                        Minting NFT
                    </Typography>
                </BootstrapDialogTitle>
                <DialogContent>
                    {!props.error ? (
                        <>
                            <Stepper
                                activeStep={props.stepCount}
                                alternativeLabel
                            >
                                {steps.map((label) => (
                                    <Step key={label}>
                                        <StepLabel>{label}</StepLabel>
                                    </Step>
                                ))}
                            </Stepper>
                            {props.stepCount !== 3 ? (
                                <Box sx={{ my: 4 }}>
                                    <LinearProgress />
                                </Box>
                            ) : (
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                    }}
                                >
                                    <SuccessTick />
                                </Box>
                            )}
                        </>
                    ) : (
                        <Typography color={"red"}>{props.error}</Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button
                        autoFocus
                        disabled={props.stepCount !== 3 || props.error}
                        onClick={handleClose}
                        fullWidth
                    >
                        Close
                    </Button>
                </DialogActions>
            </BootstrapDialog>
        </div>
    );
}
