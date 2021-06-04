import { useState, useRef, useEffect } from "react";
import {
	Box,
	makeStyles,
	AppBar,
	Tabs,
	Tab,
	Paper,
	Typography,
	Fab,
} from "@material-ui/core";
import PropTypes from "prop-types";
import AddIcon from "@material-ui/icons/Add";
import { grey } from "@material-ui/core/colors";
import Alert from "@material-ui/lab/Alert";
import ProjectCard from "../../subComponents/ProjectCard";
import DialogForm from "../../subComponents/DialogForm";
import ProjectCreationForm from "../../forms/ProjectCreationForm";
import { useGetFetch } from "../../../customHooks/useFetch";
import { useAuth } from "contexts/AuthContext";

const useStyles = makeStyles((theme) => ({
	main: {
		minHeight: "75vh",
		backgroundColor: grey[200],
	},
	textWrapper: {
		maxWidth: "100%",
		wordWrap: "break-word",
	},
	tabPanel: {
		display: "flex",
		flexFlow: "column wrap",
		"&>:not(:first-child)": {
			marginTop: theme.spacing(2),
		},
	},
}));

const tabs = {
	0: "productOwner",
	1: "scrumMaster",
	2: "developer",
};
function ProjectComponentList(projectList, currentUserRole) {
	return (
		<>
			{projectList.length
				? projectList.map((item) => (
						<ProjectCard
							currentUserRole={currentUserRole}
							key={item.id}
							{...item}
						/>
				  ))
				: null}
		</>
	);
}

TabPanel.propTypes = {
	children: PropTypes.node,
	index: PropTypes.any.isRequired,
	value: PropTypes.any.isRequired,
};
function TabPanel(props) {
	const classes = useStyles();
	const { children, value, index, ...other } = props;
	const { additionalUserInfo } = useAuth();
	const [startGetFecth, setStartGetFetch] = useState(true);
	const getParams = useRef({
		user_id: additionalUserInfo.id,
		user_type: tabs[index],
	});

	const { status, receivedData, error, isLoading, isResolved, isRejected } =
		useGetFetch("api/projects/", getParams.current, startGetFecth);

	useEffect(() => {
		setStartGetFetch(true);
	}, [value]);

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
					className={classes.tabPanel}
					p={3}
					display="flex"
					flexDirection="column"
				>
					{isResolved ? ProjectComponentList(receivedData, tabs[index]) : null}
					{isLoading ? "loading" : null}
					{isRejected ? <Alert severity="error">{error} </Alert> : null}
					{children}
				</Box>
			)}
		</Box>
	);
}

export default function ProfileMain() {
	const [currentTab, setCurrentTab] = useState(0);
	const [openProjectCreation, setOpenProjectCreation] = useState(false);
	const { additionalUserInfo } = useAuth();
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
			<TabPanel value={currentTab} index={0}>
				<Box alignSelf="flex-end">
					<Fab color="primary" onClick={openProjectCreationForm}>
						<AddIcon />
					</Fab>
					<DialogForm
						title="Create project"
						open={openProjectCreation}
						onClose={handleCancel}
					>
						<ProjectCreationForm productOwnerId={additionalUserInfo.id} />
					</DialogForm>
				</Box>
			</TabPanel>
			<TabPanel value={currentTab} index={1} />
			<TabPanel value={currentTab} index={2} />
		</Paper>
	);
}
