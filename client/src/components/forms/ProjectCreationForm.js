import { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Button, Typography } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { TextFieldWrapper } from "./InputFieldsWrappers";
import { projectNameValidSchema, projectDescriptionValidSchema } from "utils/validationSchemas";
import { usePostFetch } from "customHooks/useFetch.js";
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
export default function ProjectCreationForm({ productOwnerId, insertNewCreatedProject }) {
	const [requestBody, setRequestBody] = useState(null);
	const projectCreationStatus = usePostFetch("api/projects/", requestBody);

	useEffect(() => {
		console.log(`form rerun ${projectCreationStatus.isResolved}`);
		if (!projectCreationStatus.isResolved) return;
		if (projectCreationStatus.isResolved)
			insertNewCreatedProject(projectCreationStatus.receivedData);
	}, [projectCreationStatus, insertNewCreatedProject]);

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
					values["product_owner_id"] = productOwnerId;
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
						disabled={projectCreationStatus.isLoading}
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
						disabled={projectCreationStatus.isLoading}
					/>

					<Button
						type="submit"
						fullWidth
						variant="contained"
						color="primary"
						disabled={projectCreationStatus.isLoading}
					>
						<Typography>Create project</Typography>
					</Button>
					{projectCreationStatus.isResolved && (
						<Alert severity="success">
							<Typography>New project created</Typography>
						</Alert>
					)}
					{projectCreationStatus.isRejected && (
						<Alert severity="error">
							<Typography>{projectCreationStatus.error}</Typography>
						</Alert>
					)}
				</Form>
			</Formik>
		</>
	);
}
