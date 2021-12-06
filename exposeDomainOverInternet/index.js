const localtunnel = require("localtunnel");

require("dotenv").config();
(async () => {
	const tunnel = await localtunnel({
		port: process.env.PORT,
		subdomain: process.env.SUBDOMAIN,
		local_host: `${process.env.LOCAL_HOST}`,
	});

	console.log(`Accepting connections on ${tunnel.url}`);

	tunnel.on("request", (info) => {
		console.log(`${info.method} ${info.path}`);
	});

	tunnel.on("error", (err) => {
		console.error(err);
	});

	tunnel.on("close", () => {
		console.log("localtunnel connection closed");
	});
})();
