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
	const [devAdditionSuccess, setDevAdditionSuccess] = useState(false);
	const [startFetchingDevs, setStartFetchingDevs] = useState(true);
	const classes = useStyles();
	const [openDevAddition, setOpenDevAddition] = useState(false);
	const getParams = useRef({ team_id: teamId });
	const { status, receivedData, error, isLoading, isResolved, isRejected } =
		useGetFetch(`api/teams_members/`, getParams.current, startFetchingDevs);

	function openDevsAdditionForm() {
		setOpenDevAddition(true);
	}
	function handleCancel() {
		setOpenDevAddition(false);
	}

	useEffect(() => {
		if (devAdditionSuccess) {
			setStartFetchingDevs(true);
			handleCancel();
			setDevAdditionSuccess(false);
		}
	}, [devAdditionSuccess]);

	useEffect(() => {
		if (startFetchingDevs) setStartFetchingDevs(false);
	}, [startFetchingDevs]);

	return (
		<Box className={classes.membersTab}>
			{isLoading ? <LinearProgress style={{ width: "100%" }} /> : null}

			{isRejected ? <Alert severity="error">{error} </Alert> : null}

			{isResolved && (
				<>
					<DialogForm
						title="Add new team member"
						open={openDevAddition}
						onClose={handleCancel}
					>
						<AddingDevsForm
							teamId={teamId}
							setDevAdditionSuccess={setDevAdditionSuccess}
						/>
					</DialogForm>
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
				</>
			)}
		</Box>
	);
}
