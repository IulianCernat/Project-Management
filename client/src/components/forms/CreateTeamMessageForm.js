import { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Button, Typography } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { TextFieldWrapper } from "./InputFieldsWrappers";
import { messageValidSchema, maxMessageBodyLen } from "utils/validationSchemas";
import { usePostFetch } from "customHooks/useFetch.js";
import PropTypes from "prop-types";

const validationSchema = Yup.object({
	message: messageValidSchema,
});

TeammMessageCreationForm.propTypes = {
	onClose: PropTypes.func,
	insertCreation: PropTypes.func,
	teamId: PropTypes.number.isRequired,
};
export default function TeammMessageCreationForm({ onClose, insertCreation, teamId }) {
	const [requestBody, setRequestBody] = useState(null);
	const {
		receivedData: postFetchReceivedData,
		error: postFetchError,
		isLoading: postFetchIsLoading,
		isRejected: postFetchIsRejected,
		isResolved: postFetchIsResolved,
	} = usePostFetch("api/team_messages/", requestBody);

	useEffect(() => {
		if (postFetchIsResolved) {
			insertCreation(postFetchReceivedData);
			onClose();
		}
	}, [postFetchReceivedData, postFetchIsResolved]);

	return (
		<>
			<Formik
				validationSchema={validationSchema}
				initialValues={{
					body: "",
				}}
				onSubmit={async (values) => {
					let requestObj = {};
					requestObj["body"] = values.body;
					requestObj["team_id"] = teamId;
					requestObj["created_at"] = new Date().toISOString();

					const stringifiedData = JSON.stringify(requestObj);
					setRequestBody(stringifiedData);
				}}
			>
				<Form>
					<TextFieldWrapper
						multiline
						variant="outlined"
						fullWidth
						rows={20}
						maxTextWidth={maxMessageBodyLen}
						margin="normal"
						id="body"
						label="Announcement"
						name="body"
						disabled={postFetchIsLoading}
					/>

					<Button
						type="submit"
						fullWidth
						variant="contained"
						color="primary"
						disabled={postFetchIsLoading}
					>
						<Typography>Add announcement</Typography>
					</Button>

					{postFetchIsResolved && (
						<Alert severity="success">
							<Typography>Announcement added </Typography>
						</Alert>
					)}
					{postFetchIsRejected && (
						<Alert severity="error">
							<Typography>{postFetchError}</Typography>
						</Alert>
					)}
				</Form>
			</Formik>
		</>
	);
}
