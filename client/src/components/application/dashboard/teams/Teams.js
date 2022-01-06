import { useRef, useState, useEffect, useCallback } from "react";
import { Box, Typography, makeStyles, Button, CircularProgress, LinearProgress } from "@material-ui/core";
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
	handleUpdate: PropTypes.func.isRequired,
	renderTeamCardActions: PropTypes.bool.isRequired,
};
function TeamComponentList({ teamList, handleDelete, handleUpdate, renderTeamCardActions }) {
	let match = useRouteMatch();
	return (
		<>
			{teamList.length
				? teamList.map((item) => {
						return (
							<Box key={item.id} maxWidth="50ch" flex="1 1 40ch">
								<TeamCard
									linkTo={`${match.path}/${item.id}`}
									{...item}
									renderActions={renderTeamCardActions}
									handleDelete={handleDelete}
									handleUpdate={handleUpdate}
								/>
							</Box>
						);
				  })
				: null}
		</>
	);
}

export default function Teams() {
	const { currentUserRole, projectId } = useProjectContext();
	let match = useRouteMatch();
	const [openTeamCreation, setOpenTeamCreation] = useState(false);
	const [teamIdToBeDeleted, setTeamIdToBeDeleted] = useState();
	const [teamsList, setTeamsList] = useState([]);
	const [performTeamUpdate, setPerformTeamUpdate] = useState(false);
	const [teamUpdateData, setTeamUpdateData] = useState();
	const getParams = useRef({ project_id: projectId });
	const getTeamsFetchStatus = useGetFetch("api/teams/", getParams.current);

	const deleteTeamStatus = useDeleteFetch(teamIdToBeDeleted ? `api/teams/${teamIdToBeDeleted}` : null);

	function openTeamCreationForm() {
		setOpenTeamCreation(true);
	}
	function handleCancelTeamCreation() {
		setPerformTeamUpdate(false);
		setTeamUpdateData(null);
		setOpenTeamCreation(false);
	}

	function handleTeamDeletion(teamId) {
		setTeamIdToBeDeleted(teamId);
	}

	function handleTeamUpdate(teamId) {
		setTeamUpdateData(teamsList.find((item) => item.id === teamId));
		setPerformTeamUpdate(true);
		setOpenTeamCreation(true);
	}

	const insertNewTeam = useCallback((newTeamObj) => {
		handleCancelTeamCreation();
		setTeamsList((prevTeamsList) => [newTeamObj, ...prevTeamsList]);
	}, []);

	const updateTeamsWithNewTeam = useCallback((newUpdatedTeamObj) => {
		setPerformTeamUpdate(false);
		setTeamUpdateData(null);
		setOpenTeamCreation(false);
		setTeamsList((prevProjectsList) => {
			const indexOfUpdatedProject = prevProjectsList.findIndex((item) => item.id === newUpdatedTeamObj.id);
			prevProjectsList[indexOfUpdatedProject] = newUpdatedTeamObj;
			return [...prevProjectsList];
		});
	}, []);

	useEffect(() => {
		if (getTeamsFetchStatus.isResolved) setTeamsList(getTeamsFetchStatus.receivedData);
	}, [getTeamsFetchStatus]);

	useEffect(() => {
		if (deleteTeamStatus.isResolved) {
			setTeamsList((projectsList) => projectsList.filter((item) => item.id !== teamIdToBeDeleted));
			setTeamIdToBeDeleted(null);
		}
	}, [deleteTeamStatus, teamIdToBeDeleted]);

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
						title={performTeamUpdate ? "Update team" : "Add new team"}
						open={openTeamCreation}
						onClose={handleCancelTeamCreation}
						maxWidth="sm"
					>
						<TeamCreationForm
							performTeamUpdate={performTeamUpdate}
							updateTeamsWithNewTeam={updateTeamsWithNewTeam}
							teamUpdateData={teamUpdateData}
							insertNewTeam={insertNewTeam}
							projectId={projectId}
						/>
					</DialogForm>

					<Box
						maxWidth="100%"
						p={3}
						display="flex"
						flexWrap="wrap"
						justifyContent="center"
						alignItems="center"
						style={{ gap: "1rem" }}
					>
						{teamsList.length ? (
							<TeamComponentList
								teamList={teamsList}
								handleDelete={handleTeamDeletion}
								handleUpdate={handleTeamUpdate}
								renderTeamCardActions={!UIRestrictionForRoles.includes(currentUserRole)}
							/>
						) : null}
						{getTeamsFetchStatus.isLoading ? <LinearProgress style={{ width: "100%" }} /> : null}
						{getTeamsFetchStatus.isRejected ? (
							<Alert severity="error">{getTeamsFetchStatus.error} </Alert>
						) : null}
					</Box>
				</Route>
			</Switch>
		</Box>
	);
}
