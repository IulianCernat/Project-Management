import {
	CircularProgress,
	Box,
	Typography,
	LinearProgress,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

const BorderLinearProgress = withStyles((theme) => ({
	root: {
		height: "0.5rem",
		borderRadius: theme.spacing(1),
		flex: 1,
	},
	colorPrimary: {
		backgroundColor: theme.palette.grey[400],
	},
	bar: {
		borderRadius: theme.spacing(1),
		backgroundColor: theme.palette.primary.main,
	},
}))(LinearProgress);

export function LabelledCircularProgress(props) {
	return (
		<Box display="inline-flex" position="relative">
			<Box></Box>
			<CircularProgress variant="determinate" {...props} />

			<Box
				display="flex"
				alignItems="center"
				justifyContent="center"
				alignContent="center"
				position="absolute"
				left={0}
				right={0}
				bottom={0}
				top={0}
			>
				<Typography>{`${props.value}%`}</Typography>
			</Box>
		</Box>
	);
}

export function LabelledLiniarProgress(props) {
	return (
		<Box display="flex" alignItems="center">
			<BorderLinearProgress variant="determinate" {...props} />
			<Box ml={1}>
				<Typography>{`${props.value}% done`}</Typography>
			</Box>
		</Box>
	);
}
