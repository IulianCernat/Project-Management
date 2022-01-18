import { useRef, useState, useEffect, useCallback, useMemo } from "react";
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
import { DeleteForever, KeyboardArrowDown, KeyboardArrowUp, Close, Edit } from "@material-ui/icons";
import { Alert } from "@material-ui/lab";
import { format } from "date-fns";
import { useDeleteFetch, useGetFetch, usePatchFetch, usePostFetch } from "customHooks/useFetch";
import PropTypes from "prop-types";
import { useProjectContext } from "contexts/ProjectContext";
import IssuesTable from "../backlog/IssuesTable";
import CreateSprintForm from "components/forms/CreateSprintForm";
import DialogForm from "components/subComponents/DialogForm";

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
	updateSprintWithNewSprint,
	handleUpdateSprintClick,
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
}) {
	console.log(startedSprintId);
	const [showMoreGoalInfo, setShowMoreGoalInfo] = useState(false);
	const classes = useStyles();
	const [requestBodyForUpdate, setRequesBodyForUpdate] = useState(null);

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
		if (isResolvedUpdate) updateSprintWithNewSprint(updatedReveivedData);
	}, [isResolvedUpdate]);

	return (
		<Box p={1} display="flex" flexDirection="column" flexWrap="wrap" style={{ gap: "1rem" }}>
			<Box>
				<Typography variant="h6">{name}</Typography>
			</Box>
			<Box display="flex" style={{ gap: "2rem" }} alignItems="center">
				<Box>
					<Tooltip title={<Typography variant="subtitle2">update issue</Typography>} arrow>
						<IconButton
							onClick={() => {
								handleUpdateSprintClick(id);
							}}
							disabled={UIRestrictionForRoles.includes(currentUserRole)}
						>
							<Edit />
						</IconButton>
					</Tooltip>
				</Box>
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
					{!isStarted ? (
						<Button
							onClick={() => {
								handleStartSprintClick();
							}}
							variant="contained"
							color="primary"
							disabled={
								UIRestrictionForRoles.includes(currentUserRole) ||
								(startedSprintId === null && startedSprintId !== id)
							}
						>
							Start sprint
						</Button>
					) : !isCompleted ? (
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
								<Typography variant="subtitle2">Delete sprint and move issues to backlog</Typography>
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
						backgroundImage: "linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(255, 255, 255, 100))",
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
	handleUpdateSprintClick: PropTypes.func.isRequired,
	startedSprintId: PropTypes.number.isRequired,
	setStartedSprintId: PropTypes.func.isRequired,
	firstTrelloBoardListId: PropTypes.string.isRequired,
	trelloLabelsObj: PropTypes.object.isRequired,
	updateSprintWithNewSprint: PropTypes.func.isRequired,
};
function SprintTable({
	sprint,
	currentUserRole,
	updateSprintWithNewSprint,
	handleDeleteSprintClick,
	handleUpdateSprintClick,
	doUpdateIssueForSprint,
	startedSprintId,
	added_trello_board_id_by_user,
	firstTrelloBoardListId,
	firstTrelloBoardListName,
	trelloLabelsObj,
}) {
	const [sprintIssues, setSprintIssues] = useState([]);
	const [requestBodyForIssueUpdate, setRequestBodyForIssueUpdate] = useState();
	const [idOfIssueToBeMovedToBacklog, setIdOfIssueToBeMovedToBacklog] = useState();
	const [idOfIssueToBeCopiedToTrello, setIdOfIssueToBeCopiedToTrello] = useState();
	const [openSnackbar, setOpenSnackbar] = useState(false);
	const [newTrelloCardPayload, setNewTrelloCardPayload] = useState();
	const [snackbarMessage, setSnackbarMessage] = useState();

	const handleCloseSnackbar = (event, reason) => {
		setOpenSnackbar(false);
	};

	const {
		error: updateIssueError,
		isLoading: isLoadingIssueUpdate,
		isResolved: isResolvedIssueUpdate,
		isRejected: isRejectedIssueUpdate,
	} = usePatchFetch(`api/issues/${idOfIssueToBeMovedToBacklog}`, requestBodyForIssueUpdate);

	let {
		receivedData: postTrelloCardReceivedData,
		error: postTrelloCardError,
		isLoading: isLoadingPostTrelloCard,
		isResolved: isResolvedPostTrelloCard,
		isRejected: isRejectedPostTrelloCard,
	} = usePostFetch("api/trello/cards/", newTrelloCardPayload);

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
		doUpdateIssueForSprint({
			issueForUpdateId: idOfIssueToBeMovedToBacklog,
			deleteIssue: true,
		});
	}, [isResolvedIssueUpdate, idOfIssueToBeMovedToBacklog]);

	useEffect(() => {
		if (!(isResolvedPostTrelloCard && idOfIssueToBeCopiedToTrello)) return;
		doUpdateIssueForSprint({
			issueForUpdateId: idOfIssueToBeCopiedToTrello,
			newIssueProperties: {
				trello_card_id: postTrelloCardReceivedData.location,
				trello_card_list_name: firstTrelloBoardListName,
				trello_card_due_is_completed: false,
				trello_card_is_closed: false,
			},
		});
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

	useEffect(() => {
		if (sprint.issues.length) setSprintIssues(sprint.issues);
	}, [sprint.issues]);
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
						<IconButton size="small" aria-label="close" color="inherit" onClick={handleCloseSnackbar}>
							<Close fontSize="small" />
						</IconButton>
					</>
				}
			/>
			<SprintHeader
				updateSprintWithNewSprint={updateSprintWithNewSprint}
				handleDeleteSprintClick={handleDeleteSprintClick}
				handleUpdateSprintClick={handleUpdateSprintClick}
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
					isSprintCompleted: sprint.completed,
					isSprintStarted: sprint.start,
				}}
				issuesList={sprintIssues}
			/>
		</TableContainer>
	);
}

export default function Sprints() {
	const websockeWithRealtimeService = useRef(null);
	const [websocketSessionId, setWebsocketSessionId] = useState(null);
	const { projectId, currentUserRole, trelloBoards } = useProjectContext();
	const added_trello_board_id_by_user = useMemo(
		() => trelloBoards.find((trelloBoard) => trelloBoard.is_added_by_user)?.trello_board_id,
		[trelloBoards]
	);
	const listWithTrelloBoardsIdsOnly = useMemo(
		() => trelloBoards.map((trelloBoard) => trelloBoard.trello_board_id),
		[trelloBoards]
	);
	const [sprintsList, setSprintsList] = useState([]);
	const [sprintIdToBeDeleted, setSprintIdToBeDeleted] = useState();
	const [startFetchingSprints, setStartFetchingSprints] = useState(true);
	const getSprintsParams = useRef({ project_id: projectId });
	const getTrelloDataParams = useRef({
		data_arrangement: "board_lists_ids_and_names,board_labels",
	});

	const [startedSprintId, setStartedSprintId] = useState();
	const [performSprintUpdate, setPerformSprintUpdate] = useState();
	const [sprintUpdateData, setSprintUpdateData] = useState();
	const [openSprintUpdateForm, setOpenSprintUpdateForm] = useState();

	function doUpdateIssueForSprint({ issueForUpdateId, newIssueProperties = null, deleteIssue = false }) {
		let indexOfIssueForUpdate;
		let indexOfSprintForUpdate;
		for (const [sprintIndex, sprint] of Object.entries(sprintsList)) {
			indexOfIssueForUpdate = sprint.issues.findIndex((issue) => {
				return issue.id === issueForUpdateId;
			});
			if (indexOfIssueForUpdate !== -1) {
				indexOfSprintForUpdate = sprintIndex;
				break;
			}
		}

		if (indexOfIssueForUpdate !== -1) {
			if (deleteIssue) {
				sprintsList[indexOfSprintForUpdate].issues.splice(indexOfIssueForUpdate, 1);
			} else if (newIssueProperties) {
				delete newIssueProperties.board_id;

				sprintsList[indexOfSprintForUpdate].issues[indexOfIssueForUpdate] = Object.assign(
					sprintsList[indexOfSprintForUpdate].issues[indexOfIssueForUpdate],
					newIssueProperties
				);
			}

			// trigger rerender by changing object references
			sprintsList[indexOfSprintForUpdate].issues = [...sprintsList[indexOfSprintForUpdate].issues];
			sprintsList[indexOfSprintForUpdate] = Object.assign({}, sprintsList[indexOfSprintForUpdate]);
			setSprintsList([...sprintsList]);
		}
	}

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
		Boolean(added_trello_board_id_by_user)
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

	const handleCancelSprintUpdate = () => {
		setPerformSprintUpdate(false);
		setOpenSprintUpdateForm(false);
		setSprintUpdateData(null);
	};

	const handleUpdateSprintClick = (sprintId) => {
		setSprintUpdateData(sprintsList.find((item) => item.id === sprintId));
		setPerformSprintUpdate(true);
		setOpenSprintUpdateForm(true);
	};

	const updateSprintWithNewSprint = useCallback((newUpdatedSprint) => {
		setPerformSprintUpdate(false);
		setSprintUpdateData(null);
		setOpenSprintUpdateForm(false);
		setSprintsList((prevSprintsList) => {
			const indexOfUpdatedSprint = prevSprintsList.findIndex((item) => item.id === newUpdatedSprint.id);
			prevSprintsList[indexOfUpdatedSprint] = newUpdatedSprint;
			return [...prevSprintsList];
		});
	}, []);

	useEffect(() => {
		if (!isResolvedGetSprints) return;
		setSprintsList(getSprintsReceivedData);
		setStartFetchingSprints(false);
	}, [isResolvedGetSprints, getSprintsReceivedData]);

	useEffect(() => {
		const startedSprintIndex = sprintsList.findIndex((sprint) => sprint.start === true);
		if (startedSprintIndex !== -1) setStartedSprintId(sprintsList[startedSprintIndex].id);

		if (!websockeWithRealtimeService.current) return;
		websockeWithRealtimeService.current.onmessage = (event) => {
			const parsedMessageObj = JSON.parse(event.data);

			if ("error" in parsedMessageObj) console.log(parsedMessageObj.error);
			else {
				const issueId = parsedMessageObj.issue_id;
				delete parsedMessageObj.issue_id;
				doUpdateIssueForSprint({
					issueForUpdateId: issueId,
					newIssueProperties: parsedMessageObj,
				});
			}
		};
	}, [sprintsList]);

	useEffect(() => {
		if (isResolvedDeleteSprint) {
			setSprintsList((currentSprintsList) =>
				currentSprintsList.filter((sprint) => sprint.id !== sprintIdToBeDeleted)
			);
		}
	}, [isResolvedDeleteSprint]);

	useEffect(() => {
		// Initialize websocket connection
		websockeWithRealtimeService.current = new WebSocket(process.env.REACT_APP_REAL_TIME_TRELLO_UPDATES_SERVICE_URL);

		websockeWithRealtimeService.current.onopen = () => {
			websockeWithRealtimeService.current.send(
				JSON.stringify({
					action: "join",
					boardIdList: listWithTrelloBoardsIdsOnly,
				})
			);
			websockeWithRealtimeService.current.onmessage = (event) => {
				const parsedMessageObj = JSON.parse(event.data);
				if ("sessionId" in parsedMessageObj) setWebsocketSessionId(parsedMessageObj.sessionId);
			};
		};

		return () => {
			if (websockeWithRealtimeService.current.readyState === 1) {
				websockeWithRealtimeService.current.send(
					JSON.stringify({ action: "leave", sessioId: websocketSessionId })
				);
				websockeWithRealtimeService.current.close();
			}
		};
	}, []);

	return (
		<>
			<DialogForm
				title="Update sprint info"
				open={openSprintUpdateForm}
				onClose={handleCancelSprintUpdate}
				maxWidth="md"
			>
				<CreateSprintForm
					performSprintUpdate={performSprintUpdate}
					updateSprintWithNewSprint={updateSprintWithNewSprint}
					sprintUpdateData={sprintUpdateData}
				/>
			</DialogForm>
			{isRejectedGetTrelloData ? <Alert severity="error">{getTrelloDataError}</Alert> : null}
			{isLoadingGetSprints || isLoadingGetTrelloData ? <LinearProgress style={{ width: "100%" }} /> : null}
			<Box my={2}>
				<Button color="primary" variant="contained" onClick={handleSyncWithTrelloClick}>
					Sync with Trello
				</Button>
			</Box>

			{isRejectedGetSprints ? <Alert severity="error">{getSprintsError} </Alert> : null}
			{sprintsList.length && (added_trello_board_id_by_user ? (isResolvedGetTrelloData ? true : false) : true) ? (
				<Box display="flex" flexWrap="wrap" flexDirection="column" style={{ gap: "2rem" }}>
					{sprintsList.map((item) => (
						<SprintTable
							updateSprintWithNewSprint={updateSprintWithNewSprint}
							handleUpdateSprintClick={handleUpdateSprintClick}
							startedSprintId={startedSprintId}
							handleDeleteSprintClick={handleDeleteSprintClick}
							doUpdateIssueForSprint={doUpdateIssueForSprint}
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
							trelloLabelsObj={added_trello_board_id_by_user ? getTrelloData.trello_board_labels : null}
						/>
					))}
				</Box>
			) : null}
			{isLoadingGetSprints || sprintsList.length ? null : (
				<Typography variant="h5" color="primary">
					Currently there are no sprints created
				</Typography>
			)}
		</>
	);
}
