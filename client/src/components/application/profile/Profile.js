import React, { useState } from "react";
import { Box, Grid, makeStyles, Container } from "@material-ui/core";
import Aside from "./Aside";
import Main from "./Main";
import { useAuth } from "../../../contexts/AuthContext";

const useStyles = makeStyles((theme) => ({
	container: {
		height: "100vh",
		// backgroundColor: theme.palette.info.light,
	},
}));

export default function Profile() {
	const classes = useStyles();
	// const { currentUser, logout, addiditionalUserInfo} = useAuth();
	// const history = useHistory();
	// async function handleLogout() {
	//     try {
	//         await logout()
	//         history.push("/login")
	//     } catch (e) {
	//         console.log(e)
	//     }

	// }

	return (
		<Container
			disableGutters={true}
			className={classes.container}
			maxWidth="lg"
		>
			<Box>
				<Grid container justify="space-evenly">
					<Grid item xs={false} md={12} style={{ minHeight: "10em" }} />
					<Grid item xs={12} md={3}>
						<Aside />
					</Grid>
					<Grid item xs={12} md={8}>
						<Main />
					</Grid>
				</Grid>
			</Box>
		</Container>
	);
}
