import { useState, useRef, useEffect } from "react";
import { Box, Typography, Button, Grid, Paper, Link } from "@material-ui/core";
import { TextFieldWrapper } from "./InputFieldsWrappers";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { Link as RouterLink, useHistory } from "react-router-dom";
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
		<Paper elevation={3}>
			<Box p={2}>
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
							<Grid direction="column" container spacing={2}>
								<Grid item>
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
								</Grid>
								<Grid item xs={false} sm={6}>
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
								</Grid>

								<Grid item>
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
								</Grid>
								<Grid item>
									<Button
										type="submit"
										fullWidth
										variant="contained"
										color="primary"
										disabled={isSubmitting}
									>
										<Typography>Sign In</Typography>
									</Button>
								</Grid>
								<Grid item>
									<Link
										onMouseDown={(event) => {
											event.preventDefault();
										}}
										component={RouterLink}
										to="/login"
									>
										<Typography align="center">
											Already have an account? Login
										</Typography>
									</Link>
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
								</Grid>
							</Grid>
						</Form>
					)}
				</Formik>
			</Box>
		</Paper>
	);
}
