import { cloneElement } from "react";
import { CircularProgress, Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { purple, grey } from "@material-ui/core/colors";
import PropTypes from "prop-types";

const useStyles = makeStyles((theme) => ({
	progressCirclePrimaryColor: {
		color: purple[900],
	},
	progressCircleSecondaryColor: {
		color: grey[300],
	},

	headlineText: {
		marginRight: theme.spacing(1),
	},

	headlineNumber: {
		color: purple[900],
	},
}));

CircularProgressWithLabel.propTypes = {
	size: PropTypes.string.isRequired,
	value: PropTypes.number.isRequired,
	label: PropTypes.any.isRequired,
};
export default function CircularProgressWithLabel({
	label: LabelComponent,
	...props
}) {
	const classes = useStyles();

	return (
		<Box position="relative" display="inline-flex">
			<Box position="absolute" top={0} left={0} bottom={0} right={0}>
				<CircularProgress
					classes={{ colorSecondary: classes.progressCircleSecondaryColor }}
					color="secondary"
					value={100}
					variant="determinate"
					size={props.size}
				/>
			</Box>
			<CircularProgress
				classes={{ colorPrimary: classes.progressCirclePrimaryColor }}
				color="primary"
				variant="determinate"
				{...props}
			/>

			<Box
				top={0}
				left={0}
				bottom={0}
				right={0}
				position="absolute"
				display="flex"
				alignItems="center"
				flexDirection="column"
				justifyContent="center"
			>
				{cloneElement(LabelComponent)}
			</Box>
		</Box>
	);
}
