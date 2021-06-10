import React from "react";
import {
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
import Avatar from "../../subComponents/Avatar";
import TextDisplayWrapper from "../../subComponents/TextDisplayWrapper";
import { useHistory } from "react-router-dom";
import PropTypes from "prop-types";

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

ProfileAside.propTypes = {
	additionalUserInfo: PropTypes.object.isRequired,
	currentUser: PropTypes.object.isRequired,
};
export default function ProfileAside(props) {
	const { logout } = useAuth();

	const history = useHistory();
	async function handleLogout() {
		try {
			await logout();
			history.push("/");
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
								<Avatar url={props.additionalUserInfo.avatar_url} />
							</Box>
							<TextDisplayWrapper paragraph>
								{props.additionalUserInfo.fullName}
							</TextDisplayWrapper>
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
								{props.additionalUserInfo.contact || props.currentUser?.email}
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
