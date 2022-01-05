import { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Button, Typography } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { TextFieldWrapper } from "./InputFieldsWrappers";
import { projectNameValidSchema, projectDescriptionValidSchema } from "utils/validationSchemas";
import { usePatchFetch, usePostFetch } from "customHooks/useFetch.js";
import PropTypes from "prop-types";
import { maxProjectDescriptionLen } from "utils/validationSchemas";

const validationSchema = Yup.object({
	name: projectNameValidSchema,
	description: projectDescriptionValidSchema,
});

projectDescriptionValidSchema.propTypes = {
	productOwnerid: PropTypes.number.isRequired,
	insertNewCreatedProject: PropTypes.func.isRequired,
	performProjectUpdate: PropTypes.bool,
	updateProjectsWithNewProject: PropTypes.func,
	projectUpdateData: PropTypes.object,
};
export default function ProjectCreationForm({
	productOwnerId,
	insertNewCreatedProject,
	performProjectUpdate,
	updateProjectsWithNewProject,
	projectUpdateData,
}) {
	const [requestBodyForPost, setRequestBodyForPost] = useState(null);
	const [requestBodyForPatch, setRequestBodyForPatch] = useState(null);
	const projectCreationStatus = usePostFetch("api/projects/", requestBodyForPost);
	const projectUpdateStatus = usePatchFetch(`api/projects/${projectUpdateData?.id}`, requestBodyForPatch);

	useEffect(() => {
		if (!projectCreationStatus.isResolved) return;
		if (projectCreationStatus.isResolved) insertNewCreatedProject(projectCreationStatus.receivedData);
	}, [projectCreationStatus, insertNewCreatedProject]);

	useEffect(() => {
		if (projectUpdateStatus.isResolved) {
			updateProjectsWithNewProject(projectUpdateStatus.receivedData);
		}
	}, [projectUpdateStatus, updateProjectsWithNewProject]);
	return (
		<>
			<Formik
				initialValues={{
					name: performProjectUpdate ? projectUpdateData.name : null,
					description: performProjectUpdate ? projectUpdateData.description : null,
				}}
				validationSchema={validationSchema}
				onSubmit={async (values) => {
					if (performProjectUpdate) {
						setRequestBodyForPatch(JSON.stringify(values));
						return;
					}
					values["created_at"] = new Date().toISOString();
					values["product_owner_id"] = productOwnerId;
					const stringifiedData = JSON.stringify(values);

					setRequestBodyForPost(stringifiedData);
				}}
			>
				<Form>
					<TextFieldWrapper
						defaultValue={performProjectUpdate ? projectUpdateData.name : ""}
						multiline
						variant="outlined"
						required
						fullWidth
						margin="normal"
						id="name"
						label="name"
						name="name"
						disabled={projectCreationStatus.isLoading || projectUpdateStatus.isloading}
					/>

					<TextFieldWrapper
						defaultValue={performProjectUpdate ? projectUpdateData.description : ""}
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
						disabled={projectCreationStatus.isLoading || projectUpdateStatus.isloading}
					/>

					<Button
						type="submit"
						fullWidth
						variant="contained"
						color="primary"
						disabled={projectCreationStatus.isLoading || projectUpdateStatus.isloading}
					>
						<Typography>{performProjectUpdate ? "Update project" : "Create project"}</Typography>
					</Button>
					{projectCreationStatus.isResolved ? (
						<Alert severity="success">
							<Typography>New project created</Typography>
						</Alert>
					) : null}
					{projectUpdateStatus.isResolved ? (
						<Alert severity="success">
							<Typography>Project updated</Typography>
						</Alert>
					) : null}
					{projectCreationStatus.isRejected ? (
						<Alert severity="error">
							<Typography>{projectCreationStatus.error}</Typography>
						</Alert>
					) : null}
					{projectUpdateStatus.isRejected ? (
						<Alert severity="error">
							<Typography>{projectUpdateStatus.error}</Typography>
						</Alert>
					) : null}
				</Form>
			</Formik>
		</>
	);
}
