import { useState, useEffect, useRef } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Button, Typography, Box } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { TextFieldWrapper } from "./InputFieldsWrappers";
import { trelloBoardNameValidSchema } from "../../utils/validationSchemas";
import { usePostFetch } from "../../customHooks/useFetch.js";
import { useProjectContext } from "../../contexts/ProjectContext.js";
import PropTypes from "prop-types";

const validationSchema = Yup.object({
	name: trelloBoardNameValidSchema,
});

TrelloBoardAdditionForm.propTypes = {
	teamId: PropTypes.number.isRequired,
	hideForm: PropTypes.func.isRequired,
	setAddedBoardId: PropTypes.func.isRequired,
};
export default function TrelloBoardAdditionForm(props) {
	const [requestBody, setRequestBody] = useState(null);
	const { setTrelloBoards, trelloBoards } = useProjectContext();
	const headers = useRef({
		Authorization: `trello_token=${localStorage.getItem("trello_token")}`,
	});
	const { receivedData, error, isLoading, isRejected, isResolved } = usePostFetch(
		`api/trello/boards/`,
		requestBody,
		headers.current
	);
	useEffect(() => {
		if (!isResolved) return;
		const newBoardId = receivedData.split("/").pop();
		setTrelloBoards([...trelloBoards, { trello_board_id: newBoardId, is_added_by_user: true }]);
		props.setAddedBoardId(newBoardId);
		props.hideForm();
	}, [isResolved, receivedData, setTrelloBoards, props, trelloBoards]);

	return (
		<>
			<Formik
				initialValues={{
					name: "",
				}}
				validationSchema={validationSchema}
				onSubmit={async (values) => {
					let requestObj = {};
					requestObj["name"] = values.name;
					requestObj["team_id"] = props.teamId;
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
						id="name"
						label="Trello board name"
						name="name"
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
								<Typography>Add board</Typography>
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
								<Typography>cancel</Typography>
							</Button>
						</Box>
					</Box>

					{isResolved && (
						<Alert severity="success">
							<Typography>New trello board added</Typography>
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
