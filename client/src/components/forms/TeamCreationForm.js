import { useState, useContext } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Button, Typography, Avatar, Box, makeStyles } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { Autocomplete } from "@material-ui/lab";

import { TextFieldWrapper } from "./InputFieldsWrappers";
import {
	teamNameValidSchema,
	teamDescriptionValidSchema,
	searchTermValidSchema,
} from "../../utils/validationSchemas";
import { usePostFetch } from "../../customHooks/useFetch.js";
import { SearchField, OptionContext } from "./SearchField";

const useStyles = makeStyles((theme) => ({
	backdrop: {
		zIndex: theme.zIndex.drawer + 1,
		color: "#fff",
	},
}));

const validationSchema = Yup.object({
	name: teamNameValidSchema,
	description: teamDescriptionValidSchema,
	searchTerm: searchTermValidSchema,
});

export default function TeamCreationForm() {
	const [requestBody, setRequestBody] = useState(null);
	const { status, receivedData, error, isLoading, isRejected, isResolved } =
		usePostFetch("api/teams/", requestBody);

	return (
		<>
			<Formik
				initialValues={{
					name: "",
					description: "",
					searchTerm: "",
				}}
				validationSchema={validationSchema}
				onSubmit={async (values) => {
					console.log(values);
				}}
			>
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
					<SearchField
						inputNode={
							<TextFieldWrapper
								variant="outlined"
								required
								fullWidth
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
			</Formik>
		</>
	);
}
