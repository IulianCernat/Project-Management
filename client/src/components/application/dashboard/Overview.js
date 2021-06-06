import React from "react";
import PropTypes from "prop-types";
import {
	Grid,
	Box,
	Paper,
	Typography,
	CircularProgress,
	Divider,
	Hidden,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import UserProfileCard from "components/subComponents/UserProfileCard";
import { purple, grey } from "@material-ui/core/colors";

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
	paper: { height: "100%" },
}));

function CircularProgressWithLabel(props) {
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
				<Typography variant="h6" color="textSecondary">
					{`${Math.round(props.value)}%`}
				</Typography>
				<Typography variant="h6" color="textSecondary">
					done
				</Typography>
			</Box>
		</Box>
	);
}

Overview.propTypes = {
	project: PropTypes.object.isRequired,
};
export default function Overview({ project }) {
	const classes = useStyles();
	const progress = project.total_nr_of_issues
		? (project.nr_of_finished_issues * 100) / project.total_nr_of_issues
		: 0;
	return (
		<Grid container spacing={2}>
			<Grid item spacing={2} container>
				<Grid item xs={12} sm={5} md={4}>
					<Paper className={classes.paper}>
						<Box p={4} height="100%">
							<UserProfileCard
								width="100%"
								user_profile={project.product_owner_profile}
								user_type="productOwner"
							/>
						</Box>
					</Paper>
				</Grid>
				<Grid item xs={12} sm={7} md={8}>
					<Paper className={classes.paper}>
						<Box p={2} height="100%">
							<Typography gutterBottom variant="h5">
								Project description
							</Typography>
							<Typography>{project.description}</Typography>
						</Box>
					</Paper>
				</Grid>
			</Grid>

			<Grid item xs={12}>
				<Paper>
					<Box
						p={2}
						display="flex"
						flexWrap="wrap"
						alignItems="center"
						justifyContent="space-evenly"
					>
						<Box>
							<Typography gutterBottom align="center" variant="h5">
								Progress
							</Typography>
							<CircularProgressWithLabel value={progress} size="10rem" />
						</Box>
						<Hidden smDown>
							<Divider orientation="vertical" flexItem />
						</Hidden>

						<Box display="flex" flexDirection="column" style={{ gap: "1rem" }}>
							<Box>
								<Typography
									className={classes.headlineText}
									display="inline"
									variant="h6"
								>
									Number of opened issues
								</Typography>
								<Typography
									className={classes.headlineNumber}
									display="inline"
									variant="h4"
								>
									{project.total_nr_of_issues}
								</Typography>
							</Box>

							<Box>
								<Typography
									className={classes.headlineText}
									display="inline"
									variant="h6"
								>
									Number of finished issues
								</Typography>
								<Typography
									className={classes.headlineNumber}
									display="inline"
									variant="h4"
								>
									{project.nr_of_finished_issues}
								</Typography>
							</Box>
						</Box>
						<Hidden smDown>
							<Divider orientation="vertical" flexItem />
						</Hidden>
						<Box>
							<Typography
								className={classes.headlineText}
								display="inline"
								variant="h6"
							>
								Members
							</Typography>
							<Typography
								className={classes.headlineNumber}
								display="inline"
								variant="h4"
							>
								{project.number_of_members}
							</Typography>
						</Box>
					</Box>
				</Paper>
			</Grid>
		</Grid>
	);
}
