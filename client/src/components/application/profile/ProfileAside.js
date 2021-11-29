import { useState } from "react";
import {
	Avatar,
	Box,
	Typography,
	Button,
	Grid,
	Paper,
	makeStyles,
	Divider,
	Hidden,
} from "@material-ui/core";
import { useAuth } from "contexts/AuthContext";
import ProfilePageAvatar from "components/subComponents/ProfilePageAvatar";
import TextDisplayWrapper from "../../subComponents/TextDisplayWrapper";
import { useHistory } from "react-router-dom";
import PropTypes from "prop-types";
import TrelloAuthorization from "components/subComponents/TrelloAuthorization";
const useStyles = makeStyles((theme) => ({
	identity: {
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
		gap: "2rem",
	},
}));

ProfileAside.propTypes = {
	additionalUserInfo: PropTypes.object.isRequired,
	currentUser: PropTypes.object.isRequired,
};
export default function ProfileAside({ additionalUserInfo, currentUser }) {
	const [isTrelloTokenExisting, setIsTrelloTokenExisting] = useState(
		Boolean(localStorage.getItem("trello_token"))
	);
	const { logout } = useAuth();
	const [logoutError, setLogoutError] = useState();
	const history = useHistory();
	async function handleLogout() {
		try {
			await logout();
			history.push("/");
		} catch (e) {
			setLogoutError(e.toString());
		}
	}
	const classes = useStyles();

	const handleDisconnectFromTrello = () => {
		localStorage.removeItem("trello_token");
		setIsTrelloTokenExisting(false);
	};
	return (
		<Paper elevation={5}>
			<Box p={3} display="flex" flexDirection="column">
				{additionalUserInfo && (
					<Grid container alignItems="center" spacing={2}>
						<Grid item xs md={12}>
							<Box className={classes.identity}>
								{additionalUserInfo.firebaseUserClaims.admin ? (
									<Avatar
										variant="circular"
										style={{ width: "10rem", height: "10rem" }}
									/>
								) : (
									<ProfilePageAvatar
										width="10rem"
										height="10rem"
										url={additionalUserInfo.avatar_url}
									/>
								)}

								<TextDisplayWrapper paragraph>
									{additionalUserInfo.firebaseUserClaims.admin
										? currentUser.displayName
										: additionalUserInfo.fullName}
								</TextDisplayWrapper>

								{additionalUserInfo.firebaseUserClaims.teacher ? (
									<Typography variant="h5">Teacher</Typography>
								) : additionalUserInfo.is_user_student ? (
									<Typography variant="h5">Student</Typography>
								) : null}
							</Box>
							<Hidden mdDown>
								<Divider />
							</Hidden>
						</Grid>

						<Grid
							item
							container
							xs
							md={12}
							direction="column"
							spacing={3}
							alignItems="flex-start"
						>
							<Grid item>
								<Typography variant="h6">Contact</Typography>
								<Typography>
									{additionalUserInfo.contact || currentUser?.email}
								</Typography>
								{additionalUserInfo.is_user_student ? (
									<>
										<Typography variant="h6">Student Group</Typography>
										<Typography>
											{`Group ${additionalUserInfo.student_group}`}
										</Typography>
									</>
								) : null}
							</Grid>
						</Grid>
					</Grid>
				)}
				{additionalUserInfo.firebaseUserClaims.admin ? null : (
					<Box mt={2} display="flex" justifyContent="center">
						{!isTrelloTokenExisting ? (
							<TrelloAuthorization
								authorizeOnSuccess={() => {
									setIsTrelloTokenExisting(true);
								}}
							/>
						) : (
							<Button
								fullWidth
								style={{
									color: "hsl(82, 0%, 100%)",
									backgroundColor: "hsl(82,60%, 44%)",
								}}
								onClick={handleDisconnectFromTrello}
							>
								Disconnect from Trello
							</Button>
						)}
					</Box>
				)}
				<Box mt={2}>
					<Button
						fullWidth
						variant="contained"
						color="primary"
						onClick={() => {
							handleLogout();
						}}
					>
						<Typography>Logout</Typography>
						{logoutError ? logoutError : null}
					</Button>
				</Box>
			</Box>
		</Paper>
	);
}
