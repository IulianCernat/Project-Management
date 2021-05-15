import { useState } from "react";
import {
	Typography,
	AppBar,
	Toolbar,
	IconButton,
	Hidden,
	Box,
	makeStyles,
} from "@material-ui/core";
import { Switch, Route, useRouteMatch } from "react-router-dom";
import { Menu } from "@material-ui/icons";
import CustomDrawer from "../../subComponents/CustomDrawer";
import Teams from "./Teams";
import SearchField from "../../forms/SearchField";
const drawerWidth = "18rem";

const useStyles = makeStyles((theme) => ({
	appBar: {
		[theme.breakpoints.up("md")]: {
			width: `calc(100% - ${drawerWidth})`,
			marginLeft: drawerWidth,
		},
	},
	content: {
		width: "100%",
		padding: theme.spacing(6),
	},
	toolbar: theme.mixins.toolbar,
}));

export default function Dashboard() {
	let match = useRouteMatch();
	const classes = useStyles();
	const [mobileOpen, setmobileOpen] = useState(false);

	function handleDrawerToggle() {
		setmobileOpen(!mobileOpen);
	}

	return (
		<Box display="flex">
			<AppBar className={classes.appBar} position="fixed">
				<Toolbar>
					<Hidden mdUp>
						<IconButton color="inherit" onClick={handleDrawerToggle}>
							<Menu />
						</IconButton>
					</Hidden>
					<Typography variant="h6" noWrap>
						Responsive drawer
					</Typography>
				</Toolbar>
			</AppBar>
			<CustomDrawer
				drawerWidth={drawerWidth}
				mobileOpen={mobileOpen}
				handleDrawerToggle={handleDrawerToggle}
			/>
			<main className={classes.content}>
				<div className={classes.toolbar} />

				<Switch>
					<Route path={`${match.path}/teams`}>
						<Teams />
					</Route>
					<Route path={`${match.path}/overview`}>hello world</Route>
				</Switch>
			</main>
		</Box>
	);
}
