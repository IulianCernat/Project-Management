import { Card, CardContent } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import PropTypes from "prop-types";

const useStyles = makeStyles(() => ({
	cardRoot: {
		maxWidth: "75ch",
	},
}));

TeamMessageCard.propTypes = {
	body: PropTypes.string.isRequired,
};

export default function TeamMessageCard({ body }) {
	return (
		<Card>
			<CardContent>{body}</CardContent>
		</Card>
	);
}
