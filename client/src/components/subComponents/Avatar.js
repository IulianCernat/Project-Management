import { makeStyles, ButtonBase, Typography } from "@material-ui/core";
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";
import { ReactComponent as User } from "../../assets/defaultProfile.svg";
import { Person } from "@material-ui/icons";
// props: width, title, image url,
const useStyles = makeStyles((theme) => ({
	image: {
		width: "inherit",
		height: "inherit",
		backgroundRepeat: "no-repeat",
		backgroundSize: "cover",
		borderRadius: "50%",
		"&:hover": {
			zIndex: 1,
			"& $imageBackdrop": {
				opacity: 0.5,
			},

			"& $imageAddition": {
				opacity: 1,
			},
		},
	},

	imageBackdrop: {
		position: "absolute",
		borderRadius: "50%",
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		backgroundColor: theme.palette.common.black,
		opacity: 0,
		transition: theme.transitions.create("opacity"),
	},
	imageAddition: {
		color: theme.palette.common.white,
		position: "absolute",
		opacity: 0,

		padding: `${theme.spacing(2)}px ${theme.spacing(4)}px ${
			theme.spacing(1) + 6
		}px`,
	},
	defaultProfile: {
		position: "absolute",
	},
}));

export default function Avatar(props) {
	const classes = useStyles();
	return (
		<ButtonBase
			focusRipple
			className={classes.image}
			style={{
				backgroundImage: `url(${props.url})`,
			}}
			onClick={() => window.alert("ok")}
		>
			{!props.url && <User />}
			<span className={classes.imageBackdrop} />
			<AddAPhotoIcon className={classes.imageAddition} />
		</ButtonBase>
	);
}
