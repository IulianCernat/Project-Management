import { useRef, useEffect } from "react";
import Iframe from "react-iframe";
import {
	Box,
	Avatar,
	LinearProgress,
	Paper,
	Typography,
	Chip,
	Divider,
	Button,
	Hidden,
} from "@material-ui/core";
import { useGetFetch } from "customHooks/useFetch";
import { Alert } from "@material-ui/lab";
import TrelloBoardAdditionForm from "components/forms/TrelloBoardAdditionForm";
import { useState } from "react";
import { set } from "lodash";

function BoardCard(props) {
	return (
		<Paper elevation={3}>
			<Box p={1}>
				<Box mb={1}>
					<Typography>{props.name}</Typography>
				</Box>
				<Divider />
				<Box p={2} display="flex" style={{ gap: "2px" }}>
					{props.members.length
						? props.members.map((item) => (
								<Chip
									key={item.id}
									label={item.fullName}
									avatar={
										<Avatar
											alt={item.fullName}
											src={item.avatarUrl + "/original.png"}
										/>
									}
								/>
						  ))
						: null}
				</Box>
			</Box>
		</Paper>
	);
}
function BoardList(props) {
	return (
		<Paper>
			<Box
				p={2}
				display="flex"
				flexDirection="column"
				flexWrap="nowrap"
				style={{ gap: "1rem", width: "40ch" }}
			>
				<Typography variant="h6">{props.name}</Typography>

				{props.boardCards.map((item) => (
					<BoardCard key={item.id} {...item} />
				))}
			</Box>
		</Paper>
	);
}

export default function Board(props) {
	const [startTrelloFetching, setStartTrelloFetching] = useState(false);
	const [boardId, setBoardId] = useState(props.boardId);
	const [hideBoardAdditionform, setHideBoardAdditionform] = useState(true);
	const getCardsparameters = useRef({
		cards: "all",
		members: true,
		member_field: "fullName,initials,avatarUrl",
		fields: "name,members,idList",
		key: process.env.REACT_APP_TRELLO_KEY,
	});
	const {
		status: getCardsStatus,
		receivedData: getCardsReceivedData,
		error: getCardsError,
		isLoading: isLoadingGetCards,
		isResolved: isResolvedGetCards,
		isRejected: isRejectedGetCards,
	} = useGetFetch(
		`https://api.trello.com/1/boards/${boardId}/cards`,
		getCardsparameters.current,
		startTrelloFetching,
		true
	);
	const getBoardListparameters = useRef({
		lists: "all",
		members: true,
		member_field: "fullName,initials,avatarUrl",
		fields: "name,members",
		key: process.env.REACT_APP_TRELLO_KEY,
	});
	const {
		status: getListssStatus,
		receivedData: getListsReceivedData,
		error: getListsError,
		isLoading: isLoadingGetLists,
		isResolved: isResolvedGetLists,
		isRejected: isRejectedGetLists,
	} = useGetFetch(
		`https://api.trello.com/1/boards/${boardId}/lists`,
		getBoardListparameters.current,
		startTrelloFetching,
		true
	);
	useEffect(() => {
		if (props.boardId) setStartTrelloFetching(true);
	}, [props.boardId]);

	useEffect(() => {
		if (Boolean(boardId)) {
			setHideBoardAdditionform(true);
			setStartTrelloFetching(true);
		}
	}, [boardId]);

	useEffect(() => {
		if (startTrelloFetching) setStartTrelloFetching(false);
	}, [startTrelloFetching]);

	const handleFormAdditionClick = () => {
		setHideBoardAdditionform((prev) => !prev);
	};
	console.log(hideBoardAdditionform);
	return (
		<>
			{hideBoardAdditionform ? (
				<Button
					variant="contained"
					color="primary"
					onClick={handleFormAdditionClick}
				>
					Link your public trello board
				</Button>
			) : (
				<Box width="50ch">
					<TrelloBoardAdditionForm
						teamId={props.teamId}
						setAddedBoardId={setBoardId}
						hideForm={handleFormAdditionClick}
					/>
				</Box>
			)}

			{isRejectedGetCards && !props.boardId ? (
				<Box my={2}>
					<Alert severity="error">
						<Typography>Couldnt't load trello board</Typography>
					</Alert>
				</Box>
			) : null}
			{isLoadingGetCards || isLoadingGetLists ? (
				<LinearProgress style={{ width: "100%" }} />
			) : null}
			{isResolvedGetCards && isResolvedGetLists ? (
				<Box
					mt={4}
					pb={"6rem"}
					display="flex"
					flexWrap="nowrap"
					style={{ gap: "1rem", width: "100%", overflowX: "auto" }}
				>
					{getListsReceivedData.map((boardListItem) => {
						const boardCards = getCardsReceivedData.filter(
							(cardItem) => cardItem.idList === boardListItem.id
						);
						return (
							<BoardList
								key={boardListItem.id}
								boardCards={boardCards}
								name={boardListItem.name}
							/>
						);
					})}
				</Box>
			) : null}
		</>
	);
}
