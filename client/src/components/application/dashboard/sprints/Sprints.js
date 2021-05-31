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
import { useRef, useState } from "react";
import { useGetFetch } from "customHooks/useFetch";
import { green, pink, blue } from "@material-ui/core/colors";
import IssueCreationForm from "components/forms/IssueCreationForm";
import DialogForm from "components/subComponents/DialogForm";
import PropTypes from "prop-types";
import IssueRow from "../backlog/IssueRow";
const useStyles = makeStyles({
	table: {
		width: "100%",
	},
});

SprintTable.propTypes = {
	sprintIssues: PropTypes.array.isRequired,
};
function SprintTable(props) {
	const classes = useStyles();
	const [selectedIssues, setSelectedIssues] = useState([]);

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
		<TableContainer component={Paper}>
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
					{props.sprintIssues.map((item) => (
						<IssueRow
							handleSelectionClick={handleSelectionClick}
							selectedRows={selectedIssues}
							row={item}
							key={item.id}
						/>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
}
export default function Sprints() {
	const getParams = useRef({ project_id: 71 });
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
							<SprintTable key={item.id} sprintIssues={item.issues} />
						))}
					</Box>
				</>
			)) || <Typography variant="h5">No sprints</Typography>}
		</>
	);
}
