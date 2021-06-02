import { useState } from "react";
import { Box, Grid, makeStyles, Container } from "@material-ui/core";
import ProfileAside from "./ProfileAside";
import ProfileMain from "./ProfileMain";
import { useAuth } from "../../../contexts/AuthContext";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
	container: {
		height: "100vh",
		// backgroundColor: theme.palette.info.light,
	},
}));

export default function Profile() {
	const classes = useStyles();

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
						<ProfileAside />
					</Grid>
					<Grid item xs={12} md={8}>
						<ProfileMain />
					</Grid>
				</Grid>
			</Box>
		</Container>
	);
}
