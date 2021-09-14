import { useState, useEffect } from "react";
import { Box } from "@material-ui/core";
import { Switch, Route, useRouteMatch, useParams, Redirect } from "react-router-dom";
import { Alert } from "@material-ui/lab";
import { makeStyles } from "@material-ui/core/styles";
import CustomAppBar from "components/subComponents/CustomAppBar";
import CustomDrawer from "components/subComponents/CustomDrawer";
import Teams from "./teams/Teams";
import Sprints from "./sprints/Sprints";
import Backlog from "./backlog/Backlog";
import Overview from "./overview/Overview";
import { ProjectProvider } from "contexts/ProjectContext";
import { useGetFetch } from "customHooks/useFetch";
import { useAuth } from "contexts/AuthContext";
import { ReactComponent as GearsSVG } from "images/gears.svg";
import gearsAnimation from "styles/gearsAnimation.css";

const drawerWidth = "18rem";

const useStyles = makeStyles((theme) => ({
	content: {
		backgroundColor: "#BDDAF2",
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

export default function Dashboard() {
	const { currentUser } = useAuth();
	let match = useRouteMatch();
	const { projectId } = useParams();
	const classes = useStyles();
	const [mobileOpen, setmobileOpen] = useState(false);
	const [minimizedDrawer, setMinimizedDrawer] = useState(false);
	const [getRoleHeaders, setGetRoleHeaders] = useState();
	const [startGetroleFetch, setStartGetRoleFetch] = useState(false);

	useEffect(() => {
		currentUser.getIdToken().then((idToken) => {
			setGetRoleHeaders({ Authorization: idToken });
			setStartGetRoleFetch(true);
		});
	}, [currentUser]);

	const {
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
			{isRejectedGetProject && <Alert severity="error">{getProjectError}</Alert>}
			{isRejectedGetRole && <Alert severity="error">{getRoleError}</Alert>}
			{(isLoadingGetProject || isLoadingGetRole) && (
				<Box
					display="flex"
					alignItems="center"
					justifyContent="center"
					position="absolute"
					style={{
						position: "absolute",
						top: "50%",
						left: "50%",
						transform: "translate(-50%, -50%)",
					}}
				>
					<GearsSVG className="gears" />
				</Box>
			)}
			{isResolvedGetRole && isResolvedGetProject && (
				<Box display="flex">
					<CustomAppBar
						drawerWidth={drawerWidth}
						handleDrawerToggle={handleDrawerToggle}
						projectName={getProjectReceivedData.name}
						minimizedDrawer={minimizedDrawer}
					/>
					<CustomDrawer
						drawerWidth={drawerWidth}
						mobileOpen={mobileOpen}
						handleDrawerToggle={handleDrawerToggle}
						setMinimizedDrawer={setMinimizedDrawer}
					/>

					<Box className={classes.content} bgcolor="grey.200" minHeight="100vh">
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
				</Box>
			)}
		</>
	);
}
