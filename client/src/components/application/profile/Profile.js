import {
	Box,
	Grid,
	makeStyles,
	Container,
	Hidden,
	Typography,
} from "@material-ui/core";
import ProfileAside from "./ProfileAside";
import ProfileMain from "./ProfileMain";
import { useAuth } from "../../../contexts/AuthContext";
import { Alert } from "@material-ui/lab";

const useStyles = makeStyles({
	container: {
		height: "100vh",
	},
});

export default function Profile() {
	const classes = useStyles();
	const { additionalUserInfo, currentUser } = useAuth();

	return (
		<Container className={classes.container} maxWidth="xl">
			{additionalUserInfo && currentUser ? (
				<Box>
					<Grid container justify="center" spacing={2}>
						<Hidden mdDown>
							<Grid item xs={false} md={12} style={{ minHeight: "10em" }} />
						</Hidden>

						<Grid item xs={12} md={3} xl={2}>
							<ProfileAside
								additionalUserInfo={additionalUserInfo}
								currentUser={currentUser}
							/>
						</Grid>
						<Grid item xs={12} md={8} xl={8}>
							<ProfileMain
								additionalUserInfo={additionalUserInfo}
								currentUser={currentUser}
							/>
						</Grid>
					</Grid>
				</Box>
			) : (
				<Box
					display="flex"
					height="70vh"
					justifyContent="center"
					alignItems="center"
				>
					<Alert severity="error">
						<Typography>Failed to load profile</Typography>
					</Alert>
				</Box>
			)}
		</Container>
	);
}
