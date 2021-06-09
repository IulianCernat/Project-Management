import {
	Typography,
	Box,
	CardActionArea,
	Card,
	CardHeader,
	Badge,
} from "@material-ui/core";
import PropTypes from "prop-types";
import { Link as RouterLink } from "react-router-dom";
import { People } from "@material-ui/icons";
import CircularProgressWithLabel from "components/subComponents/Progress";

ProjectCard.propTypes = {
	project: PropTypes.object.isRequired,
};
export default function ProjectCard({ project }) {
	const progressValue = project.total_nr_of_issues
		? Math.round(
				(project.nr_of_finished_issues * 100) / project.total_nr_of_issues
		  )
		: 0;

	return (
		<Card>
			<CardActionArea
				to={`dashboard/project/${project.id}`}
				component={RouterLink}
			>
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
								{project.name}
							</Typography>
						</Box>
					}
				/>
				<Box p={2}>
					<Typography variant="subtitle2">
						{`${project.description.slice(0, 300)}...`}
					</Typography>
				</Box>
				<Box p={2} display="flex" justifyContent="center">
					<CircularProgressWithLabel
						value={progressValue}
						size="6rem"
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
		</Card>
	);
}
