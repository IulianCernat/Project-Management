import { useState, useEffect, useRef } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Button, Typography, Box } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { TextFieldWrapper } from "./InputFieldsWrappers";
import { emailValidationSchema, fullNameValidationSchema } from "../../utils/validationSchemas";
import { usePostFetch } from "../../customHooks/useFetch.js";
import PropTypes from "prop-types";

const validationSchema = Yup.object({
	email: emailValidationSchema,
	fullName: fullNameValidationSchema,
});

CreateTeacherAccountForm.propTypes = {
	currentUser: PropTypes.object.isRequired,
	insertNewProfile: PropTypes.func.isRequired,
};
export default function CreateTeacherAccountForm(props) {
	const [requestBody, setRequestBody] = useState(null);
	const headers = useRef({
		Authorization: "",
	});
	const { receivedData, error, isLoading, isRejected, isResolved } = usePostFetch(
		`api/firebase_users/`,
		requestBody,
		headers.current
	);

	useEffect(() => {
		if (isResolved) {
			props.insertNewProfile(receivedData);
		}
	}, [isResolved, receivedData]);

	return (
		<>
			<Formik
				initialValues={{
					fullName: "",
					email: "",
				}}
				validationSchema={validationSchema}
				onSubmit={async (values) => {
					let userIdToken = await props.currentUser.getIdToken();
					headers.current.Authorization = `firebase_id_token=${userIdToken}`;
					let requestObj = {};
					requestObj["fullName"] = values.fullName;
					requestObj["email"] = values.email;
					requestObj["firebase_claims"] = { teacher: true };
					requestObj["is_user_teacher"] = true;
					const stringifiedData = JSON.stringify(requestObj);
					setRequestBody(stringifiedData);
				}}
			>
				<Form>
					<TextFieldWrapper
						variant="outlined"
						required
						fullWidth
						margin="normal"
						id="fullName"
						label="fullName"
						name="fullName"
						disabled={isLoading}
					/>
					<TextFieldWrapper
						variant="outlined"
						required
						fullWidth
						margin="normal"
						id="email"
						label="email"
						name="email"
						disabled={isLoading}
					/>
					<Box display="flex" style={{ gap: "1rem" }} flexWrap="wrap">
						<Box flex="1 1 auto">
							<Button
								size="small"
								type="submit"
								fullWidth
								variant="contained"
								color="primary"
								disabled={isLoading}
							>
								<Typography>Create teacher account</Typography>
							</Button>
						</Box>
					</Box>

					{isResolved && (
						<Alert severity="success">
							<Typography>Teacher account created</Typography>
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
