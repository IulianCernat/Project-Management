import { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Button, Typography, Box, makeStyles } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { TextFieldWrapper, TextFieldSelectWrapper } from "./InputFieldsWrappers";
import {
	issueDescriptionValidSchema,
	issuePriorityValidSchema,
	issueTitleValidSchema,
	issueTypeValidSchema,
	maxIssueDescriptionLen,
} from "utils/validationSchemas";
import { usePostFetch, useGetFetch } from "customHooks/useFetch.js";
import PropTypes from "prop-types";
import { useAuth } from "contexts/AuthContext";

const validationSchema = Yup.object({
	title: issueTitleValidSchema,
	description: issueDescriptionValidSchema,
	type: issueTypeValidSchema,
	priority: issuePriorityValidSchema,
});

const issueTypeOptions = (function () {
	let options = [];
	const priorities = ["story", "task", "bug"];
	priorities.forEach((item) => {
		options.push({
			value: item,
			label: item,
		});
	});
	return options;
})();

const issuePriorityOptions = (function () {
	let options = [];
	const priorities = ["1", "2", "3", "4", "5"];
	priorities.forEach((item) => {
		options.push({
			value: item,
			label: item,
		});
	});
	return options;
})();

IssueCreationForm.propTypes = {
	onClose: PropTypes.func,
	insertCreation: PropTypes.func,
	projectId: PropTypes.number.isRequired,
};
export default function IssueCreationForm({ onClose, insertCreation, projectId }) {
	const { additionalUserInfo } = useAuth();
	const [requestBody, setRequestBody] = useState(null);

	const {
		receivedData: postFetchReceivedData,
		error: postFetchError,
		isLoading: postFetchIsLoading,
		isRejected: postFetchIsRejected,
		isResolved: postFetchIsResolved,
	} = usePostFetch("api/issues/", requestBody);

	useEffect(() => {
		if (postFetchIsResolved) {
			insertCreation(postFetchReceivedData);
		}
	}, [postFetchIsResolved, postFetchReceivedData, insertCreation]);

	return (
		<>
			<Formik
				validationSchema={validationSchema}
				initialValues={{
					title: "",
					description: "",
					type: "story",
					priority: "1",
				}}
				onSubmit={async (values) => {
					let requestObj = {};
					requestObj["title"] = values.title;
					requestObj["description"] = values.description;
					requestObj["created_at"] = new Date().toISOString();
					requestObj["type"] = values.type;
					requestObj["priority"] = values.priority;
					requestObj["project_id"] = projectId;
					requestObj["creator_user_id"] = additionalUserInfo.id;

					const stringifiedData = JSON.stringify(requestObj);

					setRequestBody(stringifiedData);
				}}
			>
				{({ setFieldValue }) => (
					<Form>
						<TextFieldWrapper
							variant="outlined"
							required
							fullWidth
							margin="normal"
							id="title"
							label="Title"
							name="title"
							disabled={postFetchIsLoading}
						/>
						<Box display="flex" flexWrap="wrap" flexDirection="row" width="100%" style={{ gap: "1rem" }}>
							<Box flex="1 1 auto">
								<TextFieldSelectWrapper
									fullWidth
									variant="outlined"
									required
									margin="normal"
									id="type"
									label="Select type"
									name="type"
									disabled={postFetchIsLoading}
									menuOptions={issueTypeOptions}
									runChangeEffect={(newValue) => {
										setFieldValue("type", newValue);
									}}
								/>
							</Box>
							<Box flex="1 0 auto">
								<TextFieldSelectWrapper
									fullWidth
									variant="outlined"
									required
									margin="normal"
									id="priority"
									label="Select priority"
									name="priority"
									disabled={postFetchIsLoading}
									menuOptions={issuePriorityOptions}
									runChangeEffect={(newValue) => {
										setFieldValue("priority", newValue);
									}}
								/>
							</Box>
						</Box>
						<TextFieldWrapper
							multiline
							variant="outlined"
							fullWidth
							rows={20}
							maxTextWidth={maxIssueDescriptionLen}
							margin="normal"
							id="description"
							label="Description"
							name="description"
							disabled={postFetchIsLoading}
						/>

						<Button
							type="submit"
							fullWidth
							variant="contained"
							color="primary"
							disabled={postFetchIsLoading}
						>
							<Typography>Create issue</Typography>
						</Button>

						{postFetchIsResolved && (
							<Alert severity="success">
								<Typography>New issue created</Typography>
							</Alert>
						)}
						{postFetchIsRejected && (
							<Alert severity="error">
								<Typography>{postFetchError}</Typography>
							</Alert>
						)}
					</Form>
				)}
			</Formik>
		</>
	);
}
