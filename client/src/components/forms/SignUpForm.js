import { useState, useRef, useEffect } from "react";
import { Typography, Button } from "@material-ui/core";
import { TextFieldWrapper } from "./InputFieldsWrappers";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useHistory } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { usePostFetch } from "customHooks/useFetch";
import { Alert } from "@material-ui/lab";

import {
	emailValidationSchema,
	passwordValidationSchema,
	fullNameValidationSchema,
} from "../../utils/validationSchemas";

const validationSchema = Yup.object().shape({
	email: emailValidationSchema,
	fullName: fullNameValidationSchema,
	password: passwordValidationSchema,
});

export default function SignUpForm() {
	const { signUp } = useAuth();
	const history = useHistory();
	const [firebaseError, setFirebaseError] = useState("");
	const [requestBody, setRequestBody] = useState(null);
	const headers = useRef({
		Authorization: "",
	});
	const { status, receivedData, error, isLoading, isRejected, isResolved } =
		usePostFetch("api/users/", requestBody, headers.current);
	useEffect(() => {
		if (isResolved) history.push("/");
	}, [isResolved]);
	return (
		<>
			<Typography>Sign up for your account</Typography>
			<Formik
				initialValues={{
					email: "",
					fullName: "",
					password: "",
				}}
				validationSchema={validationSchema}
				onSubmit={async (values, { setSubmitting }) => {
					try {
						let userCredential = await signUp(values.email, values.password);
						let userIdToken = await userCredential.user.getIdToken();
						headers.current.Authorization = userIdToken;
						let requestObj = {};
						requestObj["fullName"] = values.fullName;
						setRequestBody(JSON.stringify(requestObj));
						setSubmitting(false);
					} catch (err) {
						setFirebaseError(err.toString());
					}
				}}
			>
				{({ values, isSubmitting }) => (
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

						<TextFieldWrapper
							variant="outlined"
							margin="normal"
							required
							fullWidth
							name="fullName"
							label="Full name"
							type="text"
							id="fullName"
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
						/>

						<Button
							type="submit"
							fullWidth
							variant="contained"
							color="primary"
							disabled={isSubmitting}
						>
							<Typography>Sign up</Typography>
						</Button>

						{isRejected && (
							<Alert severity="error">
								<Typography>{error}</Typography>
							</Alert>
						)}
						{firebaseError && (
							<Alert severity="error">
								<Typography>{firebaseError}</Typography>
							</Alert>
						)}
					</Form>
				)}
			</Formik>
		</>
	);
}
