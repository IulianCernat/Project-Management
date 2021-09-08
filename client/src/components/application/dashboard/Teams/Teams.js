import { useRef, useState, useEffect } from "react";
import {
	Box,
	Typography,
	makeStyles,
	Button,
	CircularProgress,
	LinearProgress,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import TeamCard from "components/subComponents/TeamCard";
import DialogForm from "components/subComponents/DialogForm";
import { useGetFetch, useDeleteFetch } from "customHooks/useFetch";
import TeamCreationForm from "components/forms/TeamCreationForm";
import PropTypes from "prop-types";
import { Switch, Route, useRouteMatch } from "react-router-dom";
import TeamPage from "./TeamPage";
import { useProjectContext } from "contexts/ProjectContext";

const UIRestrictionForRoles = ["developer", "scrumMaster"];

TeamComponentList.propTypes = {
	teamList: PropTypes.arrayOf(PropTypes.object).isRequired,
	handleDelete: PropTypes.func.isRequired,
	renderTeamCardActions: PropTypes.bool.isRequired,
};
function TeamComponentList({ teamList, handleDelete, renderTeamCardActions }) {
	let match = useRouteMatch();
	return (
		<>
			{teamList.length
				? teamList.map((item) => {
						return (
							<TeamCard
								linkTo={`${match.path}/${item.id}`}
								key={item.id}
								{...item}
								renderActions={renderTeamCardActions}
								handleDelete={handleDelete}
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
	const [openTeamCreation, setOpenTeamCreation] = useState(false);
	const [startFetchingTeams, setStartFetchingTeams] = useState(true);
	const [teamCreationSuccess, setTeamCreationSuccess] = useState(false);
	const [teamIdToBeDeleted, setTeamIdToBeDeleted] = useState();
	const [teamsList, setTeamsList] = useState();

	const getParams = useRef({ project_id: projectId });
	const { receivedData, error, isLoading, isResolved, isRejected } = useGetFetch(
		"api/teams/",
		getParams.current,
		startFetchingTeams
	);

	const { isResolved: isResolvedDeleteTeam } = useDeleteFetch(
		teamIdToBeDeleted ? `api/teams/${teamIdToBeDeleted}` : null
	);

	function openTeamCreationForm() {
		setOpenTeamCreation(true);
	}
	function handleCancel() {
		setOpenTeamCreation(false);
	}

	function handleTeamDeletion(teamId) {
		setTeamIdToBeDeleted(teamId);
	}
	useEffect(() => {
		if (isResolved) setTeamsList(receivedData);
	}, [isResolved, receivedData]);

	useEffect(() => {
		if (!teamIdToBeDeleted) return;

		setTeamsList((projectsList) =>
			projectsList.filter((item) => item.id !== teamIdToBeDeleted)
		);
	}, [isResolvedDeleteTeam]);

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
		<Box mt={1}>
			<Switch>
				<Route path={`${match.path}/:teamId`}>
					<TeamPage />
				</Route>

				<Route path={`${match.path}`}>
					<Box mb={1}>
						<Button
							variant="contained"
							color="primary"
							onClick={() => openTeamCreationForm()}
							disabled={UIRestrictionForRoles.includes(currentUserRole)}
						>
							<Typography>Add new team</Typography>
						</Button>
					</Box>

					<DialogForm
						title="Add new team"
						open={openTeamCreation}
						onClose={handleCancel}
						maxWidth="sm"
					>
						<TeamCreationForm
							setTeamCreationSuccess={setTeamCreationSuccess}
							projectId={projectId}
						/>
					</DialogForm>

					<Box
						display="flex"
						justifyContent="flex-start"
						flexWrap="wrap"
						alignItems="flex-start"
						alignContent="center"
						style={{ gap: "1rem" }}
						p={1}
					>
						{isResolved && teamsList ? (
							<TeamComponentList
								teamList={teamsList}
								handleDelete={handleTeamDeletion}
								renderTeamCardActions={
									!UIRestrictionForRoles.includes(currentUserRole)
								}
							/>
						) : null}
						{isLoading ? <LinearProgress style={{ width: "100%" }} /> : null}
						{isRejected ? <Alert severity="error">{error} </Alert> : null}
					</Box>
				</Route>
			</Switch>
		</Box>
	);
}
