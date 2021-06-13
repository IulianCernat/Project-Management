import { useState, useEffect } from "react";
import {
	Grid,
	Box,
	Paper,
	Typography,
	Divider,
	Hidden,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import UserProfileCard from "components/subComponents/UserProfileCard";
import CircularProgressWithLabel from "components/subComponents/Progress";
import { purple } from "@material-ui/core/colors";
import { useGetFetch } from "customHooks/useFetch";
import { useProjectContext } from "contexts/ProjectContext";

const useStyles = makeStyles((theme) => ({
	paper: { height: "100%" },
	headlineText: {
		marginRight: theme.spacing(1),
	},

	headlineNumber: {
		color: purple[900],
	},
}));

export default function Overview() {
	const { projectId } = useProjectContext();
	const {
		status: getProjectStatus,
		receivedData: getProjectReceivedData,
		error: getProjectError,
		isLoading: isLoadingGetProject,
		isResolved: isResolvedGetProject,
		isRejected: isRejectedGetProject,
	} = useGetFetch(`api/projects/${projectId}`);
	const classes = useStyles();
	const [projectProgress, setProjectProgress] = useState();

	useEffect(() => {
		if (isResolvedGetProject) {
			const progress = getProjectReceivedData.total_nr_of_issues
				? Math.round(
						(getProjectReceivedData.nr_of_finished_issues * 100) /
							getProjectReceivedData.total_nr_of_issues
				  )
				: 0;

			setProjectProgress(progress);
		}
	}, [isResolvedGetProject]);

	return !isResolvedGetProject ? null : (
		<Grid container spacing={2}>
			<Grid item spacing={2} container>
				<Grid item xs={12} sm={5} md={4}>
					<Paper className={classes.paper}>
						<Box p={4} height="100%">
							<UserProfileCard
								width="100%"
								user_profile={getProjectReceivedData.product_owner_profile}
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
							<Typography>{getProjectReceivedData.description}</Typography>
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
							<CircularProgressWithLabel
								value={projectProgress}
								size="10rem"
								label={
									<Box>
										<Typography variant="h6" color="textSecondary">
											{`${projectProgress}%`}
										</Typography>
										<Typography variant="h6" color="textSecondary">
											done
										</Typography>
									</Box>
								}
							/>
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
									{getProjectReceivedData.total_nr_of_issues}
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
									{getProjectReceivedData.nr_of_finished_issues}
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
								{getProjectReceivedData.number_of_members}
							</Typography>
						</Box>
					</Box>
				</Paper>
			</Grid>
		</Grid>
	);
}
