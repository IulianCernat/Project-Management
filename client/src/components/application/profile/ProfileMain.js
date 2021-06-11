import { useState, useRef, useEffect } from "react";
import {
	Box,
	makeStyles,
	AppBar,
	Tabs,
	Tab,
	Paper,
	Fab,
	LinearProgress,
} from "@material-ui/core";
import PropTypes from "prop-types";
import AddIcon from "@material-ui/icons/Add";
import { grey } from "@material-ui/core/colors";
import Alert from "@material-ui/lab/Alert";
import ProjectCard from "../../subComponents/ProjectCard";
import DialogForm from "../../subComponents/DialogForm";
import ProjectCreationForm from "../../forms/ProjectCreationForm";
import { useGetFetch } from "../../../customHooks/useFetch";

const useStyles = makeStyles((theme) => ({
	main: {
		minHeight: "75vh",
		backgroundColor: grey[200],
	},
	textWrapper: {
		maxWidth: "100%",
		wordWrap: "break-word",
	},
}));

const tabs = {
	0: "productOwner",
	1: "scrumMaster",
	2: "developer",
};
function ProjectComponentList(projectList) {
	return (
		<>
			{projectList.length
				? projectList.map((item) => (
						<Box key={item.id} maxWidth="50ch" flex="1 1 40ch">
							<ProjectCard project={item} />
						</Box>
				  ))
				: null}
		</>
	);
}

TabPanel.propTypes = {
	children: PropTypes.node,
	index: PropTypes.any.isRequired,
	value: PropTypes.any.isRequired,
	userId: PropTypes.number.isRequired,
};
function TabPanel(props) {
	const classes = useStyles();
	const [startGetFetch, setStartGetFetch] = useState(false);
	const getParams = useRef({
		user_id: "",
		user_type: tabs[props.index],
	});

	const { status, receivedData, error, isLoading, isResolved, isRejected } =
		useGetFetch("api/projects/", getParams.current, startGetFetch);

	useEffect(() => {
		getParams.current.user_id = props.userId;
		setStartGetFetch(true);
	}, [props.value, props.userId]);

	useEffect(() => {
		if (isResolved) setStartGetFetch(false);
	}, [isResolved]);

	return (
		<Box maxWidth="100%" role="tabpanel" hidden={props.value !== props.index}>
			{props.value === props.index && (
				<Box
					maxWidth="100%"
					p={3}
					display="flex"
					flexWrap="wrap"
					justifyContent="center"
					alignItems="center"
					style={{ gap: "1rem" }}
				>
					{props.children}
					{isResolved ? ProjectComponentList(receivedData) : null}
					{isLoading ? (
						<Box width="100%">
							<LinearProgress />
						</Box>
					) : null}
					{isRejected ? <Alert severity="error">{error} </Alert> : null}
				</Box>
			)}
		</Box>
	);
}

ProfileMain.propTypes = {
	additionalUserInfo: PropTypes.object.isRequired,
	currentUser: PropTypes.object.isRequired,
};
export default function ProfileMain(props) {
	const [currentTab, setCurrentTab] = useState(0);
	const [openProjectCreation, setOpenProjectCreation] = useState(false);
	const classes = useStyles();

	function handleTabChange(event, newTab) {
		setCurrentTab(newTab);
	}

	function openProjectCreationForm() {
		setOpenProjectCreation(true);
	}
	function handleCancel() {
		setOpenProjectCreation(false);
	}

	return (
		<Paper className={classes.main} elevation={3}>
			<AppBar position="sticky" color="default">
				<Tabs
					value={currentTab}
					onChange={handleTabChange}
					textColor="primary"
					indicatorColor="primary"
					variant="scrollable"
					scrollButtons="auto"
				>
					<Tab label="Product Owner" />
					<Tab label="Scrum Master" />
					<Tab label="Developer" />
				</Tabs>
			</AppBar>
			<TabPanel
				userId={props.additionalUserInfo.id}
				value={currentTab}
				index={0}
			>
				<Box alignSelf="center" width="100%">
					<Box display="flex" justifyContent="center">
						<Fab color="primary" onClick={openProjectCreationForm}>
							<AddIcon />
						</Fab>
					</Box>

					<DialogForm
						title="Create project"
						open={openProjectCreation}
						onClose={handleCancel}
					>
						<ProjectCreationForm productOwnerId={props.additionalUserInfo.id} />
					</DialogForm>
				</Box>
			</TabPanel>
			<TabPanel
				userId={props.additionalUserInfo.id}
				value={currentTab}
				index={1}
			/>
			<TabPanel
				userId={props.additionalUserInfo.id}
				value={currentTab}
				index={2}
			/>
		</Paper>
	);
}
