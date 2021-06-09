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
						<Box key={item.id} flex="1 1 40ch">
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
	additionalUserInfo: PropTypes.object.isRequired,
};
function TabPanel(props) {
	const classes = useStyles();
	const { children, value, index, additionalUserInfo, ...other } = props;

	const [startGetFecth, setStartGetFetch] = useState(true);
	const getParams = useRef({
		user_id: additionalUserInfo.id,
		user_type: tabs[index],
	});

	const { status, receivedData, error, isLoading, isResolved, isRejected } =
		useGetFetch("api/projects/", getParams.current, startGetFecth);

	useEffect(() => {
		setStartGetFetch(true);
	}, [value, additionalUserInfo]);

	useEffect(() => {
		setStartGetFetch(false);
	}, [isResolved]);

	return (
		<Box
			maxWidth="100%"
			role="tabpanel"
			hidden={value !== index}
			id={`tabpanel-${index}`}
			aria-labelledby={`tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box
					maxWidth="100%"
					p={3}
					display="flex"
					flexWrap="wrap"
					justifyContent="center"
					alignItems="center"
					style={{ gap: "1rem" }}
				>
					{children}
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
				additionalUserInfo={props.additionalUserInfo}
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
				additionalUserInfo={props.additionalUserInfo}
				value={currentTab}
				index={1}
			/>
			<TabPanel
				additionalUserInfo={props.additionalUserInfo}
				value={currentTab}
				index={2}
			/>
		</Paper>
	);
}
