import { useRef } from "react";
import Iframe from "react-iframe";
import {
	Box,
	Avatar,
	LinearProgress,
	Paper,
	Typography,
	Chip,
	Divider,
} from "@material-ui/core";
import { useGetFetch } from "customHooks/useFetch";
import { Alert } from "@material-ui/lab";

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
// const getCardsReceivedData = [
// 	{
// 		id: "60ae7811428bbf16155f8358",
// 		name: "as a use I want to waash dishes",
// 		idList: "606b13f7979d078b2a46d433",
// 		members: [
// 			{
// 				username: "iuliancernat",
// 				id: "6055ecde5e0cc219b27d4ec9",
// 				activityBlocked: false,
// 				avatarHash: "a1f2b0273db56b4aff065b107cccbd8e",
// 				avatarUrl:
// 					"https://trello-members.s3.amazonaws.com/6055ecde5e0cc219b27d4ec9/a1f2b0273db56b4aff065b107cccbd8e",
// 				fullName: "Iulian Cernat",
// 				initials: "IC",
// 				nonPublic: {},
// 				nonPublicAvailable: true,
// 			},
// 		],
// 	},
// 	{
// 		id: "60b658b16d8e2c1b8be2ef05",
// 		name: "another card",
// 		idList: "606b13f7979d078b2a46d433",
// 		members: [],
// 	},
// ];

// const getListsReceivedData = [
// 	{
// 		id: "606b13f7979d078b2a46d433",
// 		name: "To Do",
// 	},
// 	{
// 		id: "606b13f7979d078b2a46d434",
// 		name: "Doing",
// 	},
// 	{
// 		id: "606b13f7979d078b2a46d435",
// 		name: "Done",
// 	},
// ];

export default function Board() {
	const getCardsparameters = useRef({
		cards: "all",
		members: true,
		member_field: "fullName,initials,avatarUrl",
		fields: "name,members,idList",
		key: process.env.REACT_APP_TRELLO_KEY,
		token: process.env.REACT_APP_TRELLO_TOKEN,
	});
	const {
		status: getCardsStatus,
		receivedData: getCardsReceivedData,
		error: getCardsError,
		isLoading: isLoadingGetCards,
		isResolved: isResolvedGetCards,
		isRejected: isRejectedGetCards,
	} = useGetFetch(
		"https://api.trello.com/1/boards/bk1ki8um/cards",
		getCardsparameters.current,
		true,
		true
	);
	const getBoardListparameters = useRef({
		lists: "all",
		members: true,
		member_field: "fullName,initials,avatarUrl",
		fields: "name,members",
		key: process.env.REACT_APP_TRELLO_KEY,
		token: process.env.REACT_APP_TRELLO_TOKEN,
	});
	const {
		status: getListssStatus,
		receivedData: getListsReceivedData,
		error: getListsError,
		isLoading: isLoadingGetLists,
		isResolved: isResolvedGetLists,
		isRejected: isRejectedGetLists,
	} = useGetFetch(
		"https://api.trello.com/1/boards/bk1ki8um/lists",
		getBoardListparameters.current,
		true,
		true
	);
	return (
		<>
			{isRejectedGetCards ? (
				<Alert severity="error">{getCardsError} </Alert>
			) : null}
			{isLoadingGetCards || isLoadingGetLists ? (
				<LinearProgress style={{ width: "100%" }} />
			) : null}
			{isResolvedGetCards && isResolvedGetLists ? (
				<Box
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
