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
	lighten,
	Button,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import {
	Star,
	StarOutline,
	KeyboardArrowUp,
	KeyboardArrowDown,
} from "@material-ui/icons";
import { useEffect, useRef, useState } from "react";
import { useGetFetch, usePostFetch } from "customHooks/useFetch";
import { green, pink, blue, purple } from "@material-ui/core/colors";
import IssueCreationForm from "components/forms/IssueCreationForm";
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

IssueRow.propTypes = {
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
export default function IssueRow(props) {
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
			<TableRow classes={{ root: classes.rowTop }} selected={isSelected}>
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

			<TableRow classes={{ root: classes.rowTop }}>
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
