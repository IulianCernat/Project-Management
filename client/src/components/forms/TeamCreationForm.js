import { useState, useContext, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
	Button,
	Typography,
	Avatar,
	Box,
	Hidden,
	makeStyles,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { TextFieldWrapper } from "./InputFieldsWrappers";
import {
	teamNameValidSchema,
	teamDescriptionValidSchema,
	generalInputString,
	idValidSchema,
} from "../../utils/validationSchemas";
import { usePostFetch } from "../../customHooks/useFetch.js";
import { SearchField } from "./SearchField";
import PropTypes from "prop-types";

const useStyles = makeStyles((theme) => ({
	backdrop: {
		zIndex: theme.zIndex.drawer + 1,
		color: "#fff",
	},
}));

const validationSchema = Yup.object({
	name: teamNameValidSchema,
	description: teamDescriptionValidSchema,
	scrum_master: generalInputString,
});

TeamCreationForm.propTypes = {
	setTeamCreationSuccess: PropTypes.func.isRequired,
	projectId: PropTypes.number.isRequired,
};
export default function TeamCreationForm(props) {
	const [requestBody, setRequestBody] = useState(null);
	const { status, receivedData, error, isLoading, isRejected, isResolved } =
		usePostFetch("api/teams/", requestBody);

	useEffect(() => {
		if (isResolved) props.setTeamCreationSuccess(true);
	}, [isResolved]);

	return (
		<>
			<Formik
				initialValues={{
					name: "",
					description: "",
					scrum_master: "",
				}}
				validationSchema={validationSchema}
				onSubmit={async (values) => {
					let requestObj = {};
					requestObj["name"] = values.name;
					requestObj["description"] = values.description;
					requestObj["created_at"] = new Date().toISOString();
					requestObj["project_id"] = props.projectId;
					requestObj["scrum_master_id"] = JSON.parse(values.scrum_master).id;

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
							id="name"
							label="Name"
							name="name"
							disabled={isLoading}
						/>
						<SearchField
							fetchUrl="api/users/"
							partOfProjectId={props.projectId}
							setSelecteResource={(resource) => {
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
						<Hidden xsUp>
							<TextFieldWrapper
								id="scrum_master"
								label="userId"
								name="scrum_master"
							/>
						</Hidden>

						<TextFieldWrapper
							multiline
							variant="outlined"
							required
							fullWidth
							rows={8}
							maxTextWidth={500}
							margin="normal"
							id="description"
							label="description"
							name="description"
							disabled={isLoading}
						/>

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
