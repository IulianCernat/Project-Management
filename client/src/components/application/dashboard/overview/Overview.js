import { useState, useEffect } from "react";
import { Grid, Box, Paper, Typography, Divider, Hidden, LinearProgress } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import UserProfileCard from "components/subComponents/UserProfileCard";
import CircularProgressWithLabel from "components/subComponents/Progress";
import { purple } from "@material-ui/core/colors";
import { useGetFetch } from "customHooks/useFetch";
import { useProjectContext } from "contexts/ProjectContext";

const useStyles = makeStyles((theme) => ({
	paper: {
		height: "100%",
	},
	headlineText: {
		marginRight: theme.spacing(1),
	},
	headlineNumber: {
		color: purple[900],
	},
	textContent: {
		whiteSpace: "pre-line",
	},
}));

export default function Overview() {
	const { projectId } = useProjectContext();
	const {
		receivedData: getProjectReceivedData,
		error: getProjectError,
		isLoading: isLoadingGetProject,
		isResolved: isResolvedGetProject,
		isRejected: isRejectedGetProject,
	} = useGetFetch(`api/projects/${projectId}`);
	const classes = useStyles();
	const [projectProgress, setProjectProgress] = useState(null);

	useEffect(() => {
		if (isResolvedGetProject) {
			const progress = getProjectReceivedData.total_nr_of_issues
				? Math.round(
						(getProjectReceivedData.nr_of_finished_issues * 100) / getProjectReceivedData.total_nr_of_issues
				  )
				: 0;

			setProjectProgress(progress);
		}
	}, [isResolvedGetProject, getProjectReceivedData]);

	return (
		<>
			{isLoadingGetProject && <LinearProgress style={{ width: "100%" }} />}
			{!isResolvedGetProject ? null : (
				<Grid container spacing={1}>
					<Grid item xs={12}>
						<Paper>
							<Box p={2} display="flex" flexWrap="wrap" alignItems="center" justifyContent="space-evenly">
								<Box>
									{projectProgress !== null && (
										<CircularProgressWithLabel
											value={projectProgress}
											size="6rem"
											label={
												<Box
													display="flex"
													justifyContent="center"
													flexDirection="column"
													alignItems="center"
												>
													<Typography variant="h6" color="textSecondary">
														{`${projectProgress}%`}
													</Typography>
													<Typography variant="h6" color="textSecondary">
														done
													</Typography>
												</Box>
											}
										/>
									)}
								</Box>
								<Hidden smDown>
									<Divider orientation="vertical" flexItem />
								</Hidden>
								<Box>
									<Typography className={classes.headlineNumber} variant="h4">
										{getProjectReceivedData.total_nr_of_issues}
									</Typography>
									<Typography className={classes.headlineText} variant="h6">
										open issues
									</Typography>
								</Box>
								<Hidden smDown>
									<Divider orientation="vertical" flexItem />
								</Hidden>
								<Box>
									<Typography className={classes.headlineNumber} variant="h4">
										{getProjectReceivedData.nr_of_finished_issues}
									</Typography>
									<Typography className={classes.headlineText} variant="h6">
										finished issues
									</Typography>
								</Box>
								<Hidden smDown>
									<Divider orientation="vertical" flexItem />
								</Hidden>
								<Box>
									<Typography className={classes.headlineNumber} variant="h4">
										{getProjectReceivedData.number_of_members}
									</Typography>
									<Typography className={classes.headlineText} variant="h6">
										members
									</Typography>
								</Box>
							</Box>
						</Paper>
					</Grid>
					<Grid item container justify="space-evenly" spacing={1} alignItems="stretch">
						<Grid item xs={12} md={4} xl={3}>
							<Paper className={classes.paper}>
								<Box p={4} height="100%" display="flex" justifyContent="center" alignItems="baseline">
									<UserProfileCard
										width="30ch"
										user_profile={getProjectReceivedData.product_owner_profile}
										user_type="productOwner"
									/>
								</Box>
							</Paper>
						</Grid>
						<Grid item xs={12} md={8} xl={9}>
							<Paper className={classes.paper}>
								<Box p={2} height="100%">
									<Typography color="primary" gutterBottom variant="h5">
										Project Name
									</Typography>
									<Typography gutterBottom>{getProjectReceivedData.name}</Typography>
									<Typography align="justify" color="primary" gutterBottom variant="h5">
										Project description
									</Typography>
									<Typography className={classes.textContent}>
										{getProjectReceivedData.description}
									</Typography>
								</Box>
							</Paper>
						</Grid>
					</Grid>
				</Grid>
			)}
		</>
	);
}
