import { useRef, useState, useEffect } from "react";
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
	Snackbar,
} from "@material-ui/core";
import { green, pink, blue } from "@material-ui/core/colors";
import { Alert } from "@material-ui/lab";
import PropTypes from "prop-types";
import IssueRow from "./IssueRow";
import { useGetFetch, useDeleteFetch } from "customHooks/useFetch";
import IssueCreationForm from "components/forms/IssueCreationForm";
import CreateSprintForm from "components/forms/CreateSprintForm";
import AddingIssuesToExistingSprintForm from "components/forms/AddingIssuesToExistingSprintForm";
import DialogForm from "components/subComponents/DialogForm";
import { useProjectContext } from "contexts/ProjectContext";
import clsx from "clsx";
const UIRestrictionForRoles = ["developer"];

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
	toolbar: {
		position: "sticky",
	},
}));

TableToolbar.propTypes = {
	numIssuesSelected: PropTypes.number.isRequired,
	openIssueCreationDialog: PropTypes.func.isRequired,
	openSprintCreationDialog: PropTypes.func.isRequired,
	openTransferIssuesToSprintDialog: PropTypes.func.isRequired,
	currentUserRole: PropTypes.string.isRequired,
};
function TableToolbar(props) {
	const { numIssuesSelected, openIssueCreationDialog } = props;
	const classes = useStyles();

	return (
		<>
			<Toolbar
				className={clsx(numIssuesSelected ? classes.toolbarHighlight : "", classes.toolbar)}
			>
				<Box display="flex" style={{ gap: "1rem" }} alignItems="center">
					{numIssuesSelected ? (
						<>
							<Typography>{numIssuesSelected} selected</Typography>
							<Button
								variant="contained"
								color="secondary"
								onClick={() => {
									props.openSprintCreationDialog();
								}}
								disabled={UIRestrictionForRoles.includes(props.currentUserRole)}
							>
								<Typography>Create sprint</Typography>
							</Button>
							<Button
								variant="contained"
								color="secondary"
								onClick={() => {
									props.openTransferIssuesToSprintDialog();
								}}
								disabled={UIRestrictionForRoles.includes(props.currentUserRole)}
							>
								<Typography>Move to sprint</Typography>
							</Button>
						</>
					) : (
						<>
							<Typography variant="h6">Issues</Typography>
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

IssuesTable.propTypes = {
	isSprintIssuesTable: PropTypes.bool.isRequired,
	issuesTableProps: PropTypes.oneOfType([
		PropTypes.exact({
			handleMoveIssueClick: PropTypes.func.isRequired,
		}),

		PropTypes.exact({
			openIssueCreationDialog: PropTypes.func.isRequired,
			openSprintCreationDialog: PropTypes.func.isRequired,
			openTransferIssuesToSprintDialog: PropTypes.func.isRequired,
			selectedIssues: PropTypes.array.isRequired,
			setSelectedIssues: PropTypes.func.isRequired,
			handleDeleteIssueClick: PropTypes.func.isRequired,
			isLoadingDeleteIssue: PropTypes.bool.isRequired,
			issuesList: PropTypes.array.isRequired,
		}),
	]),
};
export default function IssuesTable(props) {
	const classes = useStyles();
	const isSprintIssuesTable = props.isSprintIssuesTable;
	const {
		openIssueCreationDialog = null,
		openSprintCreationDialog = null,
		openTransferIssuesToSprintDialog = null,
		setSelectedIssues = null,
		selectedIssues = null,
		handleDeleteIssueClick = null,
		isLoadingDeleteIssue = null,
		issuesList = null,
		handleMoveIssueClick = null,
	} = props.issuesTableProps;
	const { currentUserRole } = useProjectContext();

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

	return (
		<Paper>
			{!isSprintIssuesTable && (
				<TableToolbar
					openIssueCreationDialog={openIssueCreationDialog}
					openSprintCreationDialog={openSprintCreationDialog}
					openTransferIssuesToSprintDialog={openTransferIssuesToSprintDialog}
					numIssuesSelected={selectedIssues.length}
					currentUserRole={currentUserRole}
				/>
			)}
			<TableContainer>
				{issuesList?.length ? (
					<Table className={classes.table} stickyHeader={true}>
						<TableHead>
							<TableRow>
								<TableCell />
								{!isSprintIssuesTable && <TableCell />}

								<TableCell>
									<Typography align="center">Type</Typography>
								</TableCell>
								<TableCell align="left">
									<Typography>Title</Typography>
								</TableCell>
								{isSprintIssuesTable && (
									<TableCell align="left">
										<Typography>Status</Typography>
									</TableCell>
								)}
								<TableCell align="center">
									<Typography>Priority</Typography>
								</TableCell>
								<TableCell />
							</TableRow>
						</TableHead>
						<TableBody>
							{issuesList.map((item) => (
								<IssueRow
									handleMoveIssueClick={handleMoveIssueClick}
									isBeingDeleted={isLoadingDeleteIssue}
									key={item.id}
									isBacklogIssue={!isSprintIssuesTable}
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
		</Paper>
	);
}
