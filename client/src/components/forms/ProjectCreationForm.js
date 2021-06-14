import { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Button, Typography } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { TextFieldWrapper } from "./InputFieldsWrappers";
import {
	projectNameValidSchema,
	projectDescriptionValidSchema,
} from "utils/validationSchemas";
import { usePostFetch, useGetFetch } from "customHooks/useFetch.js";
import PropTypes from "prop-types";
import { maxProjectDescriptionLen } from "utils/validationSchemas";

const validationSchema = Yup.object({
	name: projectNameValidSchema,
	description: projectDescriptionValidSchema,
});

projectDescriptionValidSchema.propTypes = {
	productOwnerid: PropTypes.number.isRequired,
	insertNewCreatedProject: PropTypes.func.isRequired,
};
export default function ProjectCreationForm(props) {
	const [requestBody, setRequestBody] = useState(null);
	const [createdProjectId, setCreateProjectId] = useState();
	const [startFetchingNewCreatedResource, setStartFetchingNewCreatedResource] =
		useState(false);

	const {
		receivedData: projectCreationReceivedData,
		error: projectCreationError,
		isLoading: isLoadingProjectCreation,
		isRejected: isRejectedProjectCreation,
		isResolved: isResolvedProjectCreation,
	} = usePostFetch("api/projects/", requestBody);
	const {
		receivedData: fetchedNewCreatedResource,
		error: fetchedNewCreatedResourceError,
		isLoading: fetchedNewCreatedResourceIsLoading,
		isRejected: fetchedNewCreatedResourceIsRejected,
		isResolved: fetchedNewCreatedResourceIsResolved,
	} = useGetFetch(
		`api/projects/${createdProjectId}`,
		null,
		startFetchingNewCreatedResource
	);
	useEffect(() => {
		if (!isResolvedProjectCreation) return;
		setCreateProjectId(projectCreationReceivedData.split("/").pop());
		setStartFetchingNewCreatedResource(true);
	}, [isResolvedProjectCreation]);

	useEffect(() => {
		if (fetchedNewCreatedResourceIsResolved)
			props.insertNewCreatedProject(fetchedNewCreatedResource);
	}, [fetchedNewCreatedResourceIsResolved]);

	return (
		<>
			<Formik
				initialValues={{
					name: "",
					description: "",
				}}
				validationSchema={validationSchema}
				onSubmit={async (values) => {
					values["created_at"] = new Date().toISOString();
					values["product_owner_id"] = props.productOwnerId;
					const stringifiedData = JSON.stringify(values);
					setRequestBody(stringifiedData);
				}}
			>
				<Form>
					<TextFieldWrapper
						variant="outlined"
						required
						fullWidth
						margin="normal"
						id="name"
						label="Name"
						name="name"
						disabled={isLoadingProjectCreation}
					/>

					<TextFieldWrapper
						multiline
						variant="outlined"
						required
						fullWidth
						rows={20}
						maxTextWidth={maxProjectDescriptionLen}
						margin="normal"
						id="description"
						label="description"
						name="description"
						disabled={isLoadingProjectCreation}
					/>

					<Button
						type="submit"
						fullWidth
						variant="contained"
						color="primary"
						disabled={isLoadingProjectCreation}
					>
						<Typography>Create project</Typography>
					</Button>
					{isResolvedProjectCreation && (
						<Alert severity="success">
							<Typography>New project created</Typography>
						</Alert>
					)}
					{isRejectedProjectCreation && (
						<Alert severity="error">
							<Typography>{projectCreationError}</Typography>
						</Alert>
					)}
				</Form>
			</Formik>
		</>
	);
}
