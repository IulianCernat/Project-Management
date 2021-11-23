import http from "http";
import { WebSocketServer } from "ws";
import { v4 as uuidv4 } from "uuid";

const PORT = process.env.PORT || 3001;
const HOST = "localhost";
const roomsWithSameBoard = {};

class ValidationError extends Error {
	constructor(message) {
		super(message);
		this.name = "ValidationError";
	}
}

const setHeaders = (responseObj, statusCode) => {
	responseObj.writeHead(statusCode, {
		"Content-Type": "application/json",
	});
};

const validateBoardsIdList = (boardIdList) => {
	if (!Array.isArray(boardIdList)) throw new ValidationError("Not an array");

	if (!boardIdList.length) throw new ValidationError("Array is empty");

	boardIdList.forEach((item) => {
		if (!typeof item == "string")
			throw new ValidationError(`Array contains ${item} that is not a string`);
	});
};

const sendTrelloCardUpdateToClients = (trelloCardUpdateObj) => {
	if (trelloCardUpdateObj["board_id"] in roomsWithSameBoard) {
		const clientPayload = JSON.stringify(trelloCardUpdateObj);
		for (const [sessionKey, websocket] of Object.entries(
			roomsWithSameBoard[trelloCardUpdateObj["board_id"]]
		)) {
			websocket.send(clientPayload);
		}
	}
};
const getReqData = (req) => {
	return new Promise((resolve, reject) => {
		try {
			let body = "";

			req.on("data", (chunk) => {
				body += chunk.toString();
			});

			req.on("end", () => {
				resolve(JSON.parse(body));
			});
		} catch (error) {
			reject(error);
		}
	});
};

const server = http.createServer(async (req, res) => {
	if (req.url !== "/updatesFeeder") {
		setHeaders(res, 404);
		res.end(JSON.stringify({ message: "Route not found" }));
		return;
	}

	if (req.method !== "POST") {
		setHeaders(res, 405);
		res.end(JSON.stringify({ message: "Method not allowed" }));
		return;
	}

	try {
		setHeaders(res, 200);
		res.end(JSON.stringify({ message: "Data was posted, congrats" }));
		const parsedObj = await getReqData(req);
		sendTrelloCardUpdateToClients(parsedObj);
	} catch (e) {
		console.log(e);
		setHeaders(res, 500);
		res.end({ message: "Something went wrong" });
	}
});

server.listen({ host: HOST, port: PORT }, () => {
	console.log(`server started on ${HOST} and port ${PORT}`);
});

const websocketServer = new WebSocketServer({ server });
websocketServer.on("connection", (ws) => {
	const sessionId = uuidv4();
	const joinRoom = (boardIdList) => {
		validateBoardsIdList(boardIdList);
		for (const boardId of boardIdList) {
			if (!roomsWithSameBoard.hasOwnProperty(boardId)) {
				roomsWithSameBoard[boardId] = {};
				roomsWithSameBoard[boardId][sessionId] = ws;
			} else roomsWithSameBoard[boardId][sessionId] = ws;
		}
	};
	const leaveRoom = (sessionId) => {
		Object.entries(roomsWithSameBoard).forEach((roomKeyValuePair) => {
			if (sessionId in roomKeyValuePair[1]) {
				roomKeyValuePair[1]["sessionId"].close();
				delete roomKeyValuePair[1]["sessionId"];
				if (!roomKeyValuePair[1].keys().length) delete roomsWithSameBoard[boardId];
			}
		});
	};
	ws.on("message", (data) => {
		try {
			const dataAsString = data.toString();
			const clientMessage = JSON.parse(dataAsString);
			switch (clientMessage.action) {
				case "leave": {
					leaveRoom(clientMessage.sessionId);
					break;
				}
				case "join": {
					joinRoom(clientMessage.boardIdList);
					ws.send(JSON.stringify({ sessionId }));
					break;
				}
				default:
					break;
			}
		} catch (err) {
			const errorMesage = { error: err.message };
			console.error(err);
			ws.send(JSON.stringify(errorMesage));
		}
	});
	ws.on("close", () => {
		for (var room in roomsWithSameBoard)
			if (roomsWithSameBoard.hasOwnProperty(room)) delete roomsWithSameBoard[room];
	});
});
