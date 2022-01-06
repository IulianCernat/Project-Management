import { useEffect } from "react";
import { Dialog, DialogContent, DialogTitle, IconButton, useMediaQuery, Box } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import CancelIcon from "@material-ui/icons/Cancel";
import PropTypes from "prop-types";

DialogForm.propTypes = {
	title: PropTypes.string.isRequired,
	open: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	children: PropTypes.any,
};
export default function DialogForm({ title, onClose, children, open, ...other }) {
	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

	return (
		<Dialog
			fullScreen={fullScreen}
			open={open}
			onClose={onClose}
			aria-labelledby="dialog-title"
			fullWidth
			{...other}
		>
			{!open ? null : (
				<>
					<Box display="flex" flexWrap="wrap" justifyContent="space-between" alignItems="center">
						<DialogTitle id="dialog-title">{title}</DialogTitle>
						<IconButton onClick={onClose}>
							<CancelIcon />
						</IconButton>
					</Box>

					<DialogContent>{children}</DialogContent>
				</>
			)}
		</Dialog>
	);
}
