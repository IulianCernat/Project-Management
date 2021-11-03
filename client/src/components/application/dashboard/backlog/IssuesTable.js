import { useRef, useCallback, useState, useEffect } from "react";
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
	Toolbar,
	Button,
	lighten,
	IconButton,
	Popover,
	Divider,
	Chip,
	ListItem,
	List,
	ListSubheader,
	MenuItem,
} from "@material-ui/core";

import { green, pink, blue } from "@material-ui/core/colors";
import PropTypes from "prop-types";
import IssueRow, { IssueTypesChip } from "./IssueRow";
import { ArrowDownward, ArrowUpward, MoreVert, FilterList, Star } from "@material-ui/icons";
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

function ColumnFilter({
	anchorEl,
	open,
	onClose,
	filterOptions,
	filterHandler,
	columnName,
	setFilteredColumnValue,
}) {
	const handleSelectFilter = (event, index) => {
		filterHandler(columnName, Object.keys(filterOptions)[index]);
		setFilteredColumnValue(filterOptions[index]);
		onClose();
	};
	return (
		<Popover
			anchorEl={anchorEl}
			open={open}
			onClose={onClose}
			anchorOrigin={{
				vertical: "bottom",
				horizontal: "right",
			}}
			transformOrigin={{
				vertical: "top",
				horizontal: "right",
			}}
		>
			<List
				subheader={
					<ListSubheader component="div" id="nested-list-subheader">
						Display only
					</ListSubheader>
				}
			>
				{Object.entries(filterOptions).map((filter, index) => (
					<ListItem
						alignItems="center"
						dense
						key={index}
						button
						onClick={(event) => handleSelectFilter(event, index)}
					>
						<Box m="auto">{filter[1]}</Box>
					</ListItem>
				))}
			</List>
		</Popover>
	);
}

TableHeaderColumn.propTypes = {
	columnName: PropTypes.string.isRequired,
	sortHandler: PropTypes.func.isRequired,
	isFilterable: PropTypes.bool.isRequired,
	filterHandler: PropTypes.func,
	currentSortOrder: PropTypes.oneOf(["asc", "desc", "null"]).isRequired,
	sortBy: PropTypes.oneOf(["string", "date", "number"]).isRequired,
	clearFilter: PropTypes.func,
	currentFilteredColumnNames: PropTypes,
	facadeColumnName: PropTypes.string.isRequired,
};
function TableHeaderColumn({
	columnName,
	sortHandler,
	isFilterable,
	filterHandler,
	currentSortOrder,
	sortBy,
	filterOptions,
	clearFilter,
	currentFilteredColumnNames,
	facadeColumnName,
}) {
	const [filterColumnAchorEl, setFilterColumnAchorEl] = useState(null);
	const [filteredColumnValue, setFilteredColumnValue] = useState(null);
	const openFilterOptions = Boolean(filterColumnAchorEl);

	const handleOpenFilterClick = (event) => {
		setFilterColumnAchorEl(event.target);
	};

	const handleCloseFilterClick = () => {
		setFilterColumnAchorEl(null);
	};

	return (
		<Box flexDirection="row" display="flex" alignItems="center" justifyContent="center">
			{currentSortOrder === "desc" ? (
				<IconButton
					size="small"
					onClick={() => {
						sortHandler(columnName, sortBy, "asc");
					}}
				>
					<ArrowDownward fontSize="small" color="action" />
				</IconButton>
			) : currentSortOrder === "asc" ? (
				<IconButton
					size="small"
					onClick={() => {
						sortHandler(columnName, sortBy, "desc");
					}}
				>
					<ArrowUpward fontSize="small" color="action" />
				</IconButton>
			) : (
				<IconButton
					size="small"
					onClick={() => {
						sortHandler(columnName, sortBy, "asc");
					}}
				>
					<ArrowUpward fontSize="small" color="disabled" />
				</IconButton>
			)}
			<Typography variant="button" align="center">
				{facadeColumnName}
			</Typography>
			{!isFilterable ? null : (
				<>
					{currentFilteredColumnNames.includes(columnName) && (
						<IconButton
							size="small"
							onClick={() => {
								clearFilter(columnName, filteredColumnValue);
							}}
						>
							<FilterList fontSize="small" />
						</IconButton>
					)}

					<IconButton size="small" onClick={handleOpenFilterClick}>
						<MoreVert fontSize="small" color="action" />
					</IconButton>
					<ColumnFilter
						anchorEl={filterColumnAchorEl}
						open={openFilterOptions}
						onClose={handleCloseFilterClick}
						filterHandler={filterHandler}
						filterOptions={filterOptions}
						columnName={columnName}
						setFilteredColumnValue={setFilteredColumnValue}
					/>
				</>
			)}
		</Box>
	);
}

IssuesTable.propTypes = {
	isSprintIssuesTable: PropTypes.bool.isRequired,
	issuesTableProps: PropTypes.oneOfType([
		PropTypes.exact({
			handleMoveIssueClick: PropTypes.func.isRequired,
			handleCopyIssueToTrelloClick: PropTypes.func.isRequired,
			issuesList: PropTypes.array.isRequired,
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
		openIssueCreationDialog,
		openSprintCreationDialog,
		openTransferIssuesToSprintDialog,
		setSelectedIssues,
		selectedIssues,
		handleDeleteIssueClick,
		isLoadingDeleteIssue,
		issuesList,
		handleMoveIssueClick,
		handleCopyIssueToTrelloClick,
	} = props.issuesTableProps;
	const [tableIssues, setTableIssues] = useState([...issuesList]);
	const [currentSortOrder, setCurrentSortOrder] = useState();
	const [currentSortedColumnName, setCurrentSortedColumnName] = useState();
	const [currentFilteredColumnNames, setCurrentFilteredColumnNames] = useState([]);
	const { currentUserRole } = useProjectContext();

	const sortByColumn = (columnName, sortBy, sortingType) => {
		switch (sortingType) {
			case "asc": {
				switch (sortBy) {
					case "string": {
						setTableIssues([
							...tableIssues.sort((firstItem, secondItem) =>
								firstItem[columnName].localeCompare(secondItem[columnName])
							),
						]);
						break;
					}
					case "number": {
						setTableIssues([
							...tableIssues.sort(
								(firstItem, secondItem) =>
									firstItem[columnName] - secondItem[columnName]
							),
						]);
						break;
					}
					case "date": {
						setTableIssues([
							...tableIssues.sort(
								(firstItem, secondItem) =>
									new Date(firstItem[columnName]) -
									new Date(secondItem[columnName])
							),
						]);
						break;
					}
					default:
						break;
				}
				setCurrentSortOrder("asc");

				break;
			}
			case "desc": {
				switch (sortBy) {
					case "string": {
						setTableIssues([
							...tableIssues.sort((firstItem, secondItem) =>
								secondItem[columnName].localeCompare(firstItem[columnName])
							),
						]);
						break;
					}
					case "number": {
						setTableIssues([
							...tableIssues.sort(
								(firstItem, secondItem) =>
									secondItem[columnName] - firstItem[columnName]
							),
						]);
						break;
					}
					case "date": {
						setTableIssues([
							...tableIssues.sort(
								(firstItem, secondItem) =>
									new Date(secondItem[columnName]) -
									new Date(firstItem[columnName])
							),
						]);
						break;
					}
					default: {
						break;
					}
				}
				setCurrentSortOrder("desc");
				break;
			}
			default:
				break;
		}
		setCurrentSortedColumnName(columnName);
	};

	const filterByColumn = (columnName, value) => {
		setTableIssues(
			tableIssues.map((issue) => {
				if (issue[columnName] === value) issue["filteredColumns"].add(columnName);
				else issue["filteredColumns"].delete(columnName);

				return issue;
			})
		);
		if (!currentFilteredColumnNames.includes(columnName))
			setCurrentFilteredColumnNames([...currentFilteredColumnNames, columnName]);
	};

	const clearColumnFilter = (columnName, value) => {
		setTableIssues(
			tableIssues.map((issue) => {
				if (issue[columnName] === value && value)
					issue["filteredColumns"].delete(columnName);
				return issue;
			})
		);

		setCurrentFilteredColumnNames([
			...currentFilteredColumnNames.filter((item) => item !== columnName),
		]);
	};

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

	useEffect(() => {
		setTableIssues([
			...issuesList.map((issue) => {
				issue["filteredColumns"] = new Set();
				if (!issue.trello_card_list_name) issue["trello_card_list_name"] = "Unknown";
				return issue;
			}),
		]);
	}, [issuesList]);

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
					<Table className={classes.table}>
						<TableHead>
							<TableRow>
								<TableCell />
								<TableCell />
								<TableCell padding="none" align="center">
									<TableHeaderColumn
										columnName="type"
										facadeColumnName="type"
										sortHandler={sortByColumn}
										sortBy="string"
										isFilterable={true}
										filterHandler={filterByColumn}
										currentSortOrder={
											currentSortedColumnName === "type"
												? currentSortOrder
												: "null"
										}
										sortByString={true}
										filterOptions={{
											bug: <IssueTypesChip type="bug" />,
											task: <IssueTypesChip type="task" />,
											story: <IssueTypesChip type="story" />,
										}}
										clearFilter={clearColumnFilter}
										currentFilteredColumnNames={currentFilteredColumnNames}
									/>
								</TableCell>
								<TableCell align="left">
									<Typography variant="button">Title</Typography>
								</TableCell>
								{isSprintIssuesTable && (
									<TableCell align="left">
										<TableHeaderColumn
											columnName="trello_card_list_name"
											facadeColumnName="status"
											sortHandler={sortByColumn}
											isFilterable={true}
											currentSortOrder={
												currentSortedColumnName === "trello_card_list_name"
													? currentSortOrder
													: "null"
											}
											sortBy="string"
											filterOptions={{
												Pending: "Pending",
												"In progress": "In progress",
												Done: "Done",
												Unknown: "Unknown",
											}}
											filterHandler={filterByColumn}
											clearFilter={clearColumnFilter}
											currentFilteredColumnNames={currentFilteredColumnNames}
										/>
									</TableCell>
								)}
								<TableCell align="center">
									<TableHeaderColumn
										columnName="created_at"
										facadeColumnName="created at"
										sortHandler={sortByColumn}
										sortBy="date"
										isFilterable={false}
										currentSortOrder={
											currentSortedColumnName === "created_at"
												? currentSortOrder
												: "null"
										}
										sortByString={true}
									/>
								</TableCell>
								<TableCell align="center">
									<TableHeaderColumn
										columnName="priority"
										facadeColumnName="priority"
										isFilterable={false}
										filterHandler={filterByColumn}
										sortHandler={sortByColumn}
										sortBy="number"
										currentSortOrder={
											currentSortedColumnName === "priority"
												? currentSortOrder
												: "null"
										}
										sortByString={true}
										filterOptions={Object.fromEntries(
											Array.from({ length: 6 }, (item, index) => `${index}`)
												.slice(1)
												.map((item) => [
													item,
													<Box
														display="flex"
														alignItems="center"
														style={{ gap: "2px" }}
													>
														<Typography>{item}</Typography>
														<Star fontSize="small" />
													</Box>,
												])
										)}
										clearFilter={clearColumnFilter}
										currentFilteredColumnNames={currentFilteredColumnNames}
									/>
								</TableCell>
								<TableCell />
							</TableRow>
						</TableHead>
						<TableBody>
							{tableIssues
								.filter((item) => {
									if (currentFilteredColumnNames.length === 0) return true;

									if (!item["filteredColumns"].size) return false;

									return currentFilteredColumnNames.every((filteredColumnName) =>
										item["filteredColumns"].has(filteredColumnName)
									);
								})
								.map((item) => (
									<IssueRow
										handleMoveIssueClick={handleMoveIssueClick}
										handleCopyIssueToTrelloClick={handleCopyIssueToTrelloClick}
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
