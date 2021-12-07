import { useState, useRef, useEffect } from "react";
import { Typography, Button, Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { TextFieldWrapper, TextFieldSelectWrapper } from "./InputFieldsWrappers";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useHistory } from "react-router-dom";
import { useAuth } from "contexts/AuthContext";
import { usePostFetch } from "customHooks/useFetch";
import { Alert } from "@material-ui/lab";
import {
	emailValidationSchema,
	passwordValidationSchema,
	fullNameValidationSchema,
	studentGroupValidSchema,
	studentGroupOptions,
} from "utils/validationSchemas";

const validationSchema = Yup.object().shape({
	email: emailValidationSchema,
	fullName: fullNameValidationSchema,
	password: passwordValidationSchema,
	studentGroup: studentGroupValidSchema,
});

const useStyles = makeStyles((theme) => ({
	menuPaper: {
		maxHeight: 100,
	},
}));

export default function SignUpForm() {
	const classes = useStyles();
	const { signUp, logout } = useAuth();
	const history = useHistory();
	const [firebaseError, setFirebaseError] = useState("");
	const [requestBody, setRequestBody] = useState(null);
	const headers = useRef({
		Authorization: "",
	});
	const { receivedData, error, isLoading, isRejected, isResolved } = usePostFetch(
		"api/user_profiles/",
		requestBody,
		headers.current
	);

	useEffect(() => {
		if (isResolved) {
			logout();
			history.push("/");
		}
	}, [isResolved]);
	return (
		<>
			<Typography>Sign up for your account</Typography>
			<Formik
				initialValues={{
					email: "",
					fullName: "",
					password: "",
					studentGroup: "",
				}}
				validationSchema={validationSchema}
				onSubmit={async (values, { setSubmitting }) => {
					try {
						let userCredential = await signUp(values.email, values.password);
						let userIdToken = await userCredential.user.getIdToken();
						headers.current.Authorization = `firebase_id_token=${userIdToken}`;
						let requestObj = {};
						requestObj["fullName"] = values.fullName;
						requestObj["contact"] = values.email;
						requestObj["student_group"] = values.studentGroup;
						requestObj["is_user_student"] = true;
						setRequestBody(JSON.stringify(requestObj));
						setSubmitting(true);
					} catch (err) {
						setFirebaseError(err.toString());
					}
				}}
			>
				{({ values, isSubmitting, setFieldValue }) => (
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
						<Box display="flex" style={{ gap: "5px" }}>
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
							<TextFieldSelectWrapper
								margin="normal"
								required
								variant="outlined"
								id="studentGroup"
								label="Student Group"
								name="studentGroup"
								menuOptions={studentGroupOptions}
								disabled={isLoading}
								runChangeEffect={(studentGroup) => {
									setFieldValue("studentGroup", studentGroup);
								}}
								selectComponentMenuProps={{
									classes: { paper: classes.menuPaper },
								}}
							/>
						</Box>

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
							disabled={isSubmitting || isLoading}
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
