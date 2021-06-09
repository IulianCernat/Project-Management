import { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Button, Typography, Box } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { TextFieldWrapper } from "./InputFieldsWrappers";
import { trelloBoardUrlValidSchema } from "../../utils/validationSchemas";
import { usePatchFetch } from "../../customHooks/useFetch.js";
import PropTypes from "prop-types";

const validationSchema = Yup.object({
	trello_board_url: trelloBoardUrlValidSchema,
});

TrelloBoardAdditionForm.propTypes = {
	teamId: PropTypes.number.isRequired,
	setTrelloBoardAdditionSuccess: PropTypes.func.isRequired,
	hideForm: PropTypes.func.isRequired,
	setAddedBoardId: PropTypes.func.isRequired,
};
export default function TrelloBoardAdditionForm(props) {
	const [requestBody, setRequestBody] = useState(null);
	const { status, receivedData, error, isLoading, isRejected, isResolved } =
		usePatchFetch(`api/teams/${props.teamId}`, requestBody);
	useEffect(() => {
		if (isResolved) {
			let addedBoardId = requestBody.split(":").pop();
			addedBoardId = addedBoardId.slice(1, -2).trim();
			props.setAddedBoardId(addedBoardId);
		}
	}, [isResolved]);
	return (
		<>
			<Formik
				initialValues={{
					trello_board_url: "",
				}}
				validationSchema={validationSchema}
				onSubmit={async (values) => {
					let requestObj = {};
					requestObj["trello_board_id"] = values.trello_board_url
						.split("/")
						.pop();
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
						id="trello_board_url"
						label="Trello board link"
						name="trello_board_url"
						disabled={isLoading}
					/>
					<Box display="flex" style={{ gap: "1rem" }}>
						<Button
							type="submit"
							fullWidth
							variant="contained"
							color="primary"
							disabled={isLoading}
						>
							<Typography>Add board</Typography>
						</Button>

						<Button
							fullWidth
							variant="contained"
							color="secondary"
							disabled={isLoading}
							onClick={() => props.hideForm()}
						>
							<Typography>cancel</Typography>
						</Button>
					</Box>

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
