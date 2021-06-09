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
	Toolbar,
	Button,
	lighten,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import IssueRow from "./IssueRow";
import { useRef, useState, useEffect } from "react";
import { useGetFetch, useDeleteFetch } from "customHooks/useFetch";
import { green, pink, blue } from "@material-ui/core/colors";
import IssueCreationForm from "components/forms/IssueCreationForm";
import CreateSprintForm from "components/forms/CreateSprintForm";
import DialogForm from "components/subComponents/DialogForm";
import PropTypes from "prop-types";
import { useProjectContext } from "contexts/ProjectContext";

const useStyles = makeStyles((theme) => ({
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
	toolbarHighlight: {
		color: theme.palette.secondary.main,
		backgroundColor: lighten(theme.palette.secondary.light, 0.85),
	},
}));
const UIRestrictionForRoles = ["developer"];

TableToolbar.propTypes = {
	numIssuesSelected: PropTypes.number.isRequired,
	openIssueCreationDialog: PropTypes.func.isRequired,
	openSprintCreationDialog: PropTypes.func.isRequired,
	currentUserRole: PropTypes.string.isRequired,
};
function TableToolbar(props) {
	const { numIssuesSelected, openIssueCreationDialog } = props;
	const classes = useStyles();

	return (
		<>
			<Toolbar className={numIssuesSelected ? classes.toolbarHighlight : ""}>
				<Box display="flex" style={{ gap: "1rem" }} alignItems="center">
					{numIssuesSelected ? (
						<>
							<Typography>{numIssuesSelected} selected</Typography>
							<Button
								variant="contained"
								color="primary"
								onClick={() => {
									props.openSprintCreationDialog();
								}}
								disabled={UIRestrictionForRoles.includes(props.currentUserRole)}
							>
								<Typography>Create sprint</Typography>
							</Button>
						</>
					) : (
						<>
							<Typography>Issues</Typography>
							<Button
								onClick={(event) => {
									openIssueCreationDialog();
								}}
								variant="contained"
								color="primary"
								disabled={UIRestrictionForRoles.includes(props.currentUserRole)}
							>
								<Typography>Create issue</Typography>
							</Button>
						</>
					)}
				</Box>
			</Toolbar>
		</>
	);
}

export default function Backlog() {
	const classes = useStyles();
	const { projectId, currentUserRole } = useProjectContext();
	const getParams = useRef({ project_id: projectId });
	const [issueUrlToBeDeleted, setIssueUrlToBeDeleted] = useState(null);
	const [selectedIssues, setSelectedIssues] = useState([]);
	const [openIssueCreationForm, setOpenIssueCreationForm] = useState(false);
	const [openSprintCreationForm, setOpenSprintCreationForm] = useState(false);
	const [issuesList, setIssuesList] = useState([]);
	let {
		status: getIssuesStatus,
		receivedData: getIssuesReceivedData,
		error: getIssuesError,
		isLoading: isLoadingGetIssues,
		isResolved: isResolvedGetIssues,
		isRejected: isRejectedGetIssues,
	} = useGetFetch("api/issues/", getParams.current);

	let {
		status: deleteIssueStatus,
		receivedData: deleteIssueReceivedData,
		error: deleteIssueError,
		isLoading: isLoadingDeleteIssue,
		isResolved: isResolvedDeleteIssue,
		isRejected: isRejectedDeleteIssue,
	} = useDeleteFetch(issueUrlToBeDeleted);

	function openIssueCreationDialog() {
		setOpenIssueCreationForm(true);
	}
	function handleCancelIssueCreation() {
		setOpenIssueCreationForm(false);
	}

	function openSprintCreationDialog() {
		setOpenSprintCreationForm(true);
	}
	function handleCancelSprintCreation() {
		setOpenSprintCreationForm(false);
	}

	const handleSelectionClick = (issueId) => {
		const selectedIndex = selectedIssues.indexOf(issueId);
		let newSelectedIssues = [];

		if (selectedIndex === -1) {
			newSelectedIssues = newSelectedIssues.concat(selectedIssues, issueId);
		} else if (selectedIndex === 0) {
			newSelectedIssues = newSelectedIssues.concat(selectedIssues.slice(1));
		} else if (selectedIndex === selectedIssues.length - 1) {
			newSelectedIssues = newSelectedIssues.concat(selectedIssues.slice(0, -1));
		} else if (selectedIndex > 0) {
			newSelectedIssues = newSelectedIssues.concat(
				selectedIssues.slice(0, selectedIndex),
				selectedIssues.slice(selectedIndex + 1)
			);
		}

		setSelectedIssues(newSelectedIssues);
	};

	const insertNewIssues = (newIssueObj) => {
		issuesList.unshift(newIssueObj);
		setIssuesList(issuesList);
		handleCancelIssueCreation();
	};

	const handleDeleteIssueClick = (issueId) => {
		setIssueUrlToBeDeleted(`api/issues/${issueId}`);
	};

	useEffect(() => {
		if (!isResolvedDeleteIssue) return;

		const deletedIssueId = Number(issueUrlToBeDeleted.split("/").pop());
		setIssuesList((issuesList) =>
			issuesList.filter((item) => item.id !== deletedIssueId)
		);
	}, [isResolvedDeleteIssue]);

	useEffect(() => {
		if (!isResolvedGetIssues) return;
		setIssuesList(getIssuesReceivedData);
	}, [isResolvedGetIssues, getIssuesReceivedData]);
	useEffect(() => {}, [issuesList]);
	return (
		<>
			<DialogForm
				title="Create new issue"
				open={openIssueCreationForm}
				onClose={handleCancelIssueCreation}
			>
				<IssueCreationForm
					projectId={projectId}
					onClose={handleCancelIssueCreation}
					insertCreation={insertNewIssues}
				/>
			</DialogForm>
			<DialogForm
				title="Create new sprint"
				open={openSprintCreationForm}
				onClose={handleCancelSprintCreation}
			>
				<CreateSprintForm projectId={projectId} issuesIds={selectedIssues} />
			</DialogForm>

			<Box>
				{isLoadingGetIssues ? (
					<LinearProgress style={{ width: "100%" }} />
				) : null}
				{isRejectedGetIssues ? (
					<Alert severity="error">{getIssuesError} </Alert>
				) : null}

				<TableContainer component={Paper}>
					<TableToolbar
						openIssueCreationDialog={openIssueCreationDialog}
						openSprintCreationDialog={openSprintCreationDialog}
						numIssuesSelected={selectedIssues.length}
						currentUserRole={currentUserRole}
					/>
					{getIssuesReceivedData?.length ? (
						<Table className={classes.table}>
							<TableHead>
								<TableRow>
									<TableCell />
									<TableCell />
									<TableCell>
										<Typography align="center">Type</Typography>
									</TableCell>
									<TableCell align="left">
										<Typography>Title</Typography>
									</TableCell>
									<TableCell align="center">
										<Typography>Priority</Typography>
									</TableCell>
									<TableCell />
								</TableRow>
							</TableHead>
							<TableBody>
								{issuesList.map((item) => (
									<IssueRow
										key={item.id}
										isBacklogIssue
										handleSelectionClick={handleSelectionClick}
										handleDeleteIssueClick={handleDeleteIssueClick}
										selectedRows={selectedIssues}
										row={item}
									/>
								))}
							</TableBody>
						</Table>
					) : null}
				</TableContainer>
			</Box>
		</>
	);
}
