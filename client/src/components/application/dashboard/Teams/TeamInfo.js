import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
	Box,
	Paper,
	IconButton,
	Grid,
	Button,
	Avatar,
} from "@material-ui/core";
import VersionSystemAdditionForm from "components/forms/VersioningSystemAdditionForm";
import TextDisplayWrapper from "components/subComponents/TextDisplayWrapper";

const UIRestrictionForRoles = ["developer", "productOwner"];

TeamInfo.propTypes = {
	description: PropTypes.string.isRequired,
	teamId: PropTypes.number.isRequired,
	version_control_link: PropTypes.any.isRequired,
};
export default function TeamInfo(props) {
	const [hideVersionControlAdditionForm, setHideVersionControlAdditionForm] =
		useState(true);
	const [addedVersionControlUrl, setAddedVersionControlUrl] = useState(
		props.version_control_link
	);
	const handleFormAdditionClick = () => {
		setHideVersionControlAdditionForm(false);
	};
	const hideFormAddition = () => {
		setHideVersionControlAdditionForm(true);
	};
	const openVersionControlLink = () => {
		window.open(addedVersionControlUrl);
	};
	useEffect(() => {
		if (addedVersionControlUrl) {
			setHideVersionControlAdditionForm(true);
		}
	}, [addedVersionControlUrl]);

	return (
		<Grid container spacing={1}>
			<Grid item xs={12} md={6}>
				<Paper>
					<Box p={1} minHeight="50ch">
						<TextDisplayWrapper>{props.description}</TextDisplayWrapper>
					</Box>
				</Paper>
			</Grid>
			<Grid item xs={12} md={6}>
				<Paper>
					<Box p={1}>
						{hideVersionControlAdditionForm ? (
							<Button
								variant="outlined"
								color="primary"
								onClick={handleFormAdditionClick}
								disabled={UIRestrictionForRoles.includes(props.currentUserRole)}
							>
								Link your public version control link
							</Button>
						) : (
							<Box width="50ch">
								<VersionSystemAdditionForm
									teamId={props.teamId}
									setAddedVersionControlUrl={setAddedVersionControlUrl}
									hideForm={hideFormAddition}
								/>
							</Box>
						)}
						<Box>
							<IconButton onClick={openVersionControlLink}>
								<Avatar
									src={
										addedVersionControlUrl
											? (function () {
													const baseUrl =
														addedVersionControlUrl.match(/https:\/\/.*?\/+/);
													if (baseUrl) return baseUrl + "favicon.ico";
													return "";
											  })()
											: null
									}
								/>
							</IconButton>
						</Box>
					</Box>
				</Paper>
			</Grid>
		</Grid>
	);
}
