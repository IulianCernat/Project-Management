import { useState, useEffect } from "react";
import {
	Box,
	makeStyles,
	Backdrop,
	CircularProgress,
	Snackbar,
	IconButton,
} from "@material-ui/core";
import { useDeleteFetch } from "customHooks/useFetch";
import { Alert } from "@material-ui/lab";
import UserProfileCard from "components/subComponents/UserProfileCard";
import { DeleteForever } from "@material-ui/icons";
import PropTypes from "prop-types";

const useStyles = makeStyles((theme) => ({
	membersTab: {
		display: "flex",
		flexFlow: "wrap row",
		gap: theme.spacing(6),
	},

	backdrop: {
		zIndex: theme.zIndex.drawer + 1,
		position: "absolute",
		backgroundColor: "hsla(209, 53%, 89%, 0.87)",
	},
	profileCard: {
		position: "relative",
	},
	deletionIcon: {
		width: 100,
		height: 100,
	},
}));
const UIRestrictionForRoles = ["developer", "productOwner"];

DevelopersList.propTypes = {
	developers: PropTypes.arrayOf(PropTypes.any),
	currentUserRole: PropTypes.string.isRequired,
	isCurrentUserScrumMasterOfThisTeam: PropTypes.bool.isRequired,
};

export default function DevelopersList(props) {
	const classes = useStyles();
	const [developers, setDevelopers] = useState(props.developers);
	const [developerUriToDelete, setDeveloperUriToDelete] = useState(null);
	const [devIdTobeDeleted, setDevIdToBeDeleted] = useState(null);
	const { error, isLoading, isResolved, isRejected } = useDeleteFetch(developerUriToDelete);

	const [openDeleteSucces, setOpenDeleteSuccess] = useState(false);

	function handleDeletionClick(devId) {
		setDeveloperUriToDelete(`api/teams_members/${devId}`);
		setDevIdToBeDeleted(devId);
		setOpenDeleteSuccess(true);
	}

	function closeDeletionSuccess() {
		setOpenDeleteSuccess(false);
	}
	useEffect(() => {
		let deletedDevIdIndex;
		if (devIdTobeDeleted) {
			deletedDevIdIndex = developers.findIndex((item) =>
				item.id === devIdTobeDeleted ? true : false
			);
			developers.splice(deletedDevIdIndex, 1);
		}
	}, [devIdTobeDeleted]);

	return (
		<>
			{developers.map((item) => (
				<Box className={classes.profileCard}>
					<UserProfileCard
						width={"30ch"}
						{...item}
						backdrop={
							UIRestrictionForRoles.includes(props.currentUserRole) ||
							!props.isCurrentUserScrumMasterOfThisTeam ? null : (
								<Backdrop className={classes.backdrop}>
									<IconButton
										color="secondary"
										onClick={() => {
											handleDeletionClick(item.id);
										}}
									>
										{isLoading ? (
											<CircularProgress />
										) : (
											<DeleteForever fontSize="large" />
										)}
									</IconButton>
								</Backdrop>
							)
						}
					/>
				</Box>
			))}
			<Snackbar
				open={openDeleteSucces}
				autoHideDuration={6000}
				onClose={closeDeletionSuccess}
			>
				<Alert
					onClose={closeDeletionSuccess}
					severity={isResolved ? "success" : isRejected ? "error" : "error"}
				>
					{isResolved ? "Developer deleted" : isRejected ? error : error}
				</Alert>
			</Snackbar>
		</>
	);
}
