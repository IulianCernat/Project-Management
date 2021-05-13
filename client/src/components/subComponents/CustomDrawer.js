import { useState } from "react";
import { Drawer, Box, Hidden, makeStyles } from "@material-ui/core";
import DrawerListItems from "./DrawerListItems";

const useStyles = makeStyles((theme) => ({
	drawerPaper: {
		width: (props) => props.width,
	},
	drawer: {
		[theme.breakpoints.up("md")]: {
			width: (props) => props.width,
			flexShrink: 0,
		},
	},
}));

export default function CustomDrawer(props) {
	const classes = useStyles({ width: props.drawerWidth });
	return (
		<nav className={classes.drawer}>
			{/* Mobile Drawer */}
			<Hidden mdUp>
				<Drawer
					classes={{
						paper: classes.drawerPaper,
					}}
					open={props.mobileOpen}
					anchor="left"
					variant="temporary"
					onClose={props.handleDrawerToggle}
				>
					<DrawerListItems />
				</Drawer>
			</Hidden>

			{/* Desktop Drawer */}
			<Hidden smDown>
				<Drawer
					classes={{
						paper: classes.drawerPaper,
					}}
					variant="permanent"
					open
				>
					<DrawerListItems />
				</Drawer>
			</Hidden>
		</nav>
	);
}
