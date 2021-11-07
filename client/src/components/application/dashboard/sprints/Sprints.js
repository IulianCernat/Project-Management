import { useRef, useState, useEffect, useMemo } from "react";
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
	Snackbar,
} from "@material-ui/core";
import { DeleteForever, KeyboardArrowDown, KeyboardArrowUp, Close } from "@material-ui/icons";
import { Alert } from "@material-ui/lab";
import { format } from "date-fns";
import { useDeleteFetch, useGetFetch, usePatchFetch, usePostFetch } from "customHooks/useFetch";
import PropTypes from "prop-types";
import { useProjectContext } from "contexts/ProjectContext";
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

SprintTable.propTypes = {
	sprint: PropTypes.object.isRequired,
	currentUserRole: PropTypes.string.isRequired,
	handleDeleteSprintClick: PropTypes.func.isRequired,
	startedSprintId: PropTypes.number.isRequired,
	setStartedSprintId: PropTypes.func.isRequired,
	firstTrelloBoardListId: PropTypes.string.isRequired,
	trelloLabelsObj: PropTypes.object.isRequired,
};
function SprintTable({
	sprint,
	currentUserRole,
	handleDeleteSprintClick,
	setStartedSprintId,
	startedSprintId,
	added_trello_board_id_by_user,
	firstTrelloBoardListId,
	firstTrelloBoardListName,
	trelloLabelsObj,
}) {
	const [sprintIssues, setSprintIssues] = useState(sprint.issues);
	const [requestBodyForIssueUpdate, setRequestBodyForIssueUpdate] = useState();
	const [idOfIssueToBeMovedToBacklog, setIdOfIssueToBeMovedToBacklog] = useState();
	const [idOfIssueToBeCopiedToTrello, setIdOfIssueToBeCopiedToTrello] = useState();
	const [openSnackbar, setOpenSnackbar] = useState(false);
	const [newTrelloCardPayload, setNewTrelloCardPayload] = useState();
	const [snackbarMessage, setSnackbarMessage] = useState();
	const headersForTrello = useRef({
		Authorization: `trello_token=${localStorage.getItem("trello_token")}`,
	});

	const handleCloseSnackbar = (event, reason) => {
		setOpenSnackbar(false);
	};

	const {
		error: updateIssueError,
		isLoading: isLoadingIssueUpdate,
		isResolved: isResolvedIssueUpdate,
		isRejected: isRejectedIssueUpdate,
	} = usePatchFetch(
		`api/issues/${idOfIssueToBeMovedToBacklog}`,
		requestBodyForIssueUpdate,
		headersForTrello.current
	);

	let {
		error: postTrelloCardError,
		isLoading: isLoadingPostTrelloCard,
		isResolved: isResolvedPostTrelloCard,
		isRejected: isRejectedPostTrelloCard,
	} = usePostFetch("api/trello/cards/", newTrelloCardPayload, headersForTrello.current);

	const handleMoveIssueClick = (issueId) => {
		setIdOfIssueToBeMovedToBacklog(issueId);
		setRequestBodyForIssueUpdate(JSON.stringify({ sprint_id: 0 }));
	};

	const handleCopyIssueToTrelloClick = (currentIssue) => {
		if (!Boolean(added_trello_board_id_by_user)) {
			setOpenSnackbar(true);
			setSnackbarMessage("You haven't added a Trello board");
			return;
		}
		setNewTrelloCardPayload(
			JSON.stringify({
				name: currentIssue.title,
				desc: currentIssue?.description,
				idList: firstTrelloBoardListId,
				idLabels: [trelloLabelsObj[currentIssue.type]],
				due: sprint.end_date,
				issue_id: currentIssue.id,
				board_list_name: firstTrelloBoardListName,
			})
		);
		setIdOfIssueToBeCopiedToTrello(currentIssue.id);
	};

	useEffect(() => {
		if (!isResolvedIssueUpdate) return;
		setSprintIssues(sprintIssues.filter((item) => item.id !== idOfIssueToBeMovedToBacklog));
	}, [isResolvedIssueUpdate, idOfIssueToBeMovedToBacklog]);

	useEffect(() => {
		if (!isResolvedPostTrelloCard) return;
		const issue_to_be_updated = sprintIssues.find(
			(item) => item.id === idOfIssueToBeCopiedToTrello
		);

		issue_to_be_updated["trello_card_list_name"] = firstTrelloBoardListName;
		issue_to_be_updated["trello_card_due_is_completed"] = false;
		issue_to_be_updated["trello_card_is_closed"] = false;

		setSprintIssues([...sprintIssues]);
	}, [isResolvedPostTrelloCard, idOfIssueToBeCopiedToTrello]);

	useEffect(() => {
		if (isRejectedPostTrelloCard) {
			setSnackbarMessage(postTrelloCardError);
			setOpenSnackbar(true);
			return;
		}
		if (isRejectedIssueUpdate) {
			setSnackbarMessage(updateIssueError);
			setOpenSnackbar(true);

			return;
		}
	}, [isRejectedIssueUpdate, isRejectedPostTrelloCard]);
	return (
		<TableContainer component={Paper} style={{ padding: "1rem" }}>
			<Snackbar
				anchorOrigin={{
					vertical: "top",
					horizontal: "center",
				}}
				open={openSnackbar}
				onClose={handleCloseSnackbar}
				autoHideDuration={6000}
				message={snackbarMessage}
				action={
					<>
						<IconButton
							size="small"
							aria-label="close"
							color="inherit"
							onClick={handleCloseSnackbar}
						>
							<Close fontSize="small" />
						</IconButton>
					</>
				}
			/>
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
					idOfIssueToBeMovedToBacklog,
					idOfIssueToBeCopiedToTrello,
					isLoadingPostTrelloCard,
					isLoadingIssueUpdate,
					handleCopyIssueToTrelloClick,
					handleMoveIssueClick,
					issuesList: sprintIssues,
				}}
			/>
		</TableContainer>
	);
}

export default function Sprints() {
	const { projectId, currentUserRole, trelloBoards } = useProjectContext();
	const added_trello_board_id_by_user = useMemo(
		() => trelloBoards.find((trelloBoard) => trelloBoard.is_added_by_user)?.trello_board_id,
		[trelloBoards]
	);
	const [trelloToken, setTrelloToken] = useState(localStorage.getItem("trello_token"));
	const [sprintsList, setSprintsList] = useState([]);
	const [sprintIdToBeDeleted, setSprintIdToBeDeleted] = useState();
	const [startFetchingSprints, setStartFetchingSprints] = useState(true);
	const getSprintsParams = useRef({ project_id: projectId });
	const getTrelloDataParams = useRef({
		data_arrangement: "board_lists_ids_and_names,board_labels",
	});

	const [startedSprintId, setStartedSprintId] = useState();

	const {
		receivedData: getSprintsReceivedData,
		error: getSprintsError,
		isLoading: isLoadingGetSprints,
		isResolved: isResolvedGetSprints,
		isRejected: isRejectedGetSprints,
	} = useGetFetch(`api/sprints/`, getSprintsParams.current, startFetchingSprints);

	const {
		receivedData: getTrelloData,
		error: getTrelloDataError,
		isLoading: isLoadingGetTrelloData,
		isResolved: isResolvedGetTrelloData,
		isRejected: isRejectedGetTrelloData,
	} = useGetFetch(
		`api/trello/boards/${added_trello_board_id_by_user}`,
		getTrelloDataParams.current,
		Boolean(added_trello_board_id_by_user),
		false
	);

	const {
		isResolved: isResolvedDeleteSprint,
		isRejected: isRejectedDeleteSprint,
		isLoading: isLoadingDeleteSprint,
	} = useDeleteFetch(sprintIdToBeDeleted ? `api/sprints/${sprintIdToBeDeleted}` : null);

	const handleDeleteSprintClick = (sprintId) => {
		setSprintIdToBeDeleted(sprintId);
	};

	const handleSyncWithTrelloClick = () => {
		setStartFetchingSprints(true);
	};

	useEffect(() => {
		if (!isResolvedGetSprints) return;
		setSprintsList(getSprintsReceivedData);
		setStartFetchingSprints(false);
	}, [isResolvedGetSprints]);

	useEffect(() => {
		if (isResolvedDeleteSprint) {
			setSprintsList((currentSprintsList) =>
				currentSprintsList.filter((sprint) => sprint.id !== sprintIdToBeDeleted)
			);
		}
	}, [isResolvedDeleteSprint]);

	useEffect(() => {
		const trelloToken = localStorage.getItem("trello_token");
		setTrelloToken(trelloToken);
	}, []);

	return (
		<>
			{isRejectedGetTrelloData ? <Alert severity="error">{getTrelloDataError}</Alert> : null}
			{isLoadingGetSprints || isLoadingGetTrelloData ? (
				<LinearProgress style={{ width: "100%" }} />
			) : null}
			<Box my={2}>
				<Button color="primary" variant="contained" onClick={handleSyncWithTrelloClick}>
					Sync with Trello
				</Button>
			</Box>

			{isRejectedGetSprints ? <Alert severity="error">{getSprintsError} </Alert> : null}
			{isResolvedGetSprints &&
			getSprintsReceivedData.length &&
			(added_trello_board_id_by_user ? (getTrelloData ? true : false) : true) ? (
				<Box display="flex" flexWrap="wrap" flexDirection="column" style={{ gap: "2rem" }}>
					{sprintsList.map((item) => (
						<SprintTable
							startedSprintId={startedSprintId}
							setStartedSprintId={setStartedSprintId}
							handleDeleteSprintClick={handleDeleteSprintClick}
							currentUserRole={currentUserRole}
							key={item.id}
							sprint={item}
							added_trello_board_id_by_user={added_trello_board_id_by_user}
							firstTrelloBoardListId={
								added_trello_board_id_by_user
									? getTrelloData.trello_board_lists_ids_and_names[0].id
									: null
							}
							firstTrelloBoardListName={
								added_trello_board_id_by_user
									? getTrelloData.trello_board_lists_ids_and_names[0].name
									: null
							}
							trelloLabelsObj={
								added_trello_board_id_by_user
									? getTrelloData.trello_board_labels
									: null
							}
						/>
					))}
				</Box>
			) : null}
			{!isLoadingGetSprints && !getSprintsReceivedData?.length && (
				<Typography variant="h5" color="primary">
					Currently there are no sprints created
				</Typography>
			)}
		</>
	);
}
