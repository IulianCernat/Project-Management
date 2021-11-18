const http = require("http");

const PORT = process.env.PORT || 3001;
const HOST = "localhost";

const setHeaders = (responseObj, statusCode) => {
	responseObj.writeHead(statusCode, {
		"Content-Type": "application/json",
	});
};

function getReqData(req) {
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
}

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
		const parsedObj = await getReqData(req);
		setHeaders(res, 200);
		console.log(parsedObj);
		res.end(JSON.stringify({ message: "Data was posted, congrats" }));
	} catch (e) {
		console.log(e);
		setHeaders(res, 500);
		res.end({ message: "Something went wrong" });
	}
});

server.listen({ host: HOST, port: PORT }, () => {
	console.log(`server started on ${HOST} and port ${PORT}`);
});
