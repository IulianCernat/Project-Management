import { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Button, Typography, Box } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { TextFieldWrapper, DatetimePickerWrapper, TextFieldSelectWrapper } from "./InputFieldsWrappers";
import {
	sprintGoalValidSchema,
	sprintNameValidSchema,
	sprintDurationValidSchema,
	maxSprintGoalLen,
} from "utils/validationSchemas";
import { usePatchFetch, usePostFetch } from "customHooks/useFetch.js";
import { useRouteMatch, useHistory } from "react-router-dom";
import { useAuth } from "contexts/AuthContext";

import PropTypes from "prop-types";

const validationSchema = Yup.object({
	goal: sprintGoalValidSchema,
	name: sprintNameValidSchema,
	duration: sprintDurationValidSchema,
});

const sprintDurationOptions = (function () {
	let options = [];
	const priorities = ["1", "2", "3", "4"];
	priorities.forEach((item) => {
		options.push({
			value: item,
			label: `${item} weeks`,
		});
	});
	return options;
})();

CreateSprintForm.propTypes = {
	performSprintUpdate: PropTypes.bool,
	updateSprintWithNewSprint: PropTypes.func,
	sprintUpdateData: PropTypes.object,
	projectId: PropTypes.number.isRequired,
	issuesIds: PropTypes.array.isRequired,
};
export default function CreateSprintForm(props) {
	const { additionalUserInfo } = useAuth();
	let match = useRouteMatch();
	let history = useHistory();
	const [requestBodyForPost, setRequestBodyForPost] = useState(null);
	const [requestBodyForPatch, setRequestBodyForPatch] = useState(null);
	const defaultDurationOption = "2";

	const {
		error: postFetchError,
		isLoading: postFetchIsLoading,
		isRejected: postFetchIsRejected,
		isResolved: postFetchIsResolved,
	} = usePostFetch("api/sprints/", requestBodyForPost);

	const sprintUpdateStatus = usePatchFetch(`api/sprints/${props.sprintUpdateData?.id}`, requestBodyForPatch);

	const defaultStartDate = new Date();
	defaultStartDate.setHours(defaultStartDate.getHours() + 2);

	const getNewEndDateAccordingToStartDate = (newStartDate, nrWeeks) => {
		const newEndDate = new Date(newStartDate.getTime());
		newEndDate.setHours(newEndDate.getHours() + 168 * Number(nrWeeks));
		return newEndDate;
	};

	const defaultEndDate = getNewEndDateAccordingToStartDate(defaultStartDate, defaultDurationOption);

	useEffect(() => {
		if (postFetchIsResolved) history.push(`${match.url.replace("backlog", "sprints")}`);
		/* eslint-disable */
	}, [postFetchIsResolved]);

	useEffect(() => {
		if (sprintUpdateStatus.isResolved) {
			props.updateSprintWithNewSprint(sprintUpdateStatus.receivedData);
		}
	}, [sprintUpdateStatus]);

	return (
		<>
			<Formik
				validationSchema={validationSchema}
				initialValues={{
					name: props.performSprintUpdate ? props.sprintUpdateData.name : "",
					goal: props.performSprintUpdate ? props.sprintUpdateData.goal : "",
					duration: props.performSprintUpdate ? props.sprintUpdateData.duration : defaultDurationOption,
					start_date: props.performSprintUpdate
						? new Date(props.sprintUpdateData.start_date)
						: defaultStartDate,
					end_date: props.performSprintUpdate ? new Date(props.sprintUpdateData.end_date) : defaultEndDate,
				}}
				onSubmit={async (values) => {
					if (props.performSprintUpdate) {
						setRequestBodyForPatch(JSON.stringify(values));
						return;
					}
					let requestObj = {};
					requestObj["name"] = values.name;
					requestObj["duration"] = values.duration;
					requestObj["start_date"] = values.start_date.toISOString();
					requestObj["end_date"] = values.end_date.toISOString();
					requestObj["goal"] = values.goal;
					requestObj["created_at"] = new Date().toISOString();
					requestObj["project_id"] = props.projectId;
					requestObj["user_creator_id"] = additionalUserInfo.id;
					requestObj["issues_ids"] = props.issuesIds;
					const stringifiedData = JSON.stringify(requestObj);

					setRequestBodyForPost(stringifiedData);
				}}
			>
				{({ setFieldValue, values }) => (
					<Form>
						<TextFieldWrapper
							defaultValue={props.performSprintUpdate ? props.sprintUpdateData.name : ""}
							multiline
							variant="outlined"
							required
							fullWidth
							margin="normal"
							id="name"
							label="Sprint name"
							name="name"
							disabled={postFetchIsLoading || sprintUpdateStatus.isLoading}
						/>
						<Box mt={2} display="flex" flexWrap="wrap" alignItems="center" style={{ gap: "1rem" }}>
							<DatetimePickerWrapper
								id="startDate"
								inputVariant="outlined"
								label="Start date"
								name="start_date"
								runChangeEffect={(newDateValue) => {
									setFieldValue("start_date", newDateValue);
									setFieldValue(
										"end_date",
										getNewEndDateAccordingToStartDate(newDateValue, values.duration)
									);
								}}
							/>
							<Box flex="1 1 auto">
								<TextFieldSelectWrapper
									defaultValue={props.performSprintUpdate ? props.sprintUpdateData.duration : ""}
									multiline
									fullWidth
									variant="outlined"
									id="duration"
									label="Select duration"
									name="duration"
									menuOptions={sprintDurationOptions}
									disabled={postFetchIsLoading || sprintUpdateStatus.isLoading}
									runChangeEffect={(newDuration) => {
										setFieldValue("duration", newDuration);

										setFieldValue(
											"end_date",
											getNewEndDateAccordingToStartDate(values.start_date, newDuration)
										);
									}}
								/>
							</Box>

							<DatetimePickerWrapper
								id="endDate"
								inputVariant="outlined"
								label="End date"
								name="end_date"
								disabled
							/>
						</Box>
						<TextFieldWrapper
							defaultValue={props.performSprintUpdate ? props.sprintUpdateData.goal : ""}
							multiline
							variant="outlined"
							fullWidth
							rows={20}
							maxTextWidth={maxSprintGoalLen}
							margin="normal"
							id="goal"
							label="Sprint goal"
							name="goal"
							disabled={postFetchIsLoading || sprintUpdateStatus.isLoading}
						/>
						<Button
							type="submit"
							fullWidth
							variant="contained"
							color="primary"
							disabled={postFetchIsLoading || sprintUpdateStatus.isLoading}
						>
							<Typography>{props.performSprintUpdate ? "Update sprint" : "Create sprint"}</Typography>
						</Button>
						{postFetchIsResolved ? (
							<Alert severity="success">
								<Typography>Sprint Created</Typography>
							</Alert>
						) : null}
						{postFetchIsRejected ? (
							<Alert severity="error">
								<Typography>{postFetchError}</Typography>
							</Alert>
						) : null}
						{sprintUpdateStatus.isResolved ? (
							<Alert severity="success">
								<Typography>Sprint Updated</Typography>
							</Alert>
						) : null}
						{sprintUpdateStatus.isRejected ? (
							<Alert severity="error">
								<Typography>{sprintUpdateStatus.error}</Typography>
							</Alert>
						) : null}
					</Form>
				)}
			</Formik>
		</>
	);
}
