import { useState } from "react";
import {
	makeStyles,
	Backdrop,
	Box,
	Avatar,
	CircularProgress,
} from "@material-ui/core";
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";
import UploadProfileAvatar from "components/forms/UploadProfileAvatar";
import PropTypes from "prop-types";

const useStyles = makeStyles((theme) => ({
	avatar: {
		width: (props) => props.width,
		height: (props) => props.height,
	},
	backdrop: {
		position: "absolute",
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
		borderRadius: "50%",
		zIndex: 1,
		backgroundColor: "rgba(0, 0, 0, 0.7)",
	},

	circularProgress: {
		position: "absolute",
		zIndex: 2,
	},
}));

ProfilePageAvatar.propTypes = {
	width: PropTypes.string.isRequired,
	height: PropTypes.string.isRequired,
	url: PropTypes.string.isRequired,
};
export default function ProfilePageAvatar(props) {
	const classes = useStyles({ width: props.width, height: props.height });
	const [openBackdrop, setOpenBackdrop] = useState(false);
	const [uploadingFile, setUploadingFile] = useState(false);

	return (
		<Box
			position="relative"
			width={props.width}
			height={props.height}
			onMouseEnter={() => {
				setOpenBackdrop(true);
			}}
			onMouseLeave={() => {
				setOpenBackdrop(false);
			}}
			display="flex"
			alignItems="center"
			justifyContent="center"
		>
			<Avatar variant="circular" className={classes.avatar} src={props.url} />

			<label htmlFor="uploadButton">
				<Backdrop
					className={classes.backdrop}
					open={openBackdrop || uploadingFile}
				>
					<Box display="flex" alignItems="center" justifyContent="center">
						{uploadingFile ? (
							<CircularProgress color="secondary" />
						) : (
							<AddAPhotoIcon color="secondary" />
						)}
					</Box>
				</Backdrop>
			</label>

			<UploadProfileAvatar
				setUploadingProgress={setUploadingFile}
				uploadButtonLabel="uploadButton"
			/>
		</Box>
	);
}
