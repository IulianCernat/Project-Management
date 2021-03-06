import { useState } from "react";
import { Alert } from "@material-ui/lab";
import { Box, Typography, Button } from "@material-ui/core";
import { TextFieldWrapper } from "./InputFieldsWrappers";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { emailValidationSchema, loginPasswordValidationSchema } from "utils/validationSchemas";
import { useAuth } from "contexts/AuthContext";

const validationSchema = Yup.object({
	email: emailValidationSchema,
	password: loginPasswordValidationSchema,
});

export default function LoginForm() {
	const { login, authIsLoading } = useAuth();
	const [firebaseError, setFirebaseError] = useState(null);

	return (
		<>
			<Typography>Login into your account</Typography>
			<Formik
				initialValues={{
					email: "",
					password: "",
				}}
				validationSchema={validationSchema}
				onSubmit={async (values, { setSubmitting }) => {
					try {
						await login(values.email, values.password);
						setSubmitting(false);
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
							disabled={authIsLoading || isSubmitting}
						/>
						<TextFieldWrapper
							variant="outlined"
							margin="normal"
							required
							fullWidth
							name="password"
							label="Password"
							type="password"
							id="password"
							disabled={authIsLoading || isSubmitting}
						/>
						<Button
							type="submit"
							fullWidth
							variant="contained"
							color="primary"
							disabled={isSubmitting || authIsLoading}
						>
							<Typography>Login</Typography>
						</Button>
					</Form>
				)}
			</Formik>

			<Box>
				{firebaseError && (
					<Alert severity="error">
						<Typography>{firebaseError}</Typography>
					</Alert>
				)}
			</Box>
		</>
	);
}
