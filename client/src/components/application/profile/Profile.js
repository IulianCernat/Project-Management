import { useState } from "react";
import {
	Box,
	Grid,
	makeStyles,
	Container,
	Hidden,
	CircularProgress,
} from "@material-ui/core";
import ProfileAside from "./ProfileAside";
import ProfileMain from "./ProfileMain";
import { useAuth } from "../../../contexts/AuthContext";

const useStyles = makeStyles((theme) => ({
	container: {
		height: "100vh",
		// backgroundColor: theme.palette.info.light,
	},
}));

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
				<CircularProgress />
			)}
		</Container>
	);
}
