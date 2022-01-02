import { useState, useRef, useEffect } from "react";
import { Box, Button } from "@material-ui/core";
import { useGetFetch, useDeleteFetch } from "customHooks/useFetch";
import TeamMessageCard from "components/subComponents/TeamMessageCard";
import DialogForm from "components/subComponents/DialogForm";
import TeamMessageCreationForm from "components/forms/CreateTeamMessageForm";

const UIRestrictionForRoles = ["developer"];

export default function TeamMessages({ teamId, currentUserTeamRole }) {
	const [teamMessages, setTeamMessages] = useState([]);
	const [openTeamMessageDialogForm, setOpenTeamMessageDialogForm] = useState(false);
	const getTeamMessagesParams = useRef({ team_id: teamId });
	const [messageIdToDelete, setMessageIdToDelete] = useState();
	const [startFetchingMessages, setStartFetchingMessages] = useState(true);
	const fetchMessageStatusObj = useGetFetch(
		"api/team_messages/",
		getTeamMessagesParams.current,
		startFetchingMessages
	);
	const deleteMessageStatusObj = useDeleteFetch(messageIdToDelete ? `api/team_messages/${messageIdToDelete}` : null);
	const addNewTeamMessage = (newTeamMessage) => {
		setTeamMessages([newTeamMessage, ...teamMessages]);
	};

	const handleDeleteMessageClick = (messageId) => {
		setMessageIdToDelete(messageId);
	};

	useEffect(() => {
		if (fetchMessageStatusObj.isResolved) {
			setStartFetchingMessages(false);
			setTeamMessages(fetchMessageStatusObj.receivedData);
		}
	}, [fetchMessageStatusObj]);

	useEffect(() => {
		if (deleteMessageStatusObj.isResolved)
			setTeamMessages((prevTeamMessages) => prevTeamMessages.filter((item) => messageIdToDelete !== item.id));
	}, [deleteMessageStatusObj, messageIdToDelete]);

	return (
		<>
			<Button
				style={{ marginBottom: "10px" }}
				variant="contained"
				color="primary"
				onClick={() => {
					setOpenTeamMessageDialogForm(true);
				}}
			>
				Add message
			</Button>
			<DialogForm
				onClose={() => {
					setOpenTeamMessageDialogForm(false);
				}}
				title="Add new message"
				open={openTeamMessageDialogForm}
			>
				<TeamMessageCreationForm
					teamId={teamId}
					onClose={() => {
						setOpenTeamMessageDialogForm(false);
					}}
					insertCreation={addNewTeamMessage}
				/>
			</DialogForm>
			{teamMessages.length ? (
				<Box display="flex" flexDirection="column" style={{ gap: "20px" }}>
					{teamMessages.map((message) => (
						<TeamMessageCard
							currentUserTeamRole={currentUserTeamRole}
							handleDeleteMessageClick={handleDeleteMessageClick}
							key={message.id}
							body={message.body}
							id={message.id}
						/>
					))}
				</Box>
			) : null}
		</>
	);
}
