import { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Button, Typography, Avatar, Box } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { TextFieldWrapper } from "./InputFieldsWrappers";
import { generalInputString } from "utils/validationSchemas";
import { usePostFetch, usePatchFetch } from "customHooks/useFetch.js";
import { SearchField } from "./SearchField";
import PropTypes from "prop-types";

const validationSchema = Yup.object({
	scrum_master: generalInputString,
});

ChangingScrumMasterForm.props = {
	teamId: PropTypes.number.isRequired,
	currentScrumMasterId: PropTypes.number.isRequired,
	setNewScrumMaster: PropTypes.func.isRequired,
	projectId: PropTypes.number.isRequired,
	onSuccess: PropTypes.func.isRequired,
	addNewDeveloper: PropTypes.func.isRequired,
};
export default function ChangingScrumMasterForm(props) {
	const [requestBodyForAddingScrumMaster, setRequestBodyForAddingScrumMaster] = useState(null);
	const [requestBodyForUpdatingCurrentScrumMaster, setRequestBodyForUpdatingCurrentScrumMaster] = useState(null);

	const {
		receivedData: scrumMasterChangingReceivedData,
		error: scrumMasterChangingError,
		isLoading: isLoadingScrumMasterChanging,
		isRejected: isRejectedScrumMasterChanging,
		isResolved: isResolvedScrumMasterChanging,
	} = usePatchFetch(`api/teams_members/${props.currentScrumMasterId}`, requestBodyForUpdatingCurrentScrumMaster);

	const {
		receivedData: scrumMasterAdditionReceivedData,
		error: scrumMasterAdditionError,
		isLoading: isLoadingScrumMasterAddition,
		isRejected: isRejectedScrumMasterAddition,
		isResolved: isResolvedScrumMasterAddition,
	} = usePostFetch("api/teams_members/", isResolvedScrumMasterChanging ? requestBodyForAddingScrumMaster : null);

	useEffect(() => {
		if (!requestBodyForAddingScrumMaster) return;
		setRequestBodyForUpdatingCurrentScrumMaster(
			JSON.stringify({
				user_type: "developer",
				created_at: new Date().toISOString(),
			})
		);
	}, [requestBodyForAddingScrumMaster]);

	useEffect(() => {
		if (isResolvedScrumMasterAddition && isResolvedScrumMasterChanging) {
			props.setNewScrumMaster(scrumMasterAdditionReceivedData[0]);
			props.addNewDeveloper(scrumMasterChangingReceivedData);
			props.onSuccess();
		}
	}, [isResolvedScrumMasterAddition, isResolvedScrumMasterChanging]);

	return (
		<>
			<Formik
				initialValues={{
					scrum_master: "",
				}}
				validationSchema={validationSchema}
				onSubmit={async (values) => {
					let requestObj = { team_members: [] };
					const foundPerson = JSON.parse(values.scrum_master);
					const team_member = {
						created_at: new Date().toISOString(),
						team_id: Number(props.teamId),
						user_id: foundPerson.id,
						user_type: "scrumMaster",
					};
					requestObj.team_members.push(team_member);

					const stringifiedData = JSON.stringify(requestObj);

					setRequestBodyForAddingScrumMaster(stringifiedData);
				}}
			>
				{({ setFieldValue }) => (
					<Form>
						<SearchField
							fetchUrl="api/user_profiles/"
							setSelectedResource={(resource) => {
								setFieldValue("scrum_master", resource);
							}}
							inputNode={
								<TextFieldWrapper
									variant="outlined"
									required
									margin="normal"
									id="searchTerm"
									label="Add scrum master"
									name="searchTerm"
								/>
							}
							optionWireFrame={(option) => (
								<Box
									width="100%"
									display="flex"
									alignItems="center"
									justifyContent="space-between"
									px={4}
								>
									<Avatar src={option.avatar_url}>{option.fullName.slice(0, 2)}</Avatar>
									<Typography>{option.fullName}</Typography>
									<Typography>{option.is_part_of_project ? "joined" : null}</Typography>
								</Box>
							)}
							optionLabel="fullName"
							isOptionDisabled={(option) => option.is_part_of_project}
						/>
						<Button
							type="submit"
							fullWidth
							variant="contained"
							color="primary"
							disabled={isLoadingScrumMasterChanging || isLoadingScrumMasterAddition}
						>
							<Typography>Change scrum master</Typography>
						</Button>

						{isResolvedScrumMasterAddition && isResolvedScrumMasterChanging && (
							<Alert severity="success">
								<Typography>Scrum master changed</Typography>
							</Alert>
						)}
						{(isRejectedScrumMasterAddition && (
							<Alert severity="error">
								<Typography>{scrumMasterAdditionError}</Typography>
							</Alert>
						)) ||
							(isRejectedScrumMasterChanging && (
								<Alert severity="error">
									<Typography>{scrumMasterChangingError}</Typography>
								</Alert>
							))}
					</Form>
				)}
			</Formik>
		</>
	);
}
