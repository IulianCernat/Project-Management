import { useState, useEffect } from "react";
import {
	Typography,
	AppBar,
	Toolbar,
	IconButton,
	Hidden,
	Box,
	makeStyles,
	CircularProgress,
} from "@material-ui/core";
import {
	Switch,
	Route,
	useRouteMatch,
	useParams,
	Redirect,
} from "react-router-dom";
import { Menu } from "@material-ui/icons";
import CustomDrawer from "components/subComponents/CustomDrawer";
import Teams from "./teams/Teams";
import Sprints from "./sprints/Sprints";
import Backlog from "./backlog/Backlog";
import { ProjectProvider } from "contexts/ProjectContext";
import AppMenuNav from "components/subComponents/AppMenuNav";
import { useGetFetch } from "customHooks/useFetch";
import { useAuth } from "contexts/AuthContext";
import { deepPurple } from "@material-ui/core/colors";
import Overview from "./Overview";
import { Scrollbars } from "react-custom-scrollbars-2";

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
		[theme.breakpoints.up("md")]: {
			padding: theme.spacing(4),
		},
		[theme.breakpoints.down("md")]: {
			paddingLeft: "1px",
			paddingRight: "1px",
			paddingTop: theme.spacing(1),
		},
	},
	toolbar: theme.mixins.toolbar,
}));

export default function Dashboard(props) {
	const { currentUser } = useAuth();
	let match = useRouteMatch();
	const { projectId } = useParams();
	const classes = useStyles();
	const [mobileOpen, setmobileOpen] = useState(false);
	const [getRoleHeaders, setGetRoleHeaders] = useState();
	const [startGetroleFetch, setStartGetRoleFetch] = useState(false);

	useEffect(() => {
		currentUser.getIdToken().then((idToken) => {
			setGetRoleHeaders({ Authorization: idToken });
			setStartGetRoleFetch(true);
		});
	}, []);

	const {
		status: getRoleStatus,
		receivedData: getRoleReceivedData,
		error: getRoleError,
		isLoading: isLoadingGetRole,
		isResolved: isResolvedGetRole,
		isRejected: isRejectedGetRole,
	} = useGetFetch(
		`api/projects/${projectId}/role`,
		null,
		startGetroleFetch,
		false,
		getRoleHeaders
	);

	const {
		status: getProjectStatus,
		receivedData: getProjectReceivedData,
		error: getProjectError,
		isLoading: isLoadingGetProject,
		isResolved: isResolvedGetProject,
		isRejected: isRejectedGetProject,
	} = useGetFetch(`api/projects/${projectId}`);

	function handleDrawerToggle() {
		setmobileOpen(!mobileOpen);
	}
	return (
		<>
			{isLoadingGetProject && (
				<Box display="flex" alignItems="center" justifyContent="center">
					<CircularProgress />
				</Box>
			)}
			{isResolvedGetRole && isResolvedGetProject && (
				<Box display="flex">
					<AppBar className={classes.appBar} position="fixed">
						<Toolbar>
							<Box
								width="100%"
								display="flex"
								alignItems="center"
								justifyContent="space-between"
							>
								<Box>
									<Hidden mdUp>
										<IconButton color="inherit" onClick={handleDrawerToggle}>
											<Menu />
										</IconButton>
									</Hidden>
								</Box>
								<Box flex="1 1 auto">
									<Typography>{getProjectReceivedData.name}</Typography>
								</Box>

								<Box>
									<AppMenuNav />
								</Box>
							</Box>
						</Toolbar>
					</AppBar>
					<CustomDrawer
						drawerWidth={drawerWidth}
						mobileOpen={mobileOpen}
						handleDrawerToggle={handleDrawerToggle}
					/>
					<Scrollbars heightRelativeToParent autoHeight autoHeightMax={1920}>
						<Box className={classes.content} bgcolor="grey.200" height="100vh">
							<div className={classes.toolbar} />
							<ProjectProvider
								projectId={Number(projectId)}
								currentUserRole={getRoleReceivedData.user_role}
							>
								<Switch>
									<Route
										exact
										path={`${match.url}`}
										render={() => {
											return isRejectedGetRole ? (
												<Redirect to="/" />
											) : (
												<Redirect to={`${match.url}/overview`} />
											);
										}}
									/>
									<Route path={`${match.url}/overview`}>
										<Overview />
									</Route>
									<Route path={`${match.url}/teams`}>
										<Teams />
									</Route>
									<Route path={`${match.url}/sprints`}>
										<Sprints />
									</Route>
									<Route path={`${match.url}/backlog`} component={Backlog} />
								</Switch>
							</ProjectProvider>
						</Box>
					</Scrollbars>
				</Box>
			)}
		</>
	);
}
