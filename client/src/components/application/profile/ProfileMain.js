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
	Button,
} from "@material-ui/core";
import PropTypes from "prop-types";
import AddIcon from "@material-ui/icons/Add";
import { grey } from "@material-ui/core/colors";
import Alert from "@material-ui/lab/Alert";
import ProjectCard from "components/subComponents/ProjectCard";
import DialogForm from "components/subComponents/DialogForm";
import ProjectCreationForm from "components/forms/ProjectCreationForm";
import { useGetFetch, useDeleteFetch } from "customHooks/useFetch";
import CreateTeacherAccountForm from "components/forms/CreateTeacherAccountForm";
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
	userType: PropTypes.string.isRequired,
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
		user_type: props.userType,
	});
	const { receivedData, error, isLoading, isResolved, isRejected } = useGetFetch(
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
		if (props.index !== props.value) {
			setProjectsList([]);
			return;
		}
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
					{isLoading ? <CircularProgress /> : null}
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

function AdminManageTeachersPanel(props) {
	const [openTeacherCreation, setOpenTeacherCreation] = useState(false);

	const handleCancelTeacherCreation = () => {
		setOpenTeacherCreation(false);
	};
	const handleOpenTeacherCreationForm = () => {
		setOpenTeacherCreation(true);
	};
	return (
		<Box p={3} maxWidth="100%" role="tabpanel" hidden={props.value !== props.index}>
			<Button variant="outlined" onClick={handleOpenTeacherCreationForm}>
				Create teacher account
			</Button>

			<DialogForm
				title="Create teacher account"
				open={openTeacherCreation}
				onClose={handleCancelTeacherCreation}
				maxWidth="md"
			>
				<CreateTeacherAccountForm currentUser={props.currentUser} />
			</DialogForm>
		</Box>
	);
}

function AdminManageStudentsPanel(props) {
	return <Box maxWidth="100%" role="tabpanel" hidden={props.value !== props.index}></Box>;
}

function TabsWrapper(props) {
	return (
		<Tabs
			value={props.currentTab}
			onChange={props.handleTabChange}
			textColor="primary"
			indicatorColor="primary"
			variant="scrollable"
			scrollButtons="auto"
		>
			{props.children}
		</Tabs>
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
						{props.additionalUserInfo.firebaseUserClaims.admin ? (
							<TabsWrapper currentTab={currentTab} handleTabChange={handleTabChange}>
								<Tab label="Manage Teachers" />
								<Tab label="Manage Students" />
							</TabsWrapper>
						) : props.additionalUserInfo.firebaseUserClaims.teacher ? (
							<TabsWrapper currentTab={currentTab} handleTabChange={handleTabChange}>
								<Tab label="Product Owner" />
							</TabsWrapper>
						) : (
							<TabsWrapper currentTab={currentTab} handleTabChange={handleTabChange}>
								<Tab label="Scrum Master" />
								<Tab label="Developer" />
							</TabsWrapper>
						)}
					</AppBar>
					{props.additionalUserInfo.firebaseUserClaims.admin ? (
						<>
							<AdminManageTeachersPanel
								currentUser={props.currentUser}
								value={currentTab}
								index={0}
							/>
							<AdminManageStudentsPanel
								currentUser={props.currentUser}
								value={currentTab}
								index={1}
							/>
						</>
					) : props.additionalUserInfo.firebaseUserClaims.teacher ? (
						<TabPanel
							userId={props.additionalUserInfo.id}
							value={currentTab}
							withProjectAdditionForm={true}
							index={0}
							userType="productOwner"
						/>
					) : (
						<>
							<TabPanel
								userId={props.additionalUserInfo.id}
								value={currentTab}
								index={0}
								withProjectAdditionForm={false}
								userType="scrumMaster"
							/>
							<TabPanel
								userId={props.additionalUserInfo.id}
								value={currentTab}
								index={1}
								withProjectAdditionForm={false}
								userType="developer"
							/>
						</>
					)}
				</>
			) : null}
		</Paper>
	);
}
