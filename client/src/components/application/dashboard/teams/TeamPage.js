import { useState, useEffect, useCallback } from "react";
import { AppBar, Tabs, Tab, Box, LinearProgress } from "@material-ui/core";
import { useParams } from "react-router-dom";
import { useGetFetch } from "customHooks/useFetch";
import { useAuth } from "contexts/AuthContext";
import TeamMembers from "./TeamMembers";
import TeamMessages from "./TeamMessages";
import Board from "./Board";
import { Alert } from "@material-ui/lab";
import { useProjectContext } from "contexts/ProjectContext";
import TeamInfo from "./TeamInfo";

function TabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<Box role="tabpanel" hidden={value !== index} id={`nav-tabpanel-${index}`} {...other}>
			{value === index && <Box pt={3}>{children}</Box>}
		</Box>
	);
}

export default function TeamPage() {
	const { currentUserRole } = useProjectContext();
	const { additionalUserInfo } = useAuth();
	let { teamId } = useParams();
	const [currentTab, setCurrentTab] = useState(0);
	const [currentUserTeamRole, setCurrentUserTeamRole] = useState();
	const getTeamFetchStatus = useGetFetch(`api/teams/${teamId}`);

	const getTeamRole = useCallback(() => {
		// returns developer, scrumMaster or outsider
		const currentUserTeamProfile = getTeamFetchStatus.receivedData.team_members.find(
			(item) => item.user_id === additionalUserInfo.id
		);
		if (currentUserTeamProfile) return currentUserTeamProfile.user_type;

		return "outsider";
	}, [additionalUserInfo, getTeamFetchStatus]);

	const handleTabChange = (event, newValue) => {
		setCurrentTab(newValue);
	};

	useEffect(() => {
		if (getTeamFetchStatus.isResolved) setCurrentUserTeamRole(getTeamRole());
		/* eslint-disable*/
	}, [getTeamFetchStatus]);

	return (
		<>
			{getTeamFetchStatus.isLoading && <LinearProgress style={{ width: "100%" }} />}
			{getTeamFetchStatus.isRejected ? <Alert severity="error">{getTeamFetchStatus.error} </Alert> : null}
			{getTeamFetchStatus.isResolved && currentUserTeamRole ? (
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
							<Tab label="Messages" disabled={currentUserTeamRole === "outsider"} />
						</Tabs>
					</AppBar>

					<TabPanel value={currentTab} index={0}>
						<TeamInfo
							currentUserTeamRole={currentUserTeamRole}
							teamId={Number(teamId)}
							description={getTeamFetchStatus.receivedData.description}
							version_control_link={getTeamFetchStatus.receivedData.version_control_link}
							name={getTeamFetchStatus.receivedData.name}
							nrMembers={getTeamFetchStatus.receivedData.team_members.length}
							currentUserRole={currentUserRole}
						/>
					</TabPanel>
					<TabPanel value={currentTab} index={1}>
						<Board
							currentUserTeamRole={currentUserTeamRole}
							currentUserRole={currentUserRole}
							teamId={Number(getTeamFetchStatus.receivedData.id)}
							boardId={getTeamFetchStatus.receivedData.trello_board_id}
						/>
					</TabPanel>
					<TabPanel value={currentTab} index={2}>
						<TeamMembers currentUserTeamRole={currentUserTeamRole} />
					</TabPanel>
					<TabPanel value={currentTab} index={3}>
						<TeamMessages
							currentUserTeamRole={currentUserTeamRole}
							teamId={Number(getTeamFetchStatus.receivedData.id)}
						/>
					</TabPanel>
				</>
			) : null}
		</>
	);
}
