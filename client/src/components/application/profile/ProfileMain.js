import { useState, useRef, useEffect } from "react";
import {
	Box,
	makeStyles,
	AppBar,
	Tabs,
	Tab,
	Paper,
	Fab,
	CircularProgress,
} from "@material-ui/core";
import PropTypes from "prop-types";
import AddIcon from "@material-ui/icons/Add";
import { grey } from "@material-ui/core/colors";
import Alert from "@material-ui/lab/Alert";
import ProjectCard from "components/subComponents/ProjectCard";
import DialogForm from "components/subComponents/DialogForm";
import ProjectCreationForm from "components/forms/ProjectCreationForm";
import { useGetFetch, useDeleteFetch } from "customHooks/useFetch";

const useStyles = makeStyles((theme) => ({
	main: {
		[theme.breakpoints.up("md")]: {
			backgroundColor: grey[200],
			overflow: "auto",
			maxHeight: "80vh",
		},
		minHeight: "80vh",
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
ProjectComponentList.propTypes = {
	projectsList: PropTypes.array.isRequired,
	handleProjectDeletion: PropTypes.func.isRequired,
	renderProjectsActions: PropTypes.bool.isRequired,
};
function ProjectComponentList(props) {
	return (
		<>
			{props.projectsList.length
				? props.projectsList.map((item) => (
						<Box key={item.id} maxWidth="50ch" flex="1 1 40ch">
							<ProjectCard
								handleDelete={props.handleProjectDeletion}
								project={item}
								renderActions={props.renderProjectsActions}
							/>
						</Box>
				  ))
				: null}
		</>
	);
}

TabPanel.propTypes = {
	index: PropTypes.any.isRequired,
	value: PropTypes.any.isRequired,
	userId: PropTypes.number.isRequired,
	withProjectAdditionForm: PropTypes.bool.isRequired,
};
function TabPanel(props) {
	const [openProjectCreation, setOpenProjectCreation] = useState(false);
	const [startGetFetch, setStartGetFetch] = useState(false);
	const [projectIdToBeDeleted, setProjectIdToBeDeleted] = useState();
	const [projectsList, setProjectsList] = useState();
	const { isResolved: isResolvedDeleteProject } = useDeleteFetch(
		projectIdToBeDeleted ? `api/projects/${projectIdToBeDeleted}` : null
	);
	const getParams = useRef({
		user_id: "",
		user_type: tabs[props.index],
	});
	const { status, receivedData, error, isLoading, isResolved, isRejected } = useGetFetch(
		"api/projects/",
		getParams.current,
		startGetFetch
	);

	const handleProjectDeletion = (projectId) => {
		setProjectIdToBeDeleted(projectId);
	};

	useEffect(() => {
		if (!isResolvedDeleteProject) return;

		setProjectsList((projectsList) =>
			projectsList.filter((item) => item.id !== projectIdToBeDeleted)
		);
	}, [isResolvedDeleteProject]);

	const openProjectCreationForm = () => {
		setOpenProjectCreation(true);
	};

	const handleCancelProjectCreation = () => {
		setOpenProjectCreation(false);
	};

	const insertNewCreatedProject = (newProjectObj) => {
		handleCancelProjectCreation();
		setProjectsList((prevProjectList) => [newProjectObj].concat(prevProjectList));
	};

	useEffect(() => {
		getParams.current.user_id = props.userId;
		setStartGetFetch(true);
	}, [props.value, props.userId]);

	useEffect(() => {
		if (isResolved) {
			setStartGetFetch(false);
			setProjectsList(receivedData);
		}
	}, [isResolved, receivedData]);

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
					{isLoading ? (
						<Box>
							<CircularProgress />
						</Box>
					) : null}
					{isRejected ? <Alert severity="error">{error} </Alert> : null}
					{props.withProjectAdditionForm && (
						<Box alignSelf="center" width="100%">
							<Box display="flex" justifyContent="center">
								<Fab size="small" color="primary" onClick={openProjectCreationForm}>
									<AddIcon />
								</Fab>
							</Box>

							<DialogForm
								title="Create project"
								open={openProjectCreation}
								onClose={handleCancelProjectCreation}
								maxWidth="md"
							>
								<ProjectCreationForm
									insertNewCreatedProject={insertNewCreatedProject}
									productOwnerId={props.userId}
								/>
							</DialogForm>
						</Box>
					)}
					{isResolved && projectsList ? (
						<ProjectComponentList
							handleProjectDeletion={handleProjectDeletion}
							projectsList={projectsList}
							renderProjectsActions={props.withProjectAdditionForm}
						/>
					) : null}
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

	const classes = useStyles();

	function handleTabChange(event, newTab) {
		setCurrentTab(newTab);
	}

	return (
		<Paper className={classes.main} elevation={3}>
			{props.additionalUserInfo ? (
				<>
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
						withProjectAdditionForm={true}
						index={0}
					/>
					<TabPanel
						userId={props.additionalUserInfo.id}
						value={currentTab}
						index={1}
						withProjectAdditionForm={false}
					/>
					<TabPanel
						userId={props.additionalUserInfo.id}
						value={currentTab}
						index={2}
						withProjectAdditionForm={false}
					/>
				</>
			) : (
				<Alert severity="error">Failed To load any projects</Alert>
			)}
		</Paper>
	);
}
