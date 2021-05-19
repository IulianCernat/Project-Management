import { useState, useEffect } from "react";
import {
	AppBar,
	Tabs,
	Tab,
	Typography,
	Button,
	Box,
	Paper,
	makeStyles,
} from "@material-ui/core";
import { useParams } from "react-router-dom";
import { useGetFetch } from "../../../customHooks/useFetch";
import { Alert } from "@material-ui/lab";
import UserProfile from "../../subComponents/UserProfileCard";
import { blue, blueGrey, indigo } from "@material-ui/core/colors";
import UserProfileCard from "../../subComponents/UserProfileCard";
import DialogForm from "../../subComponents/DialogForm";
import AddingDevsForm from "../../forms/AddingDevsForm";
const useStyles = makeStyles((theme) => ({
	membersTab: {
		display: "flex",
		flexFlow: "wrap row",
		gap: theme.spacing(6),
	},
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
function developersList(developersList) {
	return developersList.map((item) => (
		<UserProfileCard key={item.id} width={"30ch"} {...item}></UserProfileCard>
	));
}
export default function TeamPage() {
	const classes = useStyles();
	let { teamId } = useParams();
	const [currentTab, setCurrentTab] = useState(0);
	const [openDevAddition, setOpenDevAddition] = useState(false);
	const { status, receivedData, error, isLoading, isResolved, isRejected } =
		useGetFetch(`api/teams/${teamId}`);
	function openDevsAdditionForm() {
		setOpenDevAddition(true);
	}
	function handleCancel() {
		setOpenDevAddition(false);
	}
	const handleTabChange = (event, newValue) => {
		setCurrentTab(newValue);
	};

	return (
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
			<TabPanel value={currentTab} index={1} />
			<TabPanel value={currentTab} index={2}>
				{isResolved ? (
					<Box className={classes.membersTab}>
						<Box flex="0 0 auto">
							<Paper elevation={2}>
								<Box
									style={{ gap: "1rem" }}
									display="flex"
									flexWrap="wrap"
									mb={2}
									p={1}
									bgcolor={indigo["A100"]}
								>
									<Typography variant="h6">Scrum Master</Typography>

									<Button variant="contained" color="primary">
										<Typography>Change</Typography>
									</Button>
								</Box>
							</Paper>
							<Box display="flex" justifyContent="center">
								{receivedData.team_members.length ? (
									<UserProfile
										width={"30ch"}
										{...receivedData.team_members[0]}
									/>
								) : null}
							</Box>
						</Box>
						<Box flex={"1 1 0"}>
							<Paper elevation={2}>
								<Box
									display="flex"
									justifyContent="space-between"
									mb={2}
									p={1}
									bgcolor={indigo["A100"]}
								>
									<Typography variant="h6">Developers</Typography>
									<Button
										variant="contained"
										color="primary"
										onClick={() => openDevsAdditionForm()}
									>
										<Typography>Add new developers</Typography>
									</Button>
								</Box>
							</Paper>
							<Box
								style={{
									gap: "1rem",
								}}
								bgcolor="blueGrey.500"
								display="flex"
								flexWrap="wrap"
							>
								{developersList(receivedData.team_members.slice(1))}
								{developersList(receivedData.team_members.slice(1))}
								{developersList(receivedData.team_members.slice(1))}
								{developersList(receivedData.team_members.slice(1))}
								{developersList(receivedData.team_members.slice(1))}
								{developersList(receivedData.team_members.slice(1))}
								{developersList(receivedData.team_members.slice(1))}
								{developersList(receivedData.team_members.slice(1))}
							</Box>
						</Box>
					</Box>
				) : null}
			</TabPanel>

			<Typography>
				{isLoading ? "loading" : null}
				{isRejected ? <Alert severity="error">{error} </Alert> : null}
			</Typography>
			<DialogForm
				title="Add new team"
				open={openDevAddition}
				onClose={handleCancel}
			>
				<AddingDevsForm teamId={teamId} />
			</DialogForm>
		</>
	);
}
