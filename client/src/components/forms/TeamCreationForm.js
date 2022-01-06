import { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Button, Typography, Avatar, Box, Hidden } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { TextFieldWrapper } from "./InputFieldsWrappers";
import {
	teamNameValidSchema,
	teamDescriptionValidSchema,
	generalInputString,
	maxTeamDescriptionLen,
} from "utils/validationSchemas";

import { usePostFetch, usePatchFetch } from "customHooks/useFetch.js";
import { SearchField } from "./SearchField";
import PropTypes from "prop-types";

const generateValidationSchema = (isUpdateSchema) => {
	const baseSchema = {
		name: teamNameValidSchema,
		description: teamDescriptionValidSchema,
	};
	if (!isUpdateSchema) baseSchema.scrum_master = generalInputString;
	return Yup.object(baseSchema);
};

TeamCreationForm.propTypes = {
	insertNewTeam: PropTypes.func.isRequired,
	projectId: PropTypes.number.isRequired,
	performTeamUpdate: PropTypes.bool,
	updateTeamsWithNewTeam: PropTypes.func,
	teamUpdateData: PropTypes.object,
};
export default function TeamCreationForm({
	insertNewTeam,
	projectId,
	performTeamUpdate,
	updateTeamsWithNewTeam,
	teamUpdateData,
}) {
	const [requestBodyForPost, setRequestBodyForPost] = useState(null);
	const [requestBodyForPatch, setRequestBodyForPatch] = useState(null);
	const teamCreationStatus = usePostFetch("api/teams/", requestBodyForPost);
	const teamUpdateStatus = usePatchFetch(`api/teams/${teamUpdateData?.id}`, requestBodyForPatch);

	useEffect(() => {
		if (teamCreationStatus.isResolved) insertNewTeam(teamCreationStatus.receivedData);
	}, [teamCreationStatus, insertNewTeam]);

	useEffect(() => {
		if (teamUpdateStatus.isResolved) {
			updateTeamsWithNewTeam(teamUpdateStatus.receivedData);
		}
	}, [teamUpdateStatus, updateTeamsWithNewTeam]);

	return (
		<>
			<Formik
				initialValues={
					performTeamUpdate
						? { name: teamUpdateData.name, description: teamUpdateData.description }
						: {
								name: "",
								description: "",
								scrum_master: "",
						  }
				}
				validationSchema={generateValidationSchema(performTeamUpdate)}
				onSubmit={async (values) => {
					if (performTeamUpdate) {
						setRequestBodyForPatch(JSON.stringify(values));
						return;
					}

					let requestObj = {};
					requestObj["name"] = values.name;
					requestObj["description"] = values.description;
					requestObj["created_at"] = new Date().toISOString();
					requestObj["project_id"] = projectId;
					requestObj["scrum_master_id"] = JSON.parse(values.scrum_master).id;

					const stringifiedData = JSON.stringify(requestObj);

					setRequestBodyForPost(stringifiedData);
				}}
			>
				{({ setFieldValue }) => (
					<Form>
						<TextFieldWrapper
							defaultValue={performTeamUpdate ? teamUpdateData.name : ""}
							multiline
							variant="outlined"
							required
							fullWidth
							margin="normal"
							id="name"
							label="Name"
							name="name"
							disabled={teamCreationStatus.isLoading || teamUpdateStatus.isLoading}
						/>
						{!performTeamUpdate ? (
							<>
								<SearchField
									fetchUrl="api/user_profiles/"
									partOfProjectId={projectId}
									setSelectedResource={(resource) => {
										setFieldValue("scrum_master", resource);
									}}
									inputNode={
										<TextFieldWrapper
											variant="outlined"
											required
											margin="normal"
											id="searchTerm"
											label="Add scrum master"
											name="searchTerm"
										/>
									}
									optionWireFrame={(option) => (
										<Box
											width="100%"
											display="flex"
											alignItems="center"
											justifyContent="space-between"
											px={4}
										>
											<Avatar src={option.avatar_url}>{option.fullName.slice(0, 2)}</Avatar>
											<Typography>{option.fullName}</Typography>
											<Typography>{option.is_part_of_project ? "joined" : null}</Typography>
										</Box>
									)}
									optionLabel="fullName"
									isOptionDisabled={(option) => option.is_part_of_project}
								/>
								<Hidden xsUp>
									<TextFieldWrapper id="scrum_master" label="userId" name="scrum_master" />
								</Hidden>
							</>
						) : null}

						<TextFieldWrapper
							defaultValue={performTeamUpdate ? teamUpdateData.description : ""}
							multiline
							variant="outlined"
							required
							fullWidth
							rows={20}
							margin="normal"
							id="description"
							label="description"
							name="description"
							maxTextWidth={maxTeamDescriptionLen}
							disabled={teamCreationStatus.isLoading || teamUpdateStatus.isLoading}
						/>

						<Button
							type="submit"
							fullWidth
							variant="contained"
							color="primary"
							disabled={teamCreationStatus.isLoading || teamUpdateStatus.isLoading}
						>
							<Typography>{performTeamUpdate ? "Update team" : "Create team"}</Typography>
						</Button>

						{teamCreationStatus.isResolved ? (
							<Alert severity="success">
								<Typography>New Team created</Typography>
							</Alert>
						) : null}
						{teamUpdateStatus.isResolved ? (
							<Alert severity="success">
								<Typography>Team updated</Typography>
							</Alert>
						) : null}
						{teamCreationStatus.isRejected ? (
							<Alert severity="error">
								<Typography>{teamCreationStatus.error}</Typography>
							</Alert>
						) : null}
						{teamUpdateStatus.isRejected ? (
							<Alert severity="error">
								<Typography>{teamUpdateStatus.error}</Typography>
							</Alert>
						) : null}
					</Form>
				)}
			</Formik>
		</>
	);
}
