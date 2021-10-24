import { useRef, useState, useEffect } from "react";
import {
	TableContainer,
	Paper,
	Typography,
	makeStyles,
	Box,
	LinearProgress,
	Button,
	IconButton,
	Tooltip,
	Fab,
} from "@material-ui/core";
import { DeleteForever, KeyboardArrowDown, KeyboardArrowUp } from "@material-ui/icons";
import { Alert } from "@material-ui/lab";
import { format } from "date-fns";
import { useDeleteFetch, useGetFetch, usePatchFetch, doTrelloApiFetch } from "customHooks/useFetch";
import PropTypes from "prop-types";
import { useProjectContext } from "contexts/ProjectContext";
import { useAuth } from "contexts/AuthContext";
import IssuesTable from "../backlog/IssuesTable";

const useStyles = makeStyles({
	table: {
		width: "100%",
	},
	textContent: {
		whiteSpace: "pre-wrap",
	},
	showMoreContent: {
		transition: "max-height 0.15s",
		maxHeight: "1000px",
	},

	hideMoreContent: {
		transition: "max-height 0.15s",
		maxHeight: "20ch",
		overflow: "hidden",
	},
});
const UIRestrictionForRoles = ["developer"];

SprintTable.propTypes = {
	sprint: PropTypes.object.isRequired,
	currentUserRole: PropTypes.string.isRequired,
	handleDeleteSprintClick: PropTypes.func.isRequired,
	startedSprintId: PropTypes.number.isRequired,
	setStartedSprintId: PropTypes.func.isRequired,
	trelloBoardId: PropTypes.string.isRequired,
};
function SprintTable({
	sprint,
	currentUserRole,
	handleDeleteSprintClick,
	setStartedSprintId,
	startedSprintId,
	trelloBoardId,
}) {
	const classes = useStyles();
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
	} = usePatchFetch(`api/issues/${issueIdToBeUpdated}`, requestBodyForIssueUpdate);

	const handleMoveIssueClick = (issueId) => {
		setIssueIdToBeUpdated(issueId);
		setRequestBodyForIssueUpdate(JSON.stringify({ sprint_id: 0 }));
	};

	const handleCopyIssueToTrelloClick = (currentIssue) => {};
	useEffect(() => {
		if (!isResolvedIssueUpdate) return;
		setSprintIssues(sprintIssues.filter((item) => item.id !== issueIdToBeUpdated));
	}, [isResolvedIssueUpdate]);

	return (
		<TableContainer component={Paper} style={{ padding: "1rem" }}>
			<SprintHeader
				handleDeleteSprintClick={handleDeleteSprintClick}
				currentUserRole={currentUserRole}
				name={sprint.name}
				startDate={sprint.start_date}
				duration={sprint.duration}
				endDate={sprint.end_date}
				goal={sprint.goal}
				isStarted={sprint.start}
				isCompleted={sprint.completed}
				id={sprint.id}
				startedSprintId={startedSprintId}
				setStartedSprintId={setStartedSprintId}
			/>
			<IssuesTable
				isSprintIssuesTable
				issuesTableProps={{
					handleCopyIssueToTrelloClick,
					handleMoveIssueClick,
					issuesList: sprintIssues,
				}}
			/>
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
	handleDeleteSprintClick,
	startedSprintId,
	setStartedSprintId,
}) {
	const [showMoreGoalInfo, setShowMoreGoalInfo] = useState(false);
	const classes = useStyles();
	const [requestBodyForUpdate, setRequesBodyForUpdate] = useState(null);
	const [isStartedState, setIsStartedState] = useState(isStarted);
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
		if (requestBodyForUpdate.includes("start")) {
			setIsStartedState(true);
			setStartedSprintId(id);
		}
		if (requestBodyForUpdate.includes("completed")) {
			setIsCompletedState(true);
			setStartedSprintId(undefined);
		}
	}, [isResolvedUpdate]);

	return (
		<Box p={1} display="flex" flexDirection="column" flexWrap="wrap" style={{ gap: "1rem" }}>
			<Box>
				<Typography variant="h6">{name}</Typography>
			</Box>
			<Box display="flex" style={{ gap: "2rem" }} alignItems="center">
				<Box>
					<Typography color="primary" variant="h6">
						Start date
					</Typography>
					<Typography>{startDate}</Typography>
				</Box>
				<Box>
					<Typography color="primary" variant="h6">
						Duration
					</Typography>
					<Typography>{duration} weeks</Typography>
				</Box>
				<Box>
					<Typography color="primary" variant="h6">
						End date
					</Typography>
					<Typography>{endDate}</Typography>
				</Box>

				<Box flex="1 1 auto">
					{!isStartedState ? (
						<Button
							onClick={() => {
								handleStartSprintClick();
							}}
							variant="contained"
							color="primary"
							disabled={
								UIRestrictionForRoles.includes(currentUserRole) ||
								(startedSprintId !== undefined && startedSprintId !== id)
							}
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
						<Box p={1} width="20ch" border="1px solid blue">
							<Typography color="primary">Sprint completed</Typography>
						</Box>
					)}
				</Box>
				<Box>
					<IconButton
						color="secondary"
						onClick={() => {
							handleDeleteSprintClick(id);
						}}
						disabled={UIRestrictionForRoles.includes(currentUserRole)}
					>
						<Tooltip
							title={
								<Typography variant="subtitle2">
									Delete sprint and move issues to backlog
								</Typography>
							}
							arrow
						>
							<DeleteForever />
						</Tooltip>
					</IconButton>
				</Box>
			</Box>

			<Box width="100%" position="relative">
				<Typography color="primary" variant="h6">
					Sprint Goal
				</Typography>

				<Box
					px={2}
					className={showMoreGoalInfo ? classes.showMoreContent : classes.hideMoreContent}
					position="relative"
				>
					<Typography className={classes.textContent}>{goal}</Typography>
				</Box>
				<div
					style={{
						transition: "height 0.25s linear",
						left: 0,
						right: 0,
						position: "absolute",
						transform: "translate(0, -100%)",
						height: !showMoreGoalInfo && goal.length > 500 ? "6rem" : "0rem",
						backgroundImage:
							"linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(255, 255, 255, 100))",
					}}
				></div>
				<Box display="flex" justifyContent="center">
					{goal.length > 500 ? (
						showMoreGoalInfo ? (
							<Tooltip title="Hide info">
								<Fab
									size="small"
									onClick={() => {
										setShowMoreGoalInfo(false);
									}}
								>
									<KeyboardArrowUp />
								</Fab>
							</Tooltip>
						) : (
							<Tooltip title="Show more info">
								<Fab
									size="small"
									onClick={() => {
										setShowMoreGoalInfo(true);
									}}
								>
									<KeyboardArrowDown />
								</Fab>
							</Tooltip>
						)
					) : null}
				</Box>
			</Box>
		</Box>
	);
}
export default function Sprints() {
	const { projectId, currentUserRole, trelloBoardId } = useProjectContext();
	const [sprintsList, setSprintsList] = useState([]);
	const [sprintIdToBeDeleted, setSprintIdToBeDeleted] = useState();
	const getParams = useRef({ project_id: projectId });
	const [startedSprintId, setStartedSprintId] = useState();
	const {
		status: getSprintsStatus,
		receivedData: getSprintsReceivedData,
		error: getSprintsError,
		isLoading: isLoadingGetSprints,
		isResolved: isResolvedGetSprints,
		isRejected: isRejectedGetSprints,
	} = useGetFetch(`api/sprints/`, getParams.current);

	const {
		status: deleteSprintStatus,
		isResolved: isResolvedDeleteSprint,
		isRejected: isRejectedDeleteSprint,
		isLoading: isLoadingDeleteSprint,
	} = useDeleteFetch(sprintIdToBeDeleted ? `api/sprints/${sprintIdToBeDeleted}` : null);

	const handleDeleteSprintClick = (sprintId) => {
		setSprintIdToBeDeleted(sprintId);
	};

	useEffect(() => {
		if (isResolvedDeleteSprint) {
			setSprintsList((currentSprintsList) =>
				currentSprintsList.filter((sprint) => sprint.id !== sprintIdToBeDeleted)
			);
		}
	}, [isResolvedDeleteSprint]);

	useEffect(() => {
		if (isResolvedGetSprints) {
			setSprintsList(getSprintsReceivedData);
			setStartedSprintId(
				getSprintsReceivedData.find((item) => item.start && !item.completed)?.id
			);
		}
	}, [isResolvedGetSprints, getSprintsReceivedData]);
	return (
		<>
			{isLoadingGetSprints ? <LinearProgress style={{ width: "100%" }} /> : null}
			{isRejectedGetSprints ? <Alert severity="error">{getSprintsError} </Alert> : null}
			{isResolvedGetSprints && getSprintsReceivedData.length && (
				<Box display="flex" flexWrap="wrap" flexDirection="column" style={{ gap: "2rem" }}>
					{sprintsList.map((item) => (
						<SprintTable
							startedSprintId={startedSprintId}
							setStartedSprintId={setStartedSprintId}
							handleDeleteSprintClick={handleDeleteSprintClick}
							currentUserRole={currentUserRole}
							key={item.id}
							sprint={item}
							trelloBoardId={trelloBoardId}
						/>
					))}
				</Box>
			)}
			{!isLoadingGetSprints && !getSprintsReceivedData?.length && (
				<Typography variant="h5" color="primary">
					Currently there are no sprints created
				</Typography>
			)}
		</>
	);
}
