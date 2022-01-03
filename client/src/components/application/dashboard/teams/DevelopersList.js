import { useState, useEffect } from "react";
import { Box, makeStyles, Backdrop, CircularProgress, Snackbar, IconButton } from "@material-ui/core";
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
	developers: PropTypes.array.isRequired,
	currentUserRole: PropTypes.string.isRequired,
	isCurrentUserScrumMasterOfThisTeam: PropTypes.bool.isRequired,
	handleDevDeletion: PropTypes.func.isRequired,
};

export default function DevelopersList({
	developers,
	currentUserRole,
	isCurrentUserScrumMasterOfThisTeam,
	handleDevDeletion,
}) {
	const classes = useStyles();

	return (
		<>
			{developers.map((item) => (
				<Box key={item.id} className={classes.profileCard}>
					<UserProfileCard
						width={"30ch"}
						{...item}
						backdrop={
							UIRestrictionForRoles.includes(currentUserRole) ||
							!isCurrentUserScrumMasterOfThisTeam ? null : (
								<Backdrop className={classes.backdrop}>
									<IconButton
										color="secondary"
										onClick={() => {
											handleDevDeletion(item.id);
										}}
									>
										<DeleteForever fontSize="large" />
									</IconButton>
								</Backdrop>
							)
						}
					/>
				</Box>
			))}
		</>
	);
}
