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
	const [teamFetchedObject, setTeamFetchedObject] = useState();
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

	const handleTeamFieldsUpdate = (newFieldValuesObj) => {
		console.log(newFieldValuesObj);
		for (const [fieldName, newFieldValue] of Object.entries(newFieldValuesObj))
			teamFetchedObject[fieldName] = newFieldValue;
		setTeamFetchedObject({ ...teamFetchedObject });
	};

	useEffect(() => {
		if (getTeamFetchStatus.isResolved) {
			setCurrentUserTeamRole(getTeamRole());
			setTeamFetchedObject(getTeamFetchStatus.receivedData);
		}
		/* eslint-disable*/
	}, [getTeamFetchStatus]);

	return (
		<>
			{getTeamFetchStatus.isLoading && <LinearProgress style={{ width: "100%" }} />}
			{getTeamFetchStatus.isRejected ? <Alert severity="error">{getTeamFetchStatus.error} </Alert> : null}
			{teamFetchedObject && currentUserTeamRole ? (
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
							handleTeamFieldsUpdate={handleTeamFieldsUpdate}
							currentUserTeamRole={currentUserTeamRole}
							teamId={Number(teamId)}
							description={teamFetchedObject.description}
							version_control_link={teamFetchedObject.version_control_link}
							name={teamFetchedObject.name}
							nrMembers={teamFetchedObject.team_members.length}
							currentUserRole={currentUserRole}
						/>
					</TabPanel>
					<TabPanel value={currentTab} index={1}>
						<Board
							handleTeamFieldsUpdate={handleTeamFieldsUpdate}
							currentUserTeamRole={currentUserTeamRole}
							currentUserRole={currentUserRole}
							teamId={Number(teamFetchedObject.id)}
							boardId={teamFetchedObject.trello_board_id}
						/>
					</TabPanel>
					<TabPanel value={currentTab} index={2}>
						<TeamMembers
							handleTeamFieldsUpdate={handleTeamFieldsUpdate}
							currentUserTeamRole={currentUserTeamRole}
						/>
					</TabPanel>
					<TabPanel value={currentTab} index={3}>
						<TeamMessages currentUserTeamRole={currentUserTeamRole} teamId={Number(teamFetchedObject.id)} />
					</TabPanel>
				</>
			) : null}
		</>
	);
}
