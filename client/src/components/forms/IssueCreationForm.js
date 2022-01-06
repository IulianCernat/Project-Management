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
import { usePostFetch, usePatchFetch } from "customHooks/useFetch.js";
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
	insertCreation: PropTypes.func.isRequired,
	updateIssuesWithNewIssue: PropTypes.func.isRequired,
	issueUpdateData: PropTypes.object.isRequired,
	performIssueUpdate: PropTypes.func.isRequired,
	projectId: PropTypes.number.isRequired,
};
export default function IssueCreationForm({
	updateIssuesWithNewIssue,
	performIssueUpdate,
	issueUpdateData,
	insertCreation,
	projectId,
}) {
	const { additionalUserInfo } = useAuth();
	const [requestBodyForPost, setRequestBodyForPost] = useState(null);
	const [requestBodyForPatch, setRequestBodyForPatch] = useState(null);

	const {
		receivedData: postFetchReceivedData,
		error: postFetchError,
		isLoading: postFetchIsLoading,
		isRejected: postFetchIsRejected,
		isResolved: postFetchIsResolved,
	} = usePostFetch("api/issues/", requestBodyForPost);

	const updateIssueStatus = usePatchFetch(`api/issues/${issueUpdateData?.id}`, requestBodyForPatch);

	useEffect(() => {
		if (postFetchIsResolved) {
			insertCreation(postFetchReceivedData);
		}
	}, [postFetchIsResolved, postFetchReceivedData, insertCreation]);

	useEffect(() => {
		if (updateIssueStatus.isResolved) updateIssuesWithNewIssue(updateIssueStatus.receivedData);
	}, [updateIssueStatus, updateIssuesWithNewIssue]);

	return (
		<>
			<Formik
				validationSchema={validationSchema}
				initialValues={{
					title: performIssueUpdate ? issueUpdateData.title : "",
					description: performIssueUpdate ? issueUpdateData.description : "",
					type: performIssueUpdate ? issueUpdateData.type : "story",
					priority: performIssueUpdate ? issueUpdateData.priority : "1",
				}}
				onSubmit={async (values) => {
					if (performIssueUpdate) {
						setRequestBodyForPatch(JSON.stringify(values));
						return;
					}
					let requestObj = {};
					requestObj["title"] = values.title;
					requestObj["description"] = values.description;
					requestObj["created_at"] = new Date().toISOString();
					requestObj["type"] = values.type;
					requestObj["priority"] = values.priority;
					requestObj["project_id"] = projectId;
					requestObj["creator_user_id"] = additionalUserInfo.id;

					const stringifiedData = JSON.stringify(requestObj);

					setRequestBodyForPost(stringifiedData);
				}}
			>
				{({ setFieldValue }) => (
					<Form>
						<TextFieldWrapper
							defaultValue={performIssueUpdate ? issueUpdateData.title : ""}
							multiline
							variant="outlined"
							required
							fullWidth
							margin="normal"
							id="title"
							label="Title"
							name="title"
							disabled={postFetchIsLoading || updateIssueStatus.isLoading}
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
							defaultValue={performIssueUpdate ? issueUpdateData.description : ""}
							multiline
							variant="outlined"
							fullWidth
							rows={20}
							maxTextWidth={maxIssueDescriptionLen}
							margin="normal"
							id="description"
							label="Description"
							name="description"
							disabled={postFetchIsLoading || updateIssueStatus.isLoading}
						/>

						<Button
							type="submit"
							fullWidth
							variant="contained"
							color="primary"
							disabled={postFetchIsLoading || updateIssueStatus.isLoading}
						>
							<Typography>{performIssueUpdate ? "Update issue" : "Create issue"}</Typography>
						</Button>

						{postFetchIsResolved ? (
							<Alert severity="success">
								<Typography>New issue created</Typography>
							</Alert>
						) : null}
						{updateIssueStatus.isResolved ? (
							<Alert severity="success">
								<Typography>Issue updated</Typography>
							</Alert>
						) : null}
						{postFetchIsRejected && (
							<Alert severity="error">
								<Typography>{postFetchError}</Typography>
							</Alert>
						)}
						{updateIssueStatus.isRejected ? (
							<Alert severity="error">
								<Typography>{updateIssueStatus.error}</Typography>
							</Alert>
						) : null}
					</Form>
				)}
			</Formik>
		</>
	);
}
