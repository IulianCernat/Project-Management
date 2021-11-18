const http = require("http");

const PORT = process.env.PORT || 3001;
const HOST = "localhost";

const setHeaders = (responseObj, statusCode) => {
	responseObj.writeHead(statusCode, {
		"Content-Type": "application/json",
	});
};

const processPOSTRequest = async (req) => {
	const dataChunks = [];
	for await (const chunk of req) dataChunks.push(chunk);

	const data = Buffer.concat(dataChunks).toString();
	const parsedObj = JSON.parse(data);
	return parsedObj;
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
	setHeaders(res, 200);
	const parsedObj = await processPOSTRequest(req);
	console.log(parsedObj);
	res.end(JSON.stringify({ message: "Data was posted, congrats" }));
});

server.listen({ host: HOST, port: PORT }, () => {
	console.log(`server started on ${HOST} and port ${PORT}`);
});
