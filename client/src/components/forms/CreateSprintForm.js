import { useState, useEffect, useContext } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Button, Typography, makeStyles } from "@material-ui/core";

import Alert from "@material-ui/lab/Alert";
import {
	TextFieldWrapper,
	DatetimePickerWrapper,
	TextFieldSelectWrapper,
} from "./InputFieldsWrappers";
import {
	sprintGoalValidSchema,
	sprintNameValidSchema,
	sprintDurationValidSchema,
} from "../../utils/validationSchemas";
import { usePostFetch } from "../../customHooks/useFetch.js";
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
	projectId: PropTypes.number.isRequired,
};
export default function CreateSprintForm(props) {
	const { additionalUserInfo } = useAuth();
	let match = useRouteMatch();
	let history = useHistory();
	const [requestBody, setRequestBody] = useState(null);
	const defaultDurationOption = "2";
	const {
		status: postFetchStatus,
		receivedData: postFetchReceivedData,
		error: postFetchError,
		isLoading: postFetchIsLoading,
		isRejected: postFetchIsRejected,
		isResolved: postFetchIsResolved,
	} = usePostFetch("api/sprints/", requestBody);

	const defaultStartDate = new Date();
	defaultStartDate.setHours(defaultStartDate.getHours() + 2);

	const getNewEndDateAccordingToStartDate = (newStartDate, nrWeeks) => {
		const newEndDate = new Date(newStartDate.getTime());
		newEndDate.setHours(newEndDate.getHours() + 168 * Number(nrWeeks));
		return newEndDate;
	};

	const defaultEndDate = getNewEndDateAccordingToStartDate(
		defaultStartDate,
		defaultDurationOption
	);

	useEffect(() => {
		if (postFetchIsResolved)
			history.push(`${match.url.replace("backlog", "sprints")}`);
	}, [postFetchIsResolved]);

	return (
		<>
			<Formik
				validationSchema={validationSchema}
				initialValues={{
					name: "",
					goal: "",
					duration: defaultDurationOption,
					start_date: defaultStartDate,
					end_date: defaultEndDate,
				}}
				onSubmit={async (values) => {
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

					setRequestBody(stringifiedData);
				}}
			>
				{({ setFieldValue, values }) => (
					<Form>
						<TextFieldWrapper
							variant="outlined"
							required
							fullWidth
							margin="normal"
							id="name"
							label="Sprint name"
							name="name"
							disabled={postFetchIsLoading}
						/>
						<DatetimePickerWrapper
							id="startDate"
							inputVariant="outlined"
							label="Start date"
							name="start_date"
							runChangeEffect={(newDateValue) => {
								setFieldValue("start_date", newDateValue);
								setFieldValue(
									"end_date",
									getNewEndDateAccordingToStartDate(
										newDateValue,
										values.duration
									)
								);
							}}
						/>
						<TextFieldSelectWrapper
							fullWidth
							variant="outlined"
							margin="normal"
							id="duration"
							label="Select duration"
							name="duration"
							menuOptions={sprintDurationOptions}
							disabled={postFetchIsLoading}
							runChangeEffect={(newDuration) => {
								setFieldValue("duration", newDuration);

								setFieldValue(
									"end_date",
									getNewEndDateAccordingToStartDate(
										values.start_date,
										newDuration
									)
								);
							}}
						/>

						<DatetimePickerWrapper
							id="endDate"
							inputVariant="outlined"
							label="End date"
							name="end_date"
							disabled
						/>
						<TextFieldWrapper
							multiline
							variant="outlined"
							fullWidth
							rows={8}
							maxTextWidth={500}
							margin="normal"
							id="goal"
							label="Sprint goal"
							name="goal"
							disabled={postFetchIsLoading}
						/>
						<Button
							type="submit"
							fullWidth
							variant="contained"
							color="primary"
							disabled={postFetchIsLoading}
						>
							<Typography>Create team</Typography>
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