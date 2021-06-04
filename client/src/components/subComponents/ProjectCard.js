import { useEffect } from "react";
import {
	Paper,
	Typography,
	Box,
	Divider,
	Avatar,
	useMediaQuery,
	CardActionArea,
	Button,
} from "@material-ui/core";
import AvatarGroup from "@material-ui/lab/AvatarGroup";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { LabelledLiniarProgress } from "../../components/subComponents/Progress";
import TextDisplayWrapper from "../../components/subComponents/TextDisplayWrapper";
import PropTypes from "prop-types";
import { Link as RouterLink } from "react-router-dom";
import { useProjectContext } from "contexts/ProjectContext";
const useStyles = makeStyles((theme) => ({
	paper: {
		maxWidth: "100%",
		display: "flex",
		flexFlow: "wrap",
		padding: theme.spacing(2),
		[theme.breakpoints.down("sm")]: {
			flexDirection: "column",
		},
		"&:hover": {
			backgroundColor: theme.palette.grey[200],
			$divider: {
				orientation: "horizontal",
			},
		},
	},
}));

ProjectCard.propTypes = {
	id: PropTypes.number.isRequired,
	name: PropTypes.string.isRequired,
	description: PropTypes.string.isRequired,
	created_at: PropTypes.string.isRequired,
	currentUserRole: PropTypes.string.isRequired,
};
export default function ProjectCard(props) {
	const classes = useStyles();
	const { setProjectName, setCurrentUserRole, setProjectId } =
		useProjectContext();

	const changeProjectContext = () => {
		setProjectName(props.name);
		setCurrentUserRole(props.currentUserRole);
		setProjectId(props.id);
	};
	return (
		<Paper elevation={3} className={classes.paper}>
			<Box
				maxWidth="100%"
				flex={1}
				display="flex"
				flexDirection="column"
				mr={1}
			>
				<Box flex={1}>
					<Typography color="primary" variant="h6">
						{props.name}
					</Typography>
				</Box>
				<Box flex={1}>
					<TextDisplayWrapper
						variant="body1"
						color="textSecondary"
						align="left"
					>
						{props.description.substr(0, 100) + "..."}
					</TextDisplayWrapper>
				</Box>
			</Box>
			{/* <Divider flexItem orientation="vertical" /> */}

			<Box
				flex={1}
				display="flex"
				flexDirection="column"
				justifyContent="flex-start"
			>
				<LabelledLiniarProgress value={50} />
				<Box display="flex" mt={2}>
					<Box flex={1}>
						<AvatarGroup spacing="small" max={4}>
							<Avatar alt="Remy Sharp" />
							<Avatar alt="Travis Howard" />
							<Avatar alt="Cindy Baker" />
							<Avatar alt="Agnes Walker" />
							<Avatar alt="Trevor Henderson" />
						</AvatarGroup>
					</Box>
					<Box flex={1}>
						<Typography align="right">Created at</Typography>
						<Typography align="right">{props.created_at}</Typography>
					</Box>
				</Box>
				<Button
					onClick={() => {
						changeProjectContext();
					}}
					variant="contained"
					color="primary"
					to={`dashboard`}
					component={RouterLink}
				>
					View
				</Button>
			</Box>
		</Paper>
	);
}
