import { Card, CardContent, Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import PropTypes from "prop-types";
import TextDisplayWrapper from "./TextDisplayWrapper";
import Linkify from "react-linkify";

const useStyles = makeStyles(() => ({
	cardRoot: {
		minWidth: "50ch",
		maxWidth: "75ch",
	},
	horizontalBar: {
		width: "100%",
		height: "10px",
		backgroundColor: "hsla(257, 61%, 28%, 1)",
	},
}));

TeamMessageCard.propTypes = {
	body: PropTypes.string.isRequired,
};

export default function TeamMessageCard({ body }) {
	const classes = useStyles();
	return (
		<Card className={classes.cardRoot}>
			<Box className={classes.horizontalBar} />
			<CardContent>
				<Linkify>
					<TextDisplayWrapper>{body}</TextDisplayWrapper>
				</Linkify>
			</CardContent>
		</Card>
	);
}
