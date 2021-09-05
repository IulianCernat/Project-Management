import { useState, useRef, useEffect } from "react";
import { Formik, Form } from "formik";
import { Button, Typography } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { TextFieldSelectWrapper } from "./InputFieldsWrappers";
import { usePatchFetch, useGetFetch } from "../../customHooks/useFetch.js";
import { useHistory, useRouteMatch } from "react-router-dom";
import PropTypes from "prop-types";

AddingIssuesToExistingSprintForm.propTypes = {
	projectId: PropTypes.number.isRequired,
	issuesIds: PropTypes.array.isRequired,
};
export default function AddingIssuesToExistingSprintForm(props) {
	const [requestBodyForUpdate, setRequestBodyForUpdate] = useState(null);
	const sprintSearchParams = useRef({
		project_id: props.projectId,
		minimal_info: true,
	});
	const [sprintsOptions, setSprintsOptions] = useState([]);
	const history = useHistory();
	let match = useRouteMatch();
	const {
		receivedData: getSprintsReceivedData,
		error: getSprintsError,
		isLoading: isLoadingGetSprints,
		isRejected: isRejectedGetSprints,
		isResolved: isResolvedGetSprints,
	} = useGetFetch("api/sprints/", sprintSearchParams.current);

	const {
		error: updateIssuesError,
		isLoading: isLoadingUpdateIssues,
		isRejected: isRejectedUpdateIssues,
		isResolved: isResolvedUpdateIssues,
	} = usePatchFetch("api/issues/", requestBodyForUpdate);

	useEffect(() => {
		if (isResolvedGetSprints) {
			const sprintsOptionsIntermediateList = [];
			getSprintsReceivedData.forEach((item) => {
				const optionObj = {
					label: item.name,
					value: item.id,
				};
				sprintsOptionsIntermediateList.push(optionObj);
			});
			setSprintsOptions(sprintsOptionsIntermediateList);
		}
	}, [isResolvedGetSprints, getSprintsReceivedData]);

	useEffect(() => {
		if (isResolvedUpdateIssues) history.push(`${match.url.replace("backlog", "sprints")}`);
	}, [isResolvedUpdateIssues]);

	return (
		<>
			<Formik
				initialValues={{
					sprint_id: "",
				}}
				onSubmit={async (values) => {
					let requestObj = { issues: [] };
					for (const issueId of props.issuesIds) {
						requestObj.issues.push({
							id: issueId,
							updates: { sprint_id: values.sprint_id },
						});
					}
					const stringifiedData = JSON.stringify(requestObj);
					setRequestBodyForUpdate(stringifiedData);
				}}
			>
				{({ setFieldValue, values }) => (
					<Form>
						<TextFieldSelectWrapper
							fullWidth
							variant="outlined"
							margin="normal"
							id="sprintName"
							label="Select sprint"
							name="sprintName"
							menuOptions={sprintsOptions}
							disabled={isLoadingGetSprints || isLoadingUpdateIssues}
							runChangeEffect={(sprintId) => {
								setFieldValue("sprint_id", sprintId);
							}}
						/>

						<Button
							type="submit"
							fullWidth
							variant="contained"
							color="primary"
							disabled={isLoadingGetSprints || isLoadingUpdateIssues}
						>
							<Typography>Transfer issues</Typography>
						</Button>
						{isResolvedUpdateIssues && (
							<Alert severity="success">
								<Typography>Issues updated</Typography>
							</Alert>
						)}
						{isRejectedUpdateIssues && (
							<Alert severity="error">
								<Typography>{updateIssuesError}</Typography>
							</Alert>
						)}
					</Form>
				)}
			</Formik>
		</>
	);
}
