import { useState } from "react";
import {
	Drawer,
	Hidden,
	Box,
	Typography,
	Divider,
	IconButton,
} from "@material-ui/core";
import clsx from "clsx";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import DrawerListItems from "./DrawerListItems";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
	drawerPaper: {
		width: (props) => props.width,
	},

	drawerOpen: {
		[theme.breakpoints.up("md")]: {
			width: (props) => props.width,
		},
		transition: theme.transitions.create("width", {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
	},

	drawerClose: {
		transition: theme.transitions.create("width", {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
		width: theme.spacing(7),
		overflow: "hidden",
	},

	toolbarSpace: theme.mixins.toolbar,
}));

CustomDrawer.propTypes = {
	drawerWidth: PropTypes.string.isRequired,
	handleDrawerToggle: PropTypes.func.isRequired,
	mobileOpen: PropTypes.bool.isRequired,
	setMinimizedDrawer: PropTypes.func.isRequired,
};
export default function CustomDrawer(props) {
	const classes = useStyles({ width: props.drawerWidth });
	const [minimizedDrawer, setMinimizedDrawer] = useState(false);
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
					<div
						role="presentation"
						onClick={() => {
							props.handleDrawerToggle();
						}}
						onKeyDown={() => {
							props.handleDrawerToggle();
						}}
					>
						<Box
							display="flex"
							alignItems="center"
							justifyContent="center"
							className={classes.toolbarSpace}
							bgcolor="grey.200"
						>
							<Typography color="primary" variant="h6">
								Dashboard
							</Typography>
						</Box>
						<Divider />
						<DrawerListItems />
					</div>
				</Drawer>
			</Hidden>

			{/* Desktop Drawer */}
			<Hidden smDown>
				<Drawer
					className={clsx(classes.drawer, {
						[classes.drawerOpen]: !minimizedDrawer,
						[classes.drawerClose]: minimizedDrawer,
					})}
					classes={{
						paper: clsx({
							[classes.drawerOpen]: !minimizedDrawer,
							[classes.drawerClose]: minimizedDrawer,
						}),
					}}
					variant="permanent"
				>
					<Box
						display="flex"
						alignItems="center"
						justifyContent="center"
						className={classes.toolbarSpace}
						bgcolor="grey.200"
					>
						{!minimizedDrawer ? (
							<>
								<Typography color="primary" variant="h6">
									Dashboard
								</Typography>
								<IconButton
									onClick={() => {
										props.setMinimizedDrawer(true);
										setMinimizedDrawer(true);
									}}
								>
									<ChevronLeftIcon />
								</IconButton>
							</>
						) : (
							<IconButton
								onClick={() => {
									props.setMinimizedDrawer(false);
									setMinimizedDrawer(false);
								}}
							>
								<ChevronRightIcon />
							</IconButton>
						)}
					</Box>
					<Divider />

					<DrawerListItems />
				</Drawer>
			</Hidden>
		</nav>
	);
}
