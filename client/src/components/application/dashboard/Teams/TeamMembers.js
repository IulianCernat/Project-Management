import { useState, useEffect, useRef } from "react";
import {
	Typography,
	Button,
	Box,
	Paper,
	makeStyles,
	LinearProgress,
} from "@material-ui/core";
import { useParams } from "react-router-dom";
import { useGetFetch } from "customHooks/useFetch";
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
	const { projectId, currentUserRole } = useProjectContext();
	const { teamId } = useParams();
	const [scrumMasterChangingSuccess, setScrumMasterChangingSuccess] =
		useState(false);
	const [devAdditionSuccess, setDevAdditionSuccess] = useState(false);
	const [startFetchingDevs, setStartFetchingDevs] = useState(true);
	const classes = useStyles();
	const [openDevAddition, setOpenDevAddition] = useState(false);
	const [openScrumMasterChangingFrom, setOpenScrumMasterChangingFrom] =
		useState(false);
	const getParams = useRef({ team_id: teamId });
	const { status, receivedData, error, isLoading, isResolved, isRejected } =
		useGetFetch(`api/teams_members/`, getParams.current, startFetchingDevs);

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

	useEffect(() => {
		if (devAdditionSuccess) {
			setStartFetchingDevs(true);
			handleCancelDevAddition();
			setDevAdditionSuccess(false);
		}
	}, [devAdditionSuccess]);

	useEffect(() => {
		if (scrumMasterChangingSuccess) {
			setStartFetchingDevs(true);
			handleCancelOpenScrumMasterChanging();
			setScrumMasterChangingSuccess(false);
		}
	}, [scrumMasterChangingSuccess]);

	useEffect(() => {
		if (startFetchingDevs) setStartFetchingDevs(false);
	}, [startFetchingDevs]);

	return (
		<Box className={classes.membersTab}>
			{isLoading ? <LinearProgress style={{ width: "100%" }} /> : null}

			{isRejected ? <Alert severity="error">{error} </Alert> : null}

			{isResolved && (
				<>
					<DialogForm
						title="Add new team member"
						open={openDevAddition}
						onClose={handleCancelDevAddition}
					>
						<AddingDevsForm
							teamId={teamId}
							setDevAdditionSuccess={setDevAdditionSuccess}
							projectId={projectId}
						/>
					</DialogForm>
					<DialogForm
						title="Change Scrum master"
						open={openScrumMasterChangingFrom}
						onClose={handleCancelOpenScrumMasterChanging}
					>
						<ChangingScrumMasterForm
							teamId={teamId}
							projectId={projectId}
							currentScrumMasterId={receivedData[0].id}
							setScrumMasterChangingSuccess={setScrumMasterChangingSuccess}
						/>
					</DialogForm>
					<Box flex="0 0 auto">
						<Paper elevation={2}>
							<Box
								style={{ gap: "1rem" }}
								display="flex"
								flexWrap="wrap"
								mb={2}
								p={1}
								bgcolor={indigo["A100"]}
							>
								<Typography variant="h6">Scrum Master</Typography>

								<Button
									variant="contained"
									color="primary"
									onClick={() => {
										openScrumMasterChangingForm();
									}}
									disabled={scrumMasterChangeRestrictionForRoles.includes(
										currentUserRole
									)}
								>
									<Typography>Change</Typography>
								</Button>
							</Box>
						</Paper>
						<Box display="flex" justifyContent="center">
							{receivedData?.length ? (
								<UserProfile width={"30ch"} {...receivedData[0]} />
							) : null}
						</Box>
					</Box>
					<Box flex={"1 1 0"}>
						<Paper elevation={2}>
							<Box
								display="flex"
								justifyContent="space-between"
								mb={2}
								p={1}
								bgcolor={indigo["A100"]}
							>
								<Typography variant="h6">Developers</Typography>
								<Button
									variant="contained"
									color="primary"
									onClick={() => openDevsAdditionForm()}
									disabled={
										developersAdditionRestrictionForRoles.includes(
											currentUserRole
										) || !(receivedData[0].user_id === additionalUserInfo.id)
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
							flexWrap="wrap"
						>
							{isResolved && receivedData?.length ? (
								<DevelopersList
									currentUserRole={currentUserRole}
									developers={receivedData.slice(1)}
									isCurrentUserScrumMasterOfThisTeam={
										receivedData[0].user_id === additionalUserInfo.id
									}
								/>
							) : null}
						</Box>
					</Box>
				</>
			)}
		</Box>
	);
}
