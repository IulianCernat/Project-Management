import {
	Typography,
	Box,
	CardActionArea,
	Card,
	CardHeader,
	Button,
	Badge,
	CardActions,
	makeStyles,
} from "@material-ui/core";
import PropTypes from "prop-types";
import { Link as RouterLink } from "react-router-dom";
import { People } from "@material-ui/icons";
import CircularProgressWithLabel from "components/subComponents/Progress";
import { format } from "date-fns";
import { lightBlue, grey } from "@material-ui/core/colors";
import clsx from "clsx";

const useStyles = makeStyles(() => ({
	paper: {
		border: `1px solid ${grey[400]}`,
	},
	paperHighlight: {
		backgroundColor: lightBlue[100],
	},
}));

ProjectCard.propTypes = {
	project: PropTypes.object.isRequired,
	handleDelete: PropTypes.func.isRequired,
	handleProjectUpdate: PropTypes.func.isRequired,
	renderActions: PropTypes.bool.isRequired,
};
export default function ProjectCard({ project, handleDelete, handleProjectUpdate, renderActions }) {
	const styles = useStyles();
	const progressValue = project.total_nr_of_issues
		? Math.round((project.nr_of_finished_issues * 100) / project.total_nr_of_issues)
		: 0;

	return (
		<Card className={clsx(styles.paper)}>
			<CardActionArea to={`dashboard/project/${project.id}`} component={RouterLink}>
				<CardHeader
					title={
						<Box>
							<Badge
								style={{ float: "right" }}
								showZero
								color="primary"
								badgeContent={project.number_of_members}
							>
								<People />
							</Badge>
							<Typography color="primary" variant="h6">
								{project.name.length > 60 ? project.name.slice(0, 60) + "..." : project.name}
							</Typography>
						</Box>
					}
					subheader={format(new Date(project.created_at), "dd/MM/yyyy")}
				/>
				<Box p={2}>
					<Typography variant="subtitle2">
						{`${project.description.slice(0, 300)}${project.description.length > 300 ? "..." : ""}`}
					</Typography>
				</Box>
				<Box p={2} display="flex" justifyContent="center">
					<CircularProgressWithLabel
						value={progressValue}
						size="4rem"
						label={
							<Box display="flex" flexDirection="column" alignItems="center">
								<Typography variant="subtitle2" color="textSecondary">
									{`${progressValue}%`}
								</Typography>
								<Typography variant="subtitle2" color="textSecondary">
									done
								</Typography>
							</Box>
						}
					/>
				</Box>
			</CardActionArea>
			{!renderActions ? null : (
				<CardActions>
					<Box width="100%" display="flex" justifyContent="space-between">
						<Button
							size="small"
							variant="outlined"
							onClick={() => {
								handleProjectUpdate(project.id);
							}}
						>
							edit
						</Button>
						<Button
							size="small"
							color="secondary"
							variant="outlined"
							onClick={() => {
								handleDelete(project.id);
							}}
						>
							delete
						</Button>
					</Box>
				</CardActions>
			)}
		</Card>
	);
}
