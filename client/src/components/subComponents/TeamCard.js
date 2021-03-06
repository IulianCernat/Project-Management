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
} from "@material-ui/core";
import { People } from "@material-ui/icons";
import PropTypes from "prop-types";
import { Link as RouterLink } from "react-router-dom";
import TextDisplayWrapper from "../subComponents/TextDisplayWrapper";
import { format } from "date-fns";
import { lightBlue, grey } from "@material-ui/core/colors";
import { useAuth } from "contexts/AuthContext";
import clsx from "clsx";
import { ReactComponent as AvatarDefault } from "images/avatarDefault.svg";

const useStyles = makeStyles((theme) => ({
	paper: {
		border: `1px solid ${grey[400]}`,
	},
	avatar: {
		width: "4rem",
		height: "4rem",
	},
	paperHighlight: {
		backgroundColor: lightBlue[100],
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
	handleUpdate: PropTypes.func.isRequired,
};
export default function TeamCard(props) {
	const styles = useStyles(props);
	const { additionalUserInfo } = useAuth();
	const scrumMasterProfile = props.team_members[0]?.user_profile;
	const nrOfTeammates = props.team_members.length;

	return (
		<Card
			className={clsx(
				styles.paper,
				additionalUserInfo.id === scrumMasterProfile?.id ||
					props.team_members.find((item) => item.user_profile.id === additionalUserInfo.id)
					? styles.paperHighlight
					: ""
			)}
			variant="outlined"
		>
			<CardActionArea to={props.linkTo} component={RouterLink}>
				<CardHeader
					title={
						<Box display="flex" justifyContent="space-between">
							<Typography color="primary" variant="h6">
								{props.name.length > 70 ? props.name.slice(0, 70) + "..." : props.name}
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
						{props.description.length > 200 ? props.description.slice(0, 200) + "..." : props.description}
					</TextDisplayWrapper>
					{scrumMasterProfile ? (
						<Box display="flex" justifyContent="center" alignItems="center" p={1}>
							<Box mr={1}>
								<Avatar className={styles.avatar} src={scrumMasterProfile.avatar_url}>
									<AvatarDefault />
								</Avatar>
							</Box>
							<Box>
								<Typography align="center" variant="h6">
									Scrum master
								</Typography>
								<Typography align="center">{scrumMasterProfile.fullName}</Typography>
							</Box>
						</Box>
					) : null}
				</CardContent>
			</CardActionArea>
			{!props.renderActions ? null : (
				<CardActions>
					<Box width="100%" display="flex" justifyContent="space-between">
						<Button
							size="small"
							variant="outlined"
							onClick={() => {
								props.handleUpdate(props.id);
							}}
						>
							edit
						</Button>
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
					</Box>
				</CardActions>
			)}
		</Card>
	);
}
