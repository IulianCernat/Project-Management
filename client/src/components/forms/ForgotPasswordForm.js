import React from "react";
import { Typography, Button } from "@material-ui/core";
import { TextFieldWrapper } from "./InputFieldsWrappers";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { emailValidationSchema } from "../../utils/validationSchemas";

const validationSchema = Yup.object().shape({
	email: emailValidationSchema,
});

export default function ForgotPasswordForm() {
	return (
		<>
			<Typography>Sign up for your account</Typography>
			<Formik
				initialValues={{
					email: "",
				}}
				validationSchema={validationSchema}
				onSubmit={(values, { setSubmitting }) => {
					setTimeout(() => {
						setSubmitting(false);
					}, 400);
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
					</Form>
				)}
			</Formik>
		</>
	);
}
