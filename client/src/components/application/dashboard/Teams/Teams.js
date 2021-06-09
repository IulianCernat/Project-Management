import { useRef, useState, useEffect } from "react";
import { Box, Typography, makeStyles, Button } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import TeamCard from "components/subComponents/TeamCard";
import DialogForm from "components/subComponents/DialogForm";
import { useGetFetch } from "customHooks/useFetch";
import TeamCreationForm from "components/forms/TeamCreationForm";
import PropTypes from "prop-types";
import { Switch, Route, useRouteMatch } from "react-router-dom";
import TeamPage from "./TeamPage";
import { useProjectContext } from "contexts/ProjectContext";

const useStyles = makeStyles((theme) => ({
	root: {
		minWidth: "15rem",
	},
	toolbar: theme.mixins.toolbar,
}));

const UIRestrictionForRoles = ["developer"];

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
	const { currentUserRole, projectId } = useProjectContext();
	let match = useRouteMatch();
	const classes = useStyles();
	const [openTeamCreation, setOpenTeamCreation] = useState(false);
	const [startFetchingTeams, setStartFetchingTeams] = useState(true);
	const [teamCreationSuccess, setTeamCreationSuccess] = useState(false);

	const getParams = useRef({ project_id: projectId });
	const { status, receivedData, error, isLoading, isResolved, isRejected } =
		useGetFetch("api/teams/", getParams.current, startFetchingTeams);

	function openTeamCreationForm() {
		setOpenTeamCreation(true);
	}
	function handleCancel() {
		setOpenTeamCreation(false);
	}

	useEffect(() => {
		if (teamCreationSuccess) {
			setStartFetchingTeams(true);
			handleCancel();
			setTeamCreationSuccess(false);
		}
	}, [teamCreationSuccess]);

	useEffect(() => {
		if (startFetchingTeams) setStartFetchingTeams(false);
	}, [startFetchingTeams]);

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
						<TeamCreationForm
							setTeamCreationSuccess={setTeamCreationSuccess}
							projectId={projectId}
						/>
					</DialogForm>
					<Box>
						<Button
							variant="contained"
							color="primary"
							onClick={() => openTeamCreationForm()}
							disabled={UIRestrictionForRoles.includes(currentUserRole)}
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
