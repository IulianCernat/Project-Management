import { useState, useEffect, useRef } from "react";
import {
	Typography,
	Button,
	Box,
	Paper,
	makeStyles,
	LinearProgress,
} from "@material-ui/core";
import { useParams } from "react-router-dom";
import { useGetFetch } from "customHooks/useFetch";
import { Alert } from "@material-ui/lab";
import UserProfile from "components/subComponents/UserProfileCard";
import { indigo } from "@material-ui/core/colors";
import DialogForm from "components/subComponents/DialogForm";
import AddingDevsForm from "components/forms/AddingDevsForm";
import DevelopersList from "./DevelopersList";

const useStyles = makeStyles((theme) => ({
	membersTab: {
		display: "flex",
		flexFlow: "wrap row",
		gap: theme.spacing(6),
	},
}));

export default function TeamMembers() {
	const { teamId } = useParams();
	const [reRender, setReRender] = useState(false);
	const [startFetching, setStartFetching] = useState(true);
	const classes = useStyles();
	const [openDevAddition, setOpenDevAddition] = useState(false);
	const getParams = useRef({ team_id: teamId });
	const { status, receivedData, error, isLoading, isResolved, isRejected } =
		useGetFetch(`api/teams_members/`, getParams.current, startFetching);

	function openDevsAdditionForm() {
		setStartFetching(false);
		setOpenDevAddition(true);
	}
	function handleCancel() {
		setStartFetching(false);
		setOpenDevAddition(false);
	}

	useEffect(() => {
		setStartFetching(false);
	}, []);

	useEffect(() => {
		setStartFetching(true);
	}, [reRender]);

	return (
		<Box className={classes.membersTab}>
			{isLoading ? <LinearProgress style={{ width: "100%" }} /> : null}
			<Typography>
				{isRejected ? <Alert severity="error">{error} </Alert> : null}
			</Typography>
			{isResolved && (
				<>
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
							{receivedData?.length ? (
								<UserProfile width={"30ch"} {...receivedData[0]} />
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
							{isResolved && receivedData?.length ? (
								<DevelopersList developers={receivedData.slice(1)} />
							) : null}
						</Box>
					</Box>
					<DialogForm
						title="Add new team member"
						open={openDevAddition}
						onClose={handleCancel}
					>
						<AddingDevsForm
							teamId={teamId}
							setReRenderTopComponent={setReRender}
						/>
					</DialogForm>
				</>
			)}
		</Box>
	);
}
