import {
	Avatar,
	Card,
	CardContent,
	makeStyles,
	Typography,
	Box,
	Divider,
	Badge,
} from "@material-ui/core";
import PropTypes from "prop-types";
import { deepPurple, blueGrey, grey } from "@material-ui/core/colors";
import { FaChessPawn, FaChessRook, FaChessKing } from "react-icons/fa";
import { IconContext } from "react-icons";

UserProfileCard.propTypes = {
	width: PropTypes.string.isRequired,
	user_profile: PropTypes.object.isRequired,
	user_type: PropTypes.oneOf(["developer", "scrumMaster", "productOwner"]),
};
const useStyles = makeStyles((theme) => ({
	root: {
		minWidth: (props) => props.width,
		maxWidth: (props) => props.width,
		backgroundColor: grey[200],
		position: "relative",
	},
	avatar: {
		backgroundColor: deepPurple[700],
		width: "10rem",
		height: "10rem",
	},
	paper: {
		border: "5px dashed red",
	},
	avatarText: {
		fontSize: "6rem",
	},

	name: {
		marginTop: theme.spacing(1),
	},

	role: {
		marginTop: theme.spacing(1),
	},

	divider: {
		height: "1px",
		backgroundColor: grey[400],
	},
	textContent: {
		marginTop: theme.spacing(2),
	},
	contact: {
		marginTop: theme.spacing(1),
	},

	rankIcon: {
		top: "1px",
		right: "1px",
		position: "absolute",
	},
}));

export default function UserProfileCard(props) {
	const classes = useStyles(props);
	return (
		<Card className={classes.root} elevation={4}>
			<IconContext.Provider
				value={{
					size: "2rem",
					color: blueGrey[600],
					className: classes.rankIcon,
				}}
			>
				{(props.user_type === "scrumMaster" && <FaChessKing />) ||
					(props.user_type === "developer" && <FaChessPawn />) ||
					(props.user_type === "productOwner" && <FaChessRook />)}
			</IconContext.Provider>
			<CardContent>
				<Box display="flex" alignItems="center" flexDirection="column">
					<Box display="flex">
						<Avatar
							className={classes.avatar}
							src={props.user_profile.avatar_url}
						>
							<Typography className={classes.avatarText}>
								{props.user_profile.fullName.slice(0, 2)}
							</Typography>
						</Avatar>
					</Box>

					<Box
						className={classes.textContent}
						display="flex"
						flexDirection="column"
						alignItems="center"
					>
						<Typography variant="h4" className={classes.name}>
							{props.user_profile.fullName}
						</Typography>
						<Typography variant="h6" className={classes.role}>
							{(props.user_type === "scrumMaster" && "Scrum Master") ||
								(props.user_type === "developer" && "Developer") ||
								(props.user_type === "productOwner" && "Product Owner")}
						</Typography>
					</Box>
					<Divider
						variant="fullWidth"
						flexItem
						classes={{ root: classes.divider }}
					/>
					<Typography className={classes.contact}>
						{props.contact || "No contact info"}
					</Typography>
				</Box>
			</CardContent>
		</Card>
	);
}
