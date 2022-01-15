import { useState, useEffect, useRef, useCallback } from "react";
import { Typography, Button, Box, Paper, makeStyles, LinearProgress } from "@material-ui/core";
import { useParams } from "react-router-dom";
import { useGetFetch, useDeleteFetch } from "customHooks/useFetch";
import { Alert } from "@material-ui/lab";
import UserProfile from "components/subComponents/UserProfileCard";
import { indigo } from "@material-ui/core/colors";
import DialogForm from "components/subComponents/DialogForm";
import AddingDevsForm from "components/forms/AddingDevsForm";
import ChangingScrumMasterForm from "components/forms/ChangingScrumMasterForm";
import DevelopersList from "./DevelopersList";
import { useProjectContext } from "contexts/ProjectContext";
import { useAuth } from "contexts/AuthContext";

const useStyles = makeStyles((theme) => ({
	membersTab: {
		display: "flex",
		flexFlow: "wrap row",
		gap: theme.spacing(6),
	},
}));

const scrumMasterChangeRestrictionForRoles = ["developer", "scrumMaster"];
const developersAdditionRestrictionForRoles = ["productOwner", "developer"];

export default function TeamMembers() {
	const { additionalUserInfo } = useAuth();
	const classes = useStyles();
	const { projectId, currentUserRole } = useProjectContext();
	const { teamId } = useParams();

	const [openDevAddition, setOpenDevAddition] = useState(false);
	const [openScrumMasterChangingFrom, setOpenScrumMasterChangingFrom] = useState(false);
	const getParams = useRef({ team_id: teamId });

	const [teamDevelopers, setTeamDevelopers] = useState([]);
	const [developerUriToDelete, setDeveloperUriToDelete] = useState();
	const [scrumMaster, setScrumMaster] = useState();
	const teamMembersFetchingStatus = useGetFetch(`api/teams_members/`, getParams.current);
	const devDeletionStatus = useDeleteFetch(developerUriToDelete);

	function openDevsAdditionForm() {
		setOpenDevAddition(true);
	}

	function openScrumMasterChangingForm() {
		setOpenScrumMasterChangingFrom(true);
	}

	function handleCancelOpenScrumMasterChanging() {
		setOpenScrumMasterChangingFrom(false);
	}

	function handleCancelDevAddition() {
		setOpenDevAddition(false);
	}

	const handleDevDeletion = useCallback((deletedDevId) => {
		setDeveloperUriToDelete(`api/teams_members/${deletedDevId}`);
	}, []);

	const insertNewTeamDevs = useCallback((newTeamDevsObjs) => {
		handleCancelDevAddition();
		setTeamDevelopers((prevTeamDevelopersList) => [...newTeamDevsObjs, ...prevTeamDevelopersList]);
	}, []);

	useEffect(() => {
		if (teamMembersFetchingStatus.isResolved) {
			setScrumMaster(teamMembersFetchingStatus.receivedData[0]);
			setTeamDevelopers(teamMembersFetchingStatus.receivedData.slice(1));
		}
	}, [teamMembersFetchingStatus]);

	useEffect(() => {
		if (!developerUriToDelete) return;
		if (devDeletionStatus.isResolved) {
			const deletedDevId = Number(developerUriToDelete.split("/").pop());
			setTeamDevelopers((prevTeamDevs) => prevTeamDevs.filter((item) => item.id !== deletedDevId));
			setDeveloperUriToDelete(null);
		}
	}, [devDeletionStatus, developerUriToDelete]);

	return (
		<Box className={classes.membersTab}>
			{teamMembersFetchingStatus.isLoading ? <LinearProgress style={{ width: "100%" }} /> : null}

			{teamMembersFetchingStatus.isRejected ? (
				<Alert severity="error">{teamMembersFetchingStatus.error} </Alert>
			) : null}

			<DialogForm title="Add new team member" open={openDevAddition} onClose={handleCancelDevAddition}>
				<AddingDevsForm teamId={teamId} insertNewTeamDevs={insertNewTeamDevs} projectId={projectId} />
			</DialogForm>
			{scrumMaster ? (
				<DialogForm
					title="Change Scrum master"
					open={openScrumMasterChangingFrom}
					onClose={handleCancelOpenScrumMasterChanging}
				>
					<ChangingScrumMasterForm
						teamId={teamId}
						projectId={projectId}
						currentScrumMasterId={scrumMaster.user_id}
						setNewScrumMaster={setScrumMaster}
					/>
				</DialogForm>
			) : null}

			<Box flex="0 0 auto">
				<Paper elevation={2}>
					<Box
						style={{ gap: "1rem" }}
						display="flex"
						flexWrap="wrap"
						mb={2}
						p={1}
						// bgcolor={indigo["A100"]}
					>
						<Typography variant="h6">Scrum Master</Typography>

						<Button
							size="small"
							variant="contained"
							color="primary"
							onClick={() => {
								openScrumMasterChangingForm();
							}}
							disabled={scrumMasterChangeRestrictionForRoles.includes(currentUserRole)}
						>
							<Typography>Change</Typography>
						</Button>
					</Box>
				</Paper>
				<Box display="flex" justifyContent="center">
					{scrumMaster ? <UserProfile width={"30ch"} {...scrumMaster} /> : null}
				</Box>
			</Box>
			<Box flex={"1 1 0"}>
				<Paper elevation={2}>
					<Box display="flex" justifyContent="space-between" mb={2} p={1}>
						<Typography variant="h6">Developers</Typography>
						<Button
							size="small"
							variant="contained"
							color="primary"
							onClick={() => {
								openDevsAdditionForm();
							}}
							disabled={
								developersAdditionRestrictionForRoles.includes(currentUserRole) ||
								!(scrumMaster.user_id === additionalUserInfo.id)
							}
						>
							<Typography>Add new developers</Typography>
						</Button>
					</Box>
				</Paper>
				<Box
					style={{
						gap: "1rem",
					}}
					bgcolor="blueGrey.500"
					display="flex"
					justifyContent="flex-start"
					flexWrap="wrap"
				>
					{teamDevelopers.length ? (
						<DevelopersList
							currentUserRole={currentUserRole}
							developers={teamDevelopers}
							isCurrentUserScrumMasterOfThisTeam={scrumMaster.user_id === additionalUserInfo.id}
							handleDevDeletion={handleDevDeletion}
						/>
					) : null}
				</Box>
			</Box>
		</Box>
	);
}
