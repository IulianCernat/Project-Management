import { useState, useContext } from "react";
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
import { TextFieldWrapper } from "./InputFieldsWrappers";
import {
	issueDescriptionValidSchema,
	issuePriorityValidSchema,
	issueTitleValidSchema,
	issueTypeValidSchema,
} from "../../utils/validationSchemas";
import { usePostFetch } from "../../customHooks/useFetch.js";

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

const issueTypeOptions = [
	{
		value: "task",
		label: "task",
	},
	{
		value: "story",
		label: "story",
	},
	{
		value: "bug",
		label: "bug",
	},
];

export default function TeamCreationForm() {
	const [requestBody, setRequestBody] = useState(null);
	const [priorityOption, setPriorityOption] = useState("1");
	const [issueTypeOption, setIssueTypeOption] = useState("story");

	const { status, receivedData, error, isLoading, isRejected, isResolved } =
		usePostFetch("api/issues/", requestBody);

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
					console.log(values.scrum_master);
					let requestObj = {};
					requestObj["title"] = values.title;
					requestObj["description"] = values.description;
					requestObj["created_at"] = new Date().toISOString();
					requestObj["type"] = values.type;
					requestObj["priority"] = values.priority;
					requestObj["project_id"] = 71;
					requestObj["creator_user_id"] = 3;

					const stringifiedData = JSON.stringify(requestObj);
					console.log(stringifiedData);

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
							disabled={isLoading}
						/>

						<TextFieldWrapper
							multiline
							variant="outlined"
							required
							fullWidth
							rows={8}
							maxTextWidth={500}
							margin="normal"
							id="description"
							label="Description"
							name="description"
							disabled={isLoading}
						/>
						<Box
							display="flex"
							flexWrap="wrap"
							flexDirection="row"
							width="100%"
							style={{ gap: "1rem" }}
						>
							<Box flex="1 1 auto">
								<TextFieldWrapper
									onChange={(event) => {
										setIssueTypeOption(event.target.value);
									}}
									fullWidth
									variant="outlined"
									required
									select
									margin="normal"
									id="type"
									label="Select type"
									name="type"
									value={issueTypeOption}
									disabled={isLoading}
								>
									{issueTypeOptions.map((option) => (
										<MenuItem key={option.value} value={option.value}>
											{option.label}
										</MenuItem>
									))}
								</TextFieldWrapper>
							</Box>
							<Box flex="1 0 auto">
								<TextFieldWrapper
									onChange={(event) => {
										setPriorityOption(event.target.value);
									}}
									fullWidth
									variant="outlined"
									required
									select
									margin="normal"
									id="priority"
									label="Select priority"
									name="priority"
									value={priorityOption}
									disabled={isLoading}
								>
									{["1", "2", "3", "4", "5"].map((option) => (
										<MenuItem key={option} value={option}>
											{option}
										</MenuItem>
									))}
								</TextFieldWrapper>
							</Box>
						</Box>

						<Button
							type="submit"
							fullWidth
							variant="contained"
							color="primary"
							disabled={isLoading}
						>
							<Typography>Create team</Typography>
						</Button>

						{isResolved && (
							<Alert severity="success">
								<Typography>{receivedData}</Typography>
							</Alert>
						)}
						{isRejected && (
							<Alert severity="error">
								<Typography>{error}</Typography>
							</Alert>
						)}
					</Form>
				)}
			</Formik>
		</>
	);
}
