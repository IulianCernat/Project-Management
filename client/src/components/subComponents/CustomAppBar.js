import {
	AppBar,
	Toolbar,
	Box,
	Hidden,
	IconButton,
	Typography,
} from "@material-ui/core";
import { Menu } from "@material-ui/icons";
import PropTypes from "prop-types";
import AppMenuNav from "./AppMenuNav";
import { makeStyles } from "@material-ui/core/styles";
const useStyles = makeStyles((theme) => ({
	appBar: (props) => ({
		[theme.breakpoints.up("md")]: {
			transition: theme.transitions.create("width", "margin", {
				easing: theme.transitions.easing.sharp,
				duration: theme.transitions.duration.leavingScreen,
			}),
			width: `calc(100% - ${props.drawerWidth})`,
			marginLeft: props.drawerWidth,
		},
	}),

	appBarForMinimizedDrawer: {
		transition: theme.transitions.create("width", "margin", {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
		width: `calc(100% - ${theme.spacing(7)})`,
		marginLeft: theme.spacing(7),
	},
}));

CustomAppBar.propTypes = {
	drawerWidth: PropTypes.string.isRequired,
	handleDrawerToggle: PropTypes.func.isRequired,
	projectName: PropTypes.string.isRequired,
	minimizedDrawer: PropTypes.bool.isRequired,
};
export default function CustomAppBar(props) {
	const classes = useStyles({ drawerWidth: props.drawerWidth });
	return (
		<AppBar
			className={
				props.minimizedDrawer
					? classes.appBarForMinimizedDrawer
					: classes.appBar
			}
			position="fixed"
		>
			<Toolbar>
				<Box
					width="100%"
					display="flex"
					alignItems="center"
					justifyContent="space-between"
				>
					<Box>
						<Hidden mdUp>
							<IconButton color="inherit" onClick={props.handleDrawerToggle}>
								<Menu />
							</IconButton>
						</Hidden>
					</Box>
					<Hidden xsDown>
						<Box flex="1 1 auto">
							<Typography variant="subtitle2">
								{props.projectName.length >= 20
									? props.projectName.slice(0, 20) + "..."
									: props.projectName}
							</Typography>
						</Box>
					</Hidden>

					<Box>
						<AppMenuNav />
					</Box>
				</Box>
			</Toolbar>
		</AppBar>
	);
}
