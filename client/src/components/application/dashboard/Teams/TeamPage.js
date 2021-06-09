import { useState } from "react";
import {
	AppBar,
	Tabs,
	Tab,
	Typography,
	Box,
	Paper,
	makeStyles,
} from "@material-ui/core";

import { useParams } from "react-router-dom";
import { useGetFetch } from "customHooks/useFetch";
import TeamMembers from "./TeamMembers";
import Board from "./Board";
import { Alert } from "@material-ui/lab";
import { useProjectContext } from "contexts/ProjectContext";

const useStyles = makeStyles((theme) => ({
	toolbar: theme.mixins.toolbar,
}));

function TabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<Box
			role="tabpanel"
			hidden={value !== index}
			id={`nav-tabpanel-${index}`}
			{...other}
		>
			{value === index && <Box p={3}>{children}</Box>}
		</Box>
	);
}

export default function TeamPage() {
	const { currentUserRole } = useProjectContext();

	const classes = useStyles();
	let { teamId } = useParams();
	const [currentTab, setCurrentTab] = useState(0);

	const { status, receivedData, error, isLoading, isResolved, isRejected } =
		useGetFetch(`api/teams/${teamId}`);

	const handleTabChange = (event, newValue) => {
		setCurrentTab(newValue);
	};
	return (
		<>
			{isRejected ? <Alert severity="error">{error} </Alert> : null}
			{isResolved ? (
				<>
					<AppBar position="static" color="default">
						<Tabs
							indicatorColor="primary"
							textColor="primary"
							variant="scrollable"
							value={currentTab}
							onChange={handleTabChange}
						>
							<Tab label="Info" />
							<Tab label="Board" />
							<Tab label="Members" />
						</Tabs>
					</AppBar>

					<TabPanel value={currentTab} index={0}>
						<Paper>
							<Box p={2}>
								<Typography gutterBottom variant="h4">
									Description
								</Typography>
								<Typography variant="h6">
									{isResolved ? receivedData.description : null}
								</Typography>
							</Box>
						</Paper>
					</TabPanel>
					<TabPanel value={currentTab} index={1}>
						<Board
							currentUserRole={currentUserRole}
							teamId={receivedData.id}
							boardId={receivedData.trello_board_id}
						/>
					</TabPanel>
					<TabPanel value={currentTab} index={2}>
						<TeamMembers />
					</TabPanel>
				</>
			) : null}
		</>
	);
}
