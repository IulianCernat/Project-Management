import { useState } from "react";
import { AppBar, Tabs, Tab, Box, LinearProgress } from "@material-ui/core";
import { useParams } from "react-router-dom";
import { useGetFetch } from "customHooks/useFetch";
import TeamMembers from "./TeamMembers";
import Board from "./Board";
import { Alert } from "@material-ui/lab";
import { useProjectContext } from "contexts/ProjectContext";
import TeamInfo from "./TeamInfo";

function TabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<Box role="tabpanel" hidden={value !== index} id={`nav-tabpanel-${index}`} {...other}>
			{value === index && <Box p={3}>{children}</Box>}
		</Box>
	);
}

export default function TeamPage() {
	const { currentUserRole } = useProjectContext();
	let { teamId } = useParams();
	const [currentTab, setCurrentTab] = useState(0);
	const { receivedData, error, isLoading, isResolved, isRejected } = useGetFetch(
		`api/teams/${teamId}`
	);

	const handleTabChange = (event, newValue) => {
		setCurrentTab(newValue);
	};
	return (
		<>
			{isLoading && <LinearProgress style={{ width: "100%" }} />}
			{isRejected ? <Alert severity="error">{error} </Alert> : null}
			{isResolved ? (
				<Box style={{ overflow: "hidden", width: "100%" }}>
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
						<TeamInfo
							teamId={Number(teamId)}
							description={receivedData.description}
							version_control_link={receivedData.version_control_link}
							name={receivedData.name}
							nrMembers={receivedData.team_members.length}
							currentUserRole={currentUserRole}
						/>
					</TabPanel>
					<TabPanel value={currentTab} index={1}>
						<Board
							currentUserRole={currentUserRole}
							teamId={Number(receivedData.id)}
							boardId={receivedData.trello_board_id}
						/>
					</TabPanel>
					<TabPanel value={currentTab} index={2}>
						<TeamMembers />
					</TabPanel>
				</Box>
			) : null}
		</>
	);
}
