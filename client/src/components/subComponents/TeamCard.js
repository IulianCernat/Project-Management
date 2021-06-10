import {
	Card,
	CardActionArea,
	CardHeader,
	CardContent,
	Typography,
	makeStyles,
	Box,
	Badge,
	Avatar,
} from "@material-ui/core";
import { lightBlue } from "@material-ui/core/colors";
import { People } from "@material-ui/icons";
import PropTypes from "prop-types";
import { Link as RouterLink } from "react-router-dom";
import TextDisplayWrapper from "../subComponents/TextDisplayWrapper";
import { format } from "date-fns";

const useStyles = makeStyles((theme) => ({
	root: {
		minWidth: "20ch",
		maxWidth: "40ch",
		flex: "1 1 auto",
		backgroundColor: lightBlue[50],
	},
	paper: {
		border: "5px dashed red",
	},
	avatar: {
		width: "4rem",
		height: "4rem",
	},
}));

TeamCard.propTypes = {
	name: PropTypes.string.isRequired,
	team_members: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)).isRequired,
	created_at: PropTypes.string.isRequired,
	description: PropTypes.string.isRequired,
	linkTo: PropTypes.string.isRequired,
};
export default function TeamCard(props) {
	const styles = useStyles(props);
	const scrumMasterProfile = props.team_members[0]?.user_profile;
	const nrOfTeammates = props.team_members.length;
	return (
		<Card className={styles.root} variant="outlined">
			<CardActionArea to={props.linkTo} component={RouterLink}>
				<CardHeader
					title={
						<Box display="flex" justifyContent="space-between">
							<Typography variant="h6">{props.name}</Typography>
							<Badge badgeContent={nrOfTeammates} color="primary" showZero>
								<People fontSize="large" />
							</Badge>
						</Box>
					}
					subheader={format(new Date(props.created_at), "dd/MM/yyyy")}
				/>
				<CardContent>
					<TextDisplayWrapper gutterBottom>
						{props.description.substr(0, 200) +
							(props.description.legth > 200 ? "..." : "")}
					</TextDisplayWrapper>
					<Box display="flex" justifyContent="center" alignItems="center" p={1}>
						<Box mr={1}>
							<Avatar
								className={styles.avatar}
								src={scrumMasterProfile.avatar_url}
							/>
						</Box>
						<Box>
							<Typography align="center" variant="h6">
								Scrum master
							</Typography>
							<Typography align="center">
								{scrumMasterProfile
									? scrumMasterProfile.fullName
									: "No scrum master"}
							</Typography>
						</Box>
					</Box>
				</CardContent>
			</CardActionArea>
		</Card>
	);
}
