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
import { blue, grey } from "@material-ui/core/colors";
import { People } from "@material-ui/icons";
import PropTypes from "prop-types";

import TextDisplayWrapper from "../../components/subComponents/TextDisplayWrapper";

const useStyles = makeStyles((theme) => ({
	root: {
		minWidth: (props) => props.width,
		maxWidth: (props) => props.width,
		backgroundColor: grey[100],
	},
	paper: {
		border: "5px, dashed, red",
	},
}));

TeamCard.propTypes = {
	name: PropTypes.string.isRequired,
	team_members: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)).isRequired,
	created_at: PropTypes.string.isRequired,
	description: PropTypes.string.isRequired,
};
export default function TeamCard(props) {
	const styles = useStyles(props);
	return (
		<Card className={styles.root} variant="outlined">
			<CardActionArea>
				<CardHeader
					title={
						<Box display="flex" justifyContent="space-between">
							<Typography variant="h6">{props.name}</Typography>
							<Badge
								badgeContent={props.team_members.length}
								color="primary"
								showZero
							>
								<People fontSize="large" />
							</Badge>
						</Box>
					}
					subheader={props.created_at}
				/>
				<CardContent>
					<Typography variant="h6" gutterBottom>
						Description
					</Typography>
					<TextDisplayWrapper gutterBottom>
						{props.description.substr(0, 100) + "..."}
					</TextDisplayWrapper>
					<Box
						display="flex"
						justifyContent="center"
						alignItems="center"
						bgcolor={blue[50]}
						p={1}
						borderRadius={20}
					>
						<Box style={{ width: "4rem", height: "4rem" }} mr={1}>
							<Avatar src="../../assets/defaultProfile.svg" />
						</Box>
						<Box>
							<Typography align="center" variant="h6">
								Scrum master
							</Typography>
							<Typography align="center">
								Cernat Iulian Constantin Iulian Constantin
							</Typography>
						</Box>
					</Box>
				</CardContent>
			</CardActionArea>
		</Card>
	);
}