import { Box } from "@mui/system";
import { createBrowserRouter, Outlet } from "react-router-dom";
import Home from "../screens/Home";
import Properties from "../screens/buyer/Properties";
import MyProperties from "../screens/buyer/MyProperties";
import PropertyDetails from "../screens/buyer/PropertyDetails";
import AddProperty from "../screens/seller/AddProperty";
import SellerPropertyDetails from "../screens/seller/SellerPropertyDetails";
import Chat from "../screens/Chat";
import Admin from "../screens/admin/Admin";
import DashboardNavbar from "../components/navbars/DashboardNavbar";
import SellerDashboard from "../components/navbars/SellerDashboard";

import AuthChecker from "../components/auth/AuthChecker";

const router = createBrowserRouter([
	{
		path: "/",

		element: <Home />,
		exact: true,
		errorElement: <div>Hello</div>,
	},
	{
		path: "/buyer",
		element: (
			<Box sx={{ display: "flex" }}>
				<DashboardNavbar />
				<Box>
					<Outlet />
				</Box>
			</Box>
		),
		children: [
			{ path: "/buyer/browse", element: <Properties />, exact: true },
			{
				path: "/buyer/browse/:propertyID",
				element: <PropertyDetails />,
				exact: true,
			},

			{
				path: "/buyer/my",
				element: <MyProperties />,
				exact: true,
			},
		],
	},
	{
		path: "/seller",
		element: (
			<AuthChecker>
				<Box display="flex">
					<SellerDashboard />
					<Outlet/>
				</Box>
			</AuthChecker>
		),
		children: [
			{ path: "/seller/create", exact: true, element: <AddProperty /> },
			{ path: "/seller/my", exact: true, element: <SellerPropertyDetails /> },
		],
	},
	{
		path: "/chat",
		element: <Chat />,
	},
	{
		path: "/admin",
		element: <Admin />,
	},
]);

export default router;
