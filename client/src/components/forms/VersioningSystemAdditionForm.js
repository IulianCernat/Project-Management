import { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Button, Typography, Box } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { TextFieldWrapper } from "./InputFieldsWrappers";
import { versioningSystemUrlValidShema } from "utils/validationSchemas";
import { usePatchFetch } from "customHooks/useFetch.js";
import PropTypes from "prop-types";

const validationSchema = Yup.object({
	version_control_link: versioningSystemUrlValidShema,
});

VersioningSystemAdditionForm.propTypes = {
	teamId: PropTypes.number.isRequired,
	hideForm: PropTypes.func.isRequired,
	setAddedVersionControlUrl: PropTypes.func.isRequired,
};
export default function VersioningSystemAdditionForm(props) {
	const [requestBody, setRequestBody] = useState(null);
	const { error, isLoading, isRejected, isResolved } = usePatchFetch(
		`api/teams/${props.teamId}`,
		requestBody
	);
	useEffect(() => {
		if (!isResolved) return;
		const addedUrl = requestBody.match(/http.*[^}"]/);
		if (addedUrl) props.setAddedVersionControlUrl(requestBody.match(/http.*[^}"]/)[0]);
		else props.setAddedVersionControlUrl("");

		props.hideForm();
	}, [isResolved]);

	return (
		<>
			<Formik
				initialValues={{
					version_control_link: "",
				}}
				validationSchema={validationSchema}
				onSubmit={async (values) => {
					let requestObj = {};
					requestObj["version_control_link"] = values.version_control_link;
					const stringifiedData = JSON.stringify(requestObj);
					setRequestBody(stringifiedData);
				}}
			>
				<Form>
					<TextFieldWrapper
						variant="outlined"
						required
						fullWidth
						margin="normal"
						id="version_control_link"
						label="Version control public link"
						name="version_control_link"
						disabled={isLoading}
					/>
					<Box display="flex" style={{ gap: "1rem" }} flexWrap="wrap">
						<Box flex="1 1 auto">
							<Button
								size="small"
								type="submit"
								fullWidth
								variant="contained"
								color="primary"
								disabled={isLoading}
							>
								<Typography variant="subtitle2">Add link</Typography>
							</Button>
						</Box>
						<Box flex="1 1 auto">
							<Button
								size="small"
								fullWidth
								variant="contained"
								color="secondary"
								disabled={isLoading}
								onClick={() => props.hideForm()}
							>
								<Typography variant="subtitle2">cancel</Typography>
							</Button>
						</Box>
					</Box>

					{isResolved && (
						<Alert severity="success">
							<Typography>Link added successfuly</Typography>
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
