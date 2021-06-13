import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	IconButton,
	useMediaQuery,
	Box,
} from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import CancelIcon from "@material-ui/icons/Cancel";
import PropTypes from "prop-types";

DialogForm.propTypes = {
	title: PropTypes.string.isRequired,
	open: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	children: PropTypes.any,
};
export default function DialogForm(props) {
	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

	return (
		<Dialog
			fullScreen={fullScreen}
			open={props.open}
			onClose={props.onClose}
			aria-labelledby="dialog-title"
			fullWidth
			maxWidth="md"
			disableBackdropClick
		>
			<Box
				display="flex"
				flexWrap="wrap"
				justifyContent="space-between"
				alignItems="center"
			>
				<DialogTitle id="dialog-title">{props.title}</DialogTitle>
				<IconButton onClick={props.onClose}>
					<CancelIcon />
				</IconButton>
			</Box>

			<DialogContent>{props.children}</DialogContent>
		</Dialog>
	);
}
