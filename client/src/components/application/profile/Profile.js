import { useState } from "react";
import {
	Box,
	Grid,
	makeStyles,
	Container,
	LinearProgress,
} from "@material-ui/core";
import ProfileAside from "./ProfileAside";
import ProfileMain from "./ProfileMain";
import { useAuth } from "../../../contexts/AuthContext";
import PropTypes from "prop-types";

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
		<Container
			disableGutters={true}
			className={classes.container}
			maxWidth="lg"
		>
			{additionalUserInfo && currentUser ? (
				<Box>
					<Grid container justify="space-evenly">
						<Grid item xs={false} md={12} style={{ minHeight: "10em" }} />
						<Grid item xs={12} md={3}>
							<ProfileAside
								additionalUserInfo={additionalUserInfo}
								currentUser={currentUser}
							/>
						</Grid>
						<Grid item xs={12} md={8}>
							<ProfileMain
								additionalUserInfo={additionalUserInfo}
								currentUser={currentUser}
							/>
						</Grid>
					</Grid>
				</Box>
			) : (
				<LinearProgress />
			)}
		</Container>
	);
}
