import { Typography, Box, makeStyles } from "@material-ui/core";
import { lightBlue } from "@material-ui/core/colors";

const useStyles = makeStyles((theme) => ({
	textWrapper: {
		maxWidth: "100%",
		overflowWrap: "break-word",
		overflow: "hidden",
		textOverflow: "ellipsis",
	},
}));
export default function TextDisplayWrapper({ children, ...other }) {
	const classes = useStyles();

	return (
		<Box className={classes.textWrapper}>
			<Typography component="p" {...other}>
				{children}
			</Typography>
		</Box>
	);
}
