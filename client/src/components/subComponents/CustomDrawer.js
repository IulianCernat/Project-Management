import {
	Drawer,
	Hidden,
	makeStyles,
	Box,
	Typography,
	Divider,
} from "@material-ui/core";
import DrawerListItems from "./DrawerListItems";
import PropTypes from "prop-types";

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
	toolbarSpace: theme.mixins.toolbar,
}));

CustomDrawer.propTypes = {
	drawerWidth: PropTypes.string.isRequired,
	handleDrawerToggle: PropTypes.func.isRequired,
	mobileOpen: PropTypes.bool.isRequired,
};
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
					classes={{
						paper: classes.drawerPaper,
					}}
					variant="permanent"
					open
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
				</Drawer>
			</Hidden>
		</nav>
	);
}
