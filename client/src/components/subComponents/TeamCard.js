import {
	Card,
	CardActionArea,
	CardActions,
	Button,
	CardHeader,
	CardContent,
	Typography,
	makeStyles,
	Box,
	Badge,
	Avatar,
	Paper,
} from "@material-ui/core";
import { People } from "@material-ui/icons";
import PropTypes from "prop-types";
import { Link as RouterLink } from "react-router-dom";
import TextDisplayWrapper from "../subComponents/TextDisplayWrapper";
import { format } from "date-fns";

const useStyles = makeStyles((theme) => ({
	root: {
		minWidth: "20ch",
		maxWidth: "60ch",
		flex: "1 1 auto",
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
	id: PropTypes.number.isRequired,
	name: PropTypes.string.isRequired,
	team_members: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)).isRequired,
	created_at: PropTypes.string.isRequired,
	description: PropTypes.string.isRequired,
	linkTo: PropTypes.string.isRequired,
	renderActions: PropTypes.bool.isRequired,
	handleDelete: PropTypes.func.isRequired,
};
export default function TeamCard(props) {
	const styles = useStyles(props);
	const scrumMasterProfile = props.team_members[0]?.user_profile;
	const nrOfTeammates = props.team_members.length;
	return (
		<Paper elevation={2}>
			<Card className={styles.root} variant="outlined">
				<CardActionArea to={props.linkTo} component={RouterLink}>
					<CardHeader
						title={
							<Box display="flex" justifyContent="space-between">
								<Typography color="primary" variant="h6">
									{props.name.length > 70
										? props.name.slice(0, 70) + "..."
										: props.name}
								</Typography>
								<Badge badgeContent={nrOfTeammates} color="primary" showZero>
									<People fontSize="large" />
								</Badge>
							</Box>
						}
						subheader={format(new Date(props.created_at), "dd/MM/yyyy")}
					/>
					<CardContent>
						<TextDisplayWrapper gutterBottom>
							{props.description.length > 200
								? props.description.slice(0, 200) + "..."
								: props.description}
						</TextDisplayWrapper>
						<Box
							display="flex"
							justifyContent="center"
							alignItems="center"
							p={1}
						>
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
				{!props.renderActions ? null : (
					<CardActions>
						<Button
							size="small"
							color="secondary"
							variant="outlined"
							onClick={() => {
								props.handleDelete(props.id);
							}}
						>
							delete
						</Button>
					</CardActions>
				)}
			</Card>
		</Paper>
	);
}
