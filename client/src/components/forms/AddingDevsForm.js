import { useState, useEffect, useContext } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Button, Typography, Avatar, Box } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { TextFieldWrapper } from "./InputFieldsWrappers";
import { generalInputString } from "../../utils/validationSchemas";
import { usePostFetch } from "../../customHooks/useFetch.js";
import { SearchField } from "./SearchField";
import CustomStepper from "../subComponents/CustomStepper";
import PropTypes from "prop-types";
import ProjectContext from "contexts/ProjectContext";

const validationSchema = Yup.object({
	devs: generalInputString,
});

AddingDevsForm.props = {
	teamId: PropTypes.number.isRequired,
	setDevAdditionSuccess: PropTypes.func.isRequired,
};
export default function AddingDevsForm(props) {
	const currentProject = useContext(ProjectContext);
	const [requestBody, setRequestBody] = useState(null);
	const { status, receivedData, error, isLoading, isRejected, isResolved } =
		usePostFetch("api/teams_members/", requestBody);

	useEffect(() => {
		if (isResolved) props.setDevAdditionSuccess(true);
	}, [isResolved]);

	return (
		<>
			<Formik
				initialValues={{
					devs: "",
				}}
				validationSchema={validationSchema}
				onSubmit={async (values) => {
					let requestObj = { team_members: [] };
					for (let foundPerson of JSON.parse(values.devs)) {
						const team_member = {
							created_at: new Date().toISOString(),
							team_id: Number(props.teamId), // why teamId is string instead of number?
							user_id: foundPerson.id,
							user_type: "developer",
						};
						requestObj.team_members.push(team_member);
					}
					const stringifiedData = JSON.stringify(requestObj);

					setRequestBody(stringifiedData);
				}}
			>
				{({ setFieldValue }) => (
					<Form>
						<SearchField
							multiple
							fetchUrl="api/users/"
							partOfProjectId={currentProject.projectId}
							setSelecteResource={(id) => {
								setFieldValue("devs", id);
							}}
							inputNode={
								<TextFieldWrapper
									variant="outlined"
									margin="normal"
									id="devs"
									label="Add developers"
									name="devs"
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
									<Avatar src={option.avatar_url}>
										{option.fullName.slice(0, 2)}
									</Avatar>
									<Typography>{option.fullName}</Typography>
									<Typography>
										{option.is_part_of_project ? "joined" : null}
									</Typography>
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
							disabled={isLoading}
						>
							<Typography>Add new member</Typography>
						</Button>

						{isResolved && (
							<Alert severity="success">
								<Typography>Team member added</Typography>
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
