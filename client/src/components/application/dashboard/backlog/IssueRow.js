import { useState, useRef, useEffect } from "react";
import {
	TableRow,
	TableHead,
	TableBody,
	TableCell,
	Typography,
	Table,
	makeStyles,
	Box,
	Chip,
	Collapse,
	IconButton,
	Avatar,
	Checkbox,
	TextField,
	MenuItem,
	Button,
	Tooltip,
	CircularProgress,
} from "@material-ui/core";
import {
	Star,
	StarOutline,
	KeyboardArrowUp,
	KeyboardArrowDown,
	DeleteForever,
	OpenWith,
} from "@material-ui/icons";

import { green, pink, blue } from "@material-ui/core/colors";
import PropTypes from "prop-types";
import { usePatchFetch } from "customHooks/useFetch";
import { useProjectContext } from "contexts/ProjectContext";
import { format } from "date-fns";

const useStyles = makeStyles({
	table: {
		width: "100%",
	},
	taskColor: {
		backgroundColor: blue[500],
	},
	bugColor: {
		backgroundColor: pink[500],
	},
	storyColor: {
		backgroundColor: green[500],
	},

	rowTop: {
		borderTop: "none",
		borderBottom: "none",
	},
	rowBottom: {
		borderTop: "none",
		borderBottom: "none",
	},
	tableRow: {
		"& > *": {
			borderBottom: "unset",
		},
	},
	statusField: {
		width: "25ch",
	},
});

const UIRestrictionForRoles = ["developer"];

IssueRow.propTypes = {
	/**
	 * The issue object
	 */
	row: PropTypes.object.isRequired,
	/**
	 * Array of ids of issues that were selected
	 */
	selectedRows: PropTypes.arrayOf(PropTypes.number),
	/**
	 * Function called when a row is selected or deselected, requires
	 * the id of issue as paramater
	 */
	handleSelectionClick: PropTypes.func,
	handleDeleteIssueClick: PropTypes.func,
	isBacklogIssue: PropTypes.bool.isRequired,
	/**
	 * Whether the issue is in the process of being deleted
	 */
	isBeingDeleted: PropTypes.bool.isRequired,
};
const generatePriorityStars = (priorityNumber) => {
	let starsArray = [];
	for (let i = 0; i < priorityNumber; i++) starsArray.push(<Star key={`star${i}`} />);

	for (let i = 0; i < 5 - priorityNumber; i++)
		starsArray.push(<StarOutline key={`emptyStar${i}`} />);

	return starsArray;
};

export default function IssueRow(props) {
	const { currentUserRole } = useProjectContext();
	const { row, selectedRows, handleSelectionClick, isBacklogIssue, isBeingDeleted } = props;
	const [openMoreInfo, setOpenMoreInfo] = useState(false);
	const [requestBodyForUpdate, setRequestBodyForUpdate] = useState(null);
	const isSelected = selectedRows ? selectedRows.indexOf(row.id) !== -1 : false;
	const classes = useStyles();
	const futureIssueState = useRef(null);
	const [issueStatus, setNewIssueStatus] = useState(row.status);

	const {
		error: updateError,
		isLoading: isLoadingUpdate,
		isResolved: isResolvedUpdate,
		isRejected: isRejectedUpdate,
	} = usePatchFetch(`api/issues/${row.id}`, requestBodyForUpdate);

	const handleChangeStatusClick = (event) => {
		setRequestBodyForUpdate(JSON.stringify({ status: event.target.value }));
		futureIssueState.current = { futureState: event.target.value };
	};

	useEffect(() => {
		if (!isResolvedUpdate) return;

		setNewIssueStatus(futureIssueState.current.futureState);
	}, [isResolvedUpdate]);

	return (
		<>
			<TableRow classes={{ root: classes.rowTop }} selected={isSelected}>
				{isBacklogIssue ? (
					<TableCell padding="checkbox">
						<Checkbox
							checked={isSelected}
							onChange={(event) => {
								handleSelectionClick(row.id);
							}}
							disabled={UIRestrictionForRoles.includes(currentUserRole)}
						/>
					</TableCell>
				) : null}
				<TableCell align="center" padding="none">
					<IconButton
						align="center"
						size="small"
						onClick={() => setOpenMoreInfo(!openMoreInfo)}
					>
						{openMoreInfo ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
					</IconButton>
				</TableCell>

				<TableCell align="center">
					{(function () {
						switch (row.type) {
							case "task":
								return (
									<Chip
										color="primary"
										classes={{ colorPrimary: classes.taskColor }}
										label="task"
									/>
								);
							case "story":
								return (
									<Chip
										color="primary"
										classes={{ colorPrimary: classes.storyColor }}
										label="story"
									/>
								);
							case "bug":
								return (
									<Chip
										color="primary"
										classes={{ colorPrimary: classes.bugColor }}
										label="bug"
									/>
								);
							default:
								return null;
						}
					})()}
				</TableCell>
				<TableCell style={{ width: "100ch" }} align="left">
					{row.title}
				</TableCell>
				{!isBacklogIssue ? (
					<TableCell>
						<TextField
							InputProps={{ disableUnderline: true }}
							select
							value={issueStatus}
							onChange={handleChangeStatusClick}
							disabled={UIRestrictionForRoles.includes(currentUserRole)}
						>
							<MenuItem value="done">
								<Button variant="outlined" color="primary">
									done
								</Button>
							</MenuItem>
							<MenuItem value="pending">
								<Button variant="outlined" color="primary">
									pending
								</Button>
							</MenuItem>
							<MenuItem value="inProgress">
								<Button variant="outlined" color="primary">
									In Progress
								</Button>
							</MenuItem>
						</TextField>
					</TableCell>
				) : null}
				<TableCell align="center">{generatePriorityStars(row.priority)}</TableCell>
				<TableCell>
					<Typography>{format(new Date(row.created_at), "dd/MM/yyyy")}</Typography>
				</TableCell>
				<TableCell>
					<IconButton
						onClick={(event) =>
							isBacklogIssue
								? props.handleDeleteIssueClick(row.id)
								: props.handleMoveIssueClick
						}
						disabled={UIRestrictionForRoles.includes(currentUserRole) || isSelected}
					>
						{isBacklogIssue ? (
							!isBeingDeleted ? (
								<Tooltip
									title={
										<Typography variant="subtitle2">Delete issue</Typography>
									}
									arrow
								>
									<DeleteForever
										color={
											UIRestrictionForRoles.includes(currentUserRole) ||
											isSelected
												? "disabled"
												: "secondary"
										}
									/>
								</Tooltip>
							) : (
								<CircularProgress color="secondary" size={30} />
							)
						) : (
							<Tooltip
								title={<Typography variant="subtitle2">Move to backlog</Typography>}
								arrow
							>
								<OpenWith
									color={
										UIRestrictionForRoles.includes(currentUserRole) ||
										isSelected
											? "disabled"
											: "primary"
									}
								/>
							</Tooltip>
						)}
					</IconButton>
				</TableCell>
			</TableRow>

			<TableRow classes={{ root: classes.rowTop }}>
				<TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
					<Collapse in={openMoreInfo} timeout="auto" unmountOnExit>
						<Box>
							<Table>
								<TableHead>
									<TableRow style={!openMoreInfo ? { border: "unset" } : {}}>
										<TableCell align="left">
											<Typography>Description</Typography>
										</TableCell>
										<TableCell align="left">
											<Typography>Created by</Typography>
										</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									<TableRow className={classes.tableRow}>
										<TableCell style={{ maxWidth: "60ch" }} align="left">
											<Typography>{row.description}</Typography>
										</TableCell>
										<TableCell align="left">
											<Chip
												color="primary"
												avatar={
													<Avatar
														alt={row.creator_user_profile.fullName}
														src={row.creator_user_profile.avatar_url}
													/>
												}
												label={row.creator_user_profile.fullName}
											/>
										</TableCell>
									</TableRow>
								</TableBody>
							</Table>
						</Box>
					</Collapse>
				</TableCell>
			</TableRow>
		</>
	);
}
