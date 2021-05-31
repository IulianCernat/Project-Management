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
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import IssueRow from "./IssueRow";
import { useRef, useState } from "react";
import { useGetFetch } from "customHooks/useFetch";
import { green, pink, blue } from "@material-ui/core/colors";
import IssueCreationForm from "components/forms/IssueCreationForm";
import CreateSprintForm from "components/forms/CreateSprintForm";
import DialogForm from "components/subComponents/DialogForm";
import PropTypes from "prop-types";

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
}));

TableToolbar.propTypes = {
	numIssuesSelected: PropTypes.number.isRequired,
	openIssueCreationDialog: PropTypes.func.isRequired,
	openSprintCreationDialog: PropTypes.func.isRequired,
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
	const getParams = useRef({ project_id: 71 });
	const [selectedIssues, setSelectedIssues] = useState([]);
	const [openIssueCreationForm, setOpenIssueCreationForm] = useState(false);
	const [openSprintCreationForm, setOpenSprintCreationForm] = useState(false);

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

	let {
		status: getIssuesStatus,
		receivedData: getIssuesReceivedData,
		error: getIssuesError,
		isLoading: isLoadingGetIssues,
		isResolved: isResolvedGetIssues,
		isRejected: isRejectedGetIssues,
	} = useGetFetch(`api/issues/`, getParams.current);

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
		getIssuesReceivedData.unshift(newIssueObj);
		handleCancelIssueCreation();
	};

	return (
		<>
			<DialogForm
				title="Create new issue"
				open={openIssueCreationForm}
				onClose={handleCancelIssueCreation}
			>
				<IssueCreationForm
					onClose={handleCancelIssueCreation}
					insertCreation={insertNewIssues}
				/>
			</DialogForm>
			<DialogForm
				title="Create new sprint"
				open={openSprintCreationForm}
				onClose={handleCancelSprintCreation}
			>
				<CreateSprintForm issuesIds={selectedIssues} />
			</DialogForm>

			<Box>
				{isLoadingGetIssues ? (
					<LinearProgress style={{ width: "100%" }} />
				) : null}
				{isRejectedGetIssues ? (
					<Alert severity="error">{getIssuesError} </Alert>
				) : null}
				{isResolvedGetIssues && (
					<>
						<TableContainer component={Paper}>
							<TableToolbar
								openIssueCreationDialog={openIssueCreationDialog}
								openSprintCreationDialog={openSprintCreationDialog}
								numIssuesSelected={selectedIssues.length}
							/>
							{getIssuesReceivedData.length ? (
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
										</TableRow>
									</TableHead>
									<TableBody>
										{getIssuesReceivedData.map((item) => (
											<IssueRow
												handleSelectionClick={handleSelectionClick}
												selectedRows={selectedIssues}
												row={item}
												key={item.id}
											/>
										))}
									</TableBody>
								</Table>
							) : null}
						</TableContainer>
					</>
				)}
			</Box>
		</>
	);
}
