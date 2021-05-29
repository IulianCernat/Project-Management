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
	Chip,
	Collapse,
	IconButton,
	Avatar,
	Checkbox,
	Toolbar,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import {
	Star,
	StarOutline,
	KeyboardArrowUp,
	KeyboardArrowDown,
} from "@material-ui/icons";
import { useEffect, useRef, useState } from "react";
import { useGetFetch } from "customHooks/useFetch";
import { green, pink, blue, purple } from "@material-ui/core/colors";
import clsx from "clsx";
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
		border: `2px solid ${purple[200]}`,
		borderBottom: "unset",
	},
	rowBottom: {
		border: `2px solid ${purple[200]}`,
		borderBottom: "unset",
		borderTop: "unset",
	},
	tableRow: {
		"& > *": {
			borderBottom: "unset",
		},
	},
}));

Row.propTypes = {
	/**
	 * The issue object
	 */
	row: PropTypes.object.isRequired,
	/**
	 * Array of ids of issues that were selected
	 */
	selectedRows: PropTypes.arrayOf(PropTypes.number).isRequired,
	/**
	 * Function called when a row is selected or deselected, requires
	 * the id of issue as paramater
	 */
	handleSelectionClick: PropTypes.func.isRequired,
};
function Row(props) {
	const { row, selectedRows, handleSelectionClick } = props;
	const [openMoreInfo, setOpenMoreInfo] = useState(false);

	const isSelected = selectedRows.indexOf(row.id) !== -1;

	const classes = useStyles();

	const generatePriorityStars = (priorityNumber) => {
		let starsArray = [];
		for (let i = 0; i < priorityNumber; i++) starsArray.push(<Star />);

		for (let i = 0; i < 5 - priorityNumber; i++)
			starsArray.push(<StarOutline />);

		return starsArray;
	};

	return (
		<>
			<TableRow
				selected={isSelected}
				className={clsx(classes.tableRow, classes.rowTop)}
			>
				<TableCell padding="checkbox">
					<Checkbox
						checked={isSelected}
						onChange={(event) => {
							handleSelectionClick(row.id);
						}}
					/>
				</TableCell>
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
				<TableCell align="center">
					{generatePriorityStars(row.priority)}
				</TableCell>
			</TableRow>

			<TableRow className={classes.rowBottom}>
				<TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
					<Collapse in={openMoreInfo} timeout="auto" unmountOnExit>
						<Box>
							<Table>
								<TableHead>
									<TableRow>
										<TableCell align="left">
											<Typography>Description</Typography>
										</TableCell>
										<TableCell align="left">Created by</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									<TableRow className={classes.tableRow}>
										<TableCell style={{ width: "100ch" }} align="left">
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

function TableToolbar(props) {
	const { numSelected } = props;
	const classes = useStyles();

	return (
		<Toolbar>
			{numSelected ? (
				<Typography>{numSelected} selected</Typography>
			) : (
				<Typography>Issues</Typography>
			)}
		</Toolbar>
	);
}
export default function Backlog() {
	const classes = useStyles();
	const getParams = useRef({ project_id: 71 });
	const [selectedIssues, setSelectedIssues] = useState([]);

	const { status, receivedData, error, isLoading, isResolved, isRejected } =
		useGetFetch(`api/issues/`, getParams.current);

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
		<Box>
			{isLoading ? <LinearProgress style={{ width: "100%" }} /> : null}
			{isRejected ? <Alert severity="error">{error} </Alert> : null}
			{isResolved && (
				<>
					<TableContainer component={Paper}>
						<TableToolbar numSelected={selectedIssues.length} />
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
								{receivedData.map((item) => (
									<Row
										handleSelectionClick={handleSelectionClick}
										selectedRows={selectedIssues}
										row={item}
										key={item.id}
									/>
								))}
							</TableBody>
						</Table>
					</TableContainer>
				</>
			)}
		</Box>
	);
}
