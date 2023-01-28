import { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import { BrowserRouter, Route, RouterProvider, Routes } from "react-router-dom";
import { auth } from "./config/firebase";
import Center from "./components/utils/Center";
import AuthChecker from "./components/auth/AuthChecker";
import router from "./config/router";
import { SnackbarProvider } from "notistack";

function App() {
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		auth.onAuthStateChanged((user) => {
			if (user) {
				console.info("User detected.");
			} else {
				console.info("No user detected");
			}
			setLoading(false);
		});
	}, []);

	if (loading)
		return (
			<Center>
				<CircularProgress />
			</Center>
		);

	return (
		<div>
			<SnackbarProvider>
				<RouterProvider router={router} />
			</SnackbarProvider>
		</div>
	);
}

export default App;
