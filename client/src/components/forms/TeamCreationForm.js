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

import { usePostFetch } from "customHooks/useFetch.js";
import { SearchField } from "./SearchField";
import PropTypes from "prop-types";

const validationSchema = Yup.object({
	name: teamNameValidSchema,
	description: teamDescriptionValidSchema,
	scrum_master: generalInputString,
});

TeamCreationForm.propTypes = {
	insertNewTeam: PropTypes.func.isRequired,
	projectId: PropTypes.number.isRequired,
};
export default function TeamCreationForm({ insertNewTeam, projectId }) {
	const [requestBody, setRequestBody] = useState(null);
	const teamCreationStatus = usePostFetch("api/teams/", requestBody);

	useEffect(() => {
		if (teamCreationStatus.isResolved) insertNewTeam(teamCreationStatus.receivedData);
	}, [teamCreationStatus, insertNewTeam]);

	return (
		<>
			<Formik
				initialValues={{
					name: "",
					description: "",
					scrum_master: "",
				}}
				validationSchema={validationSchema}
				onSubmit={async (values) => {
					let requestObj = {};
					requestObj["name"] = values.name;
					requestObj["description"] = values.description;
					requestObj["created_at"] = new Date().toISOString();
					requestObj["project_id"] = projectId;
					requestObj["scrum_master_id"] = JSON.parse(values.scrum_master).id;

					const stringifiedData = JSON.stringify(requestObj);

					setRequestBody(stringifiedData);
				}}
			>
				{({ setFieldValue }) => (
					<Form>
						<TextFieldWrapper
							variant="outlined"
							required
							fullWidth
							margin="normal"
							id="name"
							label="Name"
							name="name"
							disabled={teamCreationStatus.isLoading}
						/>
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

						<TextFieldWrapper
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
							disabled={teamCreationStatus.isLoading}
						/>

						<Button
							type="submit"
							fullWidth
							variant="contained"
							color="primary"
							disabled={teamCreationStatus.isLoading}
						>
							<Typography>Create team</Typography>
						</Button>

						{teamCreationStatus.isResolved && (
							<Alert severity="success">
								<Typography>New Team created</Typography>
							</Alert>
						)}
						{teamCreationStatus.isRejected && (
							<Alert severity="error">
								<Typography>{teamCreationStatus.error}</Typography>
							</Alert>
						)}
					</Form>
				)}
			</Formik>
		</>
	);
}
