import { useRef, useEffect } from "react";
import {
	Box,
	Avatar,
	LinearProgress,
	Paper,
	Typography,
	Chip,
	Divider,
	Button,
} from "@material-ui/core";
import { useGetFetch } from "customHooks/useFetch";
import { Alert } from "@material-ui/lab";
import TrelloBoardAdditionForm from "components/forms/TrelloBoardAdditionForm";
import { useState } from "react";
import PropTypes from "prop-types";
const UIRestrictionForRoles = ["developer", "productOwner"];

BoardCard.propTypes = {
	card: PropTypes.exact({
		id: PropTypes.string.isRequired,
		name: PropTypes.string.isRequired,
		closed: PropTypes.bool.isRequired,
		due: PropTypes.string.isRequired,
		dueComplete: PropTypes.bool.isRequired,
		labels: PropTypes.arrayOf(
			PropTypes.exact({
				id: PropTypes.string.isRequired,
				name: PropTypes.string.isRequired,
			})
		).isRequired,
		members_info: PropTypes.arrayOf(
			PropTypes.exact({
				id: PropTypes.string.isRequired,
				fullName: PropTypes.string.isRequired,
				username: PropTypes.string.isRequired,
			}).isRequired
		),
	}),
};
function BoardCard({ card }) {
	return (
		<Paper elevation={3}>
			<Box p={1}>
				<Box mb={1}>
					<Typography>{card.name}</Typography>
				</Box>
				<Divider />
				<Box p={2} display="flex" style={{ gap: "2px" }}>
					{card.members_info.length
						? card.members_info.map((item) => (
								<Chip key={item.id} label={item.fullName} />
						  ))
						: null}
				</Box>
			</Box>
		</Paper>
	);
}

BoardList.propTypes = {
	id: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	cards: PropTypes.arrayOf(PropTypes.object).isRequired,
};
function BoardList({ boardList }) {
	return (
		<Box flex="0 0 40ch">
			<Paper>
				<Box p={2} display="flex" flexDirection="column" style={{ gap: "1rem" }}>
					<Typography variant="h6">{boardList.name}</Typography>

					{boardList.cards.map((item) => (
						<BoardCard key={item.id} card={item} />
					))}
				</Box>
			</Paper>
		</Box>
	);
}

Board.propTypes = {
	boardId: PropTypes.string.isRequired,
};
export default function Board(props) {
	const [startFetchingBoardLists, setStartFetchingBoardLists] = useState(false);
	const [trelloToken, seTrelloToken] = useState();
	const [boardId, setBoardId] = useState(props.boardId);
	const [hideBoardAdditionform, setHideBoardAdditionform] = useState(true);
	const getBoardListsParameters = useRef({
		data_arrangement: "board_lists",
	});
	const headers = useRef({
		Authorization: `trello_token=${trelloToken}`,
	});
	const {
		receivedData: getBoardListsReceivedData,
		error: getBoardListsError,
		isLoading: isLoadingGetBoardLists,
		isResolved: isResolvedGetBoardLists,
		isRejected: isRejectedGetBoardLists,
	} = useGetFetch(
		`api/trello/boards/${boardId}`,
		getBoardListsParameters.current,
		startFetchingBoardLists,
		false,
		headers.current
	);

	useEffect(() => {
		if (props.boardId) setStartFetchingBoardLists(true);
	}, [props.boardId]);

	useEffect(() => {
		if (Boolean(boardId)) {
			setHideBoardAdditionform(true);
			setStartFetchingBoardLists(true);
		}
	}, [boardId]);

	useEffect(() => {
		if (startFetchingBoardLists) setStartFetchingBoardLists(false);
	}, [startFetchingBoardLists]);

	useEffect(() => {
		seTrelloToken(localStorage.getItem("trello_token"));
	}, []);

	const handleFormAdditionClick = () => {
		setHideBoardAdditionform((prev) => !prev);
	};

	return (
		<>
			{hideBoardAdditionform ? (
				<Button
					variant="contained"
					color="primary"
					onClick={handleFormAdditionClick}
					disabled={UIRestrictionForRoles.includes(props.currentUserRole)}
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

			{isRejectedGetBoardLists && !props.boardId ? (
				<Box my={2}>
					<Alert severity="error">
						<Typography>Couldnt't load trello board. {getBoardListsError}</Typography>
					</Alert>
				</Box>
			) : null}
			{isLoadingGetBoardLists ? <LinearProgress style={{ width: "100%" }} /> : null}
			{isResolvedGetBoardLists ? (
				<Box
					mt={4}
					pb={"6rem"}
					display="flex"
					flexWrap="nowrap"
					style={{
						gap: "1rem",
						overflowX: "auto",
						cursor: "grab",
					}}
				>
					{getBoardListsReceivedData.lists.map((boardListItem) => {
						return <BoardList key={boardListItem.id} boardList={boardListItem} />;
					})}
				</Box>
			) : null}
		</>
	);
}
