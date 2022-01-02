import { Card, CardContent, Box, IconButton, Badge, Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import PropTypes from "prop-types";
import TextDisplayWrapper from "./TextDisplayWrapper";
import Linkify from "react-linkify";
import { Cancel } from "@material-ui/icons";

const useStyles = makeStyles(() => ({
	cardRoot: {
		minWidth: "50ch",
		maxWidth: "75ch",
	},
}));

TeamMessageCard.propTypes = {
	id: PropTypes.number.isRequired,
	body: PropTypes.string.isRequired,
	currentUserTeamRole: PropTypes.func.isRequired,
	handleDeleteMessageClick: PropTypes.func.isRequired,
};

export default function TeamMessageCard({ id, body, currentUserTeamRole, handleDeleteMessageClick }) {
	const classes = useStyles();
	return (
		<Box>
			<Badge
				anchorOrigin={{
					vertical: "top",
					horizontal: "right",
				}}
				badgeContent={
					<IconButton
						color="primary"
						disable={currentUserTeamRole === "developer"}
						onClick={() => {
							handleDeleteMessageClick(id);
						}}
					>
						<Cancel />
					</IconButton>
				}
			>
				<Card className={classes.cardRoot}>
					<CardContent>
						<Linkify>
							<TextDisplayWrapper>{body}</TextDisplayWrapper>
						</Linkify>
					</CardContent>
				</Card>
			</Badge>
		</Box>
	);
}
