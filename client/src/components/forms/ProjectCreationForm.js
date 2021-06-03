import { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Button, Typography, Backdrop, makeStyles } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { TextFieldWrapper } from "./InputFieldsWrappers";
import {
	projectNameValidSchema,
	projectDescriptionValidSchema,
} from "../../utils/validationSchemas";
import { usePostFetch } from "../../customHooks/useFetch.js";
import PropTypes from "prop-types";

const useStyles = makeStyles((theme) => ({
	backdrop: {
		zIndex: theme.zIndex.drawer + 1,
		color: "#fff",
	},
}));

const validationSchema = Yup.object({
	name: projectNameValidSchema,
	description: projectDescriptionValidSchema,
});

projectDescriptionValidSchema.propTypes = {
	productOwnerid: PropTypes.number.isRequired,
};
export default function ProjectCreationForm(props) {
	const [requestBody, setRequestBody] = useState(null);
	const { status, receivedData, error, isLoading, isRejected, isResolved } =
		usePostFetch("api/projects/", requestBody);

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
						disabled={isLoading}
					/>

					<TextFieldWrapper
						multiline
						variant="outlined"
						required
						fullWidth
						rows={8}
						maxTextWidth={500}
						margin="normal"
						id="description"
						label="description"
						name="description"
						disabled={isLoading}
					/>

					<Button
						type="submit"
						fullWidth
						variant="contained"
						color="primary"
						disabled={isLoading}
					>
						<Typography>Create project</Typography>
					</Button>
					{isResolved && (
						<Alert severity="success">
							<Typography>{receivedData}</Typography>
						</Alert>
					)}
					{isRejected && (
						<Alert severity="error">
							<Typography>{error}</Typography>
						</Alert>
					)}
				</Form>
			</Formik>
		</>
	);
}
