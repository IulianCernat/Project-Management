import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Box, Paper, Grid, Button, Avatar, Typography } from "@material-ui/core";
import VersionSystemAdditionForm from "components/forms/VersioningSystemAdditionForm";
import TextDisplayWrapper from "components/subComponents/TextDisplayWrapper";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
	textContent: {
		whiteSpace: "pre-wrap",
	},
	linkButton: {
		textTransform: "none",
	},
});
const UIRestrictionForRoles = ["developer", "productOwner"];

TeamInfo.propTypes = {
	description: PropTypes.string.isRequired,
	teamId: PropTypes.number.isRequired,
	version_control_link: PropTypes.any.isRequired,
	name: PropTypes.string.isRequired,
	nrMembers: PropTypes.number.isRequired,
	currentUserRole: PropTypes.string.isRequired,
	handleTeamFieldsUpdate: PropTypes.func.isRequired,
};
export default function TeamInfo(props) {
	const classes = useStyles();
	const [hideVersionControlAdditionForm, setHideVersionControlAdditionForm] = useState(true);

	const handleFormAdditionClick = () => {
		setHideVersionControlAdditionForm(false);
	};

	const hideFormAddition = () => {
		setHideVersionControlAdditionForm(true);
	};

	const openVersionControlLink = () => {
		window.open(props.version_control_link);
	};

	useEffect(() => {
		if (props.version_control_link) {
			setHideVersionControlAdditionForm(true);
		}
	}, [props.version_control_link]);

	return (
		<Paper>
			<Box p={4}>
				<Box>
					<Typography color="primary" variant="h6">
						Team Name
					</Typography>
					<TextDisplayWrapper className={classes.textContent}>{props.name}</TextDisplayWrapper>
					<Box mt={2} />
					<Typography color="primary" variant="h6">
						Team Description
					</Typography>
					<TextDisplayWrapper className={classes.textContent}>{props.description}</TextDisplayWrapper>
				</Box>
				<Box
					mt={2}
					display="inline-flex"
					flexDirection="column"
					alignItems="flex-start"
					style={{ gap: "16px", width: "auto" }}
				>
					<Typography color="primary" variant="h6">
						Version Control Link
					</Typography>
					<Box>
						{props.version_control_link && (
							<Button onClick={openVersionControlLink} className={classes.linkButton} variant="contained">
								<Box
									display="flex"
									flexWrap="wrap"
									style={{ gap: "1rem", wordBreak: "break-all" }}
									alignItems="center"
								>
									<Typography variant="subtitle2" color="primary">
										{props.version_control_link.match(/(https:\/\/)(.*)/)[2]}
									</Typography>
								</Box>
							</Button>
						)}
					</Box>
					{hideVersionControlAdditionForm ? (
						<Button
							className={classes.linkButton}
							variant="contained"
							color="primary"
							onClick={handleFormAdditionClick}
							disabled={UIRestrictionForRoles.includes(props.currentUserRole)}
						>
							{props.version_control_link ? "Change version control link" : "Add version control link"}
						</Button>
					) : (
						<Box p={1}>
							<VersionSystemAdditionForm
								teamId={props.teamId}
								handleTeamFieldsUpdate={props.handleTeamFieldsUpdate}
								hideForm={hideFormAddition}
							/>
						</Box>
					)}
				</Box>
			</Box>
		</Paper>
	);
}
