import { useState, useEffect } from "react";
import {
	Typography,
	AppBar,
	Toolbar,
	IconButton,
	Hidden,
	Box,
	makeStyles,
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
			padding: theme.spacing(6),
		},
		[theme.breakpoints.down("md")]: {
			paddingTop: theme.spacing(2),
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
			{(isRejectedGetRole || isResolvedGetRole) && (
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
									<Typography variant="h6">
										{getProjectReceivedData.name}
									</Typography>
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
					<Box className={classes.content}>
						<div className={classes.toolbar} />
						<ProjectProvider
							projectId={Number(projectId)}
							currentUserRole={getRoleReceivedData?.user_role}
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
									<Overview project={getProjectReceivedData} />
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
				</Box>
			)}
		</>
	);
}
