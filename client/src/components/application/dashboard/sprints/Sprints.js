import {
	TableContainer,
	TableRow,
	TableHead,
	TableBody,
	TableCell,
	Paper,
	Typography,
	Table,
	makeStyles,
	Box,
	LinearProgress,
	Button,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { useRef, useState, useEffect } from "react";
import { useGetFetch, usePatchFetch } from "customHooks/useFetch";
import PropTypes from "prop-types";
import IssueRow from "../backlog/IssueRow";
import { format } from "date-fns";
import { useProjectContext } from "contexts/ProjectContext";
const useStyles = makeStyles({
	table: {
		width: "100%",
	},
});
const UIRestrictionForRoles = ["developer", "scrumMaster"];

SprintTable.propTypes = {
	sprint: PropTypes.object.isRequired,
	currentUserRole: PropTypes.string.isRequired,
};
function SprintTable({ sprint, currentUserRole }) {
	const [sprintIssues, setSprintIssues] = useState(sprint.issues);
	const [requestBodyForIssueUpdate, setRequestBodyForIssueUpdate] = useState();
	const [issueIdToBeUpdated, setIssueIdToBeUpdated] = useState();

	const {
		status: updateIssueStatus,
		receivedData: updatedIssueReveivedData,
		error: updateIssueError,
		isLoading: isLoadingIssueUpdate,
		isResolved: isResolvedIssueUpdate,
		isRejected: isRejectedIssueUpdate,
	} = usePatchFetch(
		`api/issues/${issueIdToBeUpdated}`,
		requestBodyForIssueUpdate
	);

	const handleDeleteIssueClick = (issueId) => {
		setIssueIdToBeUpdated(issueId);
		setRequestBodyForIssueUpdate(JSON.stringify({ sprint_id: 0 }));
	};
	useEffect(() => {
		if (!isResolvedIssueUpdate) return;
		setSprintIssues(
			sprintIssues.filter((item) => item.id !== issueIdToBeUpdated)
		);
	}, [isResolvedIssueUpdate]);
	const classes = useStyles();
	return (
		<TableContainer component={Paper}>
			<SprintHeader
				currentUserRole={currentUserRole}
				name={sprint.name}
				startDate={sprint.start_date}
				duration={sprint.duration}
				endDate={sprint.end_date}
				goal={sprint.goal}
				isStarted={sprint.start}
				isCompleted={sprint.completed}
				id={sprint.id}
			/>

			<Table className={classes.table}>
				<TableHead>
					<TableRow>
						<TableCell />
						<TableCell>
							<Typography align="center">Type</Typography>
						</TableCell>
						<TableCell align="left">
							<Typography>Title</Typography>
						</TableCell>
						<TableCell align="left">
							<Typography>Status</Typography>
						</TableCell>
						<TableCell align="center">
							<Typography>Priority</Typography>
						</TableCell>
						<TableCell />
					</TableRow>
				</TableHead>
				<TableBody>
					{sprintIssues.map((item) => (
						<IssueRow
							handleDeleteIssueClick={handleDeleteIssueClick}
							isBacklogIssue={false}
							row={item}
							key={item.id}
						/>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
}

function SprintHeader({
	id,
	name,
	startDate,
	duration,
	endDate,
	goal,
	isCompleted,
	isStarted,
	currentUserRole,
}) {
	const [requestBodyForUpdate, setRequesBodyForUpdate] = useState(null);
	const [isStartedState, setIsStartedState] = useState(isCompleted);
	const [isCompletedState, setIsCompletedState] = useState(isCompleted);
	const {
		status: updateStatus,
		receivedData: updatedReveivedData,
		error: updateError,
		isLoading: isLoadingUpdate,
		isResolved: isResolvedUpdate,
		isRejected: isRejectedUpdate,
	} = usePatchFetch(`api/sprints/${id}`, requestBodyForUpdate);

	startDate = new Date(startDate);
	endDate = new Date(endDate);
	startDate = format(startDate, "dd/MM/yyyy HH:mm");
	endDate = format(endDate, "dd/MM/yyyy HH:mm");

	const handleStartSprintClick = () => {
		setRequesBodyForUpdate(JSON.stringify({ start: true }));
	};

	const handleCompleteSprintClick = () => {
		setRequesBodyForUpdate(JSON.stringify({ completed: true }));
	};
	useEffect(() => {
		if (!isResolvedUpdate) return;
		if (requestBodyForUpdate.includes("start")) setIsStartedState(true);
		if (requestBodyForUpdate.includes("completed")) setIsCompletedState(true);
	}, [isResolvedUpdate]);

	return (
		<Box p={2}>
			<Box display="flex" flexWrap="wrap" style={{ gap: "2rem" }}>
				<Box>
					<Typography variant="h5">{name}</Typography>
				</Box>
				<Box>
					<Typography variant="h6">Start date </Typography>
					<Typography>{startDate}</Typography>
				</Box>
				<Box>
					<Typography variant="h6">Duration </Typography>
					<Typography>{duration} weeks</Typography>
				</Box>
				<Box>
					<Typography variant="h6">End date </Typography>
					<Typography>{endDate}</Typography>
				</Box>

				<Box>
					{!isStartedState ? (
						<Button
							onClick={() => {
								handleStartSprintClick();
							}}
							variant="contained"
							color="primary"
							disabled={UIRestrictionForRoles.includes(currentUserRole)}
						>
							Start sprint
						</Button>
					) : !isCompletedState ? (
						<Button
							onClick={() => {
								handleCompleteSprintClick();
							}}
							variant="contained"
							color="Secondary"
							disabled={UIRestrictionForRoles.includes(currentUserRole)}
						>
							Complete sprint
						</Button>
					) : (
						<Typography color="primary">Sprint completed</Typography>
					)}
				</Box>
			</Box>
			<Box>
				<Typography variant="h6">Sprint Goal</Typography>
				<Typography> {goal}</Typography>
			</Box>
		</Box>
	);
}
export default function Sprints() {
	const { projectId, currentUserRole } = useProjectContext();
	const getParams = useRef({ project_id: projectId });
	const {
		status: getSprintsStatus,
		receivedData: getSprintsReceivedData,
		error: getSprintsError,
		isLoading: isLoadingGetSprints,
		isResolved: isResolvedGetSprints,
		isRejected: isRejectedGetSprints,
	} = useGetFetch(`api/sprints/`, getParams.current);
	return (
		<>
			{isLoadingGetSprints ? (
				<LinearProgress style={{ width: "100%" }} />
			) : null}
			{isRejectedGetSprints ? (
				<Alert severity="error">{getSprintsError} </Alert>
			) : null}
			{(isResolvedGetSprints && getSprintsReceivedData.length && (
				<>
					<Box
						display="flex"
						flexWrap="wrap"
						flexDirection="column"
						style={{ gap: "2rem" }}
					>
						{getSprintsReceivedData.map((item) => (
							<SprintTable
								currentUserRole={currentUserRole}
								key={item.id}
								sprint={item}
							/>
						))}
					</Box>
				</>
			)) || <Typography variant="h5">No sprints</Typography>}
		</>
	);
}
