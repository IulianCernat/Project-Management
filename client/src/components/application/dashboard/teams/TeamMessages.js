import { useState, useRef, useEffect } from "react";
import { Box, Button } from "@material-ui/core";
import { useGetFetch } from "customHooks/useFetch";
import TeamMessageCard from "components/subComponents/TeamMessageCard";
import DialogForm from "components/subComponents/DialogForm";
import TeamMessageCreationForm from "components/forms/CreateTeamMessageForm";
import { ClassNames } from "@emotion/react";

function TeamMessagesComponentList({ teamMessages }) {
	useEffect(() => {
		console.log(teamMessages);
	}, [teamMessages]);

	return (
		<Box>
			{teamMessages.map((message) => (
				<TeamMessageCard key={message.id} body={message.body} />
			))}
		</Box>
	);
}
export default function TeamMessages({ teamId }) {
	const [teamMessages, setTeamMessages] = useState([]);
	const [openTeamMessageDialogForm, setOpenTeamMessageDialogForm] = useState(false);

	const getTeamMessagesParams = useRef({ team_id: teamId });
	const fetchMessageStatusObj = useGetFetch("api/team_messages", getTeamMessagesParams.current);

	const addNewTeamMessage = (newTeamMessage) => {
		setTeamMessages([newTeamMessage, ...teamMessages]);
	};

	useEffect(() => {
		console.log(fetchMessageStatusObj);
		if (fetchMessageStatusObj.isResolved) setTeamMessages(fetchMessageStatusObj.receivedData);
	}, [fetchMessageStatusObj]);

	return (
		<>
			<Button
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
			{teamMessages.length ? <TeamMessagesComponentList teamMessages={teamMessages} /> : null}
		</>
	);
}
