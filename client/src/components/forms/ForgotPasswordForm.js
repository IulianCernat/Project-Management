import { useState } from "react";
import { Typography, Button } from "@material-ui/core";
import { TextFieldWrapper } from "./InputFieldsWrappers";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { Alert } from "@material-ui/lab";
import { emailValidationSchema } from "utils/validationSchemas";
import { useAuth } from "contexts/AuthContext";
const validationSchema = Yup.object().shape({
	email: emailValidationSchema,
});

export default function ForgotPasswordForm() {
	const { resetPassword } = useAuth();
	const [firebaseError, setFirebaseError] = useState();
	const [emailSent, setEmailSent] = useState();
	return (
		<>
			<Typography>Sign up for your account</Typography>
			<Formik
				initialValues={{
					email: "",
				}}
				validationSchema={validationSchema}
				onSubmit={(values, { setSubmitting }) => {
					try {
						resetPassword(values.email);
						setSubmitting(false);
						setEmailSent(true);
					} catch (err) {
						setFirebaseError(err.toString());
					}
				}}
			>
				{({ isSubmitting }) => (
					<Form>
						<TextFieldWrapper
							variant="outlined"
							margin="normal"
							required
							fullWidth
							id="email"
							label="Email Address"
							name="email"
							autoComplete="email"
						/>

						<Button
							type="submit"
							fullWidth
							variant="contained"
							color="primary"
							disabled={isSubmitting}
						>
							<Typography>Send email</Typography>
						</Button>
						{firebaseError && (
							<Alert severity="error">
								<Typography>{firebaseError}</Typography>
							</Alert>
						)}
						{emailSent && (
							<Alert severity="success">
								<Typography>An email with instructions was sent</Typography>
							</Alert>
						)}
					</Form>
				)}
			</Formik>
		</>
	);
}
