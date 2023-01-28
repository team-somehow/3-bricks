import { Button, Typography, Paper } from "@mui/material";
import { Box } from "@mui/system";
import { useNavigate } from "react-router-dom";

const ListingItem = (props) => {
	const { name, price, images, id, city, propertyType } = props;
	const navigate = useNavigate();
	return (
		<Paper
			sx={{
				padding: 4,
				my: 3,
				maxWidth: "23vw",
				// maxHeight: "500px",
				paddingBottom: "5px",
				borderRadius: "15px",
				cursor: "pointer",
				"&:hover": {
					// transitionDelay: "2s",
					boxShadow: "-2px 6px 20px 5px rgba(0,0,0,0.3)",
				},
			}}
			onClick={() => {
				navigate(`/buyer/browse/${id}`);
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
							// marginBottom: "20px",
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
						<Typography fontSize={"2.3rem"}>{name}</Typography>
						<Typography fontSize={"1.1rem"} sx={{ marginBottom: "20px" }}>
							{propertyType}
						</Typography>

						<Typography variant="h5" sx={{ marginBottom: "14px" }}>
							Matic {price}
						</Typography>

						<Typography variant="body">
							{/* <LocationOnIcon /> */}
							<img
								src="/location.png"
								style={{ width: "20px", marginRight: "5px" }}
							/>
							{city}
						</Typography>
					</Box>
				</Box>
			</Box>
		</Paper>
	);
};

export default ListingItem;
