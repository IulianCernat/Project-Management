import { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
	Button,
	Typography,
	Box,
	MenuItem,
	makeStyles,
} from "@material-ui/core";

import Alert from "@material-ui/lab/Alert";
import {
	TextFieldWrapper,
	TextFieldSelectWrapper,
} from "./InputFieldsWrappers";
import {
	issueDescriptionValidSchema,
	issuePriorityValidSchema,
	issueTitleValidSchema,
	issueTypeValidSchema,
} from "../../utils/validationSchemas";
import { usePostFetch, useGetFetch } from "../../customHooks/useFetch.js";
import PropTypes from "prop-types";

const useStyles = makeStyles((theme) => ({
	backdrop: {
		zIndex: theme.zIndex.drawer + 1,
		color: "#fff",
	},
}));

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
};
export default function IssueCreationForm({ onClose, insertCreation }) {
	const [requestBody, setRequestBody] = useState(null);
	const [priorityOption, setPriorityOption] = useState("1");
	const [issueTypeOption, setIssueTypeOption] = useState("story");
	const [newIssueId, setNewIssueId] = useState(null);
	const [startFetchingNewCreatedResource, setStartFetchingNewCreatedResource] =
		useState(false);
	const {
		status: postFetchStatus,
		receivedData: postFetchReceivedData,
		error: postFetchError,
		isLoading: postFetchIsLoading,
		isRejected: postFetchIsRejected,
		isResolved: postFetchIsResolved,
	} = usePostFetch("api/issues/", requestBody);

	const {
		status: fetchedNewCreatedResourceStatus,
		receivedData: fetchedNewCreatedResource,
		error: fetchedNewCreatedResourceError,
		isLoading: fetchedNewCreatedResourceIsLoading,
		isRejected: fetchedNewCreatedResourceIsRejected,
		isResolved: fetchedNewCreatedResourceIsResolved,
	} = useGetFetch(
		`api/issues/${newIssueId}`,
		null,
		startFetchingNewCreatedResource
	);

	useEffect(() => {
		if (postFetchIsResolved) {
			setNewIssueId(postFetchReceivedData.split("/").pop());
			setStartFetchingNewCreatedResource(true);
		}
	}, [postFetchReceivedData, postFetchIsResolved]);

	useEffect(() => {
		if (fetchedNewCreatedResourceIsResolved) {
			insertCreation(fetchedNewCreatedResource);
		}
	}, [fetchedNewCreatedResource, fetchedNewCreatedResourceIsResolved]);

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
					requestObj["project_id"] = 71;
					requestObj["creator_user_id"] = 3;

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
						<Box
							display="flex"
							flexWrap="wrap"
							flexDirection="row"
							width="100%"
							style={{ gap: "1rem" }}
						>
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
							rows={8}
							maxTextWidth={500}
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
							<Typography>Create sprint</Typography>
						</Button>

						{postFetchIsResolved && (
							<Alert severity="success">
								<Typography>{postFetchReceivedData}</Typography>
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
