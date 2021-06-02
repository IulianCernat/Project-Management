import React from "react";
import {
	Box,
	Typography,
	Button,
	Grid,
	Paper,
	makeStyles,
	Divider,
} from "@material-ui/core";
import { useAuth } from "contexts/AuthContext";
import Avatar from "../../subComponents/Avatar";
import TextDisplayWrapper from "../../subComponents/TextDisplayWrapper";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
	identity: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		"& > *": {
			marginTop: theme.spacing(4),
		},
	},
}));

export default function ProfileAside() {
	const { additionalUserInfo, logout, currentUser } = useAuth();

	const history = useHistory();
	async function handleLogout() {
		try {
			await logout();
			history.push("/login");
		} catch (e) {
			console.log(e);
		}
	}
	const classes = useStyles();
	return (
		<Paper elevation={5}>
			<Box p={3} display="flex" direction="column">
				<Grid container alignItems="center" spacing={2}>
					<Grid item xs md={12}>
						<Box className={classes.identity}>
							<Box style={{ width: "10em", height: "10em" }}>
								<Avatar url={additionalUserInfo.avatar_url} />
							</Box>
							<TextDisplayWrapper>
								{additionalUserInfo.fullName}
							</TextDisplayWrapper>
						</Box>
						<Divider />
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
						</Grid>

						<Grid item>
							<Button
								fullWidth
								variant="contained"
								color="primary"
								onClick={() => {
									handleLogout();
								}}
							>
								<Typography>Logout</Typography>
							</Button>
						</Grid>
					</Grid>
				</Grid>
			</Box>
		</Paper>
	);
}
