import { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Button, Typography, Avatar, Box } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { TextFieldWrapper } from "./InputFieldsWrappers";
import { generalInputString } from "utils/validationSchemas";
import { usePostFetch } from "customHooks/useFetch.js";
import { SearchField } from "./SearchField";
import PropTypes from "prop-types";

const validationSchema = Yup.object({
	devs: generalInputString,
});

AddingDevsForm.props = {
	teamId: PropTypes.number.isRequired,
	setDevAdditionSuccess: PropTypes.func.isRequired,
	projectId: PropTypes.number.isRequired,
};
export default function AddingDevsForm(props) {
	const [requestBody, setRequestBody] = useState(null);
	const { error, isLoading, isRejected, isResolved } = usePostFetch(
		"api/teams_members/",
		requestBody
	);

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
							partOfProjectId={props.projectId}
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
									style={{ gap: "1rem" }}
									px={4}
								>
									<Box
										display="flex"
										alignItems="center"
										justifyContent="flext-start"
										style={{ gap: "1rem" }}
									>
										<Avatar src={option.avatar_url}>
											{option.fullName.slice(0, 2)}
										</Avatar>
										<Typography>{option.fullName}</Typography>
									</Box>

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
							<Typography>Add developer</Typography>
						</Button>

						{isResolved && (
							<Alert severity="success">
								<Typography>Developer added</Typography>
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
