const http = require("http");
const wsModule = require("ws");
const clientFirstMessageToWstMockup = { action: "join", boardIdList: ["6174034691149a82dae8fb63"] };
const trelloCardUpdateMockup = {
	trello_card_list_name: "Done",
	board_id: "6174034691149a82dae8fb63",
};
describe("doing post requests", () => {
	test("server accepts post request", (done) => {
		const data = new TextEncoder().encode(
			JSON.stringify({
				todo: "Hello there",
			})
		);
		const options = {
			hostname: "localhost",
			port: 3001,
			path: "/updatesFeeder",
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Content-Length": data.length,
			},
		};

		const req = http.request(options, (res) => {
			expect(res.statusCode).toBe(200);
			done();
		});
		req.on("error", (error) => {
			done(error);
		});
		req.write(data);
		req.end();
	});
});

describe("testing web socket connection", () => {
	let ws;
	beforeEach(() => {
		ws = new wsModule.WebSocket("ws://localhost:3001/updatesFeeder");
	});
	afterEach(() => {
		ws.close();
	});

	test("server accepts websocket connection", (done) => {
		ws.on("open", function open() {
			ws.send("something");
		});

		ws.on("message", function message(data) {
			expect(data).toBeTruthy();
			done();
		});
	});

	test.only("client receives trello card update", (done) => {
		let websocketConSessionId;
		// establish a websocket connection
		ws.on("open", () => {
			ws.send(JSON.stringify(clientFirstMessageToWstMockup));
		});

		ws.on("message", (data) => {
			const parsedData = JSON.parse(data);
			if ("sessionId" in parsedData) {
				websocketConSessionId = parsedData.sessionId;
				expect(websocketConSessionId).toBeTruthy();
			} else if ("error" in parsedData) {
				done(parsedData.error);
			} else {
				expect(parsedData).toStrictEqual(trelloCardUpdateMockup);
				done();
			}
		});

		ws.on("error", (error) => {
			done(error);
		});

		// send trello cardUpdata
		const options = {
			hostname: "localhost",
			port: 3001,
			path: "/updatesFeeder",
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		};

		const req = http.request(options, (res) => {
			if (res.statusCode !== 200) done(`POST operation failed: ${res.statusCode}`);
		});
		req.on("error", (error) => {
			done(error);
		});

		req.write(JSON.stringify(trelloCardUpdateMockup));
		req.end();
	});
});
