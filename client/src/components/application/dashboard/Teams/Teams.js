import { useRef, useState, useContext } from "react";
import {
	Box,
	Breadcrumbs,
	Typography,
	makeStyles,
	Link,
	Button,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import TeamCard from "components/subComponents/TeamCard";
import DialogForm from "components/subComponents/DialogForm";
import { useGetFetch } from "customHooks/useFetch";
import TeamCreationForm from "components/forms/TeamCreationForm";
import PropTypes from "prop-types";
import {
	Link as RouterLink,
	Switch,
	Route,
	useRouteMatch,
} from "react-router-dom";
import TeamPage from "./TeamPage";
import ProjectContext from "contexts/ProjectContext";
const useStyles = makeStyles((theme) => ({
	root: {
		minWidth: "15rem",
	},
	toolbar: theme.mixins.toolbar,
}));

function TeamComponentList(teamList) {
	let match = useRouteMatch();
	return (
		<>
			{teamList.length
				? teamList.map((item) => {
						return (
							<TeamCard
								linkTo={`${match.path}/${item.id}`}
								width="50ch"
								key={item.id}
								{...item}
							/>
						);
				  })
				: null}
		</>
	);
}

export default function Teams(props) {
	const currentProject = useContext(ProjectContext);
	let match = useRouteMatch();
	const classes = useStyles();
	const [openTeamCreation, setOpenTeamCreation] = useState(false);
	const getParams = useRef({ project_id: currentProject.projectId });
	const { status, receivedData, error, isLoading, isResolved, isRejected } =
		useGetFetch("api/teams/", getParams.current);

	function openTeamCreationForm() {
		setOpenTeamCreation(true);
	}
	function handleCancel() {
		setOpenTeamCreation(false);
	}
	return (
		<>
			<Switch>
				<Route path={`${match.path}/:teamId`}>
					<TeamPage />
				</Route>
				<Route path={`${match.path}`}>
					<DialogForm
						title="Add new team"
						open={openTeamCreation}
						onClose={handleCancel}
					>
						<TeamCreationForm projectId={props.projectId} />
					</DialogForm>
					<Box
						display="flex"
						flexWrap="wrap"
						mb={2}
						justifyContent="space-between"
						alignItems="baseline"
					>
						<Breadcrumbs aria-label="breadcrumb">
							<Link color="inherit" href="/">
								Material-UI
							</Link>
							<Link color="inherit" href="/getting-started/installation/">
								Core
							</Link>
							<Typography color="textPrimary">Breadcrumb</Typography>
						</Breadcrumbs>
						<Button
							variant="contained"
							color="primary"
							onClick={() => openTeamCreationForm()}
						>
							<Typography>Add new team</Typography>
						</Button>
					</Box>

					<Box
						display="flex"
						justifyContent="center"
						flexWrap="wrap"
						style={{ gap: "1rem" }}
					>
						{isResolved ? TeamComponentList(receivedData) : null}
						{isLoading ? "loading" : null}
						{isRejected ? <Alert severity="error">{error} </Alert> : null}
					</Box>
				</Route>
			</Switch>
		</>
	);
}
